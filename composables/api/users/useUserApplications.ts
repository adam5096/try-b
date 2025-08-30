import { useUserApiFetchRaw } from '~/composables/api/users/useUserApiFetch';
import type { SubmitApplicationPayload, SubmitApplicationResponse, SubmitApplicationAlreadyAppliedError } from '~/types/users/application';

export const useUserApplications = () => {
	const submitApplication = async (programId: number | string, payload: SubmitApplicationPayload) => {
		const url = `/api-proxy/v1/programs/${programId}/applications`;
		try {
			const { data, status } = await useUserApiFetchRaw<SubmitApplicationResponse>(url, {
				method: 'POST',
				body: payload,
			});
			if (status === 200 || status === 201) {
				return { data, status } as { data: SubmitApplicationResponse; status: 200 | 201 };
			}
			// 其他非預期成功狀態，統一丟出錯誤以便上層處理
			return Promise.reject({ status, data });
		} catch (err: any) {
			const status = err?.status as number | undefined;
			if (status === 400) {
				const data = err?.data as SubmitApplicationAlreadyAppliedError | undefined;
				return Promise.reject({ status: 400, data });
			}
			return Promise.reject(err);
		}
	};

	return { submitApplication };
};
