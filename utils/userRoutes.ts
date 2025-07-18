/**
 * 體驗者端路由
 *
 * 命名慣例：
 * - landing: 主要入口頁
 * - login: 登入頁
 * - programDetail: 專案詳情頁
 *
 * 路由名稱 (name) 透過各頁面中的 definePageMeta 設定，與檔案路徑解耦。
 */
export const userRoutes = {
  landing: () => ({ name: 'userLanding' }),
  login: () => ({ name: 'userLogin' }),
  applications: () => ({ name: 'userApplications' }),
  comments: () => ({ name: 'userComments' }),
  commentsDetail: (commentId: string | number) => ({
    name: 'userCommentDetail',
    params: { commentId },
  }),
  programDetail: (programId: string | number) => ({
    name: 'userProgramDetail',
    params: { programId },
  }),
}; 