import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
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
  // 保存登入回應中的基本使用者資訊（含 Role、Account）以供版頭顯示
  const basicUserCookie = useCookie<CompanyUser | null>('companyAuthBasic', cookieOptions);

  const token = ref<string | null>(tokenCookie.value ?? null);
  const user = ref<CompanyProfile | null>(userCookie.value ?? null);
  const companyId = ref<number | null>(companyIdCookie.value ?? null);
  const basicUser = ref<CompanyUser | null>(basicUserCookie.value ?? null);

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
      const { data: userData } = await useFetch<CompanyProfile>('/v1/company', {
        baseURL: '/api'
      });
      if (userData.value) {
        user.value = userData.value;
        userCookie.value = userData.value;
      } else {
        throw new Error('No user data returned');
      }
    } catch (error) {
      // 如果 token 失效或驗證失敗，則清除所有登入狀態
      await logout();
    }
  }

  /**
   * @description 企業使用者登入流程
   *              1. 呼叫登入 API (POST /v1/company/login) 以取得 token
   *              2. 成功後，儲存 token
   *              3. 接著呼叫 fetchUser() 取得完整的企業使用者資料
   */
  async function login(loginData: LoginData) {
    try {
      // 使用統一的 API 調用方式，與其他端點保持一致
      const { data: response, error } = await useFetch<CompanyLoginResponse>('/v1/company/login', {
        method: 'POST',
        baseURL: '/api',
        headers: {
          'Accept': 'application/json',
        },
        body: {
          identifier: loginData.account,
          password: loginData.psd,
        },
      });

      if (error.value) {
        throw error.value;
      }

      if (response.value && response.value.token) {
        token.value = response.value.token;
        tokenCookie.value = response.value.token;

        // 從登入回應中取得並儲存 CompanyId
        companyId.value = response.value.user.companyId;
        companyIdCookie.value = response.value.user.companyId;

        // 保存登入回應中的基本使用者資訊（Account/Role）
        basicUser.value = response.value.user;
        basicUserCookie.value = response.value.user;


        // 登入成功後，重置企業付款狀態持久化並同步到 store
        const companyPayedCookie = useCookie<boolean>('company_is_payed', {
          path: '/',
          sameSite: 'lax',
        });
        companyPayedCookie.value = false;
        try {
          const { useCompanyPlanStore } = await import('~/stores/company/usePlanStore');
          const planStore = useCompanyPlanStore();
          planStore.resetPaid();
        } catch (e) {
          // 忽略可能的循環依賴問題，至少 Cookie 已重置
        }
      } else {
        throw new Error('登入失敗：無效的回應格式');
      }
    } catch (error) {
      await logout();
      throw error;
    }
  }

  /**
   * @description 企業使用者登出流程
   */
  async function logout() {
    if (token.value) {
      try {
        await useFetch('/v1/company/logout', {
          method: 'POST',
          baseURL: '/api',
        });
      } catch (error) {
      }
    }
    user.value = null;
    userCookie.value = null;
    token.value = null;
    tokenCookie.value = null;
    companyId.value = null;
    companyIdCookie.value = null;
    basicUser.value = null;
    basicUserCookie.value = null;

    // 也一併清除企業付款狀態的持久化 Cookie
    const companyPayedCookie = useCookie<boolean | null>('company_is_payed', {
      path: '/',
      sameSite: 'lax',
    });
    companyPayedCookie.value = null;

    // 清除「首次進入方案列表」的旗標 Cookie
    const firstVisitFlag = useCookie<boolean | null>('company_purchase_first_visit_done', {
      path: '/',
      sameSite: 'lax',
    });
    firstVisitFlag.value = null;
  }

  return {
    user,
    token,
    companyId,
    basicUser,
    isLoggedIn,
    login,
    logout,
    fetchUser,
  };
});

