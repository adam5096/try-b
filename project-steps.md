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