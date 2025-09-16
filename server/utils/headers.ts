/**
 * 取得轉發 headers 的統一函數
 */
export const getForwardHeaders = (event: any, token?: string): Record<string, string> => {
	const headers: Record<string, string> = {};

	// 如果有 token，設定 Authorization header
	if (token) {
		headers.authorization = `Bearer ${token}`;
	}

	// 轉發其他重要的 headers
	const incomingHeaders = getHeaders(event);
	if (incomingHeaders['content-type']) {
		headers['content-type'] = incomingHeaders['content-type'];
	}
	if (incomingHeaders['accept']) {
		headers['accept'] = incomingHeaders['accept'];
	}

	return headers;
};

/**
 * 從 cookie 取得認證 token
 */
export const getAuthTokenFromCookie = (event: any, cookieName: string): string | null => {
	return getCookie(event, cookieName) || null;
};

/**
 * 建立認證 headers（從 cookie 自動取得 token）
 */
export const createAuthHeaders = (event: any, cookieName: string = 'companyAuthToken'): Record<string, string> => {
	const token = getAuthTokenFromCookie(event, cookieName);
	return getForwardHeaders(event, token || undefined);
};
