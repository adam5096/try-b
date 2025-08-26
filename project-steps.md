( 已經搬移部分內容到 notion )

### 2025-08-27
#### 企業端-申請者列表 (e-comp-7)
- 修正申請者列表頁面 (`applicants/index.vue`) 的表格欄位綁定，使其與 `e-comp-7` API 回應的欄位名稱 (`applicant_name`, `submit_date`, `review_status` 等) 一致，解決資料無法渲染的問題。
- 臨時修復點擊「查看」按鈕時因 API 回應缺少 `applicant_id` 而導致的 500 錯誤，暫時改用 `identity` 作為跳轉參數。

