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
				orderNo: '',
				amount: '',
				paymentMethod: 'CREDIT',
			};
		}

		console.log('[結帳結果 API] 準備向 ASP.NET 後端請求:', {
			tradeInfoLength: (TradeInfo as string).length,
			tradeShaLength: (TradeSha as string).length,
		});

		// 直接呼叫 ASP.NET 後端 API (繞過代理，x-www-form-urlencoded 格式)
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
			'User-Agent': 'Nuxt-App/1.0',
		};

		const response: PaymentResultResponse = await event.$fetch<PaymentResultResponse>('https://trybeta.rocket-coding.com/api/v1/payments/result', {
			method: 'POST',
			headers,
			body: new URLSearchParams({
				TradeInfo: TradeInfo as string,
				TradeSha: TradeSha as string,
			}),
		});

		console.log('[結帳結果 API] ASP.NET 後端回應:', response);

		// 直接返回後端回應，確保格式一致
		return {
			status: response.status || 'Failed',
			orderNo: response.orderNo || '',
			amount: response.amount || '',
			paymentMethod: response.paymentMethod || 'CREDIT',
			card4No: response.card4No || undefined,
		};
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
