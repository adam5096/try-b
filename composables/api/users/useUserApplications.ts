import { useUserApiFetch } from '~/composables/api/users/useUserApiFetch';
import type { SubmitApplicationPayload, SubmitApplicationResponse, SubmitApplicationAlreadyAppliedError } from '~/types/users/application';

export const useUserApplications = () => {
	const submitApplication = async (programId: number | string, payload: SubmitApplicationPayload) => {
		const url = `/api-proxy/v1/programs/${programId}/applications`;
		try {
			const response = await useUserApiFetch<SubmitApplicationResponse>(url, {
				method: 'POST',
				body: payload,
			});
			return { data: response, status: 201 as 200 | 201 };
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
