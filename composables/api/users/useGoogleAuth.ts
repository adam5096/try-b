import type { UserLoginData } from '~/types/users/user'

// API 回應中的 User 格式（大寫欄位名）
interface ApiUser {
	Id: number
	Account: string
	Email: string
	Role: string
}

interface LoginResponse {
	status: number
	message: string
	token: string
	user: ApiUser
}

interface GoogleAuthRequest {
	id_token: string
}

export const useGoogleAuth = () => {
	async function loginWithGoogle(idToken: string) {
		return $fetch<LoginResponse>('/api/v1/users/google', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				id_token: idToken,
			},
		})
	}

	return { loginWithGoogle }
}
