import type {
	CreatePaymentRequest,
	CreatePaymentResponse,
	PaymentResultResponse,
	PaymentResultResponseNew,
	PaymentResultRequest,
	PaymentRedirectResponse,
	NewebPayFormData,
} from '~/types/company/payment'

export const useCompanyPayment = () => {
	// 使用 Pinia store 取得認證狀態，而不是直接讀取 cookie
	const authStore = useCompanyAuthStore()

	/**
	 * 建立付款訂單
	 * @param paymentData 付款請求資料
	 * @returns 藍新金流付款資料
	 */
	const createPayment = async (paymentData: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
		try {
			const headers: Record<string, string> = {}

			if (authStore.token) {
				headers.authorization = `Bearer ${authStore.token}`
			}

			// 使用 $fetch 直接呼叫本地 BFF 端點
			const response = await $fetch<CreatePaymentResponse>('/api/v1/company/payments/payments', {
				method: 'POST',
				headers,
				body: paymentData,
			})

			if (!response.Status) {
				throw new Error('建立付款訂單失敗')
			}

			return response
		}
		catch (error) {
			console.error('建立付款訂單錯誤:', error)
			throw new Error('建立付款訂單時發生錯誤，請稍後再試')
		}
	}

	/**
	 * 查詢付款結果
	 * @param orderNum 訂單編號
	 * @returns 付款結果
	 */
	const getPaymentResult = async (orderNum: string): Promise<PaymentResultResponse> => {
		try {
			const headers: Record<string, string> = {}

			if (authStore.token) {
				headers.authorization = `Bearer ${authStore.token}`
			}

			const response = await $fetch<PaymentResultResponse>('/api/v1/payments/callback', {
				method: 'GET',
				headers,
				params: {
					orderNum,
					company_id: authStore.companyId,
					companyId: authStore.companyId, // 嘗試不同的參數名稱
					companyID: authStore.companyId, // 另一種格式
				},
			})

			return response
		}
		catch (error) {
			console.error('查詢付款結果錯誤:', error)

			// 提供更詳細的錯誤資訊
			if (error instanceof Error) {
				console.error('錯誤詳情:', {
					message: error.message,
					orderNum,
					companyId: authStore.companyId,
					hasToken: !!authStore.token,
				})
			}

			throw new Error('查詢付款結果時發生錯誤，請稍後再試')
		}
	}

	/**
	 * 取得結帳結果 (使用 OrderNo、TradeInfo 和 TradeSha)
	 * @param orderNo 訂單編號
	 * @param tradeInfo 交易資訊
	 * @param tradeSha 交易 SHA256 雜湊值
	 * @returns 結帳結果
	 */
	const getPaymentResultByTradeInfo = async (orderNo: string, tradeInfo: string, tradeSha: string): Promise<PaymentResultResponseNew> => {
		try {
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
			}

			if (authStore.token) {
				headers.authorization = `Bearer ${authStore.token}`
			}

			const response = await $fetch<PaymentResultResponseNew>('/api/v1/company/payments/result', {
				method: 'POST',
				headers,
				body: {
					TradeInfo: tradeInfo,
					TradeSha: tradeSha,
				},
			})

			return response
		}
		catch (error) {
			console.error('查詢結帳結果錯誤:', error)

			// 檢查是否為 API 回應錯誤（包含完整技術細節）
			if (error && typeof error === 'object' && 'error' in error) {
				const apiError = error as any;

				// 記錄完整技術錯誤資訊
				console.error('API 完整技術錯誤資訊:', {
					type: apiError.error?.type,
					message: apiError.error?.message,
					technicalDetails: apiError.error?.technicalDetails,
					timestamp: apiError.error?.timestamp,
					environment: apiError.error?.environment,
					vercelRegion: apiError.error?.vercelRegion,
					requestId: apiError.error?.requestId,
				});

				// 完整揭露技術細節給開發人員
				const techDetails = apiError.error?.technicalDetails;
				const fullErrorMessage = `查詢結帳結果失敗: ${apiError.error?.message} 
錯誤類型: ${apiError.error?.type}
HTTP 狀態: ${techDetails?.httpStatus}
目標端點: ${techDetails?.endpoint}
請求方法: ${techDetails?.requestMethod}
原始錯誤: ${techDetails?.originalError}
建議解決方案: ${techDetails?.suggestion}
健康檢查: ${techDetails?.healthCheck}
可能原因: ${techDetails?.possibleCauses?.join(', ')}
環境: ${apiError.error?.environment}
Vercel 區域: ${apiError.error?.vercelRegion}
請求 ID: ${apiError.error?.requestId}
時間戳: ${apiError.error?.timestamp}`;

				throw new Error(fullErrorMessage);
			}

			// 提供更詳細的錯誤資訊
			if (error instanceof Error) {
				console.error('錯誤詳情:', {
					message: error.message,
					orderNo,
					tradeInfoLength: tradeInfo.length,
					tradeShaLength: tradeSha.length,
					hasToken: !!authStore.token,
				})
			}

			throw new Error('查詢結帳結果時發生錯誤，請稍後再試')
		}
	}

	/**
	 * 自動提交表單到藍新金流 MPG 交易
	 * @param paymentData 藍新金流付款資料
	 * @param payGetWay 付款閘道 URL
	 */
	const submitToNewebPay = (paymentData: NewebPayFormData, payGetWay: string): void => {
		// 建立隱藏表單
		const form = document.createElement('form')
		form.method = 'POST'
		form.action = payGetWay
		form.style.display = 'none'
		// 移除 target='_blank'，改為在當前視窗提交，讓藍新金流完成後能回到原付款頁面
		form.target = '_self' // 預設就是當前視窗，可以不設定

		// 根據藍新金流 MPG 交易規範添加表單欄位
		// MerchantID: 商店代號
		const merchantIdInput = document.createElement('input')
		merchantIdInput.type = 'hidden'
		merchantIdInput.name = 'MerchantID'
		merchantIdInput.value = paymentData.MerchantID
		form.appendChild(merchantIdInput)

		// TradeInfo: 交易資料 (已加密)
		const tradeInfoInput = document.createElement('input')
		tradeInfoInput.type = 'hidden'
		tradeInfoInput.name = 'TradeInfo'
		tradeInfoInput.value = paymentData.TradeInfo
		form.appendChild(tradeInfoInput)

		// TradeSha: 交易資料 SHA256 雜湊值
		const tradeShaInput = document.createElement('input')
		tradeShaInput.type = 'hidden'
		tradeShaInput.name = 'TradeSha'
		tradeShaInput.value = paymentData.TradeSha
		form.appendChild(tradeShaInput)

		// Version: 串接程式版本
		const versionInput = document.createElement('input')
		versionInput.type = 'hidden'
		versionInput.name = 'Version'
		versionInput.value = paymentData.Version
		form.appendChild(versionInput)

		// 提交表單到藍新金流
		document.body.appendChild(form)
		form.submit()

		// 清理表單元素
		setTimeout(() => {
			document.body.removeChild(form)
		}, 1000)
	}

	return {
		createPayment,
		getPaymentResult,
		getPaymentResultByTradeInfo,
		submitToNewebPay,
	}
}
