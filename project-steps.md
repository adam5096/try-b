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

# EP10: 企業方案購買流程
- **建構與串接**：完成方案選擇頁 (`index.vue`) 與付款頁 (`payment.vue`) 的畫面開發與路由串接。
- **樣式與 RWD**：依據設計稿進行頁面細節打磨，並完成對平板 (`1280px`) 與桌機的響應式設計。
- **錯誤修正**：
  - 解決 Element Plus 元件 API 棄用警告 (`el-radio`) 與樣式不一致問題 (`el-steps`)。
  - 解決 Font Awesome 圖示因未註冊而無法顯示的問題。
- **開發環境優化**：
  - 修正因 SSR 水合作用 (Hydration) 失敗導致的執行期錯誤。
  - 修正因缺少 `sass` 依賴與 VS Code 編輯器設定，導致 `@apply` 語法出現告警的問題。