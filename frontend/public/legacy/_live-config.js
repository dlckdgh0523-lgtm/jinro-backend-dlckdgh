// 실 백엔드 연동 토글 — Vite/nginx 서빙에서 /v1이 백엔드로 프록시.
// 인라인 <script>에 있던 설정을 CSP unsafe-inline 제거 위해 외부 파일로 분리.
window.__LIVE_MODE = true;
window.__ROLE_SET = 'web';
window.VITE_APP_ENV = 'live';
window.VITE_API_BASE_URL = '/v1';
