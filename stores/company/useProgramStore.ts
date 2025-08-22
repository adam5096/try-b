import { defineStore } from 'pinia';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import type { ProgramsResponse, Program, CreateProgramPayload } from '~/types/company/program';

export const useCompanyProgramStore = defineStore('company-program', () => {
  const authStore = useCompanyAuthStore();
  const programs = ref<Program[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(21);

  async function fetchPrograms() {
    if (!authStore.isLoggedIn || !authStore.user || !authStore.companyId) return;

    const { data, error } = await useApiFetch<ProgramsResponse>(`/api/v1/company/${authStore.companyId}/programs`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      params: {
        page: page.value,
        limit: limit.value,
      },
    });

    if (error.value) {
      console.error('Failed to fetch programs', error.value);
      return;
    }

    if (data.value) {
      programs.value = data.value.items;
      total.value = data.value.total;
    }
  }

  function setPage(newPage: number) {
    page.value = newPage;
    fetchPrograms();
  }

  async function createProgram(payload: CreateProgramPayload) {
    if (!authStore.isLoggedIn || !authStore.user || !authStore.companyId) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const { data, error } = await useApiFetch(`/api/v1/company/${authStore.companyId}/programs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: payload,
    });

    if (error.value) {
      console.error('Failed to create program:', error.value);
      return { success: false, error: error.value };
    }

    if (data.value) {
      // 新增成功後，可以選擇重新整理列表或直接導航
      await fetchPrograms(); 
      return { success: true, data: data.value };
    }

    return { success: false, error: new Error('Unknown error occurred') };
  }

  return {
    programs,
    total,
    page,
    limit,
    fetchPrograms,
    setPage,
    createProgram,
  };
});
