const TEACHER_NAV = [
  { id: "dashboard", label: "\uB300\uC2DC\uBCF4\uB4DC", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { section: "\uD559\uAE09" },
  { id: "classroom", label: "\uD559\uAE09", icon: /* @__PURE__ */ React.createElement(IcSchool, null) },
  { id: "students", label: "\uD559\uC0DD \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcUsers, null) },
  { id: "completion", label: "\uD559\uC2B5 \uC644\uB8CC", icon: /* @__PURE__ */ React.createElement(IcCheck, null) },
  { id: "counseling", label: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
  { section: "\uC9C4\uB85C \uC9C0\uB3C4" },
  { id: "ai-coach", label: "AI \uC0C1\uB2F4 \uCF54\uCE6D", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), badge: "AI" },
  { id: "admissions-hub", label: "\uB300\uD559\xB7\uC785\uC2DC", icon: /* @__PURE__ */ React.createElement(IcGraduation, null) },
  { id: "volunteers", label: "\uBD09\uC0AC\uD65C\uB3D9", icon: /* @__PURE__ */ React.createElement(IcHeart, null) },
  { id: "scholarships", label: "\uC7A5\uD559\uAE08", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null) },
  { section: "\uC18C\uD1B5\xB7\uC77C\uC815" },
  { id: "messages", label: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null) },
  { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null) },
  { id: "notifications", label: "\uC54C\uB9BC", icon: /* @__PURE__ */ React.createElement(IcBell, null) },
  { id: "announcements", label: "\uACF5\uC9C0\uC0AC\uD56D", icon: /* @__PURE__ */ React.createElement(IcFlag, null) },
  { section: "\uACC4\uC815" },
  { id: "consents", label: "\uB3D9\uC758 \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcShield, null) },
  { id: "billing", label: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null) },
  { id: "profile", label: "\uB0B4\uC815\uBCF4", icon: /* @__PURE__ */ React.createElement(IcUser, null) }
];
function useTeacherRoster() {
  const [rows, setRows] = React.useState(null);
  const [meta, setMeta] = React.useState(null);
  const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => {
    setError(null);
    try {
      const r = await window.__apiFetch("/teacher/students", { method: "GET" });
      setRows(Array.isArray(r.data) ? r.data : []);
      setMeta(r.meta || null);
    } catch (e) {
      setError(e);
      setRows([]);
      setMeta(null);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  return { rows: rows || [], meta, loading: rows === null, error, refetch: load };
}
function useInviteCode() {
  const [code, setCode] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/invite-code", { method: "GET" });
        const c = r && r.data && r.data.inviteCode || r && r.inviteCode || "";
        if (alive) setCode(c || "");
      } catch (e) {
        if (alive) setCode("");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const regenerate = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/teacher/invite-code/regenerate", { method: "POST" });
      const c = r && r.data && r.data.inviteCode || r && r.inviteCode || "";
      if (c) {
        setCode(c);
        return c;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, []);
  return { code, display: code || "", loading: code === null, regenerate };
}
const aiProgressBadge = (p) => {
  if (p >= 60) return /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC9C4\uD589 \uD65C\uBC1C");
  if (p > 0) return /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uB300\uD654 \uC9C4\uD589 \uC911");
  return /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uBBF8\uC2DC\uC791");
};
const counselReason = (s) => {
  if (s.gradeAverage == null) return "\uC131\uC801 \uBBF8\uC785\uB825";
  if ((s.aiProgress || 0) < 24) return "AI \uC9C4\uD589\uB3C4 \uB0AE\uC74C";
  return "\uAD00\uCC30 \uAD8C\uC7A5";
};
const fmtActivity = (iso) => {
  if (!iso) return "\uD65C\uB3D9 \uC5C6\uC74C";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "\uD65C\uB3D9 \uC5C6\uC74C";
  const diff = Date.now() - d.getTime();
  const day = 864e5;
  if (diff < day && d.getDate() === (/* @__PURE__ */ new Date()).getDate()) return "\uC624\uB298";
  if (diff < 2 * day) return "\uC5B4\uC81C";
  if (diff < 7 * day) return `${Math.floor(diff / day)}\uC77C \uC804`;
  return d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
};
const openStudentDetail = (go, id) => {
  window.__selectedStudentId = id;
  go("student-detail");
};
function TeacherSidebar({ activeId, onChange }) {
  const [tMe, setTMe] = React.useState(null);
  const [capacity, setCapacity] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setTMe(r.data || r);
      } catch (e) {
      }
      try {
        const r = await window.__apiFetch("/teacher/students", { method: "GET" });
        const list = r.data || r || [];
        setCapacity(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        setCapacity(0);
      }
    })();
  }, []);
  return /* @__PURE__ */ React.createElement("aside", { style: {
    width: 240,
    flexShrink: 0,
    background: "var(--bg-surface)",
    borderRight: "1px solid var(--line-subtle)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px 16px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "0 8px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--brand-500)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.3px" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, "\uAD50\uC0AC\uC6A9"))), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 0 16px",
    padding: 14,
    borderRadius: 12,
    background: "linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)",
    border: "1px solid rgba(49,130,246,0.08)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--brand-600)", marginBottom: 4 } }, "\uD559\uAE09 \uC815\uC6D0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)" } }, capacity === null ? "\u2013" : capacity), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "/30\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: "rgba(255,255,255,0.6)", borderRadius: 999, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${(capacity || 0) / 30 * 100}%`, height: "100%", background: "var(--brand-500)" } }))), /* @__PURE__ */ React.createElement("nav", { className: "toss-scroll", style: { display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto", minHeight: 0 } }, TEACHER_NAV.map((it, idx) => {
    if (it.section) {
      return /* @__PURE__ */ React.createElement("div", { key: "sec-" + it.section, style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", letterSpacing: "0.4px", padding: "12px 12px 4px", textTransform: "uppercase" } }, it.section);
    }
    const active = activeId === it.id;
    const tourAttr = {
      "classroom": "teacher-nav-classroom",
      "students": "teacher-nav-students",
      "completion": "teacher-nav-completion",
      "counseling": "teacher-nav-counseling",
      "messages": "teacher-nav-messages",
      "calendar": "teacher-nav-calendar"
    }[it.id];
    return /* @__PURE__ */ React.createElement("button", { key: it.id, "data-tour": tourAttr, onClick: () => onChange(it.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      border: "none",
      borderRadius: 10,
      background: active ? "var(--brand-50)" : "transparent",
      color: active ? "var(--brand-600)" : "var(--fg-default)",
      fontSize: 14,
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      transition: "all var(--t-fast) var(--ease-std)"
    } }, React.cloneElement(it.icon, { size: 18 }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, it.label), it.badge && /* @__PURE__ */ React.createElement("span", { style: { background: "var(--accent-purple)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 999 } }, it.badge));
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 8px 0", borderTop: "1px solid var(--line-subtle)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(SidebarUserMenu, { name: tMe && tMe.name || "\uC120\uC0DD\uB2D8", sub: tMe && [tMe.school, tMe.classroom].filter(Boolean).join(" \xB7 ") || "", avatar: (tMe && tMe.name || "\uAD50")[0], onProfile: () => onChange && onChange("profile") })));
}
function TeacherTopbar({ title, subtitle, openNotif, action, help }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)"
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.4px" }, className: "kr-heading" }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, subtitle)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, action, help && typeof HelpButton !== "undefined" && /* @__PURE__ */ React.createElement(HelpButton, { pageId: help }), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "md", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C"), /* @__PURE__ */ React.createElement(IconButton, { "data-tour": "teacher-bell", icon: /* @__PURE__ */ React.createElement(IcBell, { size: 20 }), onClick: openNotif, badge: 3, ariaLabel: "\uC54C\uB9BC" })));
}
function TeacherDashboard({ go, openNotif }) {
  var _a;
  const [trendMode, setTrendMode] = React.useState("avg");
  const { rows, meta, loading } = useTeacherRoster();
  const invite = useInviteCode();
  const total = (_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length;
  const activeCount = rows.filter((s) => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const needsList = rows.filter((s) => s.needsCounseling);
  const needsCount = needsList.length;
  const avgProgress = rows.length ? Math.round(rows.reduce((a, s) => a + (s.aiProgress || 0), 0) / rows.length) : 0;
  const recent = rows.filter((s) => s.lastActivityAt).sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)).slice(0, 4);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { help: "teacher-dashboard", title: "\uC88B\uC740 \uC544\uCE68\uC774\uC5D0\uC694, \uC120\uC0DD\uB2D8", subtitle: "\uC624\uB298 \uD559\uAE09\uC5D0\uC11C \uC8FC\uBAA9\uD560 \uD559\uC0DD\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.", openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uD559\uC0DD", value: loading ? "\u2013" : String(total), hint: (meta == null ? void 0 : meta.classroom) || void 0, icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC774\uBC88 \uC8FC \uD65C\uB3D9", value: loading ? "\u2013" : `${activeCount}\uBA85`, delta: activeCount > 0 ? "\uD65C\uC131" : void 0, deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcZap, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC0C1\uB2F4 \uD544\uC694", value: loading ? "\u2013" : `${needsCount}\uBA85`, delta: needsCount > 0 ? "\uD655\uC778 \uD544\uC694" : void 0, deltaTone: "warning", icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD3C9\uADE0 \uC9C4\uD589\uB3C4", value: loading ? "\u2013" : `${avgProgress}%`, delta: "AI \uC0C1\uB2F4 \uAE30\uC900", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcChart, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uC624\uB298 \uC8FC\uBAA9\uD560 \uD559\uC0DD",
      subtitle: "AI \uC9C4\uD589\uB3C4\xB7\uC131\uC801 \uC785\uB825 \uC5EC\uBD80\uB97C \uC885\uD569\uD55C \uC6B0\uC120\uC21C\uC704",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => go("students") }, "\uC804\uCCB4 \uBCF4\uAE30")
    },
    loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 68, radius: 12 }))) : needsList.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 22 }), title: "\uC8FC\uBAA9\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD604\uC7AC \uBAA8\uB4E0 \uD559\uC0DD\uC774 \uC798 \uB530\uB77C\uC624\uACE0 \uC788\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, needsList.slice(0, 5).map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 12,
      cursor: "pointer",
      border: "1px solid var(--line-subtle)",
      background: "var(--bg-surface)"
    } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, counselReason(s), " \xB7 ", s.grade || "\uD559\uB144 \uBBF8\uC815")), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC0C1\uB2F4 \uD544\uC694"), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" }))))
  ), /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uD559\uAE09 \uC131\uC801 \uCD94\uC774",
      action: /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "avg", label: "\uD3C9\uADE0" }, { id: "sub", label: "\uACFC\uBAA9\uBCC4" }], activeId: trendMode, onChange: setTrendMode })
    },
    /* @__PURE__ */ React.createElement(ClassTrendChart, { mode: trendMode })
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 18, style: { background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, marginBottom: 6 } }, "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 28, fontWeight: 800, letterSpacing: "4px" } }, invite.loading ? "\xB7\xB7\xB7\xB7\xB7\xB7" : invite.display || "\uCF54\uB4DC \uC5C6\uC74C"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { disabled: !invite.display, onClick: () => invite.display && copyToast(invite.display, "\uCD08\uB300\uCF54\uB4DC\uB97C \uBCF5\uC0AC\uD588\uC5B4\uC694"), style: { flex: 1, padding: "8px 0", border: "none", borderRadius: 10, background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: invite.display ? "pointer" : "default", opacity: invite.display ? 1 : 0.6, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcCopy, { size: 13 }), " \uBCF5\uC0AC"), /* @__PURE__ */ React.createElement("button", { onClick: () => go("classroom"), style: { flex: 1, padding: "8px 0", border: "none", borderRadius: 10, background: "#fff", color: "var(--brand-600)", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uD559\uAE09 \uBCF4\uAE30"))), /* @__PURE__ */ React.createElement(TeacherRiskSignals, { rows, loading, go }), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD5C\uADFC \uD65C\uB3D9", padding: 18 }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 20 }))) : recent.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcZap, { size: 22 }), title: "\uCD5C\uADFC \uD65C\uB3D9\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uD559\uC2B5\xB7AI \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, recent.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: { display: "flex", gap: 10, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--brand-500)", marginTop: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-strong)", fontWeight: 500 }, className: "kr-heading" }, s.name, " \xB7 \uD559\uC2B5 ", s.studyDone, "/", s.studyTotal), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 } }, fmtActivity(s.lastActivityAt)))))))))));
}
function TeacherRiskSignals({ rows, loading, go }) {
  const risk = (rows || []).filter((s) => s.needsCounseling);
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uC8FC\uC758 \uC2E0\uD638",
      subtitle: "AI \uC9C4\uD589\uB3C4\xB7\uC131\uC801 \uC785\uB825 \uAD00\uC810\uC5D0\uC11C \uC0B4\uD3B4\uBCFC \uD559\uC0DD\uB4E4 (\uC815\uC2E0\uAC74\uAC15 \uC9C4\uB2E8 \uC544\uB2D8)",
      action: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, loading ? "\u2026" : `${risk.length}\uAC74`)
    },
    loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 48, radius: 12 }))) : risk.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 22 }), title: "\uC8FC\uC758\uAC00 \uD544\uC694\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD604\uC7AC \uD2B9\uBCC4\uD788 \uC0B4\uD3B4\uBCFC \uC2E0\uD638\uAC00 \uC5C6\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, risk.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      border: "1px solid var(--line-subtle)",
      borderRadius: 12,
      cursor: "pointer",
      background: "var(--bg-surface)"
    } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, counselReason(s))), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--info-bg)", borderRadius: 8, fontSize: 11, color: "var(--brand-600)", lineHeight: 1.5, marginTop: 4 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcShield, { size: 12, style: { display: "inline", verticalAlign: -2, marginRight: 4 } }), "\uC8FC\uC758 \uC2E0\uD638\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\uD559\uC5C5\xB7\uC0C1\uB2F4 \uAD00\uC810"), "\uC758 \uCC38\uACE0 \uC815\uBCF4\uC608\uC694. \uC815\uC2E0\uAC74\uAC15 \uAD00\uB828 \uC6B0\uB824\uB294 \uC804\uBB38 \uC0C1\uB2F4\uC0AC\xB7\uBCF4\uAC74\uAD50\uC0AC\uC5D0\uAC8C \uC5F0\uACB0\uD574\uC8FC\uC138\uC694."))
  );
}
function ClassTrendChart({ mode = "avg" }) {
  const [trend, setTrend] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/grade-trend", { method: "GET" });
        setTrend(r.data || []);
      } catch (e) {
        setTrend([]);
      }
    })();
  }, []);
  if (trend === null) return /* @__PURE__ */ React.createElement(Skeleton, { height: 220 });
  if (trend.length === 0) {
    return /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcChart, { size: 22 }), title: "\uC544\uC9C1 \uC9D1\uACC4\uD560 \uC131\uC801\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uB4E4\uC774 \uC131\uC801\uC744 \uC785\uB825\uD558\uBA74 \uD559\uAE09\uC758 \uD559\uAE30\uBCC4 \uD3C9\uADE0 \uCD94\uC774\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." });
  }
  const w = 720, h = 280, pad = 30;
  const vals = trend.map((t) => t.average);
  const max = Math.min(100, Math.max(...vals) + 5), min = Math.max(0, Math.min(...vals) - 5);
  const span = Math.max(1, max - min);
  const xFor = (i) => trend.length === 1 ? w / 2 : pad + i * (w - pad * 2) / (trend.length - 1);
  const yFor = (v) => h - pad - (v - min) / span * (h - pad * 2 - 18);
  const xs = trend.map((_, i) => xFor(i)), ys = trend.map((t) => yFor(t.average));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, style: { width: "100%", height: 280 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "cls", x1: "0", x2: "0", y1: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#3182F6", stopOpacity: "0.2" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#3182F6", stopOpacity: "0" }))), [0, 1, 2, 3, 4].map((i) => {
    const y = pad + (h - pad * 2 - 22) / 4 * i;
    return /* @__PURE__ */ React.createElement("line", { key: i, x1: pad, x2: w - pad, y1: y, y2: y, stroke: "#E5E8EB", strokeDasharray: "2 4" });
  }), trend.length > 1 && /* @__PURE__ */ React.createElement("path", { d: `${line} L${xs[xs.length - 1]},${h - pad} L${xs[0]},${h - pad} Z`, fill: "url(#cls)" }), trend.length > 1 && /* @__PURE__ */ React.createElement("path", { d: line, fill: "none", stroke: "#3182F6", strokeWidth: "3", strokeLinecap: "round" }), xs.map((x, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: ys[i], r: "5.5", fill: "#fff", stroke: "#3182F6", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x, y: ys[i] - 16, textAnchor: "middle", fontSize: "15", fontWeight: "700", fill: "#3182F6" }, trend[i].average))), trend.map((t, i) => /* @__PURE__ */ React.createElement("text", { key: t.term, x: xFor(i), y: h - 6, textAnchor: "middle", fontSize: "13", fill: "#6B7684" }, t.term))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", textAlign: "center", marginTop: 4 } }, "\uD559\uAE09 \uD559\uC0DD\uC774 \uC785\uB825\uD55C \uC131\uC801\uC758 \uD559\uAE30\uBCC4 \uD3C9\uADE0\uC774\uC5D0\uC694", mode === "sub" ? " (\uACFC\uBAA9\uBCC4 \uBD84\uB9AC\uB294 \uB370\uC774\uD130\uAC00 \uB354 \uBAA8\uC774\uBA74 \uC81C\uACF5\uB3FC\uC694)" : "", "."));
}
function TeacherClassroom({ go, openNotif }) {
  var _a;
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { rows, meta, loading } = useTeacherRoster();
  const invite = useInviteCode();
  const count = (_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length;
  const avgProgress = rows.length ? Math.round(rows.reduce((a, s) => a + (s.aiProgress || 0), 0) / rows.length) : 0;
  const graded = rows.filter((s) => s.gradeAverage != null);
  const avgGrade = graded.length ? Math.round(graded.reduce((a, s) => a + s.gradeAverage, 0) / graded.length * 10) / 10 : null;
  const classroomLabel = [meta == null ? void 0 : meta.school, meta == null ? void 0 : meta.classroom].filter(Boolean).join(" ") || "\uC6B0\uB9AC \uD559\uAE09";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { help: "teacher-classroom", title: "\uC6B0\uB9AC \uD559\uAE09", subtitle: `${classroomLabel} \xB7 ${loading ? "\u2026" : count}\uBA85`, openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 28, style: {
    background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)",
    color: "#fff"
  } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff" } }, "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 56, fontWeight: 800, letterSpacing: "8px", marginTop: 16, fontFamily: "var(--font-num)" } }, invite.loading ? "\xB7\xB7\xB7\xB7\xB7\xB7" : invite.display || "\uCF54\uB4DC \uC5C6\uC74C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85, marginTop: 8 }, className: "kr-heading" }, "\uD559\uC0DD\uC774 \uD68C\uC6D0\uAC00\uC785 \uC2DC \uC774 \uCF54\uB4DC\uB97C \uC785\uB825\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uD559\uAE09\uC5D0 \uCC38\uC5EC\uB3FC\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 20 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcCopy, { size: 14 }), disabled: !invite.display, style: { background: "#fff", color: "var(--brand-600)" }, onClick: () => invite.display && copyToast(invite.display, "\uCD08\uB300\uCF54\uB4DC\uB97C \uBCF5\uC0AC\uD588\uC5B4\uC694") }, "\uCF54\uB4DC \uBCF5\uC0AC"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), style: { background: "rgba(255,255,255,0.18)", color: "#fff" }, onClick: () => setConfirmOpen(true) }, "\uCF54\uB4DC \uC7AC\uBC1C\uAE09")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, padding: 14, background: "rgba(255,255,255,0.12)", borderRadius: 12, fontSize: 12, lineHeight: 1.55 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontWeight: 700 } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 13 }), " \uBB34\uB8CC \uCCB4\uD5D8 \uC911\uC5D0\uB294 \uCD08\uB300\uCF54\uB4DC\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694."), "\uCCB4\uD5D8\uC774 \uB05D\uB098\uBA74 \uAD50\uC0AC \uD50C\uB79C \uACB0\uC81C\uAC00 \uD544\uC694\uD574\uC694. \uACB0\uC81C \uD6C4 \uCF54\uB4DC\uB294 \uC790\uB3D9\uC73C\uB85C \uB2E4\uC2DC \uD65C\uC131\uD654\uB3FC\uC694.")), /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 12 } }, "\uD559\uAE09 \uC815\uC6D0"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 160, height: 160, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("svg", { width: "160", height: "160", viewBox: "0 0 160 160" }, /* @__PURE__ */ React.createElement("circle", { cx: "80", cy: "80", r: "68", fill: "none", stroke: "#E5E8EB", strokeWidth: "12" }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "80",
      cy: "80",
      r: "68",
      fill: "none",
      stroke: "#3182F6",
      strokeWidth: "12",
      strokeDasharray: `${Math.min(count, 30) / 30 * 2 * Math.PI * 68} ${2 * Math.PI * 68}`,
      strokeLinecap: "round",
      transform: "rotate(-90 80 80)"
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 38, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1px" } }, loading ? "\u2013" : count), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "/30\uBA85"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uD3C9\uADE0 \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 20, fontWeight: 800, color: "var(--brand-600)" } }, loading ? "\u2013" : `${avgProgress}%`)), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uD3C9\uADE0 \uC131\uC801"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)" } }, loading ? "\u2013" : avgGrade == null ? "\uBBF8\uC785\uB825" : avgGrade))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD559\uAE09 \uD559\uC0DD", action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => go("students"), trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }) }, "\uC804\uCCB4 \uD559\uC0DD \uBCF4\uAE30") }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 64, radius: 12 }))) : rows.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uAE09 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574 \uCCAB \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, rows.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: {
    padding: 14,
    border: "1px solid var(--line-subtle)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, fmtActivity(s.lastActivityAt), " \xB7 AI ", s.aiProgress || 0, "%")), s.needsCounseling && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, "\uC0C1\uB2F4")))))), /* @__PURE__ */ React.createElement(
    ConfirmDialog,
    {
      open: confirmOpen,
      title: "\uCD08\uB300\uCF54\uB4DC\uB97C \uC7AC\uBC1C\uAE09\uD560\uAE4C\uC694?",
      body: "\uAE30\uC874 \uCF54\uB4DC\uB294 \uC989\uC2DC \uBE44\uD65C\uC131\uD654\uB3FC\uC694. \uC774\uBBF8 \uAC00\uC785\uD55C \uD559\uC0DD\uC740 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694.",
      confirmLabel: "\uC7AC\uBC1C\uAE09",
      onConfirm: async () => {
        const c = await invite.regenerate();
        setConfirmOpen(false);
        showToast(c ? "\uCD08\uB300\uCF54\uB4DC\uB97C \uC7AC\uBC1C\uAE09\uD588\uC5B4\uC694" : "\uC7AC\uBC1C\uAE09\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", c ? "success" : "error");
      },
      onCancel: () => setConfirmOpen(false)
    }
  ));
}
function TeacherStudents({ go, openNotif }) {
  var _a;
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const { rows, meta, loading, error, refetch } = useTeacherRoster();
  const allStudents = rows;
  const filtered = allStudents.filter((s) => {
    if (q && !(s.name || "").includes(q)) return false;
    if (filter === "all") return true;
    if (filter === "needs-counseling") return s.needsCounseling;
    if (filter === "ai") return (s.aiProgress || 0) > 0;
    if (filter === "ungraded") return s.gradeAverage == null;
    return true;
  });
  const needsCounselingCount = allStudents.filter((s) => s.needsCounseling).length;
  const aiCount = allStudents.filter((s) => (s.aiProgress || 0) > 0).length;
  const ungradedCount = allStudents.filter((s) => s.gradeAverage == null).length;
  const classroomLabel = [meta == null ? void 0 : meta.school, meta == null ? void 0 : meta.classroom].filter(Boolean).join(" ") || "\uC6B0\uB9AC \uD559\uAE09";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    TeacherTopbar,
    {
      help: "teacher-students",
      title: "\uD559\uC0DD \uAD00\uB9AC",
      subtitle: `${classroomLabel} ${loading ? "" : ((_a = meta == null ? void 0 : meta.count) != null ? _a : allStudents.length) + "\uBA85 \xB7 "}\uAC80\uC0C9\uC73C\uB85C \uBE60\uB974\uAC8C \uCC3E\uC73C\uC138\uC694`,
      openNotif,
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("\uD559\uAE09 \uD559\uC0DD \uB9AC\uD3EC\uD2B8", ["\uC774\uB984", "\uD559\uB144", "\uCD5C\uADFC \uD3C9\uADE0", "AI \uC9C4\uD589\uB3C4", "\uD559\uC2B5 \uC9C4\uB3C4", "\uB9C8\uC9C0\uB9C9 \uD65C\uB3D9"], filtered.map((s) => [s.name, s.grade || "-", s.gradeAverage == null ? "\uBBF8\uC785\uB825" : s.gradeAverage, `${s.aiProgress || 0}%`, `${s.studyDone}/${s.studyTotal}`, fmtActivity(s.lastActivityAt)]), { "\uD559\uAE09": classroomLabel }) }, "\uB9AC\uD3EC\uD2B8 \uB0B4\uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: () => setRegisterOpen(true) }, "\uD559\uC0DD \uB4F1\uB85D"))
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 28px 12px", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-canvas)", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD \uC774\uB984\uC73C\uB85C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { flex: 1, minWidth: 240, height: 44 } }), /* @__PURE__ */ React.createElement(Tabs, { items: [
    { id: "all", label: `\uC804\uCCB4 ${allStudents.length}` },
    { id: "needs-counseling", label: `\uC0C1\uB2F4 \uD544\uC694 ${needsCounselingCount}` },
    { id: "ai", label: `AI \uC9C4\uD589 ${aiCount}` },
    { id: "ungraded", label: `\uC131\uC801 \uBBF8\uC785\uB825 ${ungradedCount}` }
  ], activeId: filter, onChange: setFilter })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "0 28px 28px", background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 56, radius: 12 })))) : error ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uD559\uC0DD \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: refetch }, "\uB2E4\uC2DC \uC2DC\uB3C4") })) : allStudents.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uAE09 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574 \uCCAB \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCopy, { size: 14 }) }, "\uCD08\uB300\uCF54\uB4DC \uBCF5\uC0AC") })) : filtered.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSearch, { size: 24 }), title: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694", body: "\uB2E4\uB978 \uC774\uB984\uC774\uB098 \uD544\uD130\uB97C \uC2DC\uB3C4\uD574\uBCF4\uC138\uC694." })) : /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { minWidth: 720 } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1.4fr 1.2fr 1.4fr 36px",
    padding: "12px 20px",
    fontSize: 12,
    fontWeight: 700,
    color: "var(--fg-muted)",
    borderBottom: "1px solid var(--line-subtle)"
  } }, /* @__PURE__ */ React.createElement("span", null, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("span", null, "\uCD5C\uADFC \uD3C9\uADE0"), /* @__PURE__ */ React.createElement("span", null, "AI \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uC2B5 \uC9C4\uB3C4"), /* @__PURE__ */ React.createElement("span", null, "\uB9C8\uC9C0\uB9C9 \uD65C\uB3D9"), /* @__PURE__ */ React.createElement("span", null)), filtered.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr 1.4fr 1.2fr 1.4fr 36px",
    padding: "14px 20px",
    alignItems: "center",
    borderBottom: i < filtered.length - 1 ? "1px solid var(--line-subtle)" : "none",
    cursor: "pointer",
    transition: "background 120ms",
    gap: 8
  }, onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-muted)", onMouseLeave: (e) => e.currentTarget.style.background = "transparent" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, s.name, s.needsCounseling && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, "\uC0C1\uB2F4 \uD544\uC694")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.grade || "\uD559\uB144 \uBBF8\uC815"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, s.gradeAverage == null ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uBBF8\uC785\uB825") : /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, s.gradeAverage)), /* @__PURE__ */ React.createElement("div", null, aiProgressBadge(s.aiProgress || 0)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(ProgressBar, { value: s.studyDone, max: Math.max(s.studyTotal, 1), height: 5 }), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-muted)", minWidth: 28, textAlign: "right" } }, s.studyDone, "/", s.studyTotal)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)" } }, fmtActivity(s.lastActivityAt))), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" }))))), registerOpen && /* @__PURE__ */ React.createElement(StudentRegisterDialog, { onSave: () => setRegisterOpen(false), onClose: () => setRegisterOpen(false) }));
}
function StudentRegisterDialog({ onSave, onClose }) {
  const trapRef = useFocusTrap(true, onClose);
  const invite = useInviteCode();
  const [name, setName] = React.useState("");
  const [grade, setGrade] = React.useState("2-3");
  const [method, setMethod] = React.useState("invite");
  const [err, setErr] = React.useState("");
  const save = () => {
    if (!name.trim()) {
      setErr("\uD559\uC0DD \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694");
      return;
    }
    onSave({ name: name.trim(), grade });
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uD559\uC0DD \uB4F1\uB85D", style: {
    position: "relative",
    width: "min(440px, 100%)",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, "\uD559\uC0DD \uB4F1\uB85D"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, "\uCD08\uB300 \uCF54\uB4DC\uB85C \uC6B0\uB9AC \uD559\uAE09\uC5D0 \uD559\uC0DD\uC744 \uCD08\uB300\uD558\uC138\uC694")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, [
    { id: "invite", label: "\uCD08\uB300\uCF54\uB4DC \uACF5\uC720", sub: "\uD559\uC0DD\uC774 \uC9C1\uC811 \uAC00\uC785" },
    { id: "direct", label: "\uC9C1\uC811 \uB4F1\uB85D", sub: "\uAD50\uC0AC\uAC00 \uC784\uC758 \uCD94\uAC00" }
  ].map((m) => /* @__PURE__ */ React.createElement("button", { key: m.id, onClick: () => setMethod(m.id), style: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 12,
    cursor: "pointer",
    textAlign: "left",
    border: "1px solid",
    borderColor: method === m.id ? "var(--brand-500)" : "var(--line-strong)",
    background: method === m.id ? "var(--brand-50)" : "var(--bg-surface)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: method === m.id ? "var(--brand-600)" : "var(--fg-strong)" } }, m.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, m.sub)))), method === "invite" ? /* @__PURE__ */ React.createElement("div", { style: { padding: 18, background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", borderRadius: 14, color: "#fff", textAlign: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, marginBottom: 6 } }, "\uC774 \uCF54\uB4DC\uB97C \uD559\uC0DD\uC5D0\uAC8C \uACF5\uC720\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 32, fontWeight: 800, letterSpacing: "6px" } }, invite.loading ? "\xB7\xB7\xB7\xB7\xB7\xB7" : invite.display || "\uCF54\uB4DC \uC5C6\uC74C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCopy, { size: 13 }), disabled: !invite.display, style: { background: "#fff", color: "var(--brand-600)", marginTop: 12 }, onClick: () => invite.display && copyToast(invite.display, "\uCD08\uB300\uCF54\uB4DC\uB97C \uBCF5\uC0AC\uD588\uC5B4\uC694") }, "\uCF54\uB4DC \uBCF5\uC0AC")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uC0DD \uC774\uB984", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: name, onChange: setName, placeholder: "\uC608) \uAE40\uD558\uB298", autoFocus: true })), /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uB144 / \uBC18", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: grade, onChange: setGrade, placeholder: "\uC608) 2-3" })), err && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)", marginBottom: 8 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10, fontSize: 12, color: "var(--fg-muted)", marginBottom: 16, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { flexShrink: 0, marginTop: 1 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC9C1\uC811 \uB4F1\uB85D\uD55C \uD559\uC0DD\uC740 \uCD94\uD6C4 \uBCF8\uC778 \uACC4\uC815\uACFC \uC5F0\uACB0\uD560 \uC218 \uC788\uC5B4\uC694. \uB4F1\uB85D \uD6C4 \uC131\uC801\uC740 \uD559\uC0DD \uC0C1\uC138 \u2192 \uC131\uC801 \uD0ED\uC5D0\uC11C \uC785\uB825\uD558\uC138\uC694."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uB2EB\uAE30"), method === "direct" && /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: save }, "\uB4F1\uB85D\uD558\uAE30"))));
}
function TeacherStudentDetail({ go, openNotif }) {
  const [tab, setTab] = React.useState("overview");
  const id = typeof window !== "undefined" && window.__selectedStudentId || null;
  const [detail, setDetail] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    setDetail(null);
    setError(null);
    if (!id) {
      setError(new Error("\uD559\uC0DD\uC774 \uC120\uD0DD\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694."));
      setDetail({});
      return;
    }
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/students/" + encodeURIComponent(id), { method: "GET" });
        if (alive) setDetail(r.data || {});
      } catch (e) {
        if (alive) {
          setError(e);
          setDetail({});
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);
  const loading = detail === null;
  const student = (detail == null ? void 0 : detail.student) || {};
  const subtitle = [student.school, student.classroom].filter(Boolean).join(" ") || (loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : "");
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    TeacherTopbar,
    {
      help: "teacher-detail",
      title: loading ? "\uD559\uC0DD \uC0C1\uC138" : student.name || "\uD559\uC0DD",
      subtitle,
      openNotif,
      action: /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, style: { transform: "rotate(180deg)" } }), onClick: () => go("students") }, "\uBAA9\uB85D\uC73C\uB85C")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 28px", background: "var(--bg-canvas)", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Tabs, { variant: "underline", items: [
    { id: "overview", label: "\uC885\uD569" },
    { id: "grades", label: "\uC131\uC801" },
    { id: "signals", label: "AI \uC9C4\uB85C \uB2E8\uC11C" },
    { id: "targets", label: "\uC9C4\uB85C \uBAA9\uD45C" }
  ], activeId: tab, onChange: setTab })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 120, radius: 16 }))) : error ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 24 }), title: "\uD559\uC0DD \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: !id ? "\uD559\uC0DD \uBAA9\uB85D\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694." : "\uB2F4\uB2F9 \uD559\uAE09 \uD559\uC0DD\uB9CC \uC870\uD68C\uD560 \uC218 \uC788\uC5B4\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => go("students") }, "\uD559\uC0DD \uBAA9\uB85D") })) : /* @__PURE__ */ React.createElement(React.Fragment, null, tab === "overview" && /* @__PURE__ */ React.createElement(TeacherStudentOverview, { detail, onTab: setTab }), tab === "grades" && /* @__PURE__ */ React.createElement(TeacherStudentGrades, { grades: detail.grades || [] }), tab === "signals" && /* @__PURE__ */ React.createElement(TeacherStudentSignals, { signals: detail.signals || [], aiProgress: detail.aiProgress || 0 }), tab === "targets" && /* @__PURE__ */ React.createElement(TeacherStudentTargets, { targets: detail.targets || [] }))));
}
function groupGradesByTerm(grades) {
  const byTerm = /* @__PURE__ */ new Map();
  (grades || []).forEach((g) => {
    const a = byTerm.get(g.term) || [];
    a.push(g);
    byTerm.set(g.term, a);
  });
  return [...byTerm.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([term, items]) => {
    const scored = items.filter((i) => i.score != null);
    const avg = scored.length ? Math.round(scored.reduce((s, i) => s + i.score, 0) / scored.length * 10) / 10 : null;
    return { term, items, avg };
  });
}
function TeacherStudentOverview({ detail, onTab }) {
  const grades = detail.grades || [];
  const signals = detail.signals || [];
  const targets = detail.targets || [];
  const terms = groupGradesByTerm(grades);
  const lastAvg = terms.length ? terms[terms.length - 1].avg : null;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uCD5C\uADFC \uD3C9\uADE0"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--fg-strong)" } }, lastAvg == null ? "\uBBF8\uC785\uB825" : lastAvg)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "AI \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--fg-strong)" } }, detail.aiProgress || 0, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)", fontWeight: 500 } }, "%")), aiProgressBadge(detail.aiProgress || 0)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC9C4\uB85C \uB2E8\uC11C"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--fg-strong)" } }, signals.length, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)", fontWeight: 500 } }, "\uAC1C"))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC9C4\uB85C \uB2E8\uC11C", subtitle: "\uB300\uD654\uC5D0\uC11C \uBC18\uBCF5\uC801\uC73C\uB85C \uBCF4\uC778 \uD328\uD134", action: signals.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => onTab("signals") }, "\uC804\uCCB4") }, signals.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 22 }), title: "\uC544\uC9C1 \uC9C4\uB85C \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74 \uB2E8\uC11C\uAC00 \uC313\uC5EC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, signals.slice(0, 4).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1 }, className: "kr-heading" }, s.text)))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uBAA9\uD45C", action: targets.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => onTab("targets") }, "\uC804\uCCB4") }, targets.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 22 }), title: "\uC124\uC815\uB41C \uC9C4\uB85C \uBAA9\uD45C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uBAA9\uD45C\uB97C \uC124\uC815\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, targets.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { padding: 14, background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, t.career || t.dept || "\uC9C4\uB85C \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }, className: "kr-heading" }, [t.univ, t.dept].filter(Boolean).join(" \xB7 ") || t.track || ""))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC131\uC801", action: grades.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => onTab("grades") }, "\uC804\uCCB4") }, terms.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcChart, { size: 22 }), title: "\uC785\uB825\uB41C \uC131\uC801\uC774 \uC5C6\uC5B4\uC694", body: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uC131\uC801 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, terms.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.term, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)" } }, t.term), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, t.avg == null ? "\u2013" : t.avg)))))));
}
function TeacherStudentGrades({ grades }) {
  const terms = groupGradesByTerm(grades);
  if (terms.length === 0) {
    return /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcChart, { size: 24 }), title: "\uC785\uB825\uB41C \uC131\uC801\uC774 \uC5C6\uC5B4\uC694", body: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uC131\uC801 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694." }));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, terms.map((t) => /* @__PURE__ */ React.createElement(SectionCard, { key: t.term, title: t.term, action: t.avg != null && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uD3C9\uADE0 ", t.avg) }, /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("span", null, "\uACFC\uBAA9"), /* @__PURE__ */ React.createElement("span", null, "\uBD84\uB958"), /* @__PURE__ */ React.createElement("span", null, "\uC810\uC218"), /* @__PURE__ */ React.createElement("span", null, "\uB4F1\uAE09")), t.items.map((g, i) => /* @__PURE__ */ React.createElement("div", { key: g.id || i, style: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "12px 16px", alignItems: "center", fontSize: 13, borderBottom: i < t.items.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, g.subject), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, g.category || "-"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-strong)" } }, g.score == null ? "-" : g.score), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-muted)" } }, g.rank == null ? "-" : g.rank)))))));
}
function TeacherStudentSignals({ signals, aiProgress }) {
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC9C4\uB85C \uB2E8\uC11C", subtitle: `\uB300\uD654\uC5D0\uC11C \uCD94\uCD9C\uB41C \uB2E8\uC11C \xB7 AI \uC9C4\uD589\uB3C4 ${aiProgress}%` }, signals.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }), title: "\uC544\uC9C1 \uC9C4\uB85C \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74 \uB2E8\uC11C\uAC00 \uC313\uC5EC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, signals.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1, lineHeight: 1.5 }, className: "kr-heading" }, s.text)))));
}
function TeacherStudentTargets({ targets }) {
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uBAA9\uD45C", subtitle: "\uD559\uC0DD\uC774 \uC124\uC815\uD55C \uC9C4\uB85C \uBAA9\uD45C" }, targets.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 24 }), title: "\uC124\uC815\uB41C \uC9C4\uB85C \uBAA9\uD45C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uBAA9\uD45C\uB97C \uC124\uC815\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, targets.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { padding: 16, border: "1px solid var(--line-subtle)", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, t.career || t.dept || "\uC9C4\uB85C \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }, className: "kr-heading" }, [t.univ, t.dept, t.track].filter(Boolean).join(" \xB7 ")), t.reason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", marginTop: 8, lineHeight: 1.5, padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 8 }, className: "kr-heading" }, t.reason)))));
}
function GradeInputDialog({ studentName, onSave, onClose }) {
  const trapRef = useFocusTrap(true, onClose);
  const baseSubjects = ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559"];
  const [exam, setExam] = React.useState("6\uC6D4 \uBAA8\uC758\uACE0\uC0AC");
  const [date, setDate] = React.useState("2026-06-05");
  const [scores, setScores] = React.useState({ \uAD6D\uC5B4: "", \uC218\uD559: "", \uC601\uC5B4: "", \uC0AC\uD68C: "", \uACFC\uD559: "" });
  const [extras, setExtras] = React.useState([]);
  const [err, setErr] = React.useState("");
  const setScore = (s, v) => {
    if (v !== "" && (isNaN(+v) || +v < 0 || +v > 100)) return;
    setScores((p) => ({ ...p, [s]: v }));
  };
  const addExtra = () => setExtras((e) => [...e, { name: "", score: "" }]);
  const setExtra = (i, k, v) => {
    if (k === "score" && v !== "" && (isNaN(+v) || +v < 0 || +v > 100)) return;
    setExtras((e) => e.map((x, j) => j === i ? { ...x, [k]: v } : x));
  };
  const removeExtra = (i) => setExtras((e) => e.filter((_, j) => j !== i));
  const filled = baseSubjects.filter((s) => scores[s] !== "").length + extras.filter((e) => e.name.trim() && e.score !== "").length;
  const save = () => {
    if (!exam.trim()) {
      setErr("\uC2DC\uD5D8 \uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694");
      return;
    }
    if (filled === 0) {
      setErr("\uD55C \uACFC\uBAA9 \uC774\uC0C1 \uC810\uC218\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694");
      return;
    }
    const rec = { exam: exam.trim(), date };
    baseSubjects.forEach((s) => {
      if (scores[s] !== "") rec[s] = +scores[s];
    });
    extras.forEach((e) => {
      if (e.name.trim() && e.score !== "") rec[e.name.trim()] = +e.score;
    });
    onSave(rec);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC131\uC801 \uC785\uB825", style: {
    position: "relative",
    width: "min(460px, 100%)",
    maxHeight: "90%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC131\uC801 \uC785\uB825"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, studentName, " \uD559\uC0DD \xB7 \uAD50\uC0AC \uC9C1\uC811 \uC785\uB825")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uD5D8", required: true, style: { flex: 1.4 } }, /* @__PURE__ */ React.createElement(TextInput, { value: exam, onChange: setExam, placeholder: "\uC608) 6\uC6D4 \uBAA8\uC758\uACE0\uC0AC" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC751\uC2DC\uC77C", style: { flex: 1 } }, /* @__PURE__ */ React.createElement(TextInput, { value: date, onChange: setDate, placeholder: "2026-06-05" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 } }, baseSubjects.map((s) => /* @__PURE__ */ React.createElement("div", { key: s, style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "var(--fg-strong)", width: 48 } }, s), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(TextInput, { value: scores[s], onChange: (v) => setScore(s, v), placeholder: "0 ~ 100", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-subtle)" } }, "\uC810") })))), extras.map((e, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96 } }, /* @__PURE__ */ React.createElement(TextInput, { value: e.name, onChange: (v) => setExtra(i, "name", v), placeholder: "\uACFC\uBAA9\uBA85", style: { height: 52 } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(TextInput, { value: e.score, onChange: (v) => setExtra(i, "score", v), placeholder: "0 ~ 100", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-subtle)" } }, "\uC810") })), /* @__PURE__ */ React.createElement("button", { onClick: () => removeExtra(i), style: { background: "transparent", border: "none", color: "var(--fg-subtle)", cursor: "pointer", padding: 6 } }, /* @__PURE__ */ React.createElement(IcX, { size: 16 }))))), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 13 }), onClick: addExtra, style: { marginBottom: 8 } }, "\uAE30\uD0C0 \uACFC\uBAA9 \uCD94\uAC00"), err && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)", marginBottom: 8 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--brand-50)", borderRadius: 10, fontSize: 12, color: "var(--brand-600)", margin: "8px 0 16px" } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14 }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC785\uB825\uD55C \uC131\uC801\uC740 \uD559\uC0DD\uC5D0\uAC8C\uB3C4 \uACF5\uC720\uB3FC\uC694. \uC5B8\uC81C\uB4E0 \uB2E4\uC2DC \uC218\uC815\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: save }, "\uC800\uC7A5 (", filled, "/5)"))));
}
function StudentDetailReport({ onOpenReport }) {
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8",
      subtitle: "\uD559\uC0DD\uC774 \uACF5\uC720\uD55C 1\uCC28 \uB9AC\uD3EC\uD2B8",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), onClick: onOpenReport }, "\uC804\uCCB4 \uB9AC\uD3EC\uD2B8 \uBCF4\uAE30")
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-default)", lineHeight: 1.6 }, className: "kr-heading" }, "\uC601\uC0C1 \uD3B8\uC9D1\xB7\uC2DC\uAC01\uC801 \uD750\uB984\xB7\uD0C0\uC778\uC758 \uBC18\uC751\uC5D0\uC11C \uB3D9\uAE30\uB97C \uC5BB\uB294 \uBAA8\uC2B5\uC774 \uBCF4\uC5EC\uC694. \uCF58\uD150\uCE20 \uB514\uC790\uC778, \uC601\uC0C1 \uC5F0\uCD9C \uCABD\uC774 \uC7A0\uC815 \uAC00\uC124\uC774\uC5D0\uC694.")
  );
}
function StudentDetailStudy() {
  const items = [
    { t: "\uC218\uD559 II \uBBF8\uC801\uBD84 5\uB2E8\uC6D0", sub: "\uC218\uD559", done: true },
    { t: "\uC601\uC5B4 \uB2E8\uC5B4 Day 14 (100\uAC1C)", sub: "\uC601\uC5B4", done: true },
    { t: "\uAD6D\uC5B4 \uBE44\uBB38\uD559 3\uC9C0\uBB38", sub: "\uAD6D\uC5B4", done: true },
    { t: "\uC0AC\uD68C \uB2E8\uC6D0\uD3C9\uAC00 7\uB2E8\uC6D0", sub: "\uC0AC\uD68C", done: true },
    { t: "\uACFC\uD559 \uD654\uD559 4\uB2E8\uC6D0 \uBB38\uC81C", sub: "\uACFC\uD559", done: true },
    { t: "\uC218\uD559 \uBAA8\uC758\uACE0\uC0AC \uC624\uB2F5 \uC815\uB9AC", sub: "\uC218\uD559", done: false },
    { t: "\uC601\uC5B4 \uB4E3\uAE30 2\uD68C", sub: "\uC601\uC5B4", done: false },
    { t: "\uAD6D\uC5B4 \uBB38\uD559 \uC791\uD488 \uC815\uB9AC", sub: "\uAD6D\uC5B4", done: false }
  ];
  const done = items.filter((i) => i.done).length;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uC9C4\uB3C4"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, done, "/", items.length)), /* @__PURE__ */ React.createElement(ProgressBar, { value: done, max: items.length, height: 8 }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC644\uB8CC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--success)" } }, done)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uB0A8\uC74C"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, items.length - done)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC790\uC2B5 \uB204\uC801"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--brand-600)" } }, "8.4h")))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC644\uB8CC\uD55C \uD559\uC2B5", subtitle: `${done}\uAC1C` }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, items.filter((i) => i.done).map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--success-bg)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 16, color: "var(--success)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1, textDecoration: "line-through" }, className: "kr-heading" }, it.t), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, it.sub))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB0A8\uC740 \uD559\uC2B5", subtitle: `${items.length - done}\uAC1C` }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, items.filter((i) => !i.done).map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 16, height: 16, borderRadius: 999, border: "1.5px dashed var(--fg-subtle)", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-strong)", flex: 1 }, className: "kr-heading" }, it.t), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, it.sub)))))));
}
function StudentDetailMemo() {
  return /* @__PURE__ */ React.createElement(Card, { padding: 0 }, [
    { d: "5\uC6D4 13\uC77C", t: "\uC774\uBC88 \uC8FC \uC601\uC5B4 \uB2E8\uC5B4 \uC9C4\uB3C4\uAC00 \uC88B\uC544\uC694. \uBAA8\uC758\uACE0\uC0AC \uC5B4\uBC95 \uBD80\uBD84\uB3C4 \uB2E4\uC74C \uC8FC\uC5D0 \uAC19\uC774 \uC815\uB9AC\uD574\uBD05\uC2DC\uB2E4.", visible: true },
    { d: "5\uC6D4 6\uC77C", t: "\uC218\uD559 \uB0B4\uC2E0 \uC810\uC218\uAC00 \uD754\uB4E4\uB838\uC5B4\uC694. \uBD80\uC871\uD55C \uB2E8\uC6D0 \uAC19\uC774 \uBCF4\uBA74 \uC88B\uACA0\uC2B5\uB2C8\uB2E4.", visible: true },
    { d: "4\uC6D4 28\uC77C", t: "\uD559\uBD80\uBAA8 \uC0C1\uB2F4 \uBA54\uBAA8: \uAC00\uC815 \uD559\uC2B5 \uC2DC\uAC04 \uBD80\uC871\uD568. 6\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uC804\uAE4C\uC9C0 \uBAA8\uB2C8\uD130\uB9C1.", visible: false }
  ].map((m, i, arr) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: 20, borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, m.d), /* @__PURE__ */ React.createElement(Chip, { tone: m.visible ? "success" : "neutral", size: "sm" }, m.visible ? "\uD559\uC0DD \uACF5\uAC1C" : "\uBE44\uACF5\uAC1C")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-default)", lineHeight: 1.5 }, className: "kr-heading" }, m.t))));
}
function MemoOverlay({ onClose, pickStudent }) {
  const [text, setText] = React.useState("");
  const [visible, setVisible] = React.useState(true);
  const [student, setStudent] = React.useState("");
  const [q, setQ] = React.useState("");
  const trapRef = useFocusTrap(true, onClose);
  const roster = (typeof TEACHER_STUDENTS !== "undefined" ? TEACHER_STUDENTS : []).filter((s) => s.name.includes(q));
  const canSave = student && text.trim();
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.45)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0C1\uB2F4 \uBA54\uBAA8", style: {
    position: "relative",
    width: 480,
    maxWidth: "94%",
    maxHeight: "90%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-pop)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, pickStudent ? "\uC0C1\uB2F4 \uAE30\uB85D \uCD94\uAC00" : `${student} \uC0C1\uB2F4 \uBA54\uBAA8`), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, "2\uD559\uB144 3\uBC18 \xB7 ", (/* @__PURE__ */ new Date()).toLocaleDateString("ko-KR"))), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), pickStudent && /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uC0DD \uC120\uD0DD", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD \uC774\uB984 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 168, overflow: "auto", border: "1px solid var(--line-subtle)", borderRadius: 12 }, className: "toss-scroll" }, roster.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 18, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uD559\uC0DD\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694") : roster.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => setStudent(s.name), style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    border: "none",
    cursor: "pointer",
    borderBottom: i < roster.length - 1 ? "1px solid var(--line-subtle)" : "none",
    background: student === s.name ? "var(--brand-50)" : "transparent"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: s.name[0], size: 30 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.grade)), student === s.name && /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--brand-500)" }))))), /* @__PURE__ */ React.createElement(Textarea, { value: text, onChange: setText, rows: 6, placeholder: student ? `${student} \uD559\uC0DD \uC0C1\uB2F4 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694` : "\uBA3C\uC800 \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uC138\uC694" }), /* @__PURE__ */ React.createElement("label", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    background: "var(--bg-muted)",
    cursor: "pointer"
  } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: visible, onChange: (e) => setVisible(e.target.checked), style: { width: 16, height: 16, accentColor: "var(--brand-500)" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-strong)" } }, "\uD559\uC0DD\uC5D0\uAC8C \uACF5\uAC1C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uAEBC\uB450\uBA74 \uBCF8\uC778\uC5D0\uAC8C\uB9CC \uBCF4\uC5EC\uC694"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !canSave, onClick: () => {
    showToast(`${student} \uC0C1\uB2F4 \uAE30\uB85D\uC744 \uC800\uC7A5\uD588\uC5B4\uC694`, "success");
    onClose();
  } }, "\uC800\uC7A5"))));
}
function TeacherCounseling({ go, openNotif }) {
  const { rows, loading, error, refetch } = useTeacherRoster();
  const needs = rows.filter((s) => s.needsCounseling);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { help: "teacher-counseling", title: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", subtitle: "\uC0C1\uB2F4\uC774 \uD544\uC694\uD55C \uD559\uC0DD\uC744 \uD655\uC778\uD558\uACE0 \uBA54\uC2DC\uC9C0\uB85C \uC5F0\uB77D\uD558\uC138\uC694", openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14, padding: 12, background: "var(--info-bg)", borderRadius: 10, fontSize: 12, color: "var(--brand-600)", display: "flex", gap: 8, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcShield, { size: 14, style: { flexShrink: 0, marginTop: 1 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "AI \uC9C4\uD589\uB3C4\xB7\uC131\uC801 \uC785\uB825 \uD604\uD669\uC744 \uBC14\uD0D5\uC73C\uB85C \uC0B4\uD3B4\uBCFC \uD559\uC0DD\uC744 \uBAA8\uC558\uC5B4\uC694. (\uD559\uC5C5\xB7\uC0C1\uB2F4 \uAD00\uC810 \uCC38\uACE0 \uC815\uBCF4)")), loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 88, radius: 14 }))) : error ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 24 }), title: "\uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: refetch }, "\uB2E4\uC2DC \uC2DC\uB3C4") })) : needs.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 24 }), title: "\uC0C1\uB2F4\uC774 \uD544\uC694\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD604\uC7AC \uBAA8\uB4E0 \uD559\uC0DD\uC774 \uC798 \uB530\uB77C\uC624\uACE0 \uC788\uC5B4\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, needs.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.id, padding: 20 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 48 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, counselReason(s)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)" } }, "\xB7 ", s.grade || "\uD559\uB144 \uBBF8\uC815")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" }, className: "kr-heading" }, "AI \uC9C4\uD589\uB3C4 ", s.aiProgress || 0, "% \xB7 \uD559\uC2B5 ", s.studyDone, "/", s.studyTotal, " \xB7 \uB9C8\uC9C0\uB9C9 \uD65C\uB3D9 ", fmtActivity(s.lastActivityAt))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: () => openStudentDetail(go, s.id), leading: /* @__PURE__ */ React.createElement(IcUser, { size: 12 }) }, "\uC0C1\uC138 \uBCF4\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => go("messages"), leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 12 }) }, "\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30"))))))));
}
function QuickMessageDialog({ student, onClose }) {
  const [text, setText] = React.useState("");
  const trapRef = useFocusTrap(true, onClose);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": `${student.name}\uB2D8\uC5D0\uAC8C \uBA54\uC2DC\uC9C0`, style: { position: "relative", width: "min(440px, 100%)", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)", animation: "sheetIn 320ms var(--ease-toss)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: student.name.slice(0, 1), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, student.name, "\uB2D8\uC5D0\uAC8C \uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC0C1\uB2F4 \uC694\uCCAD\uC5D0 \uB300\uD55C \uB2F5\uBCC0")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 18 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 6 } }, "\uBE60\uB978 \uB2F5\uBCC0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, [
    "\uD655\uC778\uD588\uC5B4\uC694. \uB2E4\uC74C \uC8FC \uD654\uC694\uC77C \uC5B4\uB5A8\uAE4C\uC694?",
    "\uB0B4\uC77C \uC810\uC2EC\uC2DC\uAC04\uC5D0 \uC7A0\uAE50 \uB9CC\uB0A0\uAE4C\uC694?",
    "\uBA3C\uC800 \uBA54\uC2DC\uC9C0\uB85C \uC790\uC138\uD788 \uB4E4\uB824\uC8FC\uC138\uC694"
  ].map((q) => /* @__PURE__ */ React.createElement("button", { key: q, onClick: () => setText(q), style: { padding: "6px 10px", border: "1px solid var(--line)", background: "var(--bg-surface)", borderRadius: 8, fontSize: 11, color: "var(--fg-default)", cursor: "pointer" }, className: "kr-heading" }, q)))), /* @__PURE__ */ React.createElement(Textarea, { value: text, onChange: setText, rows: 5, placeholder: `${student.name}\uB2D8\uC5D0\uAC8C \uBCF4\uB0BC \uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694` }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !text.trim(), leading: /* @__PURE__ */ React.createElement(IcSend, { size: 14 }), onClick: onClose }, "\uBCF4\uB0B4\uAE30"))));
}
function TeacherNotifications({ openNotif }) {
  const [items, setItems] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        if (alive) setItems(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const loading = items === null;
  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return fmtActivity(iso) === "\uD65C\uB3D9 \uC5C6\uC74C" ? d.toLocaleDateString("ko-KR") : fmtActivity(iso);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { title: "\uC54C\uB9BC", subtitle: "\uD559\uAE09 \uD65C\uB3D9 \uC54C\uB9BC\uC744 \uD655\uC778\uD558\uC138\uC694", openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "20px 28px", background: "var(--bg-canvas)" } }, loading ? /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 48, radius: 10 })))) : items.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 24 }), title: "\uC0C8 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09\uC5D0 \uC0C8\uB85C\uC6B4 \uD65C\uB3D9\uC774 \uC0DD\uAE30\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, items.map((n, i) => {
    const unread = !(n.read || n.readAt);
    return /* @__PURE__ */ React.createElement("div", { key: n.id || i, style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "16px 20px",
      borderBottom: i < items.length - 1 ? "1px solid var(--line-subtle)" : "none",
      background: unread ? "rgba(49,130,246,0.025)" : "transparent"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "var(--brand-50)",
      color: "var(--brand-500)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    } }, /* @__PURE__ */ React.createElement(IcBell, { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, n.title || n.type || "\uC54C\uB9BC"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, fmt(n.createdAt || n.at))), (n.body || n.message) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.5 }, className: "kr-heading" }, n.body || n.message)), unread && /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--brand-500)", marginTop: 14 } }));
  }))));
}
function TeacherBilling({ openNotif }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", subtitle: "\uBB34\uB8CC \uD50C\uB79C\uC73C\uB85C \uB04A\uAE40 \uC5C6\uC774 \uC6B4\uC601\uD558\uC138\uC694", openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: "20px 24px 28px" } }, /* @__PURE__ */ React.createElement(BillingScreen, { go: () => {
  }, role: "teacher" }))));
}
function TeacherApp({ initialScreen = "dashboard" }) {
  const [screen, setScreen] = usePersistentScreen("teacher-web", initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifItems, setNotifItems] = React.useState(null);
  const openNotif = () => setNotifOpen(true);
  React.useEffect(() => {
    if (!notifOpen) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        if (alive) setNotifItems(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        if (alive) setNotifItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [notifOpen]);
  const tour = useTour(TEACHER_TOUR_STEPS, "teacher");
  React.useEffect(() => {
    try {
      if (window.__LIVE_MODE && localStorage.getItem("jinro:webtour:teacher")) tour.setPhase("done");
    } catch (e) {
    }
  }, []);
  React.useEffect(() => {
    if (tour.phase === "done") {
      try {
        localStorage.setItem("jinro:webtour:teacher", "1");
      } catch (e) {
      }
    }
  }, [tour.phase]);
  const teacherNavId = screen === "student-detail" ? "students" : screen.startsWith("admissions") ? "admissions-hub" : screen;
  const wrapNav = (s) => {
    setScreen(s);
    setNavOpen(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: isMobile ? "column" : "row", height: "100%", background: "var(--bg-canvas)", position: "relative", overflow: "hidden" } }, isMobile && /* @__PURE__ */ React.createElement(MobileTopBar, { title: "\uC9C4\uB85C\uB098\uCE68\uBC18 \xB7 \uAD50\uC0AC", onMenu: () => setNavOpen(true) }), isMobile ? /* @__PURE__ */ React.createElement(SidebarDrawer, { open: navOpen, onClose: () => setNavOpen(false) }, /* @__PURE__ */ React.createElement(TeacherSidebar, { activeId: teacherNavId, onChange: wrapNav })) : /* @__PURE__ */ React.createElement(TeacherSidebar, { activeId: teacherNavId, onChange: setScreen }), /* @__PURE__ */ React.createElement("main", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, maxWidth: "100%", minHeight: 0, overflowY: "auto", overflowX: "hidden" } }, screen === "dashboard" && /* @__PURE__ */ React.createElement(TeacherDashboard, { go: setScreen, openNotif }), screen === "classroom" && /* @__PURE__ */ React.createElement(TeacherClassroom, { go: setScreen, openNotif }), screen === "students" && /* @__PURE__ */ React.createElement(TeacherStudents, { go: setScreen, openNotif }), screen === "student-detail" && /* @__PURE__ */ React.createElement(TeacherStudentDetail, { go: setScreen, openNotif }), screen === "counseling" && /* @__PURE__ */ React.createElement(TeacherCounseling, { go: setScreen, openNotif }), screen === "messages" && /* @__PURE__ */ React.createElement(TeacherMessages, { openNotif, go: setScreen }), screen === "calendar" && /* @__PURE__ */ React.createElement(TeacherCalendar, { openNotif, go: setScreen }), screen === "notifications" && /* @__PURE__ */ React.createElement(TeacherNotifications, { openNotif }), screen === "billing" && /* @__PURE__ */ React.createElement(TeacherBilling, { openNotif }), screen === "ai-view" && /* @__PURE__ */ React.createElement(TeacherAIView, null), screen === "completion" && /* @__PURE__ */ React.createElement(CompletionStatus, { go: setScreen }), screen === "ai-coach" && /* @__PURE__ */ React.createElement(AIChatRAG, { go: setScreen, coach: true }), screen === "admissions-hub" && /* @__PURE__ */ React.createElement(AdmissionsHub, { go: setScreen }), screen === "volunteers" && /* @__PURE__ */ React.createElement(VolunteersScreen, { go: setScreen }), screen === "scholarships" && /* @__PURE__ */ React.createElement(ScholarshipsScreen, { go: setScreen }), screen === "admissions-univ" && /* @__PURE__ */ React.createElement(UniversityDetail, { go: setScreen }), screen === "admissions-dept" && /* @__PURE__ */ React.createElement(DepartmentDetail, { go: setScreen }), screen === "consents" && /* @__PURE__ */ React.createElement(ConsentManagement, { go: setScreen, role: "teacher" }), screen === "announcements" && /* @__PURE__ */ React.createElement(AnnouncementsScreen, { role: "teacher", variant: "web" }), screen === "profile" && /* @__PURE__ */ React.createElement(TeacherProfile, { go: setScreen, openNotif }), screen === "teacher-info" && /* @__PURE__ */ React.createElement(TeacherInfoScreen, { go: setScreen }), screen === "settings-password" && /* @__PURE__ */ React.createElement(SettingsPassword, { back: () => setScreen("profile") }), screen === "settings-notifications" && /* @__PURE__ */ React.createElement(SettingsNotifications, { back: () => setScreen("profile"), role: "teacher" }), screen === "settings-suggest" && /* @__PURE__ */ React.createElement(SettingsSuggestion, { back: () => setScreen("profile") }), screen === "settings-announcements" && /* @__PURE__ */ React.createElement(SettingsAnnouncements, { back: () => setScreen("profile") }), screen === "settings-terms" && /* @__PURE__ */ React.createElement(SettingsTerms, { back: () => setScreen("profile") })), notifOpen && /* @__PURE__ */ React.createElement(TeacherNotifPopover, { items: notifItems, onClose: () => setNotifOpen(false), onAll: () => {
    setNotifOpen(false);
    setScreen("notifications");
  } }), /* @__PURE__ */ React.createElement(TourOverlay, { tour }));
}
function TeacherNotifPopover({ items, onClose, onAll }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, zIndex: 40 } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 64,
    right: 28,
    zIndex: 41,
    width: 360,
    background: "var(--bg-elevated)",
    borderRadius: 16,
    boxShadow: "var(--shadow-pop)",
    overflow: "hidden",
    animation: "sheetIn 220ms var(--ease-toss)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 18px", borderBottom: "1px solid var(--line-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC54C\uB9BC"), /* @__PURE__ */ React.createElement("button", { onClick: onAll, style: { background: "transparent", border: "none", color: "var(--brand-600)", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uC804\uCCB4 \uBCF4\uAE30")), items === null ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 18px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\u2026") : items.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "28px 18px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uC544\uC9C1 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694") : items.map((n) => {
    const unread = !(n.read || n.readAt);
    return /* @__PURE__ */ React.createElement("div", { key: n.id, style: { padding: "14px 18px", borderBottom: "1px solid var(--line-subtle)", display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: unread ? "var(--brand-500)" : "transparent", marginTop: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, n.title || n.type || "\uC54C\uB9BC"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, fmtActivity(n.createdAt))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, n.body || n.message)));
  })));
}
Object.assign(window, { TeacherApp, TeacherTopbar, TeacherSidebar });
