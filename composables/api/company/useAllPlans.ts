import type { AllPlan } from '~/types/company/plan/list';

export function useAllPlans() {
  // 取得 company auth token 來設定 headers
  const tokenCookie = useCookie<string | null>('companyAuthToken');
  
  const {
    data: plans,
    pending: isLoading,
    error,
    execute: fetchAllPlans,
  } = useFetch<AllPlan[]>('/api/v1/company/plans', {
    key: 'company-plans',
    server: true, 
    lazy: false,
    immediate: false,
    headers: computed(() => {
      const headers: Record<string, string> = {};
      if (tokenCookie.value) {
        headers.authorization = `Bearer ${tokenCookie.value}`;
      }
      return headers;
    }),
  });

  return {
    plans,
    isLoading,
    error,
    fetchAllPlans,
  };
}
