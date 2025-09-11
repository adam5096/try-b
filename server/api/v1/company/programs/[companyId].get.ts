export default defineEventHandler(async (event) => {
  try {
    const companyId = getRouterParam(event, 'companyId');
    
    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing companyId parameter',
      });
    }

    // 取得查詢參數
    const query = getQuery(event);
    const queryString = new URLSearchParams();
    
    // 轉發查詢參數
    if (query.page) queryString.append('page', String(query.page));
    if (query.limit) queryString.append('limit', String(query.limit));
    
    const qs = queryString.toString();
    const endpoint = `/api-proxy/api/v1/company/${companyId}/programs${qs ? `?${qs}` : ''}`;

    // 取得前端傳來的 headers
    const incomingHeaders = getHeaders(event);
    const forwardHeaders: Record<string, string> = {};
    
    // 轉發重要的 headers（程式列表需要認證）
    if (incomingHeaders.authorization) {
      forwardHeaders.authorization = incomingHeaders.authorization;
    }

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch(endpoint, {
      method: 'GET',
      headers: forwardHeaders,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to fetch company programs',
    });
  }
});
