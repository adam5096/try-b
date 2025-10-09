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
		// 強制診斷日誌 - 確認線上版本
		console.log('[診斷] result.post.ts 版本: v2025-01-09-完整揭露伺服器細節');

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
			targetUrl: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
			tradeInfoLength: (TradeInfo as string).length,
			tradeShaLength: (TradeSha as string).length,
		});

		// 直接呼叫 ASP.NET 後端 API (使用 JSON 格式，與 Postman 一致)
		const headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		const response: PaymentResultResponse = await event.$fetch<PaymentResultResponse>('https://trybeta.rocket-coding.com/api/v1/payments/result', {
			method: 'POST',
			headers,
			body: {
				TradeInfo: TradeInfo as string,
				TradeSha: TradeSha as string,
			},
		});

		console.log('[結帳結果 API] ASP.NET 後端回應:', response);
		console.log('[結帳結果 API] 回應詳細資訊:', {
			hasStatus: !!response.status,
			hasOrderNo: !!response.orderNo,
			hasAmount: !!response.amount,
			hasPaymentMethod: !!response.paymentMethod,
			hasCard4No: !!response.card4No,
			responseKeys: Object.keys(response),
		});

		// 直接返回後端回應，確保格式一致
		const finalResponse = {
			status: response.status || 'Failed',
			orderNo: response.orderNo || '',
			amount: response.amount || '',
			paymentMethod: response.paymentMethod || '',
			card4No: response.card4No || '',
		};

		console.log('[結帳結果 API] 最終回應:', finalResponse);
		return finalResponse;
	}
	catch (error) {
		console.error('[結帳結果 API] 處理錯誤:', error);

		// 分類錯誤類型並提供完整技術資訊
		let errorType = 'UNKNOWN_ERROR';
		let userMessage = '付款處理中遇到問題，請稍後再試';
		let technicalDetails: any = null;

		if (error instanceof Error) {
			// HTTP 錯誤分類
			if (error.message.includes('415')) {
				errorType = 'CONTENT_TYPE_ERROR';
				userMessage = '付款系統暫時無法處理您的請求，請稍後再試';
				technicalDetails = {
					originalError: '415 Unsupported Media Type',
					httpStatus: 415,
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查 Content-Type header 設定，ASP.NET 後端可能不接受 application/json',
					healthCheck: 'ASP.NET 後端可能不接受當前請求格式',
					possibleCauses: [
						'ASP.NET 後端期望 form-data 而非 JSON',
						'Content-Type header 設定錯誤',
						'ASP.NET 後端 API 規格變更',
					],
				};
			}
			else if (error.message.includes('404')) {
				errorType = 'ENDPOINT_NOT_FOUND';
				userMessage = '付款服務暫時無法使用，請稍後再試';
				technicalDetails = {
					originalError: '404 Not Found',
					httpStatus: 404,
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查 ASP.NET API 端點是否正確',
					healthCheck: 'ASP.NET 後端服務可能未啟動或端點變更',
					possibleCauses: [
						'ASP.NET 後端服務未啟動',
						'API 端點路徑變更',
						'路由設定錯誤',
						'伺服器配置問題',
					],
				};
			}
			else if (error.message.includes('500')) {
				errorType = 'SERVER_ERROR';
				userMessage = '付款服務暫時無法使用，請稍後再試';
				technicalDetails = {
					originalError: '500 Internal Server Error',
					httpStatus: 500,
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查 ASP.NET 後端服務狀態',
					healthCheck: 'ASP.NET 後端可能發生內部錯誤',
					possibleCauses: [
						'ASP.NET 後端內部異常',
						'資料庫連線問題',
						'第三方服務異常',
						'記憶體或資源不足',
					],
				};
			}
			else if (error.message.includes('timeout')) {
				errorType = 'TIMEOUT_ERROR';
				userMessage = '付款處理時間較長，請稍後再確認付款狀態';
				technicalDetails = {
					originalError: 'Request timeout',
					httpStatus: 'TIMEOUT',
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查網路連線或後端回應時間',
					healthCheck: 'ASP.NET 後端回應時間過長',
					possibleCauses: [
						'ASP.NET 後端處理時間過長',
						'網路延遲過高',
						'後端服務負載過重',
						'資料庫查詢超時',
					],
				};
			}
			else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
				errorType = 'CONNECTION_ERROR';
				userMessage = '無法連接到付款服務，請檢查網路連線後再試';
				technicalDetails = {
					originalError: error.message,
					httpStatus: 'CONNECTION_FAILED',
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查 ASP.NET 後端服務是否運行',
					healthCheck: 'ASP.NET 後端服務可能已停止',
					possibleCauses: [
						'ASP.NET 後端服務已停止',
						'網路連線中斷',
						'防火牆阻擋',
						'DNS 解析問題',
					],
				};
			}
			else {
				errorType = 'NETWORK_ERROR';
				userMessage = '網路連線異常，請檢查網路後再試';
				technicalDetails = {
					originalError: error.message,
					httpStatus: 'NETWORK_ERROR',
					endpoint: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
					requestMethod: 'POST',
					suggestion: '檢查網路連線和後端服務',
					healthCheck: '網路連線或 ASP.NET 後端服務異常',
					possibleCauses: [
						'網路連線不穩定',
						'ASP.NET 後端服務異常',
						'代理伺服器問題',
						'SSL/TLS 憑證問題',
					],
				};
			}
		}

		// 建構回應物件 - 完整揭露技術細節
		const response: PaymentResultResponse & { error?: any } = {
			status: 'Failed',
			orderNo: '',
			amount: '',
			paymentMethod: '',
			card4No: '',
			error: {
				type: errorType,
				message: userMessage,
				technicalDetails: technicalDetails,
				timestamp: new Date().toISOString(),
				environment: process.env.NODE_ENV,
				vercelRegion: process.env.VERCEL_REGION || 'unknown',
				requestId: process.env.VERCEL_REQUEST_ID || 'unknown',
			},
		};

		// 記錄完整錯誤資訊到日誌
		console.error('[結帳結果 API] 完整錯誤資訊:', {
			errorType,
			userMessage,
			technicalDetails,
			originalError: error instanceof Error ? error.message : String(error),
			stackTrace: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV,
			vercelRegion: process.env.VERCEL_REGION,
			requestId: process.env.VERCEL_REQUEST_ID,
		});

		return response;
	}
});
