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

#### 通用佈局 (Layouts)
- 修改 `main.vue` 佈局，將「探索我們」按鈕連結至體驗者首頁 (`user-landing`)，提供訪客快速瀏覽主要內容的入口。

#### 體驗者端-使用者註冊 (u-users-10)
- 建立 `useUserRegister.ts` Composable 以封裝註冊 API (`POST /api/v1/users`) 的請求邏輯，遵循專案既有的程式碼風格。
- 更新 `useAuthStore` 中的 `register` 動作，使其使用新建的 Composable 進行 API 呼叫，並加入完整的錯誤處理機制。
- 擴充 `User` TypeScript 型別，加入 `createdAt` 與 `updatedAt` 欄位，使其與後端 API 回應的資料結構保持一致。
- 驗證 `register.vue` 頁面的前端邏輯，確保其在註冊成功後能正確顯示成功訊息並將使用者導向登入頁面。
- 修復 `useAuthStore` 中的 TypeScript 型別推斷錯誤，確保程式碼的健壯性。

### 2025-08-28
#### 體驗者端-體驗計畫總覽 (u-users-3)
- 建立 `useUserPrograms.ts` Composable 封裝取得全部體驗計畫總覽的 API (`/api/v1/users/programs`) 請求邏輯，支援分頁與篩選參數。
- 建立 `useProgramsStore.ts` Pinia store 管理體驗計畫的狀態，包含 `items`、`popular`、`total`、`currentPage` 等資料結構。
- 更新 `pages/users/index.vue` 頁面，將靜態資料替換為動態 API 資料，並實作 `watch` 監聽器觸發資料重新載入。
- 修正欄位映射問題，將 API 回應的大寫欄位名稱 (`program.Name`, `program.CoverImage`, `program.Address` 等) 正確對應到前端顯示需求。
- 新增 `formatProgramDate` 函數處理日期格式化，並加入 `v-if` 檢查防止 SSR 期間的渲染錯誤。

#### API 架構統一與優化
- 統一 Users 與 Company 模塊的 API 架構設計，確保兩個模塊使用一致的認證與請求處理邏輯。
- 建立 `useUserApiFetch.ts` 專用於 Users 模塊的 API 請求處理，自動注入 JWT token 並與 Company 模塊保持一致的架構模式。
- 恢復 Nuxt Vite proxy 配置，解決開發環境中 API 請求的 CORS 與路由問題。
- 修正環境變數 `NUXT_PUBLIC_API_BASE_URL=/api-proxy` 的配置，確保 proxy 轉發功能正常運作。
- 解決登入後路由導航失敗的問題，透過重新實作 `authStore.fetchUser()` 與加入 `middleware: 'user-auth'` 確保認證狀態正確更新。

#### 技術債務與架構改進
- 移除不必要的 `useCompanyApiFetch.ts` 檔案，簡化 API 架構複雜度。
- 更新 `useApiFetch.ts` 共享基礎函數，專注於 Company 模塊的 token 注入邏輯。
- 建立專案 API 架構文件 (`docs/API_ARCHITECTURE.md`)，記錄統一的設計模式與路徑格式。
- 解決 TypeScript 模組載入問題，執行 `pnpm nuxt prepare` 重新生成型別檔案。

#### API 架構設計與 CORS 問題解決
- 分析並解決 Users 模塊直連後端 API 時遭遇的 CORS 政策阻擋問題，確認在無後端控制權的情況下需要啟用代理轉發功能。
- 重新啟用 Nuxt Vite proxy 配置，設定 `/api-proxy` 路徑轉發至 `https://trybeta.rocket-coding.com`，解決跨域請求問題。
- 統一 Users 與 Company 模塊的 API 架構模式，兩個模塊都使用專用的 API fetch 函數 (`useUserApiFetch`, `useCompanyApiFetch`) 並依賴代理轉發。
- 修改 Users 模塊的所有 API 路徑從 `/api/v1/*` 改為 `/api-proxy/v1/*`，確保請求能透過本地開發伺服器代理轉發。
- 優化 `useUserApiFetch.ts` 配置，移除 `baseURL` 設定，依賴代理轉發機制處理路徑映射。
- 驗證代理轉發功能正常運作，確認 `login` 與 `programs` API 請求都能成功返回 200 狀態碼，解決了開發環境中的 CORS 與路由問題。

#### 前端錯誤修復與資料渲染優化
- 修復 `pages/users/index.vue` 頁面中的 `TypeError: Cannot read properties of undefined (reading 'Title')` 錯誤，透過加入 `?.` 安全檢查防止存取 `undefined` 物件的屬性。
- 優化 `formatProgramDate` 函數的錯誤處理機制，加入日期欄位為空值時的檢查，避免因無效日期導致的渲染錯誤。
- 為所有可能為空的資料欄位加入預設值處理，包括 `program.Industry?.Title || '產業未分類'`、`program.CoverImage || '/img/home/default-program.webp'` 等，提升頁面穩定性。
- 解決開發者工具中顯示的紅字錯誤，確保即使 API 回應資料不完整，前端頁面仍能正常渲染並顯示適當的預設內容。

#### 體驗者端-頁面權限與按鈕狀態管理
- 移除 `pages/users/index.vue` 頁面的 `middleware: 'user-auth'` 限制，將頁面改為公開資源，允許訪客瀏覽體驗計畫卡片。
- 實作基於登入狀態的按鈕控制邏輯，登入用戶可點選「查看詳情」按鈕，訪客狀態下按鈕被禁用並顯示「請先登入以查看詳情」提示。
- 優化 `useUserApiFetch.ts` 的 token 注入邏輯，允許無 token 狀態下的公開 API 請求，確保訪客也能正常獲取計畫資料。
- 修改 `useUserPrograms.ts` 的錯誤處理機制，針對 401 未授權錯誤提供友善的降級處理，避免因認證問題阻擋資料顯示。
- 更新頁面資料獲取邏輯，移除登入狀態檢查，確保分頁、篩選等功能對所有用戶開放，提升頁面可用性與用戶體驗。

