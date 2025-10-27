# 🚀 TRY β 職業體驗平台

> **一個連結人才與企業的創新平台**  
> 提供短期職業體驗機會，讓求職者「先體驗、後決定」，降低轉職風險

---

## 🎯 平台核心價值

### 對求職者的價值
- ✅ **低風險探索**：短期體驗，無需長期承諾
- ✅ **真實職場體驗**：實際工作內容，非紙上談兵
- ✅ **降低轉職成本**：避免入職後才發現不適合

### 對企業的價值
- ✅ **精準人才篩選**：透過實際表現評估適合度
- ✅ **降低錯聘風險**：減少不適合人選的招聘成本
- ✅ **提升招聘效率**：直接接觸有興趣的候選人

---

## 🏆 專案成果

### 1. 完成了什麼任務？
- **兩端完整系統開發**：建構體驗者端、企業端兩個獨立但整合的系統
- **職業體驗平台核心功能**：實現先體驗後聘用的創新求職模式
- **全端 Web 應用程式**：從前端 UI 到後端 API 的完整開發與部署（前後端分離架構）
- **響應式設計實現**：支援桌機、平板、手機等多裝置體驗

### 2. 開發過程中解決了什麼問題？
- **跨端權限管理**：解決不同角色（體驗者、企業、管理員）的權限控制與路由保護
- **API 架構設計**：透過 BFF（Backend for Frontend）模式解決前後端分離的複雜性
- **資安防護機制**：實現中介層權限控制、API 錯誤處理等資安防護體系
- **開發效率優化**：透過現代化技術棧與工具鏈提升開發與維護效率

### 3. 滿足了什麼需求？
- **求職者需求**：提供低風險的職業探索機會，降低轉職成本與錯聘風險
- **企業需求**：建立低成本的人才篩選機制，提升招聘效率與精準度
- **技術需求**：採用現代化技術棧，確保系統的可維護性、擴展性與效能

---

## 📈 專案成果亮點

| 項目 | 成果 |
|------|------|
| **系統完整性** | 34 個頁面、21 個元件、32 個 API 端點 |
| **用戶體驗** | 響應式設計，支援桌機、平板、手機 |
| **技術架構** | 現代化全端 Web 應用，前後端分離 |
| **安全性** | 權限控制與錯誤處理機制 |
| **整合能力** | Google OAuth 登入、第三方支付整合 |

---

## 🛠️ 技術架構概覽

### 前端技術棧
- **核心框架**：Nuxt 3（^3.17.6）+ Vue 3（^3.5）+ TypeScript
- **UI 設計**：Tailwind CSS + Element Plus（`idInjection: false`）
- **狀態管理**：Pinia（含 `@pinia-plugin-persistedstate/nuxt`）
- **圖片優化**：Nuxt Image（Vercel 圖片優化、遠端圖片白名單、預設輸出 webp）
- **SEO 優化**：Nuxt SEO（`@nuxtjs/seo`、`@nuxtjs/sitemap`）
- **字體管理**：`@nuxt/fonts`（Google Fonts：Inter）
- **圖標系統**：Font Awesome（自訂插件註冊）
- **日期處理**：dayjs（插件擴充 `updateLocale`、`relativeTime`、`utc`）
- **認證整合**：Google OAuth
- **AI 協作**：MCP 整合（`nuxt-mcp`）

### 後端架構
- **API 代理**：Nitro Server（BFF 模式）
- **路由規則**：
  - `/api-proxy/**` → 代理至 `https://trybeta.rocket-coding.com/**`
  - `/img/**`、`/_vercel/image/**` → 長時間快取 headers
- **SSR 轉譯**：`@popperjs/core`、`element-plus`
- **遠端圖片來源**：`trybeta.rocket-coding.com`、`images.unsplash.com`、`i.imgur.com`
- **圖片優化**：Vercel 圖片優化服務，支援多種螢幕尺寸響應式輸出

### API 呼叫策略
- **統一請求**：使用 `$fetch` 進行 HTTP 請求，透過 BFF 架構處理
- **環境區分**：
  - 開發環境：`baseURL = /api`，由 Nitro 代理轉發至真實後端
  - 生產環境：`baseURL = NUXT_PUBLIC_API_BASE`
- **代理處理**：後端實際路徑透過 Nitro 代理處理，開發環境使用 `/api-proxy/api/v1/...` 格式
- **錯誤處理**：401 錯誤統一攔截，依請求前綴自動導向對應登入頁面

