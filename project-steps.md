( 已經搬移部分內容到 notion )



## 2025-08-30
- 開放 u-user-3 體驗計畫清單 API 為公開存取，移除 Token 需求。
- 透過開發代理呼叫 `/api-proxy/v1/programs`，與遠端 `/api` 重寫規則一致。
- 改用 `$fetch` 直取公開 API，避免 `useFetch` reactive 回傳造成 `pending=true`、`data=null`。
- 調整 `types/users/program.ts` 以符合新 response；移除 `ApplicationId`、`ProgramName`、`Steps`（含 `ProgramStep`）、`SubmitAt`、`Status`、`CompanyName`、`MaxParticipants`、`MinParticipants`；保留 `Id`、`Name` 等必要欄位。
- 更新 `composables/api/users/useUserPrograms.ts` 建立查詢字串並對接公開端點；回傳結構與 store 介面相容。
- 更新 `stores/user/useProgramsStore.ts` 正規化清單並保存每筆 `Id` 至 store，支援後續申請/收藏流程。
- 更新 `pages/users/index.vue` 將 `ProgramName` 改為 `Name`，移除 `Status` 顯示與統計，調整卡片欄位顯示。
- 修正 linter 問題並通過檢查；驗證 Postman 與開發代理結果一致，清單成功載入。
- 強化錯誤處理回傳格式與 Loading 狀態，保持與現有內容調性一致。
- 新增圖片 fallback：熱門區與一般清單 `<img>` 皆在 `onerror` 回退至 `/img/home/home-worker-bg.webp`。
- 建立熱門精選邏輯：在 `useProgramsStore` 預留 `isPopularProgram` 與 `computePopularPrograms`，以 Score > 10 篩選並排序前 5 筆，之後可擴展加權規則（收藏、瀏覽、成長率等）。
-. 抽離圖片錯誤處理：將 inline `@error` 事件改為 `onProgramImageError` 函式，避免將邏輯混雜於 template、提升可讀性與可測性（同時避免遞迴觸發）。
 - 修正使用者清單卡片顯示：將「公司」標籤改為「產業」，避免以產業誤當公司名稱顯示。
 - 合併人數欄位：把上方「活動人數」改為單一「已申請人數」，並刪除下方重複區塊以消除語意重複。
 - 通過 Lint 檢查並驗證 UI 呈現；不改動 API 與型別定義。
 - 參考檔案 `pages/users/index.vue` 完成編修，未涉及 store 與 composables 變更。
 - 移除 `pages/users/index.vue` 的開發用 fallback programId 與 dev 分支；`resolveProgramId` 收斂為 `Id ?? id`，全面以後端回傳 Id 為準。
 - 對接詳情流程：按鈕「查看詳情」觸發 `handleViewDetail` → 呼叫 `useUserProgramDetailStore.fetchDetail(programId)` → 由 `composables/api/users/useUserProgramDetail.ts` 發送 `GET /api-proxy/v1/programs/:id` → 代理重寫至 `/api/v1/programs/:id` → 成功渲染 `users/programs/:id`。
 - 更新 `types/users/programDetail.ts` 對齊 u user 5 回應：新增 `id`、`serial_num`、`views_count`、`favorites_count`、`score`、`total_views`、`weekly_views`、`daily_views`；移除 `is_ongoing`；其餘欄位維持一致。
 - 保持清單 store 僅保存完整 items（含 `Id`），不另維護獨立 id 清單；詳情 store 維護 `currentProgramId` 與快取，實作仍通過 Lint 檢查。
 - 驗證 Proxy rewrite 日誌（`/api-proxy/v1/programs/:id → /api/v1/programs/:id`）與 Postman 結果一致；使用者登入狀態下詳情請求攜帶 Authorization 標頭正常。
 - 新增 users 申請型別至 `types/users/application.ts`，規範 payload 與回應。
 - 建立 `composables/api/users/useUserApplications.ts`：串接 `POST /api-proxy/v1/programs/{program_id}/applications`，統一處理 201/200 成功與 400 已申請錯誤。
 - 更新 `components/users/ApplyExperience.vue`：接收 `programId`、整合申請 API、成功顯示提示並 emit `submitted`；400 顯示「已經申請過」並 emit `close` 關閉對話框；email 採用 `v-model.trim` 避免空白導致驗證誤報；`resume_id` 以暫置選單 1/2 供測試。
 - 更新 `pages/users/programs/[programId].vue`：傳入 `:program-id`，監聽 `submitted/close`；成功導回 `user-landing`，400 僅關閉對話框停留原頁。
 - 全面通過 Lint 檢查並驗證代理重寫與授權標頭；優化錯誤處理與 UX。
 - 修復 users 申請 API 狀態碼判斷：移除硬編碼 `201`，回傳實際 `200/201`。
 - 新增 `useUserApiFetchRaw`：取得 raw 回應含 HTTP 狀態碼，沿用 Users JWT 注入策略。
 - 更新 `composables/api/users/useUserApplications.ts`：改用 raw 版，統一成功條件（`200/201`）與 `400` 已申請錯誤拋出；其他狀態交由上層處理。
 - 通過 Lint 檢查；不改動 UI，保留 `ApplyExperience.vue` 既有成功訊息。

