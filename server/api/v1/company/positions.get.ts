export default defineEventHandler(async (event) => {
  try {
    // 取得前端傳來的 headers，特別是 Authorization
    const incomingHeaders = getHeaders(event);
    const forwardHeaders: Record<string, string> = {};
    
    // 轉發重要的 headers
    if (incomingHeaders.authorization) {
      forwardHeaders.authorization = incomingHeaders.authorization;
    }
    if (incomingHeaders['content-type']) {
      forwardHeaders['content-type'] = incomingHeaders['content-type'];
    }

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch('/api-proxy/api/v1/positions', {
      method: 'GET',
      headers: forwardHeaders,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to fetch positions',
    });
  }
});
