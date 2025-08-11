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
     
### EP2: 企業註冊頁面 (1) - 企業資料
- **頁面建構與切版**: 根據設計稿，使用 Element Plus 元件 (`el-form`, `el-input`, `el-select` 等) 完成了企業註冊流程第一步「企業資料」的 UI 切版。
- **佈局與結構**: 實作了頁面頂部的進度指示器 (Stepper)，並根據討論結果，將頁面佈局由 `blank` (全螢幕) 切換為 `main` (含通用導航)，確保其融入整體網站結構。
- **元件選用策略釐清**: 深入討論並確認了在複雜表單（如註冊頁）中採用 Element Plus 的優勢，主要在於其高效的表單驗證、現成的複雜元件（下拉選單、檔案上傳）以及提升程式碼可維護性的能力。
     
### EP2: 企業註冊頁面 (2) - 架構重構
- **架構重構與元件化**:
  - 將 `pages/company/register.vue` 頁面重構為一個多步驟表單的「流程控制器」。
  - 將第一步「企業資料」的 UI 抽出並封裝到獨立的 `components/company/register/Step1.vue` 元件中。
- **動態進度指示器**: 升級了頁面頂部的進度指示器 (Stepper)，使其樣式能根據當前步驟 (`currentStep`) 動態更新，為後續步驟的整合奠定了基礎。
- **資料流建立**: 採用了父子元件的資料傳遞模式 (`props` & `emits`)，確保了在元件切換過程中表單資料的持久化，此為多步驟表單的最佳實踐。
### EP2: 企業註冊頁面 (3) - 聯絡人資料
- **元件建構**: 根據設計稿，建立了註冊流程第二步的專用元件 `components/company/register/Step2.vue`。
- **UI 切版**: 使用 Element Plus 元件，完成了「聯絡人資料」表單的介面切版，包含姓名、職稱、信箱、電話等欄位。
- **流程整合**: 將新建的 `Step2.vue` 成功整合至 `pages/company/register.vue` 流程控制器中，並透過 `currentStep` 狀態實現與 `Step1.vue` 之間的動態切換。
- **雙向導航**: 在 `Step2.vue` 中實作了「上一步」與「註冊」按鈕，並透過 `emits` 事件將其與流程控制器的 `previousStep` 及 `nextStep` 函式掛鉤，實現了步驟間的雙向導航功能。
     
### EP2: 企業註冊頁面 (4) - 註冊成功
- **元件建構與 UI**: 根據設計稿，建立了註冊流程最後一步的 `components/company/register/Step3.vue` 元件，負責顯示靜態的註冊成功訊息。
- **流程完成**: 將 `Step3.vue` 整合至 `pages/company/register.vue` 流程控制器中，當使用者完成第二步並點擊「註冊」後，流程狀態會推進至第三步，顯示成功頁面，從而完成了整個註冊流程的 UI 建構。
- **架構一致性**: 延續了先前建立的「容器/展示」元件模式，保持了程式碼結構的清晰、單一職責與高可維護性，並為未來串接後端 API 預留了清晰的邏輯切入點。
     
# 2025-07-30
### EP1-2: 企業登入流程 (原型)
- **登入導航實作**: 為 `pages/company/login.vue` 的登入表單建立了臨時導航功能，以滿足 MVP 階段的快速開發需求。
- **流程定義**: 透過在 `<form>` 元素綁定 `@submit.prevent` 事件，當使用者觸發提交時，會從起始元件 `pages/company/login.vue` 直接導向至目標元件 `pages/company/index.vue`，完成了核心登入流程的串接。
     
