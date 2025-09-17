<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import type { UserRegisterData } from '~/types/users/user';

definePageMeta({
	name: 'user-register',
	layout: 'user',
	ssr: false, // CSR 模式
});

const authStore = useUserAuthStore();
const router = useRouter();

const formData = ref<Omit<UserRegisterData, 'password'>>({
	name: '',
	account: '',
	email: '',
});
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

// 資安考量：統一錯誤訊息處理
function sanitizeErrorMessage(error: any): string {
	const statusCode = error.status || error.statusCode || error.data?.status;
	
	// 4xx 錯誤：顯示通用訊息，避免洩露系統資訊
	if (statusCode >= 400 && statusCode < 500) {
		return '請求處理失敗，請檢查輸入資料';
	}
	
	// 5xx 錯誤：顯示通用訊息，避免洩露系統架構
	if (statusCode >= 500) {
		return '系統暫時無法處理請求，請稍後再試';
	}
	
	// 其他錯誤：使用原始訊息
	return error.data?.message || error.message || '未知錯誤';
}

async function handleSubmit() {
	if (password.value !== confirmPassword.value) {
		ElMessage.error('兩次輸入的密碼不一致');
		return;
	}
	if (!formData.value.name || !formData.value.account || !formData.value.email || !password.value) {
		ElMessage.error('請填寫所有必填欄位');
		return;
	}

	isLoading.value = true;
	try {
		const registerPayload: UserRegisterData = {
			...formData.value,
			password: password.value,
		};
		const response = await authStore.register(registerPayload);
		
		// 使用 Element Plus MessageBox 顯示註冊成功訊息
		ElMessageBox.alert(
			`歡迎 ${response.Account}！\n您的帳戶已成功建立，現在可以登入了。`,
			'註冊成功',
			{
				type: 'success',
				confirmButtonText: '前往登入',
				callback: () => {
					router.push({ name: 'user-login' });
				}
			}
		);
	}
	catch (error: any) {
		// 資安考量：統一錯誤訊息處理
		const sanitizedMessage = sanitizeErrorMessage(error);
		ElMessage.error(sanitizedMessage);
	}
	finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="w-full max-w-md space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					建立您的帳戶
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					請註冊您的帳戶以繼續使用平台服務
				</p>
			</div>
			<form
				class="mt-8 space-y-6"
				@submit.prevent="handleSubmit"
			>
				<div class="rounded-md -space-y-px">
					<div class="pt-4">
						<label
							for="name"
							class="block text-sm font-medium text-gray-700"
						>姓名</label>
						<input
							id="name"
							v-model="formData.name"
							name="name"
							type="text"
							autocomplete="name"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的姓名"
						>
					</div>
					<div class="pt-4">
						<label
							for="account"
							class="block text-sm font-medium text-gray-700"
						>帳號</label>
						<input
							id="account"
							v-model="formData.account"
							name="account"
							type="text"
							autocomplete="username"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的帳號"
						>
					</div>
					<div class="pt-4">
						<label
							for="email-address"
							class="block text-sm font-medium text-gray-700"
						>電子郵件</label>
						<input
							id="email-address"
							v-model="formData.email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的電子郵件"
						>
					</div>
					<div class="pt-4">
						<label
							for="password"
							class="block text-sm font-medium text-gray-700"
						>密碼</label>
						<input
							id="password"
							v-model="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的密碼"
						>
					</div>
					<div class="pt-4">
						<label
							for="confirm-password"
							class="block text-sm font-medium text-gray-700"
						>確認密碼</label>
						<input
							id="confirm-password"
							v-model="confirmPassword"
							name="confirm-password"
							type="password"
							autocomplete="new-password"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請再次輸入您的密碼"
						>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="isLoading"
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300"
					>
						<span v-if="isLoading">註冊中...</span>
						<span v-else>註冊</span>
					</button>
				</div>
				<div class="text-center text-xs text-gray-500">
					註冊即表示您同意我們的服務條款與隱私權政策
				</div>
			</form>
			<div class="relative">
				<div
					class="absolute inset-0 flex items-center"
					aria-hidden="true"
				>
					<div class="w-full border-t border-gray-300" />
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-gray-50 px-2 text-gray-500">或使用其他方式註冊</span>
				</div>
			</div>
			<div>
				<button
					type="button"
					class="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					使用 Google 帳戶註冊
				</button>
			</div>
		</div>
	</div>
</template>
