/**
 * 企業端路由
 *
 * 可以在此處擴充企業後台相關的路由，例如儀表板、設定等。
 *
 * 路由名稱 (name) 透過各頁面中的 definePageMeta 設定，與檔案路徑解耦。
 */
export const companyRoutes = {
  landing: () => '/company',

  // plans
  programs: () => '/company/programs',
  applicants: (programId: string | number) => ({
    name: 'company-programs-applicants',
    params: { programId },
  }),
  applicantDetail: (applicantId: string | number) => ({
    name: 'company-programs-applicants-applicantId',
    params: { applicantId },
  }),
}; 