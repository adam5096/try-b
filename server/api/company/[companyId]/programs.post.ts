import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const companyId = getRouterParam(event, 'companyId');
  const body = await readBody(event);

  // 在真實的應用中，您會在這裡驗證 body 的內容，
  // 然後將資料存入與 companyId 關聯的資料庫中。

  console.log(`[伺服器模擬] 收到公司 ${companyId} 的新體驗計畫: ${body.name}`);

  // 設定 HTTP 狀態碼為 201 Created
  setResponseStatus(event, 201);

  // 回傳一個模擬的成功回應
  return {
    success: true,
    message: '體驗計畫已成功建立 (來自伺服器模擬)',
    data: {
      program_id: `prog_${Math.random().toString(36).substring(2, 15)}`
    }
  };
});
