import { createApiHandler } from '~/server/utils/apiHandler'
import { createAuthHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
	// 使用統一的認證 headers 處理
	const headers = createAuthHeaders(event, 'companyAuthToken')

  // 檢查是否有認證 token
  if (!headers.authorization) {
		throw createError({
			statusCode: 401,
			statusMessage: '請登入',
		})
  }

	// 轉發請求到真實後端
	const data = await event.$fetch('/api-proxy/api/v1/company', {
		method: 'GET',
		headers,
	})

  return data
});
