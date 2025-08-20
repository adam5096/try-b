import { ofetch } from 'ofetch';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = ofetch.create({
    baseURL: config.public.apiBase,

    onResponseError({ request, response }) {
      // We only want to handle 401 errors on the client side.
      if (process.server || response.status !== 401) {
        return;
      }

      const router = useRouter();
      const currentPath = router.currentRoute.value.path;

      // Determine which store and login route to use based on the API request path
      if (String(request).startsWith('/api/user')) {
        const userAuthStore = useUserAuthStore();
        userAuthStore.user = null; // Clear user state
        const loginRoute = '/users/login';
        if (currentPath !== loginRoute) {
          // Add a redirect query to send the user back after login
          navigateTo({ path: loginRoute, query: { redirect: currentPath } });
        }
      } else if (String(request).startsWith('/api/company')) {
        const companyAuthStore = useCompanyAuthStore();
        companyAuthStore.user = null; // Clear company user state
        const loginRoute = '/company/login';
        if (currentPath !== loginRoute) {
          navigateTo({ path: loginRoute, query: { redirect: currentPath } });
        }
      }
    },
  });

  // Provide the typed api client to the nuxt app
  nuxtApp.provide('api', api);
});
