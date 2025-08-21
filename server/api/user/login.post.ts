import { defineEventHandler, readBody, setCookie } from 'h3';
import type { UserLoginData } from '~/types/users/user';

export default defineEventHandler(async (event) => {
  const body = await readBody<UserLoginData>(event);

  // Simulate checking credentials
  if (body.account === 'testuser' && body.password === 'password') {
    const fakeJwt = 'a-valid-user-jwt-token';
    
    setCookie(event, 'user-auth-token', fakeJwt, {
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
