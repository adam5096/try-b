import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  CompanyUser,
  LoginData,
  CompanyLoginResponse,
  CompanyProfile,
} from '~/types/company/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  const userCookie = useCookie<CompanyProfile | null>('companyAuthUser');
  const user = ref<CompanyProfile | null>(userCookie.value ?? null);

  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    try {
      const data = await api<CompanyProfile>('/api/v1/company');
      return data;
    } catch (error) {
      user.value = null;
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  async function login(loginData: LoginData) {
    await api<CompanyLoginResponse>('/api/v1/company/login', {
      method: 'POST',
      body: {
        identifier: loginData.account,
        password: loginData.psd,
      },
    });

    // Add a slight delay to allow the browser to process the HttpOnly cookie from the login response
    await new Promise(resolve => setTimeout(resolve, 1000));

    // After successful login, fetch the detailed company profile
    const detailedProfile = await fetchUser();
    if (detailedProfile) {
      user.value = detailedProfile;
      userCookie.value = detailedProfile; // Explicitly set the cookie
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
      userCookie.value = null; // Explicitly clear the cookie
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

