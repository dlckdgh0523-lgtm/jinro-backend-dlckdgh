// app-runtime.jsx — Runtime layer that turns the static design canvas into a
// real, connected, navigable app (loaded by app.html with __LIVE_MODE = true).
//
// Provides:
//   1. usePersistentScreen  — URL hash + refresh/back persistence (live mode only)
//   2. useApi / setApiMode  — mock API hook that ACTUALLY triggers loading/error/empty
//   3. AuthProvider/useAuth, useSubscription — real Context (no more prop drilling for session)
//   4. LiveRunner + DevToolbar — role/platform switcher, responsive width tester, API-state toggle
//
// In index.html (design canvas) __LIVE_MODE is falsy → usePersistentScreen behaves
// as plain useState, so the canvas is unaffected.

// ════════════════════════════════════════════════════════
// 1. Screen persistence (URL hash + localStorage)
// ════════════════════════════════════════════════════════
function liveHashScreen(appKey) {
  try {
    const h = (window.location.hash || '').replace(/^#/, '');
    const [role, screen] = h.split('/');
    if (role === (window.__ACTIVE_ROLE || appKey) && screen) return decodeURIComponent(screen);
  } catch (e) {}
  return null;
}

function usePersistentScreen(appKey, initial) {
  const live = typeof window !== 'undefined' && window.__LIVE_MODE;
  const [screen, setScreen] = React.useState(() => {
    if (!live) return initial;
    try {
      const fromHash = liveHashScreen(appKey);
      if (fromHash) return fromHash;
      const saved = localStorage.getItem('jinro:screen:' + appKey);
      return saved || initial;
    } catch (e) { return initial; }
  });
  const set = React.useCallback((s) => {
    setScreen(s);
    if (live) {
      try {
        localStorage.setItem('jinro:screen:' + appKey, s);
        const role = window.__ACTIVE_ROLE || appKey;
        window.history.replaceState(null, '', '#' + role + '/' + encodeURIComponent(s));
      } catch (e) {}
    }
  }, [appKey, live]);
  return [screen, set];
}

// ════════════════════════════════════════════════════════
// 2. Mock API + useApi (real loading/error/empty)
// ════════════════════════════════════════════════════════
window.__API_MODE = window.__API_MODE || 'normal'; // normal | loading | error | empty | slow
const _apiListeners = new Set();
function setApiMode(mode) {
  window.__API_MODE = mode;
  _apiListeners.forEach(fn => { try { fn(); } catch (e) {} });
}

// ════════════════════════════════════════════════════════
// Global toast (pure DOM — works from any component / any mount point)
// Used to wire "준비 중" actions and copy confirmations so no button is a dead end.
// ════════════════════════════════════════════════════════
function showToast(message, tone = 'info') {
  try {
    let host = document.getElementById('jinro-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'jinro-toast-host';
      host.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;';
      document.body.appendChild(host);
    }
    const bg = tone === 'success' ? '#15803D' : tone === 'danger' ? '#DC2626' : '#191F28';
    const el = document.createElement('div');
    el.style.cssText = `background:${bg};color:#fff;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;font-family:var(--font-sans);box-shadow:0 8px 24px rgba(17,24,39,0.18);opacity:0;transform:translateY(8px);transition:all .22s cubic-bezier(.32,.72,0,1);max-width:90vw;`;
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 240); }, 2200);
  } catch (e) {}
}
function notReady(label) { showToast((label ? label + ' — ' : '') + '준비 중인 기능이에요', 'info'); }
function copyToast(text, label) {
  try { navigator.clipboard && navigator.clipboard.writeText(text); } catch (e) {}
  showToast((label || '복사했어요') , 'success');
}

// Thin "endpoints" — in real code these become fetch() calls in studentApi.ts etc.
const mockApi = {
  teacherStudents: () => (typeof TEACHER_STUDENTS !== 'undefined' ? TEACHER_STUDENTS : []),
  studentDashboard: () => ({ greeting: '지훈', trialDaysLeft: 18, strategy: 'forming' }),
  notifications: () => (typeof STUDENT_NOTIFICATIONS !== 'undefined' ? STUDENT_NOTIFICATIONS : []),
  payments: () => [],
};

