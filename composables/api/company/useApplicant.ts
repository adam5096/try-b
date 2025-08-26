import type { ApplicantDetail } from '~/types/company/applicant';
import { useApiFetch } from '~/composables/api/shared/useApiFetch';

export const useApplicant = (programId: string | number, applicantId: string | number) => {
  const url = `/api/v1/programs/${programId}/applications/${applicantId}`;

  return useApiFetch<ApplicantDetail>(url, {
    key: `applicant-${applicantId}`,
  });
};
