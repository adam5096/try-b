import { createApiHandler } from '~/server/utils/apiHandler'

export default createApiHandler(async () => {
  // 透過 Nitro 的 proxy 設定轉發到真實後端
  // 規則：必須包含 api 並使用 /api-proxy 進行代理
  const data = await $fetch('/api-proxy/api/v1/homepage', {
    method: 'GET',
  })

  return data
})


