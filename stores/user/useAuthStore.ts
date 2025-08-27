import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { User, UserLoginData, UserRegisterData } from '~/types/users/user';
import { useUserLogin } from '~/composables/api/users/useUserLogin';
import { useUserRegister } from '~/composables/api/users/useUserRegister';

export const useUserAuthStore = defineStore('userAuth', () => {
  const tokenCookie = useCookie<string | null>('userAuthToken');
  const userCookie = useCookie<User | null>('userAuthUser');

  const token = ref<string | null>(tokenCookie.value ?? null);
  const user = ref<User | null>(userCookie.value ?? null);
  
  const isLoggedIn = computed(() => !!token.value && !!user.value);
  
  async function login(loginData: UserLoginData) {
    const { login: performLogin } = useUserLogin();
    const { data: responseData, error } = await performLogin(loginData);
    
    if (responseData.value && responseData.value.token) {
      const response = responseData.value;
      token.value = response.token;
      tokenCookie.value = response.token;
      user.value = response.user;
      userCookie.value = response.user;
    } else {
      await logout();
      throw new Error(error.value?.data?.message || '登入失敗：無效的回應格式');
    }
  }

  async function register(registerData: UserRegisterData) {
    const userRegister = useUserRegister();
    const { error } = await userRegister.register(registerData);

    if (error.value) {
      throw error.value;
    }
  }
  
  async function logout() {
    // 這裡可以選擇性地呼叫後端的登出 API
    // await useApiFetch('/api/v1/user/logout', { method: 'POST' });
    
    user.value = null;
    userCookie.value = null;
    token.value = null;
    tokenCookie.value = null;
  }
  
  // 這個函式可能不再需要，因為使用者資料在登入時已一併取得
  // async function fetchUser() { ... }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
  };
});
