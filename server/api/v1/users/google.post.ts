import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'
import { setUserAuthCookie } from '~/server/utils/cookies'

interface GoogleAuthRequest {
	code: string
}

export default createApiHandler(async (event) => {
	const body = await readBody(event)
	const { code } = body as GoogleAuthRequest

	if (!code) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing Google authorization code',
		})
	}

	// 使用統一的 headers 處理
	const headers = getForwardHeaders(event)

	// 首先使用 Google API 將授權碼轉換為 id_token
	const config = useRuntimeConfig()
	const clientId = config.public.googleClientId
	const clientSecret = config.googleClientSecret

	// 獲取 redirect URI
	const redirectUri = process.env.NODE_ENV === 'development'
		? 'http://localhost:3000/users/login'
		: 'https://try-b.vercel.app/users/login'

	// 添加調試日誌
	console.log('Google OAuth 配置檢查:', {
		hasClientId: !!clientId,
		hasClientSecret: !!clientSecret,
		redirectUri,
		code: code.substring(0, 20) + '...'
	})

	// 向 Google 請求 access_token
	let tokenResponse
	try {
		tokenResponse = await $fetch<{
			access_token: string
			id_token?: string
			expires_in: number
			token_type: string
		}>('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				code: code,
				grant_type: 'authorization_code',
				redirect_uri: redirectUri,
			}).toString(),
		})
	} catch (error: any) {
		console.error('Google token 交換錯誤:', {
			status: error.status,
			statusText: error.statusText,
			data: error.data,
			message: error.message
		})
		throw createError({
			statusCode: 400,
			statusMessage: `Google token exchange failed: ${error.data?.error_description || error.message}`,
		})
	}

	console.log('Google token response:', tokenResponse)

	// 使用 access_token 獲取用戶資訊
	const userInfoResponse = await $fetch<{
		id: string
		email: string
		name: string
		picture: string
	}>('https://www.googleapis.com/oauth2/v2/userinfo', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${tokenResponse.access_token}`,
		},
	})

	console.log('Google user info response:', userInfoResponse)

	// 檢查是否有 id_token，如果沒有則使用用戶資訊
	let tokenToSend
	if (tokenResponse.id_token) {
		tokenToSend = tokenResponse.id_token
		console.log('使用 Google id_token')
	} else {
		// 如果沒有 id_token，創建一個包含用戶資訊的物件
		tokenToSend = {
			access_token: tokenResponse.access_token,
			user_info: userInfoResponse,
			token_type: tokenResponse.token_type
		}
		console.log('使用 access_token 和用戶資訊')
	}

	// 轉發請求到真實後端
	const backendResponse = await event.$fetch('/api-proxy/api/v1/users/google', {
		method: 'POST',
		headers,
		body: {
			id_token: tokenToSend,
		},
	})

	// 如果後端回應包含 token，設定 cookie
	if (backendResponse && (backendResponse as any).token) {
		setUserAuthCookie(event, (backendResponse as any).token)
		return backendResponse
	}
	else {
		throw createError({
			statusCode: 401,
			statusMessage: 'Google authentication failed',
		})
	}
})
