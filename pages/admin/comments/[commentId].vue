<script setup lang="ts">
import { ref, computed } from 'vue';
import { navigateTo, useRoute } from '#app';
import { ArrowRight } from '@element-plus/icons-vue'
import { adminRoutes } from '~/utils/adminRoutes';

definePageMeta({
	name: 'admin-comment-review',
	layout: 'admin',
	ssr: false, // CSR 模式
});

type ReviewStatus = 'systemApproved' | 'systemRejected' | 'manualConfirmed' | 'manualRejected';

interface CommentDetail {
	id: string;
	programTitle: string;
	programId: string;
	industryType: string;
	jobType: string;
	location: string;
	dateRange: string;
	durationText: string;
	reviewer: string;
	reviewerRole: string;
	reviewerAge: number;
	rating: number;
	status: ReviewStatus;
	submittedAt: string;
	updatedAt: string;
	commentText: string;
}

interface ReviewHistoryItem {
	time: string;
	operator: string;
	type: string;
	note: string;
}

const route = useRoute()
const commentIdFromRoute = computed(() => String(route.params.commentId ?? ''))

// demo data for UI build
const detail = ref<CommentDetail>({
	id: 'REV-20230915-0023',
	programTitle: '軟體工程師體驗營',
	programId: 'TW-TPE-2023-0142',
	industryType: '科技業',
	jobType: '工程師',
	location: '台南市',
	dateRange: '2025/9/10 - 2025/9/12',
	durationText: '為期 3 天',
	reviewer: '王小明',
	reviewerRole: '大學生',
	reviewerAge: 23,
	rating: 5,
	status: 'systemApproved',
	submittedAt: '2025-09-15 14:32:45',
	updatedAt: '2025-09-16 09:15:22',
	commentText:
    '這次體驗課程安排緊湊，導師講解清晰，實作環節也很有幫助。建議增加更多與產業顧問的 Q&A 時間。',
})

const statusLabelMap: Record<ReviewStatus, string> = {
	systemApproved: '已通過(系統)',
	systemRejected: '已拒絕(系統)',
	manualConfirmed: '已確認(人工)',
	manualRejected: '已拒絕(人工)',
}

const statusTagTypeMap: Record<ReviewStatus, 'success' | 'danger' | 'info' | 'warning'> = {
	systemApproved: 'success',
	systemRejected: 'danger',
	manualConfirmed: 'info',
	manualRejected: 'danger',
}

const reviewNote = ref('')
const ratingScore = computed(() => `${detail.value.rating.toFixed(1)} / 5.0`)

const reviewResult = ref<'approved' | 'rejected'>('approved')

const submitReview = () => {
	// 先預設成功：直接導回列表，待串接真實 API 後再補齊流程
	navigateTo(adminRoutes.comments())
}

const goToProgram = () => {
	navigateTo(adminRoutes.programDetail(detail.value.programId))
}

// 審核歷史（示意資料，用於 UI 切版）
const reviewHistory = ref<ReviewHistoryItem[]>([
	{
		time: '2025-09-15 15:10:23',
		operator: '王小明（平台）',
		type: '自動審核',
		note: '系統審核狀態為「已拒絕」，等待人工確認。',
	},
	{
		time: '2025-09-16 09:15:22',
		operator: '李主管',
		type: '人工審核',
		note: '確認內容為系統誤判，無不雅、謾罵、攻擊、猥褻等字眼，標記為已通過。',
	},
])

const goBackToList = () => {
	navigateTo(adminRoutes.comments())
}

const approve = () => {
	detail.value.status = 'manualConfirmed'
}

const reject = () => {
	detail.value.status = 'manualRejected'
}
</script>

