# 藍新金流付款回調問題 - 實作總結

## 問題描述

藍新金流付款完成後，用戶無法正確跳轉到付款成功頁面，導致：
1. 跳轉到錯誤的頁面（`/company/index` 而非 `/company/purchase/success`）
2. 無法顯示付款結果
3. 用戶體驗中斷

---

## 根本原因

**ReturnURL 設置錯誤**：
- ❌ 原本設置：`https://try-b.vercel.app/company/purchase/success`（Vue 頁面）
- 問題：Vue 頁面無法接收 POST 請求的 body 數據
- 說明：藍新金流通過 **POST 表單** 提交數據到 ReturnURL

---

## 解決方案

### ✅ 前端修改（已完成）

#### 1. 創建 ReturnURL 處理端點

**檔案**：`server/api/v1/company/payments/return.post.ts`

**功能**：
- 接收藍新金流的 POST 表單數據
- 驗證必要欄位（Status, TradeInfo, TradeSha）
- 解析訂單編號
- 重定向到 success 頁面並帶上訂單號

**URL**：`POST /api/v1/company/payments/return`

**日誌輸出**：
```
[藍新金流 ReturnURL] 收到回調: { Status: 'SUCCESS', ... }
[藍新金流 ReturnURL] 重定向到 success 頁面: ORD202510010001
```

#### 2. 增強付款成功頁面

**檔案**：`pages/company/purchase/success.vue`

**新增功能**：
- 錯誤狀態處理（`?error=invalid_callback`）
- 處理中狀態提示（`?status=processing`）
- 改善用戶體驗訊息
- 付款成功時顯示成功提示

**狀態處理**：
- `?order=xxx` → 查詢並顯示付款結果
- `?error=xxx` → 顯示錯誤訊息
- `?status=processing` → 顯示處理中提示

---

### 📝 後端需要配合（待實施）

#### 關鍵修改位置

**檔案**：`PaymentController.cs` 或類似的付款控制器

**方法**：`CreatePayment` (建立付款訂單 API)

**修改內容**：

```csharp
// 在建立付款訂單時
var tradeInfo = new Dictionary<string, string>
{
    ["MerchantID"] = _config["NewebPay:MerchantID"],
    ["Amt"] = order.Amount.ToString(),
    ["ItemDesc"] = GetPlanDescription(request.PlanId),
    
    // ✅ 關鍵修改 1：ReturnURL 改為前端 API endpoint
    ["ReturnURL"] = "https://try-b.vercel.app/api/v1/company/payments/return",
    
    // ✅ 關鍵修改 2：NotifyURL 改為後端 API endpoint
    ["NotifyURL"] = "https://trybeta.rocket-coding.com/api/v1/payments/callback",
    
    ["Email"] = company.Email,
    // ... 其他參數
};

// 加密並回傳給前端
string encryptedTradeInfo = EncryptTradeInfo(tradeInfo);
string tradeSha = GenerateTradeSha(encryptedTradeInfo);
```

**重要說明**：
1. **ReturnURL** 必須是前端的 API endpoint（前端已實作）
2. **NotifyURL** 必須是後端的 API endpoint（後端需實作）
3. 兩者缺一不可，確保付款流程完整

---

## 完整付款流程

```
1. 用戶點擊「確認付款」
   ↓
2. 前端請求後端建立訂單
   POST /api/v1/payments
   ↓
3. 後端回傳加密的付款數據
   {
     OrderNum: "ORD202510010001",
     PaymentData: { TradeInfo, TradeSha, ... }
   }
   ↓
4. 前端提交表單到藍新金流
   POST https://ccore.newebpay.com/MPG/mpg_gateway
   ↓
5. 用戶在藍新金流頁面完成付款
   ↓
6A. 藍新金流 NotifyURL 回調（背景通知）
    POST /api/v1/payments/callback
    → 後端更新訂單狀態
   ↓
6B. 藍新金流 ReturnURL 回調（前景通知）
    POST /api/v1/company/payments/return
    → 前端 endpoint 接收數據
    → 重定向到 success 頁面
   ↓
7. 用戶看到付款成功頁面
   GET /company/purchase/success?order=ORD202510010001
   ↓
8. 前端查詢付款結果
   GET /api/v1/payments/callback?orderNum=ORD202510010001
   ↓
9. 顯示完整的付款資訊
```

