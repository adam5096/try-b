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
### UP10: 熱門/一般體驗計畫總覽頁
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

# 2025-07-28
### EP7: 單一計畫詳情頁
- **頁面建構與佈局**：
  - 完成了「單一計畫詳情頁」的基礎切版，並根據多階段的設計稿，逐步重構成為一個包含多個區塊的複雜頁面。
  - 透過多次的討論與重構，精準地實現了包含巢狀網格與 Flexbox 的最終版面配置。
- **全域佈局與樣式優化**：
  - 為了解決版心問題，將置中容器從單一頁面移至共用的 `layouts/company.vue` 佈局檔案中，確保所有企業端頁面風格一致。
  - 調整了共用佈局的背景色，以突顯內容區塊的卡片式設計。
- **元件樣式客製化**：
  - 遵循 `tailwind.config.js` 的既有設定，在 `assets/css/main.css` 中新增了 `.btn-brand-yellow` 與 `.btn-danger-outline` 兩個客製化按鈕樣式。
  - 實作了包含背景變色、文字變色與放大縮放的 `hover` 效果，以提供更豐富的視覺回饋。
- **互動功能與使用者體驗**：
  - 針對「刪除計畫」這個具破壞性的操作，在樣式設計上提供了明確的視覺警示。
  - 透過 Element Plus 的 `ElMessageBox`，為刪除按鈕加上了「確認對話框」與後續的提示訊息，有效防止使用者誤觸，提升了整體的健壯性。
- **路由問題修復**：
  - 解決了因 `definePageMeta` 的 `name` 與 `userRoutes.ts` 中定義不一致而導致的 `No match found` 路由錯誤。
  - 統一了專案內的路由命名風格，將駝峰式命名改為 kebab-case，提升了可讀性與一致性。

# 2025-07-28
### EP10: 新增體驗計畫頁面
- **頁面建立與路由設定**：
  - 建立了「新增體驗計畫」頁面檔案 `pages/company/programs/new.vue`，並設定其使用 `company` 佈局。
  - 在 `utils/companyRoutes.ts` 中為新頁面新增了路由 `newProgram`，並在頁面中透過 `definePageMeta` 進行綁定。
  - 更新了 `layouts/company.vue` 中的側邊導覽列，將「新增體驗」按鈕正確連結至新頁面。
- **表單介面實作**：
  - 在 `pages/company/programs/new.vue` 中，根據設計稿使用 Element Plus 元件 (`el-form`, `el-input`, `el-select`, `el-date-picker`, `el-upload` 等) 建構了完整的表單結構。
  - 實作了頁面頂部的「方案狀態」提示橫幅。
  - 完成了包含所有欄位、按鈕與基本版面配置的頁面初版。

# 2025-07-29
### EP1: 角色選擇頁面
- **頁面建構與路由**: 建立了 `pages/roles.vue` 頁面，並設定其 `layout` 為 `main`，提供「體驗者」與「企業」兩種不同角色的登入/註冊入口。
- **資料驅動介面**: 將角色卡片的內容（標題、描述、功能列表、連結）定義為響應式資料，並使用 `v-for` 迴圈進行渲染，提高程式碼的可維護性。
- **響應式設計**: 採用 Tailwind CSS 實作響應式佈局，確保頁面在桌面（水平排列）與行動裝置（垂直排列）上皆有良好的瀏覽體驗。
- **元件與樣式**: 遵循專案既有風格，使用了 `HomeCheckIcon` 元件與 `tailwind.config.js` 中定義的全域色彩，確保視覺一致性。

### EP10: 新增體驗計畫頁面
- **表單元件優化**:
  - 根據設計稿，將 `pages/company/programs/new.vue` 中的靜態提示區塊，重構為一個功能性的多行文字輸入框 (`<el-input type="textarea">`)。
  - 為新的輸入框新增了 `summary` 狀態，並將原有的提示文字轉換為 `placeholder`，提升了表單的互動性與可用性。

### EP1-1: 企業登入頁面
- **頁面建構與切版**: 根據設計稿完成 `pages/company/login.vue` 的 UI 切版，採用兩欄式佈局，並使用 Tailwind CSS 進行精準樣式客製化。
- **佈局策略制定**:
  - 新增 `layouts/blank.vue` 作為可重用的空白佈局，用於登入頁等不需要通用導航的獨立頁面。
  - 經討論確認，建立專用佈局是比使用 `layout: false` 更具可擴展性與語意化的業界推薦作法。
- **元件選用策略**:
  - 策略性地選用原生 HTML 表單元素而非 Element Plus，以確保對入口頁面客製化設計的完全控制權。
  - 釐清了「入口頁面」（重設計、用 Tailwind）與「應用核心」（重功能、用 Element Plus）的開發模式區別。