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
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://trybeta.rocket-coding.com',
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

  nitro: {
    routeRules: {
      '/api-proxy/**': {
        proxy: 'https://trybeta.rocket-coding.com/**'
      }
    },
    // 修正 Vercel 產環 SSR 匯入 @popperjs/core 造成的 CJS/ESM 錯誤（placements not found）
    // 將其內嵌到 Nitro bundle，避免以外部模組形式被 Node 直接解析
    externals: {
      inline: ['@popperjs/core']
    }
  },

  imports: {
    dirs: ['stores/**', 'composables/**'],
  },
  build: {
    // 確保 SSR 端將以下套件轉譯，避免 CJS/ESM 差異
    transpile: ['@popperjs/core', 'element-plus'],
  },
  image: {
    // 允許的遠端圖片來源，透過 IPX 代理輸出為 HTTPS，避免 Mixed Content
    domains: ['trybeta.rocket-coding.com', 'images.unsplash.com', 'i.imgur.com'],
  },
  app: {
    head: {
      link: [
        // 預先連線至圖片 CDN
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://i.imgur.com' },

        // Google Fonts 已經由 @nuxt/fonts 模組自動處理，此處備用
        // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        // { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
})