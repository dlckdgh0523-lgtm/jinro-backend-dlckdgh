var _a;
const STUDENT_NAV = [
  { id: "dashboard", label: "\uD648", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { id: "grades-trend", label: "\uC131\uC801", icon: /* @__PURE__ */ React.createElement(IcChart, null) },
  { id: "career-report", label: "\uC9C4\uB85C", icon: /* @__PURE__ */ React.createElement(IcCompass, null) },
  { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null) },
  { id: "profile", label: "\uB354\uBCF4\uAE30", icon: /* @__PURE__ */ React.createElement(IcMore, null) }
];
const STUDENT_NOTIFICATIONS = [];
const AI_CHAT_INITIAL = [
  { role: "ai", text: "\uC548\uB155 \uC9C0\uD6C8\uC544, \uC9C4\uB85C\uB098\uCE68\uBC18\uC774\uC5D0\uC694. \uC624\uB298\uC740 \uAC00\uBCCD\uAC8C \uC2DC\uC791\uD574\uBCFC\uAC8C\uC694. \uC694\uC998 \uD559\uAD50\uC5D0\uC11C \uAC00\uC7A5 \uBAB0\uC785\uD574\uC11C \uD55C \uC77C\uC774 \uC788\uB2E4\uBA74 \uBB50\uC600\uC5B4\uC694?" },
  { role: "user", text: "\uB3D9\uC544\uB9AC\uC5D0\uC11C \uC601\uC0C1 \uD3B8\uC9D1\uC744 \uD588\uC5B4\uC694. \uCD95\uC81C \uC601\uC0C1 \uB9CC\uB4DC\uB294 \uAC8C \uC7AC\uBC0C\uC5C8\uC5B4\uC694." },
  { role: "ai", text: "\uC601\uC0C1 \uB9CC\uB4E4 \uB54C \uC5B4\uB5A4 \uBD80\uBD84\uC774 \uC81C\uC77C \uC7AC\uBC0C\uC5C8\uC5B4\uC694? \uCD2C\uC601, \uD3B8\uC9D1, \uAE30\uD68D \uC911\uC5D0\uC11C\uC694." },
  { role: "user", text: "\uD3B8\uC9D1\uD560 \uB54C\uC694. \uCEF7 \uC21C\uC11C \uBC14\uAFB8\uBA74\uC11C \uBD84\uC704\uAE30 \uBC14\uB00C\uB294 \uAC8C \uC2E0\uAE30\uD588\uC5B4\uC694." },
  { role: "ai", text: "\uADF8\uB807\uAD6C\uB098. \uADF8\uB7FC \uCE5C\uAD6C\uB4E4\uC774 \uADF8 \uC601\uC0C1\uC744 \uBCF4\uACE0 \uC5B4\uB5A4 \uBC18\uC751\uC774\uC5C8\uC744 \uB54C \uAC00\uC7A5 \uAE30\uBEE4\uC5B4\uC694?" }
];
const SIGNALS = [
  { tag: "\uD765\uBBF8", text: "\uC601\uC0C1 \uD3B8\uC9D1, \uCEF7 \uAD6C\uC131", tone: "brand" },
  { tag: "\uAC15\uC810", text: "\uC2DC\uAC01\uC801 \uD750\uB984 \uAC10\uAC01", tone: "mint" },
  { tag: "\uAC00\uCE58", text: "\uD0C0\uC778\uC758 \uBC18\uC751, \uD45C\uD604", tone: "purple" },
  { tag: "\uB9E5\uB77D", text: "\uB3D9\uC544\uB9AC \uD65C\uB3D9 \uBAB0\uC785", tone: "info" }
];
const QUICK_REPLIES = [
  "\uC880 \uB354 \uC0DD\uAC01\uD574\uBCFC\uAC8C\uC694",
  "\uC798 \uBAA8\uB974\uACA0\uC5B4\uC694",
  "\uC608\uC2DC\uB97C \uB4E4\uC5B4\uC904 \uC218 \uC788\uC5B4\uC694?"
];
function StudentDashboardSkeleton() {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Skeleton, { width: 160, height: 24 }), /* @__PURE__ */ React.createElement(Skeleton, { width: 120, height: 14, style: { marginTop: 8 } })), /* @__PURE__ */ React.createElement(Skeleton, { width: 40, height: 40, radius: 10 })), /* @__PURE__ */ React.createElement(Skeleton, { height: 150, radius: 16, style: { marginBottom: 16 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 72, radius: 14 }))), /* @__PURE__ */ React.createElement(Skeleton, { height: 130, radius: 16, style: { marginBottom: 12 } }), /* @__PURE__ */ React.createElement(Skeleton, { height: 200, radius: 16 }));
}
function StudentDashboard({ go, openNotif, variant = "A" }) {
  const dash = typeof useApi === "function" ? useApi(() => typeof dataApi !== "undefined" ? dataApi.studentDashboard() : mockApi.studentDashboard(), []) : { loading: false, error: null, data: {} };
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
    })();
  }, []);
  const [unread, setUnread] = React.useState(0);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications?unreadOnly=true&limit=50", { method: "GET" });
        const items = Array.isArray(r.data) ? r.data : r.data || [];
        setUnread(items.filter((n) => !n.read).length);
      } catch (e) {
        setUnread(0);
      }
    })();
  }, []);
  if (dash.loading) return /* @__PURE__ */ React.createElement(StudentDashboardSkeleton, null);
  if (dash.error) return /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 16px", background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ErrorState, { title: "\uB300\uC2DC\uBCF4\uB4DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: dash.error.message, onRetry: dash.refetch }));
  const FEATURES = [
    { id: "volunteer", emoji: "\u{1F91D}", title: "\uBD09\uC0AC\uD65C\uB3D9 \uAC80\uC0C9", desc: "\uCCAD\uC18C\uB144 \uAC00\uB2A5 \uBD09\uC0AC 1,000+\uAC74 \xB7 \uD559\uC885 \uC778\uC131\uD3C9\uAC00 \uBC18\uC601", goTo: "volunteer" },
    { id: "experience", emoji: "\u{1F3AF}", title: "\uC9C4\uB85C\xB7\uC9C1\uC5C5\uCCB4\uD5D8", desc: "\uCEE4\uB9AC\uC5B4\uB137 \uC790\uB8CC 455+\uAC74 \xB7 \uD559\uC0DD\uBD80 \uC804\uACF5\uC801\uD569\uC131 \uD575\uC2EC", goTo: "materials" },
    { id: "foreign", emoji: "\u{1F30F}", title: "\uD574\uC678\uB300\uD559", desc: "\uBBF8\uAD6D\xB7\uC77C\uBCF8\xB7\uC601\uAD6D \uB4F1 \uD559\uBE44\xB7\uC878\uC5C5\uB960\xB7\uCDE8\uC5C5\uB960", goTo: "foreign" },
    { id: "scholarship", emoji: "\u{1F4B0}", title: "\uC7A5\uD559\uAE08", desc: "\uD55C\uAD6D\uC7A5\uD559\uC7AC\uB2E8 1,850+\uAC74 \xB7 \uC9C0\uC790\uCCB4\xB7\uAE30\uC5C5 \uC7A5\uD559\uAE08", goTo: "scholarship" },
    { id: "employment", emoji: "\u{1F4CA}", title: "\uB300\uD559 \uCDE8\uC5C5\uB960", desc: "\uD559\uACFC\uBCC4 \uCDE8\uC5C5\uB960\xB7\uC720\uC9C0\uC728 \uB370\uC774\uD130", goTo: "admissions-hub" },
    { id: "ai", emoji: "\u{1F916}", title: "AI \uC9C4\uB85C \uC0C1\uB2F4", desc: "\uB2E8\uACC4\uBCC4 \uB9DE\uCDA4 \uC0C1\uB2F4 \xB7 \uB370\uC774\uD130 \uADFC\uAC70 \uCD94\uCC9C", goTo: "ai-chat" }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--fg-strong)",
    letterSpacing: "-0.4px",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  } }, me && me.name ? `\uC548\uB155\uD558\uC138\uC694, ${me.name}\uB2D8` : "\uC548\uB155\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, "\uC624\uB298\uB3C4 \uD55C \uAC78\uC74C\uC529 \uB098\uC544\uAC00\uBCFC\uAE4C\uC694?")), /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 22 }), onClick: openNotif, badge: unread, ariaLabel: "\uC54C\uB9BC" }))), variant === "A" ? /* @__PURE__ */ React.createElement(DashboardHeroA, { go }) : /* @__PURE__ */ React.createElement(DashboardHeroB, { go }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 8, padding: "0 2px" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC5D0\uC11C \uD560 \uC218 \uC788\uB294 \uAC83"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 } }, FEATURES.map((f) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: f.id,
      onClick: () => go(f.goTo),
      style: {
        background: "var(--bg-elevated)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
        transition: "transform .1s, box-shadow .1s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, marginBottom: 4 } }, f.emoji),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, f.title),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.4 } }, f.desc)
  )))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(UpcomingDatesCard, { go })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(QuestionCard, { q: QUESTION_CARDS[0], compact: true, onAnswer: () => go("ai-counseling") })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(StrategyStatusCard, { status: "forming", evidenceCount: 9, lastUpdated: "2026-05-16" })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(WeeklyActionsCard, { go })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, margin: "16px 0" } }, [
    { id: "ai", label: "AI \uC0C1\uB2F4", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), color: "var(--accent-purple)", bg: "var(--accent-purple-bg)", go: "ai-counseling" },
    { id: "admissions", label: "\uB300\uD559\xB7\uC785\uC2DC", icon: /* @__PURE__ */ React.createElement(IcGraduation, null), color: "var(--brand-600)", bg: "var(--brand-50)", go: "admissions-hub" },
    { id: "messages", label: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null), color: "var(--success)", bg: "var(--success-bg)", go: "messages" },
    { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null), color: "var(--accent-mint)", bg: "var(--accent-mint-bg)", go: "calendar" }
  ].map((q) => /* @__PURE__ */ React.createElement("button", { key: q.id, onClick: () => go(q.go), style: {
    border: "none",
    background: "var(--bg-surface)",
    borderRadius: 14,
    padding: "12px 6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 10, background: q.bg, color: q.color, display: "flex", alignItems: "center", justifyContent: "center" } }, React.cloneElement(q.icon, { size: 18 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--fg-default)" } }, q.label)))), /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uCD5C\uADFC \uC131\uC801 \uBCC0\uD654",
      action: /* @__PURE__ */ React.createElement("button", { onClick: () => go("grades-trend"), style: { border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 } }, "\uC790\uC138\uD788", /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 })),
      style: { marginBottom: 12 }
    },
    /* @__PURE__ */ React.createElement(MiniTrendChart, null),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uD3C9\uADE0"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)" } }, "84.8", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)", fontWeight: 500 } }, "\uC810"))), /* @__PURE__ */ React.createElement(Chip, { tone: "success", leading: /* @__PURE__ */ React.createElement(IcArrowUp, { size: 11 }) }, "+2.4 \uC9C0\uB09C \uBAA8\uC758\uACE0\uC0AC \uB300\uBE44")),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 14, alignItems: "flex-end", height: 64 } }, [{ s: "\uAD6D", v: 93, t: "success" }, { s: "\uC218", v: 82, t: "success" }, { s: "\uC601", v: 88, t: "success" }, { s: "\uC0AC", v: 91, t: "neutral" }, { s: "\uACFC", v: 70, t: "danger" }].map((b) => /* @__PURE__ */ React.createElement("div", { key: b.s, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 10, fontWeight: 700, color: "var(--fg-muted)" } }, b.v), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: b.v / 100 * 40, borderRadius: 6, background: `var(--${b.t === "neutral" ? "line-strong" : b.t})`, opacity: b.t === "neutral" ? 0.6 : 1 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, b.s)))),
    /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 16 }), onClick: () => go("grades-input"), style: { marginTop: 14 } }, "\uC774\uBC88 \uC2DC\uD5D8 \uC131\uC801 \uC785\uB825\uD558\uAE30")
  ), /* @__PURE__ */ React.createElement(Card, { padding: 16, onClick: () => go("billing"), hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uD559\uC0DD \uD50C\uB79C \xB7 \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", marginTop: 6 } }, "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, "5\uC6D4 31\uC77C\uAE4C\uC9C0 \uBAA8\uB4E0 \uAE30\uB2A5 \uC0AC\uC6A9 \uAC00\uB2A5")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "var(--fg-subtle)" }))));
}
function DashboardHeroA({ go }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 20, style: {
    background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)",
    color: "#fff",
    marginBottom: 0,
    boxShadow: "0 12px 28px rgba(49,130,246,0.32)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, opacity: 0.85 } }, "\uB098\uC758 \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 19, fontWeight: 700, marginTop: 4, wordBreak: "keep-all" }, className: "kr-heading" }, "\uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85, marginTop: 4 } }, "\uD55C\uAD6D\uC608\uC220\uC885\uD569\uD559\uAD50 \xB7 \uC601\uC0C1\uC774\uB860\uACFC")), /* @__PURE__ */ React.createElement("div", { style: {
    width: 44,
    height: 44,
    borderRadius: 14,
    flexShrink: 0,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(20px)"
  } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 22, color: "#fff" }))), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "rgba(255,255,255,0.2)", margin: "16px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginBottom: 2 } }, "AI \uC0C1\uB2F4 \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 700 } }, "62%"), /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 5, background: "rgba(255,255,255,0.25)", borderRadius: 999, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "62%", height: "100%", background: "#fff" } })))), /* @__PURE__ */ React.createElement("button", { onClick: () => go("career-report"), style: {
    border: "none",
    background: "#fff",
    color: "var(--brand-600)",
    padding: "8px 14px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0
  } }, "\uB9AC\uD3EC\uD2B8 \uBCF4\uAE30")));
}
function DashboardHeroB({ go }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 0, border: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uB098\uC758 \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("button", { style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 12, fontWeight: 600 } }, "\uC218\uC815")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.5px" }, className: "kr-heading" }, "\uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 4 } }, "\uD55C\uAD6D\uC608\uC220\uC885\uD569\uD559\uAD50 \xB7 \uC601\uC0C1\uC774\uB860\uACFC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: 12, background: "var(--brand-50)", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--brand-600)", fontWeight: 600 } }, "AI \uC0C1\uB2F4 \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 700, color: "var(--brand-600)", marginTop: 4 } }, "62%")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: 12, background: "var(--success-bg)", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--success)", fontWeight: 600 } }, "\uB2EC\uC131\uB960"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 700, color: "var(--success)", marginTop: 4 } }, "74%"))));
}
function MiniTrendChart() {
  const pts = [78, 80, 82.5, 83.2, 84.8];
  const w = 320, h = 80, pad = 8;
  const max = 90, min = 70;
  const xs = pts.map((_, i) => pad + i * (w - pad * 2) / (pts.length - 1));
  const ys = pts.map((p) => h - pad - (p - min) / (max - min) * (h - pad * 2));
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaPath = linePath + ` L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;
  return /* @__PURE__ */ React.createElement("div", { style: { width: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, style: { width: "100%", height: "auto" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "ga", x1: "0", x2: "0", y1: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#3182F6", stopOpacity: "0.18" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#3182F6", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("path", { d: areaPath, fill: "url(#ga)" }), /* @__PURE__ */ React.createElement("path", { d: linePath, fill: "none", stroke: "#3182F6", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }), xs.map((x, i) => /* @__PURE__ */ React.createElement(
    "circle",
    {
      key: i,
      cx: x,
      cy: ys[i],
      r: i === xs.length - 1 ? 4 : 3,
      fill: i === xs.length - 1 ? "#3182F6" : "#fff",
      stroke: "#3182F6",
      strokeWidth: "2"
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg-subtle)", padding: "4px 4px 0" } }, /* @__PURE__ */ React.createElement("span", null, "1\uC6D4"), /* @__PURE__ */ React.createElement("span", null, "2\uC6D4"), /* @__PURE__ */ React.createElement("span", null, "3\uC6D4"), /* @__PURE__ */ React.createElement("span", null, "4\uC6D4"), /* @__PURE__ */ React.createElement("span", null, "5\uC6D4")));
}
function AICounseling({ go, openSignals }) {
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const [signals, setSignals] = React.useState([]);
  const [stage, setStage] = React.useState("explore");
  const [evidenceCount, setEvidenceCount] = React.useState(0);
  const [progress, setProgress] = React.useState(10);
  const [initErr, setInitErr] = React.useState(false);
  const [showSig, setShowSig] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const scrollRef = React.useRef(null);
  const SIG_TONE = { "\uD765\uBBF8": "brand", "\uAC15\uC810": "mint", "\uAC00\uCE58": "purple", "\uB9E5\uB77D": "info" };
  const initSession = React.useCallback(async () => {
    if (!window.__isLoggedIn || !window.__isLoggedIn()) {
      setMsgs([{ role: "ai", text: "\uB85C\uADF8\uC778\uD558\uBA74 AI \uC9C4\uB85C \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD560 \uC218 \uC788\uC5B4\uC694." }]);
      return;
    }
    setInitErr(false);
    try {
      const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" });
      let sid = active && active.data && active.data.id;
      if (sid) {
        const t = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/transcript", { method: "GET" });
        const loaded = (t.data.messages || []).map((m) => ({ role: m.role, text: m.text }));
        setMsgs(loaded.length ? loaded : [{ role: "ai", text: "\uC548\uB155\uD558\uC138\uC694, \uC9C4\uB85C\uB098\uCE68\uBC18\uC774\uC5D0\uC694. \uC694\uC998 \uD559\uAD50\uC5D0\uC11C \uAC00\uC7A5 \uBAB0\uC785\uD574\uC11C \uD55C \uC77C\uC774 \uC788\uB2E4\uBA74 \uBB50\uC600\uC5B4\uC694?" }]);
      } else {
        const created = await window.__apiFetch("/ai-counseling/sessions", { method: "POST" });
        sid = created.data.id;
        setMsgs([{ role: "ai", text: "\uC548\uB155\uD558\uC138\uC694, \uC9C4\uB85C\uB098\uCE68\uBC18\uC774\uC5D0\uC694. \uC624\uB298\uC740 \uAC00\uBCCD\uAC8C \uC2DC\uC791\uD574\uBCFC\uAC8C\uC694. \uC694\uC998 \uD559\uAD50\uC5D0\uC11C \uAC00\uC7A5 \uBAB0\uC785\uD574\uC11C \uD55C \uC77C\uC774 \uC788\uB2E4\uBA74 \uBB50\uC600\uC5B4\uC694?" }]);
      }
      setSessionId(sid);
      refreshProgress(sid);
    } catch (e) {
      setInitErr(true);
      setMsgs([{ role: "ai", text: e && e.body && e.body.message || "\uC0C1\uB2F4\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694. \uB2E4\uC2DC \uC2DC\uB3C4 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694." }]);
    }
  }, []);
  React.useEffect(() => {
    initSession();
  }, [initSession]);
  React.useEffect(() => {
    const onVis = () => {
      if (!document.hidden && sessionId) refreshProgress(sessionId);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onVis);
    };
  }, [sessionId]);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);
  const refreshProgress = async (sid) => {
    try {
      const p = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/progress", { method: "GET" });
      setSignals(p.data.signals || []);
      setEvidenceCount(p.data.evidenceCount || 0);
      setStage(p.data.stage || "explore");
      setProgress(p.data.completeness || 10);
    } catch (e) {
    }
  };
  const send = async (text) => {
    if (!text.trim() || thinking) return;
    let sid = sessionId;
    if (!sid) {
      try {
        const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" });
        sid = active && active.data && active.data.id || (await window.__apiFetch("/ai-counseling/sessions", { method: "POST" })).data.id;
        setSessionId(sid);
      } catch (e) {
        setInitErr(true);
        return;
      }
    }
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    try {
      const res = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/messages?stream=false", {
        method: "POST",
        body: JSON.stringify({ text })
      });
      const data = res && res.data;
      const aiText = data && data.message && data.message.text || "\uC751\uB2F5\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694.";
      const meta = data ? {
        signals: Array.isArray(data.metaSignals) ? data.metaSignals : [],
        shouldFinalize: !!data.shouldFinalize,
        finalizeReason: data.finalizeReason || null,
        proposedTarget: data.proposedTarget || null
      } : null;
      setMsgs((m) => [...m, meta ? { role: "ai", text: aiText, meta } : { role: "ai", text: aiText }]);
    } catch (e) {
      const msg = e && e.body && (e.body.message || e.body.error && e.body.error.message) || "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.";
      setMsgs((m) => [...m, { role: "ai", text: msg }]);
    } finally {
      setThinking(false);
      refreshProgress(sid);
    }
  };
  const STAGE_LABEL = { explore: "\u2460 \uD0D0\uC0C9", profile: "\u2461 \uD30C\uC545", recommend: "\u2462 \uCD94\uCC9C", prepare: "\u2463 \uC900\uBE44" };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "8px 12px 12px",
    background: "var(--bg-surface)",
    borderBottom: "1px solid var(--line-subtle)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center", fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, "AI \uC9C4\uB85C \uC0C1\uB2F4"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcMore, { size: 20 }), onClick: () => setMenuOpen((o) => !o), ariaLabel: "\uB354\uBCF4\uAE30" }), menuOpen && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { onClick: () => setMenuOpen(false), style: { position: "fixed", inset: 0, zIndex: 50 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", right: 0, marginTop: 6, minWidth: 180, background: "var(--bg-surface)", borderRadius: 12, boxShadow: "var(--shadow-pop)", border: "1px solid var(--line)", zIndex: 51, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    setMenuOpen(false);
    if (!confirm("\uC0C8 \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD560\uAE4C\uC694? \uC9C0\uAE08 \uC0C1\uB2F4\uC740 \uC885\uB8CC\uB3FC\uC694.")) return;
    try {
      const r = await window.__apiFetch("/ai-counseling/sessions", { method: "POST" });
      const newSid = r && r.data && r.data.id;
      if (newSid) {
        setSessionId(newSid);
        setMsgs([]);
        setSignals([]);
        setEvidenceCount(0);
        setStage("explore");
        setProgress(10);
        initSession();
      }
    } catch (e) {
      alert("\uC0C8 \uC0C1\uB2F4 \uC2DC\uC791\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  }, style: { width: "100%", padding: "12px 14px", border: "none", background: "transparent", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--fg-default)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), " \uC0C8 \uC0C1\uB2F4 \uC2DC\uC791"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setMenuOpen(false);
    go && go("career-report");
  }, disabled: evidenceCount < 5, style: { width: "100%", padding: "12px 14px", border: "none", borderTop: "1px solid var(--line-subtle)", background: "transparent", textAlign: "left", fontSize: 13, fontWeight: 600, color: evidenceCount < 5 ? "var(--fg-subtle)" : "var(--fg-default)", cursor: evidenceCount < 5 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), " \uC9C4\uB85C \uB9AC\uD3EC\uD2B8 \uBCF4\uAE30 ", evidenceCount < 5 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, "(\uB2E8\uC11C \uB354 \uD544\uC694)")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setMenuOpen(false);
    setShowSig(true);
  }, style: { width: "100%", padding: "12px 14px", border: "none", borderTop: "1px solid var(--line-subtle)", background: "transparent", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--fg-default)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 14 }), " \uC9C0\uAE08\uAE4C\uC9C0 \uBAA8\uC740 \uB2E8\uC11C"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 } }, /* @__PURE__ */ React.createElement(ProgressBar, { value: progress, height: 4 }), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, fontWeight: 700, color: "var(--brand-600)", minWidth: 36, textAlign: "right" } }, progress, "%")), (() => {
    const STEPS = [["explore", "\uD0D0\uC0C9"], ["profile", "\uD30C\uC545"], ["recommend", "\uCD94\uCC9C"], ["prepare", "\uC900\uBE44"]];
    const cur = STEPS.findIndex((s) => s[0] === stage);
    const hint = stage === "explore" ? `\uB300\uD654\uB85C \uD765\uBBF8\xB7\uAC15\uC810\xB7\uAC00\uCE58\xB7\uB9E5\uB77D \uB2E8\uC11C\uB97C \uBAA8\uC544\uC694. AI\uAC00 \uCDA9\uBD84\uD788 \uD30C\uC545\uD588\uB2E4\uACE0 \uD310\uB2E8\uD558\uBA74 \uB2E4\uC74C \uB2E8\uACC4\uB85C \uB118\uC5B4\uAC00\uC694` : stage === "profile" ? `\uC9C0\uAE08\uAE4C\uC9C0 \uBAA8\uC740 \uB2E8\uC11C\uB97C \uC815\uB9AC\uD574 \uD655\uC778\uD574\uC694. \uBC29\uD5A5\uC774 \uC7A1\uD788\uBA74 AI\uAC00 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uCD94\uCC9C \uB2E8\uACC4\uB85C \uC548\uB0B4\uD574\uC694` : stage === "recommend" ? `\uB370\uC774\uD130 \uADFC\uAC70\uB85C \uC9C1\uC5C5\xB7\uC804\uACF5\xB7\uB300\uD559\uC744 \uC81C\uC548\uD574\uC694. \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uC9C4\uB85C\uB97C \u2018\uC9C4\uB85C \uBAA9\uD45C\u2019\uB85C \uC800\uC7A5\uD558\uBA74 \uC900\uBE44 \uB2E8\uACC4\uB85C \uB118\uC5B4\uAC00\uC694` : `\uC785\uC2DC\xB7\uC131\uC801\uACFC \uC5F0\uACB0\uD574 \uC0C1\uB2F4\uC744 \uB9C8\uBB34\uB9AC\uD574\uC694. \uCDA9\uBD84\uD55C \uB2E8\uC11C\uAC00 \uC313\uC774\uBA74 AI\uAC00 \uC790\uB3D9\uC73C\uB85C \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4\uC5B4\uB4DC\uB824\uC694`;
    return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, STEPS.map(([id, label], i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: id }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      fontSize: 10,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: i <= cur ? "var(--brand-500)" : "var(--bg-muted)",
      color: i <= cur ? "#fff" : "var(--fg-subtle)"
    } }, i + 1), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: i === cur ? 700 : 500, color: i === cur ? "var(--brand-600)" : "var(--fg-subtle)" } }, label)), i < STEPS.length - 1 && /* @__PURE__ */ React.createElement("span", { style: { flex: 1, height: 1, background: i < cur ? "var(--brand-500)" : "var(--line-subtle)" } })))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 6 } }, "\u{1F4A1} ", hint));
  })(), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowSig((s) => !s), style: {
    marginTop: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--line)",
    background: "var(--bg-muted)",
    fontSize: 11,
    color: "var(--fg-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    width: "100%",
    justifyContent: "space-between"
  } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 12, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", null, "\uC9C0\uAE08\uAE4C\uC9C0 \uD30C\uC545\uD55C \uB2E8\uC11C ", /* @__PURE__ */ React.createElement("strong", { className: "num", style: { color: "var(--fg-strong)" } }, signals.length), "\uAC1C \xB7 ", STAGE_LABEL[stage] || stage)), showSig ? /* @__PURE__ */ React.createElement(IcChevronUp, { size: 12 }) : /* @__PURE__ */ React.createElement(IcChevronDown, { size: 12 })), showSig && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, padding: 12, borderRadius: 10, background: "var(--bg-muted)" } }, signals.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5 } }, "\uC544\uC9C1 \uBAA8\uC740 \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694. \uB300\uD654\uB97C \uC774\uC5B4\uAC00\uBA74 \uD765\uBBF8\xB7\uAC15\uC810\xB7\uAC00\uCE58\xB7\uB9E5\uB77D \uB2E8\uC11C\uAC00 \uC790\uB3D9\uC73C\uB85C \uC313\uC774\uACE0, \uCD94\uCC9C\xB7\uB9AC\uD3EC\uD2B8\uC5D0 \uBC18\uC601\uB3FC\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, signals.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: SIG_TONE[s.tag] || "neutral", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-default)", flex: 1, lineHeight: 1.5 }, className: "kr-heading" }, s.text))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", marginTop: 2 } }, "\uC774 \uB2E8\uC11C\uB4E4\uC774 \uB2E8\uACC4 \uC9C4\uD589(\uD0D0\uC0C9\u2192\uD30C\uC545\u2192\uCD94\uCC9C\u2192\uC900\uBE44)\uACFC \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uC5D0 \uBC18\uC601\uB3FC\uC694.")))), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "toss-scroll", style: {
    flex: 1,
    padding: "12px 14px 8px",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8
  } }, msgs.length === 1 && !thinking && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 4px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 11, color: "var(--accent-purple)" }), " \uC774\uB807\uAC8C \uC2DC\uC791\uD574 \uBCF4\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, [
    "\uC544\uC9C1 \uC9C4\uB85C\uB97C \uC798 \uBAA8\uB974\uACA0\uC5B4\uC694",
    "\uC694\uC998 \uADF8\uB9BC \uADF8\uB9AC\uB294 \uAC8C \uC7AC\uBBF8\uC788\uC5B4\uC694",
    "\uD3C9\uADE0 \uB4F1\uAE09\uC740 \uC798 \uBAA8\uB974\uACA0\uC9C0\uB9CC \uC218\uD559\uC744 \uC88B\uC544\uD574\uC694",
    "\uB300\uD559\uC740 \uAC00\uACE0 \uC2F6\uC740\uB370 \uC5B4\uB5A4 \uD559\uACFC\uAC00 \uC88B\uC744\uC9C0 \uBAA8\uB974\uACA0\uC5B4\uC694",
    "\uBD09\uC0AC\uD65C\uB3D9 \uCD94\uCC9C\uD574 \uC8FC\uC138\uC694"
  ].map((q) => /* @__PURE__ */ React.createElement("button", { key: q, onClick: () => send(q), style: {
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid var(--brand-200, var(--line))",
    background: "var(--brand-50, var(--bg-surface))",
    color: "var(--brand-700)",
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.5,
    cursor: "pointer"
  }, className: "kr-heading" }, q)))), (() => {
    let lastAiIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "ai") {
        lastAiIdx = i;
        break;
      }
    }
    return msgs.map((m, i) => {
      const isLastAi = i === lastAiIdx && m.role === "ai";
      const options = isLastAi && !thinking ? parseQuickReplies(m.text).options : [];
      const metaSignals = m.meta && Array.isArray(m.meta.signals) ? m.meta.signals : [];
      const willFinalize = !!(m.meta && m.meta.shouldFinalize);
      const proposedTarget = m.meta && m.meta.proposedTarget || null;
      const targetSaved = !!(m.meta && m.meta._targetSaved);
      return /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement(ChatBubble, { msg: m }), metaSignals.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginLeft: 32, marginTop: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 11, color: "var(--accent-purple)" }), " \uBC29\uAE08 \uD30C\uC545\uD55C \uB2E8\uC11C"), metaSignals.map((s, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: {
        background: "var(--accent-purple-bg, #F1ECFF)",
        color: "var(--accent-purple, #7B61FF)",
        borderRadius: 999,
        padding: "3px 9px",
        fontSize: 11,
        fontWeight: 700
      } }, s.tag, " \xB7 ", (s.text || "").slice(0, 30)))), willFinalize && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: 32, marginTop: 4, padding: "8px 12px", borderRadius: 10, background: "var(--brand-50)", border: "1px solid var(--brand-200, var(--line))", fontSize: 12, color: "var(--brand-700)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 12 }), " AI\uAC00 \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694"), proposedTarget && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: 32, marginTop: 4, padding: "10px 12px", borderRadius: 12, background: "var(--bg-surface)", border: "1px solid var(--brand-200, var(--line))", display: "flex", flexDirection: "column", gap: 6, alignSelf: "flex-start", maxWidth: 320 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 11, color: "var(--brand-600)" }), " \uC9C4\uB85C \uBAA9\uD45C\uB85C \uC800\uC7A5\uD560\uAE4C\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, [proposedTarget.career, proposedTarget.univ, proposedTarget.dept].filter(Boolean).join(" \xB7 ")), proposedTarget.reason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.5 }, className: "kr-heading" }, proposedTarget.reason), targetSaved ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--success)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 12 }), " \uC9C4\uB85C \uBAA9\uD45C\uC5D0 \uC800\uC7A5\uB410\uC5B4\uC694") : /* @__PURE__ */ React.createElement("button", { onClick: async () => {
        try {
          await window.__apiFetch("/career/target", {
            method: "POST",
            body: JSON.stringify({
              career: proposedTarget.career || "",
              univ: proposedTarget.univ || "",
              dept: proposedTarget.dept || "",
              reason: proposedTarget.reason || ""
            })
          });
          setMsgs((ms) => ms.map((mm, idx) => idx === i ? { ...mm, meta: { ...mm.meta, _targetSaved: true } } : mm));
          if (sessionId) refreshProgress(sessionId);
          if (typeof window.showToast === "function") window.showToast("\uC9C4\uB85C \uBAA9\uD45C\uB85C \uC800\uC7A5\uB410\uC5B4\uC694", "success");
        } catch (e) {
          const msg = e && e.body && (e.body.message || e.body.error && e.body.error.message) || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.";
          alert(msg);
        }
      }, style: { alignSelf: "flex-start", padding: "6px 12px", borderRadius: 8, border: "none", background: "var(--brand-500)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 12 }), " \uC9C4\uB85C \uBAA9\uD45C\uB85C \uC800\uC7A5")), options.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginLeft: 32, marginTop: 2 } }, options.map((opt, j) => /* @__PURE__ */ React.createElement("button", { key: j, onClick: () => send(opt), disabled: thinking, style: {
        border: "1px solid var(--brand-200, var(--line))",
        background: "var(--brand-50, var(--bg-surface))",
        borderRadius: 999,
        padding: "8px 14px",
        fontSize: 13,
        color: "var(--brand-600)",
        fontWeight: 600,
        cursor: thinking ? "not-allowed" : "pointer",
        whiteSpace: "normal",
        textAlign: "left",
        lineHeight: 1.4
      }, className: "kr-heading" }, opt))));
    });
  })(), thinking && /* @__PURE__ */ React.createElement(ChatThinking, null), initErr && /* @__PURE__ */ React.createElement("div", { style: { alignSelf: "center", marginTop: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", onClick: initSession, leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }) }, "\uB2E4\uC2DC \uC2DC\uB3C4")), evidenceCount >= 3 && signals.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    background: "linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)",
    border: "1px solid rgba(123,97,255,0.15)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 14, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--accent-purple)" } }, "\uC9C0\uAE08\uAE4C\uC9C0 \uBCF4\uC778 \uC9C4\uB85C \uB2E8\uC11C")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, signals.slice(0, 6).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: SIG_TONE[s.tag] || "neutral", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1, lineHeight: 1.5 }, className: "kr-heading" }, s.text)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 8 } }, "\u203B \uC544\uC9C1 \uD655\uC815\uC774 \uC544\uB2C8\uC5D0\uC694. \uB300\uD654\uB97C \uB354 \uC774\uC5B4\uAC00\uBA70 \uD568\uAED8 \uD655\uC778\uD574\uBCFC\uAC8C\uC694."))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "var(--bg-muted)",
    borderRadius: 24,
    padding: "6px 6px 6px 16px"
  } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") send(input);
      },
      placeholder: "\uC790\uC720\uB86D\uAC8C \uB2F5\uD574\uBCF4\uC138\uC694",
      style: {
        flex: 1,
        border: "none",
        background: "transparent",
        outline: "none",
        fontSize: 15,
        color: "var(--fg-strong)",
        minWidth: 0
      }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => send(input), disabled: !input.trim(), style: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    background: input.trim() ? "var(--brand-500)" : "var(--line-strong)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: input.trim() ? "pointer" : "not-allowed"
  } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 }))), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: evidenceCount >= 5 ? "brandSoft" : "ghost",
      size: "sm",
      full: true,
      disabled: evidenceCount < 5,
      onClick: () => go("career-report"),
      leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }),
      style: { marginTop: 8 }
    },
    evidenceCount >= 5 ? "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8 \uBCF4\uAE30" : "\uB300\uD654\uB97C \uC880 \uB354 \uC774\uC5B4\uAC00\uBA74 AI\uAC00 \uC790\uB3D9\uC73C\uB85C \uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4\uC5B4\uB4DC\uB824\uC694"
  )));
}
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    alignItems: "flex-end",
    gap: 6
  } }, !isUser && /* @__PURE__ */ React.createElement("div", { style: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0
  } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: "78%",
    background: isUser ? "var(--brand-500)" : "var(--bg-surface)",
    color: isUser ? "#fff" : "var(--fg-strong)",
    padding: "10px 14px",
    borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
    fontSize: 14,
    lineHeight: 1.6,
    boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.04)"
  }, className: "kr-heading" }, isUser ? msg.text : /* @__PURE__ */ React.createElement(FormattedText, { text: parseQuickReplies(msg.text).clean })));
}
function parseQuickReplies(text) {
  const raw = text || "";
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let optionLineIdx = -1;
  let options = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^\s*\[보기\]\s*(.*)$/);
    if (m) {
      options = m[1].split("|").map((s) => s.trim()).filter(Boolean);
      optionLineIdx = i;
      break;
    }
    if (lines[i].trim() !== "") break;
  }
  if (optionLineIdx < 0) return { options: [], clean: raw };
  const clean = lines.slice(0, optionLineIdx).join("\n").replace(/\s+$/, "");
  return { options, clean };
}
function renderInline(text, keyPrefix) {
  const src = text == null ? "" : String(text);
  const nodes = [];
  let buf = "";
  let k = 0;
  const flush = () => {
    if (buf) {
      nodes.push(buf);
      buf = "";
    }
  };
  const re = /(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)|(_([^_]+?)_)|(`([^`]+?)`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) buf += src.slice(last, m.index);
    flush();
    if (m[1] != null) {
      nodes.push(/* @__PURE__ */ React.createElement("strong", { key: keyPrefix + "-b" + k++, style: { fontWeight: 700 } }, m[2]));
    } else if (m[3] != null) {
      nodes.push(/* @__PURE__ */ React.createElement("em", { key: keyPrefix + "-i" + k++, style: { fontStyle: "italic" } }, m[4]));
    } else if (m[5] != null) {
      nodes.push(/* @__PURE__ */ React.createElement("em", { key: keyPrefix + "-u" + k++, style: { fontStyle: "italic" } }, m[6]));
    } else if (m[7] != null) {
      nodes.push(
        /* @__PURE__ */ React.createElement("code", { key: keyPrefix + "-c" + k++, style: { background: "var(--bg-subtle, rgba(0,0,0,0.06))", borderRadius: 4, padding: "1px 5px", fontSize: "0.92em" } }, m[8])
      );
    }
    last = re.lastIndex;
  }
  if (last < src.length) buf += src.slice(last);
  flush();
  return nodes.length ? nodes : [src];
}
function splitTableRow(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}
function isTableSeparator(line) {
  if (!/\|/.test(line)) return false;
  return splitTableRow(line).every((c) => /^:?-{1,}:?$/.test(c));
}
function FormattedText({ text }) {
  const raw = text || "";
  if (!raw) return null;
  try {
    const lines = raw.replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let key = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (/\|/.test(trimmed) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const header = splitTableRow(trimmed);
        const rows = [];
        let j = i + 2;
        while (j < lines.length && /\|/.test(lines[j]) && lines[j].trim() !== "") {
          rows.push(splitTableRow(lines[j]));
          j++;
        }
        out.push(
          /* @__PURE__ */ React.createElement("div", { key: key++, style: { overflowX: "auto", margin: "6px 0" } }, /* @__PURE__ */ React.createElement("table", { style: { borderCollapse: "collapse", width: "100%", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, header.map((h, ci) => /* @__PURE__ */ React.createElement("th", { key: ci, style: { border: "1px solid var(--border, rgba(0,0,0,0.12))", padding: "6px 10px", textAlign: "left", fontWeight: 700, background: "var(--bg-subtle, rgba(0,0,0,0.04))" } }, renderInline(h, "th" + ci))))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((r, ri) => /* @__PURE__ */ React.createElement("tr", { key: ri }, header.map((_, ci) => /* @__PURE__ */ React.createElement("td", { key: ci, style: { border: "1px solid var(--border, rgba(0,0,0,0.12))", padding: "6px 10px", verticalAlign: "top" } }, renderInline(r[ci] == null ? "" : r[ci], "td" + ri + "-" + ci))))))))
        );
        i = j - 1;
        continue;
      }
      if (trimmed === "") {
        out.push(/* @__PURE__ */ React.createElement("div", { key: key++, style: { height: 6 } }));
        continue;
      }
      const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
      const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
      const numbered = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
      if (heading) {
        const level = heading[1].length;
        const size = level <= 1 ? 17 : level === 2 ? 15.5 : 14.5;
        out.push(
          /* @__PURE__ */ React.createElement("div", { key: key++, style: { fontWeight: 700, fontSize: size, margin: "6px 0 2px", lineHeight: 1.4 } }, renderInline(heading[2], "h" + key))
        );
      } else if (bullet) {
        out.push(
          /* @__PURE__ */ React.createElement("div", { key: key++, style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "1px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--brand-500)", lineHeight: 1.6 } }, "\u2022"), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, renderInline(bullet[1], "bl" + key)))
        );
      } else if (numbered) {
        out.push(
          /* @__PURE__ */ React.createElement("div", { key: key++, style: { display: "flex", gap: 6, alignItems: "flex-start", margin: "1px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--brand-500)", fontWeight: 700, minWidth: 16 } }, numbered[1], "."), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, renderInline(numbered[2], "nm" + key)))
        );
      } else {
        out.push(/* @__PURE__ */ React.createElement("div", { key: key++ }, renderInline(line, "p" + key)));
      }
    }
    return /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word" } }, out);
  } catch (e) {
    return /* @__PURE__ */ React.createElement("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word" } }, raw);
  }
}
function ChatThinking() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700
  } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 16px",
    background: "var(--bg-surface)",
    borderRadius: "4px 18px 18px 18px",
    display: "flex",
    gap: 4
  } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--fg-subtle)",
    animation: `bounce 1.2s ${i * 0.16}s infinite ease-in-out`
  } })), /* @__PURE__ */ React.createElement("style", null, `@keyframes bounce { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }`)));
}
function CareerReport({ go }) {
  const [loading, setLoading] = React.useState(true);
  const [signals, setSignals] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState(null);
  const [targets, setTargets] = React.useState([]);
  const [pdfBusy, setPdfBusy] = React.useState(false);
  const [activeSessionId, setActiveSessionId] = React.useState(null);
  const SIGNAL_TONE = { "\uD765\uBBF8": "brand", "\uAC15\uC810": "mint", "\uAC00\uCE58": "purple", "\uB9E5\uB77D": "info" };
  const STAGE_LABEL = { explore: "\uD0D0\uC0C9", profile: "\uD30C\uC545", recommend: "\uCD94\uCC9C", prepare: "\uC900\uBE44" };
  const downloadPdf = async () => {
    if (!activeSessionId) {
      alert("\uC0DD\uC131\uB41C \uB9AC\uD3EC\uD2B8\uAC00 \uC5C6\uC5B4\uC694. AI \uC0C1\uB2F4\uC744 \uBA3C\uC800 \uC9C4\uD589\uD574\uC8FC\uC138\uC694.");
      return;
    }
    setPdfBusy(true);
    try {
      const r = await window.__apiFetch("/reports", { method: "POST", body: JSON.stringify({ sessionId: activeSessionId }) });
      const reportId = r && r.data && r.data.reportId;
      if (!reportId) throw new Error("reportId \uC5C6\uC74C");
      const start = Date.now();
      let pdfUrl = null;
      while (Date.now() - start < 6e4) {
        const d = await window.__apiFetch("/reports/" + reportId, { method: "GET" });
        const status = d && d.data && d.data.status;
        if (status === "done" && d.data.pdfUrl) {
          pdfUrl = d.data.pdfUrl;
          break;
        }
        if (status === "failed") throw new Error("\uB9AC\uD3EC\uD2B8 \uC0DD\uC131 \uC2E4\uD328");
        await new Promise((res) => setTimeout(res, 2e3));
      }
      if (!pdfUrl) throw new Error("\uB9AC\uD3EC\uD2B8 \uC900\uBE44 \uC2DC\uAC04 \uCD08\uACFC \u2014 \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694");
      window.open(pdfUrl, "_blank");
    } catch (e) {
      const msg = e && e.body && (e.body.message || e.body.error && e.body.error.message) || e.message || "\uB2E4\uC6B4\uB85C\uB4DC \uC2E4\uD328";
      alert(msg);
    } finally {
      setPdfBusy(false);
    }
  };
  React.useEffect(() => {
    (async () => {
      try {
        const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" }).catch(() => null);
        const sid = active && active.data && active.data.id;
        if (sid) {
          setActiveSessionId(sid);
          const prog = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/progress", { method: "GET" }).catch(() => null);
          if (prog && prog.data) {
            setSignals(prog.data.signals || []);
            setProgress(prog.data.completeness || 0);
            setStage(prog.data.stage || null);
          }
        }
        const t = await window.__apiFetch("/career/targets", { method: "GET" }).catch(() => null);
        setTargets(t && t.data || []);
      } catch (e) {
      }
      setLoading(false);
    })();
  }, []);
  const hasData = signals.length > 0 || targets.length > 0;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      help: "career-report",
      title: "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8",
      leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }),
      trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcDownload, { size: 20 }), ariaLabel: "PDF\uB85C \uBC1B\uAE30", onClick: downloadPdf, disabled: pdfBusy || signals.length < 5 })
    }
  ), pdfBusy && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 16px", background: "var(--brand-50)", fontSize: 12, color: "var(--brand-700)", textAlign: "center" } }, "\uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4\uACE0 \uC788\uC5B4\uC694. \uC644\uC131\uB418\uBA74 \uC0C8 \uD0ED\uC73C\uB85C \uC5F4\uB824\uC694 (\uCD5C\uB300 1\uBD84)\u2026"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, loading ? /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 80 })) : !hasData ? /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 22 }),
      title: "\uC544\uC9C1 \uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4 \uB370\uC774\uD130\uAC00 \uC5C6\uC5B4\uC694",
      body: "AI \uC9C4\uB85C \uC0C1\uB2F4\uC744 \uBA87 \uBC88 \uC774\uC5B4\uAC00\uBA74, \uB300\uD654\uC5D0\uC11C \uD765\uBBF8\xB7\uAC15\uC810\xB7\uAC00\uCE58 \uB2E8\uC11C\uB97C \uBAA8\uC544 \uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4\uC5B4\uB4DC\uB824\uC694.",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }), onClick: () => go("ai-counseling") }, "AI \uC0C1\uB2F4 \uC2DC\uC791\uD558\uAE30")
    }
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)", marginBottom: 12, border: "1px solid rgba(49,130,246,0.08)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uC9C4\uD589 \uC911\uC778 \uB9AC\uD3EC\uD2B8"), stage && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uD604\uC7AC \uB2E8\uACC4: ", STAGE_LABEL[stage] || stage)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", lineHeight: 1.35 }, className: "kr-heading" }, "\uC9C0\uAE08\uAE4C\uC9C0 \uB300\uD654\uC5D0\uC11C ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--brand-600)" } }, "\uB2E8\uC11C ", signals.length, "\uAC1C"), "\uB97C \uBAA8\uC558\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 999, marginTop: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: progress + "%", height: "100%", background: "var(--brand-500)" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 6 } }, "\uB9AC\uD3EC\uD2B8 \uC644\uC131\uB3C4 ", progress, "%")), targets.length > 0 && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB098\uC758 \uC9C4\uB85C \uBAA9\uD45C", subtitle: "\uC9C4\uB85C \uBAA9\uD45C \uD654\uBA74\uC5D0\uC11C \uAD00\uB9AC\uD574\uC694", style: { marginBottom: 12 }, action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => go("career-targets") }, "\uAD00\uB9AC") }, targets.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, t.career), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, [t.univ, t.dept].filter(Boolean).join(" ")), t.reason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-default)", marginTop: 4, lineHeight: 1.5 }, className: "kr-heading" }, t.reason)))), signals.length > 0 && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB300\uD654\uC5D0\uC11C \uBCF4\uC778 \uB2E8\uC11C", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, signals.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: SIGNAL_TONE[s.tag] || "neutral", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1 }, className: "kr-heading" }, s.text))))), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 12, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 16 }, className: "kr-heading" }, "\uC774 \uACB0\uACFC\uB294 \uB300\uD654\uB97C \uBC14\uD0D5\uC73C\uB85C \uD55C \uC9C4\uB85C \uD0D0\uC0C9 \uCC38\uACE0\uC790\uB8CC\uC608\uC694. \uCD5C\uC885 \uC120\uD0DD\uC740 \uD559\uC0DD\xB7\uBCF4\uD638\uC790\xB7\uAD50\uC0AC \uC0C1\uB2F4\uACFC \uD568\uAED8 \uACB0\uC815\uD558\uB294 \uAC8C \uC88B\uC544\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcGraduation, { size: 18 }), onClick: () => {
    const t = targets[0];
    const seed = t && (t.univ || t.dept || t.career);
    try {
      if (seed) window.__admissionsQuery = String(seed).trim();
      else delete window.__admissionsQuery;
    } catch (e) {
    }
    go("admissions-hub");
  } }, "\uCD94\uCC9C \uD559\uACFC \uC785\uC2DC \uC815\uBCF4 \uBCF4\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }), onClick: () => go("ai-counseling") }, "AI \uC0C1\uB2F4 \uC774\uC5B4\uAC00\uAE30")))));
}
function GradesTrend({ go }) {
  const [grades, setGrades] = React.useState(null);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/grades", { method: "GET" });
      setGrades(r.data || []);
    } catch (e) {
      setGrades([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const del = async (id) => {
    try {
      await window.__apiFetch("/grades/" + id, { method: "DELETE" });
      load();
    } catch (e) {
      alert("\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  const byTerm = {};
  (grades || []).forEach((g) => {
    (byTerm[g.term] = byTerm[g.term] || []).push(g);
  });
  const terms = Object.keys(byTerm).sort();
  const termAvg = (rows) => {
    const sc = rows.filter((r) => r.score != null).map((r) => r.score);
    return sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length * 10) / 10 : null;
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      help: "grades",
      title: "\uC131\uC801",
      leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }),
      trailing: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 16 }), onClick: () => go("grades-input") }, "\uC131\uC801 \uC785\uB825")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: 16 } }, grades === null ? [0, 1].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 16, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 60 }))) : terms.length === 0 ? /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcChart, { size: 22 }),
      title: "\uC544\uC9C1 \uC785\uB825\uD55C \uC131\uC801\uC774 \uC5C6\uC5B4\uC694",
      body: "\uC131\uC801\uC744 \uC785\uB825\uD558\uBA74 \uD559\uAE30\uBCC4 \uD3C9\uADE0\uACFC \uCD94\uC774\uB97C \uBCFC \uC218 \uC788\uC5B4\uC694. \uC785\uB825\uD55C \uC131\uC801\uC740 AI \uC9C4\uB85C \uBD84\uC11D\uC5D0\uB3C4 \uBC18\uC601\uB429\uB2C8\uB2E4.",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 16 }), onClick: () => go("grades-input") }, "\uCCAB \uC131\uC801 \uC785\uB825\uD558\uAE30")
    }
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD559\uAE30\uBCC4 \uD3C9\uADE0", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 12, height: 140, padding: "8px 4px" } }, terms.map((t) => {
    const avg = termAvg(byTerm[t]);
    const h = avg != null ? Math.max(8, Math.round(avg / 100 * 110)) : 8;
    return /* @__PURE__ */ React.createElement("div", { key: t, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, avg != null ? avg : "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { width: "60%", height: h, background: "var(--brand-500)", borderRadius: "6px 6px 0 0" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, t));
  }))), terms.slice().reverse().map((t) => {
    var _a2;
    return /* @__PURE__ */ React.createElement(SectionCard, { key: t, title: t, subtitle: "\uD3C9\uADE0 " + ((_a2 = termAvg(byTerm[t])) != null ? _a2 : "\u2014"), style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, byTerm[t].map((g) => /* @__PURE__ */ React.createElement("div", { key: g.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, g.subject, g.category ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", fontWeight: 500 } }, " \xB7 ", g.category) : null)), g.score != null && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, g.score, "\uC810"), g.rank != null && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, g.rank, "\uB4F1\uAE09"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcTrash, { size: 15 }), ariaLabel: "\uC0AD\uC81C", onClick: () => del(g.id) })))));
  }))));
}
function GradesInput({ go }) {
  const [g, setG] = React.useState({ \uAD6D\uC5B4: "", \uC218\uD559: "", \uC601\uC5B4: "", \uC0AC\uD68C: "", \uACFC\uD559: "" });
  const [exam, setExam] = React.useState("5\uC6D4 \uBAA8\uC758\uACE0\uC0AC");
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC131\uC801 \uC785\uB825", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("grades-trend") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(SectionCard, { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uD5D8", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(TextInput, { value: exam, onChange: setExam, leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 16 }) })), Object.keys(g).map((sub) => /* @__PURE__ */ React.createElement(FormField, { key: sub, label: sub, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: g[sub], onChange: (v) => setG((s) => ({ ...s, [sub]: v })), placeholder: "0~100", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-subtle)" } }, "\uC810") })))), /* @__PURE__ */ React.createElement("div", { style: {
    padding: 14,
    background: "var(--brand-50)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--brand-600)",
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 16
  } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { marginTop: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC785\uB825\uD55C \uC131\uC801\uC740 \uC120\uC0DD\uB2D8\uAED8\uB3C4 \uACF5\uC720\uB3FC\uC694. \uC798\uBABB \uC785\uB825\uD558\uBA74 \uC5B8\uC81C\uB4E0 \uC218\uC815\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => go("grades-trend") }, "\uC800\uC7A5\uD558\uAE30")));
}
function StudentBilling({ go }) {
  return /* @__PURE__ */ React.createElement(BillingScreen, { go, role: "student" });
}
window.SERVICE_FREE_MODE = (_a = window.SERVICE_FREE_MODE) != null ? _a : true;
function BillingScreen({ go, role = "student" }) {
  const isStudent2 = role === "student";
  if (window.SERVICE_FREE_MODE) {
    return /* @__PURE__ */ React.createElement(FreeLaunchBilling, { go, role });
  }
  return /* @__PURE__ */ React.createElement(PaidBillingScreen, { go, role });
}
function FreeLaunchBilling({ go, role = "student" }) {
  const isStudent2 = role === "student";
  const planPrice = isStudent2 ? "3,000" : "30,000";
  const futureFeatures = isStudent2 ? ["AI \uC9C4\uB85C \uC0C1\uB2F4 \uBB34\uC81C\uD55C", "\uC9C4\uB85C \uB9AC\uD3EC\uD2B8 + \uC785\uC2DC \uBD84\uC11D", "\uB9DE\uCDA4 AI \uD559\uC2B5 \uACC4\uD68D", "\uAD00\uC2EC \uD559\uACFC \uC785\uC2DC \uCD94\uC801"] : ["\uD559\uAE09 \uCD5C\uB300 30\uBA85 \uAD00\uB9AC", "\uD559\uC0DD\uBCC4 AI \uB9AC\uD3EC\uD2B8 \uC5F4\uB78C", "\uC0C1\uB2F4 \uC77C\uC815 \xB7 \uBA54\uBAA8 \uAD00\uB9AC", "\uC2E4\uC2DC\uAC04 SSE \uC54C\uB9BC"];
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { help: "billing", title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 24, style: {
    marginBottom: 12,
    background: "linear-gradient(135deg, #15803D 0%, #0E5C2C 100%)",
    color: "#fff",
    boxShadow: "0 12px 28px rgba(21,128,61,0.28)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }), style: { background: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: 12 } }, "\uC815\uC2DD \uCD9C\uC2DC \uAE30\uB150 \uC804\uCCB4 \uBB34\uB8CC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 800, lineHeight: 1.25 }, className: "kr-heading" }, "\uC9C0\uAE08\uC740 \uBAA8\uB4E0 \uAE30\uB2A5\uC774", /* @__PURE__ */ React.createElement("br", null), "\uBB34\uB8CC\uC608\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.9, marginTop: 8, lineHeight: 1.55 }, className: "kr-heading" }, "\uACB0\uC81C \uC815\uBCF4 \uC5C6\uC774 ", isStudent2 ? "\uC9C4\uB85C \uC0C1\uB2F4\xB7\uB9AC\uD3EC\uD2B8\xB7\uD559\uC2B5 \uACC4\uD68D" : "\uD559\uAE09 \uAD00\uB9AC\xB7\uD559\uC0DD \uB9AC\uD3EC\uD2B8\xB7\uC0C1\uB2F4", "\uC744 \uC81C\uD55C \uC5C6\uC774 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("div", { style: {
    width: 52,
    height: 52,
    borderRadius: 16,
    flexShrink: 0,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } }, /* @__PURE__ */ React.createElement(IcHeart, { size: 26, color: "#fff" }))), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 18,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.14)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 10
  } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 16, color: "#fff", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, lineHeight: 1.5 }, className: "kr-heading" }, "\uC720\uB8CC \uC804\uD658\uC740 ", /* @__PURE__ */ React.createElement("strong", null, "\uCD5C\uC18C 30\uC77C \uC804"), "\uC5D0 \uBBF8\uB9AC \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694. \uAC11\uC790\uAE30 \uACB0\uC81C\uB418\uB294 \uC77C\uC740 \uC5C6\uC5B4\uC694."))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC55E\uC73C\uB85C\uC758 \uC694\uAE08 \uC548\uB0B4", subtitle: "\uC720\uB8CC \uC804\uD658 \uC2DC \uC801\uC6A9\uB420 \uC608\uC815 \uAC00\uACA9\uC774\uC5D0\uC694", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: 16,
    borderRadius: 12,
    background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)",
    border: "1px solid var(--brand-200)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, isStudent2 ? "\uD559\uC0DD" : "\uAD50\uC0AC", " \uC815\uC2DD \uD50C\uB79C (\uC608\uC815)"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 6 }, className: "kr-heading" }, "\uC720\uB8CC \uC804\uD658 \uC2DC \uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8 \uC81C\uACF5")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 2, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 24, fontWeight: 800, color: "var(--fg-strong)" } }, planPrice), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC6D0/\uC6D4")), /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { marginTop: 4 } }, "\uC9C0\uAE08\uC740 \u20A90"))), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 } }, futureFeatures.map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 15, color: "var(--brand-500)" }), f, /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { marginLeft: "auto", height: 18, padding: "0 6px", fontSize: 10 } }, "\uBB34\uB8CC \uC81C\uACF5 \uC911"))))), /* @__PURE__ */ React.createElement("button", { onClick: () => showToast("\uC720\uB8CC \uC804\uD658 \uC2DC \uBBF8\uB9AC \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694", "success"), style: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    border: "1px solid var(--line-strong)",
    background: "var(--bg-surface)",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "var(--fg-default)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement(IcBell, { size: 14 }), " \uC720\uB8CC \uC804\uD658 \uC2DC \uBBF8\uB9AC \uC54C\uB9BC \uBC1B\uAE30")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACB0\uC81C \uC218\uB2E8", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "20px 16px",
    textAlign: "center",
    background: "var(--bg-muted)",
    borderRadius: 12,
    border: "1px dashed var(--line-strong)"
  } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 24, color: "var(--fg-subtle)", style: { margin: "0 auto 8px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 }, className: "kr-heading" }, "\uBB34\uB8CC \uC6B4\uC601 \uC911\uC5D0\uB294 \uACB0\uC81C \uC218\uB2E8\uC744 \uB4F1\uB85D\uD560 \uD544\uC694\uAC00 \uC5C6\uC5B4\uC694"), /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uB4F1\uB85D \uBD88\uD544\uC694"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", lineHeight: 1.6, textAlign: "center" }, className: "kr-heading" }, "\uC804\uCCB4 \uBB34\uB8CC \uC6B4\uC601 \uAE30\uAC04 \uB3D9\uC548\uC5D0\uB294 \uC5B4\uB5A4 \uBE44\uC6A9\uB3C4 \uCCAD\uAD6C\uB418\uC9C0 \uC54A\uC544\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uC815\uC2DD \uACB0\uC81C\uB294 \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20/\uD3EC\uD2B8\uC6D0 \uC5F0\uB3D9 \uC644\uB8CC \uD6C4 \uC2DC\uC791\uB418\uBA70, \uC0AC\uC804 \uACE0\uC9C0 \uD6C4 \uC9C4\uD589\uB3FC\uC694.")));
}
function PaidBillingScreen({ go, role = "student" }) {
  const [activePlan, setActivePlan] = React.useState("trial");
  const [downgradeOpen, setDowngradeOpen] = React.useState(false);
  const planPrice = isStudent ? "3,000" : "30,000";
  const annualPrice = isStudent ? "30,000" : "300,000";
  const featureList = isStudent ? {
    free: ["AI \uC9C4\uB85C \uC0C1\uB2F4 (\uC6D4 5\uD68C)", "\uC131\uC801 \uC785\uB825 \xB7 \uCD94\uC774 \uD655\uC778", "\uD559\uC2B5 \uACC4\uD68D (\uC218\uB3D9\uB9CC)"],
    paid: ["AI \uC9C4\uB85C \uC0C1\uB2F4 \uBB34\uC81C\uD55C", "\uC9C4\uB85C \uB9AC\uD3EC\uD2B8 + \uC785\uC2DC \uBD84\uC11D", "\uB9DE\uCDA4 AI \uD559\uC2B5 \uACC4\uD68D", "\uAD00\uC2EC \uD559\uACFC \uC785\uC2DC \uCD94\uC801"]
  } : {
    free: ["\uD559\uAE09 \uCD5C\uB300 3\uBA85 (\uBCA0\uD0C0)", "\uD559\uC0DD \uC131\uC801 \uC5F4\uB78C", "\uBA54\uC2DC\uC9C0 \xB7 \uBA54\uBAA8"],
    paid: ["\uD559\uAE09 \uCD5C\uB300 30\uBA85", "\uD559\uC0DD\uBCC4 AI \uB9AC\uD3EC\uD2B8 \uC5F4\uB78C", "\uC0C1\uB2F4 \uC77C\uC815 \uAD00\uB9AC", "\uC2E4\uC2DC\uAC04 SSE \uC54C\uB9BC"]
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { help: "billing", title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: {
    marginBottom: 12,
    background: activePlan === "paid" ? "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)" : activePlan === "trial" ? "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)" : "var(--bg-surface)",
    color: activePlan === "paid" ? "#fff" : "var(--fg-strong)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, activePlan === "paid" && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff" } }, "\uC815\uAE30 \uACB0\uC81C \uC911"), activePlan === "trial" && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uBB34\uB8CC \uCCB4\uD5D8 \uC911"), activePlan === "free" && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uBB34\uB8CC \uD50C\uB79C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, marginTop: 8, color: activePlan === "paid" ? "#fff" : "var(--fg-strong)" } }, isStudent ? "\uD559\uC0DD" : "\uAD50\uC0AC", " ", activePlan === "free" ? "\uBB34\uB8CC \uD50C\uB79C" : activePlan === "trial" ? "\uD50C\uB79C \uCCB4\uD5D8" : "\uD50C\uB79C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: activePlan === "paid" ? "rgba(255,255,255,0.85)" : "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, activePlan === "free" && "\uD575\uC2EC \uAE30\uB2A5\uC744 \uBB34\uB8CC\uB85C \uC0AC\uC6A9 \uC911\uC774\uC5D0\uC694", activePlan === "trial" && "\uCCAB \uB2EC \uBAA8\uB4E0 \uAE30\uB2A5 \uBB34\uB8CC \uCCB4\uD5D8", activePlan === "paid" && "\uBAA8\uB4E0 \uAE30\uB2A5 \uC0AC\uC6A9 \uAC00\uB2A5 \xB7 \uB9E4\uC6D4 \uC790\uB3D9\uACB0\uC81C"))), activePlan === "trial" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uCCB4\uD5D8 \uC885\uB8CC\uC77C"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700 } }, "2026. 05. 31")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC774\uD6C4 \uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700 } }, "\uC6D4 ", planPrice, "\uC6D0"))), activePlan === "paid" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.18)", borderRadius: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, opacity: 0.85 } }, "\uB2E4\uC74C \uACB0\uC81C\uC77C"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700 } }, "2026. 07. 01")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.18)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, opacity: 0.85 } }, "\uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700 } }, "\uC6D4 ", planPrice, "\uC6D0"))), activePlan === "free" && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5 }, className: "kr-heading" }, "\uC720\uB8CC \uD50C\uB79C \uACB0\uC81C \uC5F0\uB3D9\uC774 \uC644\uB8CC\uB418\uBA74 \uC790\uB3D9 \uC548\uB0B4\uB4DC\uB9B4\uAC8C\uC694. \uC548\uB0B4\uAE4C\uC9C0\uB294 \uBB34\uB8CC \uD50C\uB79C\uC73C\uB85C \uACC4\uC18D \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("div", { style: {
    padding: 14,
    background: "var(--warning-bg)",
    borderRadius: 12,
    marginBottom: 12,
    display: "flex",
    gap: 10,
    alignItems: "flex-start"
  } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 16, color: "var(--warning)", style: { flexShrink: 0, marginTop: 1 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 12, color: "var(--warning)", lineHeight: 1.55 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("strong", null, "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911\uC774\uC5D0\uC694."), " \uADF8 \uB3D9\uC548\uC5D0\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\uBB34\uB8CC \uD50C\uB79C"), "\uC73C\uB85C \uD575\uC2EC \uAE30\uB2A5\uC744 \uB04A\uAE40 \uC5C6\uC774 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694. \uACB0\uC81C \uC5F0\uB3D9\uC774 \uC644\uB8CC\uB418\uBA74 \uC54C\uB9BC\uC73C\uB85C \uC548\uB0B4\uB4DC\uB9B4\uAC8C\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", margin: "4px 4px 10px" } }, "\uD50C\uB79C \uBE44\uAD50"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 18, style: {
    border: activePlan === "free" ? "2px solid var(--brand-500)" : "1px solid var(--line-subtle)",
    boxShadow: activePlan === "free" ? "var(--shadow-card-hover)" : "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm", style: { marginBottom: 8 } }, "\uBB34\uB8CC \uD50C\uB79C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, "\uD575\uC2EC \uAE30\uB2A5 \uBB34\uB8CC \uC0AC\uC6A9"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, "\uACB0\uC81C \uC815\uBCF4 \uC5C6\uC774 \uBC14\uB85C \uC2DC\uC791\uD574\uC694")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, "\u20A90"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, "\uC601\uAD6C \uBB34\uB8CC"))), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 } }, featureList.free.map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 14, color: "var(--success)" }), f))), activePlan === "free" ? /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "md", full: true, disabled: true }, "\uD604\uC7AC \uC0AC\uC6A9 \uC911") : /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "md", full: true, onClick: () => setDowngradeOpen(true) }, activePlan === "trial" ? "\uCCB4\uD5D8 \uC885\uB8CC \uD6C4 \uBB34\uB8CC \uD50C\uB79C\uC73C\uB85C \uC804\uD658" : "\uBB34\uB8CC \uD50C\uB79C\uC73C\uB85C \uC804\uD658")), /* @__PURE__ */ React.createElement(Card, { padding: 18, style: {
    border: activePlan === "paid" ? "2px solid var(--brand-500)" : "1px solid var(--brand-200)",
    background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { marginBottom: 8 } }, isStudent ? "\uD559\uC0DD" : "\uAD50\uC0AC", " \uC815\uC2DD \uD50C\uB79C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, "\uBAA8\uB4E0 \uAE30\uB2A5 \uC0AC\uC6A9"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, "\uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8 \uD6C4 \uC790\uB3D9 \uACB0\uC81C")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, planPrice), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, "\uC6D0 / \uC6D4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 10, color: "var(--success)", fontWeight: 700, marginTop: 2 } }, "\uC5F0\uAC04 ", annualPrice, "\uC6D0"))), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 } }, featureList.paid.map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 14, color: "var(--brand-500)" }), f))), activePlan === "trial" || activePlan === "paid" ? /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, disabled: true }, activePlan === "trial" ? "\uCCB4\uD5D8 \uC0AC\uC6A9 \uC911" : "\uACB0\uC81C \uC911") : /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, disabled: true, leading: /* @__PURE__ */ React.createElement(IcLock, { size: 14 }) }, "\uACB0\uC81C \uC5F0\uB3D9 \uD6C4 \uC2DC\uC791 \uAC00\uB2A5"))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACB0\uC81C \uC218\uB2E8", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "20px 16px",
    textAlign: "center",
    background: "var(--bg-muted)",
    borderRadius: 12,
    border: "1px dashed var(--line-strong)"
  } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 24, color: "var(--fg-subtle)", style: { margin: "0 auto 8px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 }, className: "kr-heading" }, "\uC544\uC9C1 \uACB0\uC81C \uC218\uB2E8\uC774 \uC5C6\uC5B4\uC694"), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911"))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACB0\uC81C \uB0B4\uC5ED" }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 22 }), title: "\uC544\uC9C1 \uACB0\uC81C \uB0B4\uC5ED\uC774 \uC5C6\uC5B4\uC694", body: "\uCCAB \uACB0\uC81C \uD6C4 \uC601\uC218\uC99D\uC744 \uC5EC\uAE30\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694." })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, fontSize: 11, color: "var(--fg-subtle)", lineHeight: 1.55, textAlign: "center" }, className: "kr-heading" }, "\uBB34\uB8CC \uD50C\uB79C\uC740 \uACB0\uC81C \uC5F0\uB3D9 \uC5EC\uBD80\uC640 \uBB34\uAD00\uD558\uAC8C \uC601\uAD6C \uC81C\uACF5\uB3FC\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uC815\uC2DD \uD50C\uB79C\uC740 \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20/\uD3EC\uD2B8\uC6D0 \uC5F0\uB3D9 \uC644\uB8CC \uD6C4 \uACB0\uC81C\uD560 \uC218 \uC788\uC5B4\uC694.")), downgradeOpen && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setDowngradeOpen(false), style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "min(380px, 100%)", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)", animation: "sheetIn 280ms var(--ease-toss)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: 14, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 24 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, "\uBB34\uB8CC \uD50C\uB79C\uC73C\uB85C \uC804\uD658\uD560\uAE4C\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 14 }, className: "kr-heading" }, isStudent ? "AI \uC0C1\uB2F4\uC740 \uC6D4 5\uD68C\uB85C \uC81C\uD55C\uB418\uBA70, \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uC640 \uC785\uC2DC \uBD84\uC11D\uC740 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uAC8C \uB3FC\uC694. \uB370\uC774\uD130\uB294 \uC720\uC9C0\uB3FC\uC694." : '\uD559\uAE09 \uCD5C\uB300 3\uBA85\uAE4C\uC9C0\uB9CC \uAD00\uB9AC\uD560 \uC218 \uC788\uC5B4\uC694. \uD604\uC7AC \uD559\uC0DD \uC218\uAC00 \uB9CE\uC73C\uBA74 \uC77C\uBD80\uB294 "\uAD50\uC0AC \uC5C6\uC74C" \uC0C1\uD0DC\uAC00 \uB3FC\uC694.'), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: () => setDowngradeOpen(false) }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: () => {
    setActivePlan("free");
    setDowngradeOpen(false);
  } }, "\uC804\uD658\uD558\uAE30")))));
}
function StudentProfile({ go, onLogout }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uB0B4\uC815\uBCF4" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: "\uC9C0", size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, "\uAE40\uC9C0\uD6C8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, "\uD55C\uBE5B\uACE0\uB4F1\uD559\uAD50 2\uD559\uB144 3\uBC18"), /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { marginTop: 6 } }, "\uC774\uC9C0\uC6D0 \uC120\uC0DD\uB2D8 \uD559\uAE09"))), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 })), title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", subtitle: "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("billing") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 16 })), title: "\uBAA9\uD45C \uB300\uD559\xB7\uD559\uACFC", subtitle: "\uD55C\uAD6D\uC608\uC220\uC885\uD569\uD559\uAD50 \uC601\uC0C1\uC774\uB860\uACFC", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }) }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcSchool, { size: 16 })), title: "\uD559\uAE09 \uC815\uBCF4", subtitle: "\uC774\uC9C0\uC6D0 \uC120\uC0DD\uB2D8", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), divider: false })), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-mint-bg)", color: "var(--accent-mint)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcFlag, { size: 16 })), title: "\uACF5\uC9C0\uC0AC\uD56D", subtitle: "\uC5C5\uB370\uC774\uD2B8 \uC18C\uC2DD \xB7 \uAC74\uC758\xB7\uBC84\uADF8 \uC81C\uBCF4", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("announcements") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16 })), title: "\uAC1C\uC778\uC815\uBCF4 \uBC0F \uBCF4\uC548", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => notReady("\uAC1C\uC778\uC815\uBCF4 \uBC0F \uBCF4\uC548") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 16 })), title: "\uC774\uC6A9\uC57D\uAD00", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => notReady("\uC774\uC6A9\uC57D\uAD00"), divider: false })), /* @__PURE__ */ React.createElement("button", { onClick: onLogout, style: {
    width: "100%",
    padding: 14,
    border: "none",
    background: "transparent",
    color: "var(--fg-muted)",
    fontSize: 14,
    cursor: "pointer"
  } }, "\uB85C\uADF8\uC544\uC6C3")));
}
function StudentStudy({ go }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { help: "study", title: "\uC774\uBC88 \uC8FC \uD559\uC2B5" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(EncouragementBanner, null), /* @__PURE__ */ React.createElement(Card, { padding: 18, onClick: () => go("focus-timer"), hoverable: true, style: { marginBottom: 12, background: "linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)", color: "#fff", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcZap, { size: 22, color: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 800 } }, "\uC790\uC2B5 \uD0C0\uC784\uC5B4\uD0DD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginTop: 2 }, className: "kr-heading" }, "\uC9D1\uC911 \uC2DC\uAC04\uC744 \uC815\uD558\uACE0 \uC790\uC2B5 \uB204\uC801 \uC2DC\uAC04\uC744 \uAE30\uB85D\uD574\uC694")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "#fff" }))), /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, "\uC774\uBC88 \uC8FC \uC9C4\uB3C4"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "5/8")), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 32, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-1px", marginBottom: 12 } }, "62.5", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--fg-muted)", fontWeight: 500 } }, "%")), /* @__PURE__ */ React.createElement(ProgressBar, { value: 5, max: 8, height: 8 })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC774\uBC88 \uC8FC \uC790\uC2B5", value: "8.4h", delta: "+1.2h", deltaTone: "success" }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD3C9\uADE0/\uC77C", value: "1.2h", hint: "\uBAA9\uD45C 1.5h" }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC5F0\uC18D \uC77C\uC218", value: "5\uC77C", delta: "\u{1F525}", deltaTone: "warning" })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC694\uC77C\uBCC4 \uC790\uC2B5 \uC2DC\uAC04", subtitle: "\uC774\uBC88 \uC8FC \xB7 \uC2DC\uAC04 \uB2E8\uC704", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-end", height: 110, padding: "4px 0" } }, [{ d: "\uC6D4", h: 1.5 }, { d: "\uD654", h: 2.1 }, { d: "\uC218", h: 0.8 }, { d: "\uBAA9", h: 1.7 }, { d: "\uAE08", h: 1.2 }, { d: "\uD1A0", h: 0, today: true }, { d: "\uC77C", h: 0 }].map((b) => {
    const max = 2.4;
    return /* @__PURE__ */ React.createElement("div", { key: b.d, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 10, fontWeight: 700, color: b.h ? "var(--fg-muted)" : "var(--fg-disabled)" } }, b.h ? b.h : "\u2013"), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: 70, display: "flex", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: "100%",
      height: `${Math.max(4, b.h / max * 70)}px`,
      borderRadius: 6,
      background: b.today ? "var(--brand-200)" : b.h ? "var(--brand-500)" : "var(--line)"
    } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: b.today ? "var(--brand-600)" : "var(--fg-muted)", fontWeight: b.today ? 700 : 500 } }, b.d));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uD654\uC694\uC77C\uC5D0 \uAC00\uC7A5 \uC9D1\uC911\uD588\uC5B4\uC694"), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcZap, { size: 13 }), onClick: () => go("focus-timer") }, "\uC790\uC2B5 \uC2DC\uC791"))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACFC\uBAA9\uBCC4 \uD559\uC2B5 \uBE44\uC911", subtitle: "\uC774\uBC88 \uC8FC \uC790\uC2B5 \uC2DC\uAC04 \uAE30\uC900", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [{ s: "\uC218\uD559", pct: 38, t: "brand-500" }, { s: "\uC601\uC5B4", pct: 24, t: "accent-purple" }, { s: "\uAD6D\uC5B4", pct: 20, t: "accent-mint" }, { s: "\uACFC\uD559", pct: 18, t: "warning" }].map((r) => /* @__PURE__ */ React.createElement("div", { key: r.s, style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: "var(--fg-default)", width: 36 } }, r.s), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 8, background: "var(--neutral-bg)", borderRadius: 999, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${r.pct}%`, height: "100%", background: `var(--${r.t})`, borderRadius: 999 } })), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", width: 32, textAlign: "right" } }, r.pct, "%"))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", margin: "4px 4px 8px" } }, "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uACC4\uD68D"), /* @__PURE__ */ React.createElement(Card, { padding: 0 }, [
    { t: "\uC218\uD559 II \uBBF8\uC801\uBD84 \uAE30\uBCF8 \uAC1C\uB150", d: "5\uC6D4 12\uC77C \uC644\uB8CC", done: true },
    { t: "\uC601\uC5B4 \uB2E8\uC5B4 100\uAC1C (Day 14)", d: "5\uC6D4 13\uC77C \uC644\uB8CC", done: true },
    { t: "\uAD6D\uC5B4 \uBE44\uBB38\uD559 3\uC9C0\uBB38", d: "\uC624\uB298\uAE4C\uC9C0", done: false },
    { t: "\uC0AC\uD68C \uB2E8\uC6D0\uD3C9\uAC00 7\uB2E8\uC6D0", d: "\uB0B4\uC77C\uAE4C\uC9C0", done: false },
    { t: "\uACFC\uD559 \uD654\uD559 4\uB2E8\uC6D0 \uBB38\uC81C", d: "\uC8FC\uB9D0\uAE4C\uC9C0", done: false }
  ].map((row, i, arr) => /* @__PURE__ */ React.createElement(
    ListRow,
    {
      key: i,
      leading: /* @__PURE__ */ React.createElement("div", { style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: row.done ? "var(--success-bg)" : "var(--bg-muted)",
        color: row.done ? "var(--success)" : "var(--fg-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      } }, row.done ? /* @__PURE__ */ React.createElement(IcCheck, { size: 14 }) : /* @__PURE__ */ React.createElement(IcDot, { size: 6 })),
      title: row.t,
      subtitle: row.d,
      divider: i < arr.length - 1
    }
  )))));
}
function NotificationDrawer({ open, onClose, items, role = "student" }) {
  if (!open) return null;
  const accentMap = {
    brand: { bg: "var(--brand-50)", fg: "var(--brand-600)" },
    purple: { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)" },
    success: { bg: "var(--success-bg)", fg: "var(--success)" },
    warning: { bg: "var(--warning-bg)", fg: "var(--warning)" },
    info: { bg: "var(--info-bg)", fg: "var(--brand-600)" },
    mint: { bg: "var(--accent-mint-bg)", fg: "var(--accent-mint)" },
    neutral: { bg: "var(--bg-muted)", fg: "var(--fg-muted)" }
  };
  return /* @__PURE__ */ React.createElement(BottomSheet, { open, onClose, title: "\uC54C\uB9BC", maxHeight: "86%" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, items.filter((i) => i.unread != null ? i.unread : !i.read).length, "\uAC1C \uC548 \uC77D\uC74C"), /* @__PURE__ */ React.createElement("button", { style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" } }, "\uBAA8\uB450 \uC77D\uC74C")), /* @__PURE__ */ React.createElement("div", null, items.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 20px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uC544\uC9C1 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694"), items.map((n, i) => {
    const a = accentMap[n.accent] || accentMap.neutral;
    const unread = n.unread != null ? n.unread : !n.read;
    return /* @__PURE__ */ React.createElement("div", { key: n.id, style: {
      display: "flex",
      gap: 12,
      padding: "14px 20px",
      borderTop: i === 0 ? "none" : "1px solid var(--line-subtle)",
      background: unread ? "rgba(49,130,246,0.025)" : "transparent",
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: a.bg,
      color: a.fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    } }, n.icon ? React.cloneElement(n.icon, { size: 18 }) : /* @__PURE__ */ React.createElement(IcBell, { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, n.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, n.time || n.createdAt)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45 }, className: "kr-heading" }, n.body)), unread && /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--brand-500)", marginTop: 14 } }));
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px 0", borderTop: "1px solid var(--line-subtle)", marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--fg-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--success)" } }), "\uC2E4\uC2DC\uAC04 \uC5F0\uACB0\uB428 (SSE)"), /* @__PURE__ */ React.createElement("span", null, "\uCD5C\uADFC \uB3D9\uAE30\uD654 \uBC29\uAE08 \uC804"))));
}
function StudentCounseling({ go }) {
  const [aiSessions, setAiSessions] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/ai-counseling/sessions?status=all", { method: "GET" });
        setAiSessions(r && r.data || []);
      } catch (e) {
        setAiSessions([]);
      }
    })();
  }, []);
  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.getMonth() + 1}\uC6D4 ${d.getDate()}\uC77C`;
    } catch {
      return "";
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC9C4\uB85C \uC0C1\uB2F4", subtitle: "\uC5B8\uC81C\uB4E0 \uB300\uD654\uD558\uBA70 \uC9C4\uB85C\uB97C \uC815\uB9AC\uD574\uC694", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }), onClick: () => go("ai-counseling") }, "AI \uC0C1\uB2F4 \uC774\uC5B4\uAC00\uAE30")), /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC0C1\uB2F4 \uAE30\uB85D", subtitle: "\uC9C0\uAE08\uAE4C\uC9C0 \uC9C4\uD589\uD55C AI \uC0C1\uB2F4 \uC138\uC158", style: { marginBottom: 12 } }, aiSessions === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 50 }) : aiSessions.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", padding: "8px 4px", lineHeight: 1.5 }, className: "kr-heading" }, "\uC544\uC9C1 \uC9C4\uD589\uD55C AI \uC0C1\uB2F4\uC774 \uC5C6\uC5B4\uC694. \uC704\uC5D0\uC11C \uCCAB \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, aiSessions.slice(0, 10).map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.id,
      onClick: () => go("ai-counseling"),
      style: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--line-subtle)", background: "var(--bg-surface)", borderRadius: 12, cursor: "pointer", textAlign: "left" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: s.status === "active" ? "var(--brand-50)" : "var(--bg-muted)", color: s.status === "active" ? "var(--brand-600)" : "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 14 })),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, s.title || (s.status === "active" ? "\uC9C4\uD589 \uC911\uC778 \uC0C1\uB2F4" : "AI \uC9C4\uB85C \uC0C1\uB2F4")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, fmt(s.startedAt), " \uC2DC\uC791", s.status === "ended" ? " \xB7 \uC885\uB8CC" : " \xB7 \uC9C4\uD589 \uC911")),
    /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" })
  )), aiSessions.length > 10 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", textAlign: "center", padding: "4px 0" } }, "+", aiSessions.length - 10, "\uAC1C \uC774\uC804 \uAE30\uB85D"))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC120\uC0DD\uB2D8\uACFC \uC0C1\uB2F4", subtitle: "\uB2F4\uB2F9 \uC120\uC0DD\uB2D8\uAED8 \uBA54\uC2DC\uC9C0\uB85C \uC0C1\uB2F4\uC744 \uC694\uCCAD\uD558\uC138\uC694" }, /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }), onClick: () => go("messages") }, "\uC120\uC0DD\uB2D8\uAED8 \uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.5 }, className: "kr-heading" }, "\uC0C1\uB2F4 \uC77C\uC815\uC740 \uCE98\uB9B0\uB354\uC5D0\uC11C \uC7A1\uACE0, \uBD09\uC0AC\xB7\uC785\uC2DC \uC77C\uC815\uB3C4 \uD568\uAED8 \uAD00\uB9AC\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), style: { marginTop: 6 }, onClick: () => go("calendar") }, "\uCE98\uB9B0\uB354 \uC5F4\uAE30"))));
}
function StudentApp({ initialScreen = "dashboard", heroVariant = "A" }) {
  const [screen, setScreen] = usePersistentScreen("student-mobile", initialScreen);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifItems, setNotifItems] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        setNotifItems(Array.isArray(r.data) ? r.data : r.data || []);
      } catch (e) {
      }
    })();
  }, []);
  const [coach, setCoach] = React.useState(() => {
    try {
      return window.__LIVE_MODE && !localStorage.getItem("jinro:mtour:student");
    } catch (e) {
      return false;
    }
  });
  const endCoach = () => {
    try {
      localStorage.setItem("jinro:mtour:student", "1");
    } catch (e) {
    }
    setCoach(false);
  };
  const showBottomNav = ["dashboard", "grades-trend", "career-report", "calendar", "profile"].includes(screen);
  const navId = (() => {
    if (screen === "dashboard") return "dashboard";
    if (screen.startsWith("grades")) return "grades-trend";
    if (screen.startsWith("career") || screen === "ai-counseling") return "career-report";
    if (screen === "calendar") return "calendar";
    if (screen === "profile" || screen === "billing") return "profile";
    if (screen === "student-info" || screen === "class-info" || screen === "announcements" || screen === "career-targets" || screen === "consents") return "profile";
    if (screen.startsWith("settings-")) return "profile";
    if (screen === "study" || screen === "focus-timer") return "dashboard";
    return "dashboard";
  })();
  return /* @__PURE__ */ React.createElement("div", { "data-app-root": true, style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto", paddingTop: 54 }, className: "toss-scroll" }, screen === "dashboard" && /* @__PURE__ */ React.createElement(StudentDashboard, { go: setScreen, openNotif: () => setScreen("notifications"), variant: heroVariant }), screen === "notifications" && /* @__PURE__ */ React.createElement(NotificationsScreen, { role: "student", variant: "mobile", onBack: () => setScreen("dashboard") }), screen === "ai-counseling" && /* @__PURE__ */ React.createElement(AICounseling, { go: setScreen, openSignals: () => {
  } }), screen === "career-report" && /* @__PURE__ */ React.createElement(CareerReport, { go: setScreen }), screen === "grades-trend" && /* @__PURE__ */ React.createElement(GradesTrend, { go: setScreen }), screen === "grades-input" && /* @__PURE__ */ React.createElement(GradesInputV2, { go: setScreen }), screen === "billing" && /* @__PURE__ */ React.createElement(StudentBilling, { go: setScreen }), screen === "profile" && /* @__PURE__ */ React.createElement(StudentProfileV2, { go: setScreen }), screen === "study" && /* @__PURE__ */ React.createElement(StudentStudy, { go: setScreen }), screen === "focus-timer" && /* @__PURE__ */ React.createElement(FocusTimer, { go: setScreen }), screen === "counseling" && /* @__PURE__ */ React.createElement(StudentCounseling, { go: setScreen }), screen === "messages" && /* @__PURE__ */ React.createElement(StudentMessages, { go: setScreen }), screen === "calendar" && /* @__PURE__ */ React.createElement(StudentCalendar, { go: setScreen }), screen === "settings-password" && /* @__PURE__ */ React.createElement(SettingsPassword, { back: () => setScreen("profile") }), screen === "settings-notifications" && /* @__PURE__ */ React.createElement(SettingsNotifications, { back: () => setScreen("profile"), role: "student" }), screen === "settings-suggest" && /* @__PURE__ */ React.createElement(SettingsSuggestion, { back: () => setScreen("profile") }), screen === "settings-announcements" && /* @__PURE__ */ React.createElement(SettingsAnnouncements, { back: () => setScreen("profile") }), screen === "settings-terms" && /* @__PURE__ */ React.createElement(SettingsTerms, { back: () => setScreen("profile") }), screen === "counseling-request" && /* @__PURE__ */ React.createElement(CounselingRequest, { go: setScreen }), screen === "admissions-hub" && /* @__PURE__ */ React.createElement(AdmissionsHub, { go: setScreen }), (screen === "volunteer" || screen === "volunteers") && /* @__PURE__ */ React.createElement(VolunteersScreen, { go: setScreen }), (screen === "scholarship" || screen === "scholarships") && /* @__PURE__ */ React.createElement(ScholarshipsScreen, { go: setScreen }), (screen === "foreign" || screen === "foreign-univ") && /* @__PURE__ */ React.createElement(ForeignUnivScreen, { go: setScreen }), screen === "admissions-univ" && /* @__PURE__ */ React.createElement(UniversityDetail, { go: setScreen }), screen === "admissions-dept" && /* @__PURE__ */ React.createElement(DepartmentDetail, { go: setScreen }), screen === "admissions-analysis" && /* @__PURE__ */ React.createElement(AdmissionsAnalysis, { go: setScreen }), screen === "consents" && /* @__PURE__ */ React.createElement(ConsentManagement, { go: setScreen, role: "student" }), screen === "study-plan" && /* @__PURE__ */ React.createElement(StudyPlanFull, { go: setScreen }), screen === "goal-setting" && /* @__PURE__ */ React.createElement(GoalSetting, { go: setScreen }), screen === "career-targets" && /* @__PURE__ */ React.createElement(CareerTargets, { go: setScreen }), screen === "ai-chat" && /* @__PURE__ */ React.createElement(AIChatRAG, { go: setScreen }), screen === "announcements" && /* @__PURE__ */ React.createElement(AnnouncementsScreen, { role: "student", variant: "mobile", onBack: () => setScreen("profile") }), screen === "student-info" && /* @__PURE__ */ React.createElement(StudentInfoScreen, { go: setScreen }), screen === "class-info" && /* @__PURE__ */ React.createElement(ClassInfoScreen, { go: setScreen })), showBottomNav && /* @__PURE__ */ React.createElement(MobileBottomNav, { items: STUDENT_NAV, activeId: navId, onChange: (id) => {
    if (id === "career-report") setScreen("career-report");
    else setScreen(id);
  } }), /* @__PURE__ */ React.createElement(NotificationDrawer, { open: notifOpen, onClose: () => setNotifOpen(false), items: notifItems }), coach && screen === "dashboard" && /* @__PURE__ */ React.createElement(MobileCoachTour, { role: "student", onDone: endCoach }));
}
Object.assign(window, { StudentApp, NotificationDrawer, STUDENT_NOTIFICATIONS });
