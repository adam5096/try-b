import { type MaybeRefOrGetter, toValue } from 'vue';
import { useUserAuthStore } from '~/stores/user/useAuthStore';

/**
 * 專用於 Users 模塊的 API Fetch 函數
 * 自動注入 User JWT Token
 */
export const useUserApiFetch = <T>(url: MaybeRefOrGetter<string>, options: any = {}) => {
  const urlString = toValue(url);
  
  // 注入 User 模塊的 JWT Token（除了登入請求）
  let headers: Record<string, string> = {};
  if (!urlString.includes('/login')) {
    const userAuthStore = useUserAuthStore();
    const token = userAuthStore.token;
    
    // 調試：檢查 token 注入
    console.log('🔐 useUserApiFetch - Token injection:', {
      url: urlString,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      isLoggedIn: userAuthStore.isLoggedIn
    });
    
    if (token) {
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      console.warn('⚠️ No token found for authenticated request:', urlString);
    }
  }
  
  // 使用 $fetch
  return $fetch<T>(urlString, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });
};

/**
 * 取得包含 HTTP 狀態碼的回應
 */
export const useUserApiFetchRaw = async <T>(url: MaybeRefOrGetter<string>, options: any = {}) => {
  const urlString = toValue(url);

  // 注入 User 模塊的 JWT Token（除了登入請求）
  let headers: Record<string, string> = {};
  if (!urlString.includes('/login')) {
    const userAuthStore = useUserAuthStore();
    const token = userAuthStore.token;

    // 調試：檢查 token 注入
    console.log('🔐 useUserApiFetchRaw - Token injection:', {
      url: urlString,
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'null',
      isLoggedIn: userAuthStore.isLoggedIn
    });

    if (token) {
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      console.warn('⚠️ No token found for authenticated request:', urlString);
    }
  }

  const response = await $fetch.raw<T>(urlString, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  return {
    data: response._data as T,
    status: response.status,
    headers: response.headers
  } as const;
};