/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 相对基址：同一份产物既能放在 Pages 的 /仓库名/ 下，也能放在 ECS 的站点根目录
  base: './',
  server: {
    // 仅开发服务器生效；生产环境由 Nginx 的 /api/ 反代承担
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true
  }
})
