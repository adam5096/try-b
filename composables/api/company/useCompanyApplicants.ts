export interface ApplicantsListResponse {
  Statistics: {
    TotalApplicants: number;
    ReviewedCount: number;
    PendingCount: number;
  };
  PendingApplications: Array<{
    participant_id: number;
    applicant_name: string;
    identity: number;
    submit_date: string;
    review_status: string;
  }>;
  ReviewedApplications: Array<{
    participant_id: number;
    applicant_name: string;
    identity: number;
    submit_date: string;
    review_status: string;
  }>;
}

export const useCompanyApplicants = (companyId: MaybeRefOrGetter<number | null>, programId: MaybeRefOrGetter<string | number>) => {
  const url = computed(() => {
    const resolvedCompanyId = toValue(companyId);
    const resolvedProgramId = toValue(programId);
    if (!resolvedCompanyId || !resolvedProgramId) return null;
    
    return `/api/v1/company/applicants/${resolvedCompanyId}/${resolvedProgramId}`;
  });

  return useFetch<ApplicantsListResponse>(() => url.value || '', {
    key: computed(() => {
      const resolvedCompanyId = toValue(companyId);
      const resolvedProgramId = toValue(programId);
      return `company-applicants-${resolvedCompanyId}-${resolvedProgramId}`;
    }),
    server: true,
    lazy: true, // 改為 lazy: true，避免立即執行
    immediate: false, // 改為 false，由頁面控制何時執行
  });
};
