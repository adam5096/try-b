import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
	const userId = getRouterParam(event, 'userId')

  if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing userId parameter',
		})
  }

	// 取得查詢參數
	const query = getQuery(event)
  const queryString = new URLSearchParams()

  // 轉發查詢參數
  if (query.page) queryString.append('page', String(query.page))
  if (query.limit) queryString.append('limit', String(query.limit))
  if (query.status && Array.isArray(query.status)) {
		query.status.forEach(status => queryString.append('status', String(status)))
  }
	else if (query.status) {
		queryString.append('status', String(query.status))
  }
	if (query.sort) queryString.append('sort', String(query.sort))

  const qs = queryString.toString()
  const endpoint = `/api-proxy/api/v1/users/${userId}/evaluations${qs ? `?${qs}` : ''}`

  // 使用統一的 headers 處理（評價需要認證）
  const headers = getForwardHeaders(event)

  // 透過 Nitro 的 proxy 設定轉發到真實後端
  // 規則：必須包含 api 並使用 /api-proxy 進行代理
  const data = await event.$fetch(endpoint, {
		method: 'GET',
		headers,
	})

  return data
});
