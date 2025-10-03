# 藍新金流後端整合指南 (ASP.NET C#)

## 給後端開發者

本文檔說明 ASP.NET (C#) 後端需要如何配合修改，以確保藍新金流付款流程正常運作。

---

## 問題說明

### 當前問題

藍新金流付款完成後，用戶被跳轉到錯誤的頁面，無法正確顯示付款結果。

### 根本原因

**ReturnURL 設置錯誤**：
- ❌ 目前可能設置為：`https://try-b.vercel.app/company/purchase/success`
- 問題：這是 Vue 前端頁面，無法接收 POST 請求的 body 數據
- 說明：藍新金流通過 **POST 表單** 提交交易數據到 ReturnURL

**正確做法**：
- ✅ 應該設置為：`https://try-b.vercel.app/api/v1/company/payments/return`
- 這是 API endpoint，能接收 POST 數據
- 處理後會重定向到前端頁面

---

## 必須修改的位置

### 位置 1：建立付款訂單 API

**檔案**：`PaymentController.cs` 或類似的付款控制器

**方法**：`CreatePayment` 或 `POST /api/v1/payments`

#### ❌ 錯誤的實作

```csharp
[HttpPost]
[Route("api/v1/payments")]
public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
{
    // 建立訂單
    var order = new Order
    {
        OrderNumber = GenerateOrderNumber(),
        CompanyId = request.CompanyId,
        PlanId = request.PlanId,
        Amount = GetPlanPrice(request.PlanId),
        Status = "Pending"
    };
    
    await _dbContext.Orders.AddAsync(order);
    await _dbContext.SaveChangesAsync();
    
    // 準備藍新金流資料
    var tradeInfo = new
    {
        MerchantID = _config["NewebPay:MerchantID"],
        RespondType = "JSON",
        TimeStamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
        Version = "2.0",
        MerchantOrderNo = order.OrderNumber,
        Amt = order.Amount,
        ItemDesc = GetPlanDescription(request.PlanId),
        
        // ❌ 錯誤：直接指向前端頁面
        ReturnURL = "https://try-b.vercel.app/company/purchase/success",
        NotifyURL = "https://try-b.vercel.app/api/v1/company/payments/callback",
        
        Email = GetCompanyEmail(request.CompanyId)
    };
    
    // ... 加密和回傳
}
```

**問題**：
- ReturnURL 指向 Vue 頁面，無法接收 POST 數據
- 導致交易資料丟失

#### ✅ 正確的實作

```csharp
[HttpPost]
[Route("api/v1/payments")]
public async Task<IActionResult> CreatePayment([FromBody] PaymentRequest request)
{
    // 建立訂單
    var order = new Order
    {
        OrderNumber = GenerateOrderNumber(),
        CompanyId = request.CompanyId,
        PlanId = request.PlanId,
        Amount = GetPlanPrice(request.PlanId),
        Status = "Pending",
        CreatedAt = DateTime.UtcNow
    };
    
    await _dbContext.Orders.AddAsync(order);
    await _dbContext.SaveChangesAsync();
    
    // 準備藍新金流資料
    var tradeInfo = new Dictionary<string, string>
    {
        ["MerchantID"] = _config["NewebPay:MerchantID"],
        ["RespondType"] = "JSON",
        ["TimeStamp"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
        ["Version"] = "2.0",
        ["MerchantOrderNo"] = order.OrderNumber,
        ["Amt"] = order.Amount.ToString(),
        ["ItemDesc"] = GetPlanDescription(request.PlanId),
        
    // ✅ 正確：指向前端的 API endpoint（前端已實作）
    ["ReturnURL"] = "https://try-b.vercel.app/api/v1/company/payments/return",
    
    // ✅ 正確：指向後端的 API endpoint（後端需實作）
    ["NotifyURL"] = "https://trybeta.rocket-coding.com/api/v1/payments/callback",
        
        ["Email"] = GetCompanyEmail(request.CompanyId),
        
        // 其他必要參數
        ["LoginType"] = "0",
        ["CREDIT"] = "1"  // 啟用信用卡付款
    };
    
    // 加密 TradeInfo
    string encryptedTradeInfo = EncryptTradeInfo(tradeInfo);
    string tradeSha = GenerateTradeSha(encryptedTradeInfo);
    
    // 回傳給前端
    var response = new
    {
        Status = true,
        OrderNum = order.OrderNumber,
        PaymentData = new
        {
            MerchantID = _config["NewebPay:MerchantID"],
            TradeInfo = encryptedTradeInfo,
            TradeSha = tradeSha,
            Version = "2.0"
        },
        PayGetWay = _config["NewebPay:Gateway"]  // 藍新金流閘道 URL
    };
    
    return Ok(response);
}
```

**關鍵修改**：
1. `ReturnURL` 改為 `https://try-b.vercel.app/api/v1/company/payments/return`
2. `NotifyURL` 改為 `https://try-b.vercel.app/api/v1/payments/callback`
3. 確保訂單號被正確保存到資料庫

---

### 位置 2：NotifyURL 回調處理

**檔案**：`PaymentController.cs`

**方法**：`HandleNotifyCallback` 或 `POST /api/v1/payments/callback`

#### 完整實作範例

```csharp
[HttpPost]
[Route("api/v1/payments/callback")]
public async Task<IActionResult> HandleNotifyCallback()
{
    try
    {
        // 1. 讀取 POST 數據
        var formData = await Request.ReadFormAsync();
        var status = formData["Status"].ToString();
        var tradeInfo = formData["TradeInfo"].ToString();
        var tradeSha = formData["TradeSha"].ToString();
        
        _logger.LogInformation($"[藍新金流 NotifyURL] 收到回調: Status={status}");
        
        // 2. 驗證簽名
        if (!VerifyTradeSha(tradeInfo, tradeSha))
        {
            _logger.LogError("[藍新金流 NotifyURL] 簽名驗證失敗");
            return BadRequest(new { Status = "ERROR", Message = "Invalid signature" });
        }
        
        // 3. 解密 TradeInfo
        var decryptedData = DecryptTradeInfo(tradeInfo);
        var paymentData = JsonSerializer.Deserialize<NewebPayNotifyData>(decryptedData);
        
        if (paymentData == null)
        {
            _logger.LogError("[藍新金流 NotifyURL] 解密數據失敗");
            return BadRequest(new { Status = "ERROR", Message = "Invalid data" });
        }
        
        // 4. 更新訂單狀態
        var order = await _dbContext.Orders
            .FirstOrDefaultAsync(o => o.OrderNumber == paymentData.MerchantOrderNo);
        
        if (order == null)
        {
            _logger.LogError($"[藍新金流 NotifyURL] 找不到訂單: {paymentData.MerchantOrderNo}");
            return NotFound(new { Status = "ERROR", Message = "Order not found" });
        }
        
        // 更新訂單資訊
        order.Status = paymentData.Status == "SUCCESS" ? "Paid" : "Failed";
        order.PaymentMethod = paymentData.PaymentType ?? "CREDIT";
        order.Card4No = paymentData.Card4Number;
        order.PaymentCompletedAt = DateTime.UtcNow;
        order.NewebPayTradeNo = paymentData.TradeNo;
        order.NewebPayRawData = decryptedData;
        
        await _dbContext.SaveChangesAsync();
        
        _logger.LogInformation($"[藍新金流 NotifyURL] 訂單狀態已更新: {order.OrderNumber} -> {order.Status}");
        
        // 5. 回應藍新金流
        return Ok(new { Status = "SUCCESS" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "[藍新金流 NotifyURL] 處理回調時發生錯誤");
        return StatusCode(500, new { Status = "ERROR", Message = ex.Message });
    }
}
```

---

### 位置 3：查詢付款結果 API

**檔案**：`PaymentController.cs`

**方法**：`GetPaymentResult` 或 `GET /api/v1/payments/callback`

#### 完整實作範例

```csharp
[HttpGet]
[Route("api/v1/payments/callback")]
public async Task<IActionResult> GetPaymentResult([FromQuery] string orderNum)
{
    if (string.IsNullOrEmpty(orderNum))
    {
        return BadRequest(new { error = "訂單編號不可為空" });
    }
    
    // 從資料庫查詢訂單
    var order = await _dbContext.Orders
        .Include(o => o.Company)
        .Include(o => o.Plan)
        .FirstOrDefaultAsync(o => o.OrderNumber == orderNum);
    
    if (order == null)
    {
        return NotFound(new { error = "找不到訂單" });
    }
    
    // 回傳訂單資訊
    var response = new
    {
        OrderNum = order.OrderNumber,
        CompanyId = order.CompanyId,
        PlanId = order.PlanId,
        PaymentStatus = order.Status,  // "Paid" | "Pending" | "Failed"
        OrderStatus = order.IsActive ? "Active" : "Inactive",
        PaymentMethod = order.PaymentMethod ?? "CREDIT",
        Card4No = order.Card4No
    };
    
    return Ok(response);
}
```

---

## 加密解密實作

### AES 加密（TradeInfo）

```csharp
private string EncryptTradeInfo(Dictionary<string, string> data)
{
    // 將資料轉換為查詢字串格式
    var queryString = string.Join("&", data.Select(kvp => 
        $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));
    
    var hashKey = _config["NewebPay:HashKey"];
    var hashIV = _config["NewebPay:HashIV"];
    
    using (var aes = Aes.Create())
    {
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = Encoding.UTF8.GetBytes(hashKey);
        aes.IV = Encoding.UTF8.GetBytes(hashIV);
        
        using (var encryptor = aes.CreateEncryptor())
        using (var msEncrypt = new MemoryStream())
        {
            using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
            using (var swEncrypt = new StreamWriter(csEncrypt))
            {
                swEncrypt.Write(queryString);
            }
            
            var encrypted = msEncrypt.ToArray();
            return BitConverter.ToString(encrypted).Replace("-", "").ToLower();
        }
    }
}
```

### AES 解密（TradeInfo）

```csharp
private string DecryptTradeInfo(string encryptedData)
{
    var hashKey = _config["NewebPay:HashKey"];
    var hashIV = _config["NewebPay:HashIV"];
    
    var encryptedBytes = Enumerable.Range(0, encryptedData.Length / 2)
        .Select(x => Convert.ToByte(encryptedData.Substring(x * 2, 2), 16))
        .ToArray();
    
    using (var aes = Aes.Create())
    {
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.Key = Encoding.UTF8.GetBytes(hashKey);
        aes.IV = Encoding.UTF8.GetBytes(hashIV);
        
        using (var decryptor = aes.CreateDecryptor())
        using (var msDecrypt = new MemoryStream(encryptedBytes))
        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
        using (var srDecrypt = new StreamReader(csDecrypt))
        {
            return srDecrypt.ReadToEnd();
        }
    }
}
```

### SHA256 簽名（TradeSha）

```csharp
private string GenerateTradeSha(string encryptedTradeInfo)
{
    var hashKey = _config["NewebPay:HashKey"];
    var hashIV = _config["NewebPay:HashIV"];
    
    var rawData = $"HashKey={hashKey}&{encryptedTradeInfo}&HashIV={hashIV}";
    
    using (var sha256 = SHA256.Create())
    {
        var bytes = Encoding.UTF8.GetBytes(rawData);
        var hash = sha256.ComputeHash(bytes);
        return BitConverter.ToString(hash).Replace("-", "").ToUpper();
    }
}

private bool VerifyTradeSha(string encryptedTradeInfo, string tradeSha)
{
    var calculatedSha = GenerateTradeSha(encryptedTradeInfo);
    return calculatedSha.Equals(tradeSha, StringComparison.OrdinalIgnoreCase);
}
```

---

## 資料模型

### PaymentRequest (請求)

```csharp
public class PaymentRequest
{
    public int PlanId { get; set; }
    public int CompanyId { get; set; }
}
```

### NewebPayNotifyData (藍新金流回調數據)

```csharp
public class NewebPayNotifyData
{
    public string Status { get; set; }  // "SUCCESS" | "FAILED"
    public string MerchantID { get; set; }
    public string MerchantOrderNo { get; set; }
    public decimal Amt { get; set; }
    public string TradeNo { get; set; }
    public string PaymentType { get; set; }  // "CREDIT", "WEBATM", etc.
    public string Card4Number { get; set; }  // 卡號末四碼
    public string PayTime { get; set; }
}
```

### Order (資料庫模型)

```csharp
public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public int CompanyId { get; set; }
    public int PlanId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; }  // "Pending" | "Paid" | "Failed"
    public string PaymentMethod { get; set; }
    public string Card4No { get; set; }
    public string NewebPayTradeNo { get; set; }
    public string NewebPayRawData { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaymentCompletedAt { get; set; }
    public bool IsActive { get; set; }
    
    // Navigation properties
    public Company Company { get; set; }
    public Plan Plan { get; set; }
}
```

---

## 設定檔配置

### appsettings.json

```json
{
  "NewebPay": {
    "MerchantID": "MS123456789",
    "HashKey": "your-hash-key-here",
    "HashIV": "your-hash-iv-here",
    "Gateway": "https://ccore.newebpay.com/MPG/mpg_gateway",
    "Version": "2.0"
  }
}
```

**測試環境**：
- Gateway: `https://ccore.newebpay.com/MPG/mpg_gateway`

**正式環境**：
- Gateway: `https://core.newebpay.com/MPG/mpg_gateway`

---

## 完整付款流程

### 1. 前端請求建立訂單
```
POST /api/v1/payments
{
  "plan_id": 2,
  "company_id": 1
}
```

### 2. 後端建立訂單並回傳加密數據
```json
{
  "Status": true,
  "OrderNum": "ORD202510010001",
  "PaymentData": {
    "MerchantID": "MS123456789",
    "TradeInfo": "加密字串...",
    "TradeSha": "SHA256簽名...",
    "Version": "2.0"
  },
  "PayGetWay": "https://ccore.newebpay.com/MPG/mpg_gateway"
}
```

### 3. 前端提交到藍新金流
- 前端自動建立表單並提交

### 4. 用戶完成付款

### 5. 藍新金流回調（兩個）

**A. NotifyURL（後端接收）**
```
POST /api/v1/payments/callback
- 後端解密並更新訂單狀態
- 回應 {"Status": "SUCCESS"}
```

**B. ReturnURL（前端接收）**
```
POST /api/v1/company/payments/return
- 前端 server endpoint 接收
- 重定向到 /company/purchase/success?order=xxx
```

### 6. 前端查詢結果
```
GET /api/v1/payments/callback?orderNum=ORD202510010001
- 顯示付款結果
```

---

## 測試檢查清單

### 後端開發者必須確認

- [ ] `CreatePayment` API 中 `ReturnURL` 設為 `https://try-b.vercel.app/api/v1/company/payments/return`
- [ ] `CreatePayment` API 中 `NotifyURL` 設為 `https://try-b.vercel.app/api/v1/payments/callback`
- [ ] NotifyURL 處理程式能正確解密和驗證
- [ ] 訂單狀態能正確更新到資料庫
- [ ] 查詢付款結果 API 回傳正確格式

### 測試步驟

1. **使用 Postman 測試建立訂單**
   ```
   POST https://your-backend.com/api/v1/payments
   Content-Type: application/json
   
   {
     "plan_id": 2,
     "company_id": 1
   }
   ```
   
2. **檢查回應數據**
   - 確認 `OrderNum` 正確生成
   - 確認 `TradeInfo` 和 `TradeSha` 存在
   
3. **模擬藍新金流 NotifyURL 回調**
   - 使用藍新金流測試工具
   - 或手動建立測試數據

4. **檢查資料庫**
   - 訂單狀態是否更新為 "Paid"
   - 付款資訊是否正確儲存

---

## 常見問題

### Q1: 如何產生訂單編號？

```csharp
private string GenerateOrderNumber()
{
    // 格式：ORD + 日期 + 流水號
    var date = DateTime.Now.ToString("yyyyMMdd");
    var sequence = _dbContext.Orders
        .Where(o => o.OrderNumber.StartsWith($"ORD{date}"))
        .Count() + 1;
    
    return $"ORD{date}{sequence:D4}";
}
```

### Q2: 如何處理重複的回調？

```csharp
// 在更新訂單前檢查狀態
if (order.Status == "Paid")
{
    _logger.LogWarning($"訂單已處理: {order.OrderNumber}");
    return Ok(new { Status = "SUCCESS" });  // 仍然回應成功
}
```

### Q3: 如何記錄原始回調數據？

```csharp
order.NewebPayRawData = decryptedData;  // 儲存原始 JSON
order.NewebPayTradeNo = paymentData.TradeNo;  // 藍新金流交易號
```

---

## 需要協助？

如果有任何問題，請聯繫：
- 前端開發者（Nuxt.js 端已完成實作）
- 參考文件：
  - `docs/newebpay-integration.md`
  - `ticket.md` 中的 `e-comp-12` 條目
  - 藍新金流官方文件：「線上交易─幕前支付技術串接手冊_NDNF-1.0.8」

