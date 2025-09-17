import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 使用 Node 環境，適合純函數測試
    environment: 'node',
    
    // 測試檔案匹配模式
    include: ['test/**/*.{test,spec}.{js,ts}'],
    
    // 全域測試 API，無需每次 import
    globals: true,
    
    // 測試覆蓋率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '.nuxt/',
        'dist/',
        'public/'
      ]
    }
  }
})