---

## 檔案清單

### 前端修改（已完成）

1. **`server/api/v1/company/payments/return.post.ts`** ✅ 新增
   - ReturnURL 處理端點

2. **`pages/company/purchase/success.vue`** ✅ 修改
   - 增強狀態處理
   - 改善錯誤訊息

3. **`docs/newebpay-integration.md`** ✅ 更新
   - 更新回調機制說明
   - 新增 URL 設置範例

4. **`docs/newebpay-backend-aspnet-guide.md`** ✅ 新增
   - ASP.NET (C#) 後端整合指南
   - 完整的程式碼範例
   - 加密解密實作

5. **`docs/newebpay-testing-guide.md`** ✅ 新增
   - 測試步驟說明
   - 除錯技巧
   - 檢查清單

6. **`ticket.md`** ✅ 更新
   - 完整的問題追蹤記錄

---

## 測試指南

### 快速測試

1. **確認後端已修改 ReturnURL**
2. **進入付款頁面**：`/company/purchase/payment?planId=2`
3. **開啟開發者工具**（新視窗）
4. **勾選 "Preserve log"**
5. **完成付款流程**
6. **觀察網路流量**：
   ```
   POST /api/v1/company/payments/return (302)
   → GET /company/purchase/success?order=xxx
   ```

### 成功標準

- ✅ 跳轉到正確的 success 頁面
- ✅ URL 包含訂單編號
- ✅ 顯示「付款成功！」訊息
- ✅ 顯示正確的訂單資訊
- ✅ Server 日誌顯示收到回調

---

## 給後端開發者的檢查清單

### 必須修改

- [ ] `CreatePayment` API 中設置 `ReturnURL` 為 `https://try-b.vercel.app/api/v1/company/payments/return`
- [ ] `CreatePayment` API 中設置 `NotifyURL` 為 `https://try-b.vercel.app/api/v1/payments/callback`
- [ ] 實作 `NotifyURL` 回調處理程式
- [ ] 實作解密 TradeInfo 的方法
- [ ] 實作驗證 TradeSha 的方法
- [ ] 確保訂單狀態能正確更新到資料庫

### 測試確認

- [ ] 能成功建立付款訂單
- [ ] 回應包含正確的加密數據
- [ ] NotifyURL 能接收藍新金流的回調
- [ ] 訂單狀態能正確更新
- [ ] 查詢付款結果 API 回傳正確格式

---

## 相關文檔索引

### 技術文檔
- **前端整合說明**：`docs/newebpay-integration.md`
- **後端整合指南**：`docs/newebpay-backend-aspnet-guide.md`（ASP.NET C#）
- **測試除錯指南**：`docs/newebpay-testing-guide.md`

### 問題追蹤
- **問題記錄**：`ticket.md` → `e-comp-12`

### 程式碼檔案
- **ReturnURL 端點**：`server/api/v1/company/payments/return.post.ts`
- **付款成功頁面**：`pages/company/purchase/success.vue`

---

## 下一步行動

### 立即執行

1. **後端開發者**：
   - 閱讀 `docs/newebpay-backend-aspnet-guide.md`
   - 修改建立訂單 API 的 ReturnURL 和 NotifyURL
   - 實作 NotifyURL 回調處理

2. **測試**：
   - 使用測試信用卡進行完整流程測試
   - 確認所有檢查清單項目

3. **部署**：
   - 部署修改後的後端代碼
   - 在測試環境驗證
   - 確認無誤後部署到正式環境

### 驗收標準

- ✅ 付款完成後正確跳轉到 success 頁面
- ✅ 顯示正確的付款結果
- ✅ 訂單狀態正確更新到資料庫
- ✅ NotifyURL 和 ReturnURL 都能正常運作
- ✅ 用戶體驗流暢無中斷

---

## 聯絡與支援

如有任何問題，請參考相關文檔或聯絡：
- 前端開發者（Nuxt.js 端已完成實作）
- 後端開發者（需協助 ASP.NET 端修改）

**最後更新**：2025-10-01

