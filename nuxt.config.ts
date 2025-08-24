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
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || '',
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

  routeRules: {
    '/api/**': {
      proxy: 'https://trybeta.rocket-coding.com/api/**',
    },
    '/company/**': {
      proxy: 'https://trybeta.rocket-coding.com/api/**',
    },
  },
  // vite: {
  //   server: {
  //     proxy: {
  //       '/api': {
  //         target: process.env.NUXT_PUBLIC_API_BASE_URL,
  //         changeOrigin: true,
  //         rewrite: (path) => path.replace(/^\/api/, ''),
  //       },
  //     },
  //   },
  // },
  // build: {
  //   transpile: ['dayjs', 'dayjs-nuxt'],
  // },

  imports: {
    dirs: ['stores/**'],
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