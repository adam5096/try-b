/**
 * 企業端路由
 *
 * 可以在此處擴充企業後台相關的路由，例如儀表板、設定等。
 */
export const companyRoutes = {
  login: () => ({ name: 'company-login' }),
  landing: () => ({ name: 'company-programs' }),
  programDetail: (programId: string | number) => ({
    name: 'company-programs-programId',
    params: { programId },
  }),
  applicants: (programId: string | number) => ({
    name: 'company-programs-programId-applicants',
    params: { programId },
  }),
  applicantDetail: (applicantId: string | number) => ({
    name: 'company-programs-applicants-applicantId',
    params: { applicantId },
  }),
}; 