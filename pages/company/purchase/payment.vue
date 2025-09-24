<!-- ep10-1 付款頁面 -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
	Check,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useCompanyPayment } from '~/composables/api/company/useCompanyPayment';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import type { CreatePaymentRequest } from '~/types/company/payment';

definePageMeta({
	layout: 'company',
	name: 'company-purchase-payment',
});

const router = useRouter();
const authStore = useCompanyAuthStore();
const { createPayment, submitToNewebPay, validateCreditCard } = useCompanyPayment();

// 從 URL 查詢參數取得方案 ID
const route = useRoute();
const planId = computed(() => {
	const id = route.query.planId;
	return id ? Number(id) : null;
});

const paymentMethod = ref('creditCard');

// 信用卡欄位（ElInput 為受控元件，需綁定 v-model 才可輸入）
const cardNumber = ref('');
const expiryDate = ref('');
const cvc = ref('');
const cardEmail = ref('');

// 付款狀態
const isPaymentLoading = ref(false);

// 輸入 4 位自動加入空白（僅允許數字）
const MAX_CARD_DIGITS = 16;
function onCardNumberInput(val: string) {
	const digitsOnly = String(val || '').replace(/\D/g, '').slice(0, MAX_CARD_DIGITS);
	const grouped = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
	cardNumber.value = grouped;
}

// 有效期限：每 2 位自動補 " / "，最多 4 位數字 (MMYY)
function onExpiryInput(val: string) {
	const digits = String(val || '').replace(/\D/g, '').slice(0, 4);
	if (digits.length <= 2) {
		expiryDate.value = digits;
	}
	else {
		expiryDate.value = `${digits.slice(0, 2)} / ${digits.slice(2)}`;
	}
}

// CVC：僅數字，最多 3 位
function onCvcInput(val: string) {
	cvc.value = String(val || '').replace(/\D/g, '').slice(0, 3);
}

const goBack = () => {
	router.back();
};

const confirmPayment = async () => {
	// 檢查必要參數
	if (!planId.value) {
		ElMessage.error('請先選擇方案');
		return;
	}

	if (!authStore.companyId) {
		ElMessage.error('請先登入企業帳號');
		return;
	}

	// 如果是信用卡付款，先驗證表單
	if (paymentMethod.value === 'creditCard') {
		const validation = validateCreditCard({
			cardNumber: cardNumber.value,
			expiryDate: expiryDate.value,
			cvc: cvc.value,
			cardEmail: cardEmail.value,
		});

		if (!validation.isValid) {
			validation.errors.forEach(error => {
				ElMessage.error(error);
			});
			return;
		}
	}

	try {
		isPaymentLoading.value = true;

		// 建立付款請求
		const paymentRequest: CreatePaymentRequest = {
			plan_id: planId.value,
			company_id: authStore.companyId,
			payment_method: paymentMethod.value === 'creditCard' ? 'CREDIT' : 'CVS',
			email: authStore.user?.Email || 'test@example.com', // 使用企業用戶信箱
			// 如果是信用卡付款，包含信用卡資訊
			...(paymentMethod.value === 'creditCard' && {
				card_number: cardNumber.value.replace(/\s/g, ''), // 移除空格
				card_expiry: expiryDate.value.replace(/\s/g, ''), // 移除空格
				card_cvc: cvc.value,
				card_email: cardEmail.value,
			}),
		};

		// 調用建立付款 API
		const paymentResponse = await createPayment(paymentRequest);

		// 準備藍新金流表單資料
		const newebPayData = {
			MerchantID: paymentResponse.PaymentData.MerchantID,
			TradeInfo: paymentResponse.PaymentData.TradeInfo,
			TradeSha: paymentResponse.PaymentData.TradeSha,
			Version: paymentResponse.PaymentData.Version,
		};

		// 自動提交到藍新金流
		submitToNewebPay(newebPayData, paymentResponse.PayGetWay);

		ElMessage.success('正在跳轉到付款頁面...');
	}
	catch (error) {
		console.error('付款處理錯誤:', error);
		ElMessage.error(error instanceof Error ? error.message : '付款處理失敗，請稍後再試');
	}
	finally {
		isPaymentLoading.value = false;
	}
};
</script>

