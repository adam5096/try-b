import { defineEventHandler, readBody } from 'h3';
import type { UserRegisterData } from '~/types/user';

export default defineEventHandler(async (event) => {
  const body = await readBody<UserRegisterData>(event);

  // Basic validation
  if (!body.name || !body.account || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  // In a real app, you would save the user to the database here.
  // We'll just simulate a successful response based on the spec.
  
  // Set status code to 201 Created
  setResponseStatus(event, 201);

  return {
    status: 201,
    message: '註冊成功',
    id: Math.floor(Math.random() * 1000) + 1, // Fake ID
    Role: 'Participant',
    Account: body.account,
    Email: body.email,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };
});
