import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import type { ProgramsResponse, CreateProgramPayload } from '~/types/company/program';
import type { ProgramCreationResponse } from '~/types/company/programCreation';
import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export const useCompanyProgramStore = defineStore('company-program', () => {
  const authStore = useCompanyAuthStore();
  // 路徑固定使用 /api/...，由 useCompanyApiFetch 注入 baseURL 與 token
  const page = ref(1);
  const limit = ref(21);

  const { data, pending: isLoading, error, execute } = useCompanyApiFetch<ProgramsResponse>(() => `/api/v1/company/${authStore.companyId}/programs`, {
    immediate: false, // We will trigger this manually
    params: {
      page,
      limit,
    },
  });

  // Watch for companyId to become available and then fetch programs
  watch(
    () => authStore.companyId,
    (newCompanyId) => {
      if (newCompanyId) {
        execute(); // This is the new fetchPrograms trigger
      }
    },
    { immediate: true },
  );

  const programs = computed(() => (data.value?.items || []).map((p: any) => {
    const normalizeToHttps = (u?: string | null) => (u ? u.replace(/^http:\/\//i, 'https://') : null);
    return {
      ...p,
      CoverImage: normalizeToHttps(p?.CoverImage),
    };
  }));
  const total = computed(() => data.value?.total || 0);

  function setPage(newPage: number) {
    page.value = newPage;
    // execute(); // useFetch will re-run automatically when `page` param changes
  }
  
  // Expose `execute` as `fetchPrograms` for external use if needed (e.g., manual refresh)
  const fetchPrograms = execute;

  // SSR 初始化：在伺服端渲染前預抓資料
  async function init() {
    if (!data.value && authStore.companyId) {
      try {
        await execute();
      } catch {
        // ignore and let client retry
      }
    }
  }

  async function createProgram(payload: CreateProgramPayload) {
    if (!authStore.companyId) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const basePath = `/api/v1/company/${authStore.companyId}/programs`;
    const { data: responseData, error: fetchError } = await useCompanyApiFetch<ProgramCreationResponse>(basePath, {
      method: 'POST',
      body: payload,
    });

    if (fetchError.value) {
      console.error('Failed to create program:', fetchError.value);
      return { success: false, error: fetchError.value };
    }

    if (responseData.value) {
      await fetchPrograms();
      return { success: true, data: responseData.value };
    }

    return { success: false, error: new Error('Unknown error occurred') };
  }

  return {
    programs,
    total,
    page,
    limit,
    isLoading,
    error,
    fetchPrograms,
    setPage,
    createProgram,
    init,
  };
});
