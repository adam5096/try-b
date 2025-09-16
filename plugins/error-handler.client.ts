export default defineNuxtPlugin(() => {
	// 全域錯誤處理
	const handleError = (error: Error, context: string) => {
		console.error(`[${context}] Error:`, error)

    // 發送錯誤到監控服務（如果有的話）
    if (import.meta.client) {
			// 可以在這裡添加錯誤追蹤服務
			// 例如：Sentry, LogRocket 等
		}
	};

	// 處理未捕獲的 Promise 拒絕
	if (import.meta.client) {
		window.addEventListener('unhandledrejection', (event) => {
			handleError(new Error(event.reason), 'Unhandled Promise Rejection')
    });

    // 處理全域 JavaScript 錯誤
    window.addEventListener('error', (event) => {
			handleError(event.error || new Error(event.message), 'Global Error')
    });
  }

	// 提供錯誤處理函數給整個應用使用
	return {
		provide: {
			handleError,
		},
	};
});
