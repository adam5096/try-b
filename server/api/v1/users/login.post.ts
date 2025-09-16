import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'
import { setUserAuthCookie } from '~/server/utils/cookies'

export default createApiHandler(async (event) => {
	// 讀取請求體
	const body = await readBody(event)

  // 使用統一的 headers 處理（登入不需要 Authorization）
  const headers = getForwardHeaders(event)

  // 透過 Nitro 的 proxy 設定轉發到真實後端
  // 規則：必須包含 api 並使用 /api-proxy 進行代理
  const data = await event.$fetch('/api-proxy/api/v1/users/login', {
		method: 'POST',
		headers,
		body,
	})

  // 如果後端回應包含 token，設定 cookie
  if (data && (data as any).token) {
		setUserAuthCookie(event, (data as any).token)
  }

	return data
});
