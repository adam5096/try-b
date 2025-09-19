import { createApiHandler } from '~/server/utils/apiHandler';

export default createApiHandler(async (event) => {
	try {
		// 透過 Nitro 的 proxy 設定轉發到真實後端
		// 規則：必須包含 api 並使用 /api-proxy 進行代理
		const data = await $fetch('/api-proxy/api/v1/homepage', {
			method: 'GET',
		});

		// 設置快取標頭，提升效能
		setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

		return data;
	}
	catch (error: any) {
		// 資安考量：統一處理所有錯誤，不洩露內部 API endpoint 詳情
		throw createError({
			statusCode: 500,
			statusMessage: '服務暫時無法使用，請稍後再試',
		});
	}
});
