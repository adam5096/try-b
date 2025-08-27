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

#### 企業端-體驗者審核 (e-comp-17)
- 建立 `useSubmitReview.ts` Composable 封裝審核提交 (`PUT`) 的 API 邏輯，並處理 loading 與 error 狀態。
- 於申請者詳情頁 (`[applicantId].vue`) 串接審核功能，提交後以 `ElMessageBox` 彈窗提供即時成功或失敗的反饋，並在成功後自動導航回列表頁。
- 修正 `useSubmitReview` Composable，改用共用的 `useApiFetch` 以確保請求能自動夾帶 JWT token，解決 API 回應「請登入」的認證問題。
- 導入 Element Plus 的表單驗證機制，為「審核意見」欄位加入必填規則，取代原有的手動 `if` 判斷，以解決後端回應 `400 Bad Request` (缺少 `comment` 欄位) 的問題。
- 於申請者列表頁 (`applicants/index.vue`) 的 `onMounted` 生命週期中呼叫 `refresh` 方法，確保從審核頁返回時能強制刷新列表，即時反映最新的審核狀態。

#### 體驗者端-使用者登入 (u-users-1)
- 建立 `useUserLogin.ts` Composable 封裝使用者登入 API (`/api/v1/users/login`) 的請求邏輯。
- 重構共用 API 請求函式 (`useApiFetch.ts`)，使其能根據請求 URL (`/user` 或 `/company`) 自動附加對應模組的 JWT token，解決了模組間 token 錯亂的潛在衝突。
- 更新 `useUserAuthStore` 以整合新的登入邏輯，並使其結構與 `company` 模組一致，同步管理 `token` 與 `user` 狀態。
- 修正 `nuxt.config.ts` 中的 Vite 代理設定，解決了開發環境中因代理規則不符而導致的 API 請求 404 錯誤。
- 優化登入頁面 (`login.vue`) 的使用者體驗，透過 `watchEffect` 監聽登入狀態，實現成功登入後自動導航至使用者首頁。

