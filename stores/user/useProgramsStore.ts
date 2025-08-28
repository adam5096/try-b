import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Program, ProgramsQueryParams } from '~/types/users/program';
import { useUserPrograms } from '~/composables/api/users/useUserPrograms';

export const useUserProgramsStore = defineStore('userPrograms', () => {
  const programs = ref<Program[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const currentLimit = ref(6);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const items = computed(() => programs.value);
  const popular = computed(() => {
    // 取得評分最高的前 5 個計畫作為熱門計畫
    return [...programs.value]
      .sort((a, b) => b.Score - a.Score)
      .slice(0, 5);
  });

  const { fetchPrograms: apiFetchPrograms } = useUserPrograms();

  const fetchPrograms = async (params: ProgramsQueryParams = {}) => {
    try {
      loading.value = true;
      error.value = null;

      const queryParams = {
        page: params.page || currentPage.value,
        limit: params.limit || currentLimit.value,
        ...params
      };

      const { data, error: apiError } = await apiFetchPrograms(queryParams);

      if (apiError.value) {
        throw new Error(apiError.value.data?.message || '取得計畫列表失敗');
      }

      if (data.value) {
        programs.value = data.value.items;
        total.value = data.value.total;
        currentPage.value = data.value.page;
        currentLimit.value = data.value.limit;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '取得計畫列表時發生未知錯誤';
      console.error('Error fetching programs:', err);
    } finally {
      loading.value = false;
    }
  };

  const clearPrograms = () => {
    programs.value = [];
    total.value = 0;
    currentPage.value = 1;
    error.value = null;
  };

  return {
    // State
    programs,
    total,
    currentPage,
    currentLimit,
    loading,
    error,
    
    // Computed
    items,
    popular,
    
    // Actions
    fetchPrograms,
    clearPrograms
  };
});
