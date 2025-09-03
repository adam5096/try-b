import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';
import type { ProgramDetailResponse } from '~/types/company/program';

export const useProgramDetail = (
  companyId: MaybeRefOrGetter<number | null>,
  programId: MaybeRefOrGetter<string | number>
) => {
  const url = computed(() => {
    const resolvedCompanyId = toValue(companyId);
    const resolvedProgramId = toValue(programId);
    
    // 當 companyId 或 programId 為空時，返回 null，不發送請求
    if (!resolvedCompanyId || !resolvedProgramId) return null;
    
    return `/api/v1/company/${resolvedCompanyId}/programs/${resolvedProgramId}`;
  });

  return useCompanyApiFetch<ProgramDetailResponse>(url, {
    immediate: !!toValue(companyId) && !!toValue(programId),
  });
};
