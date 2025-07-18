/**
 * 企業端路由
 *
 * 可以在此處擴充企業後台相關的路由，例如儀表板、設定等。
 *
 * 路由名稱 (name) 透過各頁面中的 definePageMeta 設定，與檔案路徑解耦。
 */
export const companyRoutes = {
  login: () => ({ name: 'companyLogin' }),
  landing: () => ({ name: 'companyPrograms' }),
  programDetail: (programId: string | number) => ({
    name: 'companyProgramsDetail',
    params: { programId },
  }),
  applicants: (programId: string | number) => ({
    name: 'companyProgramsApplicants',
    params: { programId },
  }),
  applicantDetail: (applicantId: string | number) => ({
    name: 'companyProgramsApplicantsDetail',
    params: { applicantId },
  }),
}; 