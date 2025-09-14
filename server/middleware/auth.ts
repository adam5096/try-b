/**
 * 認證中間件 - 為請求上下文添加認證資訊
 */
export default defineEventHandler((event) => {
  // 檢查公司認證 token
  const companyToken = getCookie(event, 'companyAuthToken')
  if (companyToken) {
    event.context.companyAuth = { token: companyToken }
  }
  
  // 檢查使用者認證 token
  const userToken = getCookie(event, 'userAuthToken')
  if (userToken) {
    event.context.userAuth = { token: userToken }
  }
  
  // 設定認證狀態
  event.context.isAuthenticated = !!(companyToken || userToken)
  event.context.authType = companyToken ? 'company' : userToken ? 'user' : null
})