<template>
	<div class="mx-auto w-full max-w-container-admin space-y-6">
		<!-- BreadCrumb + Title -->
		<section class="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
			<div>
				<h1 class="mt-1 text-2xl font-semibold text-gray-900 md:text-3xl">
					評價詳情
				</h1>
			</div>
			<div class="flex items-center gap-3">
				<el-tag :type="statusTagTypeMap[detail.status]">
					{{ statusLabelMap[detail.status] }}
				</el-tag>
				<el-button
					plain
					@click="goBackToList"
				>
					返回列表
				</el-button>
			</div>
		</section>

		<!-- 基本資訊 -->
		<el-card
			shadow="never"
			class="border border-gray-200"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<span class="font-medium">評價資訊</span>
					<span class="text-xs text-gray-500">ID: {{ detail.id || commentIdFromRoute }}</span>
				</div>
			</template>

			<el-descriptions
				:column="1"
				border
				class="w-full md:!grid md:!grid-cols-3 md:!gap-0"
			>
				<el-descriptions-item label="評價 ID">
					{{ detail.id }}
				</el-descriptions-item>
				<el-descriptions-item label="提交日期">
					{{ detail.submittedAt }}
				</el-descriptions-item>
				<el-descriptions-item label="最後更新">
					{{ detail.updatedAt }}
				</el-descriptions-item>
				<el-descriptions-item label="體驗計畫名稱">
					{{ detail.programTitle }}
				</el-descriptions-item>
				<el-descriptions-item label="體驗計畫ID">
					{{ detail.programId }}
				</el-descriptions-item>
				<el-descriptions-item label="體驗者">
					<div class="flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
							用
						</div>
						<span>{{ detail.reviewer }}</span>
					</div>
				</el-descriptions-item>
			</el-descriptions>

			<el-divider />

			<!-- 評價內容區（頭像/姓名/身分年齡、星等、分數與長文） -->
			<div class="flex items-start gap-3">
				<div class="mt-1 h-10 w-10 shrink-0 rounded-full bg-gray-200" />
				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2 text-gray-800">
						<span class="font-medium">{{ detail.reviewer }}</span>
						<span class="text-gray-500">{{ detail.reviewerRole }} | {{ detail.reviewerAge }}歲</span>
						<span class="text-gray-500">評分：</span>
						<el-rate
							:model-value="detail.rating"
							disabled
							disabled-void-color="#d1d5db"
						/>
						<span class="text-gray-700">{{ ratingScore }}</span>
					</div>
					<p class="mt-3 leading-7 text-gray-800">
						{{ detail.commentText }}
					</p>
				</div>
			</div>
		</el-card>

		<!-- 審核操作 -->
		<el-card
			shadow="never"
			class="border border-gray-200"
		>
			<template #header>
				<span class="font-medium">審核意見</span>
			</template>

			<div class="space-y-5">
				<!-- 審核結果 -->
				<div>
					<div class="mb-2 text-gray-700">
						審核結果
					</div>
					<el-select
						v-model="reviewResult"
						class="w-full"
					>
						<el-option
							label="通過"
							value="approved"
						/>
						<el-option
							label="拒絕"
							value="rejected"
						/>
					</el-select>
				</div>

				<!-- 審核意見 -->
				<div>
					<div class="mb-2 text-gray-700">
						審核意見
					</div>
					<el-input
						v-model="reviewNote"
						type="textarea"
						:rows="6"
						placeholder="請輸入審核意見..."
						class="w-full"
					/>
				</div>

				<div class="flex justify-end">
					<el-button
						type="primary"
						class="!bg-gray-700 !border-gray-700"
						@click="submitReview"
					>
						提交審核
					</el-button>
				</div>
			</div>
		</el-card>

		<!-- 審核歷史 -->
		<el-card
			shadow="never"
			class="border border-gray-200"
		>
			<template #header>
				<span class="font-medium">審核歷史</span>
			</template>

			<!-- 桌面：表格；行動：卡片 -->
			<div class="hidden md:block">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-brand-gray">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								操作時間
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								操作人員
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								操作類型
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								備註
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 bg-white">
						<tr
							v-for="(h, idx) in reviewHistory"
							:key="idx"
							class="odd:bg-white even:bg-gray-50"
						>
							<td class="px-6 py-4 text-gray-900">
								{{ h.time }}
							</td>
							<td class="px-6 py-4 text-gray-900">
								{{ h.operator }}
							</td>
							<td class="px-6 py-4 text-gray-900">
								{{ h.type }}
							</td>
							<td class="px-6 py-4 text-gray-900">
								{{ h.note }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="space-y-3 md:hidden">
				<div
					v-for="(h, idx) in reviewHistory"
					:key="idx"
					class="rounded border border-gray-200 bg-white p-4"
				>
					<div class="text-sm text-gray-500">
						{{ h.time }}
					</div>
					<div class="mt-1 font-medium text-gray-900">
						{{ h.operator }}
					</div>
					<div class="mt-1 text-gray-800">
						{{ h.type }}
					</div>
					<div class="mt-2 text-gray-800">
						{{ h.note }}
					</div>
				</div>
			</div>
		</el-card>

		<!-- 下個任務：體驗資訊摘要 -->
		<el-card
			shadow="never"
			class="border border-gray-200"
		>
			<template #header>
				<span class="font-medium">體驗資訊</span>
			</template>

			<div class="space-y-3">
				<div class="text-xl font-semibold text-gray-900">
					{{ detail.programTitle }}
				</div>

				<el-descriptions
					:column="1"
					border
					class="w-full md:!grid md:!grid-cols-2 md:!gap-0"
				>
					<el-descriptions-item label="體驗計畫 ID">
						{{ detail.programId }}
					</el-descriptions-item>
					<el-descriptions-item label="產業類型">
						{{ detail.industryType }}
					</el-descriptions-item>
					<el-descriptions-item label="職務類型">
						{{ detail.jobType }}
					</el-descriptions-item>
					<el-descriptions-item label="體驗地點">
						{{ detail.location }}
					</el-descriptions-item>
					<el-descriptions-item label="體驗日期">
						{{ detail.dateRange }} {{ detail.durationText }}
					</el-descriptions-item>
				</el-descriptions>

				<div class="pt-2">
					<el-button
						link
						type="primary"
						:icon="ArrowRight"
						@click="goToProgram"
					>
						查看體驗詳情
					</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>