### EP-Nav: 企業後台側邊欄導航
- **路由標準化**: 為了串接側邊欄導航，在 `utils/companyRoutes.ts` 中為方案頁面新增了 `purchase` 路由定義，確保全站能以一致的方式引用該頁面。
- **導航串接**: 修改起始元件 `layouts/company.vue`，將側邊欄選單中的「方案」按鈕，透過綁定其 `index` 屬性，成功連結至目標元件 `pages/company/purchase/index.vue`。
### EP5: 體驗者評價管理頁面
- **頁面建構與 UI 切版**: 根據設計稿，在 `pages/company/comments/index.vue` 中使用 Element Plus 元件完成了「體驗者評價管理」頁面的完整 UI，包含篩選器、評價列表與分頁功能。
- **佈局應用**: 設定頁面使用 `company` 全域佈局，確保後台風格一致。
- **資料模擬**: 為了加速前端開發，頁面內已包含模擬的評價資料與分頁狀態。
- **路由標準化**: 為「體驗者評價管理」頁面在 `utils/companyRoutes.ts` 中新增了 `comments` 路由定義，並於 `pages/company/comments/index.vue` 完成綁定。
- **導航串接**: 修改 `layouts/company.vue`，將側邊欄選單中的「評價管理」按鈕成功連結至對應頁面。
### EP3: 企業帳戶設定頁面
- **UI 建構與切版**: 根據設計稿，在 `pages/company/settings/index.vue` 中使用 Element Plus 元件 (`el-card`, `el-form`) 完整實作了「帳戶設定」頁面的 UI，包含企業資料、變更密碼、聯絡人與危險操作等多個區塊。
- **路由整合**:
  - 在 `utils/companyRoutes.ts` 中為新頁面新增了 `settings` 路由定義，以實現路由標準化。
  - 修改 `layouts/company.vue`，將側邊欄的「帳戶設定」連結至新建立的頁面，完成後台導航的串接。
  - 透過 `definePageMeta` 設定頁面使用 `company` 佈局，確保後台風格一致性。
     
     
# 2025-07-31
### MGT: 專案規則與慣例建立
- **元規則建立**:
  - 建立了 `.cursor/rules/self-improved.mdc` 作為團隊撰寫所有 `cursor rules` 的標準範本與指導原則，確保所有規則檔案都具備高可讀性、高可維護性與高重用性。
  - 建立了 `.cursor/rules/cursor-rules.mdc` 作為專案的「規則索引」，定義了規則的命名結構、存放位置與應用策略，並提供了四象限模型來輔助決策。
- **協作流程定義**:
  - 建立了 `.cursor/rules/nuxt3-dev.mdc` (後更名為 `project-collaboration-guide.mdc`，最終內容整合回 `nuxt3-dev.mdc`)，明確定義了 AI 在開發前、中、後各階段與開發者的標準作業流程 (SOP)，確保溝通順暢與實作精準。
- **具體規則實作**:
  - 根據業界最佳實踐 (Conventional Commits) 建立了 `project-commit-msg.mdc`，統一了專案的 Git 提交訊息格式。
  - 根據專案需求建立了 `fe-tailwind-guide.mdc`，定義了響應式斷點、間距系統，並釐清了 Element Plus 與 Tailwind CSS 的使用優先級。
  - 建立了 `fe-JavaScript-style-guide.mdc`，為 Vue/JavaScript 的開發提供了程式碼風格、命名慣例與結構順序的具體規範。
- **版本控制策略**:
  - 討論並確認了 `.cursor/` 目錄應被納入版本控制，不加入 `.gitignore`，以實現團隊間規則的共享與同步。
     
# 2025-08-03
### HP2: 企業方案頁面
- **頁面建構與路由**:
  - 建立了公開的企業方案頁面 `pages/plan.vue`，並將其設定為使用 `main` 全域佈局。
  - 更新了首頁 (`pages/index.vue`) 的「企業開始體驗」按鈕，使其能正確導航至新的方案頁面。
- **迭代式 UI 開發**:
  - 遵循「溝通優先」原則，與使用者反覆確認設計稿，並透過多輪迭代逐步完成了頁面的三大核心區塊。
  - **頂部區塊**：實作了包含標題和「新企業專屬優惠」資訊卡的兩欄式佈局。
  - **中部區塊**：根據設計稿，建構了包含「90% / 75% / 40%」的成效數據卡片。
  - **底部區塊**：完成了「選擇適合您的方案」區塊，其中包含五個不同天數的收費方案卡片。
- **架構與命名策略**:
  - 經討論確認，將此頁面放置於 `pages/plan.vue` 而非 `pages/company/plan.vue`，以明確區分「無需登入的公開頁」與「需要驗證的後台頁」，確保了專案結構的語意化與可維護性。
     
