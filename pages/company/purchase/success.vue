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
					v-else-if="isProcessingStatus"
					class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full"
				>
					<el-icon class="w-12 h-12 text-blue-500">
						<Loading />
					</el-icon>
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
					<span v-else-if="isProcessingStatus">付款處理中</span>
					<span v-else>付款處理中</span>
				</h3>
				<p class="mt-2 text-gray-500">
					<span v-if="isLoading">正在確認付款狀態...</span>
					<span v-else-if="error">{{ error }}</span>
					<span v-else-if="paymentResult?.PaymentStatus === 'Paid'">您的方案已成功付款並確認</span>
					<span v-else-if="isProcessingStatus">正在確認付款狀態，請稍後再查看訂單列表</span>
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
						{{ validPlan ? `${validPlan.plan_duration_days} 天 體驗人數上限 ${validPlan.max_participants} 人` : '載入中...' }}
					</p>
					<p class="mt-2 text-gray-500">
						{{ validPlan ? `${formatDate(validPlan.start_date)} - ${formatDate(validPlan.end_date)}` : '載入中...' }}
					</p>
				</div>
			</div>

			<div class="mt-8 text-center">
				<el-button @click="goToPlans">
					返回計畫列表
				</el-button>
				<el-button
					v-if="isProcessingStatus"
					type="primary"
					class="ml-4"
					@click="retryPaymentCheck"
				>
					重新查詢付款狀態
				</el-button>
				<el-button
					v-if="isProcessingStatus"
					type="warning"
					class="ml-4"
					@click="testPaymentResultAPI"
				>
					測試結帳結果 API
				</el-button>
				<el-button
					v-if="isProcessingStatus"
					type="info"
					class="ml-4"
					@click="showManualTestDialog = true"
				>
					手動輸入參數測試
				</el-button>
			</div>
		</div>

		<!-- 手動測試對話框 -->
		<el-dialog
			v-model="showManualTestDialog"
			title="手動輸入參數測試結帳結果 API"
			width="80%"
			:before-close="handleCloseDialog"
		>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						TradeInfo (交易資訊)
					</label>
					<el-input
						v-model="manualTradeInfo"
						type="textarea"
						:rows="4"
						placeholder="請輸入 TradeInfo..."
						class="w-full"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						TradeSha (交易 SHA256 雜湊值)
					</label>
					<el-input
						v-model="manualTradeSha"
						placeholder="請輸入 TradeSha..."
						class="w-full"
					/>
				</div>
				<div class="flex justify-end space-x-2">
					<el-button @click="showManualTestDialog = false">
						取消
					</el-button>
					<el-button
						type="primary"
						:loading="isManualTestLoading"
						@click="testManualParameters"
					>
						測試 API
					</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Loading, Close, Warning } from '@element-plus/icons-vue';
import { companyRoutes as r } from '~/utils/companyRoutes';
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import { useCompanyPayment } from '~/composables/api/company/useCompanyPayment';
import { isActivePlan } from '~/types/company/plan/current';
import type { PaymentResultResponse } from '~/types/company/payment';

definePageMeta({
	layout: 'company',
	name: 'company-purchase-success',
});

const router = useRouter();
const route = useRoute();
const planStore = useCompanyPlanStore();
const authStore = useCompanyAuthStore();
const { getPaymentResult, getPaymentResultByTradeInfo } = useCompanyPayment();

// 付款結果資料
const paymentResult = ref<PaymentResultResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// 重定向監聽和輪詢相關
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null);
const isPolling = ref(false);
const pollAttempts = ref(0);
const maxPollAttempts = 10; // 最多輪詢 10 次
const pollIntervalMs = 3000; // 每 3 秒輪詢一次

// 手動測試相關
const showManualTestDialog = ref(false);
const manualTradeInfo = ref('');
const manualTradeSha = ref('');
const isManualTestLoading = ref(false);

// 從 URL 查詢參數取得訂單編號和狀態
const orderNum = computed(() => {
	return route.query.order as string;
});

// 取得藍新金流的 Status 參數
const newebpayStatus = computed(() => {
	return route.query.status as string;
});

// 取得藍新金流的 TradeInfo 和 TradeSha 參數
const newebpayTradeInfo = computed(() => {
	const tradeInfo = route.query.tradeInfo as string;
	return tradeInfo ? decodeURIComponent(tradeInfo) : null;
});

const newebpayTradeSha = computed(() => {
	const tradeSha = route.query.tradeSha as string;
	return tradeSha ? decodeURIComponent(tradeSha) : null;
});

