import type { UseFetchOptions } from 'nuxt/app';

export const useApiFetch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();

  const defaults: UseFetchOptions<T> = {
    // baseURL: config.public.apiBase, // <--- 移除 baseURL
  };

  return useFetch(url, { ...defaults, ...options });
};
