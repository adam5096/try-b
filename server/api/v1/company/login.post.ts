import { defineEventHandler, readBody } from 'h3';
import type { LoginData } from '~/types/company/company';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 模擬檢查帳號密碼
  if ((body.identifier === 'test6' && body.password === 'password') || 
      (body.identifier === 'tes6' && body.password === 'Password!123')) {
    // 模擬後端回傳的資料結構
    const response = {
      token: 'a-fake-company-jwt-token-for-development',
      user: {
        Id: 99, // 模擬的公司 ID
        Account: body.identifier,
        Name: '模擬測試公司',
      },
    };

    // 在真實應用中，這裡可能會設定 httpOnly cookie
    // setCookie(event, 'companyAuthToken', response.token, { httpOnly: true, ... })

    return response;
  }
  else {
    // 模擬登入失敗
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: '帳號或密碼錯誤',
    });
  }
});
