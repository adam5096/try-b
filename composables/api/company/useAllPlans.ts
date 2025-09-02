import type { AllPlan } from '~/types/company/plan/list';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export function useAllPlans() {
  const {
    data: plans,
    pending: isLoading,
    error,
    execute: fetchAllPlans,
  } = useCompanyApiFetch<AllPlan[]>('/v1/plans', {
    immediate: false,
  });

  return {
    plans,
    isLoading,
    error,
    fetchAllPlans,
  };
}