# 2025-08-04
### HP2: 企業方案頁面導航
- **導航實作**: 將 `pages/plan.vue` 頁面中的「我有興趣」按鈕連結至 `pages/roles.vue` 角色選擇頁。
- **實踐優化**: 遵循 Nuxt 3 最佳實踐，將原先使用 `<button>` 搭配 `navigateTo` 的實作，重構為使用 `<NuxtLink>`，以提升 SEO、可訪問性與頁面預取效能。
### Layout: 全域導覽優化
- **連結重構**: 將 `layouts/main.vue` 中作為佔位符使用的原生 `<a>` 標籤（位於頁首與頁腳），全面重構為 `<NuxtLink>`。
- **功能修正**: 修正了原先無法導航的「登入/註冊」與「企業方案」等連結，使其指向正確的路由 (`/roles`, `/plan`)，確保全站導覽功能正常運作並發揮 SPA 優勢。
### Layout: 全域頁首商標
- **商標實作**: 根據設計稿，在 `layouts/main.vue` 的全域頁首中加入了網站商標圖片，並將其設定為返回首頁的 `<NuxtLink>`。
### HP1: 首頁 - 使用者角色區塊
- **卡片佈局重構**: 使用 Flexbox (`flex flex-col`) 重構了「使用者角色」區塊的三張卡片，確保在 `lg` 斷點下它們能維持等高，解決了因內容長度不一造成的視覺不對稱問題。
- **內容對齊優化**: 透過 `mt-auto` 技巧，將卡片底部的功能列表推至齊平，並將列表文字設定為 `text-left` (靠左對齊)，提升了多行文字的排版整齊度與可讀性。
- **樣式更新**: 為卡片新增了背景、陰影與 `hover` 互動效果，使其設計更符合整體風格。

# 2025-08-05
### MGT: AI 輔助開發規格書建立
- **框架建立**: 在 `.cursor/rules/nuxt3-dev.mdc` 中建立了一套完整的人機協作框架，旨在結合人類的策略性思維與 AI 的高速執行能力。
- **核心原則與角色定義**: 明確定義了「人類主導，AI 輔助」的核心原則，並將開發者與 AI 分別定義為「領航員/架構師」與「超級駕駛員/執行者」。
- **協作流程標準化**: 提供了「從概念到程式碼」的互動模型範例，並建立了包含提供完整上下文、下達明確指令與迭代式提問的溝通協定。
- **最佳實踐規範**: 強調了版本控制、資訊安全、環境分離及保持獨立思考等在 AI 輔助開發中的重要最佳實踐。

### EP6, 7, 8, 9: 計畫與申請人管理流程
- **路由架構重構**:
    - 為了釐清 `/applicants` (列表) 與 `/applicants/:id` (詳情) 之間的關係，將原有的檔案結構重構為巢狀路由 `.../programs/[programId]/applicants/index.vue` (EP8) 與 `.../programs/[programId]/applicants/[applicantId].vue` (EP9)。
    - 全面更新了 `definePageMeta` 中的 `name` 與 `utils/companyRoutes.ts` 中的路由定義，並透過刪除舊有的 `applicants.vue` 檔案，徹底解決了因檔案結構造成的路由衝突問題。
- **端到端路由串接**:
    - **EP6 -> EP7**: 串接了「所有計畫列表」至「單一計畫詳情」的導航。
    - **EP7 -> EP8**: 串接了「單一計畫詳情」至「申請者列表」的導航。
    - **EP8 -> EP9**: 串接了「申請者列表」至「申請者審核頁」的導航。
- **EP9 - 申請者審核頁面 UI**:
    - 根據設計稿，使用 Element Plus 元件完整實作了「申請者審核頁面」的複雜 UI，包含申請人資訊、申請動機、技能、附件與審核表單等區塊。
- **EP7 - 單一計畫詳情頁 UI 與 RWD**:
    - **UI 實作**: 根據多份設計稿，迭代完成了頁面三大區塊的 UI 切版，包含申請統計、計畫詳情與體驗流程等。
    - **佈局修復**: 透過在 `definePageMeta` 中明確指定 `layout: 'company'`，解決了頁面跳轉時因佈局不匹配而引發的 `TypeError`。
    - **響應式設計**:
        - 實作了「申請統計」卡片的響應式設計，確保在不同螢幕寬度下皆有良好排版。
        - 透過多次重構，最終將頁面底部的三張卡片改為 `lg:grid-cols-3` 的網格佈局，解決了因內容長短不一導致的卡片不等高問題，確保了版面的視覺一致性。

