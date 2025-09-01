import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useApiFetch } from '~/composables/api/shared/useApiFetch';
import type {
  LoginData,
  CompanyLoginResponse,
  CompanyUser,
  CompanyProfile,
} from '~/types/company/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
  // 統一 Cookie 選項，確保會被瀏覽器保存並於路由間持久化
  const cookieOptions = {
    path: '/',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 天
    secure: (import.meta as any).prod ?? false,
  };
  const tokenCookie = useCookie<string | null>('companyAuthToken', cookieOptions);
  const userCookie = useCookie<CompanyProfile | null>('companyAuthUser', cookieOptions);
  const companyIdCookie = useCookie<number | null>('companyId', cookieOptions);

  const token = ref<string | null>(tokenCookie.value ?? null);
  const user = ref<CompanyProfile | null>(userCookie.value ?? null);
  const companyId = ref<number | null>(companyIdCookie.value ?? null);

  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  /**
   * @description 取得當前登入的企業使用者詳細資料
   *              此函式會使用儲存的 token 發送請求至 GET /api/v1/company
   */
  async function fetchUser() {
    if (!token.value) return;

    try {
      const { data: userData } = await useApiFetch<CompanyProfile>('/api/v1/company');
      if (userData.value) {
        user.value = userData.value;
        userCookie.value = userData.value;
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      // 如果 token 失效或驗證失敗，則清除所有登入狀態
      await logout();
      console.error('取得使用者資料失敗:', error);
    }
  }

  /**
   * @description 企業使用者登入流程
   *              1. 呼叫登入 API (POST /api/v1/company/login) 以取得 token
   *              2. 成功後，儲存 token
   *              3. 接著呼叫 fetchUser() 取得完整的企業使用者資料
   */
  async function login(loginData: LoginData) {
    try {
      const url = '/api-proxy/v1/company/login';

      const response = await $fetch<CompanyLoginResponse>(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: {
          identifier: loginData.account,
          password: loginData.psd,
        },
      });

      if (response && response.token) {
        token.value = response.token;
        tokenCookie.value = response.token;

        // 從登入回應中取得並儲存 CompanyId
        // 根據 API response, user 物件中包含 Id 而非 CompanyId
        companyId.value = response.user.Id;
        companyIdCookie.value = response.user.Id;

        // 登入成功後，立即獲取詳細的使用者資料
        // await fetchUser(); // 暫時註解此行以避免初始登入時不必要的呼叫
      } else {
        // 如果後端回傳 Status: false 或沒有 token，也視為錯誤
        throw new Error((response as any)?.message || '登入失敗：無效的回應格式');
      }
    } catch (error) {
      await logout();
      console.error('登入時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * @description 企業使用者登出流程
   */
  async function logout() {
    if (token.value) {
      try {
        await useApiFetch('/api/v1/company/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('登出時 API 呼叫失敗:', error);
      }
    }
    user.value = null;
    userCookie.value = null;
    token.value = null;
    tokenCookie.value = null;
    companyId.value = null;
    companyIdCookie.value = null;
  }

  return {
    user,
    token,
    companyId,
    isLoggedIn,
    login,
    logout,
    fetchUser,
  };
});

