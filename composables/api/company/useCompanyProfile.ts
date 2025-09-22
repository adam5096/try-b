import type { CompanyProfile } from '~/types/company/company';

/**
 * 取得登入企業帳號相關基本資訊
 * 對應 API: GET /api/v1/company
 */
export const useCompanyProfile = () => {
	// 取得 company auth token 來設定 headers
	const tokenCookie = useCookie<string | null>('companyAuthToken');

	return useFetch<CompanyProfile>('/api/v1/company', {
		key: 'company-profile',
		server: true,
		lazy: false,
		headers: computed(() => {
			const headers: Record<string, string> = {};
			if (tokenCookie.value) {
				headers.authorization = `Bearer ${tokenCookie.value}`;
			}
			return headers;
		}),
	});
};
