import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { CompanyUser, LoginData, CompanyLoginResponse } from '~/types/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  const user = useCookie<CompanyUser | null>('companyAuthUser', { default: () => null });
  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    if (!user.value) return; // Optimization: don't fetch if user is already null

    try {
      // Assuming the new endpoint for fetching user data is '/api/v1/company/user'
      const data = await api<CompanyUser>('/api/v1/company/user');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  }

  async function login(loginData: LoginData) {
    const response = await api<CompanyLoginResponse>('/api/v1/company/login', {
      method: 'POST',
      body: {
        identifier: loginData.account,
        password: loginData.psd,
      },
    });

    if (response.user) {
      user.value = response.user;
    } else {
      // Fallback to fetchUser if user data is not in the login response
      await fetchUser();
    }
  }

  async function logout() {
    try {
      await api('/api/v1/company/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      user.value = null;
    }
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
    login,
    logout,
  };
});

