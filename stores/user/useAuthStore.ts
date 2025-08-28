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
    
    // 添加調試信息
    console.log('Login response:', { data: responseData.value, error: error.value });
    
    if (error.value) {
      await logout();
      throw new Error(error.value.data?.message || error.value.message || '登入失敗：伺服器錯誤');
    }
    
    if (responseData.value && responseData.value.token && responseData.value.user) {
      const response = responseData.value;
      token.value = response.token;
      tokenCookie.value = response.token;
      
      // 將 API 回應的 user 格式轉換為內部 User 格式
      const mappedUser: User = {
        id: response.user.Id,
        name: response.user.Account, // 使用 Account 作為 name
        account: response.user.Account,
        email: response.user.Email,
        role: response.user.Role,
      };
      
      user.value = mappedUser;
      userCookie.value = mappedUser;
    } else {
      await logout();
      console.error('Invalid response format:', responseData.value);
      throw new Error('登入失敗：回應格式無效或缺少必要資訊');
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