### EP9 -> EP8: 申請者審核流程
- **編程式導航實作**: 在申請者審核頁 (`EP9`) 中，為「提交審核結果」按鈕新增了點擊事件，並使用 `navigateTo` 函式將使用者導航回申請者列表頁 (`EP8`)。
- **實踐選擇與釐清**: 深入討論並確認了在此場景下使用 `<button>` 搭配 `navigateTo` 的作法是優於 `<NuxtLink>` 的。主要原因是「提交」是一個包含潛在商業邏輯（如 API 請求）的「動作 (Action)」，而非單純的「導航 (Navigation)」。

# 2025-08-06
### EP10: 企業方案購買流程路由優化
- **路由串接與實踐**:
  - 完成了方案選擇頁 (`index.vue`) 至付款頁 (`payment.vue`) 的導航串接，並透過 `planId` 查詢參數傳遞使用者選擇。
  - 將專案中所有目的地導航 (`router.push`) 全面重構為 Nuxt 3 推薦的 `navigateTo` 函式，並採用命名路由取代硬編碼 URL，提升了程式碼的健壯性與可維護性。
- **導航邏輯釐清**:
  - 深入討論並確認了 `navigateTo`（目的地導航）與 `router.back()`（歷史導航）的使用場景與最佳實踐。
  - 確認 `router.back()` 是處理「返回」或「上一步」功能的正確方法，無需替換。

### EP1: 角色選擇頁路由錯誤修復與重構
- **問題診斷與修復**:
  - 針對 `roles.vue` 頁面導航至 `users/login` 時發生的 500 伺服器錯誤進行了深度除錯。
  - 透過比較分析，確認錯誤根源為 `users/login` 頁面隱性繼承了全域預設佈局 (`layouts/default.vue`)，而該佈局在伺服器端渲染 (SSR) 時因依賴問題而失敗。
  - 透過在 `users/login` 中明確指定 `layout: 'blank'`，成功繞開了問題佈局，解決了 500 錯誤。
- **架構清理與依賴分析**:
  - 根據除錯結果，決定移除已造成問題且不再需要的 `layouts/default.vue` 檔案。
  - 在刪除前，對整個 `pages/` 目錄進行了全面的依賴性掃描，精準地找出了所有會受此變更影響的頁面，確保了重構的安全性與完整性。

### Layout: 體驗者佈局路由優化
- **路由實踐釐清**: 針對 `layouts/user.vue` 中的「登入/註冊」連結，深入討論了 `<NuxtLink>` 的兩種 `to` 屬性寫法。
- **最佳實踐採納**: 確認並建議採用「命名路由物件寫法」 (`:to="{ name: 'routeName' }"`) 取代「硬編碼 URL 字串」 (`to="/path/to/page"`)。
- **理由與優勢**: 此舉能將連結與實際 URL 路徑解耦，大幅提升程式碼的健壯性與長期可維護性，未來修改路由時僅需調整路由定義檔，無需搜尋並取代所有相關連結。

### UP1: 體驗者登入頁面 (UI 切版)
- **UI 切版與策略**:
  - 根據設計稿，在 `pages/users/login.vue` 中使用 Tailwind CSS 完成了「體驗者登入頁」的 UI 切版。
  - 釐清並確認了在入口頁面（如登入頁）優先使用原生 HTML 元素與 Tailwind CSS 以達成精準樣式控制，而在功能性強的應用核心頁面則使用 Element Plus 的開發策略。
- **全域樣式與 CSS Reset**:
  - 深入探討了 Tailwind CSS 的 Preflight (CSS Reset) 機制，確認其已包含對 `<a>` 標籤的預設樣式重設。
  - 透過移除 `<a>` 標籤上多餘的功能類別 (utility classes) 並刪除元件內的 `<style scoped>`，成功讓全域的 Preflight 樣式生效，達成了全站連結樣式統一的最佳實踐，避免了引入額外的 `reset.css`。
- **互動樣式微調**:
  - 解決了表單輸入框 `focus` 狀態下 `outline` 和 `ring` 的樣式問題。
  - 使用 `padding` 功能類別調整了輸入框的高度，使其符合設計需求。

### UP1-1: 體驗者註冊頁面 (UI 切版)
- **頁面建構與 UI 切版**: 根據設計稿，在 `pages/users/register.vue` 中完成了「體驗者註冊頁面」的 UI 切版。
- **結構與樣式重用**: 為了確保視覺一致性並加速開發，重用了 `pages/users/login.vue` 的版面結構與 Tailwind CSS 樣式。
- **表單內容客製化**: 根據註冊流程的需求，新增了「姓名」與「確認密碼」欄位，並加入了服務條款同意聲明。
- **路由串接**: 更新了頁面底部的連結，使其能正確導航至登入頁面，完成了註冊與登入流程的雙向串接。

