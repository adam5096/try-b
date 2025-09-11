export default defineEventHandler(async (event) => {
  try {
    // 從 cookie 讀取 company token
    const tokenCookie = getCookie(event, 'companyAuthToken');
    const forwardHeaders: Record<string, string> = {};
    
    // 如果有 token，設定 Authorization header
    if (tokenCookie) {
      forwardHeaders.authorization = `Bearer ${tokenCookie}`;
    }
    
    // 轉發其他重要的 headers
    const incomingHeaders = getHeaders(event);
    if (incomingHeaders['content-type']) {
      forwardHeaders['content-type'] = incomingHeaders['content-type'];
    }

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch('/api-proxy/api/v1/plans', {
      method: 'GET',
      headers: forwardHeaders,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to fetch plans',
    });
  }
});
