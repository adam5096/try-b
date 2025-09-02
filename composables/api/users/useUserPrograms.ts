import type { ProgramsResponse, ProgramsQueryParams } from '~/types/users/program';

export const useUserPrograms = () => {
  const fetchPrograms = async (params: ProgramsQueryParams = {}) => {
    const config = useRuntimeConfig();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.jobType) queryParams.append('jobType', params.jobType);
    if (params.location) queryParams.append('location', params.location);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    
    // 環境判斷：生產環境直接使用後端，開發環境使用代理
    const baseURL = process.env.NODE_ENV === 'production' 
      ? config.public.apiBase
      : '/api-proxy';
    
    const url = `${baseURL}/v1/programs${queryString ? '?' + queryString : ''}`;

    try {
      const data = await $fetch<ProgramsResponse>(url, { method: 'GET' });
      
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
    fetchPrograms
  };
};
