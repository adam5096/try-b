import { createApiHandler } from '~/server/utils/apiHandler'
import { createAuthHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
	// 使用統一的認證 headers 處理
	const headers = createAuthHeaders(event, 'companyAuthToken')

	// 透過 Nitro 的 proxy 設定轉發到真實後端
	// 規則：必須包含 api 並使用 /api-proxy 進行代理
	const data = await event.$fetch('/api-proxy/api/v1/plans', {
		method: 'GET',
		headers,
	})

	return data
});
