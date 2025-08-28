import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 共享的基礎 API Fetch 函數
 * 不包含特定模塊的認證邏輯，供所有模塊基礎使用
 */
export const useApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL: useRuntimeConfig().public.apiBase,
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
