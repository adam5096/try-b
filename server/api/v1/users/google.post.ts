import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'
import { setUserAuthCookie } from '~/server/utils/cookies'

interface GoogleAuthRequest {
	code: string
}

export default createApiHandler(async (event) => {
	try {
		const body = await readBody(event)
		const { code } = body as GoogleAuthRequest

		if (!code) {
			console.error('❌ [BFF] 缺少 Google 授權碼:', {
				source: 'BFF 請求驗證',
				body: body,
			})
			throw createError({
				statusCode: 400,
				statusMessage: '[BFF 請求錯誤] 缺少 Google 授權碼',
				data: {
					source: 'BFF 請求驗證',
					message: '請求 body 中缺少 code 參數',
					timestamp: new Date().toISOString(),
				},
			})
		}

		// 使用統一的 headers 處理
		const headers = getForwardHeaders(event)

		// 首先使用 Google API 將授權碼轉換為 id_token
		const config = useRuntimeConfig()

		// 從環境變數讀取 Google OAuth 憑證
		const clientId = config.public.googleClientId
		const clientSecret = config.googleClientSecret

		// 檢查必要的環境變數是否存在
		if (!clientId || !clientSecret) {
			console.error('❌ [BFF] Google OAuth 環境變數未設定:', {
				hasClientId: !!clientId,
				hasClientSecret: !!clientSecret,
				envVars: {
					NUXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ? 'exists' : 'missing',
					NUXT_GOOGLE_CLIENT_SECRET: process.env.NUXT_GOOGLE_CLIENT_SECRET ? 'exists' : 'missing',
				},
			})
			throw createError({
				statusCode: 500,
				statusMessage: '[BFF 配置錯誤] Google OAuth 環境變數未正確設定',
				data: {
					source: 'BFF 環境變數驗證',
					message: 'NUXT_PUBLIC_GOOGLE_CLIENT_ID 或 NUXT_GOOGLE_CLIENT_SECRET 未設定',
					timestamp: new Date().toISOString(),
				},
			})
		}

		// 獲取 redirect URI
		const redirectUri = process.env.NODE_ENV === 'development'
			? 'http://localhost:3000/users/login'
			: 'https://try-b.vercel.app/users/login'

		// 準備 Google Token 請求參數
		const tokenParams = new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code: code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri,
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
				body: tokenParams.toString(),
			})
		}
		catch (error: any) {
			console.error('❌ [BFF] Google OAuth2 Token 交換錯誤:', {
				source: 'Google OAuth2 API',
				status: error.status,
				statusText: error.statusText,
				data: error.data,
				message: error.message,
			})
			throw createError({
				statusCode: 400,
				statusMessage: `[BFF 內部錯誤] Google OAuth2 Token 交換失敗: ${error.data?.error_description || error.message}`,
				data: {
					source: 'Google OAuth2 API',
					originalError: error.data?.error_description || error.message,
					originalStatus: error.status,
					timestamp: new Date().toISOString(),
				},
			})
		}

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

		// 檢查是否有 id_token，如果沒有則使用用戶資訊
		let tokenToSend
		if (tokenResponse.id_token) {
			tokenToSend = tokenResponse.id_token
		}
		else {
		// 如果沒有 id_token，創建一個包含用戶資訊的物件
			tokenToSend = {
				access_token: tokenResponse.access_token,
				user_info: userInfoResponse,
				token_type: tokenResponse.token_type,
			}
		}

		// 轉發請求到真實後端 - 直接使用後端 URL
		const backendUrl = 'https://trybeta.rocket-coding.com/api/v1/users/google'

		let backendResponse
		try {
			// 使用原生 fetch 而非 event.$fetch 來避免 Nitro 的代理問題
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 秒超時

			// 清理 headers，避免重複
			const cleanHeaders = {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'User-Agent': 'PostmanRuntime/7.49.0',
				// 只保留非 Content-Type 和 Accept 的 headers
				...Object.fromEntries(
					Object.entries(headers).filter(([key]) =>
						!['content-type', 'accept', 'Content-Type', 'Accept'].includes(key.toLowerCase()),
					),
				),
			}

			const fetchResponse = await fetch(backendUrl, {
				method: 'POST',
				headers: cleanHeaders,
				body: JSON.stringify({
					id_token: typeof tokenToSend === 'string' ? tokenToSend : JSON.stringify(tokenToSend),
				}),
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!fetchResponse.ok) {
				throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
			}

			backendResponse = await fetchResponse.json()
		}
		catch (error: any) {
			console.error('❌ [BFF] 外部後端 ASP API Server 請求失敗:', {
				source: '外部後端 ASP API Server',
				url: backendUrl,
				error: error.message,
				status: error.status,
				statusText: error.statusText,
				data: error.data,
				stack: error.stack,
			})

			// 重新拋出錯誤，但加上明確的來源標示
			const enhancedError = createError({
				statusCode: error.status || 502,
				statusMessage: `[外部後端錯誤] ${error.message || '外部後端 ASP API Server 無回應'}`,
				data: {
					source: '外部後端 ASP API Server',
					originalError: error.message,
					originalStatus: error.status,
					url: backendUrl,
					timestamp: new Date().toISOString(),
				},
			})
			throw enhancedError
		}

		// 如果後端回應包含 token，設定 cookie
		if (backendResponse && (backendResponse as any).token) {
			setUserAuthCookie(event, (backendResponse as any).token)
			return backendResponse
		}
		else {
			console.error('❌ [BFF] Google 認證回應格式錯誤:', {
				source: 'BFF 內部驗證',
				response: backendResponse,
				hasToken: !!(backendResponse as any).token,
			})
			throw createError({
				statusCode: 401,
				statusMessage: '[BFF 內部錯誤] Google 認證回應格式無效或缺少必要資訊',
				data: {
					source: 'BFF 內部驗證',
					message: '後端回應缺少有效的 token 或 user 資訊',
					response: backendResponse,
					timestamp: new Date().toISOString(),
				},
			})
		}
	}
	catch (error: any) {
		console.error('❌ [BFF] 未預期的內部錯誤:', {
			source: 'BFF 內部未處理錯誤',
			error: error.message,
			stack: error.stack,
		})
		throw createError({
			statusCode: 500,
			statusMessage: '[BFF 內部錯誤] 未預期的系統錯誤',
			data: {
				source: 'BFF 內部未處理錯誤',
				originalError: error.message,
				timestamp: new Date().toISOString(),
			},
		})
	}
})
