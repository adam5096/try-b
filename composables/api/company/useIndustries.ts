import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export interface BasicOptionItem {
  id: number;
  title: string;
}

// 取得產業清單
export const useIndustries = () => {
  return useCompanyApiFetch<BasicOptionItem[]>('/api/v1/industries', {
    method: 'GET',
  });
};


