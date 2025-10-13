export default defineNuxtPlugin(() => {
	if (!import.meta.client) { return; }

	const config = useRuntimeConfig();

	// 檢查是否啟用 Google Analytics
	if (!config.public.googleAnalyticsId) {
		return;
	}

	const GA_ID = config.public.googleAnalyticsId;

	// 使用 useScript 載入 Google Analytics（符合 Strict CSP）
	useScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);

	// 初始化 gtag
	(window as any).dataLayer = (window as any).dataLayer || [];
	function gtag(...args: any[]) {
		(window as any).dataLayer.push(args);
	}

	// 設定全域 gtag 函數
	(window as any).gtag = gtag;

	// 初始化 Google Analytics
	gtag('js', new Date());
	gtag('config', GA_ID, {
		page_title: document.title,
		page_location: window.location.href,
	});

	// 監聽路由變化
	const router = useRouter();
	router.afterEach((to) => {
		gtag('config', GA_ID, {
			page_title: document.title,
			page_location: window.location.href,
			page_path: to.fullPath,
		});
	});

	// 提供 gtag 函數給整個應用使用
	return {
		provide: {
			gtag,
		},
	};
});
