import type { EventHandler, EventHandlerRequest } from 'h3'

/**
 * 建立統一的 API 處理器，包含錯誤處理
 */
export const createApiHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      return await handler(event)
    } catch (error: any) {
      // 統一錯誤處理
      throw createError({
        statusCode: error?.statusCode || 500,
        statusMessage: error?.message || 'Internal server error',
        data: error?.data,
      })
    }
  })

/**
 * 統一的 API 錯誤處理函數
 */
export const handleApiError = (error: any, defaultMessage: string) => {
  if (error?.statusCode) {
    throw createError({
      statusCode: error.statusCode,
      statusMessage: error.statusMessage || defaultMessage,
      data: error.data,
    })
  }
  
  throw createError({
    statusCode: 500,
    statusMessage: defaultMessage,
  })
}
