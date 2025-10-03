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
	landing: () => ({ name: 'user-landing' }),
	login: () => ({ name: 'user-login' }),
	applications: () => ({ name: 'user-applications' }),
	comments: () => ({ name: 'user-comments' }),
	commentsDetail: (commentId: string | number) => ({
		name: 'user-comment-detail',
		params: { commentId },
	}),
	programDetail: (programId: string | number) => {
		// 參數驗證
		if (!programId) {
			// programId is required for programDetail route
			return '/users/programs/404'; // 或拋出錯誤
		}

		return {
			name: 'user-program-detail',
			params: { programId: programId.toString() },
		};
	},
	companyDetail: (companyId: string | number) => ({
		name: 'user-company-detail',
		params: { companyId },
	}),
};
