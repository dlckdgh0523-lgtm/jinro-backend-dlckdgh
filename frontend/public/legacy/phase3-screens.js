const STRATEGY_STATUSES = {
  exploring: { label: "\uD0D0\uC0C9 \uC911", tone: "info", desc: "\uC544\uC9C1 \uB2E8\uC11C\uAC00 \uC313\uC774\uACE0 \uC788\uC5B4\uC694", icon: /* @__PURE__ */ React.createElement(IcSearch, null) },
  forming: { label: "\uAC00\uC124 \uD615\uC131 \uC911", tone: "purple", desc: "\uB300\uD654\uC5D0\uC11C \uD328\uD134\uC774 \uBCF4\uC774\uAE30 \uC2DC\uC791\uD588\uC5B4\uC694", icon: /* @__PURE__ */ React.createElement(IcSparkles, null) },
  validating: { label: "\uAC80\uC99D \uC911", tone: "warning", desc: "\uACBD\uD5D8\xB7\uB370\uC774\uD130\uB85C \uD655\uC778\uC774 \uD544\uC694\uD574\uC694", icon: /* @__PURE__ */ React.createElement(IcTarget, null) },
  preparing: { label: "\uC900\uBE44 \uC911", tone: "brand", desc: "\uAD6C\uCCB4\uC801 \uC900\uBE44 \uB2E8\uACC4\uC5D0 \uB4E4\uC5B4\uC654\uC5B4\uC694", icon: /* @__PURE__ */ React.createElement(IcCheckCircle, null) },
  on_track: { label: "\uACBD\uB85C \uC9C4\uD589 \uC911", tone: "success", desc: "\uACC4\uD68D\uB300\uB85C \uC798 \uB098\uC544\uAC00\uACE0 \uC788\uC5B4\uC694", icon: /* @__PURE__ */ React.createElement(IcZap, null) },
  needs_review: { label: "\uC7AC\uC810\uAC80 \uD544\uC694", tone: "danger", desc: "\uB370\uC774\uD130\uAC00 \uD754\uB4E4\uB9AC\uACE0 \uC788\uC5B4\uC694", icon: /* @__PURE__ */ React.createElement(IcAlert, null) }
};
function StrategyStatusBadge({ status }) {
  const s = STRATEGY_STATUSES[status] || STRATEGY_STATUSES.exploring;
  return /* @__PURE__ */ React.createElement(Chip, { tone: s.tone, leading: React.cloneElement(s.icon, { size: 11 }) }, s.label);
}
function StrategyStatusCard({ status, evidenceCount, lastUpdated, onWhy }) {
  const s = STRATEGY_STATUSES[status] || STRATEGY_STATUSES.exploring;
  return /* @__PURE__ */ React.createElement(Card, { padding: 18 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: `var(--${s.tone === "neutral" ? "bg-muted" : s.tone + "-bg"})`,
    color: `var(--${s.tone === "neutral" ? "fg-muted" : s.tone})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  } }, React.cloneElement(s.icon, { size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.4 } }, "\uC804\uB7B5 \uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, s.label))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.6, marginBottom: 10 }, className: "kr-heading" }, s.desc), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uADFC\uAC70 \uB2E8\uC11C"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, evidenceCount, "\uAC1C")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", marginTop: 8, textAlign: "right" } }, "\uB9C8\uC9C0\uB9C9 \uC5C5\uB370\uC774\uD2B8 ", /* @__PURE__ */ React.createElement("span", { className: "num" }, lastUpdated), onWhy && /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 ", /* @__PURE__ */ React.createElement("button", { onClick: onWhy, style: { background: "transparent", border: "none", color: "var(--brand-600)", fontSize: 10, fontWeight: 600, cursor: "pointer" } }, "\uC65C \uC774 \uC0C1\uD0DC\uC778\uAC00\uC694?"))));
}
function SourceCard({ sources = [] }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 14, color: "var(--fg-muted)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, "\uB370\uC774\uD130 \uCD9C\uCC98")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, sources.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    padding: 10,
    background: "var(--bg-muted)",
    borderRadius: 8
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, s.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace" } }, s.url || s.org), s.updatedAt && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "num" }, "\uAC31\uC2E0 ", s.updatedAt))), s.notes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.4 }, className: "kr-heading" }, s.notes)), /* @__PURE__ */ React.createElement(Chip, { tone: s.confidence === "confirmed" ? "success" : s.confidence === "estimated" ? "warning" : "neutral", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10, flexShrink: 0 } }, s.confidence === "confirmed" ? "\uD655\uC815" : s.confidence === "estimated" ? "\uCD94\uC815" : "\uC900\uBE44 \uC911")))));
}
function DataUnavailableState({ what = "\uC774 \uD56D\uBAA9\uC758 \uB370\uC774\uD130", why = "\uBC31\uC5D4\uB4DC\uC5D0\uC11C \uC544\uC9C1 \uB370\uC774\uD130\uB97C \uAC00\uC838\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", retryLabel, onRetry }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "28px 20px",
    textAlign: "center",
    background: "var(--bg-muted)",
    borderRadius: 12,
    border: "1px dashed var(--line-strong)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--bg-surface)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 4 }, className: "kr-heading" }, "DATA_UNAVAILABLE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55, maxWidth: 280, margin: "0 auto" }, className: "kr-heading" }, what, "\uC744 \uD45C\uC2DC\uD560 \uC218 \uC5C6\uC5B4\uC694. ", why, ".", /* @__PURE__ */ React.createElement("br", null), "\uC798\uBABB\uB41C \uCD94\uC815\uCE58 \uB300\uC2E0 \uBE44\uC6CC\uB450\uB294 \uAC8C \uB354 \uC548\uC804\uD574\uC694."), onRetry && /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 12 }), onClick: onRetry, style: { marginTop: 12 } }, retryLabel || "\uB2E4\uC2DC \uC2DC\uB3C4"));
}
const EVENT_ICON = {
  signal: /* @__PURE__ */ React.createElement(IcSparkles, null),
  goal_change: /* @__PURE__ */ React.createElement(IcTarget, null),
  grade: /* @__PURE__ */ React.createElement(IcChart, null),
  counseling: /* @__PURE__ */ React.createElement(IcMessage, null),
  hypothesis: /* @__PURE__ */ React.createElement(IcCompass, null),
  signup: /* @__PURE__ */ React.createElement(IcStar, null)
};
function CareerTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uD0C0\uC784\uB77C\uC778", subtitle: "\uBAA9\uD45C \uBCC0\uACBD \xB7 \uB2E8\uC11C \uBC1C\uACAC \xB7 \uC131\uC801 \uBCC0\uD654\uAC00 \uC2DC\uAC04 \uC21C\uC73C\uB85C \uAE30\uB85D\uB3FC\uC694" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC544\uC9C1 \uAE30\uB85D\uB41C \uC9C4\uB85C \uD65C\uB3D9\uC774 \uC5C6\uC5B4\uC694."));
  }
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uD0C0\uC784\uB77C\uC778", subtitle: "\uBAA9\uD45C \uBCC0\uACBD \xB7 \uB2E8\uC11C \uBC1C\uACAC \xB7 \uC131\uC801 \uBCC0\uD654\uAC00 \uC2DC\uAC04 \uC21C\uC73C\uB85C \uAE30\uB85D\uB3FC\uC694" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, events.map((e, i, arr) => {
    const isLast = i === arr.length - 1;
    return /* @__PURE__ */ React.createElement("div", { key: e.id, style: { display: "flex", gap: 14, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 32, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: `var(--${e.tone === "neutral" ? "bg-muted" : e.tone + "-bg"})`,
      color: `var(--${e.tone === "neutral" ? "fg-muted" : e.tone === "brand" ? "brand-600" : e.tone})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
      flexShrink: 0
    } }, React.cloneElement(EVENT_ICON[e.type] || /* @__PURE__ */ React.createElement(IcDot, null), { size: 14 })), !isLast && /* @__PURE__ */ React.createElement("div", { style: { flex: 1, width: 2, background: "var(--line)", minHeight: 28 } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingBottom: isLast ? 0 : 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, e.when.slice(5))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.5 }, className: "kr-heading" }, e.body)));
  })));
}
function GoalHistory({ items = [] }) {
  if (!items || items.length === 0) {
    return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBAA9\uD45C \uBCC0\uACBD \uAE30\uB85D", subtitle: "\uD754\uB4E4\uB9AC\uB294 \uAC74 \uC790\uC5F0\uC2A4\uB7EC\uC6CC\uC694. \uC5B4\uB5BB\uAC8C\xB7\uC65C \uBC14\uB00C\uC5C8\uB294\uC9C0 \uBCF4\uC5EC\uB4DC\uB824\uC694", style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC544\uC9C1 \uBAA9\uD45C \uBCC0\uACBD \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694."));
  }
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBAA9\uD45C \uBCC0\uACBD \uAE30\uB85D", subtitle: "\uD754\uB4E4\uB9AC\uB294 \uAC74 \uC790\uC5F0\uC2A4\uB7EC\uC6CC\uC694. \uC5B4\uB5BB\uAC8C\xB7\uC65C \uBC14\uB00C\uC5C8\uB294\uC9C0 \uBCF4\uC5EC\uB4DC\uB824\uC694", style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, items.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.id, style: {
    padding: 14,
    borderRadius: 12,
    background: it.current ? "var(--brand-50)" : "var(--bg-muted)",
    border: it.current ? "1px solid var(--brand-200)" : "1px solid var(--line-subtle)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 } }, it.current && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, "\uD604\uC7AC \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, it.career)), it.univ !== "\uBBF8\uC815" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, it.univ, " ", it.dept)), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-subtle)" } }, it.since, "~")), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    color: "var(--fg-default)",
    lineHeight: 1.55,
    padding: "8px 10px",
    background: it.current ? "rgba(255,255,255,0.7)" : "var(--bg-surface)",
    borderRadius: 8,
    borderLeft: `2px solid var(--${it.current ? "brand-500" : "fg-subtle"})`
  }, className: "kr-heading" }, it.reason), it.changedTo && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", marginTop: 6 } }, "\u2192 \uC774\uD6C4 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-muted)" } }, it.changedTo), "(\uC73C)\uB85C \uC804\uD658")))));
}
const QUESTION_CARDS = [
  { id: "q1", text: "\uB0B4\uAC00 \uB204\uAD70\uAC00\uC5D0\uAC8C \uC790\uB791\uD558\uACE0 \uC2F6\uC740 \uC77C\uC740 \uC5B4\uB5A4 \uC885\uB958\uC778\uAC00\uC694?", category: "\uB3D9\uAE30", dueDays: 0, source: "AI \uC0C1\uB2F4 \uB2E8\uC11C \uAE30\uBC18" },
  { id: "q2", text: "\uC601\uC0C1 \uD3B8\uC9D1\uD560 \uB54C, \uC5B4\uB5A4 \uC21C\uAC04\uC774 \uAC00\uC7A5 \uD798\uB4E4\uC5C8\uC5B4\uC694?", category: "\uAC15\uC810\xB7\uC57D\uC810", dueDays: 1, source: "\uC57D\uC810 \uB2E8\uC11C \uBD80\uC871" },
  { id: "q3", text: '\uC8FC\uC704\uC5D0\uC11C \uBCF8 \uC9C1\uC5C5 \uC911, "\uC800\uAC70 \uBA4B\uC788\uB2E4" \uC2F6\uC5C8\uB358 \uAC8C \uC788\uB098\uC694?', category: "\uB864\uBAA8\uB378", dueDays: 2, source: "\uAD00\uCC30 \uB2E8\uC11C \uBD80\uC871" }
];
function QuestionCard({ q, compact, onAnswer, forTeacher }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: compact ? 14 : 18, style: { background: "linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)", border: "1px solid rgba(123,97,255,0.15)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10, justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uC624\uB298\uC758 \uC9C4\uB85C \uC9C8\uBB38"), /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, q.category)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, q.dueDays === 0 ? "\uC624\uB298" : `${q.dueDays}\uC77C\uC9F8`)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: compact ? 14 : 16, fontWeight: 700, color: "var(--fg-strong)", lineHeight: 1.45, marginBottom: 8 }, className: "kr-heading" }, '"', q.text, '"'), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 10, style: { display: "inline", verticalAlign: -1, marginRight: 4 } }), "\uC120\uC815 \uC774\uC720: ", q.source), forTeacher ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--accent-purple)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 12 }), " AI\uAC00 \uD559\uC0DD\uC5D0\uAC8C \uBB3C\uC5B4\uBCFC \uC608\uC815\uC778 \uC9C8\uBB38") : /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 14 }), onClick: onAnswer }, "AI \uC0C1\uB2F4\uC73C\uB85C \uB2F5\uD558\uAE30"));
}
function StudentAICounselingView({ studentName = "\uD559\uC0DD", embedded = false }) {
  const [transcript, setTranscript] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" });
        const sid = active && (active.data ? active.data.id : active.id);
        if (!sid) {
          if (alive) setTranscript([]);
          return;
        }
        const tr = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/transcript", { method: "GET" });
        const rows = tr && (tr.data || tr) || [];
        if (alive) setTranscript(Array.isArray(rows) ? rows : []);
      } catch (e) {
        if (alive) setTranscript([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--warning-bg)", borderRadius: 10, fontSize: 12, color: "var(--warning)", display: "flex", gap: 8, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcShield, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uD559\uC0DD \uB3D9\uC758 \uBC94\uC704 \uB0B4 \uC5F4\uB78C \xB7 \uC0C1\uB2F4 \uC900\uBE44\uC6A9\uC774\uC5D0\uC694. \uBAA8\uB4E0 \uC5F4\uB78C\uC740 \uAE30\uB85D\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC0C1\uB2F4 \uB300\uD654 (\uC5F4\uB78C \uC804\uC6A9)" }, transcript === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 60 }) : transcript.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC0C1\uB2F4 \uB0B4\uC5ED\uC774 \uC5C6\uC5B4\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, transcript.map((m, i) => {
    const isUser = m.role === "user";
    return /* @__PURE__ */ React.createElement("div", { key: m.id || i, style: { display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 6, alignItems: "flex-end" } }, !isUser && /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg, #7B61FF, #3182F6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: "78%",
      padding: "9px 13px",
      fontSize: 13,
      lineHeight: 1.5,
      background: isUser ? "var(--brand-500)" : "var(--bg-muted)",
      color: isUser ? "#fff" : "var(--fg-strong)",
      borderRadius: isUser ? "14px 14px 4px 14px" : "4px 14px 14px 14px"
    }, className: "kr-heading" }, m.text || m.content), isUser && /* @__PURE__ */ React.createElement(Avatar, { name: (studentName || "\uD559")[0], size: 24 }));
  }))));
}
function QuestionCardsList({ items = QUESTION_CARDS, onAnswer }) {
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uC9C8\uBB38 \uCE74\uB4DC", subtitle: "\uB300\uD654 \uB2E8\uC11C\uB97C \uCC44\uC6B0\uAE30 \uC704\uD55C \uB2E4\uC74C \uC9C8\uBB38\uB4E4\uC774\uC5D0\uC694" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, items.map((q) => /* @__PURE__ */ React.createElement(QuestionCard, { key: q.id, q, compact: true, onAnswer }))));
}
function UpcomingDatesCard({ go }) {
  const [dates, setDates] = React.useState(null);
  const catTone = (c) => ({ exam: "danger", counseling: "brand", experience: "purple", volunteer: "mint", study: "brand", admission: "warning" })[c] || "brand";
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const now = /* @__PURE__ */ new Date();
        const to = new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59);
        const r = await window.__apiFetch("/calendar/events?from=" + now.toISOString() + "&to=" + to.toISOString(), { method: "GET" });
        const rows = r && (r.data || r) || [];
        const mapped = (Array.isArray(rows) ? rows : []).filter((e) => e.startsAt && new Date(e.startsAt) >= new Date(now.toISOString().slice(0, 10))).map((e) => {
          const d = new Date(e.startsAt);
          const date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
          const time = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
          return { date, title: e.title, tone: catTone(e.category), sub: e.location ? e.location + " \xB7 " + time : time };
        }).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
        if (alive) setDates(mapped);
      } catch (e) {
        if (alive) setDates([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const toneVar = (t, kind) => `var(--${t === "warning" ? kind === "bg" ? "warning-bg" : "warning" : t === "purple" ? kind === "bg" ? "accent-purple-bg" : "accent-purple" : t === "mint" ? kind === "bg" ? "accent-mint-bg" : "accent-mint" : t === "danger" ? kind === "bg" ? "danger-bg" : "danger" : kind === "bg" ? "brand-50" : "brand-600"})`;
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uB2E4\uAC00\uC624\uB294 \uC9C4\uB85C \uC77C\uC815",
      subtitle: "\uC2DC\uD5D8\xB7\uC0C1\uB2F4\xB7\uC785\uC2DC \uC77C\uC815\uC744 \uD55C\uB208\uC5D0",
      action: go && /* @__PURE__ */ React.createElement("button", { onClick: () => go("calendar"), style: { border: "none", background: "transparent", color: "var(--brand-600)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 } }, "\uCE98\uB9B0\uB354", /* @__PURE__ */ React.createElement(IcChevronRight, { size: 13 }))
    },
    dates === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 48 }) : dates.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC608\uC815\uB41C \uC9C4\uB85C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, dates.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: () => go && go("calendar"), style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 12,
      background: toneVar(d.tone, "bg"),
      cursor: go ? "pointer" : "default"
    } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", minWidth: 44, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: toneVar(d.tone, "fg"), lineHeight: 1 } }, d.date.slice(8, 10)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 2 } }, d.date.slice(5, 7), "\uC6D4")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, alignSelf: "stretch", background: "rgba(0,0,0,0.06)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", display: "flex", alignItems: "center", gap: 6 }, className: "kr-heading" }, d.title, d.fromTeacher && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { height: 16, padding: "0 5px", fontSize: 9 } }, "\uC120\uC0DD\uB2D8")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 1 }, className: "kr-heading" }, d.sub)), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" }))))
  );
}
function WeeklyActionsCard({ onToggle, go }) {
  const items = useStudyTasks();
  const done = items.filter((it) => it.done).length;
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uC774\uBC88 \uC8FC \uC9C4\uB85C\xB7\uD559\uC2B5 \uC561\uC158",
      subtitle: "AI\uAC00 \uCD94\uCC9C\uD55C \uC774\uBC88 \uC8FC \uD575\uC2EC \uD589\uB3D9",
      action: /* @__PURE__ */ React.createElement(Chip, { tone: items.length && done >= items.length * 0.7 ? "success" : "info", size: "sm" }, done, "/", items.length)
    },
    items.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC774\uBC88 \uC8FC \uC561\uC158\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uD559\uC2B5 \uACC4\uD68D\uC5D0\uC11C \uD560 \uC77C\uC744 \uCD94\uAC00\uD574\uBCF4\uC138\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, items.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.id, onClick: () => !it.done && go && it.target && go(it.target), style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "10px 12px",
      borderRadius: 10,
      background: it.done ? "var(--bg-muted)" : "var(--bg-surface)",
      border: "1px solid var(--line-subtle)",
      cursor: !it.done && go && it.target ? "pointer" : "default"
    } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setTaskDone(it.id, !it.done);
      onToggle && onToggle(it.id);
    }, "aria-label": "\uC644\uB8CC \uD1A0\uAE00", style: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      border: it.done ? "none" : "2px solid var(--line-strong)",
      background: it.done ? "var(--success)" : "transparent",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    } }, it.done && /* @__PURE__ */ React.createElement(IcCheck, { size: 12 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 13,
      fontWeight: 600,
      color: it.done ? "var(--fg-muted)" : "var(--fg-strong)",
      textDecoration: it.done ? "line-through" : "none"
    }, className: "kr-heading" }, it.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", marginTop: 1 } }, it.source)), !it.done && go && it.target && /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      go(it.target);
    }, "aria-label": it.cta, style: {
      display: "flex",
      alignItems: "center",
      gap: 3,
      flexShrink: 0,
      padding: "5px 9px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      background: it.focus ? "var(--brand-50)" : "var(--neutral-bg)",
      color: it.focus ? "var(--brand-600)" : "var(--fg-default)",
      fontSize: 11,
      fontWeight: 700
    } }, it.focus && /* @__PURE__ */ React.createElement(IcZap, { size: 12 }), it.cta, /* @__PURE__ */ React.createElement(IcChevronRight, { size: 11 })), it.done && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { height: 16, padding: "0 5px", fontSize: 9, flexShrink: 0 } }, "\uC644\uB8CC"))))
  );
}
function CounselingRequestDraft({ onUse }) {
  const [generating, setGenerating] = React.useState(false);
  const [draft, setDraft] = React.useState(null);
  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraft({
        title: "\uC9C4\uB85C \uBC29\uD5A5 \uC810\uAC80 + 5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uACB0\uACFC \uD568\uAED8 \uBCF4\uACE0 \uC2F6\uC5B4\uC694",
        body: "\uC548\uB155\uD558\uC138\uC694 \uC120\uC0DD\uB2D8,\n\n\uCD5C\uADFC AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74\uC11C \uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108\uB85C \uBAA9\uD45C\uB97C \uC815\uD588\uB294\uB370, 5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uACB0\uACFC(\uD3C9\uADE0 84.8\uC810)\uC640 \uBE44\uAD50\uD588\uC744 \uB54C \uD64D\uC775\uB300 DCD \uC9C4\uD559\uC5D0 \uB0B4\uC2E0 0.5\uB4F1\uAE09 \uBD80\uC871\uC774 \uBCF4\uC600\uC5B4\uC694.\n\n\uC120\uC0DD\uB2D8\uACFC \uD568\uAED8 \uC810\uAC80\uD558\uACE0 \uC2F6\uC740 \uAC83:\n1. \uD604\uC7AC \uB0B4\uC2E0 \uD750\uB984\uC774 3-1\uAE4C\uC9C0 0.5\uB4F1\uAE09 \uB04C\uC5B4\uC62C\uB9AC\uAE30 \uD604\uC2E4\uC801\uC778\uC9C0\n2. \uC218\uD559 II \uBBF8\uC801\uBD84 \uBCF4\uAC15\uC774 \uC6B0\uC120\uC778\uC9C0, \uB2E4\uB978 \uACFC\uBAA9\uC778\uC9C0\n3. \uC2E4\uAE30 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uC900\uBE44\uB97C \uC5B8\uC81C\uBD80\uD130 \uC2DC\uC791\uD558\uB294 \uAC8C \uC88B\uC744\uC9C0\n\n\uC2DC\uAC04 \uB418\uC2E4 \uB54C \uC9E7\uAC8C \uC0C1\uB2F4 \uBD80\uD0C1\uB4DC\uB9BD\uB2C8\uB2E4.",
        evidence: [
          "AI \uC0C1\uB2F4 12\uD68C \uB204\uC801, \uC2DC\uAC01\uC801 \uD45C\uD604 \uB2E8\uC11C 6\uAC1C",
          "5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uD3C9\uADE0 84.8 (+2.4)",
          "\uD64D\uC775\uB300 DCD \uC785\uD559\uC790 \uD3C9\uADE0 \uB0B4\uC2E0 1.9 (\uD604\uC7AC 2.4)"
        ],
        confidence: "estimated"
      });
      setGenerating(false);
    }, 1200);
  };
  if (!draft && !generating) {
    return /* @__PURE__ */ React.createElement(Card, { padding: 18, style: { background: "linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)", border: "1px solid rgba(123,97,255,0.15)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }), style: { marginBottom: 10 } }, "AI \uCD08\uC548 \uB3C4\uC6C0"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, "\uBB34\uC2A8 \uB9D0\uBD80\uD130 \uC2DC\uC791\uD560\uC9C0 \uB9C9\uB9C9\uD558\uB2E4\uBA74?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginBottom: 12, lineHeight: 1.55 }, className: "kr-heading" }, "\uCD5C\uADFC \uC0C1\uB2F4\xB7\uC131\uC801\xB7\uAD00\uC2EC \uD559\uACFC \uB370\uC774\uD130\uB97C \uC885\uD569\uD574 \uC0C1\uB2F4 \uC694\uCCAD \uCD08\uC548\uC744 \uB9CC\uB4E4\uC5B4\uB4DC\uB824\uC694. \uADF8\uB300\uB85C \uBCF4\uB0B4\uB3C4 \uC88B\uACE0, \uC218\uC815\uD574\uC11C \uBCF4\uB0B4\uB3C4 \uC88B\uC544\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 14 }), onClick: generate }, "\uCD08\uC548 \uB9CC\uB4E4\uAE30"));
  }
  if (generating) {
    return /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", border: "2.5px solid var(--brand-500)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, "\uCD08\uC548\uC744 \uB9CC\uB4E4\uACE0 \uC788\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uB300\uD654\xB7\uC131\uC801\xB7\uBAA9\uD45C \uD559\uACFC \uB370\uC774\uD130 \uC885\uD569 \uC911...")));
  }
  return /* @__PURE__ */ React.createElement(Card, { padding: 18, style: { marginBottom: 12, border: "1px solid var(--brand-200)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "AI \uCD08\uC548"), /* @__PURE__ */ React.createElement("button", { onClick: generate, style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcRefresh, { size: 11 }), "\uB2E4\uC2DC \uC0DD\uC131")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 8 }, className: "kr-heading" }, draft.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-default)", lineHeight: 1.65, whiteSpace: "pre-line", padding: 12, background: "var(--bg-muted)", borderRadius: 10, marginBottom: 10 }, className: "kr-heading" }, draft.body), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 } }, "\uCC38\uACE0 \uADFC\uAC70"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.6 }, className: "kr-heading" }, draft.evidence.map((e, i) => /* @__PURE__ */ React.createElement("li", { key: i }, e))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: generate }, "\uB2E4\uC2DC"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: () => onUse && onUse(draft) }, "\uC774\uB300\uB85C \uC0AC\uC6A9")));
}
function RiskSignalsCard({ items, onOpenStudent }) {
  const [rows, setRows] = React.useState(items || null);
  React.useEffect(() => {
    if (items) {
      setRows(items);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/students", { method: "GET" });
        const list2 = r && (r.data || r) || [];
        const mapped = (Array.isArray(list2) ? list2 : []).filter((s) => s.needsCounseling).map((s) => ({
          id: s.id,
          studentName: s.name,
          studentAvatar: (s.name || "?").slice(0, 1),
          severity: "mid",
          signal: "needs_counseling",
          title: "\uC0C1\uB2F4\uC774 \uD544\uC694\uD574\uC694",
          detail: "",
          evidence: [],
          suggested: "\uC9C4\uB85C\xB7\uD559\uC2B5 \uC810\uAC80 \uC0C1\uB2F4"
        }));
        if (alive) setRows(mapped);
      } catch (e) {
        if (alive) setRows([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [items]);
  const list = rows || [];
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uC8FC\uC758 \uC2E0\uD638",
      subtitle: "\uD559\uC5C5\xB7\uC0C1\uB2F4 \uAD00\uC810\uC5D0\uC11C \uC0B4\uD3B4\uBCFC \uD559\uC0DD\uB4E4 (\uC815\uC2E0\uAC74\uAC15 \uC9C4\uB2E8 \uC544\uB2D8)",
      action: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, list.length, "\uAC74")
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, rows === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 48 }) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC9C0\uAE08\uC740 \uC8FC\uC758\uAC00 \uD544\uC694\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694.") : list.map((r) => /* @__PURE__ */ React.createElement(RiskSignalRow, { key: r.id, signal: r, onOpen: () => onOpenStudent && onOpenStudent(r.studentName) })), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--info-bg)", borderRadius: 8, fontSize: 11, color: "var(--brand-600)", lineHeight: 1.5, marginTop: 4 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcShield, { size: 12, style: { display: "inline", verticalAlign: -2, marginRight: 4 } }), "\uC8FC\uC758 \uC2E0\uD638\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\uD559\uC5C5\xB7\uC0C1\uB2F4 \uAD00\uC810"), "\uC758 \uCC38\uACE0 \uC815\uBCF4\uC608\uC694. \uC815\uC2E0\uAC74\uAC15 \uAD00\uB828 \uC6B0\uB824\uB294 \uC804\uBB38 \uC0C1\uB2F4\uC0AC\xB7\uBCF4\uAC74\uAD50\uC0AC\uC5D0\uAC8C \uC5F0\uACB0\uD574\uC8FC\uC138\uC694."))
  );
}
function RiskSignalRow({ signal: r, onOpen }) {
  const sev = { high: "danger", mid: "warning", low: "neutral" }[r.severity];
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--line-subtle)", borderRadius: 12, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((o) => !o), style: {
    width: "100%",
    padding: "14px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "var(--bg-surface)",
    border: "none",
    cursor: "pointer",
    textAlign: "left"
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(Avatar, { name: r.studentAvatar, size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: `var(--${sev === "neutral" ? "fg-subtle" : sev})`, border: "2px solid var(--bg-surface)" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, r.studentName), /* @__PURE__ */ React.createElement(Chip, { tone: sev, size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, r.severity === "high" ? "\uC8FC\uC758 \uB192\uC74C" : r.severity === "mid" ? "\uC8FC\uC758 \uBCF4\uD1B5" : "\uAD00\uCC30 \uAD8C\uC7A5")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-default)" }, className: "kr-heading" }, r.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, r.detail)), /* @__PURE__ */ React.createElement(IcChevronDown, { size: 16, color: "var(--fg-subtle)", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 220ms", flexShrink: 0 } })), open && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 16px", background: "var(--bg-muted)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 } }, "\uAD00\uCC30\uB41C \uADFC\uAC70"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--fg-default)", lineHeight: 1.6, marginBottom: 12 }, className: "kr-heading" }, r.evidence.map((e, i) => /* @__PURE__ */ React.createElement("li", { key: i }, e))), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--bg-surface)", borderRadius: 8, fontSize: 12, color: "var(--fg-default)", marginBottom: 10 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--brand-600)" } }, "\uC81C\uC548:"), " ", r.suggested), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 12 }), onClick: onOpen }, "\uD559\uC0DD \uD398\uC774\uC9C0\uB85C"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", full: true, leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 12 }) }, "\uC0C1\uB2F4 \uC7A1\uAE30"))));
}
function CounselingBrief30s({ studentName = "\uAE40\uC9C0\uD6C8" }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 16, background: "linear-gradient(135deg, #FFFBE6 0%, #FFFFFF 100%)", border: "1px solid #FBE0A2" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", leading: /* @__PURE__ */ React.createElement(IcZap, { size: 11 }) }, "30\uCD08 \uBE0C\uB9AC\uD504"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC0C1\uB2F4 \uC9C1\uC804\uC5D0 \uBE60\uB974\uAC8C \uD655\uC778")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(BriefStat, { label: "\uC804\uB7B5 \uC0C1\uD0DC", value: /* @__PURE__ */ React.createElement(StrategyStatusBadge, { status: "forming" }) }), /* @__PURE__ */ React.createElement(BriefStat, { label: "\uCD5C\uADFC \uC131\uC801", value: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 16, fontWeight: 800 } }, "84.8"), " ", /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { height: 16, padding: "0 5px", fontSize: 9 } }, "+2.4")) }), /* @__PURE__ */ React.createElement(BriefStat, { label: "\uC774\uBC88 \uC8FC \uD559\uC2B5", value: /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 16, fontWeight: 800 } }, "5", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)", fontWeight: 500 } }, "/8")) })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, "\uC694\uC57D"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.6, padding: 12, background: "var(--bg-surface)", borderRadius: 10 }, className: "kr-heading" }, "AI \uC0C1\uB2F4 12\uD68C \uAE30\uBC18, \uC601\uC0C1 \uD3B8\uC9D1\xB7\uC2DC\uAC01\uC801 \uD45C\uD604 \uB2E8\uC11C\uAC00 \uBC18\uBCF5 \uAD00\uCC30\uB3FC\uC694. \uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108\uB85C \uBAA9\uD45C\uB97C \uBA85\uD655\uD788 \uD588\uC9C0\uB9CC ", /* @__PURE__ */ React.createElement("strong", null, "\uB0B4\uC2E0 0.5\uB4F1\uAE09 \uACA9\uCC28"), "\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694. \uC218\uD559 II \uBBF8\uC801\uBD84 \uD559\uC2B5 \uC9C4\uB3C4\uAC00 \uD754\uB4E4\uB9AC\uB294 \uAC8C \uD655\uC778\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)", margin: "14px 0 6px" } }, "\uC774\uBC88 \uC0C1\uB2F4\uC5D0\uC11C \uB2E4\uB8E8\uBA74 \uC88B\uC744 \uAC83"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--fg-default)", lineHeight: 1.7 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("li", null, "3-1\uAE4C\uC9C0 \uB0B4\uC2E0 0.5\uB4F1\uAE09 \uD68C\uBCF5 \uC2DC\uBBAC\uB808\uC774\uC158"), /* @__PURE__ */ React.createElement("li", null, "\uC218\uD559 \uD559\uC2B5\uBC95 \uC810\uAC80 (\uAC1C\uB150 vs \uBB38\uC81C\uD480\uC774 \uBE44\uC911)"), /* @__PURE__ */ React.createElement("li", null, "\uC2E4\uAE30 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uC2DC\uC791 \uC2DC\uC810")));
}
function BriefStat({ label, value }) {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--bg-surface)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, value));
}
const SUGGESTED_QUESTIONS = [
  { id: "sq1", text: "\uC601\uC0C1 \uC791\uC5C5\uC774 \uB05D\uB098\uACE0 \uC5B4\uB5A4 \uAE30\uBD84\uC774 \uB4E4\uC5C8\uC5B4?", goal: "\uB3D9\uAE30 \uAD6C\uC870 \uD655\uC778", tone: "purple" },
  { id: "sq2", text: "\uC218\uD559 \uB2E8\uC6D0 \uC911 \uC758\uC678\uB85C \uC7AC\uBC0C\uC5C8\uB358 \uAC8C \uC788\uC5C8\uC5B4?", goal: "\uC57D\uC810 \uC601\uC5ED\uC758 \uAE0D\uC815 \uB2E8\uC11C \uBC1C\uAD74", tone: "brand" },
  { id: "sq3", text: "3\uB144 \uB4A4 \uAC00\uC7A5 \uD070 \uB450\uB824\uC6C0\uC740 \uBB50\uC57C?", goal: "\uB0B4\uC801 \uB3D9\uAE30 \uC810\uAC80", tone: "warning" },
  { id: "sq4", text: "\uC8FC\uBCC0\uC5D0\uC11C \uB108\uB791 \uBE44\uC2B7\uD55C \uAE38 \uAC04 \uC0AC\uB78C \uC788\uC5B4?", goal: "\uB864\uBAA8\uB378 \uC720\uBB34", tone: "info" },
  { id: "sq5", text: "\uC2E4\uAE30 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uB9CC\uB4E4\uC5B4\uBCF8 \uC801 \uC788\uC5B4? \uC5B4\uB5BB\uAC8C \uC2DC\uC791\uD588\uC5B4?", goal: "\uC2E4\uD589 \uB2E8\uACC4 \uC810\uAC80", tone: "success" }
];
function SuggestedTeacherQuestions({ studentName = "\uAE40\uC9C0\uD6C8", items = SUGGESTED_QUESTIONS }) {
  return /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: `${studentName}\uB2D8 \uC0C1\uB2F4\uC5D0\uC11C \uB358\uC9C0\uBA74 \uC88B\uC744 \uC9C8\uBB38`,
      subtitle: "\uD559\uC0DD\uC758 AI \uC0C1\uB2F4 \uB2E8\uC11C\xB7\uC9C4\uB85C \uD750\uB984 \uAE30\uBC18"
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, items.map((q) => /* @__PURE__ */ React.createElement("div", { key: q.id, style: {
      padding: 14,
      borderRadius: 10,
      background: "var(--bg-muted)",
      borderLeft: `3px solid var(--${q.tone === "neutral" ? "fg-subtle" : q.tone})`
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-strong)", marginBottom: 4 }, className: "kr-heading" }, '"', q.text, '"'), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 10 }), "\uC774 \uC9C8\uBB38\uC758 \uBAA9\uC801: ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-default)", fontWeight: 600 } }, q.goal)))))
  );
}
Object.assign(window, {
  STRATEGY_STATUSES,
  StrategyStatusBadge,
  StrategyStatusCard,
  SourceCard,
  DataUnavailableState,
  CareerTimeline,
  GoalHistory,
  QUESTION_CARDS,
  QuestionCard,
  QuestionCardsList,
  WeeklyActionsCard,
  UpcomingDatesCard,
  CounselingRequestDraft,
  RiskSignalsCard,
  RiskSignalRow,
  CounselingBrief30s,
  BriefStat,
  StudentAICounselingView,
  SUGGESTED_QUESTIONS,
  SuggestedTeacherQuestions
});
