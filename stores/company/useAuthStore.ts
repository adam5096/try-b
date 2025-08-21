import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type {
  LoginData,
  CompanyLoginResponse,
  CompanyUser,
} from '~/types/company/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  const tokenCookie = useCookie<string | null>('companyAuthToken');
  const userCookie = useCookie<CompanyUser | null>('companyAuthUser');

  const token = ref<string | null>(tokenCookie.value ?? null);
  const user = ref<CompanyUser | null>(userCookie.value ?? null);

  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  async function login(loginData: LoginData) {
    try {
      const response = await api<CompanyLoginResponse>('/api/v1/company/login', {
        method: 'POST',
        body: {
          identifier: loginData.account,
          password: loginData.psd,
        },
      });

      if (response && response.token && response.user) {
        token.value = response.token;
        tokenCookie.value = response.token;
        user.value = response.user;
        userCookie.value = response.user;
      } else {
        throw new Error('登入失敗：無效的回應格式');
      }
    } catch (error) {
      await logout();
      console.error('登入時發生錯誤:', error);
      throw error;
    }
  }

  async function logout() {
    if (token.value) {
      try {
        await api('/api/v1/company/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
      } catch (error) {
        console.error('登出時 API 呼叫失敗:', error);
      }
    }
    user.value = null;
    userCookie.value = null;
    token.value = null;
    tokenCookie.value = null;
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
  };
});

