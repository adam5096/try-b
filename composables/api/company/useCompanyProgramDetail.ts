import type { ProgramDetailResponse } from '~/types/company/program';

export const useCompanyProgramDetail = (
	companyId: MaybeRefOrGetter<number | null>,
	programId: MaybeRefOrGetter<string | number>,
) => {
	const url = computed(() => {
		const resolvedCompanyId = toValue(companyId);
		const resolvedProgramId = toValue(programId);

		// 當 companyId 或 programId 為空時，返回 null，不發送請求
		if (!resolvedCompanyId || !resolvedProgramId) return null;

		return `/api/v1/company/program-detail/${resolvedCompanyId}/${resolvedProgramId}`;
	});

	return useFetch<ProgramDetailResponse>(() => url.value || '', {
		key: computed(() => {
			const resolvedCompanyId = toValue(companyId);
			const resolvedProgramId = toValue(programId);
			return `company-program-detail-${resolvedCompanyId}-${resolvedProgramId}`;
		}),
		server: true,
		lazy: false,
		immediate: !!toValue(companyId) && !!toValue(programId),
	});
};
