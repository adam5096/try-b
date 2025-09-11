export default defineEventHandler(async (event) => {
  try {
    const programId = getRouterParam(event, 'programId');
    
    if (!programId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing programId parameter',
      });
    }

    // 讀取原始請求體，而不是解析後的 FormData
    const body = await readRawBody(event);
    
    // 從 cookie 讀取 company token
    const tokenCookie = getCookie(event, 'companyAuthToken');
    const forwardHeaders: Record<string, string> = {};
    
    // 如果有 token，設定 Authorization header
    if (tokenCookie) {
      forwardHeaders.authorization = `Bearer ${tokenCookie}`;
    }
    
    // 對於 FormData 上傳，需要保持原始的 content-type（包含 boundary）
    const incomingHeaders = getHeaders(event);
    if (incomingHeaders['content-type']) {
      forwardHeaders['content-type'] = incomingHeaders['content-type'];
    }

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch(`/api-proxy/api/v1/programs/${programId}/images`, {
      method: 'POST',
      headers: forwardHeaders,
      body,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to upload program images',
    });
  }
});
