import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CompanyPlan } from '~/types/company/plan/current';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export const useCompanyPlanStore = defineStore('companyPlan', () => {
  const authStore = useCompanyAuthStore();
  const {
    data: plan,
    pending: isLoading,
    error,
    execute: fetchCurrentPlan,
  } = useCompanyApiFetch<CompanyPlan>('/api/v1/plans/current', {
    immediate: false, // 改為 false，避免在沒有 token 時立即請求
  });

  // 監聽 token 變化，當 token 存在時才獲取 plan
  watch(
    () => authStore.token,
    (newToken) => {
      if (newToken) {
        fetchCurrentPlan();
      }
    },
    { immediate: true }, // 立即執行一次，以處理頁面刷新時 token 已存在的情況
  );

  const hasPlan = computed(() => !!plan.value);
  const planStatusText = computed(() => {
    if (isLoading.value && !plan.value) { return '方案資訊載入中...'; }
    if (error.value || !plan.value) { return '無法載入方案資訊'; }

    const p = plan.value;
    const startDate = new Date(p.start_date).toLocaleDateString();
    const endDate = new Date(p.end_date).toLocaleDateString();

    return `目前的方案 ${p.plan_name} | 日期：${startDate} - ${endDate} | 體驗人數上限 ${p.max_participants} 人 | 剩餘 ${p.remaining_people} 人`;
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
