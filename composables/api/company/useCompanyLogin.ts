import type { LoginData, CompanyLoginResponse } from '~/types/company/company';

export const useCompanyLogin = () => {
	async function login(loginData: LoginData) {
		// 使用 $fetch 直接呼叫本地 BFF 端點
		return await $fetch<CompanyLoginResponse>('/api/v1/company/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body: {
				identifier: loginData.account,
				password: loginData.psd,
			},
		});
	}

	return { login };
};
