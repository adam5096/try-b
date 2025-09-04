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

  // 熱門邏輯：預留擴展點
  const isPopularProgram = (program: Program): boolean => {
    // 目前規則：Score > 10 才視為熱門
    // 未來可擴充：加入 FavoritesCount、ViewsCount、近7日成長率等加權計算
    const score = program.Score ?? 0;
    return score > 10;
  };

  const computePopularPrograms = (list: Program[]): Program[] => {
    // 預留擴展：可改為多指標加權排序或時間區間篩選
    return [...list]
      .filter(isPopularProgram)
      .sort((a, b) => (b.Score ?? 0) - (a.Score ?? 0))
      .slice(0, 5);
  };

  // Computed properties
  const items = computed(() => programs.value);
  const popular = computed(() => computePopularPrograms(programs.value));

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
          // 使用新的 response body 結構，直接使用 Id 欄位
          const programId = raw?.Id ?? null;
          const normalizeToHttps = (u?: string | null) => (u ? u.replace(/^http:\/\//i, 'https://') : null);

          return {
            ...raw,
            Id: programId,
            CoverImage: normalizeToHttps(raw?.CoverImage),
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
