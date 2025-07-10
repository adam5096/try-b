// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@samk-dev/nuxt-vcalendar',
    // 'dayjs-nuxt', // We will handle dayjs via a custom plugin
    'nuxt-swiper',
    '@vee-validate/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
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
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    // injectPosition: 0,
    viewer: false,
  },
  // build: {
  //   transpile: ['dayjs', 'dayjs-nuxt'],
  // },
})