<template>
	<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
		<!-- 錯誤圖示 -->
		<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
			<font-awesome-icon
				:icon="['fas', 'exclamation-triangle']"
				class="h-6 w-6 text-red-600"
			/>
		</div>

		<!-- 錯誤標題 -->
		<h3 class="text-lg font-medium text-red-800 mb-2">
			{{ title || '發生錯誤' }}
		</h3>

		<!-- 錯誤訊息 -->
		<p class="text-sm text-red-700 mb-4">
			{{ message || '很抱歉，載入資料時發生問題。' }}
		</p>

		<!-- 下一步行動建議 -->
		<div class="space-y-2">
			<p class="text-xs text-red-600 mb-3">
				建議您嘗試以下步驟：
			</p>

			<div class="flex flex-col sm:flex-row gap-2 justify-center">
				<!-- 重新整理按鈕 -->
				<button
					v-if="showRefresh"
					class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					@click="handleRefresh"
				>
					<font-awesome-icon
						:icon="['fas', 'sync-alt']"
						class="mr-2"
					/>
					重新整理
				</button>

				<!-- 返回按鈕 -->
				<button
					v-if="showBack"
					class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					@click="handleBack"
				>
					<font-awesome-icon
						:icon="['fas', 'arrow-left']"
						class="mr-2"
					/>
					返回列表
				</button>

				<!-- 聯絡客服按鈕 -->
				<button
					v-if="showContact"
					class="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					@click="handleContact"
				>
					<font-awesome-icon
						:icon="['fas', 'envelope']"
						class="mr-2"
					/>
					聯絡客服
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title?: string // 錯誤標題
	message?: string // 錯誤訊息
	showRefresh?: boolean // 是否顯示重新整理按鈕
	showBack?: boolean // 是否顯示返回按鈕
	showContact?: boolean // 是否顯示聯絡客服按鈕
}

interface Emits {
	(e: 'refresh' | 'back' | 'contact'): void // 事件類型
}

const props = withDefaults(defineProps<Props>(), {
	title: '發生錯誤',
	message: '很抱歉，載入資料時發生問題。',
	showRefresh: true,
	showBack: true,
	showContact: true,
});

const emit = defineEmits<Emits>();

const handleRefresh = () => {
	emit('refresh');
};

const handleBack = () => {
	emit('back');
};

const handleContact = () => {
	emit('contact');
};
</script>
