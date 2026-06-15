import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 개발 시 /v1 → 백엔드(:3000) 프록시. 프로덕션은 nginx가 /v1을 api로 프록시한다.
// public/legacy 의 원본 jsx(babel-in-browser)는 그대로 정적 서빙되어 동작한다.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/v1': { target: process.env.VITE_API_TARGET || 'http://localhost:3000', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
