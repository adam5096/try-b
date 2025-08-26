import type { UseFetchOptions } from 'nuxt/app';
import type { MaybeRefOrGetter } from 'vue';

export const useApiFetch = <T>(url: MaybeRefOrGetter<string>, options: UseFetchOptions<T> = {}) => {
  const customOptions: UseFetchOptions<T> = {
    ...options,
    onRequest(context) {
      const authStore = useCompanyAuthStore();
      if (authStore.token) {
        context.options.headers = new Headers(context.options.headers);
        context.options.headers.set('Authorization', `Bearer ${authStore.token}`);
      }

      // Chain the original onRequest if it exists from the call site
      if (options.onRequest) {
        if (Array.isArray(options.onRequest)) {
          // If it's an array of hooks, call each one
          options.onRequest.forEach(hook => hook(context));
        } else if (typeof options.onRequest === 'function') {
          // If it's a single hook, call it
          options.onRequest(context);
        }
      }
    },
  };

  return useFetch(url, customOptions);
};
