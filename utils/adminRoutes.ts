/**
 * 管理端路由
 *
 * 命名慣例：
 * - programs: 體驗計畫列表頁
 * - programDetail: 單一計畫詳情頁（pp4）
 *
 * 路由名稱 (name) 與頁面中的 definePageMeta 維持一致，
 * 以利檔案路徑調整時不影響呼叫端。
 */
export const adminRoutes = {
  programs: () => ({ name: 'admin-programs' }),
  programDetail: (programId: string | number) => ({
    name: 'admin-single-program-info',
    params: { programId },
  }),
};


