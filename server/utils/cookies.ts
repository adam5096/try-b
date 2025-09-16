/**
 * 設定認證 cookie 的統一函數
 */
export const setAuthCookie = (
	event: any,
	token: string,
	cookieName: string,
	options: {
		maxAge?: number;
		secure?: boolean;
		httpOnly?: boolean;
		path?: string;
		sameSite?: 'strict' | 'lax' | 'none';
	} = {},
) => {
	const defaultOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7, // 7 天
		path: '/',
		sameSite: 'lax' as const,
	};

	setCookie(event, cookieName, token, { ...defaultOptions, ...options })
}

/**
 * 清除認證 cookie
 */
export const clearAuthCookie = (event: any, cookieName: string) => {
	setCookie(event, cookieName, '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0, // 立即過期
		path: '/',
		sameSite: 'lax',
	})
}

/**
 * 設定公司認證 cookie
 */
export const setCompanyAuthCookie = (event: any, token: string) => {
	setAuthCookie(event, token, 'companyAuthToken')
}

/**
 * 設定使用者認證 cookie
 */
export const setUserAuthCookie = (event: any, token: string) => {
	setAuthCookie(event, token, 'userAuthToken')
}

/**
 * 清除公司認證 cookie
 */
export const clearCompanyAuthCookie = (event: any) => {
	clearAuthCookie(event, 'companyAuthToken')
}

/**
 * 清除使用者認證 cookie
 */
export const clearUserAuthCookie = (event: any) => {
	clearAuthCookie(event, 'userAuthToken')
}
