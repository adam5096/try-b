import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

export const useApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL: useRuntimeConfig().public.apiBase,
    onRequest(context) {
      const urlString = toValue(url);
      let token: string | null = null;
      
      // 根據 API 路徑前綴決定使用哪個 store 的 token
      if (urlString.startsWith('/api/v1/company') || urlString.startsWith('/company')) {
        const companyAuthStore = useCompanyAuthStore();
        token = companyAuthStore.token;
      } else if (urlString.startsWith('/api/v1/user') || urlString.startsWith('/user')) {
        const userAuthStore = useUserAuthStore();
        token = userAuthStore.token;
      }
      
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
