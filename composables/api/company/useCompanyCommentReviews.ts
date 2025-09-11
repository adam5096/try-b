import type { CompanyEvaluationListResponse } from '~/types/company/evaluation';

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

    const path = `/api/v1/company/comment-reviews/${companyId}${qs ? `?${qs}` : ''}`;

    // 在客戶端和伺服器端都使用本地 BFF 端點
    try {
      const resp = await $fetch<CompanyEvaluationListResponse>(path, {
        method: 'GET',
      });
      return { data: { value: resp }, error: { value: null } } as const;
    } catch (e) {
      return { data: { value: null }, error: { value: e } } as const;
    }
  };

  return { fetchEvaluations };
};


