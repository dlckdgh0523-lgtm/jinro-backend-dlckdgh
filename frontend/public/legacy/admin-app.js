const ADMIN_NAV = [
  { section: "\uC6B4\uC601", items: [
    { id: "dashboard", label: "\uB300\uC2DC\uBCF4\uB4DC", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
    { id: "users", label: "\uC0AC\uC6A9\uC790", icon: /* @__PURE__ */ React.createElement(IcUsers, null) },
    { id: "teachers", label: "\uAD50\uC0AC", icon: /* @__PURE__ */ React.createElement(IcGraduation, null) },
    { id: "students", label: "\uD559\uC0DD", icon: /* @__PURE__ */ React.createElement(IcUser, null) },
    { id: "classrooms", label: "\uD559\uAE09", icon: /* @__PURE__ */ React.createElement(IcSchool, null) }
  ] },
  { section: "\uACB0\uC81C \xB7 AI", items: [
    { id: "subscriptions", label: "\uAD6C\uB3C5", icon: /* @__PURE__ */ React.createElement(IcStar, null) },
    { id: "payments", label: "\uACB0\uC81C", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null) },
    { id: "ai-usage", label: "AI \uC0AC\uC6A9\uB7C9", icon: /* @__PURE__ */ React.createElement(IcSparkles, null) },
    { id: "counseling", label: "\uC0C1\uB2F4 \uC138\uC158", icon: /* @__PURE__ */ React.createElement(IcMessage, null) }
  ] },
  { section: "\uC18C\uD1B5", items: [
    { id: "announcements", label: "\uACF5\uC9C0\uC0AC\uD56D", icon: /* @__PURE__ */ React.createElement(IcBell, null) },
    { id: "suggestions", label: "\uAC74\uC758\uC0AC\uD56D", icon: /* @__PURE__ */ React.createElement(IcMessage, null) }
  ] },
  { section: "\uC2DC\uC2A4\uD15C", items: [
    { id: "notifications", label: "\uC54C\uB9BC \uC774\uBCA4\uD2B8", icon: /* @__PURE__ */ React.createElement(IcBell, null) },
    { id: "audit-logs", label: "\uAC10\uC0AC \uB85C\uADF8", icon: /* @__PURE__ */ React.createElement(IcDoc, null) },
    { id: "system", label: "\uC2DC\uC2A4\uD15C \uC0C1\uD0DC", icon: /* @__PURE__ */ React.createElement(IcServer, null) }
  ] }
];
function adminFetch(path) {
  if (typeof window !== "undefined" && window.__apiFetch) return window.__apiFetch(path, { method: "GET" });
  return Promise.reject(new Error("no api"));
}
function fmtDate(d) {
  if (!d) return "\u2014";
  try {
    const t = new Date(d);
    if (!isNaN(t)) return t.toISOString().slice(0, 10);
  } catch (e) {
  }
  return String(d);
}
function fmtDateTime(d) {
  if (!d) return "\u2014";
  try {
    const t = new Date(d);
    if (!isNaN(t)) return t.toISOString().slice(0, 16).replace("T", " ");
  } catch (e) {
  }
  return String(d);
}
const planChip = (p) => ({
  trial: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uCCB4\uD5D8\uC911"),
  active: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uACB0\uC81C\uC911"),
  past_due: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC5F0\uCCB4"),
  canceled: /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uD574\uC9C0"),
  expired: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", size: "sm" }, "\uB9CC\uB8CC")
})[p];
const statusChip = (s) => ({
  active: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, "\uD65C\uC131"),
  disabled: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, "\uBE44\uD65C\uC131")
})[s];
const roleChip = (r) => ({
  student: /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uD559\uC0DD"),
  teacher: /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm" }, "\uAD50\uC0AC"),
  admin: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uAD00\uB9AC\uC790")
})[r];
function auditActionMeta(action) {
  return {
    "user.disable": { label: "\uACC4\uC815 \uBE44\uD65C\uC131\uD654", tone: "danger" },
    "user.enable": { label: "\uACC4\uC815 \uD65C\uC131\uD654", tone: "success" },
    "user.create": { label: "\uACC4\uC815 \uC0DD\uC131", tone: "brand" }
  }[action] || { label: action || "\u2014", tone: "neutral" };
}
function AuditMiniList({ rows }) {
  if (rows === null) return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 32 })));
  if (!rows.length) return /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 22 }), title: "\uAE30\uB85D\uB41C \uAC10\uC0AC \uB85C\uADF8\uAC00 \uC5C6\uC5B4\uC694", body: "\uAD00\uB9AC\uC790\uAC00 \uACC4\uC815\uC744 \uC870\uCE58\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, rows.map((a, i) => {
    const meta = auditActionMeta(a.action);
    return /* @__PURE__ */ React.createElement("div", { key: a.id || i, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement(Chip, { tone: meta.tone, size: "sm" }, meta.label), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, fontSize: 12, color: "var(--fg-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, a.summary), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-subtle)" } }, fmtDateTime(a.createdAt)));
  }));
}
function AdminSidebar({ activeId, onChange }) {
  const [ok, setOk] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch("/admin/system/health");
        const svc = res && res.data && res.data.services || {};
        const allOk = ["api", "db", "redis", "sse"].every((k) => !svc[k] || svc[k].status === "ok");
        if (alive) setOk(allOk);
      } catch (e) {
        if (alive) setOk(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const health = ok === null ? { bg: "rgba(148,163,184,0.15)", fg: "#94A3B8", dot: "#94A3B8", label: "\uC0C1\uD0DC \uD655\uC778 \uC911\u2026" } : ok ? { bg: "rgba(34,197,94,0.12)", fg: "#86EFAC", dot: "#22C55E", label: "\uBAA8\uB4E0 \uC2DC\uC2A4\uD15C \uC815\uC0C1" } : { bg: "rgba(245,158,11,0.14)", fg: "#FCD34D", dot: "#F59E0B", label: "\uC810\uAC80 \uD544\uC694" };
  return /* @__PURE__ */ React.createElement("aside", { style: {
    width: 240,
    flexShrink: 0,
    background: "#101727",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px 16px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "0 8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16, color: "#fff" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700 } }, "\uC9C4\uB85C\uB098\uCE68\uBC18"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#94A3B8" } }, "Super Admin"))), /* @__PURE__ */ React.createElement("nav", { style: { display: "flex", flexDirection: "column", gap: 16, overflow: "auto" }, className: "toss-scroll" }, ADMIN_NAV.map((group) => /* @__PURE__ */ React.createElement("div", { key: group.section }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, padding: "0 12px 6px" } }, group.section), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 1 } }, group.items.map((it) => {
    const active = activeId === it.id;
    return /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => onChange(it.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      border: "none",
      borderRadius: 8,
      background: active ? "rgba(49,130,246,0.18)" : "transparent",
      color: active ? "#7AB4FF" : "#CBD5E1",
      fontSize: 13,
      fontWeight: active ? 600 : 500,
      cursor: "pointer",
      textAlign: "left",
      width: "100%"
    } }, React.cloneElement(it.icon, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, it.label));
  }))))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("div", { style: {
    padding: 10,
    background: health.bg,
    borderRadius: 8,
    fontSize: 11,
    color: health.fg,
    display: "flex",
    alignItems: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: health.dot } }), health.label));
}
function AdminTopbar({ title, subtitle, action }) {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await adminFetch("/auth/me");
        if (alive) setMe(r && r.data || r || {});
      } catch (e) {
        if (alive) setMe({});
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const adminName = me && me.name || "\uAD00\uB9AC\uC790";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)"
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, subtitle)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, action, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    background: "var(--bg-muted)",
    borderRadius: 10,
    fontSize: 12,
    color: "var(--fg-muted)"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: adminName[0], size: 22 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: "var(--fg-strong)" } }, adminName))));
}
function AdminDashboard({ go }) {
  const [stats, setStats] = React.useState(null);
  const [recent, setRecent] = React.useState(null);
  const [audit, setAudit] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch("/admin/stats");
        if (alive) setStats(res && res.data || {});
      } catch (e) {
        if (alive) {
          setStats({});
          setErr(true);
        }
      }
    })();
    (async () => {
      try {
        const res = await adminFetch("/admin/ai-usage");
        if (alive) setRecent(res && res.data && res.data.recent || []);
      } catch (e) {
        if (alive) setRecent([]);
      }
    })();
    (async () => {
      try {
        const res = await adminFetch("/admin/audit-logs?limit=6");
        if (alive) setAudit(res && res.data || []);
      } catch (e) {
        if (alive) setAudit([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const loading = stats === null;
  const u = stats && stats.users || {};
  const ai = stats && stats.ai || {};
  const c = stats && stats.content || {};
  const n = (v) => (v == null ? 0 : v).toLocaleString();
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title: "\uC6B4\uC601 \uB300\uC2DC\uBCF4\uB4DC", subtitle: "\uC2E4\uC2DC\uAC04 \uC9D1\uACC4 \uAE30\uC900" }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 16 } }, [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 18 }, /* @__PURE__ */ React.createElement(Skeleton, { width: "60%", height: 12 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 24, style: { marginTop: 12 } })))) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uC0AC\uC6A9\uC790", value: n(u.total), icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD559\uC0DD", value: n(u.students), icon: /* @__PURE__ */ React.createElement(IcUser, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uAD50\uC0AC", value: n(u.teachers), icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "AI \uC138\uC158", value: n(ai.sessions), icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uB9AC\uD3EC\uD2B8", value: n(ai.reports), icon: /* @__PURE__ */ React.createElement(IcStar, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD559\uACFC \uB370\uC774\uD130", value: n(c.departments), icon: /* @__PURE__ */ React.createElement(IcServer, { size: 16 }) })), !loading && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD65C\uC131 \uC0AC\uC6A9\uC790", value: n(u.active), icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uBD09\uC0AC \uB370\uC774\uD130", value: n(c.volunteers), icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC7A5\uD559\uAE08 \uB370\uC774\uD130", value: n(c.scholarships), icon: /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD574\uC678\uB300\uD559 \uB370\uC774\uD130", value: n(c.foreignUniv), icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uCD5C\uADFC AI \uC0C1\uB2F4 \uC138\uC158",
      subtitle: "\uC138\uC158 \uBA54\uD0C0\uB370\uC774\uD130 (\uB0B4\uC6A9 \uBE44\uACF5\uAC1C)",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => go && go("ai-usage") }, "\uC804\uCCB4")
    },
    /* @__PURE__ */ React.createElement(RecentSessions, { recent, mini: true })
  ), /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uAC10\uC0AC \uB85C\uADF8",
      subtitle: "\uCD5C\uADFC \uAD00\uB9AC\uC790 \uC870\uCE58",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => go && go("audit-logs") }, "\uC804\uCCB4")
    },
    /* @__PURE__ */ React.createElement(AuditMiniList, { rows: audit })
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCF58\uD150\uCE20 \uB370\uC774\uD130", padding: 18 }, loading ? /* @__PURE__ */ React.createElement(Skeleton, { height: 120 }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [
    { label: "\uD559\uACFC", value: c.departments, icon: /* @__PURE__ */ React.createElement(IcServer, { size: 14 }) },
    { label: "\uC131\uC801 \uB808\uCF54\uB4DC", value: c.grades, icon: /* @__PURE__ */ React.createElement(IcStar, { size: 14 }) },
    { label: "\uBD09\uC0AC\uD65C\uB3D9", value: c.volunteers, icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 14 }) },
    { label: "\uC7A5\uD559\uAE08", value: c.scholarships, icon: /* @__PURE__ */ React.createElement(IcCreditCard, { size: 14 }) },
    { label: "\uD574\uC678\uB300\uD559", value: c.foreignUniv, icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 14 }) }
  ].map((s, i, arr) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, s.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13, fontWeight: 600, color: "var(--fg-strong)" } }, s.label), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontWeight: 700, color: "var(--fg-strong)" } }, n(s.value), "\uAC74"))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC0C1\uB2F4 \uC9D1\uACC4", padding: 18 }, loading ? /* @__PURE__ */ React.createElement(Skeleton, { height: 80 }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [
    { label: "\uCD1D \uC138\uC158", value: ai.sessions },
    { label: "\uCD1D \uBA54\uC2DC\uC9C0", value: ai.messages },
    { label: "\uC0DD\uC131\uB41C \uB9AC\uD3EC\uD2B8", value: ai.reports }
  ].map((s, i, arr) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)" } }, s.label), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontWeight: 700, color: "var(--fg-strong)" } }, n(s.value))))))))));
}
function RecentSessions({ recent, mini }) {
  if (recent === null) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 40 })));
  }
  if (!recent.length) {
    return /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: "\uCD5C\uADFC \uC0C1\uB2F4 \uC138\uC158\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." });
  }
  const items = mini ? recent.slice(0, 5) : recent;
  const sChip = (s) => ({
    active: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uC9C4\uD589"),
    completed: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC644\uB8CC"),
    report_ready: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uB9AC\uD3EC\uD2B8 \uC644\uB8CC")
  })[s] || /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s || "\u2014");
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, items.map((it, i) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement("div", { key: it.id || i, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < items.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (it.student || "?").slice(0, 1), size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, it.student || "\uC775\uBA85"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uBA54\uC2DC\uC9C0 ", (_a = it.messages) != null ? _a : 0, " \xB7 \uB2E8\uC11C ", (_b = it.signals) != null ? _b : 0)), sChip(it.status), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-subtle)", minWidth: 92, textAlign: "right" } }, fmtDateTime(it.startedAt)));
  }));
}
function AdminUsers() {
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [rows, setRows] = React.useState(null);
  const [total, setTotal] = React.useState(null);
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      if (role !== "all") params.set("role", role);
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "50");
      const res = await adminFetch("/admin/users?" + params.toString());
      const list2 = res && res.data || [];
      setRows(list2);
      setTotal(res && res.meta && res.meta.count != null ? res.meta.count : list2.length);
    } catch (e) {
      setRows([]);
      setTotal(0);
    }
  }, [q, role]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  const loading = rows === null;
  const list = rows || [];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: "\uC0AC\uC6A9\uC790",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `\uD604\uC7AC ${total != null ? total : list.length}\uAC74 \uD45C\uC2DC`,
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("\uC0AC\uC6A9\uC790 \uBAA9\uB85D", ["\uC774\uB984", "\uC774\uBA54\uC77C", "\uC5ED\uD560", "\uD559\uAD50", "\uD559\uAE09", "\uAC00\uC785\uC77C", "\uC0C1\uD0DC"], list.map((u) => [u.name, u.email, u.role, u.school || "", u.classroom || "", fmtDate(u.createdAt), u.status]), { "\uC5ED\uD560": role === "all" ? "\uC804\uCCB4" : role }) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: () => setAddOpen(true) }, "\uC0AC\uC6A9\uC790 \uCD94\uAC00"))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 24px 12px", display: "flex", gap: 12, alignItems: "center", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uC774\uB984, \uC774\uBA54\uC77C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { flex: 1, maxWidth: 320, height: 40 } }), /* @__PURE__ */ React.createElement(Tabs, { items: [
    { id: "all", label: "\uC804\uCCB4" },
    { id: "student", label: "\uD559\uC0DD" },
    { id: "teacher", label: "\uAD50\uC0AC" },
    { id: "admin", label: "\uAD00\uB9AC\uC790" }
  ], activeId: role, onChange: setRole })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "0 24px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { minWidth: 880 } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "2.2fr 1fr 1.4fr 1.2fr 1.2fr 1fr 36px",
    padding: "12px 20px",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--fg-muted)",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    borderBottom: "1px solid var(--line-subtle)"
  } }, /* @__PURE__ */ React.createElement("span", null, "\uC0AC\uC6A9\uC790"), /* @__PURE__ */ React.createElement("span", null, "\uC5ED\uD560"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAD50"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAE09"), /* @__PURE__ */ React.createElement("span", null, "\uAC00\uC785\uC77C"), /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("span", null)), loading ? [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: 32, height: 32, radius: 16 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 14 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 22 }), title: "\uD45C\uC2DC\uD560 \uC0AC\uC6A9\uC790\uAC00 \uC5C6\uC5B4\uC694", body: q.trim() ? "\uAC80\uC0C9 \uC870\uAC74\uC744 \uBC14\uAFD4\uBCF4\uC138\uC694." : "\uC544\uC9C1 \uAC00\uC785\uD55C \uC0AC\uC6A9\uC790\uAC00 \uC5C6\uC5B4\uC694." })) : list.map((u, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: u.id,
      onClick: () => setSelectedUser(u),
      style: {
        display: "grid",
        gridTemplateColumns: "2.2fr 1fr 1.4fr 1.2fr 1.2fr 1fr 36px",
        padding: "14px 20px",
        alignItems: "center",
        fontSize: 13,
        borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none",
        cursor: "pointer",
        transition: "background 120ms"
      },
      onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-muted)",
      onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (u.name || "?").slice(0, 1), size: 32 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, u.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, u.email))),
    /* @__PURE__ */ React.createElement("div", null, roleChip(u.role)),
    /* @__PURE__ */ React.createElement("div", { style: { color: "var(--fg-default)" } }, u.school || "\u2014"),
    /* @__PURE__ */ React.createElement("div", { style: { color: "var(--fg-default)" } }, u.classroom || "\u2014"),
    /* @__PURE__ */ React.createElement("div", { className: "num", style: { color: "var(--fg-muted)", fontSize: 12 } }, fmtDate(u.createdAt)),
    /* @__PURE__ */ React.createElement("div", null, statusChip(u.status)),
    /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" })
  )))), selectedUser && /* @__PURE__ */ React.createElement(UserDetailDrawer, { user: selectedUser, onClose: () => setSelectedUser(null), onChanged: load }), addOpen && /* @__PURE__ */ React.createElement(AddUserDialog, { onClose: () => setAddOpen(false), onChanged: load }));
}
function AddUserDialog({ onClose, onChanged }) {
  const [f, setF] = React.useState({ name: "", email: "", role: "student" });
  const [busy, setBusy] = React.useState(false);
  const [created, setCreated] = React.useState(null);
  const trapRef = useFocusTrap(true, onClose);
  const can = f.name.trim() && f.email.includes("@");
  const submit = async () => {
    if (!can || busy) return;
    setBusy(true);
    try {
      const res = await window.__apiFetch("/admin/users", { method: "POST", body: JSON.stringify({ name: f.name.trim(), email: f.email.trim(), role: f.role }) });
      setCreated(res && res.data || {});
      showToast("\uC0AC\uC6A9\uC790\uB97C \uC0DD\uC131\uD588\uC5B4\uC694", "success");
      onChanged && onChanged();
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uC0DD\uC131\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0AC\uC6A9\uC790 \uCD94\uAC00", style: { position: "relative", width: 420, maxWidth: "94%", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "\uC0AC\uC6A9\uC790 \uCD94\uAC00"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), created ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--success-bg)", color: "var(--success)", borderRadius: 10, fontSize: 13, marginBottom: 14, lineHeight: 1.6 } }, "\u2713 ", /* @__PURE__ */ React.createElement("b", null, created.name), " (", created.email, ") \uACC4\uC815\uC744 \uC0DD\uC131\uD588\uC5B4\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uC544\uB798 ", /* @__PURE__ */ React.createElement("b", null, "\uC784\uC2DC \uBE44\uBC00\uBC88\uD638"), "\uB97C \uBCF8\uC778\uC5D0\uAC8C \uC804\uB2EC\uD558\uC138\uC694. \uCCAB \uB85C\uADF8\uC778 \uD6C4 \uBCC0\uACBD\uC744 \uC548\uB0B4\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uC784\uC2DC \uBE44\uBC00\uBC88\uD638", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: created.tempPassword || "", onChange: () => {
  }, readOnly: true, style: { flex: 1, fontFamily: "monospace" } }), /* @__PURE__ */ React.createElement(Button, { variant: "outline", onClick: () => {
    try {
      navigator.clipboard.writeText(created.tempPassword || "");
      showToast("\uBCF5\uC0AC\uD588\uC5B4\uC694", "success");
    } catch (e) {
    }
  } }, "\uBCF5\uC0AC"))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: onClose }, "\uC644\uB8CC")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uB984", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: f.name, onChange: (v) => setF((s) => ({ ...s, name: v })), placeholder: "\uC608) \uAE40\uBBFC\uC9C0" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uBA54\uC77C", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: f.email, onChange: (v) => setF((s) => ({ ...s, email: v })), placeholder: "email@example.com", type: "email" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC5ED\uD560", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "student", label: "\uD559\uC0DD" }, { id: "teacher", label: "\uAD50\uC0AC" }, { id: "admin", label: "\uAD00\uB9AC\uC790" }], activeId: f.role, onChange: (v) => setF((s) => ({ ...s, role: v })) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !can || busy, onClick: submit }, busy ? "\uC0DD\uC131 \uC911\u2026" : "\uC0DD\uC131\uD558\uAE30")))));
}
function UserDetailDrawer({ user, onClose, onChanged }) {
  const [confirmDisable, setConfirmDisable] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const trapRef = useFocusTrap(true, onClose);
  const doAction = async (action) => {
    if (busy) return;
    setBusy(true);
    try {
      await window.__apiFetch(`/admin/users/${user.id}/${action}`, { method: "POST", body: JSON.stringify({ reason: reason.trim() || void 0 }) });
      showToast(action === "disable" ? "\uACC4\uC815\uC744 \uBE44\uD65C\uC131\uD654\uD588\uC5B4\uC694" : "\uACC4\uC815\uC744 \uD65C\uC131\uD654\uD588\uC5B4\uC694", "success");
      onChanged && onChanged();
      onClose();
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    } finally {
      setBusy(false);
      setConfirmDisable(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "flex-end"
  } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.4)", animation: "fadeIn 200ms" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": `${user.name} \uC0C1\uC138`, style: {
    position: "relative",
    width: 480,
    background: "var(--bg-elevated)",
    height: "100%",
    boxShadow: "var(--shadow-pop)",
    overflow: "auto",
    animation: "slideRight 280ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("style", null, `@keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`), /* @__PURE__ */ React.createElement("div", { style: { padding: 24, borderBottom: "1px solid var(--line-subtle)", display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (user.name || "?").slice(0, 1), size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)" } }, user.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", fontFamily: "monospace" } }, user.id), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 6 } }, roleChip(user.role), statusChip(user.status))), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose })), /* @__PURE__ */ React.createElement("div", { style: { padding: 24, display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uAE30\uBCF8 \uC815\uBCF4", padding: 18 }, /* @__PURE__ */ React.createElement(KVRow, { k: "\uC774\uBA54\uC77C", v: user.email }), /* @__PURE__ */ React.createElement(KVRow, { k: "\uAC00\uC785\uC77C", v: fmtDate(user.createdAt) }), /* @__PURE__ */ React.createElement(KVRow, { k: "\uD559\uAD50", v: user.school || "\u2014" }), /* @__PURE__ */ React.createElement(KVRow, { k: "\uD559\uAE09", v: user.classroom || "\u2014" }), user.grade != null && /* @__PURE__ */ React.createElement(KVRow, { k: "\uD559\uB144", v: String(user.grade) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACC4\uC815 \uC0C1\uD0DC \uAD00\uB9AC", padding: 18 }, /* @__PURE__ */ React.createElement(FormField, { label: "\uC0AC\uC720 (\uC120\uD0DD \xB7 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uAE30\uB85D)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: reason, onChange: setReason, placeholder: "\uC608) \uC57D\uAD00 \uC704\uBC18 \uC2E0\uACE0 \uC811\uC218" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, user.status === "disabled" ? /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, disabled: busy, onClick: () => doAction("enable"), leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }) }, busy ? "\uCC98\uB9AC \uC911\u2026" : "\uACC4\uC815 \uD65C\uC131\uD654") : /* @__PURE__ */ React.createElement(Button, { variant: "danger", size: "md", full: true, disabled: busy, onClick: () => setConfirmDisable(true), leading: /* @__PURE__ */ React.createElement(IcLock, { size: 14 }) }, "\uACC4\uC815 \uBE44\uD65C\uC131\uD654")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.5 }, className: "kr-heading" }, "\uC870\uCE58\uB294 \uC989\uC2DC \uC801\uC6A9\uB418\uBA70 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uAE30\uB85D\uB3FC\uC694. \uBCF8\uC778 \uACC4\uC815\uC740 \uBE44\uD65C\uC131\uD654\uD560 \uC218 \uC5C6\uC5B4\uC694.")))), /* @__PURE__ */ React.createElement(
    ConfirmDialog,
    {
      open: confirmDisable,
      title: `${user.name}\uB2D8\uC744 \uBE44\uD65C\uC131\uD654\uD560\uAE4C\uC694?`,
      body: "\uBE44\uD65C\uC131\uD654\uD558\uBA74 \uD574\uB2F9 \uC0AC\uC6A9\uC790\uB294 \uB85C\uADF8\uC778\uD560 \uC218 \uC5C6\uC5B4\uC694. \uC0AC\uC720\uB294 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uAE30\uB85D\uB429\uB2C8\uB2E4.",
      confirmLabel: busy ? "\uCC98\uB9AC \uC911\u2026" : "\uBE44\uD65C\uC131\uD654",
      cancelLabel: "\uCDE8\uC18C",
      danger: true,
      onConfirm: () => doAction("disable"),
      onCancel: () => setConfirmDisable(false)
    }
  ));
}
function KVRow({ k, v }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, k), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-strong)", fontWeight: 600 } }, v));
}
function AdminPayments() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title: "\uACB0\uC81C \uC774\uBCA4\uD2B8", subtitle: "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", padding: 24 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { width: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcCreditCard, { size: 24 }),
      title: "\uACB0\uC81C \uC5F0\uB3D9\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694",
      body: "\uD604\uC7AC\uB294 \uBB34\uB8CC \uCCB4\uD5D8 \uBAA8\uB4DC\uB85C \uC6B4\uC601\uB3FC\uC694. \uACB0\uC81C\xB7\uD658\uBD88\xB7Webhook \uB370\uC774\uD130\uB294 \uACB0\uC81C PG \uC5F0\uB3D9 \uD6C4 \uC81C\uACF5\uB429\uB2C8\uB2E4."
    }
  ))));
}
function AdminAuditLogs() {
  const [rows, setRows] = React.useState(null);
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const res = await adminFetch("/admin/audit-logs?limit=100");
      setRows(res && res.data || []);
    } catch (e) {
      setRows([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const loading = rows === null;
  const list = rows || [];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: "\uAC10\uC0AC \uB85C\uADF8",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `\uCD5C\uADFC ${list.length}\uAC74\uC758 \uAD00\uB9AC\uC790 \uC870\uCE58`,
      action: /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: load }, "\uC0C8\uB85C\uACE0\uCE68")
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { minWidth: 820 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "170px 120px 1.6fr 1.4fr", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("span", null, "\uC2DC\uAC01"), /* @__PURE__ */ React.createElement("span", null, "\uC870\uCE58"), /* @__PURE__ */ React.createElement("span", null, "\uB0B4\uC6A9"), /* @__PURE__ */ React.createElement("span", null, "\uC218\uD589\uC790 \xB7 \uC0AC\uC720")), loading ? [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: "55%", height: 14 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 22 }), title: "\uAE30\uB85D\uB41C \uAC10\uC0AC \uB85C\uADF8\uAC00 \uC5C6\uC5B4\uC694", body: "\uAD00\uB9AC\uC790\uAC00 \uACC4\uC815\uC744 \uBE44\uD65C\uC131\uD654\xB7\uD65C\uC131\uD654\xB7\uC0DD\uC131\uD558\uBA74 \uC0AC\uC720\uC640 \uD568\uAED8 \uC5EC\uAE30\uC5D0 \uAE30\uB85D\uB3FC\uC694." })) : list.map((a, i) => {
    const meta = auditActionMeta(a.action);
    return /* @__PURE__ */ React.createElement("div", { key: a.id || i, style: { display: "grid", gridTemplateColumns: "170px 120px 1.6fr 1.4fr", padding: "14px 20px", alignItems: "center", fontSize: 13, borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, color: "var(--fg-muted)" } }, fmtDateTime(a.createdAt)), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Chip, { tone: meta.tone, size: "sm" }, meta.label)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-strong)" }, className: "kr-heading" }, a.summary), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)", fontSize: 12 } }, a.actor, a.reason ? ` \xB7 ${a.reason}` : ""));
  }))));
}
function AdminSystem() {
  var _a, _b, _c, _d, _e;
  const [data, setData] = React.useState(null);
  const [err, setErr] = React.useState(false);
  const load = React.useCallback(async () => {
    setErr(false);
    setData(null);
    try {
      const res2 = await adminFetch("/admin/system/health");
      setData(res2 && res2.data || {});
    } catch (e) {
      setErr(true);
      setData({});
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const statusTone = (s) => s === "ok" ? "success" : s === "down" ? "danger" : s === "preparing" || s === "planned" ? "neutral" : "warning";
  const statusLabel = (s) => s === "ok" ? "OK" : s === "down" ? "\uB2E4\uC6B4" : s === "preparing" ? "\uC900\uBE44 \uC911" : s || "\u2014";
  if (data === null) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title: "\uC2DC\uC2A4\uD15C \uC0C1\uD0DC", subtitle: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 100, style: { marginBottom: 16 } }), /* @__PURE__ */ React.createElement(Skeleton, { height: 140, style: { marginBottom: 16 } }), /* @__PURE__ */ React.createElement(Skeleton, { height: 120 })));
  }
  if (err) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
      AdminTopbar,
      {
        title: "\uC2DC\uC2A4\uD15C \uC0C1\uD0DC",
        subtitle: "\uD655\uC778 \uBD88\uAC00",
        action: /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: load }, "\uC0C8\uB85C\uACE0\uCE68")
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", padding: 24 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { width: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      EmptyState,
      {
        icon: /* @__PURE__ */ React.createElement(IcServer, { size: 24 }),
        title: "\uC2DC\uC2A4\uD15C \uC0C1\uD0DC\uB97C \uD655\uC778\uD560 \uC218 \uC5C6\uC5B4\uC694",
        body: "\uD5EC\uC2A4 \uC5D4\uB4DC\uD3EC\uC778\uD2B8\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
        action: /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: load }, "\uB2E4\uC2DC \uC2DC\uB3C4")
      }
    ))));
  }
  const build = data.build || {};
  const svc = data.services || {};
  const res = data.resources || {};
  const ai = svc.aiProvider || {};
  const recentErrors = data.recentErrors || [];
  const recentDeploys = data.recentDeploys || [];
  const allOk = ["api", "db", "redis", "sse"].every((k) => !svc[k] || svc[k].status === "ok");
  const serviceCards = [
    svc.api && { name: "API \uC11C\uBC84", status: statusLabel(svc.api.status), detail: "\uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uC11C\uBC84", icon: /* @__PURE__ */ React.createElement(IcServer, null), tone: statusTone(svc.api.status) },
    svc.db && { name: "DB (PostgreSQL)", status: statusLabel(svc.db.status), detail: "Prisma \xB7 SELECT 1 \uD5EC\uC2A4\uCCB4\uD06C", icon: /* @__PURE__ */ React.createElement(IcDb, null), tone: statusTone(svc.db.status) },
    svc.redis && { name: "Redis", status: statusLabel(svc.redis.status), detail: "PING \uD5EC\uC2A4\uCCB4\uD06C", icon: /* @__PURE__ */ React.createElement(IcZap, null), tone: statusTone(svc.redis.status) },
    svc.queue && { name: "BullMQ Queue", status: statusLabel(svc.queue.status), detail: `\uB300\uAE30 ${(_a = svc.queue.pendingJobs) != null ? _a : 0} \xB7 \uC2E4\uD328 ${(_b = svc.queue.failedJobs) != null ? _b : 0}`, icon: /* @__PURE__ */ React.createElement(IcRefresh, null), tone: statusTone(svc.queue.status) },
    svc.sse && { name: "SSE", status: statusLabel(svc.sse.status), detail: "\uC2A4\uD2B8\uB9AC\uBC0D \uC5F0\uACB0", icon: /* @__PURE__ */ React.createElement(IcWifi, null), tone: statusTone(svc.sse.status) }
  ].filter(Boolean);
  const providerCards = [
    ai.primary && { name: "AI Provider", status: statusLabel(ai.primary.status), detail: `${ai.primary.name || "\u2014"}${ai.fallback ? " \xB7 fallback " + (ai.fallback.name || "") : ""}`, icon: /* @__PURE__ */ React.createElement(IcSparkles, null), tone: statusTone(ai.primary.status) },
    svc.paymentProvider && { name: "\uACB0\uC81C Provider", status: svc.paymentProvider.mode === "preparing" ? "\uC900\uBE44 \uC911" : statusLabel(svc.paymentProvider.status), detail: `${svc.paymentProvider.name || "none"}${svc.paymentProvider.mode ? " \xB7 " + svc.paymentProvider.mode : ""}`, icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), tone: svc.paymentProvider.mode === "preparing" ? "warning" : statusTone(svc.paymentProvider.status) },
    svc.oauth && { name: "OAuth", status: "\u2014", detail: `Google ${statusLabel((svc.oauth.google || {}).status)} \xB7 \uCE74\uCE74\uC624 ${statusLabel((svc.oauth.kakao || {}).status)}`, icon: /* @__PURE__ */ React.createElement(IcGoogle, null), tone: "neutral" }
  ].filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: "\uC2DC\uC2A4\uD15C \uC0C1\uD0DC",
      subtitle: "\uBC30\uD3EC \uD658\uACBD \xB7 \uC11C\uBE44\uC2A4 \xB7 \uC678\uBD80 \uC758\uC874\uC131 \xB7 \uB9AC\uC18C\uC2A4",
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: load }, "\uC0C8\uB85C\uACE0\uCE68"), /* @__PURE__ */ React.createElement(Chip, { tone: allOk ? "success" : "warning", size: "md", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, allOk ? "\uBAA8\uB4E0 \uC2DC\uC2A4\uD15C \uC815\uC0C1" : "\uC810\uAC80 \uD544\uC694"))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBC30\uD3EC / \uB7F0\uD0C0\uC784", subtitle: "\uD604\uC7AC \uB77C\uC774\uBE0C \uD658\uACBD", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 } }, /* @__PURE__ */ React.createElement(InfoTile, { label: "\uBC30\uD3EC \uBC84\uC804", value: build.version || "\u2014", tone: "success" }), /* @__PURE__ */ React.createElement(InfoTile, { label: "Git SHA", value: build.gitSha || "\u2014", mono: true }), /* @__PURE__ */ React.createElement(InfoTile, { label: "\uD658\uACBD", value: build.env || "\u2014" }), /* @__PURE__ */ React.createElement(InfoTile, { label: "Node \uBC84\uC804", value: build.nodeVersion || "\u2014", mono: true }), /* @__PURE__ */ React.createElement(InfoTile, { label: "Uptime", value: build.uptimeSec != null ? `${Math.floor(build.uptimeSec / 3600)}h ${Math.floor(build.uptimeSec % 3600 / 60)}m` : "\u2014", sub: build.region ? `region ${build.region}` : "" }))), serviceCards.length > 0 && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC11C\uBE44\uC2A4 \uC0C1\uD0DC", subtitle: "API \xB7 DB \xB7 Redis \xB7 Queue \xB7 SSE", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, serviceCards.map((s, i) => /* @__PURE__ */ React.createElement(ServiceCard, { key: i, ...s })))), providerCards.length > 0 && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC678\uBD80 Provider", subtitle: "AI \xB7 \uACB0\uC81C \xB7 OAuth", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, providerCards.map((s, i) => /* @__PURE__ */ React.createElement(ServiceCard, { key: i, ...s })))), res.memory && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB9AC\uC18C\uC2A4 \uC0AC\uC6A9\uB7C9", subtitle: "\uD504\uB85C\uC138\uC2A4", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 } }, /* @__PURE__ */ React.createElement(InfoTile, { label: "RSS \uBA54\uBAA8\uB9AC", value: `${(_c = res.memory.usedMB) != null ? _c : 0} MB` }), /* @__PURE__ */ React.createElement(InfoTile, { label: "Heap \uC0AC\uC6A9\uB7C9", value: `${(_d = res.memory.heapMB) != null ? _d : 0} MB` }), /* @__PURE__ */ React.createElement(InfoTile, { label: "CPU \uCF54\uC5B4", value: String((_e = res.cpu && res.cpu.cores) != null ? _e : "\u2014") }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD5C\uADFC \uC624\uB958", subtitle: "\uCD5C\uADFC 24\uC2DC\uAC04", style: { marginBottom: 16 } }, recentErrors.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcServer, { size: 22 }), title: "\uAE30\uB85D\uB41C \uC624\uB958\uAC00 \uC5C6\uC5B4\uC694", body: "\uCD5C\uADFC \uC624\uB958 \uC9D1\uACC4 \uB370\uC774\uD130\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, recentErrors.map((e, i, arr) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "60px 160px 1fr 80px", padding: "12px 0", alignItems: "center", fontSize: 12, borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none", gap: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: e.level === "error" ? "danger" : "warning", size: "sm" }, e.level || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700, color: "var(--fg-strong)" } }, e.code || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-default)" }, className: "kr-heading" }, e.msg || ""), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontWeight: 700, color: "var(--fg-strong)" } }, e.count != null ? `${e.count}\uD68C` : ""))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD5C\uADFC \uBC30\uD3EC \uAE30\uB85D", style: { marginBottom: 16 } }, recentDeploys.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcServer, { size: 22 }), title: "\uBC30\uD3EC \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694", body: "\uBC30\uD3EC \uC774\uB825 \uC9D1\uACC4 \uB370\uC774\uD130\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694." }) : recentDeploys.map((d, i, arr) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "12px 0", display: "flex", alignItems: "center", gap: 16, borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontFamily: "monospace", fontWeight: 700, color: "var(--brand-600)", fontSize: 13, minWidth: 70 } }, d.v || d.version || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11, color: "var(--fg-muted)", background: "var(--bg-muted)", padding: "2px 6px", borderRadius: 4, minWidth: 70 } }, d.sha || d.gitSha || ""), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-strong)", flex: 1 }, className: "kr-heading" }, d.what || d.message || ""), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-subtle)" } }, fmtDateTime(d.when || d.at)))))));
}
function InfoTile({ label, value, sub, mono, tone }) {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 } }, label), /* @__PURE__ */ React.createElement("div", { className: "num", style: {
    fontSize: 17,
    fontWeight: 800,
    color: tone === "success" ? "var(--success)" : "var(--fg-strong)",
    fontFamily: mono ? "monospace" : "inherit"
  } }, value), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4 } }, sub));
}
function ServiceCard({ name, status, detail, icon, tone }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: `var(--${tone}-bg)`, color: `var(--${tone === "neutral" ? "fg-muted" : tone})`, display: "flex", alignItems: "center", justifyContent: "center" } }, React.cloneElement(icon, { size: 16 })), /* @__PURE__ */ React.createElement(Chip, { tone, size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, status)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 }, className: "kr-heading" }, detail));
}
function ResourceGauge({ label, value, max = 100, unit, detail }) {
  const pct = Math.min(100, value / max * 100);
  const tone = pct > 80 ? "danger" : pct > 60 ? "warning" : "success";
  return /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-default)" } }, label), /* @__PURE__ */ React.createElement(Chip, { tone, size: "sm" }, tone === "danger" ? "\uB192\uC74C" : tone === "warning" ? "\uC8FC\uC758" : "\uC815\uC0C1")), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 24, fontWeight: 800, color: "var(--fg-strong)" } }, value, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)", fontWeight: 500 } }, unit || "")), /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden", marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${pct}%`, height: "100%", background: `var(--${tone})`, borderRadius: 999 } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 6 } }, detail));
}
function AdminPlaceholder({ title, subtitle }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title, subtitle }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { width: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 14, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 26 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC774 \uD654\uBA74\uC758 \uBCF8\uACA9\uC801 \uB514\uC790\uC778\uC740 \uBC31\uC5D4\uB4DC \uCEE8\uD2B8\uB799\uD2B8 \uD655\uC815 \uD6C4 \uC6B0\uC120\uC21C\uC704\uC5D0 \uB9DE\uCDB0 \uC9C4\uD589\uB429\uB2C8\uB2E4.", /* @__PURE__ */ React.createElement("br", null), "\uAD6C\uC870\uC640 \uAD8C\uD55C \uAC00\uB4DC\uB294 \uC774\uBBF8 \uB77C\uC6B0\uD2B8\uC5D0 \uBC18\uC601\uB3FC \uC788\uC5B4\uC694."))));
}
function AdminApp({ initialScreen = "dashboard" }) {
  const [screen, setScreen] = usePersistentScreen("admin", initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const wrapNav = (s) => {
    setScreen(s);
    setNavOpen(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: isMobile ? "column" : "row", height: "100%", position: "relative", overflow: "hidden" } }, isMobile && /* @__PURE__ */ React.createElement(MobileTopBar, { title: "\uC9C4\uB85C\uB098\uCE68\uBC18 \xB7 \uAD00\uB9AC\uC790", onMenu: () => setNavOpen(true) }), isMobile ? /* @__PURE__ */ React.createElement(SidebarDrawer, { open: navOpen, onClose: () => setNavOpen(false) }, /* @__PURE__ */ React.createElement(AdminSidebar, { activeId: screen, onChange: wrapNav })) : /* @__PURE__ */ React.createElement(AdminSidebar, { activeId: screen, onChange: setScreen }), /* @__PURE__ */ React.createElement("main", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, position: "relative", overflowY: "auto" } }, screen === "dashboard" && /* @__PURE__ */ React.createElement(AdminDashboard, { go: setScreen }), screen === "users" && /* @__PURE__ */ React.createElement(AdminUsers, null), screen === "payments" && /* @__PURE__ */ React.createElement(AdminPayments, null), screen === "audit-logs" && /* @__PURE__ */ React.createElement(AdminAuditLogs, null), screen === "system" && /* @__PURE__ */ React.createElement(AdminSystem, null), screen === "teachers" && /* @__PURE__ */ React.createElement(AdminTeachers, null), screen === "students" && /* @__PURE__ */ React.createElement(AdminStudents, null), screen === "classrooms" && /* @__PURE__ */ React.createElement(AdminClassrooms, null), screen === "subscriptions" && /* @__PURE__ */ React.createElement(AdminSubscriptions, null), screen === "ai-usage" && /* @__PURE__ */ React.createElement(AdminAIUsage, null), screen === "counseling" && /* @__PURE__ */ React.createElement(AdminCounseling, null), screen === "notifications" && /* @__PURE__ */ React.createElement(AdminNotifEvents, null), screen === "announcements" && /* @__PURE__ */ React.createElement(AdminAnnouncements, null), screen === "suggestions" && /* @__PURE__ */ React.createElement(AdminSuggestions, null)));
}
function AdminAnnouncements() {
  const [rows, setRows] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const res = await adminFetch("/announcements?limit=100");
      setRows(res && res.data || []);
    } catch (e) {
      setRows([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const del = async (id) => {
    try {
      await window.__apiFetch("/admin/announcements/" + id, { method: "DELETE" });
      showToast("\uACF5\uC9C0\uB97C \uC0AD\uC81C\uD588\uC5B4\uC694", "success");
      load();
    } catch (e) {
      showToast("\uC0AD\uC81C\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    }
  };
  const loading = rows === null;
  const list = rows || [];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: "\uACF5\uC9C0\uC0AC\uD56D",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `${list.length}\uAC74 \xB7 \uD559\uC0DD\xB7\uAD50\uC0AC\uC5D0\uAC8C \uB178\uCD9C`,
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: () => setAddOpen(true) }, "\uC0C8 \uACF5\uC9C0")
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement(Skeleton, { height: 100 }) : list.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 22 }), title: "\uB4F1\uB85D\uB41C \uACF5\uC9C0\uAC00 \uC5C6\uC5B4\uC694", body: "\uC0C8 \uACF5\uC9C0\uB97C \uC791\uC131\uD558\uBA74 \uD559\uC0DD\xB7\uAD50\uC0AC \uD654\uBA74\uC5D0 \uB178\uCD9C\uB3FC\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, list.map((a) => /* @__PURE__ */ React.createElement(Card, { key: a.id, padding: 18 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" } }, a.pinned && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uACE0\uC815"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, a.audience === "all" ? "\uC804\uCCB4" : a.audience === "student" ? "\uD559\uC0DD" : "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, a.title)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", whiteSpace: "pre-line", lineHeight: 1.6 }, className: "kr-heading" }, a.body), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8 } }, a.author, " \xB7 ", fmtDateTime(a.createdAt))), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => del(a.id) }, "\uC0AD\uC81C")))))), addOpen && /* @__PURE__ */ React.createElement(AnnouncementDialog, { onClose: () => setAddOpen(false), onSaved: () => {
    setAddOpen(false);
    load();
  } }));
}
function AnnouncementDialog({ onClose, onSaved }) {
  const [f, setF] = React.useState({ title: "", body: "", audience: "all", pinned: false });
  const [busy, setBusy] = React.useState(false);
  const trapRef = useFocusTrap(true, onClose);
  const can = f.title.trim() && f.body.trim();
  const submit = async () => {
    if (!can || busy) return;
    setBusy(true);
    try {
      await window.__apiFetch("/admin/announcements", { method: "POST", body: JSON.stringify({ title: f.title.trim(), body: f.body.trim(), audience: f.audience, pinned: f.pinned }) });
      showToast("\uACF5\uC9C0\uB97C \uB4F1\uB85D\uD588\uC5B4\uC694", "success");
      onSaved && onSaved();
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uB4F1\uB85D\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0C8 \uACF5\uC9C0", style: { position: "relative", width: 520, maxWidth: "94%", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "\uC0C8 \uACF5\uC9C0 \uC791\uC131"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC81C\uBAA9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: f.title, onChange: (v) => setF((s) => ({ ...s, title: v })), placeholder: "\uACF5\uC9C0 \uC81C\uBAA9" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uB0B4\uC6A9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Textarea, { value: f.body, onChange: (v) => setF((s) => ({ ...s, body: v })), rows: 6, placeholder: "\uACF5\uC9C0 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uB300\uC0C1", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "all", label: "\uC804\uCCB4" }, { id: "student", label: "\uD559\uC0DD" }, { id: "teacher", label: "\uAD50\uC0AC" }], activeId: f.audience, onChange: (v) => setF((s) => ({ ...s, audience: v })) })), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: f.pinned, onChange: (e) => setF((s) => ({ ...s, pinned: e.target.checked })), style: { width: 16, height: 16, accentColor: "var(--brand-500)" } }), "\uC0C1\uB2E8 \uACE0\uC815"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !can || busy, onClick: submit }, busy ? "\uB4F1\uB85D \uC911\u2026" : "\uB4F1\uB85D"))));
}
function AdminSuggestions() {
  const [rows, setRows] = React.useState(null);
  const [filter, setFilter] = React.useState("all");
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const res = await adminFetch("/admin/suggestions?limit=200");
      setRows(res && res.data || []);
    } catch (e) {
      setRows([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const setStatus = async (id, status) => {
    try {
      await window.__apiFetch("/admin/suggestions/" + id, { method: "PATCH", body: JSON.stringify({ status }) });
      load();
    } catch (e) {
      showToast("\uBCC0\uACBD\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    }
  };
  const loading = rows === null;
  const list = (rows || []).filter((s) => filter === "all" || s.status === filter);
  const sChip = (s) => ({ open: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uC811\uC218"), reviewed: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uAC80\uD1A0\uC911"), resolved: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC644\uB8CC") })[s] || /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: "\uAC74\uC758\uC0AC\uD56D",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `${list.length}\uAC74`,
      action: /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: load }, "\uC0C8\uB85C\uACE0\uCE68")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 24px 8px", display: "flex", gap: 8, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "all", label: "\uC804\uCCB4" }, { id: "open", label: "\uC811\uC218" }, { id: "reviewed", label: "\uAC80\uD1A0\uC911" }, { id: "resolved", label: "\uC644\uB8CC" }], activeId: filter, onChange: setFilter })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "8px 24px 24px", background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement(Skeleton, { height: 100 }) : list.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: "\uAC74\uC758\uC0AC\uD56D\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\xB7\uAD50\uC0AC\uAC00 '\uAC74\uC758\uD558\uAE30'\uB85C \uBCF4\uB0B4\uBA74 \uC5EC\uAE30\uC5D0 \uBAA8\uC5EC\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, list.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.id, padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s.category), sChip(s.status), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, s.author, " (", s.role === "teacher" ? "\uAD50\uC0AC" : s.role === "admin" ? "\uAD00\uB9AC\uC790" : "\uD559\uC0DD", ") \xB7 ", fmtDateTime(s.createdAt))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-strong)", whiteSpace: "pre-line", lineHeight: 1.6 }, className: "kr-heading" }, s.body)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 } }, s.status !== "reviewed" && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => setStatus(s.id, "reviewed") }, "\uAC80\uD1A0\uC911"), s.status !== "resolved" && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => setStatus(s.id, "resolved") }, "\uC644\uB8CC"), s.status !== "open" && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => setStatus(s.id, "open") }, "\uC811\uC218\uB85C"))))))));
}
Object.assign(window, { AdminApp });
