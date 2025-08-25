export default defineEventHandler(async (event) => {
  const companyId = getRouterParam(event, 'companyId');
  const body = await readBody(event);

  if (!companyId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Company ID is required',
    });
  }

  // 模擬創建一個新的 program
  const newProgram = {
    id: Math.floor(Math.random() * 1000), // 隨機生成一個 ID
    title: body.title || '新的體驗計畫',
    description: body.description || '這是一個新的體驗計畫的描述。',
    status: 'pending', // 初始狀態為待審核
    createdAt: new Date().toISOString(),
    companyId,
    ...body,
  };

  return {
    status: 'success',
    message: 'Program created successfully',
    data: newProgram,
  };
});
