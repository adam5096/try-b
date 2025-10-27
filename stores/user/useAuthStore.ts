import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { User, UserLoginData, UserRegisterData } from '~/types/users/user';
import { useUserLogin } from '~/composables/api/users/useUserLogin';
import { useUserRegister } from '~/composables/api/users/useUserRegister';

export const useUserAuthStore = defineStore('userAuth', () => {
	const tokenCookie = useCookie<string | null>('userAuthToken');
	const userCookie = useCookie<User | null>('userAuthUser');

	const token = ref<string | null>(tokenCookie.value ?? null);
	const user = ref<User | null>(userCookie.value ?? null);

	const isLoggedIn = computed(() => !!token.value && !!user.value);

	async function login(loginData: UserLoginData) {
		const { login: performLogin } = useUserLogin();
		try {
			// 使用 $fetch 回傳實際資料物件
			const response = await performLogin(loginData);

			// 調試資訊

			if (response && response.token && response.user) {
				token.value = response.token;
				tokenCookie.value = response.token;

				// 將 API 回應的 user 格式轉換為內部 User 格式
				const mappedUser: User = {
					id: response.user.Id,
					name: response.user.Name,
					account: response.user.Account,
					email: response.user.Email,
					role: response.user.Role,
				};

				user.value = mappedUser;
				userCookie.value = mappedUser;
			}
			else {
				await logout();
				throw new Error('登入失敗：回應格式無效或缺少必要資訊');
			}
		}
		catch (err: unknown) {
			await logout();
			const message = (err as { data?: { message?: string }, message?: string })?.data?.message || (err as { message?: string })?.message || '登入失敗：伺服器錯誤';
			throw new Error(message);
		}
	}

	async function loginWithGoogleToken(googleResponse: {
		token: string
		user?: {
			Id: number
			Account: string
			Email: string
			Name: string
			Role: string
		}
	}) {
		try {
			// 直接使用從 BFF 獲得的 token 和 user 資訊
			if (googleResponse && googleResponse.token && googleResponse.user) {
				token.value = googleResponse.token;
				tokenCookie.value = googleResponse.token;

				// 將 API 回應的 user 格式轉換為內部 User 格式
				const mappedUser: User = {
					id: googleResponse.user.Id,
					name: googleResponse.user.Name,
					account: googleResponse.user.Account,
					email: googleResponse.user.Email,
					role: googleResponse.user.Role,
				};

				user.value = mappedUser;
				userCookie.value = mappedUser;
			}
			else {
				await logout();
				throw new Error('Google 登入失敗：回應格式無效或缺少必要資訊');
			}
		}
		catch (err: unknown) {
			await logout();
			const message = (err as { data?: { message?: string }, message?: string })?.data?.message || (err as { message?: string })?.message || 'Google 登入失敗：伺服器錯誤';
			throw new Error(message);
		}
	}

	async function register(registerData: UserRegisterData) {
		const userRegister = useUserRegister();
		try {
			const response = await userRegister.register(registerData);
			return response;
		}
		catch (err: unknown) {
			const message = (err as { data?: { message?: string }, message?: string })?.data?.message || (err as { message?: string })?.message || '註冊失敗：伺服器錯誤';
			throw new Error(message);
		}
	}

	async function logout() {
		try {
			// 先呼叫外部後端登出 API
			await $fetch('/api/v1/users/logout', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			})

			// 外部後端成功後，才清除前端狀態
			user.value = null;
			userCookie.value = null;
			token.value = null;
			tokenCookie.value = null;

			// 顯示成功訊息
			if (import.meta.client) {
				ElMessage({
					type: 'success',
					message: '登出成功',
					duration: 3000,
				})
			}
		}
		catch (error: any) {
			// 外部後端失敗時，保持前端狀態不變，並忠實揭露錯誤
			const errorMessage = error.data?.message || error.message || '登出失敗，請稍後再試'

			if (import.meta.client) {
				ElMessage({
					type: 'error',
					message: `登出失敗：${errorMessage}`,
					duration: 5000,
				})
			}

			// 重新拋出錯誤，讓調用者知道登出失敗
			throw new Error(`登出失敗：${errorMessage}`)
		}
	}

	// 檢查使用者登入狀態的函數
	async function fetchUser() {
		// 如果已有 token 和 user，則認為已登入
		if (token.value && user.value) {
			return;
		}

		// 如果沒有 token，則清除登入狀態
		if (!token.value) {
			await logout();
			return;
		}

		// 可以在此處添加對後端的驗證請求
		// 目前簡化為檢查本地狀態
	}

	return {
		user,
		token,
		isLoggedIn,
		login,
		loginWithGoogleToken,
		register,
		logout,
		fetchUser,
	};
});