// ════════════════════════════════════════════════════════
// REAL fetch client skeleton — drop-in replacement for mockApi when backend is wired.
// In the real repo this becomes src/app/api/client.ts. The shape (auth header,
// 401-refresh, normalized ApiError) is what the screens already expect.
// ════════════════════════════════════════════════════════
class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message || code || 'API_ERROR');
    this.status = status; this.code = code; this.details = details;
  }
}

function makeApiClient({ baseURL, getToken, getRefreshToken, onTokens, onAuthExpired } = {}) {
  baseURL = baseURL || (typeof window !== 'undefined' && window.VITE_API_BASE_URL) || '/v1';
  let refreshing = null; // de-dupe concurrent refreshes

  async function rawFetch(path, opts, retry = true) {
    const token = getToken && getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    };
    let res;
    try {
      res = await fetch(baseURL + path, { credentials: 'include', ...opts, headers });
    } catch (e) {
      throw new ApiError(0, 'NETWORK_ERROR', '서버에 연결하지 못했어요'); // offline / DNS / CORS
    }

    // 401 → try one silent refresh, then replay; otherwise bubble to auth-expired
    if (res.status === 401 && retry && getRefreshToken && getRefreshToken()) {
      try {
        if (!refreshing) {
          refreshing = fetch(baseURL + '/auth/refresh', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: getRefreshToken() }),
          }).then(r => r.ok ? r.json() : Promise.reject(r)).finally(() => { refreshing = null; });
        }
        const tokens = await refreshing;
        onTokens && onTokens(tokens); // persist new access/refresh
        return rawFetch(path, opts, false); // replay original once
      } catch (e) {
        onAuthExpired && onAuthExpired();
        throw new ApiError(401, 'AUTH_EXPIRED', '세션이 만료됐어요. 다시 로그인해주세요.');
      }
    }

    if (res.status === 204) return null;
    let body = null;
    try { body = await res.json(); } catch (e) {}
    if (!res.ok) {
      // Backend should return { code, message, details }
      throw new ApiError(res.status, (body && body.code) || 'HTTP_' + res.status, (body && body.message) || '요청을 처리하지 못했어요', body && body.details);
    }
    return body;
  }

  const json = (path, method, payload) =>
    rawFetch(path, { method, body: payload != null ? JSON.stringify(payload) : undefined });

  return {
    get: (path) => rawFetch(path, { method: 'GET' }),
    post: (path, body) => json(path, 'POST', body),
    patch: (path, body) => json(path, 'PATCH', body),
    put: (path, body) => json(path, 'PUT', body),
    del: (path, body) => json(path, 'DELETE', body),
  };
}

// Example real-endpoint module (mirrors mockApi keys; swap useApi fetchers to these
// once VITE_API_BASE_URL points at the backend). Not used while SERVICE mock is on.
function makeApi(client) {
  return {
    teacherStudents: () => client.get('/teacher/students'),
    studentDashboard: () => client.get('/student/dashboard'),
    notifications: () => client.get('/notifications'),
    payments: () => client.get('/admin/payments'),
    // 입시/대학/학과 — 백엔드가 커리어넷·대학알리미 공시를 정규화해 제공 (응답은 { data, meta }).
    universities: (q = '') => client.get(`/admissions/universities?q=${encodeURIComponent(q)}`),
    universityDepartments: (id, opts = {}) =>
      client.get(`/admissions/universities/${id}/departments?${new URLSearchParams(opts).toString()}`),
    admissionsSearch: (q) => client.get(`/admissions/search?q=${encodeURIComponent(q)}`),
    // mutations carry the audit reason where required:
    adminDisableUser: (id, reason) => client.post(`/admin/users/${id}/disable`, { reason }),
  };
}

