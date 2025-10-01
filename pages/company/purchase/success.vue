<template>
	<div class="space-y-6">
		<CompanyPlanStatusHeader />

		<div class="bg-white p-6 md:p-10 rounded-lg shadow">
			<h2 class="text-xl font-bold mb-6 text-center">
				方案總覽
			</h2>
			<el-steps
				:active="3"
				finish-status="success"
				align-center
				class="mb-10"
			>
				<el-step title="選擇方案" />
				<el-step title="付款方式" />
				<el-step title="完成付款" />
			</el-steps>

			<div class="text-center">
				<div
					v-if="isLoading"
					class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full"
				>
					<el-icon class="w-12 h-12 text-gray-400">
						<Loading />
					</el-icon>
				</div>
				<div
					v-else-if="error"
					class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full"
				>
					<el-icon class="w-12 h-12 text-red-500">
						<Close />
					</el-icon>
				</div>
				<div
					v-else-if="paymentResult?.PaymentStatus === 'Paid'"
					class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full"
				>
					<SharedCheckIcon class="w-12 h-12 text-green-500" />
				</div>
				<div
					v-else
					class="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full"
				>
					<el-icon class="w-12 h-12 text-yellow-500">
						<Warning />
					</el-icon>
				</div>

				<h3 class="mt-4 text-3xl font-bold">
					<span v-if="isLoading">處理中...</span>
					<span v-else-if="error">處理失敗</span>
					<span v-else-if="paymentResult?.PaymentStatus === 'Paid'">付款成功！</span>
					<span v-else>付款處理中</span>
				</h3>
				<p class="mt-2 text-gray-500">
					<span v-if="isLoading">正在確認付款狀態...</span>
					<span v-else-if="error">{{ error }}</span>
					<span v-else-if="paymentResult?.PaymentStatus === 'Paid'">您的方案已成功付款並確認</span>
					<span v-else>付款正在處理中，請稍後再確認</span>
				</p>
			</div>

			<el-divider class="my-8" />

			<div
				v-if="!isLoading && !error && paymentResult"
				class="max-w-2xl mx-auto"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
					<div>
						<p class="text-sm text-gray-500">
							訂單編號
						</p>
						<p class="font-medium text-lg">
							{{ paymentResult.OrderNum }}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">
							付款方式
						</p>
						<p class="font-medium text-lg">
							{{ paymentResult.PaymentMethod === 'CREDIT' ? '信用卡' : paymentResult.PaymentMethod }}
							<span v-if="paymentResult.Card4No"> (末四碼: {{ paymentResult.Card4No }})</span>
						</p>
					</div>
					<div class="md:text-left">
						<p class="text-sm text-gray-500">
							付款狀態
						</p>
						<p
							class="font-bold text-xl"
							:class="{
								'text-green-600': paymentResult.PaymentStatus === 'Paid',
								'text-yellow-600': paymentResult.PaymentStatus === 'Pending',
								'text-red-600': paymentResult.PaymentStatus === 'Failed',
							}"
						>
							{{ paymentResult.PaymentStatus === 'Paid' ? '已付款'
								: paymentResult.PaymentStatus === 'Pending' ? '處理中' : '付款失敗' }}
						</p>
					</div>
				</div>
			</div>

			<!-- 載入中或錯誤狀態的佔位內容 -->
			<div
				v-else
				class="max-w-2xl mx-auto"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
					<div>
						<p class="text-sm text-gray-500">
							訂單編號
						</p>
						<p class="font-medium text-lg">
							{{ isLoading ? '載入中...' : orderNum || '未知' }}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">
							付款方式
						</p>
						<p class="font-medium text-lg">
							{{ isLoading ? '載入中...' : '未知' }}
						</p>
					</div>
					<div class="md:text-left">
						<p class="text-sm text-gray-500">
							付款狀態
						</p>
						<p class="font-bold text-xl">
							{{ isLoading ? '載入中...' : '未知' }}
						</p>
					</div>
				</div>
			</div>

			<div class="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg">
				<h4 class="text-lg font-bold mb-4 text-center">
					方案詳情
				</h4>
				<div class="text-center">
					<p class="text-xl font-medium">
						90 天 體驗人數上限 50 人
					</p>
					<p class="mt-2 text-gray-500">
						2025 年 9 月 10 日 - 2025 年 12 月 9 日
					</p>
				</div>
			</div>

			<div class="mt-8 text-center">
				<el-button @click="goToPlans">
					返回計畫列表
				</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Loading, Close, Warning } from '@element-plus/icons-vue';
import { companyRoutes as r } from '~/utils/companyRoutes';
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';
import { useCompanyPayment } from '~/composables/api/company/useCompanyPayment';
import type { PaymentResultResponse } from '~/types/company/payment';

definePageMeta({
	layout: 'company',
	name: 'company-purchase-success',
});

