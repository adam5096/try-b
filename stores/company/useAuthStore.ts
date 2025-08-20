import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { CompanyUser, LoginData } from '~/types/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  const user = useCookie<CompanyUser | null>('companyAuthUser', { default: () => null });

  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    try {
      const data = await $fetch<CompanyUser>('/api/company/user');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  }

  async function login(loginData: LoginData) {
    await $fetch('/api/company/login', {
      method: 'POST',
      body: loginData,
    });
    await fetchUser();
  }

  async function logout() {
    await $fetch('/api/company/logout', {
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

