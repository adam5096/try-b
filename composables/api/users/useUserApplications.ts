import type { SubmitApplicationPayload, SubmitApplicationResponse, SubmitApplicationAlreadyAppliedError } from '~/types/users/application';

export const useUserApplications = () => {
	const submitApplication = async (programId: number | string, payload: SubmitApplicationPayload) => {
		const url = `/api/v1/users/applications/${programId}`;
		
		// 取得 user auth token 來設定 headers
		const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
		const authStore = useUserAuthStore();
		const headers: Record<string, string> = {};
		
		if (authStore.token) {
			headers.authorization = `Bearer ${authStore.token}`;
		}
		
		try {
			// 使用 $fetch.raw 來取得完整的回應資訊（包含狀態碼）
			const response = await $fetch.raw<SubmitApplicationResponse>(url, {
				method: 'POST',
				headers,
				body: payload,
			});
			
			const data = response._data;
			const status = response.status;
			
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
