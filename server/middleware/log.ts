/**
 * 請求日誌中間件
 */
export default defineEventHandler((event) => {
	const start = Date.now();
	const method = event.node.req.method;
	const url = getRequestURL(event);

	// 記錄請求開始
	// 請求日誌記錄

	// 監聽回應完成
	event.node.res.on('finish', () => {
		const duration = Date.now() - start;
		const statusCode = event.node.res.statusCode;

		// 根據狀態碼選擇日誌級別
		if (statusCode >= 500) {
			console.error(`[${new Date().toISOString()}] ${method} ${url.pathname} - ${statusCode} - ${duration}ms`);
		}
		else if (statusCode >= 400) {
			console.warn(`[${new Date().toISOString()}] ${method} ${url.pathname} - ${statusCode} - ${duration}ms`);
		}
		else {
			// 請求完成日誌記錄
		}

		// 記錄慢請求
		if (duration > 1000) {
			console.warn(`🐌 Slow request: ${method} ${url.pathname} - ${duration}ms`);
		}
	});
});
