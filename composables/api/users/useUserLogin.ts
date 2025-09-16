import type { User, UserLoginData } from '~/types/users/user';

// API 回應中的 User 格式（大寫欄位名）
interface ApiUser {
	Id: number;
	Account: string;
	Email: string;
	Role: string;
}

interface LoginResponse {
	status: number;
	message: string;
	token: string;
	user: ApiUser;
}

export const useUserLogin = () => {
	async function login(loginData: UserLoginData) {
		// 使用 $fetch 直接呼叫本地 BFF 端點
		return await $fetch<LoginResponse>('/api/v1/users/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body: {
				identifier: loginData.account,
				password: loginData.password,
			},
		});
  }

	return { login };
};
