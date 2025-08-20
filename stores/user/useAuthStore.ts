import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { User, UserLoginData, UserRegisterData } from '~/types/user';

export const useUserAuthStore = defineStore('userAuth', () => {
  const user = useCookie<User | null>('userAuthUser', { default: () => null });
  const { $api } = useNuxtApp();
  const api = $api as typeof $fetch;

  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    try {
      const data = await api<User>('/user/user');
      user.value = data;
    } catch (error) {
      user.value = null;
    }
  }

  async function login(loginData: UserLoginData) {
    await api('/user/login', {
      method: 'POST',
      body: loginData,
    });
    await fetchUser();
  }

  async function register(registerData: UserRegisterData) {
    await api('/user/register', {
      method: 'POST',
      body: registerData,
    });
    // After successful registration, we don't auto-login.
    // The user should be redirected to the login page to log in manually.
  }

  async function logout() {
    await api('/user/logout', {
      method: 'POST',
    });
    user.value = null;
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
    login,
    register,
    logout,
  };
});
