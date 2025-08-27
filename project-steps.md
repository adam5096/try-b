( 已經搬移部分內容到 notion )

### 2025-08-27
#### 企業端-申請者列表 (e-comp-7)
- 修正申請者列表頁面 (`applicants/index.vue`) 的表格欄位綁定，使其與 `e-comp-7` API 回應的欄位名稱 (`applicant_name`, `submit_date`, `review_status` 等) 一致，解決資料無法渲染的問題。
- 臨時修復點擊「查看」按鈕時因 API 回應缺少 `applicant_id` 而導致的 500 錯誤，暫時改用 `identity` 作為跳轉參數。
- 優化申請者列表頁面的使用者體驗 (UX)，移除 API 未提供的「科系」與「學校」欄位以避免顯示空白。

#### 企業端-方案頁面 (e-comp-13)
- 串接取得所有企業付費方案的 API (`e-comp-13`)，並動態渲染於方案頁面 (`purchase/index.vue`)。
- 建立獨立的 Composable (`useAllPlans.ts`) 統一管理 API 請求邏輯。
- 重構方案相關的 TypeScript 型別定義，將其拆分為 `plan/current.ts` 與 `plan/list.ts`，並置於 `types/company/plan` 子目錄下，以提高程式碼的清晰度與可維護性。
- 優化方案描述的 UX，為 `description` 欄位為空值的方案提供符合其量級的備用文案，提升頁面資訊完整度與價值感。

