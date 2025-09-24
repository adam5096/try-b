import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const body = await readBody(event);
	const { plan_id, company_id, payment_method, email, card_number, card_expiry, card_cvc, card_email } = body;

	// 驗證必要欄位
	if (!plan_id || !company_id || !payment_method || !email) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing required fields: plan_id, company_id, payment_method, email',
		});
	}

	// 如果是信用卡付款，驗證信用卡資訊
	if (payment_method === 'CREDIT') {
		if (!card_number || !card_expiry || !card_cvc || !card_email) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Missing credit card information for CREDIT payment method',
			});
		}
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event);

	// 準備轉發到後端的資料
	const paymentData = {
		plan_id,
		company_id,
		payment_method,
		email,
		...(payment_method === 'CREDIT' && {
			card_number,
			card_expiry,
			card_cvc,
			card_email,
		}),
	};

	// 轉發付款請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/payments', {
		method: 'POST',
		headers,
		body: paymentData,
	});

	return backendResponse;
});
