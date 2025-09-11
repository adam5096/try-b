## TRY β 職業體驗平台

一個連結人才與企業的職業體驗平台，提供多元的短期體驗計畫，協助使用者在投入職場前探索興趣、找到適合的道路。

### 功能介紹

**核心功能**
- **體驗者端**：瀏覽體驗計畫、申請參與、管理申請、收藏計畫、撰寫體驗評價
- **企業端**：發布體驗計畫、管理申請者、查看計畫數據、處理評價回饋、方案管理
- **管理員端**：審核計畫、管理評價、查看平台趨勢、用戶管理

**主要特色**
- 先體驗後聘用的模式
- 多元產業與職務類別
- 完整的申請與評價系統
- 響應式設計支援桌機、平板、手機

### 建議體驗流程
1. 首頁探索 → 了解平台理念與合作夥伴
2. 角色選擇 → 選擇體驗者或企業身份
3. 註冊登入 → 完成身份驗證
4. 瀏覽計畫 → 探索適合的體驗機會
5. 申請參與 → 提交申請並等待審核
6. 體驗回饋 → 完成體驗後撰寫評價

---

## 快速開始

### 環境需求
- Node.js 18+
- pnpm 9.9.0+
- Git

### 安裝與啟動
```bash
# 取得程式碼
git clone [repository-url]
cd try-b

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev

# 建置正式版
pnpm build

# 本機預覽產出
pnpm preview
```

### 環境變數
本專案使用 Nuxt Runtime Config：
- `NUXT_PUBLIC_API_BASE_URL`：生產環境的後端 API 主機，預設為 `https://trybeta.rocket-coding.com`

在開發環境時，所有 API 請求會透過 Nitro 代理 `/api-proxy/**` 轉發到真實後端；生產環境則直接使用 `NUXT_PUBLIC_API_BASE_URL`。

---

## 技術棧與主要模組

### 前端
- Nuxt 3（^3.17.6）
- Vue 3（^3.5）
- TypeScript
- Tailwind CSS（整合 `@nuxtjs/tailwindcss`）
- Element Plus（`@element-plus/nuxt`，`idInjection: false`）
- Pinia（含 `@pinia-plugin-persistedstate/nuxt`）
- Nuxt Image（`@nuxt/image`，IPX、遠端圖片白名單、預設輸出 webp、快取 header）
- Nuxt SEO（`@nuxtjs/seo`、`@nuxtjs/sitemap`，站點 URL: `https://try-b.vercel.app`）
- `@nuxt/fonts`（Google Fonts：Inter）
- Font Awesome（自訂插件註冊 `font-awesome-icon`）
- Swiper（`nuxt-swiper`）
- 日期處理：`dayjs`（插件擴充 `updateLocale`、`relativeTime`、`utc`）

### 測試與工具
- Cucumber-JS（BDD：`features/**`、`cucumber-js` 指令）
- Playwright（`@playwright/test`）
- ESLint 9（整合 `@nuxt/eslint`，專案使用 Tab 縮排、尾逗號等 stylistic 設定）

### 伺服器端（Nuxt Nitro）BFF - Backend for Frontend
- 以 Nitro Server 端點作為 API 代理層（例如：`server/api/v1/home/popular.get.ts`）
- 路由規則：
  - `/api-proxy/**` → 代理至 `https://trybeta.rocket-coding.com/**`
  - `/img/**`、`/_ipx/**` → 長時間快取 headers
- SSR 轉譯：`@popperjs/core`、`element-plus`
- 允許的遠端圖片來源：`trybeta.rocket-coding.com`、`images.unsplash.com`、`i.imgur.com`

---

## API 架構與開發約定

### 呼叫策略
- 統一使用 `useFetch` 進行 HTTP 請求，透過 BFF 架構處理 API 調用。
- 開發環境（`NODE_ENV=development`）：`baseURL = /api-proxy`，由 Nitro 代理轉發至真實後端。
- 生產環境（`NODE_ENV=production`）：`baseURL = NUXT_PUBLIC_API_BASE_URL`。
- 後端實際路徑需包含 `api`（例如：`/api/v1/...`），並透過代理形如：`/api-proxy/api/v1/...`。