## 2025-09-01
- 修復 users 註冊流程型別錯誤：移除 `{ error }` 解構，對齊 `$fetch` 直接回傳資料物件。
- 更新 `stores/user/useAuthStore.ts` 的 `register`：改用 `try/catch` 捕捉錯誤並統一訊息格式，減少上層判斷負擔。
- 驗證 Lint 檢查為綠燈；不改動 API 介面與 UI 呈現，降低影響範圍。
- 提出替代方案：可改用 `useApiFetch/useFetch` 回傳 `{ data, error }`，惟影響面較大，暫採最小變更策略以維持穩定性。
 - 修復企業登入：在 `stores/company/useAuthStore.ts` 於 dev 使用 `/api-proxy/v1/company/login`（Vite 代理），prod 使用 `${public.apiBase}/api/v1/company/login`；改用 `$fetch` 直連並統一錯誤處理。
 - 驗證登入成功；後續 API `current`、`programs` 404 已定位為路由/端點不一致，待後續調整對應路徑或改走本機 mock。

## 2025-09-02
- 修復 users 評價列表 API 認證問題：將 `useUserComments.ts` 從使用 `$fetch` 改為 `useUserApiFetch`，確保 JWT token 被正確注入到請求標頭中。
- 修正評價列表 API 端點：從 `/api-proxy/v1/comments` 更新為符合 API 規格書的 `/api-proxy/v1/users/2/evaluations`。
- 調整回應格式處理：將 `CommentsResponse` 類型定義從包含 `total`、`page`、`limit`、`data` 屬性的物件改為直接是 `ReviewItem[]` 陣列，對齊後端實際回應格式。
- 更新頁面計算屬性：修正 `pages/users/comments/index.vue` 中的 `totalReviews` 和 `visibleReviews` 計算邏輯，使其能正確處理新的陣列回應格式。
- 新增調試資訊：在 `useUserApiFetch.ts` 和 `useUserComments.ts` 中添加 console 日誌，便於追蹤 token 注入過程和認證狀態。
- 驗證 API 整合成功：評價列表頁面現在能正確顯示 "共 5 則評價"，並成功渲染包含公司名稱、計畫名稱、狀態標籤等完整資訊的評價項目。
- 通過 Lint 檢查：所有修改都符合專案的程式碼風格規範，未引入新的 linter 錯誤。

## 2025-09-02 (續)
- 實作 users 修改評價功能：建立 `PUT /api/v1/users/{userId}/programs/{programId}/evaluations` API 整合，使用硬編碼的 `userId=2` 和 `programId=45` 作為測試值。
- 更新評價相關類型定義：在 `types/users/comment.ts` 中新增 `SubmitEvaluationSuccessResponse` 和 `SubmitEvaluationErrorResponse` 介面，支援後端定義的成功和錯誤回應格式。
- 修正評價提交 API 邏輯：將 `composables/api/users/useUserEvaluation.ts` 從使用 `$fetch` 改為 `useUserApiFetch`，確保 JWT token 被正確注入，並更新 HTTP 方法為 `PUT`。
- 強化錯誤處理機制：在 `pages/users/comments/index.vue` 中新增對「體驗尚未結束」錯誤的特殊處理，使用 `ElMessage.warning` 顯示警告訊息並自動退出編輯模式。
- 優化用戶體驗：當收到「體驗尚未結束」錯誤時，系統會自動清除編輯狀態並收合評價輸入框，提供更流暢的互動體驗。
- 通過 Lint 檢查：所有修改都符合專案的程式碼風格規範，未引入新的 linter 錯誤。

## 2025-09-02
- 修復企業端登入頁面 `definePageMeta is not defined` 錯誤：將 `definePageMeta` 函數從檔案底部移動到 `<script setup>` 標籤的最頂部，確保 Nuxt 3 的 auto-imports 能夠正確識別和載入。
- 全面檢查專案範圍內所有使用 `definePageMeta` 的檔案：共修復 33 個檔案，涵蓋企業端、使用者端、管理員端和通用頁面。
- 統一程式碼結構：所有頁面檔案現在都遵循「define 函數 → import 語句 → 邏輯代碼」的業界標準順序，符合 Nuxt 3 官方建議和最佳實踐。
- 驗證修復結果：通過 Lint 檢查，無任何程式碼風格錯誤；所有 `definePageMeta` 都正確位於 script 標籤頂部。
- 解決根本問題：修復了 Nuxt 3 auto-imports 載入問題，確保頁面路由和佈局設定能正常運作，企業端登入頁面現在可以正常載入。