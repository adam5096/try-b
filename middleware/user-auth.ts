import { useUserAuthStore } from '~/stores/user/useAuthStore';

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useUserAuthStore();

  // On every protected route, we fetch the user to ensure their session is still valid.
  // This request is de-duplicated on initial client-side hydration if it was already made on the server.
  // For subsequent client-side navigations, it performs a fresh check.
  await authStore.fetchUser();

  // If, after attempting to fetch the user, they are not logged in,
  // redirect them to the login page.
  if (!authStore.isLoggedIn) {
		// Using `return navigateTo(...)` is the correct way to redirect in Nuxt middleware.
		return navigateTo({
			path: '/users/login',
			query: {
				// We can optionally add a redirect query to send the user back after login
				redirect: to.fullPath,
			},
		});
  }
});
