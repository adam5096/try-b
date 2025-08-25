( 已經搬移部分內容到 notion )

### 2025-08-25
- 建立企業方案 Mock API (`/api/v1/company/plans/current`)
- 建立企業方案 Pinia Store (`usePlanStore`) 進行狀態管理 (State MGMT)
- 建立共用方案狀態標頭元件 (`PlanStatusHeader.vue`)
- 整合方案資料讀取邏輯至 `company` 共用版型
- 重構企業端 (Company) 模組共 9 個頁面，導入共用方案標頭元件

#### e-company-7 單一活動的所有申請者列表
- 建立單一活動所有申請者列表 Mock API (`/api/v1/company/programs/[programId]/applicants.get.ts`)
- 更新活動申請者列表頁面 (`applicants/index.vue`)，串接 Mock API
- 重構 Mock API，統一收納於 `/api/v1` 路徑下
- 為既有 `company` 及 `user` 真實 API 建立對應 Mock API 版本
- 修正 `usePlanStore`，改用 `useFetch` 解決伺服器端渲染 (SSR) 問題
- 修正 `usePlanStore` 中 `CompanyPlan` 型別與 Mock API 回傳資料結構不一致問題
- 建立公司資訊 Mock API (`/api/v1/company/index.get.ts`)
- 建立公司計畫列表 Mock API (`/api/v1/company/[companyId]/programs.get.ts`)
- 重構 `useProgramStore`，改用響應式 `useFetch` 自動獲取計畫列表
- 修正 `Program` 型別定義，使其與 Mock API 資料結構一致