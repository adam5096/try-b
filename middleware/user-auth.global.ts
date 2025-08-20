import { useUserAuthStore } from '~/stores/user/useAuthStore';

export default defineNuxtRouteMiddleware(async (to) => {
  // We only care about user routes that require authentication
  if (!to.path.startsWith('/users')) {
    return;
  }

  const authStore = useUserAuthStore();
  const guestPages = ['/users/login', '/users/register'];

  // If user is logged in and tries to access a guest-only page (login/register),
  // redirect them to the user dashboard.
  if (authStore.isLoggedIn && guestPages.includes(to.path)) {
    return navigateTo({ name: 'user-landing' });
  }

  // If the user is navigating to a public page (including the landing page), do nothing further.
  const publicPages = ['/users', ...guestPages];
  if (publicPages.includes(to.path)) {
    return;
  }

  // At this point, we are on a protected route.
  // We need to ensure the user's session is still valid.
  await authStore.fetchUser();

  // If the user is not logged in after the check, redirect them to the login page.
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/users/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
