import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export interface ApplicantsListResponse {
  Statistics: {
    TotalApplicants: number;
    ReviewedCount: number;
    PendingCount: number;
  };
  PendingApplications: Array<{
    applicant_name: string;
    identity: number;
    submit_date: string;
    review_status: string;
  }>;
  ReviewedApplications: Array<{
    applicant_name: string;
    identity: number;
    submit_date: string;
    review_status: string;
  }>;
}

export const useApplicants = (companyId: MaybeRefOrGetter<number | null>, programId: MaybeRefOrGetter<string | number>) => {
  const url = computed(() => {
    const resolvedCompanyId = toValue(companyId);
    const resolvedProgramId = toValue(programId);
    if (!resolvedCompanyId || !resolvedProgramId) return null;
    // 申請者列表 API 端點 - 需要確認正確的端點
    // 目前嘗試使用 company 相關的端點
    return `/api/v1/company/${resolvedCompanyId}/programs/${resolvedProgramId}/applications`;
  });

  return useCompanyApiFetch<ApplicantsListResponse>(url, {
    immediate: !!toValue(companyId) && !!toValue(programId),
  });
};
