export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { identifier, password } = body;

    if (!identifier || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing identifier or password',
      });
    }

    // 轉發登入請求到真實後端
    const backendResponse = await $fetch('/api-proxy/api/v1/company/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: {
        identifier,
        password,
      },
    });

    // 如果後端回應包含 token，設定 cookie
    if (backendResponse && (backendResponse as any).token) {
      setCookie(event, 'companyAuthToken', (backendResponse as any).token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
        sameSite: 'lax',
      });

      return backendResponse;
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Login failed: Invalid credentials or no token received',
      });
    }
  } catch (error: any) {
    console.error('Login API error:', error);
    
    // 如果是後端的錯誤，直接轉拋
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Login failed',
        data: error.data,
      });
    }
    
    // 其他錯誤
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during login',
    });
  }
});
