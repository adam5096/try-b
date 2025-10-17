/**
 * Google OAuth2 純手寫實現
 * 使用 Google Identity Services Library
 */
export const useGoogleAuth = () => {
	const config = useRuntimeConfig()
	const clientId = config.public.googleClientId || '835793329309-rhgij07od1g2sfalsl1g5u1284kqbmt3.apps.googleusercontent.com'

	// 檢查 clientId 是否存在
	if (!clientId) {
		throw new Error('Google Client ID is not configured')
	}

	// 載入 Google Identity Services 腳本
	const loadGoogleScript = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (window.google?.accounts?.id) {
				resolve()
				return
			}

			const script = document.createElement('script')
			script.src = 'https://accounts.google.com/gsi/client'
			script.async = true
			script.defer = true

			script.onload = () => resolve()
			script.onerror = () => reject(new Error('Failed to load Google script'))

			document.head.appendChild(script)
		})
	}

	// 處理認證回應
	const handleCredentialResponse = (response: any) => {
		console.log('Google Auth Response:', response)
		// 這裡會觸發成功回調
		if (onSuccessCallback.value) {
			onSuccessCallback.value(response)
		}
	}

	// 成功回調函數
	const onSuccessCallback = ref<((response: any) => void) | null>(null)

	// 登入方法 - 使用重定向流程避免 COOP 限制
	const login = async (onSuccess?: (response: any) => void) => {
		try {
			await loadGoogleScript()

			if (onSuccess) {
				onSuccessCallback.value = onSuccess
			}

			// 使用重定向流程避免 COOP 限制
			const redirectUri = process.env.NODE_ENV === 'development'
				? 'http://localhost:3000/users/login'
				: 'https://try-b.vercel.app/users/login'

			const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?`
				+ `client_id=${clientId}&`
				+ `redirect_uri=${encodeURIComponent(redirectUri)}&`
				+ `response_type=code&`
				+ `scope=openid%20email%20profile&`
				+ `state=${Date.now()}`

			// 直接重定向到 Google 登入頁面
			window.location.href = authUrl
		}
		catch (error) {
			console.error('Google Auth Error:', error)
			throw error
		}
	}

	return {
		login,
		loadGoogleScript,
	}
}

// 擴展 Window 介面
declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: any) => void
						auto_select?: boolean
						cancel_on_tap_outside?: boolean
					}) => void
					prompt: (callback?: (notification: any) => void) => void
					renderButton: (element: HTMLElement, config: any) => void
				}
			}
		}
	}
}