// ════════════════════════════════════════════════════════
// ENV CONFIG (mirrors src/app/api/env.ts in the real repo)
// ════════════════════════════════════════════════════════
const ENV = {
  API_BASE_URL: (typeof window !== 'undefined' && window.VITE_API_BASE_URL) || '/v1',
  APP_ENV: (typeof window !== 'undefined' && window.VITE_APP_ENV) || 'mock',
  // When true → screens read live HTTP via dataApi; when false → mock fixtures.
  USE_REAL_API: typeof window !== 'undefined' && window.VITE_APP_ENV && window.VITE_APP_ENV !== 'mock',
};

// Lazily-built real client (only constructed when USE_REAL_API).
let _realClient = null;
function realApi() {
  if (!_realClient) {
    const client = makeApiClient({
      baseURL: ENV.API_BASE_URL,
      getToken: () => { try { return localStorage.getItem('jinro:accessToken'); } catch (e) { return null; } },
      getRefreshToken: () => { try { return localStorage.getItem('jinro:refreshToken'); } catch (e) { return null; } },
      onTokens: (t) => { try { t && t.accessToken && localStorage.setItem('jinro:accessToken', t.accessToken); t && t.refreshToken && localStorage.setItem('jinro:refreshToken', t.refreshToken); } catch (e) {} },
      onAuthExpired: () => { try { window.location.hash = ''; } catch (e) {} },
    });
    _realClient = makeApi(client);
  }
  return _realClient;
}

// SINGLE data facade the screens import. Swaps mock↔real by env, so a screen's
// `useApi(() => dataApi.studentDashboard())` never changes when the backend lands.
const dataApi = new Proxy({}, {
  get(_t, key) {
    return (...args) => (ENV.USE_REAL_API ? realApi()[key](...args) : Promise.resolve(mockApi[key] ? mockApi[key](...args) : null));
  },
});

// ════════════════════════════════════════════════════════
// 전역 인증 fetch — 모든 화면이 공유. 401 시 1회 silent refresh 후 재시도.
// 실 배포 기준: 토큰 만료(15분)에도 화면이 안 끊기도록.
// ════════════════════════════════════════════════════════
(function setupGlobalApiFetch() {
  const base = ENV.API_BASE_URL;
  const getTok = () => { try { return localStorage.getItem('jinro:accessToken'); } catch (e) { return null; } };
  const getRef = () => { try { return localStorage.getItem('jinro:refreshToken'); } catch (e) { return null; } };
  const setTok = (a, r) => { try { if (a) localStorage.setItem('jinro:accessToken', a); if (r) localStorage.setItem('jinro:refreshToken', r); } catch (e) {} };
  const clearTok = () => { try { localStorage.removeItem('jinro:accessToken'); localStorage.removeItem('jinro:refreshToken'); } catch (e) {} };
  let refreshing = null;

  async function doRefresh() {
    const rt = getRef();
    if (!rt) throw new Error('no-refresh');
    if (!refreshing) {
      refreshing = fetch(base + '/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: rt }) })
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .finally(() => { refreshing = null; });
    }
    const t = await refreshing;
    setTok(t.accessToken, t.refreshToken);
    return t.accessToken;
  }

  // JSON 요청 (자동 토큰 갱신). 반환: 파싱된 JSON. 실패 시 throw {status, body}.
  window.__apiFetch = async function (path, opts, _retry) {
    opts = opts || {};
    const token = getTok();
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}, token ? { Authorization: 'Bearer ' + token } : {});
    let res;
    try { res = await fetch(base + path, Object.assign({}, opts, { headers })); }
    catch (e) { throw { status: 0, body: { message: '서버에 연결하지 못했어요' } }; }
    if (res.status === 401 && !_retry && getRef()) {
      try { await doRefresh(); return window.__apiFetch(path, opts, true); }
      catch (e) { clearTok(); throw { status: 401, body: { message: '세션이 만료됐어요. 다시 로그인해주세요.' } }; }
    }
    if (res.status === 204) return null;
    let body = null; try { body = await res.json(); } catch (e) {}
    if (!res.ok) throw { status: res.status, body: body || {} };
    return body;
  };

  // SSE 스트리밍 POST (자동 토큰 갱신). cb: {onToken, onDone, onError}
  window.__apiStream = async function (path, payload, cb, _retry) {
    const token = getTok();
    let res;
    try {
      res = await fetch(base + path, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json', Accept: 'text/event-stream' }, token ? { Authorization: 'Bearer ' + token } : {}),
        body: JSON.stringify(payload),
      });
    } catch (e) { cb.onError && cb.onError('NETWORK', '서버에 연결하지 못했어요'); return; }
    if (res.status === 401 && !_retry && getRef()) {
      try { await doRefresh(); return window.__apiStream(path, payload, cb, true); }
      catch (e) { clearTok(); cb.onError && cb.onError('AUTH', '세션이 만료됐어요. 다시 로그인해주세요.'); return; }
    }
    if (!res.ok || !res.body) {
      let m = '응답을 받지 못했어요'; try { const j = await res.json(); m = j.message || m; } catch (e) {}
      cb.onError && cb.onError('HTTP_' + res.status, m); return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const frame = buf.slice(0, idx); buf = buf.slice(idx + 2);
        if (frame.startsWith(':')) continue;
        let event = 'message'; const dataLines = [];
        for (const line of frame.split('\n')) {
          if (line.startsWith('event: ')) event = line.slice(7);
          else if (line.startsWith('data: ')) dataLines.push(line.slice(6));
        }
        let data = null; try { data = JSON.parse(dataLines.join('\n')); } catch (e) {}
        if (event === 'token') cb.onToken && cb.onToken((data && data.delta) || '');
        else if (event === 'done') cb.onDone && cb.onDone(data);
        else if (event === 'error') cb.onError && cb.onError((data && data.code) || 'ERR', (data && data.message) || '오류가 발생했어요');
      }
    }
  };

  window.__isLoggedIn = () => !!getTok();
})();

