import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'
import { clearUserAuthCookie } from '~/server/utils/cookies'

export default createApiHandler(async (event) => {
	try {
		// 獲取 JWT token 從 Authorization header
		const authHeader = getHeader(event, 'authorization')
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw createError({
				statusCode: 401,
				statusMessage: '[BFF 認證錯誤] 缺少有效的 Authorization header',
				data: {
					source: 'BFF 認證驗證',
					message: '請求缺少 Bearer token',
					timestamp: new Date().toISOString(),
				},
			})
		}

		// 使用統一的 headers 處理
		const headers = getForwardHeaders(event)

		// 轉發登出請求到外部後端
		const backendUrl = 'https://trybeta.rocket-coding.com/api/v1/users/logout'
		
		let backendResponse
		try {
			// 使用原生 fetch 避免 Nitro 代理問題
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 秒超時

			// 清理 headers，避免重複
			const cleanHeaders = {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'User-Agent': 'PostmanRuntime/7.49.0',
				// 保留 Authorization header
				'Authorization': authHeader,
				// 只保留非 Content-Type 和 Accept 的 headers
				...Object.fromEntries(
					Object.entries(headers).filter(([key]) =>
						!['content-type', 'accept', 'Content-Type', 'Accept', 'authorization', 'Authorization'].includes(key.toLowerCase()),
					),
				),
			}

			const fetchResponse = await fetch(backendUrl, {
				method: 'POST',
				headers: cleanHeaders,
				body: JSON.stringify({}), // 空的 request body
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!fetchResponse.ok) {
				throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
			}

			backendResponse = await fetchResponse.json()
		}
		catch (error: any) {
			throw createError({
				statusCode: error.status || 502,
				statusMessage: `[外部後端錯誤] ${error.message || '外部後端登出 API 無回應'}`,
				data: {
					source: '外部後端登出 API',
					originalError: error.message,
					originalStatus: error.status,
					url: backendUrl,
					timestamp: new Date().toISOString(),
				},
			})
		}

		// 外部後端成功後，清除前端 HttpOnly cookie
		clearUserAuthCookie(event)
		
		return {
			success: true,
			message: '登出成功',
			backendResponse
		}
	}
	catch (error: any) {
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || '[BFF 內部錯誤] 登出處理失敗',
			data: {
				source: 'BFF 登出處理',
				originalError: error.message,
				timestamp: new Date().toISOString(),
			},
		})
	}
})