const router = useRouter();
const route = useRoute();
const planStore = useCompanyPlanStore();
const { getPaymentResult } = useCompanyPayment();

// 付款結果資料
const paymentResult = ref<PaymentResultResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 從 URL 查詢參數取得訂單編號和狀態
const orderNum = computed(() => {
	return route.query.order as string;
});

// 取得藍新金流的 Status 參數
const newebpayStatus = computed(() => {
	return route.query.status as string;
});

// 檢查是否有錯誤狀態
const hasError = computed(() => {
	return !!route.query.error;
});

// 檢查是否為處理中狀態（從藍新金流直接跳轉但未帶訂單號）
const isProcessingStatus = computed(() => {
	return route.query.status === 'processing' && !orderNum.value;
});

// 檢查藍新金流狀態
const isNewebpaySuccess = computed(() => {
	return newebpayStatus.value === 'SUCCESS';
});

// 調試：在 console 顯示所有查詢參數
if (import.meta.client) {
	console.log('[Success 頁面] URL 查詢參數:', {
		order: route.query.order,
		status: route.query.status,
		error: route.query.error,
		allParams: route.query,
	});
}

// 格式化金額顯示
const formatAmount = (amount: number) => {
	return `TWD ${amount.toLocaleString('zh-TW')}`;
};

// 格式化日期顯示
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('zh-TW', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
};

// 取得付款結果
const fetchPaymentResult = async () => {
	console.log('[Success 頁面] 開始處理付款結果');

	// 處理錯誤狀態
	if (hasError.value) {
		const errorType = route.query.error as string;
		console.error('[Success 頁面] 錯誤狀態:', errorType);

		if (errorType === 'invalid_callback') {
			error.value = '付款回調數據格式錯誤';
		}
		else if (errorType === 'processing_error') {
			error.value = '處理付款回調時發生錯誤';
		}
		else {
			error.value = '付款處理失敗';
		}
		isLoading.value = false;
		ElMessage.error(error.value);
		return;
	}

	// 處理處理中狀態（藍新金流回調但未帶訂單號）
	if (isProcessingStatus.value) {
		console.warn('[Success 頁面] 處理中狀態：無訂單號');
		error.value = '正在確認付款狀態，請稍後再查看訂單列表';
		isLoading.value = false;
		ElMessage.warning('付款正在處理中，請稍後在計畫列表查看付款狀態');
		return;
	}

	// 檢查藍新金流狀態（但沒有訂單號的情況）
	if (newebpayStatus.value && !orderNum.value) {
		console.warn('[Success 頁面] 有藍新金流狀態但缺少訂單號:', {
			status: newebpayStatus.value,
			isSuccess: isNewebpaySuccess.value,
		});

		if (isNewebpaySuccess.value) {
			error.value = '付款成功但無法取得訂單資訊，請聯繫客服或查看訂單列表';
			ElMessage.warning(error.value);
		}
		else {
			error.value = `付款狀態：${newebpayStatus.value}，但缺少訂單資訊`;
			ElMessage.error(error.value);
		}
		isLoading.value = false;
		return;
	}

	// 必須有訂單編號才能查詢
	if (!orderNum.value) {
		console.error('[Success 頁面] 缺少訂單編號');
		error.value = '缺少訂單編號';
		isLoading.value = false;
		ElMessage.error('無法取得訂單資訊');
		return;
	}

	console.log('[Success 頁面] 準備查詢訂單:', orderNum.value);

	try {
		const result = await getPaymentResult(orderNum.value);
		paymentResult.value = result;

		// 如果付款成功，標記為已付款
		if (result.PaymentStatus === 'Paid') {
			planStore.markPaid();
			ElMessage.success('付款成功！');
		}
		else if (result.PaymentStatus === 'Pending') {
			ElMessage.info('付款處理中，請稍候');
		}
	}
	catch (err) {
		console.error('取得付款結果錯誤:', err);
		error.value = err instanceof Error ? err.message : '取得付款結果失敗';
		ElMessage.error('無法取得付款結果，請稍後再試');
	}
	finally {
		isLoading.value = false;
	}
};

// 進入成功頁：先讓 Header 顯示骨架，取得資料後再標記為已付款
onMounted(async () => {
	try {
		const minDelay = new Promise(resolve => setTimeout(resolve, 800));
		// 觸發一次取資料，確保 Header 顯示 loading
		await Promise.allSettled([planStore.fetchCurrentPlan(), minDelay]);

		// 取得付款結果
		await fetchPaymentResult();
	}
	catch (err) {
		console.error('頁面初始化錯誤:', err);
		error.value = '頁面初始化失敗';
		isLoading.value = false;
	}
});

function goToPlans() {
	router.push(r.landing());
}
</script>

<style scoped>
:deep(.el-step__title) {
  font-size: 16px;
}
</style>
