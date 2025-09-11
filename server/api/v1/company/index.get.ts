export default defineEventHandler(async (event) => {
  try {
    // 從 cookie 讀取 company token
    const tokenCookie = getCookie(event, 'companyAuthToken');
    
    if (!tokenCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: '請登入',
      });
    }

    // 轉發請求到真實後端
    const data = await $fetch('/api-proxy/api/v1/company', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenCookie}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error: any) {
    console.error('Company profile API error:', error);
    
    // 如果是後端的錯誤，直接轉拋
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Failed to fetch company profile',
        data: error.data,
      });
    }
    
    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
