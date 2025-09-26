import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const query = getQuery(event);
	const { orderNum } = query;

	// 驗證必要參數
	if (!orderNum) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing required parameter: orderNum',
		});
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event);

	// 轉發查詢付款結果請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/payments/callback', {
		method: 'GET',
		headers,
		query: { orderNum },
	});

	return backendResponse;
});