function useApi(fetcher, deps = [], opts = {}) {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });
  const load = React.useCallback(() => {
    const mode = window.__API_MODE;
    setState({ loading: true, error: null, data: null });
    if (mode === 'loading') return undefined; // stays in loading forever (to inspect skeletons)
    const delay = mode === 'slow' ? 2400 : 500 + Math.random() * 400;
    const t = setTimeout(() => {
      if (mode === 'error') {
        setState({ loading: false, error: { message: '서버에 연결하지 못했어요', code: 'NETWORK_ERROR' }, data: null });
        return;
      }
      if (mode === 'empty') {
        setState({ loading: false, error: null, data: opts.emptyValue !== undefined ? opts.emptyValue : [] });
        return;
      }
      Promise.resolve(fetcher())
        .then(d => setState({ loading: false, error: null, data: d }))
        .catch(err => setState({ loading: false, error: { message: err.message || '오류', code: 'UNKNOWN' }, data: null }));
    }, delay);
    return () => clearTimeout(t);
  }, deps); // eslint-disable-line
  React.useEffect(() => { const c = load(); return c; }, [load]);
  React.useEffect(() => {
    const fn = () => load();
    _apiListeners.add(fn);
    return () => _apiListeners.delete(fn);
  }, [load]);
  const isEmpty = !state.loading && !state.error && Array.isArray(state.data) && state.data.length === 0;
  return { ...state, isEmpty, refetch: load };
}

// ════════════════════════════════════════════════════════
// 3. Auth + Subscription context (session lives in ONE place)
// ════════════════════════════════════════════════════════
const AuthContext = React.createContext(null);

function AuthProvider({ role = 'student', children }) {
  const [user] = React.useState(() => ({
    student: { id: 'u_jihoon', name: '김지훈', role: 'student', classroom: '한빛고 2-3' },
    teacher: { id: 'u_jiwon', name: '이지원', role: 'teacher', classroom: '한빛고 2-3' },
    admin:   { id: 'u_root', name: '관리자', role: 'admin', classroom: null },
  }[role] || null));
  const subscription = {
    status: window.SERVICE_FREE_MODE ? 'free_launch' : 'trialing',
    trialDaysLeft: 18,
    plan: role === 'teacher' ? 'teacher' : 'student',
  };
  return <AuthContext.Provider value={{ user, subscription }}>{children}</AuthContext.Provider>;
}
function useAuth() { return React.useContext(AuthContext) || { user: null, subscription: null }; }
function useSubscription() { return useAuth().subscription; }

