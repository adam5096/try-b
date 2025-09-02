import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 專用於 Company 模塊的 API Fetch 函數
 * 自動注入 Company JWT Token，與 Users 模塊保持一致的架構
 */
export const useCompanyApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();
  const customOptions: UseFetchOptions<T> = {
    ...options,
    // 一律透過 Vite 代理，統一呼叫 /api-proxy → 後端 /api
    baseURL: '/api-proxy',
    onRequest(context) {
      const urlString = toValue(url);
      
      // 注入 Company 模塊的 JWT Token
      const companyAuthStore = useCompanyAuthStore();
      const token = companyAuthStore.token as unknown as string | null;

      if (token) {
        context.options.headers = new Headers(context.options.headers as any);
        context.options.headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Chain the original onRequest if it exists from the call site
      if (options.onRequest) {
        if (Array.isArray(options.onRequest)) {
          options.onRequest.forEach(hook => hook(context));
        } else if (typeof options.onRequest === 'function') {
          options.onRequest(context);
        }
      }
    },
  };
  
  return useFetch(url, customOptions);
};
