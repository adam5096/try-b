import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { CompanyUser, LoginData } from '~/types/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  const user = useCookie<CompanyUser | null>('companyAuthUser', { default: () => null });
  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    try {
      const data = await api<CompanyUser>('/company/user');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  }

  async function login(loginData: LoginData) {
    await api('/company/login', {
      method: 'POST',
      body: loginData,
    });
    await fetchUser();
  }

  async function logout() {
    await api('/company/logout', {
      method: 'POST',
    });
    user.value = null;
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
    login,
    logout,
  };
});

