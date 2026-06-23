function useToastCycle(samples, intervalMs = 3500) {
  const [active, setActive] = React.useState([]);
  const idxRef = React.useRef(0);
  React.useEffect(() => {
    let dismiss = [];
    const fire = () => {
      const s = samples[idxRef.current % samples.length];
      idxRef.current += 1;
      const uid = `${s.id}-${Date.now()}`;
      setActive((a) => [{ ...s, id: uid }, ...a].slice(0, 3));
      const tid = setTimeout(() => {
        setActive((a) => a.filter((x) => x.id !== uid));
      }, s.duration || 6e3);
      dismiss.push(tid);
    };
    fire();
    const iv = setInterval(fire, intervalMs);
    return () => {
      clearInterval(iv);
      dismiss.forEach(clearTimeout);
    };
  }, [samples, intervalMs]);
  const close = (id) => setActive((a) => a.filter((x) => x.id !== id));
  return { active, close };
}
const STUDENT_WEB_NAV = [
  { id: "dashboard", label: "\uD648", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { section: "\uC9C4\uB85C" },
  { id: "ai-counseling", label: "AI \uC9C4\uB85C \uC0C1\uB2F4", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), badge: "\uC9C4\uD589 \uC911" },
  { id: "ai-chat", label: "AI \uB3C4\uC6C0\uB9D0", icon: /* @__PURE__ */ React.createElement(IcMessage, null), badge: "RAG" },
  { id: "career-report", label: "\uC9C4\uB85C \uB9AC\uD3EC\uD2B8", icon: /* @__PURE__ */ React.createElement(IcCompass, null) },
  { id: "career-targets", label: "\uC9C4\uB85C \uBAA9\uD45C", icon: /* @__PURE__ */ React.createElement(IcTarget, null) },
  { section: "\uB300\uD559\xB7\uC785\uC2DC" },
  { id: "admissions-hub", label: "\uB300\uD559\xB7\uC785\uC2DC (\uAD6D\uB0B4\xB7\uD574\uC678)", icon: /* @__PURE__ */ React.createElement(IcGraduation, null) },
  { id: "volunteers", label: "\uBD09\uC0AC\uD65C\uB3D9", icon: /* @__PURE__ */ React.createElement(IcHeart, null) },
  { id: "scholarships", label: "\uC7A5\uD559\uAE08", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null) },
  { section: "\uD559\uC2B5" },
  { id: "grades-trend", label: "\uC131\uC801", icon: /* @__PURE__ */ React.createElement(IcChart, null) },
  { id: "study-plan", label: "\uD559\uC2B5 \uACC4\uD68D", icon: /* @__PURE__ */ React.createElement(IcBook, null) },
  { id: "focus-timer", label: "\uC790\uC2B5 \uD0C0\uC784\uC5B4\uD0DD", icon: /* @__PURE__ */ React.createElement(IcZap, null) },
  { section: "\uC18C\uD1B5\xB7\uC77C\uC815" },
  { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null) },
  { id: "messages", label: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null) },
  { id: "counseling", label: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
  { id: "announcements", label: "\uACF5\uC9C0\uC0AC\uD56D", icon: /* @__PURE__ */ React.createElement(IcFlag, null) },
  { section: "\uACC4\uC815" },
  { id: "consents", label: "\uB3D9\uC758 \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcShield, null) },
  { id: "billing", label: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null) },
  { id: "profile", label: "\uB0B4\uC815\uBCF4", icon: /* @__PURE__ */ React.createElement(IcUser, null) }
];
function StudentWebSidebar({ activeId, onChange }) {
  const [goal, setGoal] = React.useState(null);
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
      }
      try {
        const [t, d] = await Promise.all([
          window.__apiFetch("/career/targets", { method: "GET" }).catch(() => null),
          window.__apiFetch("/dashboard/student", { method: "GET" }).catch(() => null)
        ]);
        const first = t && (t.data || [])[0];
        setGoal({
          career: first ? first.career : null,
          univ: first ? [first.univ, first.dept].filter(Boolean).join(" ") : null,
          progress: d && d.data && d.data.aiProgress || 0
        });
      } catch (e) {
        setGoal({ career: null, univ: null, progress: 0 });
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
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "0 8px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--brand-500)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, "\uD559\uC0DD\uC6A9"))), /* @__PURE__ */ React.createElement("div", { onClick: () => onChange && onChange(goal && goal.career ? "career-targets" : "ai-counseling"), style: { margin: "0 0 16px", padding: 14, borderRadius: 12, background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginBottom: 4 } }, "\uB098\uC758 \uBAA9\uD45C"), goal && goal.career ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700 }, className: "kr-heading" }, goal.career), goal.univ && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, opacity: 0.85, marginTop: 2 } }, goal.univ)) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700 }, className: "kr-heading" }, "\uC544\uC9C1 \uBAA9\uD45C\uAC00 \uC5C6\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 999, marginTop: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: (goal && goal.progress || 0) + "%", height: "100%", background: "#fff" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, opacity: 0.85, marginTop: 6 } }, "AI \uC0C1\uB2F4 \uC9C4\uD589\uB3C4 ", goal && goal.progress || 0, "%")), /* @__PURE__ */ React.createElement("nav", { className: "toss-scroll", style: { display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto", minHeight: 0 } }, STUDENT_WEB_NAV.map((it, idx) => {
    if (it.section) {
      return /* @__PURE__ */ React.createElement("div", { key: "sec-" + it.section, style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", letterSpacing: "0.4px", padding: "12px 12px 4px", textTransform: "uppercase" } }, it.section);
    }
    const active = activeId === it.id;
    const tourAttr = {
      "ai-counseling": "student-nav-ai",
      "career-targets": "student-nav-targets",
      "admissions-hub": "student-nav-admissions",
      "grades-trend": "student-nav-grades",
      "study-plan": "student-nav-study",
      "ai-chat": "student-nav-aichat",
      "counseling": "student-nav-counseling",
      "messages": "student-nav-messages",
      "calendar": "student-nav-calendar",
      "announcements": "student-nav-notice"
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
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      textAlign: "left",
      width: "100%"
    } }, React.cloneElement(it.icon, { size: 17 }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, it.label), it.badge != null && /* @__PURE__ */ React.createElement("span", { style: {
      background: typeof it.badge === "number" ? "var(--danger)" : "var(--accent-purple)",
      color: "#fff",
      fontSize: 9,
      fontWeight: 700,
      padding: "2px 6px",
      borderRadius: 999
    } }, it.badge));
  })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 8px 0", borderTop: "1px solid var(--line-subtle)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(SidebarUserMenu, { name: me && me.name || "\uD559\uC0DD", sub: me && [me.school, me.classroom].filter(Boolean).join(" ") || "", avatar: (me && me.name || "\uD559")[0], onProfile: () => onChange && onChange("profile") })));
}
function StudentWebDashboard({ go }) {
  const isMobile = useViewportMobile();
  const [me, setMe] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [events, setEvents] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
      try {
        const r = await window.__apiFetch("/dashboard/student", { method: "GET" });
        setStats(r.data || {});
      } catch (e) {
        setStats({});
      }
      try {
        const now = /* @__PURE__ */ new Date();
        const to = new Date(now.getTime() + 30 * 864e5);
        const r = await window.__apiFetch("/calendar/events?from=" + now.toISOString() + "&to=" + to.toISOString(), { method: "GET" });
        setEvents((r.data || []).slice(0, 5));
      } catch (e) {
        setEvents([]);
      }
    })();
  }, []);
  const name = me && me.name || "";
  const s = stats || {};
  const gradeAvg = s.gradeAverage != null ? String(s.gradeAverage) : "\u2014";
  const aiProgress = s.aiProgress != null ? s.aiProgress : 0;
  const trend = s.gradeTrend || [];
  const goTo = (id) => go && go(id);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: isMobile ? "14px 16px" : "16px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)"
  } }, /* @__PURE__ */ React.createElement("div", { "data-tour": "student-greeting" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.4px" }, className: "kr-heading" }, "\uC548\uB155\uD558\uC138\uC694", name ? ", " + name + "\uB2D8" : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2 } }, "\uC624\uB298\uB3C4 \uC9C4\uB85C\uB97C \uD55C \uAC78\uC74C \uC815\uB9AC\uD574\uBCFC\uAE4C\uC694?")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(NotifBell, { role: "student" }))), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: isMobile ? 16 : 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Card, { padding: 28, style: { background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 14 : 0, justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff", marginBottom: 10 } }, "AI \uC9C4\uB85C \uC0C1\uB2F4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.6px", maxWidth: 560 }, className: "kr-heading" }, aiProgress > 0 ? "\uC0C1\uB2F4\uC744 \uC774\uC5B4\uAC00\uBA70 \uC9C4\uB85C\uB97C \uC881\uD600\uAC00\uC694" : "\uB300\uD654 \uD55C \uBC88\uC73C\uB85C \uC9C4\uB85C \uD0D0\uC0C9\uC744 \uC2DC\uC791\uD574\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85, marginTop: 10 } }, aiProgress > 0 ? "\uC9C4\uD589\uB3C4 " + aiProgress + "% \xB7 \uB2E8\uC11C " + (s.signalsCount || 0) + "\uAC1C" : "\uC544\uC9C1 \uC0C1\uB2F4 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694")), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", style: { background: "#fff", color: "var(--brand-600)" }, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }), onClick: () => goTo("ai-counseling") }, aiProgress > 0 ? "AI \uC0C1\uB2F4 \uC774\uC5B4\uAC00\uAE30" : "AI \uC0C1\uB2F4 \uC2DC\uC791\uD558\uAE30"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD5C\uADFC \uD3C9\uADE0", value: gradeAvg, delta: s.hasGrades ? "\uB0B4 \uC131\uC801" : "\uBBF8\uC785\uB825", deltaTone: s.hasGrades ? "success" : "neutral", icon: /* @__PURE__ */ React.createElement(IcChart, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "AI \uC0C1\uB2F4 \uC9C4\uD589\uB3C4", value: aiProgress + "%", delta: "\uB2E8\uC11C " + (s.signalsCount || 0) + "\uAC1C", deltaTone: "info", icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uB2E4\uAC00\uC624\uB294 \uC77C\uC815", value: (s.upcomingCount || 0) + "\uAC74", delta: "7\uC77C \uC774\uB0B4", deltaTone: "neutral", icon: /* @__PURE__ */ React.createElement(IcCalendar, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uAD00\uC2EC \uC9C4\uB85C\xB7\uD559\uACFC", value: (s.targetCount || 0) + "\uAC1C", delta: "\uC9C4\uB85C \uBAA9\uD45C", deltaTone: "info", icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC131\uC801 \uCD94\uC774", subtitle: "\uD559\uAE30\uBCC4 \uD3C9\uADE0", action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => goTo("grades-trend") }, "\uC131\uC801 \uAD00\uB9AC") }, trend.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 8px", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uC544\uC9C1 \uC785\uB825\uB41C \uC131\uC801\uC774 \uC5C6\uC5B4\uC694. ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--brand-600)", cursor: "pointer", fontWeight: 600 }, onClick: () => goTo("grades-trend") }, "\uC131\uC801 \uC785\uB825\uD558\uAE30 \u2192")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 12, padding: "8px 4px", height: 140 } }, trend.map((t, i) => {
    const h = Math.max(8, Math.round(t.average / 100 * 110));
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, t.average), /* @__PURE__ */ React.createElement("div", { style: { width: "70%", height: h, background: "var(--brand-500)", borderRadius: "6px 6px 0 0" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, t.term));
  }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB2E4\uAC00\uC624\uB294 \uC77C\uC815", action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }), onClick: () => goTo("calendar") }, "\uCE98\uB9B0\uB354 \uC804\uCCB4") }, events === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 48 }) : events.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 8px", textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uC608\uC815\uB41C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694. \uBD09\uC0AC\xB7\uC785\uC2DC \uC77C\uC815\uC744 \uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00\uD574\uBCF4\uC138\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, events.map((e, i) => {
    const dt = new Date(e.startsAt);
    const mm = dt.getMonth() + 1, dd = dt.getDate();
    return /* @__PURE__ */ React.createElement("div", { key: e.id || i, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--bg-muted)", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, textAlign: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, dd), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, mm, "\uC6D4")), /* @__PURE__ */ React.createElement("div", { style: { width: 3, height: 32, background: "var(--brand-500)", borderRadius: 999 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, [e.location, dt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })].filter(Boolean).join(" \xB7 "))));
  })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBC14\uB85C\uAC00\uAE30", padding: 18 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [
    { id: "ai-counseling", label: "AI \uC9C4\uB85C \uC0C1\uB2F4", icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }) },
    { id: "admissions-hub", label: "\uB300\uD559\xB7\uC785\uC2DC \uCC3E\uAE30", icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 16 }) },
    { id: "volunteers", label: "\uBD09\uC0AC\uD65C\uB3D9 \uCC3E\uAE30", icon: /* @__PURE__ */ React.createElement(IcHeart, { size: 16 }) },
    { id: "scholarships", label: "\uC7A5\uD559\uAE08 \uCC3E\uAE30", icon: /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 }) },
    { id: "grades-trend", label: "\uC131\uC801 \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcChart, { size: 16 }) }
  ].map((it) => /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => goTo(it.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", borderRadius: 10, background: "var(--bg-muted)", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--fg-default)" } }, it.icon, /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, it.label), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" })))))))));
}
const ONBOARD_GRADES = [
  ["E4", "\uCD084"],
  ["E5", "\uCD085"],
  ["E6", "\uCD086"],
  ["M1", "\uC9111"],
  ["M2", "\uC9112"],
  ["M3", "\uC9113"],
  ["H1", "\uACE01"],
  ["H2", "\uACE02"],
  ["H3", "\uACE03"]
];
function OAuthOnboarding() {
  const [flag, setFlag] = React.useState(() => {
    try {
      const raw = localStorage.getItem("jinro:onboard");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [name, setName] = React.useState(() => flag && flag.name || "");
  const [grade, setGrade] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [mkt, setMkt] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  if (!flag) return null;
  const submit = async () => {
    setErr("");
    if (!name.trim()) {
      setErr("\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    if (!grade) {
      setErr("\uD559\uB144\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");
      return;
    }
    if (!agree) {
      setErr("\uD544\uC218 \uC57D\uAD00\uC5D0 \uB3D9\uC758\uD574\uC8FC\uC138\uC694.");
      return;
    }
    setBusy(true);
    try {
      await window.__apiFetch("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          grade,
          consents: { tos: true, privacy: true, academic: true, ai: true, age: true, mkt }
        })
      });
      try {
        localStorage.removeItem("jinro:onboard");
        const role = typeof window !== "undefined" && window.__ACTIVE_ROLE || "student-web";
        localStorage.setItem("jinro:screen:" + role, "ai-counseling");
        window.location.hash = role + "/ai-counseling";
      } catch (e) {
      }
      window.location.reload();
    } catch (e) {
      const msg = e && e.body && (e.body.message || e.body.error && e.body.error.message) || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.";
      setErr(msg);
      setBusy(false);
    }
  };
  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border-default, #e2e8f0)", fontSize: 15, boxSizing: "border-box", background: "var(--bg-surface, #fff)", color: "var(--text-strong, #0f172a)" };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 440, background: "var(--bg-surface, #fff)", borderRadius: 20, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "var(--text-strong, #0f172a)" } }, "\uD68C\uC6D0\uAC00\uC785 \uB9C8\uBB34\uB9AC"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 20px", fontSize: 14, color: "var(--text-muted, #64748b)" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC744 \uC2DC\uC791\uD558\uAE30 \uC804\uC5D0 \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--text-strong, #0f172a)" } }, "\uC774\uB984"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: name, onChange: (e) => setName(e.target.value), placeholder: "\uC2E4\uBA85\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694" }), /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 700, margin: "16px 0 6px", color: "var(--text-strong, #0f172a)" } }, "\uD559\uB144"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 } }, ONBOARD_GRADES.map(([v, label]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: v,
      type: "button",
      onClick: () => setGrade(v),
      style: {
        padding: "10px 0",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        border: grade === v ? "2px solid var(--brand, #4f46e5)" : "1px solid var(--border-default, #e2e8f0)",
        background: grade === v ? "var(--brand-soft, #eef2ff)" : "var(--bg-surface, #fff)",
        color: grade === v ? "var(--brand, #4f46e5)" : "var(--text-strong, #0f172a)"
      }
    },
    label
  ))), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "flex-start", gap: 10, margin: "20px 0 10px", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: agree, onChange: (e) => setAgree(e.target.checked), style: { marginTop: 3, width: 18, height: 18 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-strong, #0f172a)" } }, /* @__PURE__ */ React.createElement("b", null, "[\uD544\uC218]"), " \uC774\uC6A9\uC57D\uAD00\xB7\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68\xB7\uD559\uC2B5\uC815\uBCF4 \uD65C\uC6A9\xB7AI \uBD84\uC11D \uC774\uC6A9 \uBC0F \uB9CC 14\uC138 \uC774\uC0C1\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: mkt, onChange: (e) => setMkt(e.target.checked), style: { marginTop: 3, width: 18, height: 18 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-muted, #64748b)" } }, "[\uC120\uD0DD] \uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4.")), err && /* @__PURE__ */ React.createElement("div", { style: { color: "#dc2626", fontSize: 13, marginBottom: 12, fontWeight: 600 } }, err), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: submit,
      disabled: busy,
      style: {
        width: "100%",
        padding: "14px 0",
        borderRadius: 12,
        border: "none",
        cursor: busy ? "default" : "pointer",
        background: busy ? "var(--border-default, #cbd5e1)" : "var(--brand, #4f46e5)",
        color: "#fff",
        fontSize: 16,
        fontWeight: 800
      }
    },
    busy ? "\uC800\uC7A5 \uC911\u2026" : "\uC2DC\uC791\uD558\uAE30"
  )));
}
function StudentWebApp({ initialScreen = "dashboard", withToasts = false }) {
  const [screen, setScreen] = usePersistentScreen("student-web", initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const cycle = useToastCycle(SAMPLE_TOASTS.student, 4200);
  const tour = useTour(STUDENT_TOUR_STEPS, "student");
  React.useEffect(() => {
    try {
      if (window.__LIVE_MODE && localStorage.getItem("jinro:webtour:student")) tour.setPhase("done");
    } catch (e) {
    }
  }, []);
  React.useEffect(() => {
    if (tour.phase === "done") {
      try {
        localStorage.setItem("jinro:webtour:student", "1");
      } catch (e) {
      }
    }
  }, [tour.phase]);
  const navId = (() => {
    if (screen === "dashboard") return "dashboard";
    if (screen === "ai-counseling") return "ai-counseling";
    if (screen === "ai-chat") return "ai-chat";
    if (screen === "career-report") return "career-report";
    if (screen === "career-targets" || screen === "goal-setting") return "career-targets";
    if (screen.startsWith("admissions")) return "admissions-hub";
    if (screen === "volunteers") return "volunteers";
    if (screen === "scholarships") return "scholarships";
    if (screen === "foreign-univ") return "admissions-hub";
    if (screen.startsWith("grades")) return "grades-trend";
    if (screen === "counseling" || screen === "counseling-request") return "counseling";
    if (screen === "study" || screen === "study-plan") return "study-plan";
    if (screen === "focus-timer") return "focus-timer";
    if (screen === "messages") return "messages";
    if (screen === "calendar") return "calendar";
    if (screen === "consents") return "consents";
    if (screen === "announcements") return "announcements";
    if (screen === "billing") return "billing";
    if (screen === "profile") return "profile";
    if (screen === "student-info" || screen === "class-info") return "profile";
    if (screen.startsWith("settings-")) return "profile";
    return "dashboard";
  })();
  const renderContent = () => {
    if (screen === "dashboard") return /* @__PURE__ */ React.createElement(StudentWebDashboard, { go: setScreen });
    return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", display: "flex", justifyContent: "center", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: screen === "ai-counseling" ? 880 : 760, padding: "24px 16px 24px" } }, screen === "ai-counseling" && /* @__PURE__ */ React.createElement(AICounseling, { go: setScreen, openSignals: () => {
    } }), screen === "career-report" && /* @__PURE__ */ React.createElement(CareerReport, { go: setScreen }), screen === "grades-trend" && /* @__PURE__ */ React.createElement(GradesTrend, { go: setScreen }), screen === "grades-input" && /* @__PURE__ */ React.createElement(GradesInputV2, { go: setScreen }), screen === "billing" && /* @__PURE__ */ React.createElement(StudentBilling, { go: setScreen }), screen === "profile" && /* @__PURE__ */ React.createElement(StudentProfileV2, { go: setScreen }), screen === "student-info" && /* @__PURE__ */ React.createElement(StudentInfoScreen, { go: setScreen }), screen === "class-info" && /* @__PURE__ */ React.createElement(ClassInfoScreen, { go: setScreen }), screen === "settings-password" && /* @__PURE__ */ React.createElement(SettingsPassword, { back: () => setScreen("profile") }), screen === "settings-notifications" && /* @__PURE__ */ React.createElement(SettingsNotifications, { back: () => setScreen("profile"), role: "student" }), screen === "settings-suggest" && /* @__PURE__ */ React.createElement(SettingsSuggestion, { back: () => setScreen("profile") }), screen === "settings-announcements" && /* @__PURE__ */ React.createElement(SettingsAnnouncements, { back: () => setScreen("profile") }), screen === "settings-terms" && /* @__PURE__ */ React.createElement(SettingsTerms, { back: () => setScreen("profile") }), screen === "study" && /* @__PURE__ */ React.createElement(StudentStudy, { go: setScreen }), screen === "focus-timer" && /* @__PURE__ */ React.createElement(FocusTimer, { go: setScreen }), screen === "counseling" && /* @__PURE__ */ React.createElement(StudentCounseling, { go: setScreen }), screen === "messages" && /* @__PURE__ */ React.createElement(StudentMessages, { go: setScreen }), screen === "calendar" && /* @__PURE__ */ React.createElement(StudentCalendar, { go: setScreen }), screen === "counseling-request" && /* @__PURE__ */ React.createElement(CounselingRequest, { go: setScreen }), screen === "admissions-hub" && /* @__PURE__ */ React.createElement(AdmissionsHub, { go: setScreen }), screen === "volunteers" && /* @__PURE__ */ React.createElement(VolunteersScreen, { go: setScreen }), screen === "scholarships" && /* @__PURE__ */ React.createElement(ScholarshipsScreen, { go: setScreen }), screen === "foreign-univ" && /* @__PURE__ */ React.createElement(ForeignUnivScreen, { go: setScreen }), screen === "admissions-univ" && /* @__PURE__ */ React.createElement(UniversityDetail, { go: setScreen }), screen === "admissions-dept" && /* @__PURE__ */ React.createElement(DepartmentDetail, { go: setScreen }), screen === "admissions-analysis" && /* @__PURE__ */ React.createElement(AdmissionsAnalysis, { go: setScreen }), screen === "consents" && /* @__PURE__ */ React.createElement(ConsentManagement, { go: setScreen, role: "student" }), screen === "announcements" && /* @__PURE__ */ React.createElement(AnnouncementsScreen, { role: "student", variant: "web" }), screen === "study-plan" && /* @__PURE__ */ React.createElement(StudyPlanFull, { go: setScreen }), screen === "goal-setting" && /* @__PURE__ */ React.createElement(GoalSetting, { go: setScreen }), screen === "career-targets" && /* @__PURE__ */ React.createElement(CareerTargets, { go: setScreen }), screen === "ai-chat" && /* @__PURE__ */ React.createElement(AIChatRAG, { go: setScreen }))));
  };
  const wrapNav = (s) => {
    setScreen(s);
    setNavOpen(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: isMobile ? "column" : "row", height: "100%", background: "var(--bg-canvas)", position: "relative", overflow: "hidden" } }, isMobile && /* @__PURE__ */ React.createElement(MobileTopBar, { title: "\uC9C4\uB85C\uB098\uCE68\uBC18", onMenu: () => setNavOpen(true) }), isMobile ? /* @__PURE__ */ React.createElement(SidebarDrawer, { open: navOpen, onClose: () => setNavOpen(false) }, /* @__PURE__ */ React.createElement(StudentWebSidebar, { activeId: navId, onChange: wrapNav })) : /* @__PURE__ */ React.createElement(StudentWebSidebar, { activeId: navId, onChange: setScreen }), /* @__PURE__ */ React.createElement("main", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, overflowY: "auto" } }, renderContent()), withToasts && /* @__PURE__ */ React.createElement(WebToastHost, { toasts: cycle.active, onClose: cycle.close }), /* @__PURE__ */ React.createElement(TourOverlay, { tour }));
}
const TEACHER_MOBILE_NAV = [
  { id: "dashboard", label: "\uD648", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { id: "students", label: "\uD559\uC0DD", icon: /* @__PURE__ */ React.createElement(IcUsers, null) },
  { id: "messages", label: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null) },
  { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null) },
  { id: "profile", label: "\uB0B4\uC815\uBCF4", icon: /* @__PURE__ */ React.createElement(IcUser, null) }
];
function TeacherMobileDashboard() {
  const [me, setMe] = React.useState(null);
  const [roster, setRoster] = React.useState(null);
  const [requests, setRequests] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
    })();
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/students", { method: "GET" });
        setRoster(r.data || []);
      } catch (e) {
        setRoster([]);
      }
    })();
    (async () => {
      try {
        const r = await window.__apiFetch("/counseling-requests", { method: "GET" });
        setRequests(r.data || []);
      } catch (e) {
        setRequests([]);
      }
    })();
  }, []);
  const u = me || {};
  const list = roster || [];
  const reqs = requests || [];
  const classLine = [u.school, u.classroom].filter(Boolean).join(" ");
  const subline = [classLine, roster === null ? null : list.length + "\uBA85"].filter(Boolean).join(" \xB7 ") || "\uD559\uAE09 \uC815\uBCF4 \uC5C6\uC74C";
  const active = list.filter((s) => (s.studyDone || 0) > 0).length;
  const focus = list.filter((s) => s.needsCounseling);
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, me === null ? "\uC548\uB155\uD558\uC138\uC694" : "\uC548\uB155\uD558\uC138\uC694, " + (u.name || "\uC120\uC0DD\uB2D8") + (u.name ? " \uC120\uC0DD\uB2D8" : "")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, subline)), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 22 }), ariaLabel: "\uC54C\uB9BC" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD65C\uB3D9 \uC911", value: roster === null ? "\u2026" : active + "\uBA85", delta: "\uD559\uC2B5 \uC2DC\uC791", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcZap, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC0C1\uB2F4 \uC694\uCCAD", value: requests === null ? "\u2026" : reqs.length + "\uAC74", delta: "\uB300\uAE30", deltaTone: "warning", icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC624\uB298 \uC8FC\uBAA9\uD560 \uD559\uC0DD", subtitle: roster === null ? "\uBD88\uB7EC\uC624\uB294 \uC911" : "\uC0C1\uB2F4 \uD544\uC694 " + focus.length + "\uBA85", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, roster === null ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", padding: "8px 4px" } }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026") : focus.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", padding: "12px 4px", textAlign: "center" }, className: "kr-heading" }, "\uC0C1\uB2F4\uC774 \uD544\uC694\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694.") : focus.map((s, i) => {
    const nm = s.name || "\uD559\uC0DD";
    const why = [s.studyTotal ? "\uD559\uC2B5 " + (s.studyDone || 0) + "/" + s.studyTotal : null].filter(Boolean).join(" \xB7 ") || "\uC0C1\uB2F4 \uD544\uC694";
    return /* @__PURE__ */ React.createElement("div", { key: s.id || i, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line-subtle)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: nm[0], size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, nm), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" }, className: "kr-heading" }, why)), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC6B0\uC120"));
  }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC0C1\uB2F4 \uC694\uCCAD \uB300\uAE30", subtitle: requests === null ? "\uBD88\uB7EC\uC624\uB294 \uC911" : reqs.length + "\uAC74", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, requests === null ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", padding: "8px 4px" } }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026") : reqs.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", padding: "12px 4px", textAlign: "center" }, className: "kr-heading" }, "\uB300\uAE30 \uC911\uC778 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC5C6\uC5B4\uC694.") : reqs.map((r, i) => {
    const nm = r.studentName || r.name || "\uD559\uC0DD";
    const when = r.preferredAt || r.when || r.createdAt || "";
    return /* @__PURE__ */ React.createElement("div", { key: r.id || i, style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: nm[0], size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, nm), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, when)), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm" }, "\uCC98\uB9AC"));
  }))), /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uAD50\uC0AC \uD50C\uB79C \xB7 \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", marginTop: 6 } }, "\uBB34\uB8CC \uCCB4\uD5D8 \uC911"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911 (\uD604\uC7AC \uC804 \uAE30\uB2A5 \uBB34\uB8CC)")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "var(--fg-subtle)" }))));
}
function TeacherMobileApp({ withToasts = false }) {
  const [screen, setScreen] = React.useState("dashboard");
  const cycle = useToastCycle(SAMPLE_TOASTS.teacher, 4200);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto", paddingTop: 54 }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement(TeacherMobileDashboard, null)), /* @__PURE__ */ React.createElement(MobileBottomNav, { items: TEACHER_MOBILE_NAV, activeId: screen, onChange: setScreen }), withToasts && /* @__PURE__ */ React.createElement(MobileToastHost, { toasts: cycle.active, onClose: cycle.close }));
}
const ADMIN_MOBILE_NAV = [
  { id: "dashboard", label: "\uB300\uC2DC\uBCF4\uB4DC", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { id: "alerts", label: "\uACBD\uBCF4", icon: /* @__PURE__ */ React.createElement(IcAlert, null) },
  { id: "users", label: "\uC0AC\uC6A9\uC790", icon: /* @__PURE__ */ React.createElement(IcUsers, null) },
  { id: "system", label: "\uC2DC\uC2A4\uD15C", icon: /* @__PURE__ */ React.createElement(IcServer, null) },
  { id: "audit", label: "\uAC10\uC0AC", icon: /* @__PURE__ */ React.createElement(IcDoc, null) }
];
function AdminMobileDashboard() {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 1 } }, "Super Admin"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, "\uC6B4\uC601 \uB300\uC2DC\uBCF4\uB4DC")), /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, "\uC815\uC0C1")), /* @__PURE__ */ React.createElement(Card, { padding: 14, style: { marginBottom: 12, background: "var(--danger-bg)", border: "1px solid #F5C2C7", boxShadow: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--danger)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 16 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--danger)" } }, "\uACB0\uC81C \uC2E4\uD328\uC728 \uC784\uACC4\uCE58 \uCD08\uACFC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--danger)", opacity: 0.85, marginTop: 2 } }, "\uCD5C\uADFC 10\uBD84 8.4% (\uC784\uACC4 5%)")), /* @__PURE__ */ React.createElement("button", { style: { background: "var(--danger)", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700 } }, "\uCC98\uB9AC"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uC0AC\uC6A9\uC790", value: "1,284", delta: "+42", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD65C\uC131 \uAD6C\uB3C5", value: "312", delta: "+9", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcStar, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "MRR (\uC608\uC0C1)", value: "\u20A93.4M", delta: "+\u20A9240K", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uACB0\uC81C \uC2E4\uD328", value: "6\uAC74", delta: "\uCC98\uB9AC \uD544\uC694", deltaTone: "warning", icon: /* @__PURE__ */ React.createElement(IcAlert, { size: 16 }) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC2DC\uC2A4\uD15C \uD55C\uB208\uC5D0", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [
    { label: "API", value: "OK", detail: "p95 124ms", tone: "success", icon: /* @__PURE__ */ React.createElement(IcServer, { size: 12 }) },
    { label: "DB", value: "OK", detail: "conn 18/100", tone: "success", icon: /* @__PURE__ */ React.createElement(IcDb, { size: 12 }) },
    { label: "SSE", value: "24\uBA85 \uC5F0\uACB0", detail: "\uD3C9\uADE0 7s lag", tone: "success", icon: /* @__PURE__ */ React.createElement(IcWifi, { size: 12 }) },
    { label: "AI Provider", value: "\uC815\uC0C1", detail: "Anthropic + OpenAI \uB4C0\uC5BC", tone: "success", icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 12 }) },
    { label: "Redis", value: "\uACC4\uD68D\uB428", detail: "\uB3C4\uC785 \uC608\uC815", tone: "neutral", icon: /* @__PURE__ */ React.createElement(IcZap, { size: 12 }) }
  ].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 6, borderBottom: i < 4 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 6, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, s.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, s.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, s.detail)), /* @__PURE__ */ React.createElement(Chip, { tone: s.tone, size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 5 }) }, s.value))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD5C\uADFC \uC6B4\uC601 \uB85C\uADF8" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [
    { t: "\uD658\uBD88 \uCC98\uB9AC", target: "pay_77140", reason: "\uC911\uBCF5 \uACB0\uC81C \uD655\uC778", time: "12\uBD84 \uC804" },
    { t: "\uC0AC\uC6A9\uC790 \uBE44\uD65C\uC131\uD654", target: "u_a1b22c", reason: "\uCF58\uD150\uCE20 \uC815\uCC45 \uAC80\uD1A0 \uC911", time: "1\uC2DC\uAC04 \uC804" },
    { t: "\uBC30\uD3EC \uC644\uB8CC", target: "v0.42.2", reason: "CI \uC790\uB3D9 \uBC30\uD3EC", time: "2\uC2DC\uAC04 \uC804" }
  ].map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, a.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", background: "var(--bg-muted)", padding: "1px 4px", borderRadius: 3 } }, a.target), " \xB7 ", a.time))))));
}
function AdminMobileApp({ withToasts = false }) {
  const [screen, setScreen] = React.useState("dashboard");
  const cycle = useToastCycle(SAMPLE_TOASTS.admin, 4500);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto", paddingTop: 54 }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement(AdminMobileDashboard, null)), /* @__PURE__ */ React.createElement(MobileBottomNav, { items: ADMIN_MOBILE_NAV, activeId: screen, onChange: setScreen }), withToasts && /* @__PURE__ */ React.createElement(MobileToastHost, { toasts: cycle.active, onClose: cycle.close }));
}
function TeacherWebWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.teacher, 4200);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(WebToastHost, { toasts: cycle.active, onClose: cycle.close }));
}
function AdminWebWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.admin, 4500);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(WebToastHost, { toasts: cycle.active, onClose: cycle.close }));
}
function StudentMobileWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.student, 4200);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(StudentApp, { initialScreen: "dashboard", heroVariant: "A" }), /* @__PURE__ */ React.createElement(MobileToastHost, { toasts: cycle.active, onClose: cycle.close }));
}
Object.assign(window, {
  StudentWebApp,
  TeacherMobileApp,
  AdminMobileApp,
  TeacherWebWithToasts,
  AdminWebWithToasts,
  StudentMobileWithToasts,
  useToastCycle,
  OAuthOnboarding
});
