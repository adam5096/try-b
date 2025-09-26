import { createApiHandler } from '~/server/utils/apiHandler';
import { createAuthHeaders } from '~/server/utils/headers';
import { clearCompanyAuthCookie } from '~/server/utils/cookies';

export default createApiHandler(async (event) => {
	// 取得認證 headers
	const headers = createAuthHeaders(event, 'companyAuthToken');

	// 如果有 token，轉發登出請求到後端
	if (headers.authorization) {
		try {
			await event.$fetch('/api-proxy/api/v1/company/logout', {
				method: 'POST',
				headers,
			});
		}
		catch (backendError) {
			// 即使後端登出失敗，也要清除本地的 cookie
			console.warn('Backend logout failed, but clearing local cookie:', backendError);
		}
	}

	// 清除本地的 companyAuthToken cookie
	clearCompanyAuthCookie(event);

	return {
		success: true,
		message: 'Logout successful',
	};
});
