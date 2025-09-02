import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 統一的 API 基礎函數
 * 自動處理開發/生產環境的 API 端點選擇
 */
export const useApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();
  
  // 環境判斷：生產環境直接使用後端，開發環境使用代理
  const baseURL = process.env.NODE_ENV === 'production' 
    ? config.public.apiBase
    : '/api-proxy';

  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL,
    onRequest(context) {
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
