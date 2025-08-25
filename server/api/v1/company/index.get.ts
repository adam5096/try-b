export default defineEventHandler((event) => {
  // 模擬從 cookie 或 header 中獲取 token 並驗證
  const token = getCookie(event, 'companyAuthToken') || getHeader(event, 'Authorization')?.split(' ')[1];

  if (token) {
    // 模擬回傳已登入的企業使用者資訊
    const mockCompanyUser = {
      Id: 99,
      Account: 'test6',
      Name: '模擬測試公司',
      // ... 其他您需要的公司資訊欄位
    };
    return mockCompanyUser;
  }
  else {
    // 模擬驗證失敗
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
});