<template>
	<div class="bg-white">
		<!-- Current Plan Static Info -->
		<CompanyPlanStatusHeader />

		<div>
			<!-- Header -->
			<h2 class="text-xl font-bold mb-6 text-center">
				方案總覽
			</h2>
			<el-steps
				:active="1"
				finish-status="success"
				align-center
				class="mb-10"
			>
				<el-step title="選擇方案" />
				<el-step title="付款方式" />
				<el-step title="完成付款" />
			</el-steps>

			<!-- Plan Summary -->
			<div class="border border-gray-200 rounded-lg p-6 mb-8">
				<div class="flex justify-between items-center">
					<div>
						<p class="font-medium text-gray-800">
							方案
						</p>
						<p class="text-gray-600">
							您選擇的方案：60天 體驗人數上限 30 人
						</p>
					</div>
					<div class="text-right">
						<p class="text-sm text-gray-500">
							方案費用
						</p>
						<p class="text-2xl font-semibold text-gray-800">
							TWD 3,500
						</p>
					</div>
				</div>
			</div>

			<!-- Payment Method Selection -->
			<div class="mb-8">
				<h3 class="text-lg font-semibold mb-4 text-gray-800">
					選擇付款方式
				</h3>
				<el-radio-group
					v-model="paymentMethod"
					class="space-y-4 w-full"
				>
					<el-radio
						value="creditCard"
						size="large"
						border
						class="w-full !mr-0 h-auto items-start pt-4 pb-4"
					>
						<div class="flex justify-between items-center w-full">
							<div class="flex items-center gap-2 whitespace-nowrap">
								<span>信用卡付款</span>
								<span class="text-sm text-gray-500">- 支援 VISA、MasterCard、JCB</span>
							</div>
							<div class="flex items-center gap-2 text-3xl text-gray-400">
								<font-awesome-icon :icon="['fab', 'cc-visa']" />
								<font-awesome-icon :icon="['fab', 'cc-mastercard']" />
								<font-awesome-icon :icon="['fab', 'cc-jcb']" />
							</div>
						</div>
					</el-radio>
					<el-radio
						value="cvs"
						size="large"
						border
						class="w-full !mr-0 h-auto items-start pt-4 pb-4"
					>
						<div class="flex justify-between items-center w-full">
							<div class="flex items-center gap-2 whitespace-nowrap">
								<span>超商代碼繳費</span>
								<span class="text-sm text-gray-500">- 支援 7-11、全家、萊爾富、OK超商</span>
							</div>
							<div class="text-2xl">
								🏪
							</div>
						</div>
					</el-radio>
					<el-radio
						value="atm"
						size="large"
						border
						class="w-full !mr-0 h-auto items-start pt-4 pb-4"
					>
						<div class="flex justify-between items-center w-full">
							<div class="flex items-center gap-2 whitespace-nowrap">
								<span>ATM 虛擬帳號轉帳</span>
								<span class="text-sm text-gray-500">- 適合企業匯款或大額交易</span>
							</div>
							<div class="text-2xl">
								🏛️
							</div>
						</div>
					</el-radio>
					<el-radio
						value="subscription"
						size="large"
						border
						class="w-full !mr-0 h-auto items-start pt-4 pb-4"
					>
						<div class="flex justify-between items-center w-full">
							<div class="flex items-center gap-2 whitespace-nowrap">
								<span>訂閱制自動扣款</span>
								<span class="text-sm text-gray-500">- 每月自動扣款 NT$ 380 x 10 期</span>
							</div>
							<div class="text-2xl">
								🔄
							</div>
						</div>
					</el-radio>
				</el-radio-group>
			</div>

			<!-- Credit Card Form -->
			<div
				v-if="paymentMethod === 'creditCard'"
				class="mb-8"
			>
				<h3 class="text-lg font-semibold mb-4 text-gray-800">
					信用卡資訊
				</h3>
				<div class="border border-gray-200 rounded-lg p-6">
					<div class="grid grid-cols-2 gap-x-4 gap-y-6">
						<div class="col-span-2">
							<label
								for="cardNumber"
								class="block text-sm font-medium text-gray-700 mb-1"
							>卡號</label>
							<el-input
								id="cardNumber"
								v-model="cardNumber"
								placeholder="1234 5678 9012 3456"
								size="large"
								inputmode="numeric"
								maxlength="19"
								autocomplete="cc-number"
								@input="onCardNumberInput"
							/>
						</div>
						<div class="col-span-2">
							<label
								for="cardEmail"
								class="block text-sm font-medium text-gray-700 mb-1"
							>持卡人信箱</label>
							<el-input
								id="cardEmail"
								v-model="cardEmail"
								placeholder="請輸入持卡人信箱"
								size="large"
								type="email"
								autocomplete="email"
							/>
						</div>
						<div>
							<label
								for="expiryDate"
								class="block text-sm font-medium text-gray-700 mb-1"
							>有效期限</label>
							<el-input
								id="expiryDate"
								v-model="expiryDate"
								placeholder="MM / YY"
								size="large"
								autocomplete="cc-exp"
								maxlength="7"
								inputmode="numeric"
								@input="onExpiryInput"
							/>
						</div>
						<div>
							<label
								for="cvc"
								class="block text-sm font-medium text-gray-700 mb-1"
							>安全碼</label>
							<el-input
								id="cvc"
								v-model="cvc"
								placeholder="123"
								size="large"
								inputmode="numeric"
								maxlength="3"
								autocomplete="cc-csc"
								@input="onCvcInput"
							/>
						</div>
					</div>
					<div class="mt-6">
						<el-checkbox
							label="儲存此卡片資訊，下次可快速結帳"
							size="large"
						/>
					</div>
				</div>
			</div>

			<!-- Totals -->
			<div class="bg-gray-50 rounded-lg p-6 mb-8">
				<div class="flex justify-between items-center text-gray-800 mb-2">
					<p>方案費用</p>
					<p>TWD 3,500</p>
				</div>
				<div class="flex justify-between items-center text-sm text-gray-500 mb-4">
					<p>手續費</p>
					<p>TWD 0</p>
				</div>
				<div class="border-t border-gray-200 my-4" />
				<div class="flex justify-between items-center font-semibold text-lg text-gray-800">
					<p>總計金額</p>
					<p>TWD 3,500</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-between">
				<el-button
					size="large"
					:disabled="isPaymentLoading"
					@click="goBack"
				>
					上一步
				</el-button>
				<el-button
					type="primary"
					size="large"
					:loading="isPaymentLoading"
					:disabled="isPaymentLoading"
					@click="confirmPayment"
				>
					{{ isPaymentLoading ? '處理中...' : '確認付款' }}
				</el-button>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Custom styles for el-steps */
:deep(.el-step__title.is-process) {
  @apply font-bold;
}

:deep(.el-step.is-simple .el-step__title) {
  @apply whitespace-nowrap;
}

/* Custom styles for el-radio */
:deep(.el-radio.is-bordered) {
  @apply border-gray-200;
}
:deep(.el-radio.is-bordered.is-checked) {
  @apply border-green-500 bg-green-50;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  @apply border-green-500 bg-green-500;
}
:deep(.el-radio__label) {
  @apply w-full;
}

/* Custom styles for el-button */
:deep(.el-button--primary) {
    @apply bg-gray-800 border-gray-800;
}
:deep(.el-button--primary:hover) {
    @apply bg-gray-700 border-gray-700;
}
</style>
