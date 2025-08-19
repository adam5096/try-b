import { defineEventHandler, getCookie } from 'h3';
import type { CompanyUser } from '~/types/company';

export default defineEventHandler((event): CompanyUser | null => {
  const token = getCookie(event, 'auth-token');

  // Simulate JWT verification
  if (!token || token !== 'a-valid-jwt-token') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // In a real app, you'd verify the JWT and get user data from it or a database
  return {
    id: '1',
    name: 'Try Beta Inc.',
    email: 'service@try.beta',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  };
});

