import { ofetch } from 'ofetch';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = ofetch.create({
    // baseURL: config.public.apiBase,

    onRequest({ request, options }) {
      // 添加請求 ID 用於追蹤
      if (process.client) {
        options.headers = {
          ...options.headers,
          'X-Request-ID': crypto.randomUUID()
        } as any;
      }
    },

    onResponseError({ request, response }) {
      // 記錄錯誤詳情
      console.error(`API Error [${response.status}]:`, {
        url: request,
        status: response.status,
        statusText: response.statusText
      });

      // We only want to handle 401 errors on the client side.
      if (process.server || response.status !== 401) {
        return;
      }

      const router = useRouter();
      const currentPath = router.currentRoute.value.path;

      // Determine which store and login route to use based on the API request path
      if (String(request).startsWith('/api/user')) {
        const userAuthStore = useUserAuthStore();
        userAuthStore.user = null; // Clear user state
        const loginRoute = '/users/login';
        if (currentPath !== loginRoute) {
          // Add a redirect query to send the user back after login
          navigateTo({ path: loginRoute, query: { redirect: currentPath } });
        }
      } else if (String(request).startsWith('/api/company')) {
        const companyAuthStore = useCompanyAuthStore();
        companyAuthStore.user = null; // Clear company user state
        const loginRoute = '/company/login';
        if (currentPath !== loginRoute) {
          navigateTo({ path: loginRoute, query: { redirect: currentPath } });
        }
      }
    },

    onRequestError({ request, error }) {
      // 處理網路錯誤
      console.error('Network Error:', {
        url: request,
        error: error.message
      });

      if (process.client) {
        // 檢查是否為網路連線問題
        if (!navigator.onLine) {
          console.warn('User is offline');
        }
      }
    }
  });

  // Provide the typed api client to the nuxt app
  nuxtApp.provide('api', api);
});
