import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // 清除名為 'company-token' 的 cookie
  deleteCookie(event, 'companyAuthToken');

  return {
    status: 'success',
    message: 'Company user logged out successfully',
  };
});