# 2025-08-07
### UP2: 體驗者帳戶中心 (UI)
- **頁面建構與 UI**: 在 `pages/users/settings/index.vue` 中，根據設計稿完成了「帳戶中心設置」頁面的初步 UI 切版，並優先採用 Element Plus 元件庫來建構表單。
- **佈局與樣式**:
  - 設定頁面使用 `user` 全域佈局，並透過 `max-w-container-users` 確保版心與專案規範一致。
  - 使用 Tailwind CSS utility classes 實作了包含使用者頭像、姓名與職稱的資訊區塊。
- **表單優化與討論**:
  - **元件選用**: 將「性別」欄位從 `<el-input>` 升級為更符合語意與使用者體驗的 `<el-radio-group>`。
  - **響應式佈局**: 將「通訊地址」區塊重構為獨立的全寬區塊 (`md:col-span-2`)，並使其內部的「縣市/區域」選單在寬螢幕 (`xl`) 上並排顯示，在窄螢幕上自動堆疊，提升了跨裝置的可用性。
  - **包容性設計**: 深入討論了「性別」欄位的社會意涵，最終採納了包含「男、女、其他」的高度包容性設計，並釐清了其與後端 API 的協作模式。
- **密碼設置 UI**:
  - 新增「密碼設置」區塊，使用 Element Plus 的 `<el-input type="password">` 搭配 `show-password` 屬性，提供了安全性與易用性兼備的密碼修改介面。
- **程式碼品質與協作規範**:
  - 為 `districtOptions` 物件加上 TypeScript 索引簽章，解決了 Linter 型別錯誤，提升了程式碼的健壯性。
  - 根據討論建立了新原則：優先使用 Element Plus 元件的預設樣式，避免 Tailwind 樣式覆蓋導致非預期行為，並已將此原則應用於頁面中的所有按鈕。

### MGT: Git 工作流程與 commit 訊息管理
- **最新 commit 修改**:
  - 學習並實作了 `git commit --amend` 指令，用於修改最新一次的 commit 訊息。
  - 深入釐清了在 Vim 編輯器中修改 commit 訊息的完整流程，包括模式切換、正確的編輯位置以及儲存退出的指令 (`:wq`)。
- **歷史 commit 修改**:
  - 學習了使用互動式變基 (`git rebase -i HEAD~N`) 來修改歷史中特定 commit 的訊息。
  - 掌握了將 `pick` 改為 `reword` 來觸發修改流程的技巧。
- **最佳實踐與安全**:
  - 強調了 `rebase` 與 `amend` 操作應僅限於未推送到遠端的本地 commit，以避免破壞團隊協作歷史。

### UP11: 方案詳情頁收藏功能
- **UI 與功能實作**: 在方案詳情頁 (`pages/users/programs/[programId].vue`) 中新增了「收藏」功能，允許使用者將感興趣的方案加入收藏。
- **動態樣式**: 收藏圖示會根據方案的收藏狀態 (`isFavorited`) 動態切換實心 (`fas`) 與空心 (`far`) 樣式，提供明確的視覺回饋。

### MGT: Font Awesome 版本衝突修復
- **問題診斷**: 針對 `plugins/fontawesome.ts` 中出現的 TypeScript 型別錯誤進行了除錯。
- **根本原因**: 確認問題源於 `@fortawesome/free-regular-svg-icons` (`v7`) 與其他核心套件 (`v6`) 之間的主版本不匹配。
- **解決方案**: 透過將 `@fortawesome/free-regular-svg-icons` 的版本統一降至 `^6.7.2`，成功解決了型別衝突，恢復了開發環境的穩定性。

# 2025-08-08
### UP11: 單一體驗計畫詳情頁 - 企業封面與體驗內容
- **企業封面區塊**：在 `pages/users/programs/[programId].vue` 新增灰底橫幅，包含左上圓形 LOGO 佔位、置中標題「企業封面」、左下公司名稱；沿用 `max-w-container-users` 與 Tailwind 版心與配色。
- **體驗內容卡（同一 section）**：於同一 `section` 內新增白底卡片，上方為左側標題/副標與右側關鍵資訊列（已申請人數、截止天數、招募天數、招募人數、日期），下方依設計稿完成六個段落：體驗介紹、師資介紹、經歷、參加限制、行前須知、準備清單。
- **圖示與依賴**：僅使用已註冊的 `calendar-alt` 圖示，未新增套件以避免版本衝突。
- **資料與擴充**：目前採用靜態假資料，後續可以 `useFetch` 串接 API 取代；欄位結構已預留替換空間。
- **影響檔案**：`pages/users/programs/[programId].vue`

