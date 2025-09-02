import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 專用於 Company 模塊的 API Fetch 函數
 * 自動注入 Company JWT Token，與 Users 模塊保持一致的架構
 */
export const useCompanyApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();
  
  // 環境判斷：生產環境直接使用後端，開發環境使用代理
  const baseURL = process.env.NODE_ENV === 'production' 
    ? config.public.apiBase
    : '/api-proxy';

  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL,
    onRequest(context) {
      const urlString = toValue(url);
      
      // 注入 Company 模塊的 JWT Token（避免循環依賴）
      // 直接從 cookie 讀取 token，而不是從 store
      const tokenCookie = useCookie<string | null>('companyAuthToken');
      const token = tokenCookie.value;

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
