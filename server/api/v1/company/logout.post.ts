export default defineEventHandler(async (event) => {
  try {
    // 從 cookie 讀取 company token
    const tokenCookie = getCookie(event, 'companyAuthToken');
    
    // 如果有 token，轉發登出請求到後端
    if (tokenCookie) {
      try {
        await $fetch('/api-proxy/api/v1/company/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenCookie}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (backendError) {
        // 即使後端登出失敗，也要清除本地的 cookie
        console.warn('Backend logout failed, but clearing local cookie:', backendError);
      }
    }

    // 清除本地的 companyAuthToken cookie
    setCookie(event, 'companyAuthToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // 立即過期
      path: '/',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error: any) {
    console.error('Logout API error:', error);
    
    // 即使發生錯誤，也要清除 cookie
    setCookie(event, 'companyAuthToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    });

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during logout',
    });
  }
});
