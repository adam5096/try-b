import type { CommentsQueryParams, CommentsResponse } from '~/types/users/comment';

export const useUserComments = () => {
	const fetchComments = async (params: CommentsQueryParams = {}) => {
		const queryParams = new URLSearchParams();

		if (params.page) { queryParams.append('page', params.page.toString()); }
		if (params.limit) { queryParams.append('limit', params.limit.toString()); }
		if (params.status && params.status.length > 0) {
			params.status.forEach(status => queryParams.append('status', status));
		}
		if (params.sort) { queryParams.append('sort', params.sort); }

		const queryString = queryParams.toString();
		// 動態取得 userId，避免硬編碼
		const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
		const authStoreForId = useUserAuthStore();
		const userId = authStoreForId.user?.id;

		if (!userId) {
			throw new Error('尚未登入或缺少使用者資訊，無法取得評價列表');
		}

		const url = `/api/v1/users/comments/${userId}${queryString ? '?' + queryString : ''}`;

		try {
			// 取得 user auth token 來設定 headers
			const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
			const authStore = useUserAuthStore();
			const headers: Record<string, string> = {};

			if (authStore.token) {
				headers.authorization = `Bearer ${authStore.token}`;
			}

			// 使用 $fetch 呼叫本地 BFF 端點
			const data = await $fetch<CommentsResponse>(url, {
				method: 'GET',
				headers,
			});

			return {
				data: { value: data },
				error: { value: null },
				pending: { value: false },
			};
		}
		catch (error) {
			return {
				data: { value: null },
				error: { value: error },
				pending: { value: false },
			};
		}
	};

	return {
		fetchComments,
	};
};
