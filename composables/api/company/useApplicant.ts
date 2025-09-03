import type { ApplicantDetail } from '~/types/company/applicant';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export const useApplicant = (
  companyId: MaybeRefOrGetter<number | null>,
  programId: MaybeRefOrGetter<string | number>,
  applicantId: MaybeRefOrGetter<string | number>
) => {
  const url = computed(() => {
    const resolvedCompanyId = toValue(companyId);
    const resolvedProgramId = toValue(programId);
    const resolvedApplicantId = toValue(applicantId);
    
    // 當 companyId 為空時，返回 null，不發送請求
    if (!resolvedCompanyId || !resolvedProgramId || !resolvedApplicantId) return null;
    
    // 根據 e comp 8 的 API 規範，單一申請者詳情使用 programs 端點
    return `/api/v1/programs/${resolvedProgramId}/applicantions/${resolvedApplicantId}`;
  });

  return useCompanyApiFetch<ApplicantDetail>(url, {
    key: `applicant-${toValue(applicantId)}`,
    immediate: !!toValue(companyId) && !!toValue(programId) && !!toValue(applicantId),
  });
};
