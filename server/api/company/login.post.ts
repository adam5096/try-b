import { defineEventHandler, readBody, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // In a real app, you'd send these credentials to your ASP.NET backend
  // and get a real JWT back.
  // const { token } = await $fetch('https://your.asp.net/api/login', { body })

  // For now, we'll simulate a successful login
  if (body.account === 'test' && body.psd === 'test') {
    const fakeJwt = 'a-valid-jwt-token';

    setCookie(event, 'auth-token', fakeJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }
});

