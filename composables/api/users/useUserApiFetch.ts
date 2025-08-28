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
    
    if (token) {
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`
      };
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
