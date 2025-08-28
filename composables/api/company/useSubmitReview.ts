import type { FetchError } from 'ofetch';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

interface SubmitReviewPayload {
  status_id: 1 | 2; // 1 for rejected, 2 for approved
  comment: string;
}

export interface SubmitReviewResponse {
  message: string;
  status: number;
  status_title: 'Approved' | 'Rejected' | string;
  comment: string;
}

export const useSubmitReview = () => {
  const loading = ref(false);
  const error = ref<FetchError | null>(null);
  const data = ref<SubmitReviewResponse | null>(null);

  const submit = async (
    programId: string | number,
    participantId: string | number,
    payload: SubmitReviewPayload,
  ) => {
    loading.value = true;
    error.value = null;
    data.value = null;

    const url = `/api/v1/programs/${programId}/applications/${participantId}/review`;

    const { data: result, error: fetchError } = await useCompanyApiFetch<SubmitReviewResponse>(url, {
      method: 'PUT',
      body: payload,
    });

    if (fetchError.value) {
      error.value = fetchError.value;
    } else {
      data.value = result.value;
    }

    loading.value = false;
  };

  return {
    submit,
    loading,
    error,
    data,
  };
};
