import type { ApplicantDetail } from '~/types/company/applicant';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export const useApplicant = (programId: string | number, applicantId: string | number) => {
  const url = `/api/v1/programs/${programId}/applications/${applicantId}`;

  return useCompanyApiFetch<ApplicantDetail>(url, {
    key: `applicant-${applicantId}`,
  });
};
