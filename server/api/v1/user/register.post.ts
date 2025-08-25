export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  // 模擬創建新使用者
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  };

  return {
    status: 'success',
    message: 'User registered successfully',
    data: newUser,
  };
});
