export default defineEventHandler((event) => {
  // 模擬從 cookie 或 header 中獲取 token 並驗證
  const token = getCookie(event, 'user-token');

  if (token === 'a-fake-user-jwt-token-for-development') {
    // 模擬回傳已登入的使用者資訊
    const mockUser = {
      id: 1,
      name: '測試使用者',
      email: 'user@example.com',
    };
    return {
      status: 'success',
      data: {
        user: mockUser,
      },
    };
  }
  else {
    // 模擬驗證失敗
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
});
