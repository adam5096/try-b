import { createApiHandler } from '~/server/utils/apiHandler'
import { getForwardHeaders } from '~/server/utils/headers'

export default createApiHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const programId = getRouterParam(event, 'programId')
  
  if (!userId || !programId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing userId or programId parameter',
    })
  }

  // 讀取請求體
  const body = await readBody(event)

  // 使用統一的 headers 處理（提交評價需要認證）
  const headers = getForwardHeaders(event)

  // 透過 Nitro 的 proxy 設定轉發到真實後端
  // 規則：必須包含 api 並使用 /api-proxy 進行代理
  const data = await event.$fetch(`/api-proxy/api/v1/users/${userId}/programs/${programId}/evaluations`, {
    method: 'PUT',
    headers,
    body,
  })

  return data
})
