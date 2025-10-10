// 藍新金流付款相關型別定義

// 建立訂單請求
export interface CreatePaymentRequest {
	plan_id: number
	company_id: number
}

// 建立訂單回應
export interface CreatePaymentResponse {
	Status: boolean
	OrderNum: string
	PaymentData: {
		MerchantID: string
		TradeInfo: string
		TradeSha: string
		Version: string
	}
	PayGetWay: string
}

// 藍新金流回調資料 (POST /api/v1/callback)
// 根據藍新金流技術文件 4-2 MPG 交易規範
export interface NewebPayCallbackRequest {
	TradeInfo: string // 交易資料 (已加密)
	TradeSha: string // 交易資料 SHA256 雜湊值
	Status: 'SUCCESS' | 'FAILED' // 交易狀態
}

// 付款結果查詢回應 (GET /api/v1/callback)
export interface PaymentResultResponse {
	OrderNum: string
	CompanyId: number
	PlanId: number
	PaymentStatus: 'Paid' | 'Pending' | 'Failed'
	OrderStatus: 'Active' | 'Inactive'
	PaymentMethod: 'CREDIT' | 'CVS' | 'ATM' | 'SUBSCRIPTION'
	Card4No?: string
}

// 結帳結果請求 (POST /api/v1/payments/result)
export interface PaymentResultRequest {
	OrderNo: string
	TradeInfo: string
	TradeSha: string
}

// 結帳結果回應 (GET /api/v1/payments/result)
export interface PaymentResultResponseNew {
	status: 'Success' | 'Failed' | 'Pending'
	orderNo: string
	amount: string
	paymentMethod: 'CREDIT' | 'CVS' | 'ATM' | 'SUBSCRIPTION'
	card4No?: string
}

// 付款結果導引回應 (GET /api/v1/payments/result) - 舊版保持相容
export interface PaymentRedirectResponse {
	Message: string
	RedirectUrl: string
	TradeInfo?: string
	TradeSha?: string
}

// 付款狀態枚舉
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

// 付款方式枚舉
export type PaymentMethod = 'CREDIT' | 'CVS' | 'ATM' | 'SUBSCRIPTION'

// 藍新金流表單提交資料
export interface NewebPayFormData {
	MerchantID: string
	TradeInfo: string
	TradeSha: string
	Version: string
}
