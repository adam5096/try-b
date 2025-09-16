export default defineNuxtPlugin(() => {
	if (!import.meta.client) { return; }

	const config = useRuntimeConfig();

	// 檢查是否啟用 Web Vitals 監控
	if (!config.public.enableWebVitals) {
		return;
	}

	// Web Vitals 監控實現
	const reportWebVitals = (metric: any) => {
		console.log('Web Vital:', metric);

		// 發送到 Google Analytics 4
		if (typeof (window as any).gtag !== 'undefined') {
			(window as any).gtag('event', metric.name, {
				value: Math.round(metric.value),
				event_category: 'Web Vitals',
				event_label: metric.id,
				non_interaction: true,
			});
		}

		// 發送到自建監控系統（如果有的話）
		if (process.env.NODE_ENV === 'production') {
			// 可以在這裡添加自建的監控端點
			// fetch('/api/analytics/web-vitals', {
			//   method: 'POST',
			//   body: JSON.stringify(metric),
			//   headers: { 'Content-Type': 'application/json' }
			// }).catch(console.error);
		}
	};

	// 監控 Core Web Vitals
	const observeWebVitals = () => {
		// LCP (Largest Contentful Paint)
		if ('PerformanceObserver' in window) {
			try {
				const lcpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1] as any;
					reportWebVitals({
						name: 'LCP',
						value: lastEntry.startTime,
						id: lastEntry.id || '',
					});
				});
				lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
			}
			catch (e) {
				console.warn('LCP monitoring not supported');
			}

			// FID (First Input Delay)
			try {
				const fidObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						reportWebVitals({
							name: 'FID',
							value: entry.processingStart - entry.startTime,
							id: entry.id || '',
						});
					});
				});
				fidObserver.observe({ entryTypes: ['first-input'] });
			}
			catch (e) {
				console.warn('FID monitoring not supported');
			}

			// CLS (Cumulative Layout Shift)
			try {
				let clsValue = 0;
				const clsObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
						}
					});

					// 只在頁面卸載時報告 CLS
					if (document.visibilityState === 'hidden') {
						reportWebVitals({
							name: 'CLS',
							value: clsValue,
							id: 'cls-final',
						});
					}
				});
				clsObserver.observe({ entryTypes: ['layout-shift'] });
			}
			catch (e) {
				console.warn('CLS monitoring not supported');
			}
		}
	};

	// 監控頁面載入時間
	const observePageLoad = () => {
		window.addEventListener('load', () => {
			setTimeout(() => {
				const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

				if (navigation) {
					// TTFB
					const ttfb = navigation.responseStart - navigation.requestStart;
					if (ttfb > 0) {
						reportWebVitals({
							name: 'TTFB',
							value: ttfb,
							id: 'ttfb',
						});
					}

					// DOM Load
					const domLoad = navigation.domContentLoadedEventEnd - (navigation as any).navigationStart;
					if (domLoad > 0 && !isNaN(domLoad)) {
						reportWebVitals({
							name: 'DOM_LOAD',
							value: domLoad,
							id: 'dom-load',
						});
					}

					// Page Load
					const pageLoad = navigation.loadEventEnd - (navigation as any).navigationStart;
					if (pageLoad > 0 && !isNaN(pageLoad)) {
						reportWebVitals({
							name: 'PAGE_LOAD',
							value: pageLoad,
							id: 'page-load',
						});
					}
				}
			}, 100); // 增加延遲確保所有指標都已計算
		});
	};

	// 初始化監控
	observeWebVitals();
	observePageLoad();
});
