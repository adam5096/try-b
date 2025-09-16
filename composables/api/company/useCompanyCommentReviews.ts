import type { CompanyEvaluationListResponse } from '~/types/company/evaluation';

export interface FetchCompanyEvaluationsParams {
	page?: number;
	limit?: number;
}

export const useCompanyCommentReviews = () => {
	const fetchEvaluations = async (companyId: number, params: FetchCompanyEvaluationsParams = {}) => {
		const query = new URLSearchParams();
		if (params.page) { query.append('page', String(params.page)); }
		if (params.limit) { query.append('limit', String(params.limit)); }
		const qs = query.toString();

		const path = `/api/v1/company/comment-reviews/${companyId}${qs ? `?${qs}` : ''}`;

		// 使用統一的 useFetch，token 處理由 Server API 層負責
		const { data, error } = await useFetch<CompanyEvaluationListResponse>(path, {
			method: 'GET',
			baseURL: '/api',
		});

		return { data, error } as const;
	};

	return { fetchEvaluations };
};
