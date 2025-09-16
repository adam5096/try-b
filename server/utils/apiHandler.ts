import type { EventHandler, EventHandlerRequest } from 'h3';

/**
 * 建立統一的 API 處理器，包含錯誤處理和效能追蹤
 * 增強版本：添加詳細的錯誤分類和請求追蹤
 */
export const createApiHandler = <T extends EventHandlerRequest, D>(
	handler: EventHandler<T, D>,
): EventHandler<T, D> =>
	defineEventHandler<T>(async (event) => {
		const startTime = Date.now();
		const requestId = event.context.requestId || crypto.randomUUID();

		try {
			const result = await handler(event);

			// 記錄成功請求
			const duration = Date.now() - startTime;
			console.log(`✅ API Success [${requestId}]: ${event.path} - ${duration}ms`);

			return result;
		}
		catch (error: any) {
			const duration = Date.now() - startTime;

			// 根據錯誤類型分類處理
			if (error.statusCode >= 400 && error.statusCode < 500) {
				console.warn(`⚠️ Client Error [${requestId}]: ${event.path} - ${error.statusCode} - ${duration}ms`);
			}
			else {
				console.error(`❌ Server Error [${requestId}]: ${event.path} - ${error.statusCode || 500} - ${duration}ms`);
			}

			// 統一錯誤處理
			throw createError({
				statusCode: error?.statusCode || 500,
				statusMessage: error?.message || 'Internal server error',
				data: {
					...error?.data,
					requestId,
					timestamp: new Date().toISOString(),
					duration: `${duration}ms`,
				},
			});
		}
	});

/**
 * 統一的 API 錯誤處理函數
 * 增強版本：添加請求追蹤資訊
 */
export const handleApiError = (error: any, defaultMessage: string, requestId?: string) => {
	const trackingId = requestId || crypto.randomUUID();

	if (error?.statusCode) {
		throw createError({
			statusCode: error.statusCode,
			statusMessage: error.statusMessage || defaultMessage,
			data: {
				...error.data,
				requestId: trackingId,
				timestamp: new Date().toISOString(),
			},
		});
	}

	throw createError({
		statusCode: 500,
		statusMessage: defaultMessage,
		data: {
			requestId: trackingId,
			timestamp: new Date().toISOString(),
		},
	});
};