// ════════════════════════════════════════════════════════
// 4. Generic async boundary — wraps a list/section in loading/error/empty
// ════════════════════════════════════════════════════════
function AsyncBoundary({ query, skeleton, empty, children }) {
  if (query.loading) return skeleton || (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 4 }}>
      {[0,1,2,3].map(i => <Skeleton key={i} height={64} radius={12}/>)}
    </div>
  );
  if (query.error) return <ErrorState title="불러오지 못했어요" body={query.error.message} onRetry={query.refetch}/>;
  if (query.isEmpty) return empty || <EmptyState icon={<IcInfo size={24}/>} title="데이터가 없어요" body="표시할 항목이 아직 없어요."/>;
  return children(query.data);
}

// ════════════════════════════════════════════════════════
// 5. DevToolbar + LiveRunner
// ════════════════════════════════════════════════════════
const ALL_LIVE_ROLES = [
  { id: 'auth-mobile',    label: '앱 로그인/가입', mobile: true, set: 'app', render: () => <MobileAuthApp onEnter={() => {}}/> },
  { id: 'auth-web',       label: '웹 로그인', mobile: false, set: 'web', render: () => <WebAuthScreen/> },
  { id: 'student-mobile', label: '학생 · 앱', mobile: true,  set: 'app', render: () => <StudentApp/> },
  { id: 'student-web',    label: '학생 · 웹', mobile: false, set: 'web', render: () => <StudentWebApp/> },
  { id: 'teacher-web',    label: '교사 · 웹', mobile: false, set: 'web', render: () => <TeacherApp/> },
  { id: 'teacher-mobile', label: '교사 · 앱', mobile: true,  set: 'app', render: () => <TeacherMobileFullApp/> },
  { id: 'admin',          label: '관리자',    mobile: false, set: 'web', render: () => <AdminApp/> },
];
// __ROLE_SET = 'web' | 'app' filters the toolbar (used by web/ and app/ split builds).
const LIVE_ROLES = (typeof window !== 'undefined' && window.__ROLE_SET)
  ? ALL_LIVE_ROLES.filter(r => r.set === window.__ROLE_SET)
  : ALL_LIVE_ROLES;

const API_MODES = [
  { id: 'normal', label: '정상', tone: 'success' },
  { id: 'slow', label: '느림', tone: 'warning' },
  { id: 'loading', label: '로딩', tone: 'info' },
  { id: 'error', label: '에러', tone: 'danger' },
  { id: 'empty', label: '빈 데이터', tone: 'neutral' },
];

const VIEWPORTS = [
  { id: 0, label: '전체' },
  { id: 360, label: '360' },
  { id: 390, label: '390' },
  { id: 768, label: '768' },
  { id: 1024, label: '1024' },
  { id: 1440, label: '1440' },
];

