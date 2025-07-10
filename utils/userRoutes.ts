/**
 * 體驗者端路由
 *
 * 命名慣例：
 * - landing: 主要入口頁
 * - login: 登入頁
 * - programDetail: 專案詳情頁
 */
export const userRoutes = {
  landing: () => ({ name: 'users' }),
  login: () => ({ name: 'users-login' }),
  applications: () => ({ name: 'users-applications' }),
  comments: () => ({ name: 'users-comments' }),
  commentsDetail: (commentId: string | number) => ({
    name: 'users-comments-commentId',
    params: { commentId },
  }),
  programDetail: (programId: string | number) => ({
    name: 'users-programs-programId',
    params: { programId },
  }),
}; 