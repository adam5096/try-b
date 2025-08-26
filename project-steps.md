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

#### e-company-8 查看體驗者申請審核頁面
- 建立單一申請者資料 Mock API (`/api/v1/company/programs/[programId]/applicants/[applicantId].get.ts`)
- 建立申請者資料型別定義檔案 (`types/company/applicant.ts`)
- 更新申請者審核頁面 (`applicants/[applicantId].vue`)，串接 Mock API 並套用型別
- 修正申請者審核頁面中聯絡資訊的排版對齊問題
- 修正申請計畫區塊的欄位顯示邏輯，確保所有資訊正確呈現
- 修復因型別推斷不完整導致的 TypeScript 錯誤

### 2025-08-26
#### e-comp-9 企業新增體驗活動 API
- 建立企業新增體驗活動 API 的 TypeScript 型別定義檔案 (`types/company/programCreation.ts`)
- 分離新增體驗活動的型別定義，避免修改共用的 `program.ts`
- 更新 `useProgramStore`，使其在 `createProgram` 方法中串接並使用新的 `ProgramCreationResponse` 型別

#### 登入流程與共用模組修正
- 修正企業登入成功後的頁面導向邏輯，確保能穩定跳轉至管理後台
- 全面排查並統一 `useApiFetch` 的引用路徑，修正因檔案移動造成的模組載入錯誤

#### API 請求與錯誤修正
- 修正伺服器端渲染 (SSR) 環境下，因 API 路徑為相對路徑而導致的 URL 解析失敗錯誤。
- 重構 `useAuthStore`，將所有 API 請求 (`login`, `logout`, `fetchUser`) 全面改用共用的 `useApiFetch` Composable，以統一處理 `baseURL` 與驗證標頭 (Authorization Header)。
- 修正 `e-comp-8` 申請列表頁面的 API 端點錯誤，將請求路徑從 `/applicants` 更正為 `/applications`，解決 404 Not Found 問題。

#### API 請求邏輯重構
- 建立 `useApplicants` Composable (複數) 以專門處理申請者列表 (e-comp-7) 的 API 請求邏輯。
- 重構申請者列表頁面 (`applicants/index.vue`)，改為呼叫新建的 `useApplicants` Composable。
- 修正單一申請者 Composable (`useApplicant.ts`)，使其改用共用的 `useApiFetch` 以確保驗證 Token 的傳遞。
- 修復因 Vue Router 參數型別 (`string | string[]`) 與 Composable 預期型別不匹配所引發的 TypeScript 錯誤。