### 權限與錯誤處理
- 401 錯誤統一在前端插件攔截（`plugins/api.ts`），依請求前綴自動導向：
  - `/api/user` → 轉導 `users/login`
  - `/api/company` → 轉導 `company/login`
- 導轉附帶 `?redirect=<當前路徑>` 以便登入後回跳。

### UI 與金流/金額顯示慣例
- Element Plus 優先採用預設設定；盡量避免以 Tailwind 覆寫其元件樣式，僅在自行撰寫的容器元素（如 `div`、`span`）上酌量使用 Tailwind。
- 金額顯示一律使用「TWD」作為國際貨幣前綴（例如：`TWD 1,000`）。

---

## 專案腳本
- `pnpm dev`：本機開發
- `pnpm build`：建置
- `pnpm preview`：本機預覽產出
- `pnpm generate`：靜態化（如需）
- `pnpm test:bdd`：執行 Cucumber BDD 測試
- `pnpm lint` / `pnpm lint:fix`：程式碼風格與修復

---

## 目錄結構（節錄）

```
try-b/
├── assets/            # 靜態資源（CSS、圖片）
├── components/        # Vue 元件（company/shared/users）
├── composables/       # 組合式函數（含 api 封裝）
├── features/          # BDD 測試
├── layouts/           # 頁面佈局
├── middleware/        # 路由中介軟體（company-auth、user-auth 等）
├── pages/             # 頁面（admin/company/users...）
├── plugins/           # Nuxt 插件（api、dayjs、fontawesome）
├── public/            # 靜態公開資源（favicon、_robots.txt、img/*）
├── server/            # Nitro API 代理端點（/api/v1/**）
├── stores/            # Pinia 狀態（user/company/admin）
├── types/             # TypeScript 型別
└── utils/             # 工具
```

---
## Public 資料夾（重點）
- `favicon.ico`：網站小圖示
- `_robots.txt`：搜尋引擎爬蟲規則
- `img/`：站內靜態圖片（如 `home/`、`company/`、`admin/`、`users/` 等）
  - 重要：Nitro 針對 `/img/**` 與 `/_ipx/**` 已設定長時間快取 headers
  - Nuxt Image 透過 IPX 處理圖片輸出與格式（預設輸出 webp、quality=70）

---

## 路由與頁面
- `pages/users/*`：使用者端（登入、收藏、申請、計畫詳情、設定、評論等）
- `pages/company/*`：企業端（登入、計畫建立/管理、申請者管理、購買流程、評論等）
- `pages/admin/*`：管理員端 (未來展望)（儀表板、評論審核、計畫管理、趨勢）

對應中介層：
- `middleware/user-auth.ts`：使用者權限
- `middleware/company-auth.global.ts`：企業權限
- `middleware/company-purchase-first-visit.global.ts`：首次購買流程限制

---

## 程式碼風格
- 使用 ESLint 9 與 `@nuxt/eslint` 預設規範；專案 stylistic 設定包含：
  - Tab 縮排
  - 需要分號
  - 多行結尾使用尾逗號

---

## Git 規範

### Commit（Conventional Commits）
- `feat:` 新功能
- `fix:` 修復問題
- `docs:` 文件更新
- `style:` 程式碼格式
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 建置/工具

### Branch
- `main`：生產分支
- `develop`：開發分支
- `feature/*`：功能開發
- `fix/*`：修復
- `hotfix/*`：緊急修復

### Git Flow（建議）
1. 從 `develop` 建立功能分支
2. 功能完成於分支上
3. 建立 PR 回 `develop`
4. 測試通過後合併
5. 週期性由 `develop` 併入 `main`

---

## 部署建議
- 以 Vercel/Nitro 為主的部署流程；請確認：
  - `NUXT_PUBLIC_API_BASE_URL` 已設定
  - 需要代理的路由維持 `/api-proxy/**` → 真實後端
  - 網站 URL（`nuxt.config.ts` 中 `site.url`）與實際網域一致

---

## 備註
- 設計工具（Figma、Miro 等）未納入此程式倉庫，若需補充請於此區更新。
- 若需擴充 API，請遵循現有模式：優先 `$fetch`、路徑需含 `api`、開發環境使用 `/api-proxy` 代理、並延續錯誤攔截與導流行為。
