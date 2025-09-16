import type { FetchError } from 'ofetch';

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

export const useCompanySubmitReview = () => {
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

		const url = `/api/v1/company/submit-review/${companyId}/${programId}/${participantId}`;

		try {
			const result = await $fetch<SubmitReviewResponse>(url, {
				method: 'PUT',
				body: payload,
			});

			data.value = result;
			error.value = null;
		}
		catch (fetchError: any) {
			error.value = fetchError;
			data.value = null;
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
