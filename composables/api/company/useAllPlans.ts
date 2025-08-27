import type { AllPlan } from '~/types/company/plan/list';
import { useApiFetch } from '~/composables/api/shared/useApiFetch';

export function useAllPlans() {
  const {
    data: plans,
    pending: isLoading,
    error,
    execute: fetchAllPlans,
  } = useApiFetch<AllPlan[]>('/api/v1/plans', {
    immediate: false,
  });

  return {
    plans,
    isLoading,
    error,
    fetchAllPlans,
  };
}
