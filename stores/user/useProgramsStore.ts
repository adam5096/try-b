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
      .sort((a, b) => (b.Score ?? 0) - (a.Score ?? 0))
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

      console.log('Fetching programs with params:', queryParams);

      const { data, error: apiError, pending } = await apiFetchPrograms(queryParams);

      console.log('API Response:', { data: data.value, error: apiError.value, pending: pending.value });

      if (apiError.value) {
        console.error('API Error:', apiError.value);
        const err = apiError.value as { data?: { message?: string }; message?: string };
        throw new Error(err?.data?.message ?? err?.message ?? '取得計畫列表失敗');
      }

      if (data.value) {
        console.log('Setting programs data:', data.value);
        // 正規化：確保每一筆清單都有可用的 Program Id
        const normalizedItems = (data.value.items || []).map((raw: any) => {
          // 嚴格優先使用真正的 Program.Id（詳細頁 API 使用的 Id）
          const programIdCandidate =
            raw?.Program?.Id ??
            raw?.Program?.id ??
            raw?.Id ??
            raw?.id ??
            null; // 不再使用 ProgramId/ApplicationId 以避免誤導到 404

          return {
            ...raw,
            Id: programIdCandidate,
          } as unknown as Program;
        });

        programs.value = normalizedItems;
        total.value = data.value.total || 0;
        currentPage.value = data.value.page || 1;
        currentLimit.value = data.value.limit || 6;
        
        console.log('Store updated:', {
          programsCount: programs.value.length,
          total: total.value,
          currentPage: currentPage.value
        });
      } else {
        console.warn('No data received from API');
        programs.value = [];
        total.value = 0;
      }
    } catch (err) {
      console.error('Error in fetchPrograms:', err);
      error.value = err instanceof Error ? err.message : '取得計畫列表時發生未知錯誤';
      programs.value = [];
      total.value = 0;
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
