import { createApiHandler } from '~/server/utils/apiHandler'
import { createAuthHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
  const companyId = getRouterParam(event, 'companyId')
  
  if (!companyId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing companyId parameter',
    })
  }

  // 讀取請求體
  const body = await readBody(event)

  // 使用統一的認證 headers 處理
  const headers = createAuthHeaders(event, 'companyAuthToken')

  // 透過 Nitro 的 proxy 設定轉發到真實後端
  // 規則：必須包含 api 並使用 /api-proxy 進行代理
  const data = await event.$fetch(`/api-proxy/api/v1/company/${companyId}/programs`, {
    method: 'POST',
    headers,
    body,
  })

  return data
})