// 소셜 로그인 콜백 토큰 수신 — /v1/auth/{provider}/callback 이 #oauth=<base64url(JSON)> 로 리다이렉트.
function ingestOAuthHash() {
  try {
    const h = window.location.hash || '';
    if (h.indexOf('#oauth=') === 0) {
      let b = h.slice('#oauth='.length).replace(/-/g, '+').replace(/_/g, '/');
      b += '='.repeat((4 - (b.length % 4)) % 4);
      const data = JSON.parse(decodeURIComponent(escape(atob(b))));
      if (data && data.accessToken) {
        localStorage.setItem('jinro:accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('jinro:refreshToken', data.refreshToken);
        // 소셜 신규 가입자 → 온보딩(이름/학년/약관) 플래그. 기존 사용자는 바로 로그인.
        if (data.needsProfile) {
          try { localStorage.setItem('jinro:onboard', JSON.stringify({ name: data.name || '' })); } catch (e) {}
        }
        const role = data.role === 'teacher' ? 'teacher-web' : data.role === 'admin' ? 'admin' : 'student-web';
        window.location.hash = role;
        return role;
      }
    } else if (h.indexOf('#oauth_error=') === 0) {
      const msg = decodeURIComponent(h.slice('#oauth_error='.length));
      window.location.hash = '';
      setTimeout(() => { try { (window.showToast || window.alert)(msg, 'error'); } catch (e) { window.alert(msg); } }, 400);
    }
  } catch (e) { /* ignore */ }
  return null;
}

// 액세스 토큰(JWT)에서 role 클레임만 디코드 — 라우팅 가드용(보안은 서버가 강제).
function tokenRole() {
  try {
    const t = localStorage.getItem('jinro:accessToken');
    if (!t) return null;
    const p = t.split('.')[1];
    if (!p) return null;
    let b = p.replace(/-/g, '+').replace(/_/g, '/');
    b += '='.repeat((4 - (b.length % 4)) % 4);
    const payload = JSON.parse(decodeURIComponent(escape(atob(b))));
    return (payload && payload.role) || null;
  } catch (e) { return null; }
}

// 뷰포트가 좁은지(폰) 추적 — 리사이즈 시 갱신. 반응형 셸 전환에 사용.
function useViewportMobile(bp = 768) {
  const [m, setM] = React.useState(() => { try { return window.innerWidth < bp; } catch (e) { return false; } });
  React.useEffect(() => {
    const on = () => { try { setM(window.innerWidth < bp); } catch (e) {} };
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [bp]);
  return m;
}

function LiveRunner() {
  const initialRole = (() => {
    const fromOAuth = ingestOAuthHash();
    if (fromOAuth) return fromOAuth;
    const h = (window.location.hash || '').replace(/^#/, '').split('/')[0];
    const authRole = (LIVE_ROLES.find(r => /^auth/.test(r.id)) || LIVE_ROLES[0] || {}).id;
    if (LIVE_ROLES.find(r => r.id === h)) {
      // 보호된 역할(학생/교사/관리자)은 "그 역할의 유효한 토큰"이 있어야 진입.
      // 토큰이 없거나 역할이 안 맞으면(예: 학생이 /admin 진입) → 로그인 화면으로.
      const isProtected = !/^auth/.test(h);
      if (isProtected) {
        const tr = tokenRole(); // 'admin' | 'teacher' | 'student' | null
        const ok = !!tr && (
          (h === 'admin' && tr === 'admin') ||
          ((h === 'teacher-web' || h === 'teacher-mobile') && tr === 'teacher') ||
          ((h === 'student-web' || h === 'student-mobile') && tr === 'student')
        );
        if (!ok) return authRole;
      }
      return h;
    }
    return LIVE_ROLES[0] ? LIVE_ROLES[0].id : 'student-mobile';
  })();
  const [role, setRole] = React.useState(initialRole);
  const roleCfg = LIVE_ROLES.find(r => r.id === role) || { mobile: true, render: () => null };
  const [width, setWidth] = React.useState(roleCfg.mobile ? 390 : 0);
  const [apiMode, setApiModeState] = React.useState(window.__API_MODE);
  const [remount, setRemount] = React.useState(0);
  const isMobile = useViewportMobile();
  // 좁은 화면(폰)에서는 데스크톱 웹 셸 대신 폰 최적화 셸을 렌더 (반응형).
  const mobileSwap = isMobile && (role === 'student-web' || role === 'teacher-web');

  React.useEffect(() => { window.__ACTIVE_ROLE = role; }, [role]);

  // 실 로그인/가입 성공 시 화면 전환용 — AuthScreen에서 호출 (window.__navTo('student-web'))
  React.useEffect(() => {
    window.__navTo = (id) => {
      if (LIVE_ROLES.find(r => r.id === id)) {
        window.location.hash = id;
        setRole(id);
        setRemount(n => n + 1);
      }
    };
    return () => { try { delete window.__navTo; } catch (e) {} };
  }, []);

  // Auth completion → go straight to the role's dashboard.
  // First login shows the translucent arrow coachmark tour (no full-screen onboarding gate).
  const [onbRole, setOnbRole] = React.useState('student');
  const handleAuthComplete = (r) => {
    const mobileId = r === 'teacher' ? 'teacher-mobile' : 'student-mobile';
    window.__ACTIVE_ROLE = mobileId;
    switchRole(mobileId);
    showToast('환영해요! 둘러보기를 시작할게요', 'success');
  };
  const finishOnboarding = () => {
    try { localStorage.setItem('jinro:onboarded:' + onbRole, '1'); } catch (e) {}
    switchRole(onbRole === 'teacher' ? 'teacher-mobile' : 'student-mobile');
  };

  const switchRole = (id) => {
    const cfg = LIVE_ROLES.find(r => r.id === id);
    setRole(id);
    setWidth(cfg.mobile ? 390 : 0);
    window.__ACTIVE_ROLE = id;
    // restore that role's last screen into the hash
    try {
      const saved = localStorage.getItem('jinro:screen:' + id);
      window.history.replaceState(null, '', '#' + id + (saved ? '/' + encodeURIComponent(saved) : ''));
    } catch (e) {}
    setRemount(n => n + 1);
  };
  const changeApi = (m) => { setApiMode(m); setApiModeState(m); };
  const resetState = () => {
    try {
      LIVE_ROLES.forEach(r => localStorage.removeItem('jinro:screen:' + r.id));
      ['jinro:onboarded', 'jinro:tour', 'jinro:onboarded:student', 'jinro:onboarded:teacher', 'jinro:mtour:student', 'jinro:mtour:teacher', 'jinro:webtour:student', 'jinro:webtour:teacher'].forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    window.history.replaceState(null, '', '#' + role);
    setRemount(n => n + 1);
  };

  const frameStyle = width === 0
    ? { width: '100%', height: '100%' }
    : { width, height: '100%', boxShadow: '0 0 0 1px var(--line), 0 20px 48px rgba(17,24,39,0.14)', borderRadius: roleCfg.mobile ? 0 : 0 };

  // 배포에서는 검은 LIVE 토글바 숨김 — window.__SHOW_DEV_BAR=true 일 때만 노출
  const showDevBar = typeof window !== 'undefined' && window.__SHOW_DEV_BAR === true;
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#E9ECEF' }}>
      {/* DEV TOOLBAR — production 숨김 */}
      {showDevBar && <div style={{
        flexShrink: 0, background: '#101727', color: '#fff',
        padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 14,
        flexWrap: 'wrap', fontSize: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, letterSpacing: '-0.3px' }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--brand-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcCompass size={12} color="#fff"/>
          </span>
          진로나침반 <span style={{ color: '#7AB4FF' }}>LIVE</span>
        </div>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }}/>

        {/* Role switch */}
        <div style={{ display: 'flex', gap: 4 }}>
          {LIVE_ROLES.map(r => (
            <button key={r.id} onClick={() => switchRole(r.id)} style={{
              padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: role === r.id ? 700 : 500,
              background: role === r.id ? 'var(--brand-500)' : 'rgba(255,255,255,0.08)',
              color: role === r.id ? '#fff' : '#CBD5E1',
            }}>{r.label}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }}/>

        {/* Viewport width */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#94A3B8', marginRight: 2 }}>너비</span>
          {VIEWPORTS.map(v => (
            <button key={v.id} onClick={() => setWidth(v.id)} style={{
              padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: width === v.id ? 700 : 500,
              background: width === v.id ? '#fff' : 'rgba(255,255,255,0.08)',
              color: width === v.id ? '#101727' : '#CBD5E1',
            }}>{v.label}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }}/>

        {/* API state */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#94A3B8', marginRight: 2 }}>API</span>
          {API_MODES.map(m => (
            <button key={m.id} onClick={() => changeApi(m.id)} style={{
              padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: apiMode === m.id ? 700 : 500,
              background: apiMode === m.id ? `var(--${m.tone === 'neutral' ? 'fg-subtle' : m.tone})` : 'rgba(255,255,255,0.08)',
              color: apiMode === m.id ? '#fff' : '#CBD5E1',
            }}>{m.label}</button>
          ))}
        </div>

        <div style={{ flex: 1 }}/>
        <button onClick={resetState} style={{
          padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
          fontSize: 11, fontWeight: 600, background: 'transparent', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <IcRefresh size={12}/> 상태 초기화
        </button>
      </div>}

      {/* APP MOUNT */}
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'stretch', padding: width === 0 ? 0 : '16px 0' }}>
        <div key={role + ':' + remount} style={{ ...frameStyle, ...(mobileSwap ? { maxWidth: 480, width: '100%' } : {}), background: 'var(--bg-canvas)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AuthProvider role={role.startsWith('teacher') ? 'teacher' : role === 'admin' ? 'admin' : 'student'}>
            {role === 'auth-mobile'
              ? <MobileAuthApp onEnter={handleAuthComplete}/>
              : role === 'onboarding'
                ? <OnboardingFlow role={onbRole} onFinish={finishOnboarding}/>
                : (mobileSwap && role === 'student-web' && typeof StudentApp === 'function')
                  ? <StudentApp/>
                  : (mobileSwap && role === 'teacher-web' && typeof TeacherMobileFullApp === 'function')
                    ? <TeacherMobileFullApp/>
                    : roleCfg.render()}
          </AuthProvider>
        </div>
      </div>
      {/* 소셜 신규 가입자 온보딩 — 어떤 역할 셸로 진입하든 최상위에서 1회 표시.
          (jinro:onboard 플래그가 없으면 OAuthOnboarding가 스스로 null 반환) */}
      {typeof OAuthOnboarding === 'function' && <OAuthOnboarding/>}
    </div>
  );
}

// Sidebar user menu — profile + logout popover (web sidebars).
function SidebarUserMenu({ name, sub, avatar, onProfile }) {
  const [open, setOpen] = React.useState(false);
  const doLogout = () => {
    setOpen(false);
    try { window.dispatchEvent(new CustomEvent('jinro:logout')); } catch (e) {}
    showToast('로그아웃되었어요', 'info');
  };
  return (
    <div style={{ position: 'relative' }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={avatar} size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{sub}</div>
        </div>
        <button onClick={() => setOpen(o => !o)} aria-label="계정 메뉴" style={{ width: 28, height: 28, border: 'none', background: open ? 'var(--bg-muted)' : 'transparent', borderRadius: 8, cursor: 'pointer', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcMoreV size={16}/>
        </button>
      </div>
      {open && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', right: 0, left: 0, zIndex: 41, background: 'var(--bg-elevated)', borderRadius: 12, boxShadow: 'var(--shadow-pop)', overflow: 'hidden', padding: 4, animation: 'sheetIn 180ms var(--ease-toss)' }}>
          {onProfile && (
            <button onClick={() => { setOpen(false); onProfile(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'left' }}>
              <IcUser size={16} color="var(--fg-muted)"/>내 정보
            </button>
          )}
          <button onClick={() => { setOpen(false); showToast('설정은 준비 중이에요', 'info'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'left' }}>
            <IcSettings size={16} color="var(--fg-muted)"/>설정
          </button>
          <div style={{ height: 1, background: 'var(--line-subtle)', margin: '4px 0' }}/>
          <button onClick={doLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--danger)', textAlign: 'left' }}>
            <IcLogout size={16}/>로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  usePersistentScreen, useApi, setApiMode, mockApi, dataApi, ENV,
  ApiError, makeApiClient, makeApi,
  showToast, notReady, copyToast, SidebarUserMenu,
  AuthProvider, useAuth, useSubscription, AuthContext,
  AsyncBoundary, LiveRunner,
});
