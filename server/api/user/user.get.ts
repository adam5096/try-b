import { defineEventHandler, getCookie } from 'h3';
import type { User } from '~/types/user';

export default defineEventHandler((event): User => {
  const token = getCookie(event, 'user-auth-token');

  if (!token || token !== 'a-valid-user-jwt-token') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Return mock user data if the token is valid
  return {
    id: 12,
    name: '鄧登耀',
    account: 'adam4444',
    email: 'adam4444@gmail.com',
    role: 'Participant',
    avatar: 'https://i.pravatar.cc/150?u=adam4444',
  };
});
