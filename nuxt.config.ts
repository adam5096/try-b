// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-16',
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
  runtimeConfig: {
    public: {
      apiBase: '/api', // 統一使用 /api 前綴，透過 BFF 架構處理
      // 效能監控配置
      enableWebVitals: true,
    },
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: ['400', '700'] },
    ]
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        // quotes: "single",
        commaDangle: "always-multiline",
        indent: "tab",
      },
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    // injectPosition: 0,
    viewer: false,
  },

  // Sitemap 模組設定
  site: {
    // 請記得在網站上線後，將 yourdomain.com 替換成您的真實網域
    url: 'https://try-b.vercel.app',
  },

  // 路由渲染模式配置 - 優化效能策略
  routeRules: {
    // 靜態頁面：預渲染，提升載入速度
    '/': { prerender: true },        // 首頁 - 靜態內容
    '/404': { prerender: true },     // 404頁面
    '/plan': { prerender: true },    // 方案頁面 - 靜態內容
    '/roles': { prerender: true },   // 角色頁面 - 靜態內容
    
    // 企業後台：SWR 快取策略，平衡效能與動態性
    '/company/login': { prerender: true },     // 登入頁面 - 靜態
    '/company/register': { prerender: true },   // 註冊頁面 - 靜態
    '/company/**': { swr: 3600 },               // 其他企業頁面 - 1小時快取
    
    // 用戶頁面：CSR 模式，保持互動性
    '/users/login': { prerender: true },        // 登入頁面 - 靜態
    '/users/register': { prerender: true },     // 註冊頁面 - 靜態
    '/users/**': { prerender: false },          // 其他用戶頁面 - CSR
    
    // 管理後台：CSR 模式，確保即時性
    '/admin/**': { prerender: false },
  },

  nitro: {
    routeRules: {
      '/api-proxy/**': {
        proxy: 'https://trybeta.rocket-coding.com/**'
      },
      // 靜態圖與 IPX 輸出的長時間快取（提升重訪/多頁載入速度）
      '/img/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      },
      '/_ipx/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        }
      }
    },
    // 修正 Vercel 產環 SSR 匯入 @popperjs/core 造成的 CJS/ESM 錯誤（placements not found）
    // 將其內嵌到 Nitro bundle，避免以外部模組形式被 Node 直接解析
    externals: {
      inline: ['@popperjs/core']
    },
    // Vercel 部署優化
    ...(process.env.VERCEL && {
      preset: 'vercel'
    })
  },

  imports: {
    dirs: ['stores/**', 'composables/**'],
  },
  build: {
    // 確保 SSR 端將以下套件轉譯，避免 CJS/ESM 差異
    transpile: ['@popperjs/core', 'element-plus'],
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
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  },
  app: {
    head: {
      link: [
        // API 與主站的預解析與預連線，降低 TLS/握手延遲
        { rel: 'dns-prefetch', href: 'https://trybeta.rocket-coding.com' },
        { rel: 'preconnect', href: 'https://trybeta.rocket-coding.com', crossorigin: '' },

        // 關鍵圖片預載入，提升 LCP 效能
        { rel: 'preload', href: '/img/home/home-worker-bg.webp', as: 'image', type: 'image/webp' },
        { rel: 'preload', href: '/img/home/hero-bg.webp', as: 'image', type: 'image/webp' },

        // Favicon 與多尺寸 PNG（使用 public/ 內的檔案）
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
      ],
    },
  },
})