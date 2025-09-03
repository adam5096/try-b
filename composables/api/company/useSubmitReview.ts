import type { FetchError } from 'ofetch';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

interface SubmitReviewPayload {
  status_id: 2 | 3; // 2 for approved, 3 for rejected
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
    companyId: number | null,
    programId: string | number,
    participantId: string | number,
    payload: SubmitReviewPayload,
  ) => {
    // 當 companyId 為空時，設置錯誤並返回
    if (!companyId) {
      error.value = { message: '企業資訊載入中，請稍後再試' } as FetchError;
      return;
    }

    loading.value = true;
    error.value = null;
    data.value = null;

    const url = `/api/v1/company/${companyId}/programs/${programId}/applications/${participantId}/review`;

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
