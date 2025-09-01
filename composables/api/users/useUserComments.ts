import type { CommentsQueryParams, CommentsResponse } from '~/types/users/comment';

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
    const url = `/api-proxy/v1/comments${queryString ? '?' + queryString : ''}`;

    try {
      const data = await $fetch<CommentsResponse>(url, { method: 'GET' });
      
      return {
        data: { value: data },
        error: { value: null },
        pending: { value: false }
      };
    } catch (error) {
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
