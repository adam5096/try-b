// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-16',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxtjs/seo',
    '@element-plus/nuxt',
    '@nuxt/image',
  ],
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
  // build: {
  //   transpile: ['dayjs', 'dayjs-nuxt'],
  // },
  
})