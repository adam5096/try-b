import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'
import { setCompanyAuthCookie } from '~/server/utils/cookies'

export default createApiHandler(async (event) => {
	const body = await readBody(event)
	const { identifier, password } = body

	if (!identifier || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing identifier or password',
		})
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event)

	// 轉發登入請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/company/login', {
		method: 'POST',
		headers,
		body: {
			identifier,
			password,
		},
	})

	// 如果後端回應包含 token，設定 cookie
	if (backendResponse && (backendResponse as any).token) {
		setCompanyAuthCookie(event, (backendResponse as any).token)
		return backendResponse
	}
	else {
		throw createError({
			statusCode: 401,
			statusMessage: 'Login failed: Invalid credentials or no token received',
		})
	}
})
