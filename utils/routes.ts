import { userRoutes } from './userRoutes';
import { companyRoutes } from './companyRoutes';

/**
 * 集中管理應用程式的路由。
 * 這是從各個模組化路由檔案匯集而成的單一出口。
 *
 * 使用範例：
 * - routes.home()
 * - routes.user.login()
 * - routes.company.dashboard() (未來擴充)
 */
export const routes = {
  // 首頁/通用路由
  home: () => ({ name: 'index' }),
  loginRoles: () => ({ name: 'roles' }),

  // 各模組路由
  user: userRoutes,
  company: companyRoutes,
}; 