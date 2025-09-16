/**
 * 效能監控 Server Plugin
 * 擴展 Nitro 運行時行為，提供詳細的效能追蹤
 */
export default defineNitroPlugin((nitroApp) => {
	// 請求開始時記錄時間
	nitroApp.hooks.hook('request', (event) => {
		event.context.startTime = Date.now();
		event.context.requestId = crypto.randomUUID();
	});

	// 回應前記錄處理時間
	nitroApp.hooks.hook('beforeResponse', (event, { body }) => {
		const duration = Date.now() - (event.context.startTime || Date.now());
		const requestId = event.context.requestId || 'unknown';

		// 記錄慢請求警告
		if (duration > 1000) {
			console.warn(`🐌 Slow response [${requestId}]: ${event.path} - ${duration}ms`);
		}

		// 記錄 API 請求統計
		if (event.path.startsWith('/api/')) {
			console.log(`📊 API Request [${requestId}]: ${event.path} - ${duration}ms`);
		}
	});

	// 回應後記錄最終統計
	nitroApp.hooks.hook('afterResponse', (event) => {
		const duration = Date.now() - (event.context.startTime || Date.now());
		const requestId = event.context.requestId || 'unknown';

		// 記錄完成狀態
		if (event.node.res.statusCode >= 200 && event.node.res.statusCode < 300) {
			console.log(`✅ Request completed [${requestId}]: ${event.path} - ${duration}ms`);
		}
	});
});
