import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // NestJS 데코레이터/메타데이터 — esbuild 대신 SWC
    swc.vite({ module: { type: 'es6' }, jsc: { target: 'es2022', parser: { syntax: 'typescript', decorators: true }, transform: { decoratorMetadata: true, legacyDecorator: true } } }),
  ],
  test: {
    globals: false,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // UNIT_ONLY=1 이면 testcontainers(Docker) 없이 순수 단위테스트만 — Docker 불가 환경 대비
    ...(process.env.UNIT_ONLY ? { include: ['test/unit/**/*.test.ts'] } : { globalSetup: ['test/global-setup.ts'] }),
    testTimeout: 60_000,
    hookTimeout: 120_000,
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/worker.ts', 'src/main.ts'],
      reporter: ['text-summary', 'html', 'json-summary'],
    },
  },
});
