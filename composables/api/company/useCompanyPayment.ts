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

			// 除錯：記錄請求參數
			console.log('[getPaymentResult] 請求參數:', {
				orderNum,
				company_id: authStore.companyId,
				hasToken: !!authStore.token,
				tokenPreview: authStore.token ? authStore.token.substring(0, 20) + '...' : 'none',
			});

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

			console.log('[getPaymentResult] 成功回應:', response);
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
	 * 取得結帳結果 (使用 TradeInfo 和 TradeSha)
	 * @param tradeInfo 交易資訊
	 * @param tradeSha 交易 SHA256 雜湊值
	 * @returns 結帳結果
	 */
	const getPaymentResultByTradeInfo = async (tradeInfo: string, tradeSha: string): Promise<PaymentResultResponseNew> => {
		try {
		const headers: Record<string, string> = {
			'Content-Type': 'application/x-www-form-urlencoded',
		}

		if (authStore.token) {
			headers.authorization = `Bearer ${authStore.token}`
		}

		// 除錯：記錄請求參數
		console.log('[getPaymentResultByTradeInfo] 請求參數:', {
			tradeInfoLength: tradeInfo.length,
			tradeShaLength: tradeSha.length,
			tradeInfoPreview: tradeInfo.substring(0, 20) + '...',
			tradeShaPreview: tradeSha.substring(0, 20) + '...',
			hasToken: !!authStore.token,
		});

		const response = await $fetch<PaymentResultResponseNew>('/api/v1/company/payments/result', {
			method: 'POST',
			headers,
			body: new URLSearchParams({
				TradeInfo: tradeInfo,
				TradeSha: tradeSha,
			}),
		})

			console.log('[getPaymentResultByTradeInfo] 成功回應:', response);
			return response
		}
		catch (error) {
			console.error('查詢結帳結果錯誤:', error)

			// 提供更詳細的錯誤資訊
			if (error instanceof Error) {
				console.error('錯誤詳情:', {
					message: error.message,
					tradeInfoLength: tradeInfo.length,
					tradeShaLength: tradeSha.length,
					hasToken: !!authStore.token,
				})
			}

			throw new Error('查詢結帳結果時發生錯誤，請稍後再試')
		}
	}

	/**
	 * 取得付款導引資訊
	 * @param orderNum 訂單編號
	 * @returns 導引資訊
	 */
	const getPaymentRedirect = async (orderNum: string): Promise<PaymentRedirectResponse> => {
		try {
			const headers: Record<string, string> = {}

			if (authStore.token) {
				headers.authorization = `Bearer ${authStore.token}`
			}

			const response = await $fetch<PaymentRedirectResponse>('/api/v1/company/payments/result', {
				method: 'GET',
				headers,
				params: { orderNum },
			})

			return response
		}
		catch (error) {
			console.error('取得付款導引錯誤:', error)
			throw new Error('取得付款導引時發生錯誤，請稍後再試')
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
		form.target = '_blank' // 在新視窗開啟藍新金流頁面

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

	/**
	 * 驗證信用卡表單
	 * @param cardData 信用卡資料
	 * @returns 驗證結果
	 */
	const validateCreditCard = (cardData: {
		cardNumber: string
		expiryDate: string
		cvc: string
		cardEmail: string
	}): { isValid: boolean, errors: string[] } => {
		const errors: string[] = []

		// 驗證卡號 (移除空格後檢查)
		const cardNumber = cardData.cardNumber.replace(/\s/g, '')
		if (!cardNumber || cardNumber.length !== 16) {
			errors.push('請輸入完整的信用卡號碼')
		}

		// 驗證有效期限
		const expiryDate = cardData.expiryDate.replace(/\s/g, '')
		if (!expiryDate || expiryDate.length !== 5 || !expiryDate.includes('/')) {
			errors.push('請輸入正確的有效期限 (MM/YY)')
		}

		// 驗證 CVC
		if (!cardData.cvc || cardData.cvc.length !== 3) {
			errors.push('請輸入正確的安全碼')
		}

		// 驗證持卡人信箱
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!cardData.cardEmail.trim()) {
			errors.push('請輸入持卡人信箱')
		}
		else if (!emailRegex.test(cardData.cardEmail)) {
			errors.push('請輸入正確的信箱格式')
		}

		return {
			isValid: errors.length === 0,
			errors,
		}
	}

	return {
		createPayment,
		getPaymentResult,
		getPaymentResultByTradeInfo,
		getPaymentRedirect,
		submitToNewebPay,
		validateCreditCard,
	}
}
