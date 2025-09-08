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

    const url = `/api/v1/company/${companyId}/evaluations${qs ? `?${qs}` : ''}`;
    console.info('[API] about to fetch', url)

    const { data, error } = await useCompanyApiFetch<CompanyEvaluationListResponse>(url, {
      method: 'GET',
      onRequest(ctx) {
        try {
          const hdr = ctx.options?.headers instanceof Headers
            ? Object.fromEntries((ctx.options.headers as Headers).entries())
            : ctx.options?.headers;
          console.info('➡️ request', String(ctx.request), hdr)
        } catch {}
      }
    });

    return { data, error };
  };

  return { fetchEvaluations };
};


