import type { ApplicantDetail } from '~/types/company/applicant';

export const useApplicant = (programId: string | number, applicantId: string | number) => {
  const url = `/api/v1/programs/${programId}/applicantions/${applicantId}`;

  return useAsyncData<ApplicantDetail>(
    `applicant-${applicantId}`,
    () => $fetch(url),
  );
};
