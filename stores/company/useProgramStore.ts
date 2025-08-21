import { defineStore } from 'pinia';
import type { ProgramsResponse, Program } from '~/types/company/program';

export const useCompanyProgramStore = defineStore('company-program', () => {
  const authStore = useCompanyAuthStore();
  const programs = ref<Program[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(21);

  async function fetchPrograms() {
    if (!authStore.isLoggedIn || !authStore.user) return;

    const { data, error } = await useFetch<ProgramsResponse>(`/api-proxy/api/v1/company/${authStore.user.Id}/programs`, {
      method: 'POST',
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

  return {
    programs,
    total,
    page,
    limit,
    fetchPrograms,
    setPage,
  };
});
