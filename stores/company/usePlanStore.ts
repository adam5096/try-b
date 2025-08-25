import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CompanyPlan } from '~/types/company/plan';

export const useCompanyPlanStore = defineStore('companyPlan', () => {
  const plan = ref<CompanyPlan | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const hasPlan = computed(() => !!plan.value);
  const planStatusText = computed(() => {
    if (!plan.value) return '方案資訊載入中...';
    
    const { planName, period, usageQuota } = plan.value;
    return `目前的方案 ${planName} | 日期：${period.startDate} - ${period.endDate} | 體驗人數上限 ${usageQuota.limit} 人 | 剩餘 ${usageQuota.remaining} 人`;
  });

  async function fetchCurrentPlan() {
    if (hasPlan.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const response = await api<CompanyPlan>('/api/v1/company/plans/current');
      plan.value = response;
    } catch (e: any) {
      error.value = e;
      console.error('無法獲取企業方案:', e);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    plan,
    isLoading,
    error,
    hasPlan,
    planStatusText,
    fetchCurrentPlan,
  };
});
