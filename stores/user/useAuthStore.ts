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
    try {
      // 使用 $fetch 回傳實際資料物件
      const response = await performLogin(loginData);

      // 調試資訊

      if (response && response.token && response.user) {
        token.value = response.token;
        tokenCookie.value = response.token;

        // 將 API 回應的 user 格式轉換為內部 User 格式
        const mappedUser: User = {
          id: response.user.Id,
          name: response.user.Account,
          account: response.user.Account,
          email: response.user.Email,
          role: response.user.Role,
        };

        user.value = mappedUser;
        userCookie.value = mappedUser;
      } else {
        await logout();
        throw new Error('登入失敗：回應格式無效或缺少必要資訊');
      }
    } catch (err: any) {
      await logout();
      const message = err?.data?.message || err?.message || '登入失敗：伺服器錯誤';
      throw new Error(message);
    }
  }

  async function register(registerData: UserRegisterData) {
    const userRegister = useUserRegister();
    try {
      await userRegister.register(registerData);
    } catch (err: any) {
      const message = err?.data?.message || err?.message || '註冊失敗：伺服器錯誤';
      throw new Error(message);
    }
  }
  
  async function logout() {
    // 這裡可以選擇性地呼叫後端的登出 API
    // await useFetch('/v1/user/logout', { method: 'POST', baseURL: '/api' });
    
    user.value = null;
    userCookie.value = null;
    token.value = null;
    tokenCookie.value = null;
  }
  
  // 檢查使用者登入狀態的函數
  async function fetchUser() {
    // 如果已有 token 和 user，則認為已登入
    if (token.value && user.value) {
      return;
    }
    
    // 如果沒有 token，則清除登入狀態
    if (!token.value) {
      await logout();
      return;
    }
    
    // 可以在此處添加對後端的驗證請求
    // 目前簡化為檢查本地狀態
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchUser,
  };
});
