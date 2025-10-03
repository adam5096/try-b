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
 * 端點: POST /api/v1/payments/result
 * 用途: 向 ASP.NET 後端取得結帳結果
 */
export default createApiHandler(async (event) => {
	try {
		// 取得請求主體
		const body = await readBody(event);
		const { TradeInfo, TradeSha } = body;

		console.log('[結帳結果 API] 收到請求:', {
			hasTradeInfo: !!TradeInfo,
			hasTradeSha: !!TradeSha,
			tradeInfoPreview: TradeInfo ? (TradeInfo as string).substring(0, 20) + '...' : 'none',
		});

		// 驗證必要參數
		if (!TradeInfo || !TradeSha) {
			console.error('[結帳結果 API] 缺少必要參數:', { TradeInfo: !!TradeInfo, TradeSha: !!TradeSha });
			return {
				status: 'Failed',
				error: '缺少 TradeInfo 或 TradeSha 參數',
			};
		}

		// 準備請求資料
		const requestData = {
			TradeInfo: TradeInfo as string,
			TradeSha: TradeSha as string,
		};

		console.log('[結帳結果 API] 準備向 ASP.NET 後端請求:', {
			tradeInfoLength: (TradeInfo as string).length,
			tradeShaLength: (TradeSha as string).length,
		});

		// 呼叫 ASP.NET 後端 API (使用 POST 方法)
		const response: PaymentResultResponse = await event.$fetch<PaymentResultResponse>('/api-proxy/api/v1/payments/result', {
			method: 'POST',
			headers: getForwardHeaders(event),
			body: requestData,
		});

		console.log('[結帳結果 API] ASP.NET 後端回應:', response);

		// 格式化回應資料以符合前端需求
		const formattedResponse: PaymentResultResponse = {
			status: response.status || 'Failed',
			orderNo: response.orderNo || '',
			amount: response.amount || '',
			paymentMethod: response.paymentMethod || 'CREDIT',
			card4No: response.card4No || undefined,
		};

		console.log('[結帳結果 API] 格式化回應:', formattedResponse);

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
			error: errorMessage,
			orderNo: '',
			amount: '',
			paymentMethod: 'CREDIT',
		};
	}
});
