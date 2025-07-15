const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    // 設定全域共用的 container，它會自動置中並在兩側留白
    // 其最大寬度將由下方的 screens 定義來決定 (最大為 1400px)
    container: {
      center: true,
      padding: '48px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // 在這裡定義全域的斷點，這些斷點會被 container 和 sm:, lg: 等工具類共用
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px', // 在此設定全域 container 的最大寬度
      },
      // 專為頁首設計的寬度
      maxWidth: {
        'screen-full-hd': '1920px',
      },
      height: {
        'main-header': '158px',
      }
    },
  },
  plugins: [],
} 