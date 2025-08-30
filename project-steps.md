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