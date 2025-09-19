/**
 * 認證中間件 - 為請求上下文添加認證資訊
 * 增強版本：添加錯誤處理和請求追蹤
 */
export default defineEventHandler((event) => {
	try {
		// 檢查公司認證 token
		const companyToken = getCookie(event, 'companyAuthToken');
		if (companyToken) {
			event.context.companyAuth = { token: companyToken };
		}

		// 檢查使用者認證 token
		const userToken = getCookie(event, 'userAuthToken');
		if (userToken) {
			event.context.userAuth = { token: userToken };
		}

		// 設定認證狀態
		event.context.isAuthenticated = !!(companyToken || userToken);
		event.context.authType = companyToken ? 'company' : userToken ? 'user' : null;

		// 添加請求 ID 用於追蹤（如果尚未設定）
		if (!event.context.requestId) {
			event.context.requestId = crypto.randomUUID();
		}

		// 記錄認證狀態（僅在開發環境）
		if (process.env.NODE_ENV === 'development') {
			// 開發環境認證狀態記錄
		}
	}
	catch (error) {
		// 不中斷請求，但記錄錯誤
		console.error('Auth middleware error:', error);

		// 設定預設值確保請求能繼續
		event.context.isAuthenticated = false;
		event.context.authType = null;
		event.context.requestId = event.context.requestId || crypto.randomUUID();
	}
});
