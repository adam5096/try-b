import type { UseFetchOptions } from 'nuxt/app';

export const useApiFetch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const authStore = useCompanyAuthStore();

  const customOptions: UseFetchOptions<T> = {
    ...options,
  };

  // 如果 token 存在，則自動加入 authorization header
  if (authStore.token) {
    customOptions.headers = {
      ...customOptions.headers,
      Authorization: `Bearer ${authStore.token}`,
    };
  }

  return useFetch(url, customOptions);
};
