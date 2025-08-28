import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 專用於 Company 模塊的 API Fetch 函數
 * 自動注入 Company JWT Token，與 Users 模塊保持一致的架構
 */
export const useCompanyApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL: 'https://trybeta.rocket-coding.com',
    onRequest(context) {
      const urlString = toValue(url);
      
      // 注入 Company 模塊的 JWT Token
      const companyAuthStore = useCompanyAuthStore();
      const token = companyAuthStore.token;
      
      if (token) {
        context.options.headers = new Headers(context.options.headers);
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
