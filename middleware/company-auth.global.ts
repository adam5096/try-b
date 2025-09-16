import { useCompanyAuthStore } from '~/stores/company/useAuthStore';

export default defineNuxtRouteMiddleware(async (to) => {
	// We only care about company routes
	if (!(to.path === '/company' || to.path.startsWith('/company/'))) {
		return;
	}

	const authStore = useCompanyAuthStore();
	const publicPages = ['/company/login', '/company/register'];

	// Allow pages explicitly marked as public via page meta
	// Usage on page: definePageMeta({ public: true }) or { auth: false }
	if (to.meta?.public === true || to.meta?.auth === false) {
		return;
	}

	// If user is logged in and tries to access a public page (e.g., login),
	// redirect them to the company dashboard.
	if (authStore.isLoggedIn && publicPages.includes(to.path)) {
		return navigateTo('/company');
	}

	// If the user is navigating to a public page and is not logged in, do nothing.
	if (publicPages.includes(to.path)) {
		return;
	}

	// On every protected route, we fetch the user to ensure their session is still valid.
	// This request is de-duplicated on initial client-side hydration if it was already made on the server.
	// For subsequent client-side navigations, it performs a fresh check.
	await authStore.fetchUser();

	// If, after attempting to fetch the user, they are not logged in,
	// redirect them to the login page.
	if (!authStore.isLoggedIn) {
		// Using `return navigateTo(...)` is the correct way to redirect in Nuxt middleware.
		return navigateTo({
			path: '/company/login',
			query: {
				// We can optionally add a redirect query to send the user back after login
				redirect: to.fullPath,
			},
		});
	}
});
