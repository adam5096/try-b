import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';
import type { ProgramDetailResponse } from '~/types/company/program';

export const useProgramDetail = (programId: MaybeRefOrGetter<string | number>) => {
  const url = computed(() => {
    const resolvedProgramId = toValue(programId);
    if (!resolvedProgramId) return '';
    return `/api/v1/programs/${resolvedProgramId}`;
  });

  return useCompanyApiFetch<ProgramDetailResponse>(url, {
    immediate: !!toValue(programId),
  });
};
