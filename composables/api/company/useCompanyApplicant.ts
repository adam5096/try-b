import type { ApplicantDetail } from '~/types/company/applicant';

export const useCompanyApplicant = (
	companyId: MaybeRefOrGetter<number | null>,
	programId: MaybeRefOrGetter<string | number>,
	applicantId: MaybeRefOrGetter<string | number>,
) => {
	const url = computed(() => {
		const resolvedCompanyId = toValue(companyId);
		const resolvedProgramId = toValue(programId);
		const resolvedApplicantId = toValue(applicantId);

		// 當 companyId 為空時，返回 null，不發送請求
		if (!resolvedCompanyId || !resolvedProgramId || !resolvedApplicantId) { return null; }

		return `/api/v1/company/${resolvedCompanyId}/programs/${resolvedProgramId}/applications/${resolvedApplicantId}`;
	});

	return useFetch<ApplicantDetail>(() => url.value || '', {
		key: computed(() => {
			const resolvedApplicantId = toValue(applicantId);
			return `company-applicant-${resolvedApplicantId}`;
		}),
		server: true,
		lazy: false,
		immediate: !!toValue(companyId) && !!toValue(programId) && !!toValue(applicantId),
	});
};
