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


