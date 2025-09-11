export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId');
    const programId = getRouterParam(event, 'programId');
    
    if (!userId || !programId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing userId or programId parameter',
      });
    }

    // 讀取請求體
    const body = await readBody(event);

    // 取得前端傳來的 headers
    const incomingHeaders = getHeaders(event);
    const forwardHeaders: Record<string, string> = {};
    
    // 轉發重要的 headers（提交評價需要認證）
    if (incomingHeaders.authorization) {
      forwardHeaders.authorization = incomingHeaders.authorization;
    }
    if (incomingHeaders['content-type']) {
      forwardHeaders['content-type'] = incomingHeaders['content-type'];
    }

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch(`/api-proxy/api/v1/users/${userId}/programs/${programId}/evaluations`, {
      method: 'PUT',
      headers: forwardHeaders,
      body,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to submit evaluation',
    });
  }
});
