function liveHashScreen(appKey) {
  try {
    const h = (window.location.hash || "").replace(/^#/, "");
    const [role, screen] = h.split("/");
    if (role === (window.__ACTIVE_ROLE || appKey) && screen) return decodeURIComponent(screen);
  } catch (e) {
  }
  return null;
}
function usePersistentScreen(appKey, initial) {
  const live = typeof window !== "undefined" && window.__LIVE_MODE;
  const [screen, setScreen] = React.useState(() => {
    if (!live) return initial;
    try {
      const fromHash = liveHashScreen(appKey);
      if (fromHash) return fromHash;
      const saved = localStorage.getItem("jinro:screen:" + appKey);
      return saved || initial;
    } catch (e) {
      return initial;
    }
  });
  const set = React.useCallback((s) => {
    setScreen(s);
    if (live) {
      try {
        localStorage.setItem("jinro:screen:" + appKey, s);
        const role = window.__ACTIVE_ROLE || appKey;
        window.history.replaceState(null, "", "#" + role + "/" + encodeURIComponent(s));
      } catch (e) {
      }
    }
  }, [appKey, live]);
  return [screen, set];
}
window.__API_MODE = window.__API_MODE || "normal";
const _apiListeners = /* @__PURE__ */ new Set();
function setApiMode(mode) {
  window.__API_MODE = mode;
  _apiListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
    }
  });
}
function showToast(message, tone = "info") {
  try {
    let host = document.getElementById("jinro-toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "jinro-toast-host";
      host.style.cssText = "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;";
      document.body.appendChild(host);
    }
    const bg = tone === "success" ? "#15803D" : tone === "danger" ? "#DC2626" : "#191F28";
    const el = document.createElement("div");
    el.style.cssText = `background:${bg};color:#fff;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;font-family:var(--font-sans);box-shadow:0 8px 24px rgba(17,24,39,0.18);opacity:0;transform:translateY(8px);transition:all .22s cubic-bezier(.32,.72,0,1);max-width:90vw;`;
    el.textContent = message;
    host.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 240);
    }, 2200);
  } catch (e) {
  }
}
function notReady(label) {
  showToast((label ? label + " \u2014 " : "") + "\uC900\uBE44 \uC911\uC778 \uAE30\uB2A5\uC774\uC5D0\uC694", "info");
}
function copyToast(text, label) {
  try {
    navigator.clipboard && navigator.clipboard.writeText(text);
  } catch (e) {
  }
  showToast(label || "\uBCF5\uC0AC\uD588\uC5B4\uC694", "success");
}
const mockApi = {
  teacherStudents: () => typeof TEACHER_STUDENTS !== "undefined" ? TEACHER_STUDENTS : [],
  studentDashboard: () => ({ greeting: "\uC9C0\uD6C8", trialDaysLeft: 18, strategy: "forming" }),
  notifications: () => typeof STUDENT_NOTIFICATIONS !== "undefined" ? STUDENT_NOTIFICATIONS : [],
  payments: () => []
};
class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message || code || "API_ERROR");
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
function makeApiClient({ baseURL, getToken, getRefreshToken, onTokens, onAuthExpired } = {}) {
  baseURL = baseURL || typeof window !== "undefined" && window.VITE_API_BASE_URL || "/v1";
  let refreshing = null;
  async function rawFetch(path, opts, retry = true) {
    const token = getToken && getToken();
    const headers = {
      "Content-Type": "application/json",
      ...opts.headers || {},
      ...token ? { Authorization: "Bearer " + token } : {}
    };
    let res;
    try {
      res = await fetch(baseURL + path, { credentials: "include", ...opts, headers });
    } catch (e) {
      throw new ApiError(0, "NETWORK_ERROR", "\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694");
    }
    if (res.status === 401 && retry && getRefreshToken && getRefreshToken()) {
      try {
        if (!refreshing) {
          refreshing = fetch(baseURL + "/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: getRefreshToken() })
          }).then((r) => r.ok ? r.json() : Promise.reject(r)).finally(() => {
            refreshing = null;
          });
        }
        const tokens = await refreshing;
        onTokens && onTokens(tokens);
        return rawFetch(path, opts, false);
      } catch (e) {
        onAuthExpired && onAuthExpired();
        throw new ApiError(401, "AUTH_EXPIRED", "\uC138\uC158\uC774 \uB9CC\uB8CC\uB410\uC5B4\uC694. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694.");
      }
    }
    if (res.status === 204) return null;
    let body = null;
    try {
      body = await res.json();
    } catch (e) {
    }
    if (!res.ok) {
      throw new ApiError(res.status, body && body.code || "HTTP_" + res.status, body && body.message || "\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", body && body.details);
    }
    return body;
  }
  const json = (path, method, payload) => rawFetch(path, { method, body: payload != null ? JSON.stringify(payload) : void 0 });
  return {
    get: (path) => rawFetch(path, { method: "GET" }),
    post: (path, body) => json(path, "POST", body),
    patch: (path, body) => json(path, "PATCH", body),
    put: (path, body) => json(path, "PUT", body),
    del: (path, body) => json(path, "DELETE", body)
  };
}
function makeApi(client) {
  return {
    teacherStudents: () => client.get("/teacher/students"),
    studentDashboard: () => client.get("/student/dashboard"),
    notifications: () => client.get("/notifications"),
    payments: () => client.get("/admin/payments"),
    // 입시/대학/학과 — 백엔드가 커리어넷·대학알리미 공시를 정규화해 제공 (응답은 { data, meta }).
    universities: (q = "") => client.get(`/admissions/universities?q=${encodeURIComponent(q)}`),
    universityDepartments: (id, opts = {}) => client.get(`/admissions/universities/${id}/departments?${new URLSearchParams(opts).toString()}`),
    admissionsSearch: (q) => client.get(`/admissions/search?q=${encodeURIComponent(q)}`),
    // mutations carry the audit reason where required:
    adminDisableUser: (id, reason) => client.post(`/admin/users/${id}/disable`, { reason })
  };
}
const ENV = {
  API_BASE_URL: typeof window !== "undefined" && window.VITE_API_BASE_URL || "/v1",
  APP_ENV: typeof window !== "undefined" && window.VITE_APP_ENV || "mock",
  // When true → screens read live HTTP via dataApi; when false → mock fixtures.
  USE_REAL_API: typeof window !== "undefined" && window.VITE_APP_ENV && window.VITE_APP_ENV !== "mock"
};
let _realClient = null;
function realApi() {
  if (!_realClient) {
    const client = makeApiClient({
      baseURL: ENV.API_BASE_URL,
      getToken: () => {
        try {
          return localStorage.getItem("jinro:accessToken");
        } catch (e) {
          return null;
        }
      },
      getRefreshToken: () => {
        try {
          return localStorage.getItem("jinro:refreshToken");
        } catch (e) {
          return null;
        }
      },
      onTokens: (t) => {
        try {
          t && t.accessToken && localStorage.setItem("jinro:accessToken", t.accessToken);
          t && t.refreshToken && localStorage.setItem("jinro:refreshToken", t.refreshToken);
        } catch (e) {
        }
      },
      onAuthExpired: () => {
        try {
          window.location.hash = "";
        } catch (e) {
        }
      }
    });
    _realClient = makeApi(client);
  }
  return _realClient;
}
const dataApi = new Proxy({}, {
  get(_t, key) {
    return (...args) => ENV.USE_REAL_API ? realApi()[key](...args) : Promise.resolve(mockApi[key] ? mockApi[key](...args) : null);
  }
});
(function setupGlobalApiFetch() {
  const base = ENV.API_BASE_URL;
  const getTok = () => {
    try {
      return localStorage.getItem("jinro:accessToken");
    } catch (e) {
      return null;
    }
  };
  const getRef = () => {
    try {
      return localStorage.getItem("jinro:refreshToken");
    } catch (e) {
      return null;
    }
  };
  const setTok = (a, r) => {
    try {
      if (a) localStorage.setItem("jinro:accessToken", a);
      if (r) localStorage.setItem("jinro:refreshToken", r);
    } catch (e) {
    }
  };
  const clearTok = () => {
    try {
      localStorage.removeItem("jinro:accessToken");
      localStorage.removeItem("jinro:refreshToken");
    } catch (e) {
    }
  };
  let refreshing = null;
  async function doRefresh() {
    const rt = getRef();
    if (!rt) throw new Error("no-refresh");
    if (!refreshing) {
      refreshing = fetch(base + "/auth/refresh", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refreshToken: rt }) }).then((r) => r.ok ? r.json() : Promise.reject(r)).finally(() => {
        refreshing = null;
      });
    }
    const t = await refreshing;
    setTok(t.accessToken, t.refreshToken);
    return t.accessToken;
  }
  window.__apiFetch = async function(path, opts, _retry) {
    opts = opts || {};
    const token = getTok();
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {}, token ? { Authorization: "Bearer " + token } : {});
    let res;
    try {
      res = await fetch(base + path, Object.assign({}, opts, { headers }));
    } catch (e) {
      throw { status: 0, body: { message: "\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694" } };
    }
    if (res.status === 401 && !_retry && getRef()) {
      try {
        await doRefresh();
        return window.__apiFetch(path, opts, true);
      } catch (e) {
        clearTok();
        throw { status: 401, body: { message: "\uC138\uC158\uC774 \uB9CC\uB8CC\uB410\uC5B4\uC694. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694." } };
      }
    }
    if (res.status === 204) return null;
    let body = null;
    try {
      body = await res.json();
    } catch (e) {
    }
    if (!res.ok) throw { status: res.status, body: body || {} };
    return body;
  };
  window.__apiStream = async function(path, payload, cb, _retry) {
    const token = getTok();
    let res;
    try {
      res = await fetch(base + path, {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json", Accept: "text/event-stream" }, token ? { Authorization: "Bearer " + token } : {}),
        body: JSON.stringify(payload)
      });
    } catch (e) {
      cb.onError && cb.onError("NETWORK", "\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694");
      return;
    }
    if (res.status === 401 && !_retry && getRef()) {
      try {
        await doRefresh();
        return window.__apiStream(path, payload, cb, true);
      } catch (e) {
        clearTok();
        cb.onError && cb.onError("AUTH", "\uC138\uC158\uC774 \uB9CC\uB8CC\uB410\uC5B4\uC694. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694.");
        return;
      }
    }
    if (!res.ok || !res.body) {
      let m = "\uC751\uB2F5\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694";
      try {
        const j = await res.json();
        m = j.message || m;
      } catch (e) {
      }
      cb.onError && cb.onError("HTTP_" + res.status, m);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let gotToken = false, doneSeen = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n\n")) >= 0) {
          const frame = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          if (frame.startsWith(":")) continue;
          let event = "message";
          const dataLines = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event: ")) event = line.slice(7);
            else if (line.startsWith("data: ")) dataLines.push(line.slice(6));
          }
          let data = null;
          try {
            data = JSON.parse(dataLines.join("\n"));
          } catch (e) {
          }
          if (event === "token") {
            gotToken = true;
            cb.onToken && cb.onToken(data && data.delta || "");
          } else if (event === "done") {
            doneSeen = true;
            cb.onDone && cb.onDone(data);
          } else if (event === "error") cb.onError && cb.onError(data && data.code || "ERR", data && data.message || "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694");
        }
      }
    } catch (e) {
      if (!gotToken && !doneSeen) {
        cb.onError && cb.onError("STREAM_INTERRUPTED", "\uC751\uB2F5\uC774 \uC7A0\uC2DC \uB04A\uACBC\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
        return;
      }
    }
    if (gotToken && !doneSeen) cb.onDone && cb.onDone(null);
  };
  window.__isLoggedIn = () => !!getTok();
})();
function useApi(fetcher, deps = [], opts = {}) {
  const [state, setState] = React.useState({ loading: true, error: null, data: null });
  const load = React.useCallback(() => {
    const mode = window.__API_MODE;
    setState({ loading: true, error: null, data: null });
    if (mode === "loading") return void 0;
    const delay = mode === "slow" ? 2400 : 500 + Math.random() * 400;
    const t = setTimeout(() => {
      if (mode === "error") {
        setState({ loading: false, error: { message: "\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", code: "NETWORK_ERROR" }, data: null });
        return;
      }
      if (mode === "empty") {
        setState({ loading: false, error: null, data: opts.emptyValue !== void 0 ? opts.emptyValue : [] });
        return;
      }
      Promise.resolve(fetcher()).then((d) => setState({ loading: false, error: null, data: d })).catch((err) => setState({ loading: false, error: { message: err.message || "\uC624\uB958", code: "UNKNOWN" }, data: null }));
    }, delay);
    return () => clearTimeout(t);
  }, deps);
  React.useEffect(() => {
    const c = load();
    return c;
  }, [load]);
  React.useEffect(() => {
    const fn = () => load();
    _apiListeners.add(fn);
    return () => _apiListeners.delete(fn);
  }, [load]);
  const isEmpty = !state.loading && !state.error && Array.isArray(state.data) && state.data.length === 0;
  return { ...state, isEmpty, refetch: load };
}
const AuthContext = React.createContext(null);
function AuthProvider({ role = "student", children }) {
  const [user] = React.useState(() => ({
    student: { id: "u_jihoon", name: "\uAE40\uC9C0\uD6C8", role: "student", classroom: "\uD55C\uBE5B\uACE0 2-3" },
    teacher: { id: "u_jiwon", name: "\uC774\uC9C0\uC6D0", role: "teacher", classroom: "\uD55C\uBE5B\uACE0 2-3" },
    admin: { id: "u_root", name: "\uAD00\uB9AC\uC790", role: "admin", classroom: null }
  })[role] || null);
  const subscription = {
    status: window.SERVICE_FREE_MODE ? "free_launch" : "trialing",
    trialDaysLeft: 18,
    plan: role === "teacher" ? "teacher" : "student"
  };
  return /* @__PURE__ */ React.createElement(AuthContext.Provider, { value: { user, subscription } }, children);
}
function useAuth() {
  return React.useContext(AuthContext) || { user: null, subscription: null };
}
function useSubscription() {
  return useAuth().subscription;
}
function AsyncBoundary({ query, skeleton, empty, children }) {
  if (query.loading) return skeleton || /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, padding: 4 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 64, radius: 12 })));
  if (query.error) return /* @__PURE__ */ React.createElement(ErrorState, { title: "\uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: query.error.message, onRetry: query.refetch });
  if (query.isEmpty) return empty || /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcInfo, { size: 24 }), title: "\uB370\uC774\uD130\uAC00 \uC5C6\uC5B4\uC694", body: "\uD45C\uC2DC\uD560 \uD56D\uBAA9\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694." });
  return children(query.data);
}
const ALL_LIVE_ROLES = [
  { id: "auth-mobile", label: "\uC571 \uB85C\uADF8\uC778/\uAC00\uC785", mobile: true, set: "app", render: () => /* @__PURE__ */ React.createElement(MobileAuthApp, { onEnter: () => {
  } }) },
  { id: "auth-web", label: "\uC6F9 \uB85C\uADF8\uC778", mobile: false, set: "web", render: () => /* @__PURE__ */ React.createElement(WebAuthScreen, null) },
  { id: "student-mobile", label: "\uD559\uC0DD \xB7 \uC571", mobile: true, set: "app", render: () => /* @__PURE__ */ React.createElement(StudentApp, null) },
  { id: "student-web", label: "\uD559\uC0DD \xB7 \uC6F9", mobile: false, set: "web", render: () => /* @__PURE__ */ React.createElement(StudentWebApp, null) },
  { id: "teacher-web", label: "\uAD50\uC0AC \xB7 \uC6F9", mobile: false, set: "web", render: () => /* @__PURE__ */ React.createElement(TeacherApp, null) },
  { id: "teacher-mobile", label: "\uAD50\uC0AC \xB7 \uC571", mobile: true, set: "app", render: () => /* @__PURE__ */ React.createElement(TeacherMobileFullApp, null) },
  { id: "admin", label: "\uAD00\uB9AC\uC790", mobile: false, set: "web", render: () => /* @__PURE__ */ React.createElement(AdminApp, null) }
];
const LIVE_ROLES = typeof window !== "undefined" && window.__ROLE_SET ? ALL_LIVE_ROLES.filter((r) => r.set === window.__ROLE_SET) : ALL_LIVE_ROLES;
const API_MODES = [
  { id: "normal", label: "\uC815\uC0C1", tone: "success" },
  { id: "slow", label: "\uB290\uB9BC", tone: "warning" },
  { id: "loading", label: "\uB85C\uB529", tone: "info" },
  { id: "error", label: "\uC5D0\uB7EC", tone: "danger" },
  { id: "empty", label: "\uBE48 \uB370\uC774\uD130", tone: "neutral" }
];
const VIEWPORTS = [
  { id: 0, label: "\uC804\uCCB4" },
  { id: 360, label: "360" },
  { id: 390, label: "390" },
  { id: 768, label: "768" },
  { id: 1024, label: "1024" },
  { id: 1440, label: "1440" }
];
function ingestOAuthHash() {
  try {
    const h = window.location.hash || "";
    if (h.indexOf("#oauth=") === 0) {
      let b = h.slice("#oauth=".length).replace(/-/g, "+").replace(/_/g, "/");
      b += "=".repeat((4 - b.length % 4) % 4);
      const data = JSON.parse(decodeURIComponent(escape(atob(b))));
      if (data && data.accessToken) {
        localStorage.setItem("jinro:accessToken", data.accessToken);
        if (data.refreshToken) localStorage.setItem("jinro:refreshToken", data.refreshToken);
        if (data.needsProfile) {
          try {
            localStorage.setItem("jinro:onboard", JSON.stringify({ name: data.name || "" }));
          } catch (e) {
          }
        }
        const role = data.role === "teacher" ? "teacher-web" : data.role === "admin" ? "admin" : "student-web";
        window.location.hash = role;
        return role;
      }
    } else if (h.indexOf("#oauth_error=") === 0) {
      const msg = decodeURIComponent(h.slice("#oauth_error=".length));
      window.location.hash = "";
      setTimeout(() => {
        try {
          (window.showToast || window.alert)(msg, "error");
        } catch (e) {
          window.alert(msg);
        }
      }, 400);
    }
  } catch (e) {
  }
  return null;
}
function tokenRole() {
  try {
    const t = localStorage.getItem("jinro:accessToken");
    if (!t) return null;
    const p = t.split(".")[1];
    if (!p) return null;
    let b = p.replace(/-/g, "+").replace(/_/g, "/");
    b += "=".repeat((4 - b.length % 4) % 4);
    const payload = JSON.parse(decodeURIComponent(escape(atob(b))));
    return payload && payload.role || null;
  } catch (e) {
    return null;
  }
}
function useViewportMobile(bp = 768) {
  const [m, setM] = React.useState(() => {
    try {
      return window.innerWidth < bp;
    } catch (e) {
      return false;
    }
  });
  React.useEffect(() => {
    const on = () => {
      try {
        setM(window.innerWidth < bp);
      } catch (e) {
      }
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}
function MobileTopBar({ title, onMenu, right }) {
  return /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, height: 52, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", position: "relative", zIndex: 30 } }, /* @__PURE__ */ React.createElement("button", { onClick: onMenu, "aria-label": "\uBA54\uB274 \uC5F4\uAE30", style: { width: 40, height: 40, border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-block", width: 18, height: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, top: 0, width: "100%", height: 2, background: "var(--fg-strong)", borderRadius: 2 } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, top: 6, width: "100%", height: 2, background: "var(--fg-strong)", borderRadius: 2 } }), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, top: 12, width: "100%", height: 2, background: "var(--fg-strong)", borderRadius: 2 } }))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 800, color: "var(--fg-strong)" } }, title), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), right);
}
function SidebarDrawer({ open, onClose, children }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, open && /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.45)", zIndex: 199 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, height: "100%", zIndex: 200, transform: open ? "translateX(0)" : "translateX(-105%)", transition: "transform .26s var(--ease-toss, ease)", boxShadow: open ? "0 0 40px rgba(0,0,0,0.3)" : "none" } }, children));
}
function LiveRunner() {
  const initialRole = (() => {
    const fromOAuth = ingestOAuthHash();
    if (fromOAuth) return fromOAuth;
    const h = (window.location.hash || "").replace(/^#/, "").split("/")[0];
    const authRole = (LIVE_ROLES.find((r) => /^auth/.test(r.id)) || LIVE_ROLES[0] || {}).id;
    if (LIVE_ROLES.find((r) => r.id === h)) {
      const isProtected = !/^auth/.test(h);
      if (isProtected) {
        const tr = tokenRole();
        const ok = !!tr && (h === "admin" && tr === "admin" || (h === "teacher-web" || h === "teacher-mobile") && tr === "teacher" || (h === "student-web" || h === "student-mobile") && tr === "student");
        if (!ok) return authRole;
      }
      return h;
    }
    return LIVE_ROLES[0] ? LIVE_ROLES[0].id : "student-mobile";
  })();
  const [role, setRole] = React.useState(initialRole);
  const roleCfg = LIVE_ROLES.find((r) => r.id === role) || { mobile: true, render: () => null };
  const [width, setWidth] = React.useState(roleCfg.mobile ? 390 : 0);
  const [apiMode, setApiModeState] = React.useState(window.__API_MODE);
  const [remount, setRemount] = React.useState(0);
  React.useEffect(() => {
    window.__ACTIVE_ROLE = role;
  }, [role]);
  React.useEffect(() => {
    window.__navTo = (id) => {
      if (LIVE_ROLES.find((r) => r.id === id)) {
        window.location.hash = id;
        setRole(id);
        setRemount((n) => n + 1);
      }
    };
    return () => {
      try {
        delete window.__navTo;
      } catch (e) {
      }
    };
  }, []);
  React.useEffect(() => {
    const onLogout = async () => {
      try {
        if (typeof window.__apiFetch === "function") {
          await window.__apiFetch("/auth/logout", { method: "POST" });
        }
      } catch (e) {
      }
      try {
        localStorage.removeItem("jinro:accessToken");
        localStorage.removeItem("jinro:refreshToken");
        localStorage.removeItem("jinro:onboard");
      } catch (e) {
      }
      const authRole = (LIVE_ROLES.find((r) => /^auth/.test(r.id)) || LIVE_ROLES[0] || {}).id;
      try {
        window.location.hash = "";
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch (e) {
      }
      window.__ACTIVE_ROLE = authRole;
      setRole(authRole);
      setWidth((LIVE_ROLES.find((r) => r.id === authRole) || {}).mobile ? 390 : 0);
      setRemount((n) => n + 1);
    };
    window.addEventListener("jinro:logout", onLogout);
    return () => window.removeEventListener("jinro:logout", onLogout);
  }, []);
  const [onbRole, setOnbRole] = React.useState("student");
  const handleAuthComplete = (r) => {
    const mobileId = r === "teacher" ? "teacher-mobile" : "student-mobile";
    window.__ACTIVE_ROLE = mobileId;
    switchRole(mobileId);
    showToast("\uD658\uC601\uD574\uC694! \uB458\uB7EC\uBCF4\uAE30\uB97C \uC2DC\uC791\uD560\uAC8C\uC694", "success");
  };
  const finishOnboarding = () => {
    try {
      localStorage.setItem("jinro:onboarded:" + onbRole, "1");
    } catch (e) {
    }
    switchRole(onbRole === "teacher" ? "teacher-mobile" : "student-mobile");
  };
  const switchRole = (id) => {
    const cfg = LIVE_ROLES.find((r) => r.id === id);
    setRole(id);
    setWidth(cfg.mobile ? 390 : 0);
    window.__ACTIVE_ROLE = id;
    try {
      const saved = localStorage.getItem("jinro:screen:" + id);
      window.history.replaceState(null, "", "#" + id + (saved ? "/" + encodeURIComponent(saved) : ""));
    } catch (e) {
    }
    setRemount((n) => n + 1);
  };
  const changeApi = (m) => {
    setApiMode(m);
    setApiModeState(m);
  };
  const resetState = () => {
    try {
      LIVE_ROLES.forEach((r) => localStorage.removeItem("jinro:screen:" + r.id));
      ["jinro:onboarded", "jinro:tour", "jinro:onboarded:student", "jinro:onboarded:teacher", "jinro:mtour:student", "jinro:mtour:teacher", "jinro:webtour:student", "jinro:webtour:teacher"].forEach((k) => localStorage.removeItem(k));
    } catch (e) {
    }
    window.history.replaceState(null, "", "#" + role);
    setRemount((n) => n + 1);
  };
  const frameStyle = width === 0 ? { width: "100%", height: "100%" } : { width, height: "100%", boxShadow: "0 0 0 1px var(--line), 0 20px 48px rgba(17,24,39,0.14)", borderRadius: roleCfg.mobile ? 0 : 0 };
  const showDevBar = typeof window !== "undefined" && window.__SHOW_DEV_BAR === true;
  return /* @__PURE__ */ React.createElement("div", { style: { height: "100dvh", display: "flex", flexDirection: "column", background: "#E9ECEF" } }, showDevBar && /* @__PURE__ */ React.createElement("div", { style: {
    flexShrink: 0,
    background: "#101727",
    color: "#fff",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    fontSize: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, fontWeight: 800, letterSpacing: "-0.3px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 18, height: 18, borderRadius: 5, background: "var(--brand-500)", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 12, color: "#fff" })), "\uC9C4\uB85C\uB098\uCE68\uBC18 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#7AB4FF" } }, "LIVE")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 18, background: "rgba(255,255,255,0.15)" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, LIVE_ROLES.map((r) => /* @__PURE__ */ React.createElement("button", { key: r.id, onClick: () => switchRole(r.id), style: {
    padding: "5px 10px",
    borderRadius: 7,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: role === r.id ? 700 : 500,
    background: role === r.id ? "var(--brand-500)" : "rgba(255,255,255,0.08)",
    color: role === r.id ? "#fff" : "#CBD5E1"
  } }, r.label))), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 18, background: "rgba(255,255,255,0.15)" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#94A3B8", marginRight: 2 } }, "\uB108\uBE44"), VIEWPORTS.map((v) => /* @__PURE__ */ React.createElement("button", { key: v.id, onClick: () => setWidth(v.id), style: {
    padding: "4px 8px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: width === v.id ? 700 : 500,
    background: width === v.id ? "#fff" : "rgba(255,255,255,0.08)",
    color: width === v.id ? "#101727" : "#CBD5E1"
  } }, v.label))), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 18, background: "rgba(255,255,255,0.15)" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#94A3B8", marginRight: 2 } }, "API"), API_MODES.map((m) => /* @__PURE__ */ React.createElement("button", { key: m.id, onClick: () => changeApi(m.id), style: {
    padding: "4px 8px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: apiMode === m.id ? 700 : 500,
    background: apiMode === m.id ? `var(--${m.tone === "neutral" ? "fg-subtle" : m.tone})` : "rgba(255,255,255,0.08)",
    color: apiMode === m.id ? "#fff" : "#CBD5E1"
  } }, m.label))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("button", { onClick: resetState, style: {
    padding: "5px 10px",
    borderRadius: 7,
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    background: "transparent",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 4
  } }, /* @__PURE__ */ React.createElement(IcRefresh, { size: 12 }), " \uC0C1\uD0DC \uCD08\uAE30\uD654")), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "stretch", padding: width === 0 ? 0 : "16px 0" } }, /* @__PURE__ */ React.createElement("div", { key: role + ":" + remount, style: { ...frameStyle, background: "var(--bg-canvas)", overflow: "hidden", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement(AuthProvider, { role: role.startsWith("teacher") ? "teacher" : role === "admin" ? "admin" : "student" }, role === "auth-mobile" ? /* @__PURE__ */ React.createElement(MobileAuthApp, { onEnter: handleAuthComplete }) : role === "onboarding" ? /* @__PURE__ */ React.createElement(OnboardingFlow, { role: onbRole, onFinish: finishOnboarding }) : roleCfg.render()))), typeof OAuthOnboarding === "function" && /* @__PURE__ */ React.createElement(OAuthOnboarding, null));
}
function SidebarUserMenu({ name, sub, avatar, onProfile }) {
  const [open, setOpen] = React.useState(false);
  const doLogout = () => {
    setOpen(false);
    try {
      window.dispatchEvent(new CustomEvent("jinro:logout"));
    } catch (e) {
    }
    showToast("\uB85C\uADF8\uC544\uC6C3\uB418\uC5C8\uC5B4\uC694", "info");
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, open && /* @__PURE__ */ React.createElement("div", { onClick: () => setOpen(false), style: { position: "fixed", inset: 0, zIndex: 40 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: avatar, size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, sub)), /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((o) => !o), "aria-label": "\uACC4\uC815 \uBA54\uB274", style: { width: 28, height: 28, border: "none", background: open ? "var(--bg-muted)" : "transparent", borderRadius: 8, cursor: "pointer", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcMoreV, { size: 16 }))), open && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: "calc(100% + 6px)", right: 0, left: 0, zIndex: 41, background: "var(--bg-elevated)", borderRadius: 12, boxShadow: "var(--shadow-pop)", overflow: "hidden", padding: 4, animation: "sheetIn 180ms var(--ease-toss)" } }, onProfile && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setOpen(false);
    onProfile();
  }, style: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--fg-default)", textAlign: "left" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 16, color: "var(--fg-muted)" }), "\uB0B4 \uC815\uBCF4"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setOpen(false);
    showToast("\uC124\uC815\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694", "info");
  }, style: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--fg-default)", textAlign: "left" } }, /* @__PURE__ */ React.createElement(IcSettings, { size: 16, color: "var(--fg-muted)" }), "\uC124\uC815"), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "var(--line-subtle)", margin: "4px 0" } }), /* @__PURE__ */ React.createElement("button", { onClick: doLogout, style: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "var(--danger)", textAlign: "left" } }, /* @__PURE__ */ React.createElement(IcLogout, { size: 16 }), "\uB85C\uADF8\uC544\uC6C3")));
}
Object.assign(window, {
  usePersistentScreen,
  useApi,
  setApiMode,
  mockApi,
  dataApi,
  ENV,
  ApiError,
  makeApiClient,
  makeApi,
  showToast,
  notReady,
  copyToast,
  SidebarUserMenu,
  AuthProvider,
  useAuth,
  useSubscription,
  AuthContext,
  AsyncBoundary,
  LiveRunner
});
