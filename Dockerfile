# ── base: deps + 소스 (mock 서버, 빌드 공용) ──
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY tools ./tools
COPY vendor ./vendor
COPY prompt.md ./prompt.md
RUN pnpm prisma generate && pnpm build

# ── api ──
FROM node:22-bookworm-slim AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/vendor ./vendor
COPY --from=base /app/prompt.md ./prompt.md
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]

# ── worker: Playwright Chromium + 한글 폰트 (시스템 폰트 의존 금지지만, fontconfig 폴백도 설치) ──
FROM node:22-bookworm-slim AS worker
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/vendor ./vendor
COPY --from=base /app/prompt.md ./prompt.md
COPY package.json ./
# Chromium 의존 라이브러리 + Noto Sans KR (런타임 폴백) 설치
RUN npx playwright install --with-deps chromium \
  && apt-get update && apt-get install -y --no-install-recommends fonts-noto-cjk \
  && mkdir -p /usr/share/fonts/pretendard \
  && cp /app/vendor/fonts/*.woff2 /usr/share/fonts/pretendard/ \
  && rm -rf /var/lib/apt/lists/*
CMD ["node", "dist/worker.js"]
