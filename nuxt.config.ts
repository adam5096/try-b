// https://nuxt.com/docs/api/configuration/nuxt-config

// eslint-disable-next-line no-undef
export default defineNuxtConfig({

	modules: [
		'@nuxtjs/tailwindcss',
		'@nuxt/fonts',
		'@nuxt/eslint',
		'@nuxtjs/seo',
		'@nuxtjs/sitemap', // Sitemap 模組
		['@element-plus/nuxt', { idInjection: false }],
		'@nuxt/image',
		'@pinia/nuxt',
	],

	imports: {
		dirs: ['stores/**', 'composables/**'],
	},	devtools: { enabled: true },
	app: {
		head: {
			link: [
				// API 與主站的預解析與預連線，降低 TLS/握手延遲
				{ rel: 'dns-prefetch', href: 'https://trybeta.rocket-coding.com' },
				{ rel: 'preconnect', href: 'https://trybeta.rocket-coding.com', crossorigin: '' },

				// 關鍵圖片預載入已移至 pages/index.vue 中設定，避免全域預載入警告

				// Favicon 與多尺寸 PNG（使用 public/ 內的檔案）
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
			],
		},
	},

	// Sitemap 模組設定
	site: {
		// 請記得在網站上線後，將 yourdomain.com 替換成您的真實網域
		url: 'https://try-b.vercel.app',
		name: 'TRY β 職業體驗平台',
		description: 'TRY β 是一個連結人才與企業的職業體驗平台，提供多元的短期體驗計畫，幫助求職者在投入職場前探索興趣，找到真正適合自己的道路。',
	},
	runtimeConfig: {
		public: {
			apiBase: '/api', // 統一使用 /api 前綴，透過 BFF 架構處理
			// 效能監控配置
			enableWebVitals: true,
			enablePerformanceBudget: true,
			// Google Analytics 配置
			googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '', // 請設置環境變數
		},
	},
	build: {
		// 確保 SSR 端將以下套件轉譯，避免 CJS/ESM 差異
		transpile: ['@popperjs/core', 'element-plus'],
	},

	// Sitemap 會自動根據路由生成，無需額外配置

	// 路由渲染模式配置 - 優化效能策略
	routeRules: {
		// 靜態頁面：預渲染，提升載入速度
		'/': { prerender: true }, // 首頁 - 靜態內容
		'/404': { prerender: true }, // 404頁面
		'/plan': { prerender: true }, // 方案頁面 - 靜態內容
		'/roles': { prerender: true }, // 角色頁面 - 靜態內容

		// 企業後台：CSR 模式，確保高互動性和即時性
		'/company/login': { prerender: true }, // 登入頁面 - 靜態
		'/company/register': { prerender: true }, // 註冊頁面 - 靜態
		'/company/**': { prerender: false }, // 其他企業頁面 - CSR

		// 用戶頁面：CSR 模式，保持互動性
		'/users/login': { prerender: true }, // 登入頁面 - 靜態
		'/users/register': { prerender: true }, // 註冊頁面 - 靜態
		'/users/**': { prerender: false }, // 其他用戶頁面 - CSR

		// 管理後台：CSR 模式，確保即時性
		'/admin/**': { prerender: false },
	},
	compatibilityDate: '2025-07-16',

	nitro: {
		routeRules: {
			'/api-proxy/**': {
				proxy: 'https://trybeta.rocket-coding.com/**',
			},
			// 靜態圖與 IPX 輸出的長時間快取（提升重訪/多頁載入速度）
			'/img/**': {
				headers: {
					'cache-control': 'public, max-age=31536000, immutable',
				},
			},
			'/_ipx/**': {
				headers: {
					'cache-control': 'public, max-age=31536000, immutable',
				},
			},
			// 字體檔案快取策略
			'/_fonts/**': {
				headers: {
					'cache-control': 'public, max-age=31536000, immutable',
				},
			},
		},
		// 修正 Vercel 產環 SSR 匯入 @popperjs/core 造成的 CJS/ESM 錯誤（placements not found）
		// 將其內嵌到 Nitro bundle，避免以外部模組形式被 Node 直接解析
		externals: {
			inline: ['@popperjs/core'],
		},
		// Server imports 優化 - 自動導入 server utils
		imports: {
			dirs: ['server/utils/**'],
		},
		// Prerender 優化 - 明確指定需要預渲染的路由
		prerender: {
			routes: [
				'/',
				'/404',
				'/plan',
				'/roles',
				'/company/login',
				'/company/register',
				'/users/login',
				'/users/register',
			],
		},
		// Vercel 部署優化
		...(process.env.VERCEL && {
			preset: 'vercel',
		}),
	},
	eslint: {
		config: {
			stylistic: {
				semi: true, // 使用分號
				quotes: 'single', // 使用單引號
				commaDangle: 'always-multiline',
				indent: 'tab', // 使用 Tab 縮排
			},
		},
	},
	fonts: {
		families: [
			{ name: 'Inter', provider: 'google', weights: ['400', '700'] },
		],
	},
	image: {
		// 圖片格式和品質設定
		format: ['webp'],
		quality: 80,
		// 根據環境選擇提供者
		provider: process.env.VERCEL ? 'vercel' : 'ipx',
		// 允許優化的外部域名
		domains: ['trybeta.rocket-coding.com', 'images.unsplash.com', 'i.imgur.com'],
		// 定義所有可能的螢幕尺寸（Vercel 需要）
		screens: {
			'xs': 320,
			'sm': 640,
			'md': 768,
			'lg': 1024,
			'xl': 1280,
			'xxl': 1536,
			'2xl': 1536,
		},
	},
	tailwindcss: {
		cssPath: '~/assets/css/main.css',
		configPath: 'tailwind.config.js',
		exposeConfig: false,
		// injectPosition: 0,
		viewer: false,
	},
});
