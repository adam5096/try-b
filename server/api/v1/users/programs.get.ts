import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
	// 取得查詢參數
	const query = getQuery(event)
	const queryString = new URLSearchParams()

	// 轉發所有查詢參數
	if (query.page) queryString.append('page', String(query.page))
	if (query.limit) queryString.append('limit', String(query.limit))
	if (query.keyword) queryString.append('keyword', String(query.keyword))
	if (query.industry) queryString.append('industry', String(query.industry))
	if (query.jobType) queryString.append('jobType', String(query.jobType))
	if (query.location) queryString.append('location', String(query.location))
	if (query.sort) queryString.append('sort', String(query.sort))

	const qs = queryString.toString()
	const endpoint = `/api-proxy/api/v1/programs${qs ? `?${qs}` : ''}`

	// 使用統一的 headers 處理（程式列表通常不需要認證，但保留彈性）
	const headers = getForwardHeaders(event)

	// 透過 Nitro 的 proxy 設定轉發到真實後端
	// 規則：必須包含 api 並使用 /api-proxy 進行代理
	const data = await event.$fetch(endpoint, {
		method: 'GET',
		headers,
	})

	return data
});
