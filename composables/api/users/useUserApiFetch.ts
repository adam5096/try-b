import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';
import { useApiFetch } from '~/composables/api/shared/useApiFetch';

/**
 * 專用於 Users 模塊的 API Fetch 函數
 * 自動注入 User JWT Token，與 Company 模塊保持一致的架構
 */
export const useUserApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const customOptions: UseFetchOptions<T> = {
    ...options,
    onRequest(context) {
      const urlString = toValue(url);
      
      // 注入 User 模塊的 JWT Token（除了登入請求）
      if (!urlString.includes('/login')) {
        const userAuthStore = useUserAuthStore();
        const token = userAuthStore.token;
        
        if (token) {
          context.options.headers = new Headers(context.options.headers);
          context.options.headers.set('Authorization', `Bearer ${token}`);
        }
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
  
  return useApiFetch(url, customOptions);
};
