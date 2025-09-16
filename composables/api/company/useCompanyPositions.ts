import type { BasicOptionItem } from './useCompanyIndustries';

// 取得職務清單
export const useCompanyPositions = () => {
	// 取得 company auth token 來設定 headers
	const tokenCookie = useCookie<string | null>('companyAuthToken');

	return useFetch<BasicOptionItem[]>('/api/v1/company/positions', {
		key: 'company-positions',
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
}
