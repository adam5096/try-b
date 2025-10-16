import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'

export default NuxtAuthHandler({
	providers: [
		GoogleProvider({
			clientId: useRuntimeConfig().googleClientId,
			clientSecret: useRuntimeConfig().googleClientSecret,
		}),
	],
	callbacks: {
		jwt: async ({ token, account, profile }) => {
			// 如果是 Google 登入，將 Google 用戶資訊加入 token
			if (account?.provider === 'google' && profile) {
				token.googleId = profile.sub
				token.email = profile.email
				token.name = profile.name
				// Google profile 使用 image 而非 picture
				token.picture = (profile as any).image || (profile as any).picture
			}
			return token
		},
		session: async ({ session, token }) => {
			// 將 token 中的資訊傳遞到 session，添加安全檢查
			if (token && session.user) {
				// 擴展 session.user 類型
				;(session.user as any).id = token.googleId as string
				session.user.email = token.email as string
				session.user.name = token.name as string
				session.user.image = token.picture as string
			}
			return session
		},
	},
	pages: {
		signIn: '/users/login',
	},
})
