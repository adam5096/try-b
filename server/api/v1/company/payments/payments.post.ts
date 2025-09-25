import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const body = await readBody(event);
	const { plan_id, company_id } = body;

	// 驗證必要欄位 - 根據規格只需要 plan_id 和 company_id
	if (!plan_id || !company_id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing required fields: plan_id, company_id',
		});
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event);

	// 準備轉發到後端的資料 - 只包含必要欄位
	const paymentData = {
		plan_id,
		company_id,
	};

	// 轉發付款請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/payments', {
		method: 'POST',
		headers,
		body: paymentData,
	});

	return backendResponse;
});