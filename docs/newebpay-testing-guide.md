# 藍新金流測試指南

## 快速測試步驟

### 測試前準備

1. **確認後端已修改 ReturnURL**
   - 檢查建立訂單 API 中的 `TradeInfo`
   - ReturnURL 應為：`https://try-b.vercel.app/api/v1/company/payments/return`

2. **準備測試信用卡**
   ```
   卡號：4000221111111111
   有效期：12/25（任意未來日期）
   CVC：123（任意三位數）
   ```

---

## 測試流程

### 步驟 1：進入付款頁面

1. 登入企業帳號
2. 前往方案選擇頁面：`/company/purchase`
3. 選擇任一方案
4. 進入付款頁面：`/company/purchase/payment?planId=2`

### 步驟 2：準備開發者工具

**重要**：在新視窗開啟開發者工具

1. 按 F12 開啟開發者工具
2. 切換到 **Network** 面板
3. ✅ **勾選 "Preserve log"**（保留日誌）
4. ✅ **勾選 "Disable cache"**（停用快取）

### 步驟 3：執行付款

1. 點擊「確認付款」按鈕
2. **立即在新開啟的視窗按 F12**
3. 在藍新金流頁面填寫測試卡號
4. 提交付款

### 步驟 4：觀察網路流量

在 Network 面板中，你應該看到：

```
1. POST https://ccore.newebpay.com/MPG/mpg_gateway
   → 提交到藍新金流

2. [藍新金流內部處理]

3. POST /api/v1/company/payments/return  ← 重要！
   Status: 302 Found
   Location: /company/purchase/success?order=xxx

4. GET /company/purchase/success?order=xxx
   → 成功頁面

5. GET /api/v1/company/payments/callback?orderNum=xxx
   → 查詢付款結果
```

### 步驟 5：確認結果

**成功畫面應該顯示**：
- ✅ 「付款成功！」訊息
- ✅ 訂單編號
- ✅ 付款方式（信用卡 + 末四碼）
- ✅ 付款狀態（已付款）

---

## 除錯技巧

### 問題 1：付款後沒有跳轉

**檢查**：
1. 查看 Server 日誌（終端機或 Vercel Logs）
2. 應該看到：`[藍新金流 ReturnURL] 收到回調`

**可能原因**：
- 後端 ReturnURL 設置錯誤
- 前端 endpoint 沒有正確部署

### 問題 2：跳轉到錯誤頁面

**檢查**：
1. Network 面板中 `/api/v1/company/payments/return` 的回應
2. Response Headers 中的 `Location` 欄位

**可能原因**：
- Server endpoint 重定向邏輯錯誤

### 問題 3：看不到付款結果

**檢查**：
1. URL 是否包含 `order` 參數
2. `/api/v1/company/payments/callback` 的回應內容

**可能原因**：
- 訂單編號未正確傳遞
- 後端查詢 API 失敗

---

## 查看 Server 日誌

### 本地開發

在終端機（terminal）中查看：
```
[藍新金流 ReturnURL] 收到回調: {
  Status: 'SUCCESS',
  MerchantID: 'MS123456789',
  hasTradeInfo: true,
  hasTradeSha: true
}
[藍新金流 ReturnURL] 重定向到 success 頁面: ORD202510010001
```

### Vercel 部署

1. 前往 Vercel Dashboard
2. 選擇專案
3. Functions → Logs
4. 搜尋「藍新金流 ReturnURL」

---

## 測試檢查清單

- [ ] 後端已修改 ReturnURL 設置
- [ ] 能成功建立付款訂單
- [ ] 能開啟藍新金流付款頁面
- [ ] 在新視窗開啟了開發者工具並勾選 Preserve log
- [ ] 付款完成後跳轉到 success 頁面
- [ ] success 頁面顯示正確的付款結果
- [ ] Server 日誌顯示收到回調
- [ ] 資料庫訂單狀態已更新（後端確認）

---

## 相關文檔

- 前端技術文檔：`docs/newebpay-integration.md`
- 後端整合指南：`docs/newebpay-backend-aspnet-guide.md`
- 問題追蹤：`ticket.md` → `e-comp-12`

