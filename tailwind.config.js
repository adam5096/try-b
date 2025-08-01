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
      padding: "48px",
    },
    extend: {
      spacing: {
        // "content-offset": "360px", // No longer needed, replaced by container
      },
      padding: {
        "section-padding": "80px",
      },
      colors: {
        "btn-yellow": "#FFE70C",
        "btn-black": "#0D2C43",
        "major-blue": "#158AD9",
        "brand-gray": "#F8F9FB",
        "major-blue-light": "#39B1EE",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      // 在這裡定義全域的斷點，這些斷點會被 container 和 sm:, lg: 等工具類共用
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px", // 在此設定全域 container 的最大寬度
      },
      // 專為頁首設計的版心寬度
      maxWidth: {
        "screen-full-hd": "1920px",
        "container-main": "1200px",
      },
      height: {
        "main-header": "158px",
        "hero-section": "811px", // Re-enabled for fixed-height layout
        "site-logo-width": "252px",
        "site-logo-height": "62px",
        "partner-logo-width": "176px",
        "partner-logo-height": "44px",
      },
    },
  },
  plugins: [],
}; 