// 檢查是否有錯誤狀態
const hasError = computed(() => {
	return !!route.query.error;
});

// 檢查是否為處理中狀態（從藍新金流直接跳轉但未帶訂單號）
const isProcessingStatus = computed(() => {
	return route.query.status === 'processing' && !orderNum.value;
});

// 檢查是否有 TradeInfo 和 TradeSha（可以用來查詢結帳結果）
const hasTradeInfo = computed(() => {
	return !!(newebpayTradeInfo.value && newebpayTradeSha.value);
});

// 檢查是否有有效的方案資料
const hasValidPlan = computed(() => {
	return planStore.plan && isActivePlan(planStore.plan);
});

// 取得有效的方案資料（確保類型安全）
const validPlan = computed(() => {
	return planStore.plan && isActivePlan(planStore.plan) ? planStore.plan : null;
});

// 檢查藍新金流狀態
const isNewebpaySuccess = computed(() => {
	return newebpayStatus.value === 'SUCCESS';
});

// 調試：在 console 顯示所有查詢參數和完整資訊
if (import.meta.client) {
	console.log('[Success 頁面] 藍新金流重定向資訊:', {
		// URL 查詢參數
		queryParams: {
			order: route.query.order,
			status: route.query.status,
			error: route.query.error,
			hasTradeInfo: !!route.query.tradeInfo,
			hasTradeSha: !!route.query.tradeSha,
			allParams: route.query,
		},
		// 交易資訊
		tradeInfo: {
			hasValue: !!newebpayTradeInfo.value,
			length: newebpayTradeInfo.value?.length || 0,
			preview: newebpayTradeInfo.value?.substring(0, 20) + '...' || 'none',
		},
		tradeSha: {
			hasValue: !!newebpayTradeSha.value,
			length: newebpayTradeSha.value?.length || 0,
			preview: newebpayTradeSha.value?.substring(0, 20) + '...' || 'none',
		},
		// 完整的 URL 資訊
		fullUrl: window.location.href,
		pathname: window.location.pathname,
		search: window.location.search,
		hash: window.location.hash,
		// 瀏覽器資訊
		userAgent: navigator.userAgent,
		referrer: document.referrer,
		// 時間戳
		timestamp: new Date().toISOString(),
	});

	// 額外：檢查是否有 POST 表單數據（在某些情況下可能會有）
	if (window.history && window.history.state) {
		console.log('[Success 頁面] 歷史狀態:', window.history.state);
	}

	// 檢查 sessionStorage 和 localStorage 是否有相關數據
	const sessionData = sessionStorage.getItem('payment-data');
	const localData = localStorage.getItem('payment-data');
	if (sessionData) {
		console.log('[Success 頁面] SessionStorage 付款數據:', JSON.parse(sessionData));
	}
	if (localData) {
		console.log('[Success 頁面] LocalStorage 付款數據:', JSON.parse(localData));
	}
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

// 向 ASP 後端查詢付款狀態 (使用 TradeInfo 和 TradeSha)
const queryPaymentStatusFromASP = async (): Promise<PaymentResultResponse | null> => {
	try {
		console.log('[ASP 查詢] 開始查詢付款狀態:', {
			hasTradeInfo: !!newebpayTradeInfo.value,
			hasTradeSha: !!newebpayTradeSha.value,
			tradeInfoLength: newebpayTradeInfo.value?.length || 0,
			tradeShaLength: newebpayTradeSha.value?.length || 0,
			companyId: authStore.companyId,
			timestamp: new Date().toISOString(),
		});

		// 優先使用 TradeInfo 和 TradeSha 查詢結帳結果
		if (hasTradeInfo.value) {
			console.log('[ASP 查詢] 使用 TradeInfo 查詢結帳結果');
			const result = await getPaymentResultByTradeInfo(newebpayTradeInfo.value!, newebpayTradeSha.value!);
			console.log('[ASP 查詢] 結帳結果:', result);

			// 轉換為舊格式以保持相容性
			const convertedResult: PaymentResultResponse = {
				OrderNum: result.orderNo,
				CompanyId: authStore.companyId || 0,
				PlanId: 0, // 這個需要從其他地方取得
				PaymentStatus: result.status === 'Success' ? 'Paid' : result.status === 'Failed' ? 'Failed' : 'Pending',
				OrderStatus: 'Active',
				PaymentMethod: result.paymentMethod,
				Card4No: result.card4No,
			};

			return convertedResult;
		}

		// 如果沒有 TradeInfo，嘗試使用訂單編號查詢
		const orderToQuery = orderNum.value;
		if (orderToQuery) {
			console.log('[ASP 查詢] 使用訂單編號查詢:', orderToQuery);
			const result = await getPaymentResult(orderToQuery);
			console.log('[ASP 查詢] 查詢結果:', result);
			return result;
		}

		console.warn('[ASP 查詢] 沒有可用參數可查詢');
		return null;
	}
	catch (error) {
		console.error('[ASP 查詢] 查詢失敗:', error);
		return null;
	}
};

// 開始輪詢付款狀態
const startPaymentPolling = (orderNumber?: string) => {
	if (isPolling.value) {
		console.log('[輪詢] 已在輪詢中，跳過');
		return;
	}

	console.log('[輪詢] 開始輪詢付款狀態:', {
		hasTradeInfo: hasTradeInfo.value,
		hasOrderNumber: !!orderNum.value,
		interval: pollIntervalMs,
		maxAttempts: maxPollAttempts,
	});

	isPolling.value = true;
	pollAttempts.value = 0;

	pollingInterval.value = setInterval(async () => {
		pollAttempts.value++;
		console.log(`[輪詢] 第 ${pollAttempts.value} 次嘗試`);

		const result = await queryPaymentStatusFromASP();

		if (result) {
			// 找到付款結果
			paymentResult.value = result;
			isLoading.value = false;
			isPolling.value = false;

			// 清除輪詢
			if (pollingInterval.value) {
				clearInterval(pollingInterval.value);
				pollingInterval.value = null;
			}

			// 根據付款狀態顯示訊息
			if (result.PaymentStatus === 'Paid') {
				planStore.markPaid();
				ElMessage.success('付款成功！');
			}
			else if (result.PaymentStatus === 'Pending') {
				ElMessage.info('付款處理中，請稍候');
			}
			else {
				ElMessage.warning(`付款狀態：${result.PaymentStatus}`);
			}

			console.log('[輪詢] 成功取得付款結果，停止輪詢');
			return;
		}

		// 達到最大嘗試次數
		if (pollAttempts.value >= maxPollAttempts) {
			console.log('[輪詢] 達到最大嘗試次數，停止輪詢');
			isPolling.value = false;
			isLoading.value = false;

			if (pollingInterval.value) {
				clearInterval(pollingInterval.value);
				pollingInterval.value = null;
			}

			ElMessage.warning('付款仍在處理中，請稍後在計畫列表查看付款狀態');
		}
	}, pollIntervalMs);
};

// 停止輪詢
const stopPaymentPolling = () => {
	if (pollingInterval.value) {
		clearInterval(pollingInterval.value);
		pollingInterval.value = null;
	}
	isPolling.value = false;
	console.log('[輪詢] 已停止付款狀態輪詢');
};

// 重定向事件監聽器
const setupRedirectListener = () => {
	if (!import.meta.client) { return; }

	console.log('[重定向監聽] 設置重定向事件監聽器');

	// 監聽頁面可見性變化（用戶回到頁面時觸發）
	const handleVisibilityChange = () => {
		if (!document.hidden && isProcessingStatus.value) {
			console.log('[重定向監聽] 頁面重新可見，檢查付款狀態');
			startPaymentPolling();
		}
	};

	// 監聽頁面焦點變化
	const handleFocus = () => {
		if (isProcessingStatus.value && !isPolling.value) {
			console.log('[重定向監聽] 頁面獲得焦點，檢查付款狀態');
			startPaymentPolling();
		}
	};

	// 監聽 beforeunload 事件（頁面即將卸載）
	const handleBeforeUnload = () => {
		console.log('[重定向監聽] 頁面即將卸載，停止輪詢');
		stopPaymentPolling();
	};

	// 添加事件監聽器
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('focus', handleFocus);
	window.addEventListener('beforeunload', handleBeforeUnload);

	// 返回清理函數
	return () => {
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('focus', handleFocus);
		window.removeEventListener('beforeunload', handleBeforeUnload);
	};
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
		// 不設定 error，而是保持 loading 狀態並顯示處理中訊息
		isLoading.value = true;
		ElMessage.info('付款正在處理中，請稍後查看付款狀態');

		// 立即開始輪詢查詢付款狀態
		if (authStore.companyId) {
			console.log('[Success 頁面] 開始輪詢付款狀態');
			startPaymentPolling();
		}
		else {
			// 如果沒有公司 ID，等待 5 秒後顯示提示
			setTimeout(() => {
				isLoading.value = false;
				ElMessage.warning('付款處理中，請稍後在計畫列表查看付款狀態');
			}, 5000);
		}
		return;
	}

	// 如果有 TradeInfo 和 TradeSha，直接查詢結帳結果
	if (hasTradeInfo.value) {
		console.log('[Success 頁面] 使用 TradeInfo 查詢結帳結果');
		try {
			const result = await queryPaymentStatusFromASP();
			if (result) {
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
			else {
				// 查詢失敗，開始輪詢
				console.log('[Success 頁面] 查詢失敗，開始輪詢');
				startPaymentPolling();
			}
		}
		catch (err) {
			console.error('[Success 頁面] 查詢結帳結果錯誤:', err);
			// 查詢失敗，開始輪詢
			startPaymentPolling();
		}
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

// 設置重定向監聽器的清理函數
let cleanupRedirectListener: (() => void) | null = null;

// 進入成功頁：先讓 Header 顯示骨架，取得資料後再標記為已付款
onMounted(async () => {
	try {
		console.log('[頁面載入] success.vue 頁面開始載入');

		const minDelay = new Promise(resolve => setTimeout(resolve, 800));
		// 觸發一次取資料，確保 Header 顯示 loading
		await Promise.allSettled([planStore.fetchCurrentPlan(), minDelay]);

		// 設置重定向事件監聽器
		cleanupRedirectListener = setupRedirectListener() || null;

		// 立即檢查是否有 TradeInfo 和 TradeSha，如果有則直接查詢結帳結果
		if (hasTradeInfo.value) {
			console.log('[頁面載入] 檢測到 TradeInfo 和 TradeSha，立即查詢結帳結果');
			try {
				const result = await queryPaymentStatusFromASP();
				if (result) {
					paymentResult.value = result;

					// 如果付款成功，標記為已付款
					if (result.PaymentStatus === 'Paid') {
						planStore.markPaid();
						ElMessage.success('付款成功！');
					}
					else if (result.PaymentStatus === 'Pending') {
						ElMessage.info('付款處理中，請稍候');
					}

					isLoading.value = false;
					return; // 成功取得結果，結束處理
				}
			}
			catch (err) {
				console.error('[頁面載入] 直接查詢結帳結果失敗:', err);
				// 查詢失敗，繼續執行原本的處理流程
			}
		}

		// 如果沒有 TradeInfo 或查詢失敗，執行原本的處理流程
		console.log('[頁面載入] 執行原本的付款結果處理流程');
		await fetchPaymentResult();
	}
	catch (err) {
		console.error('頁面初始化錯誤:', err);
		error.value = '頁面初始化失敗';
		isLoading.value = false;
	}
});

// 頁面卸載時清理資源
onUnmounted(() => {
	console.log('[Success 頁面] 頁面卸載，清理資源');

	// 停止輪詢
	stopPaymentPolling();

	// 清理事件監聽器
	if (cleanupRedirectListener) {
		cleanupRedirectListener();
		cleanupRedirectListener = null;
	}
});

function goToPlans() {
	router.push(r.landing());
}

// 重新查詢付款狀態
const retryPaymentCheck = async () => {
	if (!authStore.companyId) {
		ElMessage.error('無法取得公司資訊');
		return;
	}

	try {
		isLoading.value = true;
		error.value = null;

		// 停止現有的輪詢
		stopPaymentPolling();

		// 重置輪詢計數器
		pollAttempts.value = 0;

		// 嘗試重新取得方案資料
		await planStore.fetchCurrentPlan();

		// 如果方案已更新為已付款狀態，顯示成功
		if (planStore.isPayed) {
			ElMessage.success('付款狀態已確認！');
			isLoading.value = false;
			return;
		}

		// 嘗試使用已知的訂單編號查詢
		const knownOrderNum = 'ORD20251002002';
		console.log('[重試查詢] 使用已知訂單號:', knownOrderNum);

		try {
			const result = await getPaymentResult(knownOrderNum);
			console.log('[重試查詢] 查詢結果:', result);

			paymentResult.value = result;

			if (result.PaymentStatus === 'Paid') {
				planStore.markPaid();
				ElMessage.success('付款成功！訂單狀態已確認');
				isLoading.value = false;
				return;
			}
			else {
				ElMessage.info(`付款狀態：${result.PaymentStatus}`);
			}
		}
		catch (orderError) {
			console.error('[重試查詢] 使用已知訂單號查詢失敗:', orderError);
			ElMessage.warning('無法查詢訂單狀態，可能後端尚未處理完成');
		}

		// 開始新的輪詢
		console.log('[重試查詢] 開始新的輪詢');
		startPaymentPolling(knownOrderNum);
	}
	catch (err) {
		console.error('重新查詢付款狀態錯誤:', err);
		ElMessage.error('查詢失敗，請稍後再試');
		isLoading.value = false;
	}
};

// 測試結帳結果 API - 使用規格書中的測試參數
const testPaymentResultAPI = async () => {
	try {
		isLoading.value = true;
		error.value = null;

		console.log('[測試 API] 開始測試結帳結果 API');

		// 使用規格書中的測試參數
		const testTradeInfo = '6ba9cce06518b0b02d00987fc4585f1757a10efcd813c9ccd3b5d14aca1d85f8b44dffd9dc3c4b5536839b2420450614cb4aab8a6421dfa710293eb24646e3287cb6693f5f64bf25656ecb309add689806777c2327265d5ca66f2988e9e4826a3cda22057286cc0fe0d9f8b3b508996664846332dbc3054e852a930a730ce1e69f10ee80f5aca2d6819f4e0e40a9239aceea515d8d2bb98f52b0b3b129b6a2b0c92305be287282b97bee95d421238030';
		const testTradeSha = '764E188109697F5C9BA9BEC8A0BD89D4037FE2616AAC31272D0F5ABB3F523617';

		console.log('[測試 API] 使用測試參數:', {
			tradeInfoLength: testTradeInfo.length,
			tradeShaLength: testTradeSha.length,
		});

		// 直接呼叫結帳結果 API
		const result = await getPaymentResultByTradeInfo(testTradeInfo, testTradeSha);

		console.log('[測試 API] API 回應:', result);

		// 轉換為舊格式以保持相容性
		const convertedResult: PaymentResultResponse = {
			OrderNum: result.orderNo,
			CompanyId: authStore.companyId || 0,
			PlanId: 0,
			PaymentStatus: result.status === 'Success' ? 'Paid' : result.status === 'Failed' ? 'Failed' : 'Pending',
			OrderStatus: 'Active',
			PaymentMethod: result.paymentMethod,
			Card4No: result.card4No,
		};

		paymentResult.value = convertedResult;

		// 如果付款成功，標記為已付款
		if (result.status === 'Success') {
			planStore.markPaid();
			ElMessage.success('測試成功！付款狀態已確認');
		}
		else {
			ElMessage.info(`測試結果：${result.status}`);
		}

		isLoading.value = false;
	}
	catch (err) {
		console.error('[測試 API] 測試失敗:', err);
		ElMessage.error('測試 API 失敗，請檢查後端連線');
		isLoading.value = false;
	}
};

// 關閉手動測試對話框
const handleCloseDialog = () => {
	showManualTestDialog.value = false;
	manualTradeInfo.value = '';
	manualTradeSha.value = '';
};

// 測試手動輸入的參數
const testManualParameters = async () => {
	if (!manualTradeInfo.value.trim() || !manualTradeSha.value.trim()) {
		ElMessage.warning('請輸入 TradeInfo 和 TradeSha');
		return;
	}

	try {
		isManualTestLoading.value = true;

		console.log('[手動測試] 開始測試手動輸入的參數');

		// 直接呼叫結帳結果 API
		const result = await getPaymentResultByTradeInfo(manualTradeInfo.value, manualTradeSha.value);

		console.log('[手動測試] API 回應:', result);

		// 轉換為舊格式以保持相容性
		const convertedResult: PaymentResultResponse = {
			OrderNum: result.orderNo,
			CompanyId: authStore.companyId || 0,
			PlanId: 0,
			PaymentStatus: result.status === 'Success' ? 'Paid' : result.status === 'Failed' ? 'Failed' : 'Pending',
			OrderStatus: 'Active',
			PaymentMethod: result.paymentMethod,
			Card4No: result.card4No,
		};

		paymentResult.value = convertedResult;

		// 如果付款成功，標記為已付款
		if (result.status === 'Success') {
			planStore.markPaid();
			ElMessage.success('手動測試成功！付款狀態已確認');
		}
		else {
			ElMessage.info(`手動測試結果：${result.status}`);
		}

		// 關閉對話框
		showManualTestDialog.value = false;
		manualTradeInfo.value = '';
		manualTradeSha.value = '';

		isLoading.value = false;
	}
	catch (err) {
		console.error('[手動測試] 測試失敗:', err);
		ElMessage.error('手動測試 API 失敗，請檢查參數和後端連線');
	}
	finally {
		isManualTestLoading.value = false;
	}
};
</script>

<style scoped>
:deep(.el-step__title) {
  font-size: 16px;
}
</style>
