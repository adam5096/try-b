import { createApiHandler } from '~/server/utils/apiHandler';

interface PaymentResultResponse {
	status: string
	orderNo: string
	amount: string
	paymentMethod: string
	card4No?: string
}

/**
 * 取得結帳結果 API 端點
 * 根據 e-comp-12-3 規格書實作
 *
 * 端點: GET /api/v1/company/payments/result
 * 用途: 向 ASP.NET 後端取得結帳結果 (使用 orderNum)
 */
export default createApiHandler(async (event) => {
	try {
		// 取得查詢參數
		const query = getQuery(event);
		const { orderNum } = query;


		// 驗證必要參數
		if (!orderNum) {
			console.error('[結帳結果 API] 缺少必要參數:', { orderNum: !!orderNum });
			return {
				status: 'Failed',
				orderNo: '',
				amount: '',
				paymentMethod: 'CREDIT',
			};
		}


		// 呼叫 ASP.NET 後端 API (使用直連方式)
		const response: PaymentResultResponse = await event.$fetch<PaymentResultResponse>('https://trybeta.rocket-coding.com/api/v1/payments/result', {
			method: 'GET',
			headers: getForwardHeaders(event),
			query: { orderNum },
		});


		// 格式化回應資料以符合前端需求
		const formattedResponse: PaymentResultResponse = {
			status: response.status || 'Failed',
			orderNo: response.orderNo || '',
			amount: response.amount || '',
			paymentMethod: response.paymentMethod || 'CREDIT',
			card4No: response.card4No || undefined,
		};


		return formattedResponse;
	}
	catch (error) {
		console.error('[結帳結果 API] 處理錯誤:', error);

		// 提供詳細的錯誤資訊
		let errorMessage = '取得結帳結果失敗';
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			status: 'Failed',
			orderNo: '',
			amount: '',
			paymentMethod: 'CREDIT',
		};
	}
});
