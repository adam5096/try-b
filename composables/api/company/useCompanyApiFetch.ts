import type { UseFetchOptions } from 'nuxt/app';
import { type MaybeRefOrGetter, toValue } from 'vue';

/**
 * 專用於 Company 模塊的 API Fetch 函數
 * 自動注入 Company JWT Token，與 Users 模塊保持一致的架構
 */
export const useCompanyApiFetch = <T>(url: MaybeRefOrGetter<string | null>, options: UseFetchOptions<T> = {}) => {
  const config = useRuntimeConfig();
  
  // 環境判斷：生產環境直接使用後端，開發環境使用代理
  const baseURL = process.env.NODE_ENV === 'production' 
    ? config.public.apiBase
    : '/api-proxy';

  // 在 composable 層級初始化 cookie，避免在 onRequest 中重複創建
  const tokenCookie = useCookie<string | null>('companyAuthToken');

  // 將 null URL 轉換為空字串，避免 TypeScript 錯誤
  const safeUrl = computed(() => toValue(url) || '');

  if (process.client) {
    try {
      // 非敏感摘要（僅顯示 token 前 8 碼）
      const tokenPreview = tokenCookie.value ? `${tokenCookie.value.substring(0, 8)}…` : 'null';
    } catch {}
  }

  const customOptions: UseFetchOptions<T> = {
    ...options,
    baseURL,
    onRequest(context) {
      const urlString = toValue(safeUrl);
      
      // 如果 URL 為空，跳過請求
      if (!urlString) {
        return;
      }
      
      // 檢查是否為登入端點，避免注入過期的 token
      const isLoginEndpoint = urlString.includes('/login');
      
      // 只有在非登入端點且有 token 時才注入 Authorization header
      if (!isLoginEndpoint && tokenCookie.value) {
        context.options.headers = new Headers(context.options.headers as any);
        context.options.headers.set('Authorization', `Bearer ${tokenCookie.value}`);
      }

      if (process.client) {
        try {
          const hdr = context.options.headers instanceof Headers
            ? Object.fromEntries((context.options.headers as Headers).entries())
            : context.options.headers;
        } catch {}
      }
      
      // Chain the original onRequest if it exists from the call site
      if (options.onRequest) {
        if (Array.isArray(options.onRequest)) {
          options.onRequest.forEach(hook => hook(context));
        } else if (typeof options.onRequest === 'function') {
          options.onRequest(context);
        }
      }
    },
    onResponse(context) {
      if (options.onResponse) {
        if (Array.isArray(options.onResponse)) {
          options.onResponse.forEach(hook => hook(context));
        } else if (typeof options.onResponse === 'function') {
          options.onResponse(context);
        }
      }
    },
    onResponseError(context) {
      if (options.onResponseError) {
        if (Array.isArray(options.onResponseError)) {
          options.onResponseError.forEach(hook => hook(context));
        } else if (typeof options.onResponseError === 'function') {
          options.onResponseError(context);
        }
      }
    }
  };
  
  return useFetch(safeUrl, customOptions);
};
