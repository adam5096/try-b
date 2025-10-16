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

	// 登入方法 - 使用 ID Token 流程
	const login = async (onSuccess?: (response: any) => void) => {
		try {
			await loadGoogleScript()

			if (onSuccess) {
				onSuccessCallback.value = onSuccess
			}

			// 使用 Google Identity Services 的 ID Token 流程
			window.google.accounts.id.initialize({
				client_id: clientId,
				callback: handleCredentialResponse,
			})

			// 觸發登入彈窗
			window.google.accounts.id.prompt()
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
					initialize: (config: { client_id: string, callback: (response: any) => void }) => void
					prompt: () => void
				}
			}
		}
	}
}