### 開發工具
- **程式碼品質**：ESLint 9（整合 `@nuxt/eslint`，Tab 縮排、不使用分號）
- **部署平台**：Vercel
- **版本控制**：Git + Conventional Commits

---

## 🚀 快速開始

### 環境需求
- Node.js 18+
- pnpm 9.9.0+

### 安裝步驟
```bash
# 1. 取得程式碼
git clone [repository-url]
cd try-b

# 2. 啟動開發伺服器
pnpm dev

# 3. 建置正式版
pnpm build
```

---

## 🎨 系統功能特色

### 👥 多角色系統
- **體驗者端**：瀏覽計畫、申請參與、撰寫評價
- **企業端**：發布計畫、管理申請者、查看評價


### 🔐 安全機制
- **權限控制**：基於角色的路由保護
- **錯誤處理**：統一的 API 錯誤攔截與導向
- **資料保護**：安全的 Cookie 設定與請求追蹤

### 📱 用戶體驗
- **響應式設計**：適配各種裝置尺寸
- **圖片優化**：自動格式轉換與快取
- **SEO 友善**：自動生成 sitemap 與 meta 標籤

---

## 📊 專案統計

- **開發時間**：完整的前後端開發週期
- **程式碼規模**：34 頁面 + 21 元件 + 32 API

### 開發成果統計
- **頁面開發**：34 個完整頁面
- **元件庫**：21 個可重用元件
- **API 端點**：32 個不重複的 API endpoint
- **佈局系統**：6 種不同佈局 (main/company/user/admin/default/blank)

### 系統架構
- **兩端完整系統**：體驗者端、企業端
- **BFF 架構**：實現 Backend for Frontend 代理層
- **權限管理**：跨端權限控制與路由保護
- **響應式設計**：支援桌機、平板、手機等多裝置體驗

---

## 🔧 開發規範

### 程式碼風格
- Tab 縮排、不使用分號
- TypeScript 嚴格模式
- ESLint 自動檢查與修復

### Git 工作流程
- **分支策略**：feature/ → develop → main
- **提交規範**：Conventional Commits
- **代碼審查**：PR 必須通過測試

#### Git Flow 詳細流程
1. 從 `develop` 建立功能分支
2. 功能完成於分支上
3. 建立 PR 回 `develop`
4. 測試通過後合併
5. 週期性由 `develop` 併入 `main`

#### Commit 規範
- `feat:` 新功能
- `fix:` 修復問題
- `docs:` 文件更新
- `style:` 程式碼格式
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 建置/工具


---

## 📁 專案目錄結構

```
try-b/
├── assets/            # 靜態資源（CSS、圖片）
├── components/        # Vue 元件
│   ├── auth/         # 認證相關元件
│   ├── company/      # 企業端元件
│   ├── shared/       # 共用元件
│   └── users/        # 使用者端元件
├── composables/       # 組合式函數
│   └── api/          # API 封裝
├── layouts/           # 頁面佈局
│   ├── main.vue      # 主佈局
│   ├── company.vue   # 企業端佈局
│   ├── user.vue      # 使用者端佈局
│   ├── admin.vue     # 管理員佈局
│   ├── default.vue   # 預設佈局
│   └── blank.vue     # 空白佈局
├── middleware/        # 路由中介軟體
├── pages/             # 頁面路由
│   ├── admin/        # 管理員頁面
│   ├── company/      # 企業端頁面
│   └── users/        # 使用者端頁面
├── plugins/           # Nuxt 插件
├── public/            # 靜態公開資源
├── server/            # Nitro API 端點
├── stores/            # Pinia 狀態管理
├── types/             # TypeScript 型別定義
├── utils/             # 工具函數
└── test/              # 測試檔案
```

### 重要資料夾說明
- **`public/img/`**：站內靜態圖片，支援長時間快取
- **`server/api/v1/`**：API 代理端點，統一處理後端請求
- **`middleware/`**：權限控制與路由保護
- **`composables/api/`**：API 封裝，統一錯誤處理

---

## 🚀 部署與維護

### 部署平台
- **主要平台**：Vercel
- **CDN 加速**：全球節點分發
- **自動部署**：Git push 觸發

### 監控與維護
- **效能監控**：Vercel Analytics
- **錯誤追蹤**：統一的錯誤處理機制
- **日誌記錄**：API 請求追蹤


*最後更新：2025-10-21*