export default defineNuxtPlugin(() => {
	if (!import.meta.client) { return; }

	const config = useRuntimeConfig();

	// 檢查是否啟用效能預算監控
	if (!config.public.enablePerformanceBudget) {
		return;
	}

	// 動態導入效能監控工具
	import('~/utils/performance-monitor').then(({ performanceMonitor }) => {
		// 等待頁面完全載入後進行效能檢查
		window.addEventListener('load', () => {
			setTimeout(() => {
				// 檢查 Web Vitals
				const vitals = {
					LCP: 0,
					FID: 0,
					CLS: 0,
					FCP: 0,
					TTFB: 0,
				};

				// 從 Performance Observer 獲取實際數據
				if ('PerformanceObserver' in window) {
					try {
						// LCP
						const lcpObserver = new PerformanceObserver((list) => {
							const entries = list.getEntries();
							const lastEntry = entries[entries.length - 1];
							vitals.LCP = lastEntry.startTime;
						});
						lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

						// FCP
						const fcpObserver = new PerformanceObserver((list) => {
							const entries = list.getEntries();
							vitals.FCP = entries[0].startTime;
						});
						fcpObserver.observe({ entryTypes: ['paint'] });

						// TTFB
						const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
						if (navigation) {
							vitals.TTFB = navigation.responseStart - navigation.requestStart;
						}
					}
					catch (error) {
						console.warn('Performance Observer not supported:', error);
					}
				}

				// 檢查效能預算
				const webVitalsReport = performanceMonitor.checkWebVitals(vitals);
				const resourceReport = performanceMonitor.checkResourceSizes();

				// 生成完整報告
				const report = performanceMonitor.generateReport();

				// 發送報告
				performanceMonitor.sendReport(report);

				// 在開發環境中顯示報告
				if (process.env.NODE_ENV === 'development') {
					console.group('🚀 Performance Budget Report');
					// 效能預算報告記錄
					console.groupEnd();
				}
			}, 2000); // 等待 2 秒確保所有資源載入完成
		});
	});
});
