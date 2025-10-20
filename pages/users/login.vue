<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import type { UserLoginData } from '~/types/users/user';
import GoogleLoginButton from '~/components/auth/GoogleLoginButton.vue';

definePageMeta({
	name: 'user-login',
	layout: 'user',
	ssr: false, // CSR 模式
});

const authStore = useUserAuthStore();
const route = useRoute();
const router = useRouter();

// Redirect if already logged in
watchEffect(() => {
	if (authStore.isLoggedIn) {
		router.push({ name: 'user-landing' });
	}
});

// 處理 Google OAuth 回調
onMounted(() => {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const state = urlParams.get('state');

	if (code && state) {
		// 處理 Google OAuth 授權碼
		handleGoogleCallback(code);
	}
});

async function handleGoogleCallback(code: string) {
	try {
		isLoading.value = true;


		// 使用授權碼進行登入（BFF 會處理 code 到 id_token 的轉換）
		const response = await $fetch<{
			token: string
			user?: any
		}>('/api/v1/users/google', {
			method: 'POST',
			body: { code },
		});


		if (response.token) {
			// 使用 JWT token 進行登入
			await authStore.loginWithGoogleToken(response);
			ElMessage.success('Google 登入成功');
			await navigateTo('/users');
		}
		else {
			throw new Error('未收到有效的 token');
		}
	}
	catch (error) {
		console.error('❌ login.vue: Google callback error:', error);
		ElMessage.error('Google 登入失敗，請稍後再試');
	}
	finally {
		isLoading.value = false;
	}
}

const loginData = ref<Omit<UserLoginData, 'password'>>({
	account: '',
});
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
	isLoading.value = true;
	errorMessage.value = '';
	let willRedirect = false;
	try {
		const loginPayload: UserLoginData = {
			...loginData.value,
			password: password.value,
		};
		await authStore.login(loginPayload);

		// 登入成功後，立即導航到使用者首頁
		const redirectPath = route.query.redirect as string;

		// 安全檢查：只允許導向內部使用者頁面
		if (redirectPath && redirectPath.startsWith('/users/')) {
			willRedirect = true;
			await navigateTo(redirectPath);
		}
		else {
			willRedirect = true;
			await navigateTo({ name: 'user-landing' });
		}
	}
	catch (error: any) {
		errorMessage.value = error.message || '登入失敗，請檢查您的帳號和密碼。';
	}
	finally {
		// 僅在未觸發路由跳轉時才關閉 loading
		if (!willRedirect) {
			isLoading.value = false;
		}
	}
}
</script>

<!-- up1 體驗者登入頁 -->
<template>
	<div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="w-full max-w-md space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					歡迎回來
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					請登入您的帳戶以繼續使用平台服務
				</p>
			</div>
			<form
				class="mt-8 space-y-6"
				@submit.prevent="handleLogin"
			>
				<div class="rounded-md  -space-y-px">
					<div>
						<label
							for="account"
							class="block text-sm font-medium text-gray-700"
						>帳號</label>
						<input
							id="account"
							v-model="loginData.account"
							name="account"
							type="text"
							autocomplete="username"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的帳號"
						>
					</div>
					<div class="pt-4">
						<div class="flex items-center justify-between">
							<label
								for="password"
								class="block text-sm font-medium text-gray-700"
							>密碼</label>
							<div class="text-sm">
								<a href="#">忘記密碼？</a>
							</div>
						</div>
						<input
							id="password"
							v-model="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
							placeholder="請輸入您的密碼"
						>
					</div>
				</div>

				<div
					v-if="errorMessage"
					class="rounded-md bg-red-50 p-4"
				>
					<p class="text-sm text-red-700">
						{{ errorMessage }}
					</p>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						>
						<label
							for="remember-me"
							class="ml-2 block text-sm text-gray-900"
						>記住我的登入資訊</label>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="isLoading"
						class="group relative flex w-full justify-center rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
						:aria-busy="isLoading"
						aria-live="polite"
					>
						<span
							v-if="isLoading"
							class="inline-flex items-center justify-center gap-2"
						>
							<svg
								class="h-5 w-5 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden="true"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								/>
							</svg>
							登入中…
						</span>
						<span v-else>登入</span>
					</button>
				</div>
			</form>

			<!-- 分隔線 -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300" />
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-gray-50 text-gray-500">或</span>
				</div>
			</div>

			<!-- Google 登入按鈕 -->
			<ClientOnly>
				<GoogleLoginButton />
			</ClientOnly>

			<div class="text-center text-sm">
				還沒有帳戶？
				<NuxtLink :to="{ name: 'user-register' }">立即註冊</NuxtLink>
			</div>
		</div>
	</div>
</template>