### UP11: 單一體驗計畫詳情頁 - 體驗流程區塊
- **UI 實作**：在企業封面/內容區塊之後新增「體驗流程」白底卡片，包含三個階段說明、體驗地點與「地圖」灰底佔位，版面依設計稿間距與留白呈現。
- **結構與語意**：在同一頁面下新增 `section[aria-label="體驗流程"]`，流程列表採用語意化的 `dl/dt/dd` 兩欄結構（`md:col-span-2` 與 `md:col-span-10`），提升可讀性與可存取性。
- **資料與擴充**：於 `<script setup>` 新增 `flowSteps` 與 `venue` 假資料，可日後以 `useFetch` 串接 API 取代；地圖可替換為 Google Maps/第三方元件。
- **相依與風格**：沿用 Tailwind 與現有色票，未引入新依賴；使用 `border`、`shadow-sm` 強化卡片感。
- **影響檔案**：`pages/users/programs/[programId].vue`

### UP11: 體驗申請對話框與表單 component
- **頁面整合**：於 `pages/users/programs/[programId].vue` 新增 `ElDialog`，並將「我要申請」按鈕綁定開啟對話框（狀態 `showApply`）。
- **新增元件**：建立 `components/users/ApplyExperience.vue`，包含「可參加時段」與「備註」欄位，提交時透過 `submitted` 事件回傳，由父層關閉對話框。
- **修復**：移除將 `<el-dialog>` 放在 SFC `<template>` 外造成的解析錯誤（Vite PARSE_ERROR）。
- **重構**：清除 `ApplyExperience.vue` 中與頁面無關的邏輯（`definePageMeta`、`useRouter`、`isFavorited`、`showApply`），使其維持單一職責。
- **影響檔案**：`components/users/ApplyExperience.vue`，`pages/users/programs/[programId].vue`

### UP11: 申請表單強化與提交導航責任劃分
- **表單完整化**：擴充 `components/users/ApplyExperience.vue` 欄位為「姓名、電話、Email、日期區間、履歷、提交訊息、條款勾選」，採用 Element Plus 表單元件。
- **驗證與狀態**：加入規則驗證（電話格式/Email/日期/履歷/訊息/同意條款）、提交 `loading`、按鈕在未勾選條款時停用。
- **型別修復**：`<el-input type="textarea">` 使用 `:rows` 傳入數字，修正 `Type 'string' is not assignable to type 'number'`。
- **提交行為**：子元件僅 `emit('submitted')`；父頁面 `pages/users/programs/[programId].vue` 監聽後關閉 Dialog 並 `navigateTo({ name: 'user-landing' })`，維持單一職責、提高重用性與可測試性。
- **影響檔案**：`components/users/ApplyExperience.vue`，`pages/users/programs/[programId].vue`

### UP6: 申請活動的狀態追蹤頁（路由與檔案結構）
- **頁面建構與路由**：
  - 將 `pages/users/applications.vue` 移動為巢狀結構 `pages/users/applications/index.vue`，為後續新增子頁（如 `[applicationId].vue`、`timeline.vue`）預留空間。
  - 在 `definePageMeta` 統一路由名稱為 `user-applications`（kebab-case），並指定 `layout: 'user'`。
  - 確認舊名 `userApplications` 無外部引用，改名不會造成壞鏈。
- **導航策略**：
  - 建議以命名路由導覽 `:to="{ name: 'user-applications' }"`，替代硬編碼 URL，提升可維護性。
- **後續建議**：
  - 規劃將 `users` 區其餘駝峰命名頁面（如 `userComments`、`userCommentDetail`）調整為 kebab-case，以維持一致性。

### MGT: Git 分支命名策略（UP6）
- **決策**：採用「任務碼置前」命名（`up6-ui` 優於 `ui-up6`），利於遠端分支排序聚合與追蹤。
- **建議分支**：`feat/up6-ui-users-application-status`（或 `feat/up6-users-application-status-ui` 依團隊慣例）。

