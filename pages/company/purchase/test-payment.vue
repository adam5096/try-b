<!-- 藍新金流測試頁面 - API 路徑已更新到 /api/v1/company/payments/ -->
<template>
	<div class="p-8">
		<h1 class="text-2xl font-bold mb-6">藍新金流付款測試</h1>
		
		<div class="space-y-4">
			<el-button @click="checkAuthStatus" type="info">
				檢查登入狀態
			</el-button>
			
			<el-button @click="testCreatePayment">
				測試建立付款訂單
			</el-button>

			<el-button @click="testCallbackPost" type="success">
				測試藍新回調 (POST)
			</el-button>
			
			<el-button @click="testGetPaymentResult">
				測試查詢付款結果
			</el-button>
			
			<el-button @click="testGetPaymentRedirect">
				測試取得付款導引
			</el-button>
			
			
		</div>
		
		<div v-if="result" class="mt-8 p-4 bg-gray-100 rounded">
			<h3 class="font-bold mb-2">測試結果：</h3>
			<pre class="whitespace-pre-wrap break-words overflow-x-auto max-w-full">{{ JSON.stringify(result, null, 2) }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useCompanyPayment } from '~/composables/api/company/useCompanyPayment';

definePageMeta({
	layout: 'company',
	name: 'company-purchase-test-payment',
});

const { createPayment, getPaymentResult, getPaymentRedirect } = useCompanyPayment();
const result = ref<any>(null);

// 檢查登入狀態 - 使用 Pinia store 而不是直接讀取 cookie
const checkAuthStatus = () => {
	const authStore = useCompanyAuthStore();
	const hasToken = !!authStore.token;
	const isLoggedIn = authStore.isLoggedIn;
	
	result.value = {
		authStatus: isLoggedIn ? '已登入' : '未登入',
		token: hasToken ? authStore.token?.substring(0, 20) + '...' : '無',
		companyId: authStore.companyId || '無',
		user: authStore.user?.Name || '無',
		storeStatus: {
			hasToken,
			isLoggedIn,
			hasUser: !!authStore.user,
			hasCompanyId: !!authStore.companyId,
		},
	};
	
	if (!isLoggedIn) {
		ElMessage.warning('請先登入企業帳號');
	} else {
		ElMessage.success('已登入企業帳號');
	}
};

const testCreatePayment = async () => {
	try {
		const paymentRequest = {
			plan_id: 2,
			company_id: 1,
			payment_method: 'CREDIT' as const,
			email: 'test@example.com',
			// 測試信用卡資訊
			card_number: '4000221111111111', // 藍新金流測試卡號
			card_expiry: '12/25',
			card_cvc: '123',
			card_email: 'test-card@example.com',
		};
		
		const response = await createPayment(paymentRequest);
		result.value = response;
		ElMessage.success('建立付款訂單成功');
	}
	catch (error) {
		console.error('測試建立付款訂單錯誤:', error);
		ElMessage.error('測試失敗');
		result.value = { error: error instanceof Error ? error.message : '未知錯誤' };
	}
};

const testGetPaymentResult = async () => {
	try {
		const response = await getPaymentResult('ORD-20250924-001');
		result.value = response;
		ElMessage.success('查詢付款結果成功');
	}
	catch (error) {
		console.error('測試查詢付款結果錯誤:', error);
		ElMessage.error('測試失敗');
		result.value = { error: error instanceof Error ? error.message : '未知錯誤' };
	}
};

const testGetPaymentRedirect = async () => {
	try {
		const response = await getPaymentRedirect('ORD-20250924-001');
		result.value = response;
		ElMessage.success('取得付款導引成功');
	}
	catch (error) {
		console.error('測試取得付款導引錯誤:', error);
		ElMessage.error('測試失敗');
		result.value = { error: error instanceof Error ? error.message : '未知錯誤' };
	}
};

// 測試藍新金流回調 (POST) - 對應 Postman 成功的請求
const testCallbackPost = async () => {
	try {
		// 使用與 Postman 成功截圖相同的 request body
		const callbackData = {
			TradeInfo: "a9f8a5ac0ba9c304e602183323c91ee88d97285aab51b977d9114cdf2a1fc8e0e0e80b3ed318a2c17adc0ee0f1a9ef7dbca12ba68c16a243f9e92844e65271c5f06b573557fc0448a3720a05612c09f2e52bf980c47ce478aa97942e7edfc7357455dfdfed11d9fdf6d47e27d0f89b6cc25092d883f7a780ffce5faf49e8f9cf037ad3d45f4faa235e2ea858a9be2c57bff45e936d75457a33022e44e7b9e571a108a5009782e29e4a1f6011c283cc231203d0f79413cba1ca78fdd2424cf6e10c8ca05f22a1e67103cbd34e017c16d1ac81deed155d3d2f2399a8b37ea5accf1e623e1e571afe62139a95067f8309dc05cdba145ff6a7fd8d6341c3da812310111715030c9cb8ed763d5dd39a2034dd3676e2695b0bc64855a92a08e3b9811d3668ec8296f91140634b4d23767aec37fe421de1bb2e667d4239fa059afdbc49656f30b2f823795a3535664f5db58d72ad2139a11aa997a5f66412e129480ff949c88167542fe7f1964c816c7f71a22b",
			TradeSha: "C2C3C4EF8EF6A5C45E2EFC195DAEDDC024447BB57DA77336B574D97AC09BFBDA",
			Status: "SUCCESS"
		};

		const response = await $fetch('/api/v1/company/payments/callback', {
			method: 'POST',
			body: callbackData,
		});

		result.value = response;
		ElMessage.success('藍新回調測試成功');
	}
	catch (error) {
		console.error('測試藍新回調錯誤:', error);
		ElMessage.error('測試失敗');
		result.value = { error: error instanceof Error ? error.message : '未知錯誤' };
	}
};
</script>
