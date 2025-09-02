import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export interface ApplicantsListResponse {
  total_applicants: number;
  reviewed_count: number;
  pending_count: number;
  pending_applications: any[];
  reviewed_applications: any[];
}

export const useApplicants = (companyId: MaybeRefOrGetter<number | null>, programId: MaybeRefOrGetter<string | number>) => {
  const url = computed(() => {
    const resolvedCompanyId = toValue(companyId);
    const resolvedProgramId = toValue(programId);
    if (!resolvedCompanyId) return '';
    return `/v1/company/${resolvedCompanyId}/programs/${resolvedProgramId}/applications`;
  });

  return useCompanyApiFetch<ApplicantsListResponse>(url, {
    immediate: !!toValue(companyId),
  });
};
