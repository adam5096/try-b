# 藍新金流串接實作說明

## 概述

本專案已根據藍新金流技術文件「線上交易─幕前支付技術串接手冊_NDNF-1.0.8」完成前端串接實作。

## 技術文件對應

### 4-1 加解密方式
- **前端職責**：不處理加解密，由後端 API 處理
- **後端職責**：使用 HashKey 和 HashIV 進行 AES-256-CBC 加密
- **前端接收**：已加密的 TradeInfo 和 TradeSha

### 4-2 MPG 交易
- **表單提交**：使用 POST 方法提交到藍新金流閘道
- **必要欄位**：MerchantID、TradeInfo、TradeSha、Version
- **目標視窗**：在新視窗開啟藍新金流付款頁面

## API 路徑設定

### 代理轉發配置
- **nuxt.config.ts**: `/api-proxy/**` 代理到 `https://trybeta.rocket-coding.com/**`
- **runtimeConfig**: `apiBase: '/api'` 統一使用 `/api` 前綴
- **BFF 架構**: 前端直接呼叫 `/api/v1/...` 端點，由 Nuxt 處理代理轉發

### API 呼叫方式
所有 API 都使用 `$fetch` 直接呼叫本地 BFF 端點，與現有 API 保持一致：
```typescript
// 正確方式
const response = await $fetch<ResponseType>('/api/v1/payments', {
  method: 'POST',
  headers: { authorization: `Bearer ${token}` },
  body: paymentData,
})

// 錯誤方式 (會導致 404)
const response = await $fetch<ResponseType>('/v1/payments', {
  baseURL: config.public.apiBase, // 會變成 /api/api/v1/payments
})
```

## 前端實作架構

### 1. 型別定義 (`types/company/payment.ts`)

```typescript
// 建立訂單請求 - 包含信用卡資訊
export interface CreatePaymentRequest {
  plan_id: number
  company_id: number
  payment_method: 'CREDIT' | 'APPLEPAY' | 'GOOGLEPAY' | 'CVS' | 'ATM'
  email: string
  // 藍新金流 MPG 交易所需欄位
  card_number?: string
  card_expiry?: string
  card_cvc?: string
  card_email?: string  // 改為 email 而非姓名
}

// 藍新金流回調資料
export interface NewebPayCallbackRequest {
  TradeInfo: string  // 交易資料 (已加密)
  TradeSha: string    // 交易資料 SHA256 雜湊值
  Status: 'SUCCESS' | 'FAILED'  // 交易狀態
}
```

### 2. Composables (`composables/api/company/useCompanyPayment.ts`)

#### 主要功能：
- `createPayment()` - 建立付款訂單
- `submitToNewebPay()` - 自動提交表單到藍新金流
- `validateCreditCard()` - 信用卡表單驗證
- `getPaymentResult()` - 查詢付款結果

#### MPG 交易表單提交：
```typescript
const submitToNewebPay = (paymentData: NewebPayFormData, payGetWay: string): void => {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = payGetWay
  form.target = '_blank' // 在新視窗開啟
  
  // 添加必要欄位
  // MerchantID, TradeInfo, TradeSha, Version
}
```

### 3. 付款頁面 (`pages/company/purchase/payment.vue`)

#### 更新內容：
- **持卡人姓名** → **持卡人信箱**
- 信用卡資訊包含在付款請求中
- 表單驗證包含信箱格式檢查
- 載入狀態和錯誤處理

#### 付款流程：
1. 用戶填寫信用卡資訊（包含信箱）
2. 前端驗證表單
3. 調用建立付款 API
4. 自動提交到藍新金流閘道
5. 用戶在藍新金流完成付款

### 4. 成功頁面 (`pages/company/purchase/success.vue`)

#### 功能：
- 顯示真實付款結果
- 動態狀態顯示（成功/處理中/失敗）
- 整合 `planStore.markPaid()` 邏輯

## 測試環境

### 測試信用卡號：
- `4000221111111111` - 一次付清+分期付款
- `4003551111111111` - 紅利折抵
- `376000000000006` - 美國運通卡

### 測試頁面：
- 路徑：`/company/purchase/test-payment`
- 功能：測試 API 端點

## 後端 API 需求

### 必要端點：
1. `POST /api/v1/company/payments/payments` - 建立付款訂單
2. `POST /api/v1/company/payments/callback` - 處理藍新金流回調
3. `GET /api/v1/company/payments/callback` - 查詢付款結果
4. `GET /api/v1/company/payments/result` - 取得付款導引

### 藍新金流參數：
- MerchantID: 商店代號
- HashKey: 加密金鑰
- HashIV: 初始化向量
- PayGetWay: 付款閘道 URL

## 安全性考量

1. **前端驗證**：信用卡號、有效期限、CVC、信箱格式
2. **按鈕控制**：付款處理期間禁用按鈕
3. **錯誤處理**：完整的錯誤捕獲和用戶友好的錯誤訊息
4. **表單清理**：提交後自動清理 DOM 元素

## 注意事項

1. **加解密處理**：前端不處理加解密，由後端負責
2. **表單提交**：使用隱藏表單自動提交到藍新金流
3. **視窗管理**：在新視窗開啟藍新金流頁面
4. **狀態管理**：付款成功後更新企業方案狀態

## 開發建議

1. 先使用測試環境進行開發
2. 確保後端 API 端點已實作
3. 測試完整的付款流程
4. 確認藍新金流參數配置正確
