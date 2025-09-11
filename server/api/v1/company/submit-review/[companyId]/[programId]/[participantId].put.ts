export default defineEventHandler(async (event) => {
  try {
    const companyId = getRouterParam(event, 'companyId');
    const programId = getRouterParam(event, 'programId');
    const participantId = getRouterParam(event, 'participantId');
    
    if (!companyId || !programId || !participantId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing companyId, programId, or participantId parameter',
      });
    }

    // 讀取請求體
    const body = await readBody(event);

    // 透過 Nitro 的 proxy 設定轉發到真實後端
    // 規則：必須包含 api 並使用 /api-proxy 進行代理
    const data = await $fetch(`/api-proxy/api/v1/company/${companyId}/programs/${programId}/applications/${participantId}/review`, {
      method: 'PUT',
      headers: getHeaders(event) as HeadersInit,
      body,
    });

    return data;
  } catch (error: any) {
    // 簡單錯誤轉拋，維持 KISS
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.message || 'Failed to submit review',
    });
  }
});
