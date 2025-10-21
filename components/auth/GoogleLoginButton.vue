<template>
	<div class="w-full mx-auto">
		<!-- 主要登入按鈕 -->
		<button
			:disabled="isLoading"
			class="group relative flex w-full justify-center rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
			@click="handleGoogleLogin"
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
			<span
				v-else
				class="flex items-center gap-3"
			>
				<svg
					class="w-6 h-6"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				使用 Google 登入
			</span>
		</button>

		<!-- 次要選項 -->
		<div class="mt-4 space-y-2">
			<!-- 更換帳戶選項 -->
			<button
				:disabled="isLoading"
				class="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-2 px-1 disabled:opacity-50"
				@click="handleGoogleLoginWithAccountSelection"
			>
				更換其他帳號登入/註冊
			</button>

			<!-- 清除登入記錄選項 -->
			<button
				:disabled="isLoading"
				class="w-full text-center text-gray-500 hover:text-gray-700 text-sm py-2 px-1 disabled:opacity-50"
				@click="handleClearLoginRecord"
			>
				清除這個登入記錄
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useUserAuthStore } from '~/stores/user/useAuthStore'
import { useGoogleAuth } from '~/composables/useGoogleAuth'

const isLoading = ref(false)
const authStore = useUserAuthStore()
const { login } = useGoogleAuth()

const handleGoogleLogin = async () => {
	isLoading.value = true
	try {
		// 預設行為：不強制帳戶選擇（讓 Google 決定）
		await login(async (response) => {
			try {
				// 使用 ID Token 進行登入
				await authStore.loginWithGoogleToken(response.credential)
				ElMessage.success('Google 登入成功')
				navigateTo('/users')
			}
			catch (error) {
				console.error('Google login error:', error)
				ElMessage.error('Google 登入失敗，請稍後再試')
			}
			finally {
				isLoading.value = false
			}
		}, false) // 不強制帳戶選擇
	}
	catch (error) {
		console.error('Google Auth initialization error:', error)
		ElMessage.error('Google 登入初始化失敗')
		isLoading.value = false
	}
}

const handleGoogleLoginWithAccountSelection = async () => {
	isLoading.value = true
	try {
		// 強制帳戶選擇
		await login(async (response) => {
			try {
				// 使用 ID Token 進行登入
				await authStore.loginWithGoogleToken(response.credential)
				ElMessage.success('Google 登入成功')
				navigateTo('/users')
			}
			catch (error) {
				console.error('Google login error:', error)
				ElMessage.error('Google 登入失敗，請稍後再試')
			}
			finally {
				isLoading.value = false
			}
		}, true) // 強制帳戶選擇
	}
	catch (error) {
		console.error('Google Auth initialization error:', error)
		ElMessage.error('Google 登入初始化失敗')
		isLoading.value = false
	}
}

const handleClearLoginRecord = async () => {
	try {
		await ElMessageBox.confirm(
			'確定要清除登入記錄嗎？這將移除所有儲存的登入資訊。',
			'清除登入記錄',
			{
				confirmButtonText: '確定清除',
				cancelButtonText: '取消',
				type: 'warning',
			},
		)

		// 清除 Google 的登入記錄
		if (import.meta.client) {
			// 清除本地儲存的 Google 登入狀態
			localStorage.removeItem('google_auth_state')
			sessionStorage.removeItem('google_auth_state')

			// 清除所有 Google 相關的儲存
			localStorage.removeItem('g_state')
			sessionStorage.removeItem('g_state')
		}

		ElMessage.success('登入記錄已清除')

		// 重新載入頁面以重新初始化 Google 登入
		window.location.reload()
	}
	catch (error) {
		// 使用者取消時不處理
		if (error !== 'cancel') {
			console.error('清除登入記錄錯誤:', error)
			ElMessage.error('清除登入記錄失敗')
		}
	}
}
</script>