### UP6: 申請活動的狀態追蹤頁（UI 第一/二部分）
- **頁面骨架（第一部分）**：建立標題與操作列、篩選對話框（狀態/日期區間）、列表表格（活動/公司/申請日/狀態/操作）。沿用 `layout: 'user'` 與 `max-w-container-users`。
- **型別與策略**：申請狀態以 union 五值（待審核/已通過/未通過/已取消/已完成）統一；日期區間使用 `ref<[Date, Date] | ''>('')`，符合 Element Plus `daterange` v-model 期望，重置回 `''`；導覽一律命名路由。
- **卡片清單（第二部分）**：新增卡片樣式清單，呈現申請日/狀態、標題、地點、活動日期、參與人數、描述、主辦單位；操作含「查看詳情」與「取消申請」（事件預留）。
- **圖示與樣式**：使用已註冊圖示 `map-marker-alt`、`calendar-alt`、`user-circle`；採 Tailwind + Element Plus，未新增依賴，維持現有色票與陰影/邊框樣式。
- **擴充建議**：後續抽出 `useApplications` composable 承載篩選與資料取得，替換假資料為 `useFetch`。

# 2025-08-11
### MGT: 追加需求範圍/階段檢查（MDC「需求複述」）
- 內容決策：僅保留「需求複述」，明確規範「偵測追加/提問 → 檢查主線/階段 → 回報結果；超出範圍則提醒並解釋，未超出則依建議續進」。
- 檔名決策：允許中文檔名；推薦 `mdc-需求複述-範圍與階段檢查.md`；規則檔維持於 `.cursor/rules/scope-stage-review.mdc`（內容已更新為最新「需求複述」文案）。
- 理由：聚焦主線、降低不必要投入，建立輕量且可追溯的回報閉環。
- 風險與規範：中文檔名於 CI/URL 可能有編碼相容性風險；統一 UTF-8，建議設定 `git config --global core.quotepath false`。
- 後續：可視需要同步新增中文檔名版本並納入規則索引；與看板/站會流程對齊以落實提醒與回報。

### UP6: 申請活動的狀態追蹤頁（分頁器）
- 分頁器（標準模式）：採用 Element Plus `prev, pager, next`；每頁 5 筆；`pager-count=7`。
- 清單資料：卡片清單與表格共用同一分頁資料源（`paginatedApplications`）；當濾鏡變更(註1)時自動回到第 1 頁。
- 統計文案：新增底部資訊列「顯示 x‑y 筆，共 n 筆結果」。
- 擴充與風險：目前 `total` 基於前端資料；串 API 時以後端 `total` 為準並處理空清單邊界。
- 影響檔案：`pages/users/applications/index.vue`

### Layout: 體驗者佈局 - 申請清單導航
- 導航更新：於 `layouts/user.vue` 將「申請清單」連結改為命名路由 `user-applications`，
  並由 `<a>` 改為 `<NuxtLink>`；桌面與行動選單皆生效。
- 理由：採 SPA 導航避免整頁重載、保留頁面狀態，並透過命名路由降低壞鏈風險、支援 prefetch。
- 影響檔案：`layouts/user.vue`
- (註1)濾鏡變更＝任何會改變清單「過濾條件」的動作。
  - 具體包括：變更或清空 `selectedStatus`、變更或清空 `selectedDateRange`、點擊「重置」按鈕；以及更新清單資料本身導致結果集改變。
- (註1)行為：只要上述條件造成 `visibleApplications` 改變，就把 `currentPage` 重設為 1（避免在後段頁碼看到空白或錯位的結果）。

### UP6: 申請活動的狀態追蹤頁（篩選下拉與日期排序）
- 下拉：以 Element Plus `ElPopover` 取代對話框，採「批次套用/重置」；RWD 寬度 `clamp(320px, 92vw, 520px)`，placement=bottom-end。
- 狀態多選：審核中／已通過／未通過／未成團；排除「已完成」；提供「全部狀態」快速清空。
- 日期排序：僅提供「新到舊（預設）／舊到新」；按官方建議以 `value` 綁定，去除棄用警告。
- 視覺/邊界：修正 Popover 子元素溢出、標籤與群組間距、相鄰 radio 邊框裁切；最小裝置寬 370px 表現正常。
- 行為：套用後重置至第 1 頁；卡片與表格仍共用同一分頁資料源。
- 影響檔案：`pages/users/applications/index.vue`