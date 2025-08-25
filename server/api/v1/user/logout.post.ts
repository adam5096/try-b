export default defineEventHandler(async (event) => {
  // 清除名為 'user-token' 的 cookie
  deleteCookie(event, 'user-token');

  return {
    status: 'success',
    message: 'User logged out successfully',
  };
});
