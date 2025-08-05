/**
 * 企業端路由
 *
 * 可以在此處擴充企業後台相關的路由，例如儀表板、設定等。
 *
 * 路由名稱 (name) 透過各頁面中的 definePageMeta 設定，與檔案路徑解耦。
 */
export const companyRoutes = {
  login: () => ({ name: 'companyLogin' }),
  landing: () => ({ name: 'company-index' }),
  programDetail: (programId: string | number) => ({
    name: 'company-program-detail',
    params: { programId },
  }),
  applicants: (programId: string | number) => ({
    name: 'company-program-applicants-list',
    params: { programId },
  }),
  applicantDetail: (programId: string | number, applicantId: string | number) => ({
    name: 'company-program-applicant-detail',
    params: { programId, applicantId },
  }),
  newProgram: () => ({ name: 'company-programs-new' }),
  purchase: () => ({ name: 'company-purchase-index' }),
  comments: () => ({ name: 'company-comments' }),
  settings: () => ({ name: 'company-settings' })
};
