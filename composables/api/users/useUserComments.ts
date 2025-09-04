import type { CommentsQueryParams, CommentsResponse } from '~/types/users/comment';
import { useUserApiFetch } from './useUserApiFetch';

export const useUserComments = () => {
  const fetchComments = async (params: CommentsQueryParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status && params.status.length > 0) {
      params.status.forEach(status => queryParams.append('status', status));
    }
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    // 動態取得 userId，避免硬編碼
    const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
    const authStoreForId = useUserAuthStore();
    const userId = authStoreForId.user?.id;

    if (!userId) {
      throw new Error('尚未登入或缺少使用者資訊，無法取得評價列表');
    }

    const url = `/api/v1/users/${userId}/evaluations${queryString ? '?' + queryString : ''}`;

    try {
      // 調試：檢查認證狀態
      const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
      const authStore = useUserAuthStore();
      console.log('🔐 Auth status:', {
        isLoggedIn: authStore.isLoggedIn,
        hasToken: !!authStore.token,
        token: authStore.token ? `${authStore.token.substring(0, 20)}...` : 'null'
      });

      // 修正：使用 useUserApiFetch 來確保 JWT token 被注入
      const data = await useUserApiFetch<CommentsResponse>(url, { method: 'GET' });
      
      return {
        data: { value: data },
        error: { value: null },
        pending: { value: false }
      };
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      return {
        data: { value: null },
        error: { value: error },
        pending: { value: false }
      };
    }
  };

  return {
    fetchComments
  };
};
