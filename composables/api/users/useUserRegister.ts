import type { UserRegisterData } from '~/types/users/user';

interface RegisterResponse {
	status: number;
	message: string;
	id: number;
	Role: string;
	Account: string;
	Email: string;
	CreatedAt: string;
	UpdatedAt: string;
}

export const useUserRegister = () => {
	async function register(registerData: UserRegisterData) {
		// 使用 $fetch 直接呼叫本地 BFF 端點
		return await $fetch<RegisterResponse>('/api/v1/users/register', {
			method: 'POST',
			body: registerData,
		});
	}

	return { register };
}
