<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

definePageMeta({
	name: 'user-comments-detail',
	layout: 'user',
});

const route = useRoute();
const commentId = computed(() => String(route.params.commentId ?? ''));

const MAX_LENGTH = 1000;

type ReviewForm = {
	rating: number;
	content: string;
	agree: boolean;
};

const formRef = ref<FormInstance>();
const form = ref<ReviewForm>({
	rating: 0,
	content: '',
	agree: false,
});

const rules: FormRules<ReviewForm> = {
	rating: [
		{ type: 'number', required: true, message: '請給予整體評分', trigger: 'change' },
	],
	content: [
		{ required: true, message: '請輸入評價內容', trigger: ['blur', 'change'] },
		{
			validator: (_r, value: string, callback) => {
				if (typeof value !== 'string') return callback(new Error('內容格式不正確'));
				if (value.length > MAX_LENGTH) return callback(new Error(`字數請在 ${MAX_LENGTH} 字以內`));
				callback();
			},
			trigger: ['blur', 'change'],
		},
	],
	agree: [
		{
			validator: (_r, value: boolean, callback) => {
				if (!value) return callback(new Error('請勾選同意聲明'));
				callback();
			},
			trigger: 'change',
		},
	],
};

const ratingDisplay = computed(() => (form.value.rating || 0).toFixed(1));
const contentCount = computed(() => form.value.content.length);
const canSubmit = computed(() => form.value.rating > 0 && form.value.content.length > 0 && form.value.content.length <= MAX_LENGTH && form.value.agree);

function handleCancel(): void {
	navigateTo({ name: 'user-comments' });
}

async function handleSubmit(): Promise<void> {
	const valid = await formRef.value?.validate().catch(() => false);
	if (!valid) return;

	// 預留：提交 API
	ElMessage.success('已送出評價');
	navigateTo({ name: 'user-comments' });
}

// 假資料：公司與體驗資訊（後續由 API 帶入）
const companyName = '台灣數位科技公司';
const programTitle = '數據分析師體驗計畫';
const periodText = '體驗期間：2025/09/15 - 2025/10/15';
</script>

<!-- up7 填寫評價頁面 -->
<template>
	<section class="mx-auto max-w-container-users px-6 md:px-12 py-8 md:py-10">
		<h2 class="text-2xl md:text-3xl font-bold text-gray-800">
			撰寫體驗評價
		</h2>

		<!-- 體驗資訊卡片 -->
		<el-card class="mt-6">
			<div class="flex flex-col gap-2">
				<div class="text-gray-700 font-semibold">
					{{ companyName }}
				</div>
				<div class="flex items-center justify-between text-gray-600">
					<div>{{ programTitle }}</div>
					<div class="text-sm">
						{{ periodText }}
					</div>
				</div>
			</div>
		</el-card>

		<el-divider class="!my-6" />

		<el-form
			ref="formRef"
			:model="form"
			:rules="rules"
			label-position="top"
		>
			<!-- 整體評分 -->
			<el-form-item
				label="整體評分"
				prop="rating"
			>
				<div class="flex items-center gap-3">
					<el-rate
						v-model="form.rating"
						allow-half
					/>
					<span class="text-gray-600 font-semibold">{{ ratingDisplay }}</span>
				</div>
			</el-form-item>

			<!-- 評論內容 -->
			<el-form-item
				label="評論內容"
				prop="content"
			>
				<div class="w-full">
					<el-input
						v-model="form.content"
						type="textarea"
						:rows="6"
						:maxlength="MAX_LENGTH"
						show-word-limit
						:placeholder="`請分享您的體驗心得，例如：\n你學到什麼？\n你是否覺得這次體驗的哪一個部分是有幫助的？\n你願意推薦這家公司給下一位體驗探索者嗎？為什麼？`"
					/>
					<div class="mt-2 text-sm text-gray-500">
						已輸入 {{ contentCount }} / {{ MAX_LENGTH }}
					</div>
				</div>
			</el-form-item>

			<!-- 同意條款 -->
			<el-form-item prop="agree">
				<el-checkbox v-model="form.agree">
					我同意此評價將於公開顯示在平台上，且確認內容真實無誤
				</el-checkbox>
			</el-form-item>

			<!-- 動作按鈕 -->
			<div class="mt-4 flex justify-end gap-3">
				<el-button @click="handleCancel">
					取消
				</el-button>
				<el-button
					type="primary"
					:disabled="!canSubmit"
					@click="handleSubmit"
				>
					送出
				</el-button>
			</div>
		</el-form>
	</section>
</template>
