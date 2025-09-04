import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CompanyPlan, ActivePlan } from '~/types/company/plan/current';
import { isActivePlan } from '~/types/company/plan/current';
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

  const hasPlan = computed(() => plan.value && isActivePlan(plan.value));
  const planStatusText = computed(() => {
    if (isLoading.value && !plan.value) { return '方案資訊載入中...'; }
    if (error.value) { return '無法載入方案資訊'; }
    if (!plan.value) { return '無法載入方案資訊'; }

    const p = plan.value;
    
    // 檢查是否為無效方案
    if (!isActivePlan(p)) {
      // 優先使用 API 的 message，但提供合理的備用文字
      return p.message || '目前尚無有效方案';
    }

    // 有效方案的顯示邏輯
    const startDate = new Date(p.start_date).toLocaleDateString();
    const endDate = new Date(p.end_date).toLocaleDateString();

    return `目前的方案 ${p.plan_name} | 日期：${startDate} - ${endDate} | 體驗人數上限 ${p.max_participants} 人 | 剩餘 ${p.remaining_people} 人`;
  });

  // 在 SSR 階段使用的初始化：確保伺服端渲染前已取得方案
  async function init() {
    if (!plan.value && authStore.token) {
      try {
        await fetchCurrentPlan();
      } catch {
        // 靜默失敗，交由頁面在客戶端再處理
      }
    }
  }

  return {
    plan,
    isLoading,
    error,
    hasPlan,
    planStatusText,
    fetchCurrentPlan,
    init,
  };
});
