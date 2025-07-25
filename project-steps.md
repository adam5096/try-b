# nuxt 啟動資料夾

# 安裝套件(library)-詳見package.json

# 預建立可能使用到的目錄

# 路由元件與資料夾設計

# definePageMeta 優化路由

# 切版電腦版型
## header
## Hero
## User Personas
## Featured Programs
## User Testimonials
## Partners
## Client Testimonials
## Success Stories
## Stats
## footer

# 加入 font awsome

# 新增 layouts/main

# 修復 git push 新內容時，gitgub 拿取新內容失敗問題

# 2025-07-24

### EP10: 企業方案購買流程
- **建構與串接**：完成方案選擇頁 (`index.vue`) 與付款頁 (`payment.vue`) 的畫面開發與路由串接。
- **樣式與 RWD**：依據設計稿進行頁面細節打磨，並完成對平板 (`1280px`) 與桌機的響應式設計。
- **錯誤修正**：
  - 解決 Element Plus 元件 API 棄用警告 (`el-radio`) 與樣式不一致問題 (`el-steps`)。
  - 解決 Font Awesome 圖示因未註冊而無法顯示的問題。
- **開發環境優化**：
  - 修正因 SSR 水合作用 (Hydration) 失敗導致的執行期錯誤。
  - 修正因缺少 `sass` 依賴與 VS Code 編輯器設定，導致 `@apply` 語法出現告警的問題。

# 2025-07-25
### EP10: 企業方案購買流程
- **付款成功頁面**：根據設計稿完成付款成功頁面 (`success.vue`)，包括畫面布局、資訊呈現與 `CheckIcon` 元件優化。
- **樣式統一**：統一購買流程中 (`index.vue`, `payment.vue`, `success.vue`) 的步驟條 (`el-steps`) 樣式，確保已完成步驟的圖示、顏色與線條風格一致。


- **專案日誌重構**：將 `project-steps.md` 的結構調整為以日期分組的開發日誌，以利追蹤進度。
- **樣式邏輯釐清**：討論並確認了購買流程中步驟條 (`el-steps`) 的狀態變更邏輯與使用者體驗的合理性。

# 2025-07-25
### EP10: 體驗計畫總覽頁
- **使用者佈局建構**：
  - 建立了使用者專屬的佈局檔案 `layouts/user.vue`，包含獨立的頁首與頁腳。
  - 完成了頁腳 (`Footer`) 的樣式與結構，使其符合設計圖。
- **頁首狀態實作**：
  - 完成了頁首 (`Header`) 在「登入」與「登出」兩種狀態下的樣式與導覽結構。
  - 在登入狀態下，實作了包含通知鈴鐺與使用者頭像的下拉式選單。
- **頁面主要內容**：
  - 完成了 `pages/users/index.vue` 的主要內容區塊。
  - 使用 Element Plus 的 `el-carousel` 實作了「熱門體驗計畫」的卡片輪播功能。
  - 建構了「一般體驗計畫」區塊，包含篩選器、卡片列表與分頁功能。
- **依賴與圖示管理**：
  - 為了支援頁首與頁腳的圖示，安裝了 `@fortawesome/free-solid-svg-icons` 套件。
  - 在 `plugins/fontawesome.ts` 中註冊了多個新圖示，並解決了套件版本衝突問題。
- **UI 細節優化**：
  - 調整了輪播元件的箭頭樣式，提高其可見度。
  - 統一了卡片的高度，透過討論與實踐，採用了 `min-height` 的最佳實踐來取代 `&nbsp;` 佔位，確保版面整齊。
  - 修復了輪播卡片中失效的圖片連結。