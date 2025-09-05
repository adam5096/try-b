import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';
import type { BasicOptionItem } from './useIndustries';

// 取得職務清單
export const usePositions = () => {
  return useCompanyApiFetch<BasicOptionItem[]>('/api/v1/positions', {
    method: 'GET',
  });
};


