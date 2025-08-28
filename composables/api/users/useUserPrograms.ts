import type { ProgramsResponse, ProgramsQueryParams } from '~/types/users/program';
import { useUserApiFetch } from '~/composables/api/users/useUserApiFetch';

export const useUserPrograms = () => {
  const fetchPrograms = async (params: ProgramsQueryParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.industry) queryParams.append('industry', params.industry);
    if (params.jobType) queryParams.append('jobType', params.jobType);
    if (params.location) queryParams.append('location', params.location);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `/api-proxy/v1/users/programs${queryString ? '?' + queryString : ''}`;

    // JWT token 會由 useUserApiFetch 自動從 auth store 中獲取
    return await useUserApiFetch<ProgramsResponse>(url, {
      method: 'GET'
    });
  };

  return {
    fetchPrograms
  };
};
