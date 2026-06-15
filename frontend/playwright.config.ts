import { defineConfig, devices } from '@playwright/test';

// E2E — 실제 브라우저로 프론트(5173, /v1는 백엔드 3000으로 프록시)를 구동해 사용자 행동·이상행동을 검증.
// 백엔드(api:3000)와 Vite dev 서버가 떠 있어야 한다. CI에선 webServer로 자동 기동.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'retain-on-failure',
    locale: 'ko-KR',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:5173',
        timeout: 60_000,
        reuseExistingServer: true,
        env: { VITE_API_TARGET: process.env.VITE_API_TARGET || 'http://localhost:3000' },
      },
});
