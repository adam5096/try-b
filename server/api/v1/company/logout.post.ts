export default defineEventHandler(async (event) => {
  // 清除名為 'company-token' 的 cookie
  deleteCookie(event, 'company-token');

  return {
    status: 'success',
    message: 'Company user logged out successfully',
  };
});
