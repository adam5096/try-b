import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';
import { setUserAuthCookie } from '~/server/utils/cookies';

interface GoogleAuthRequest {
	id_token: string
}

export default createApiHandler(async (event) => {
	const body = await readBody(event);
	const { id_token } = body as GoogleAuthRequest;

	if (!id_token) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing ID token',
		});
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event);

	// 轉發 Google OAuth 請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/users/google', {
		method: 'POST',
		headers,
		body: {
			id_token,
		},
	});

	// 如果後端回應包含 token，設定 cookie
	if (backendResponse && (backendResponse as any).token) {
		setUserAuthCookie(event, (backendResponse as any).token);
		return backendResponse;
	}
	else {
		throw createError({
			statusCode: 401,
			statusMessage: 'Google authentication failed',
		});
	}
});
