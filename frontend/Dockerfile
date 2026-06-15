# ── build ──
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV CI=true
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
# pnpm 10: 최신 패키지(minimumReleaseAge)·빌드 스크립트(esbuild) 정책을 빌드에서 허용
RUN pnpm install --frozen-lockfile --config.minimumReleaseAge=0 --config.dangerouslyAllowAllBuilds=true
COPY vite.config.ts index.html ./
COPY public ./public
RUN pnpm build

# ── serve (nginx: 정적 SPA + /v1 → api 프록시) ──
FROM nginx:1.27-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
