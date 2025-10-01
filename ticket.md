## e-comp-12 藍新金流付款回調跳轉問題 — 2025-10-01

### 問題摘要

藍新金流付款完成後，預期跳轉到 `/company/purchase/success`，但實際跳轉到 `/company/index`。同時未能接收到藍新金流回傳的交易數據。

### 問題分析

#### 根本原因

1. **ReturnURL 設置位置錯誤**
   - 用戶在藍新金流後台設置 ReturnURL 為 `https://try-b.vercel.app/company/purchase/success`
   - 這是一個 Vue 頁面，無法接收 POST 請求的 body 數據
   - 藍新金流通過 POST 表單提交 `TradeInfo`, `TradeSha`, `Status` 等數據

2. **對 ReturnURL 機制的誤解**
   - ReturnURL 不是 JSON API 端點
   - 是瀏覽器重定向的目標（透過 POST 表單提交）
   - 需要 server endpoint 來接收和處理這些數據

#### 發現方式

- 在瀏覽器開發者工具 Network 面板觀察
- 確認付款完成後的跳轉行為
- 檢查是否有數據傳遞

#### 受影響範圍

- 企業端付款流程
- 無法正確顯示付款結果
- 用戶體驗中斷

### 解決方案

#### 前端修改（已完成）

1. **創建 server endpoint 接收藍新金流回調**
   - 文件：`server/api/v1/company/payments/return.post.ts`
   - 功能：接收 POST 數據，解析後重定向到 success 頁面
   - URL：`/api/v1/company/payments/return`

2. **修改 success 頁面處理多種狀態**
   - 文件：`pages/company/purchase/success.vue`
   - 新增錯誤狀態處理
   - 新增處理中狀態提示
   - 改善用戶體驗訊息

#### 後端需要修改（待實施）

**關鍵修改：**

在建立付款訂單時（ASP.NET `POST /api/v1/payments`），將以下參數加密進 `TradeInfo`：

```csharp
var tradeInfo = new Dictionary<string, string>
{
    ["MerchantID"] = _config["NewebPay:MerchantID"],
    ["Amt"] = order.Amount.ToString(),
    ["ItemDesc"] = GetPlanDescription(request.PlanId),
    // ⬇️ 關鍵修改：ReturnURL 改為前端 API endpoint
    ["ReturnURL"] = "https://try-b.vercel.app/api/v1/company/payments/return",
    // NotifyURL 改為後端 API endpoint
    ["NotifyURL"] = "https://trybeta.rocket-coding.com/api/v1/payments/callback",
    ["Email"] = company.Email,
    // ... 其他參數
};
```

**重要說明：**

1. **ReturnURL** 必須指向能接收 POST 請求的 server endpoint（前端已實作）
2. **NotifyURL** 是背景通知，指向後端 API（後端需實作）
3. ReturnURL 的 endpoint 會重定向到 success 頁面並帶上訂單號

#### 藍新金流回調機制

根據文件 4.2.2 章節：

**NotifyURL（背景通知）：**
- 伺服器對伺服器的通知
- 確保交易結果可靠傳遞
- 後端需實作：`POST /api/v1/payments/callback`

**ReturnURL（前景通知）：**
- 用戶瀏覽器的跳轉目標
- 通過 POST 表單提交數據
- 前端已實作：`POST /api/v1/company/payments/return`

### 測試檢查清單

付款完成後檢查：
- [ ] 瀏覽器是否跳轉到 `/api/v1/company/payments/return`
- [ ] 是否再重定向到 `/company/purchase/success?order=xxx`
- [ ] success 頁面是否顯示正確的付款結果
- [ ] 開發者工具是否能看到完整的請求流程
- [ ] 後端 NotifyURL 是否收到藍新金流的通知
- [ ] 資料庫訂單狀態是否正確更新

### 相關文檔

- 前端技術文檔：`docs/newebpay-integration.md`
- 後端整合指南：`docs/newebpay-backend-aspnet-guide.md`（ASP.NET C# 版本）
- 測試除錯指南：即將創建

### 後續追蹤

- 需要後端開發者修改 ReturnURL 和 NotifyURL 設置
- 測試完整的付款流程
- 確認藍新金流測試環境的行為

---

## u-users-5 單一計畫頁 Fallback 問題紀錄 — 2025-08-29

- **問題摘要**: 列表 API `GET /api-proxy/v1/users/programs` 回傳的每筆 item 只有 `ApplicationId`，缺少可供詳情 API 使用的真正 `program_id`（`Id`/`Program.Id` 皆為空）。因此從列表點擊「查看詳情」時，若誤用 `ApplicationId`（例如 22）請求 `GET /api-proxy/v1/programs/{id}` 會得到 404。

- **發現時機點**: 體驗者首頁 `pages/users/index.vue` 點擊卡片「查看詳情」後，詳情請求返回 404。

- **發現位置、發現方式**: 於瀏覽器開發者工具 Network 面板觀察到請求 `/api-proxy/v1/programs/22` 404；同時在 Console 看到我們加的 `Invalid programId provided...` 紀錄。

- **如何發現的？**: 比對 Postman 成功案例 `GET /api/v1/programs/45` 與前端實際送出的 id（22），確認列表 API 缺少真正的 `program_id`，導致路由至不存在的資源。

- **前端測試了哪些面向？用什麼方法測試？**
  - 點擊首頁 6 張卡片逐一驗證請求 id 與回應狀態（Network）。
  - 以 console 紀錄 `program.Id`/`Program.Id` 解析結果與實際請求路徑。
  - 驗證詳情頁 skeleton 載入、錯誤元件顯示與 store 流程（`useUserProgramDetailStore`）。
  - 交叉驗證 Postman 詳情 API（id=45）可成功取得資料。

- **對使用者影響**: 使用者從列表進入詳情會失敗，流程被中斷並造成困惑；目前僅在開發環境以 fallback 減緩，正式環境仍會受影響。

- **如何定位問題屬於前端或後端？**: 詳情 API 需要 `program_id`，而列表 API 未提供；以 `ApplicationId` 呼叫詳情將必然 404。屬於後端 API 合約/資料缺漏。

- **本次問題受影響範圍？**: 體驗者首頁列表 → 詳情導頁；後續依賴 `program_id` 的功能（收藏、申請、分享、統計）皆可能受阻。

- **目前臨時應對方案？**: 前端在 dev 模式導入 fallback（`program_id=45`），缺少 `programId` 時以之替代以利驗證流程；同時以 `console.log` 輕量提示，不干擾展示。

- **未來完整處理方案？**
  - 後端：於列表 API item 中提供真正的主鍵 `program_id`（建議欄位 `id` 或 `Program: { Id }`），或提供橋接端點 `/v1/users/applications/{applicationId}` 以換取 `programId`。
  - 前端：移除 fallback，改以列表回傳的 `program_id` 正常導頁；維持 id 正規化與錯誤防護；補充 E2E/整合測試覆蓋卡片→詳情全流程。


