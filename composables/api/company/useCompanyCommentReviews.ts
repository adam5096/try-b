import type { CompanyEvaluationListResponse } from '~/types/company/evaluation';
import { useCompanyApiFetch } from './useCompanyApiFetch';

export interface FetchCompanyEvaluationsParams {
  page?: number;
  limit?: number;
}

export const useCompanyCommentReviews = () => {
  const fetchEvaluations = async (companyId: number, params: FetchCompanyEvaluationsParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    const qs = query.toString();

    const path = `/api/v1/company/${companyId}/evaluations${qs ? `?${qs}` : ''}`;
    console.info('[API] about to fetch', path)

    // 在客戶端改用 $fetch 發送實際 HTTP，避免 SSR 去重導致 Network 無請求
    if (process.client) {
      const config = useRuntimeConfig();
      const baseURL = process.env.NODE_ENV === 'production' ? config.public.apiBase : '/api-proxy';
      const tokenCookie = useCookie<string | null>('companyAuthToken');
      const fullUrl = `${baseURL}${path}`;
      try {
        const resp = await $fetch<CompanyEvaluationListResponse>(fullUrl, {
          method: 'GET',
          headers: tokenCookie.value ? { Authorization: `Bearer ${tokenCookie.value}` } : undefined,
        });
        return { data: { value: resp }, error: { value: null } } as const;
      } catch (e) {
        console.error('❌ $fetch company evaluations failed:', e);
        return { data: { value: null }, error: { value: e } } as const;
      }
    }

    // 伺服器端維持 useFetch（可利用 SSR 預取）
    const { data, error } = await useCompanyApiFetch<CompanyEvaluationListResponse>(path, { method: 'GET' });
    return { data, error } as const;
  };

  return { fetchEvaluations };
};


