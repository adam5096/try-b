export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 模擬檢查使用者帳號密碼
  if (body.email === 'user@example.com' && body.password === 'password') {
    const mockUser = {
      id: 1,
      name: '測試使用者',
      email: 'user@example.com',
    };

    // 模擬設定 cookie
    setCookie(event, 'user-token', 'a-fake-user-jwt-token-for-development', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      status: 'success',
      data: {
        user: mockUser,
      },
    };
  }
  else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Email 或密碼錯誤',
    });
  }
});
