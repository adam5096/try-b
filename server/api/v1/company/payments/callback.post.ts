import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const body = await readBody(event);
	const { TradeInfo, TradeSha, Status } = body;

	// 驗證藍新金流回調的必要欄位
	if (!TradeInfo || !TradeSha || !Status) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing required fields: TradeInfo, TradeSha, Status',
		});
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event);

	// 轉發藍新金流回調到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/payments/callback', {
		method: 'POST',
		headers,
		body: {
			TradeInfo,
			TradeSha,
			Status,
		},
	});

	return backendResponse;
});
