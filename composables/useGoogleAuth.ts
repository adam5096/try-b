/**
 * Google OAuth2 純手寫實現
 * 使用 Google Identity Services Library
 */
export const useGoogleAuth = () => {
	const config = useRuntimeConfig()
	const clientId = config.public.googleClientId

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

	// 初始化 Google Identity Services
	const initializeGoogleAuth = () => {
		if (!window.google?.accounts?.id) {
			throw new Error('Google Identity Services not loaded')
		}

		window.google.accounts.id.initialize({
			client_id: clientId,
			callback: handleCredentialResponse,
			auto_select: false,
			cancel_on_tap_outside: false,
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

	// 登入方法
	const login = async (onSuccess?: (response: any) => void) => {
		try {
			await loadGoogleScript()
			initializeGoogleAuth()

			if (onSuccess) {
				onSuccessCallback.value = onSuccess
			}

			// 觸發 Google 登入流程
			window.google.accounts.id.prompt((notification: any) => {
				if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					console.log('Google One Tap not displayed or skipped')
				}
			})
		}
		catch (error) {
			console.error('Google Auth Error:', error)
			throw error
		}
	}

	// 渲染按鈕方法
	const renderButton = (element: HTMLElement, onSuccess?: (response: any) => void) => {
		if (!window.google?.accounts?.id) {
			throw new Error('Google Identity Services not loaded')
		}

		if (onSuccess) {
			onSuccessCallback.value = onSuccess
		}

		window.google.accounts.id.renderButton(element, {
			theme: 'outline',
			size: 'large',
			type: 'standard',
			shape: 'rectangular',
			text: 'signin_with',
			logo_alignment: 'left',
		})
	}

	return {
		login,
		renderButton,
		loadGoogleScript,
		initializeGoogleAuth,
	}
}

// 擴展 Window 介面
declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: any) => void
					prompt: (callback?: (notification: any) => void) => void
					renderButton: (element: HTMLElement, config: any) => void
				}
			}
		}
	}
}
