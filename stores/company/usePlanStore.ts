import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CompanyPlan } from '~/types/company/plan';

export const useCompanyPlanStore = defineStore('companyPlan', () => {
  const { data: plan, pending: isLoading, error, execute: fetchCurrentPlan } = useFetch<CompanyPlan>('/api/v1/company/plans/current', {
    immediate: true, // Fetch immediately on store initialization
    transform: (response: any) => response.data, // Extract data from { status, data }
  });

  const hasPlan = computed(() => !!plan.value);
  const planStatusText = computed(() => {
    if (isLoading.value && !plan.value) return '方案資訊載入中...';
    if (error.value || !plan.value) return '無法載入方案資訊';
    
    const { planName, period, usageQuota } = plan.value;
    return `目前的方案 ${planName} | 日期：${period.startDate} - ${period.endDate} | 體驗人數上限 ${usageQuota.limit} 人 | 剩餘 ${usageQuota.remaining} 人`;
  });

  return {
    plan,
    isLoading,
    error,
    hasPlan,
    planStatusText,
    fetchCurrentPlan,
  };
});
