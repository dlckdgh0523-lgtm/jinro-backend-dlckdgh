function ReportViewer({ open, onClose, report = null, forTeacher = false }) {
  const trapRef = useFocusTrap(open, onClose);
  if (!open) return null;
  if (!report) {
    return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 70, display: "flex", alignItems: "stretch", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)", animation: "fadeIn 200ms" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8", style: {
      position: "relative",
      width: "min(640px, 100%)",
      background: "var(--bg-canvas)",
      boxShadow: "var(--shadow-pop)",
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 2, background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: onClose }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" } }, "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8")), /* @__PURE__ */ React.createElement("div", { style: { padding: 20 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCompass, { size: 22 }), title: "\uC544\uC9C1 \uC0DD\uC131\uB41C \uB9AC\uD3EC\uD2B8\uAC00 \uC5C6\uC5B4\uC694", body: "AI \uC0C1\uB2F4\uC744 \uCDA9\uBD84\uD788 \uC9C4\uD589\uD558\uBA74 \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694. \uC0C1\uB2F4\uC744 \uC774\uC5B4\uAC00 \uBCF4\uC138\uC694." }))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 70, display: "flex", alignItems: "stretch", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)", animation: "fadeIn 200ms" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8", style: {
    position: "relative",
    width: "min(640px, 100%)",
    background: "var(--bg-canvas)",
    boxShadow: "var(--shadow-pop)",
    overflow: "auto",
    animation: "slideRight 300ms var(--ease-toss)",
    display: "flex",
    flexDirection: "column"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("style", null, `@keyframes slideRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`), /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 2, background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: onClose }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" } }, "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, forTeacher ? report.student + " \xB7 " : "", report.generated, " \xB7 \uB300\uD654 ", report.turns, "\uD68C \uAE30\uBC18"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8", ["\uD56D\uBAA9", "\uB0B4\uC6A9"], [
    ["\uD559\uC0DD", report.student],
    ["\uC0DD\uC131\uC77C", report.generated],
    ["\uB300\uD654 \uD69F\uC218", report.turns + "\uD68C"],
    ["\uD575\uC2EC \uC694\uC57D", report.headline],
    ["\uC0C1\uC138", report.summary],
    ...report.careers.map((c, i) => [`\uCD94\uCC9C \uC9C1\uC5C5 ${i + 1}`, `${c.title} (${c.score}\uC810) \u2014 ${c.why}`]),
    ["\uCD94\uCC9C \uD559\uACFC", report.majors.join(" / ")],
    ["\uAC15\uC810", report.strengths.join(", ")],
    ["\uC720\uC758\uC810", report.risks.join(", ")],
    ["\uB2E4\uC74C \uD65C\uB3D9", report.nextActions.join(" / ")]
  ], { "\uD559\uC0DD": report.student || "" }) }, "PDF \uB2E4\uC6B4\uB85C\uB4DC"), !forTeacher && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", leading: /* @__PURE__ */ React.createElement(IcShield, { size: 14 }), onClick: () => showToast("\uC120\uC0DD\uB2D8\uAED8 \uACF5\uC720\uD588\uC5B4\uC694", "success") }, "\uACF5\uC720"))), /* @__PURE__ */ React.createElement("div", { style: { padding: 20, display: "flex", flexDirection: "column", gap: 12 } }, forTeacher && /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--warning-bg)", borderRadius: 10, fontSize: 12, color: "var(--warning)", display: "flex", gap: 8, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcShield, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uD559\uC0DD \uC0AC\uC804 \uB3D9\uC758 \uBC94\uC704 \uB0B4\uC5D0\uC11C \uC5F4\uB78C \uC911\uC774\uC5D0\uC694. \uBAA8\uB4E0 \uC5F4\uB78C\uC740 \uAE30\uB85D\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }), style: { marginBottom: 10 } }, "1\uCC28 \uB9AC\uD3EC\uD2B8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 21, fontWeight: 800, color: "var(--fg-strong)", lineHeight: 1.3 }, className: "kr-heading" }, report.headline), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", marginTop: 10, lineHeight: 1.6 }, className: "kr-heading" }, report.summary)), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD94\uCC9C \uC9C1\uC5C5" }, report.careers.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-subtle)", display: "flex", justifyContent: "space-between", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, c.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 }, className: "kr-heading" }, c.why)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", minWidth: 56 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--brand-600)" } }, c.score, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 500, color: "var(--fg-muted)" } }, "%")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, "\uC801\uD569\uB3C4"))))), Array.isArray(report.majors) && report.majors.length > 0 && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD94\uCC9C \uD559\uACFC", subtitle: "\uB300\uD559 \uAC80\uC0C9\uC5D0\uC11C \uD559\uACFC\uB97C \uCC3E\uC544 \uC785\uC2DC \uD76C\uB9DD \u2605\uB85C \uBAA8\uC744 \uC218 \uC788\uC5B4\uC694" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, report.majors.map((m, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: () => {
        try {
          window.__admissionsQuery = m;
          if (typeof window.__navTo === "function") window.__navTo("admissions-hub");
          else if (window.location) window.location.hash = "admissions-hub";
        } catch (e) {
        }
      },
      style: { padding: "8px 12px", borderRadius: 999, border: "1px solid var(--brand-200, var(--line))", background: "var(--brand-50)", color: "var(--brand-700)", fontSize: 13, fontWeight: 600, cursor: "pointer" },
      className: "kr-heading"
    },
    m
  ))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.5 }, className: "kr-heading" }, "\uCE69\uC744 \uB204\uB974\uBA74 \uB300\uD559 \uAC80\uC0C9\uC73C\uB85C \uC774\uB3D9\uD574 \uADF8 \uD559\uACFC\uB97C \uAC1C\uC124\uD55C \uB300\uD559\uC744 \uCC3E\uC744 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB300\uD654\uC5D0\uC11C \uBCF4\uC778 \uB2E8\uC11C" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, report.signals.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: s.tone, size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1 }, className: "kr-heading" }, s.text))))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uAC15\uC810", padding: 18 }, /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 } }, report.strengths.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.5 }, className: "kr-heading" }, s)))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC720\uC758\uD560 \uC810", padding: 18 }, /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 } }, report.risks.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.5 }, className: "kr-heading" }, s))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD94\uCC9C \uD559\uACFC \xB7 \uB300\uD559" }, report.majors.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-subtle)", fontSize: 14, color: "var(--fg-strong)" }, className: "kr-heading" }, m))), /* @__PURE__ */ React.createElement(SectionCard, { title: forTeacher ? "\uC0C1\uB2F4 \uC2DC \uAD8C\uC7A5 \uC561\uC158" : "\uB2E4\uC74C\uC5D0 \uD574\uBCF4\uBA74 \uC88B\uC740 \uC77C" }, /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 } }, report.nextActions.map((t, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: "50%", background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 } }, i + 1), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--fg-default)", lineHeight: 1.5 }, className: "kr-heading" }, t))))), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 12, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC774 \uACB0\uACFC\uB294 \uB300\uD654\uB97C \uBC14\uD0D5\uC73C\uB85C \uD55C \uC9C4\uB85C \uD0D0\uC0C9 \uCC38\uACE0\uC790\uB8CC\uC608\uC694. \uCD5C\uC885 \uC120\uD0DD\uC740 \uD559\uC0DD\xB7\uBCF4\uD638\uC790\xB7\uAD50\uC0AC \uC0C1\uB2F4\uACFC \uD568\uAED8 \uACB0\uC815\uD558\uB294 \uAC8C \uC88B\uC544\uC694."))));
}
const STUDY_CHEERS = [
  "\uC624\uB298 \uD55C \uAC78\uC74C\uC774 \uB0B4\uC77C\uC758 \uC810\uC218\uC608\uC694 \u{1F4AA}",
  "\uC9D1\uC911\uD55C 25\uBD84\uC774 \uD758\uB824\uBCF4\uB0B8 2\uC2DC\uAC04\uBCF4\uB2E4 \uAC15\uD574\uC694",
  "\uC5B4\uC81C\uC758 \uB098\uBCF4\uB2E4 1\uBB38\uC81C\uB9CC \uB354 \uD480\uC5B4\uBD10\uC694",
  "\uAFB8\uC900\uD568\uC774 \uACB0\uAD6D \uC7AC\uB2A5\uC744 \uC774\uACA8\uC694",
  "\uC9C0\uAE08 \uC774 \uC21C\uAC04\uB3C4 \uC131\uC7A5 \uC911\uC774\uC5D0\uC694",
  "\uC791\uC740 \uC644\uB8CC\uAC00 \uBAA8\uC5EC \uD070 \uBCC0\uD654\uB97C \uB9CC\uB4E4\uC5B4\uC694",
  "\uC624\uB298 \uBABB\uD55C \uAC74 \uAD1C\uCC2E\uC544\uC694. \uB0B4\uC77C \uB610 \uD558\uBA74 \uB3FC\uC694",
  "\uBAA9\uD45C\uAE4C\uC9C0 \uD55C \uCE78\uC529, \uC798 \uAC00\uACE0 \uC788\uC5B4\uC694"
];
function EncouragementBanner({ compact = false }) {
  const [idx, setIdx] = React.useState(() => Math.floor(Math.random() * STUDY_CHEERS.length));
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % STUDY_CHEERS.length);
        setFade(true);
      }, 280);
    }, 4200);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: compact ? "8px 12px" : "10px 14px",
    background: "linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)",
    borderRadius: 10,
    marginBottom: 12
  } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: compact ? 13 : 15, color: "var(--accent-purple)", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: compact ? 12 : 13,
    fontWeight: 600,
    color: "var(--brand-700)",
    opacity: fade ? 1 : 0,
    transition: "opacity 280ms var(--ease-std)"
  }, className: "kr-heading" }, STUDY_CHEERS[idx]));
}
const GRADE_SUBJECTS = ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559"];
const gradeAvg = (r) => Math.round(GRADE_SUBJECTS.reduce((s, k) => s + (r[k] || 0), 0) / GRADE_SUBJECTS.length * 10) / 10;
function GradeYearTabs({ value, onChange }) {
  return /* @__PURE__ */ React.createElement(
    Tabs,
    {
      items: [
        { id: "all", label: "\uC804 \uD559\uB144" },
        { id: "1", label: "1\uD559\uB144" },
        { id: "2", label: "2\uD559\uB144" },
        { id: "3", label: "3\uD559\uB144" }
      ],
      activeId: value,
      onChange
    }
  );
}
function YearLineChart({ points, height = 150 }) {
  const w = 600, pad = 28;
  const vals = points.map((p) => p.value);
  const max = Math.max(...vals) + 4, min = Math.min(...vals) - 6;
  const xs = points.map((_, i) => pad + i * (w - pad * 2) / Math.max(1, points.length - 1));
  const ys = points.map((p) => height - 24 - (p.value - min) / (max - min) * (height - 50));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${height}`, style: { width: "100%", height } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "yg", x1: "0", x2: "0", y1: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#3182F6", stopOpacity: "0.18" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#3182F6", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement("path", { d: `${line} L${xs[xs.length - 1]},${height - 24} L${xs[0]},${height - 24} Z`, fill: "url(#yg)" }), /* @__PURE__ */ React.createElement("path", { d: line, fill: "none", stroke: "#3182F6", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }), xs.map((x, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: ys[i], r: "4", fill: "#fff", stroke: "#3182F6", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x, y: ys[i] - 11, textAnchor: "middle", fontSize: "12", fontWeight: "700", fill: "#3182F6" }, points[i].value), /* @__PURE__ */ React.createElement("text", { x, y: height - 6, textAnchor: "middle", fontSize: "11", fill: "#8B95A1" }, points[i].label)))));
}
function GradeHistoryView({ year, onYearChange, editable = false, onAddGrade }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uC131\uC801",
      action: editable ? /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: onAddGrade }, "\uC131\uC801 \uC785\uB825") : null
    },
    /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC544\uC9C1 \uC785\uB825\uB41C \uC131\uC801\uC774 \uC5C6\uC5B4\uC694.")
  ));
}
Object.assign(window, {
  ReportViewer,
  EncouragementBanner,
  STUDY_CHEERS,
  GRADE_SUBJECTS,
  gradeAvg,
  GradeYearTabs,
  GradeHistoryView,
  YearLineChart,
  NotificationsScreen,
  WebNotifPopover,
  NotifBell
});
function WebNotifPopover({ open, onClose, role = "student" }) {
  const [items, setItems] = React.useState(null);
  React.useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        if (alive) setItems((Array.isArray(r.data) ? r.data : []).map(mapNotif));
      } catch (e) {
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open]);
  if (!open) return null;
  const loading = items === null;
  const list = items || [];
  const unread = list.filter((i) => i.unread).length;
  const markAll = async () => {
    try {
      await window.__apiFetch("/notifications/read-all", { method: "POST" });
    } catch (e) {
    }
    setItems((its) => (its || []).map((i) => ({ ...i, unread: false })));
  };
  const openOne = async (id) => {
    try {
      await window.__apiFetch("/notifications/" + id + "/read", { method: "PATCH" });
    } catch (e) {
    }
    setItems((its) => (its || []).map((i) => i.id === id ? { ...i, unread: false } : i));
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, zIndex: 40 } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 41,
    width: 380,
    maxHeight: "70%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 16,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 220ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, background: "var(--bg-elevated)", padding: "14px 18px", borderBottom: "1px solid var(--line-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC54C\uB9BC"), /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, unread)), unread > 0 && /* @__PURE__ */ React.createElement("button", { onClick: markAll, style: { background: "transparent", border: "none", color: "var(--brand-600)", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uBAA8\uB450 \uC77D\uC74C")), loading && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 18px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\u2026"), !loading && list.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "28px 18px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uC544\uC9C1 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694"), list.map((n, i) => /* @__PURE__ */ React.createElement("div", { key: n.id, onClick: () => openOne(n.id), style: {
    display: "flex",
    gap: 10,
    padding: "13px 18px",
    cursor: "pointer",
    borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none",
    background: n.unread ? "rgba(49,130,246,0.025)" : "transparent"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 9, background: notifToneBg(n.tone), color: notifToneFg(n.tone), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, React.cloneElement(n.icon, { size: 16 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, n.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)", flexShrink: 0 } }, n.time)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.4 }, className: "kr-heading" }, n.body)), n.unread && /* @__PURE__ */ React.createElement("div", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--brand-500)", marginTop: 6, flexShrink: 0 } })))));
}
function NotifBell({ role = "student", badge }) {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(badge != null ? badge : 0);
  React.useEffect(() => {
    if (badge != null) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        const list = Array.isArray(r.data) ? r.data : [];
        if (alive) setCount(list.filter((n) => !n.read).length);
      } catch (e) {
      }
    })();
    return () => {
      alive = false;
    };
  }, [badge]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 20 }), badge: count, ariaLabel: "\uC54C\uB9BC", onClick: () => setOpen((o) => !o) }), /* @__PURE__ */ React.createElement(WebNotifPopover, { open, onClose: () => setOpen(false), role }));
}
const notifToneBg = (t) => `var(--${t === "brand" ? "brand-50" : t === "purple" ? "accent-purple-bg" : t === "success" ? "success-bg" : t === "warning" ? "warning-bg" : t === "info" ? "info-bg" : "neutral-bg"})`;
const notifToneFg = (t) => `var(--${t === "brand" ? "brand-500" : t === "purple" ? "accent-purple" : t === "success" ? "success" : t === "warning" ? "warning" : t === "info" ? "info" : "neutral-fg"})`;
const notifTimeAgo = (iso) => {
  if (!iso) return "\uBC29\uAE08";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return typeof iso === "string" ? iso : "\uBC29\uAE08";
  const diff = Date.now() - d.getTime();
  if (diff < 6e4) return "\uBC29\uAE08";
  const min = Math.floor(diff / 6e4);
  if (min < 60) return `${min}\uBD84 \uC804`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}\uC2DC\uAC04 \uC804`;
  return `${Math.floor(hr / 24)}\uC77C \uC804`;
};
const notifTypeMap = (type) => {
  const t = String(type || "");
  if (t.includes("message") || t.includes("counsel") || t.includes("memo")) return { icon: /* @__PURE__ */ React.createElement(IcMessage, null), tone: "brand" };
  if (t.includes("report") || t.includes("ai")) return { icon: /* @__PURE__ */ React.createElement(IcSparkles, null), tone: "purple" };
  if (t.includes("grade") || t.includes("chart") || t.includes("score")) return { icon: /* @__PURE__ */ React.createElement(IcChart, null), tone: "info" };
  if (t.includes("join") || t.includes("accept") || t.includes("complete")) return { icon: /* @__PURE__ */ React.createElement(IcCheckCircle, null), tone: "success" };
  if (t.includes("bill") || t.includes("pay") || t.includes("trial")) return { icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), tone: "neutral" };
  return { icon: /* @__PURE__ */ React.createElement(IcBell, null), tone: "brand" };
};
const mapNotif = (n) => {
  const m = notifTypeMap(n.type);
  return {
    id: n.id,
    icon: m.icon,
    tone: m.tone,
    title: n.title || n.type || "\uC54C\uB9BC",
    body: n.body || "",
    time: notifTimeAgo(n.createdAt),
    unread: !n.read,
    targetUrl: n.targetUrl
  };
};
function NotificationsScreen({ role = "student", onBack, variant = "mobile" }) {
  const [items, setItems] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      let list2 = [];
      try {
        const r = await window.__apiFetch("/notifications", { method: "GET" });
        list2 = (Array.isArray(r.data) ? r.data : []).map(mapNotif);
      } catch (e) {
      }
      if (role === "student") {
        try {
          const bc = broadcastsForStudent("s1").map((b) => ({
            id: "bcn_" + b.id,
            icon: /* @__PURE__ */ React.createElement(IcCalendar, null),
            tone: "info",
            title: `[\uC120\uC0DD\uB2D8] ${b.title}`,
            body: b.body,
            time: b.createdAt ? notifTimeAgo(b.createdAt) : "\uBC29\uAE08",
            unread: true
          }));
          list2 = [...bc, ...list2];
        } catch (e) {
        }
      }
      if (alive) setItems(list2);
    })();
    return () => {
      alive = false;
    };
  }, [role]);
  const loading = items === null;
  const list = items || [];
  const unread = list.filter((i) => i.unread).length;
  const markAll = async () => {
    try {
      await window.__apiFetch("/notifications/read-all", { method: "POST" });
    } catch (e) {
    }
    setItems((its) => (its || []).map((i) => ({ ...i, unread: false })));
  };
  const open = async (id) => {
    if (typeof id === "string" && id.indexOf("bcn_") === 0) {
      setItems((its) => (its || []).map((i) => i.id === id ? { ...i, unread: false } : i));
      return;
    }
    try {
      await window.__apiFetch("/notifications/" + id + "/read", { method: "PATCH" });
    } catch (e) {
    }
    setItems((its) => (its || []).map((i) => i.id === id ? { ...i, unread: false } : i));
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, variant === "mobile" ? /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      title: "\uC54C\uB9BC",
      leading: onBack ? /* @__PURE__ */ React.createElement(BackButton, { onClick: onBack }) : null,
      trailing: unread > 0 ? /* @__PURE__ */ React.createElement("button", { onClick: markAll, style: { background: "transparent", border: "none", color: "var(--brand-600)", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "\uBAA8\uB450 \uC77D\uC74C") : null
    }
  ) : /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC54C\uB9BC"), unread > 0 && /* @__PURE__ */ React.createElement("button", { onClick: markAll, style: { background: "transparent", border: "none", color: "var(--brand-600)", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "\uBAA8\uB450 \uC77D\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { padding: variant === "web" ? "12px 24px 8px" : "0 16px 12px", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, unread, "\uAC1C \uC548 \uC77D\uC74C"), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--fg-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--success)" } }), "\uC2E4\uC2DC\uAC04 \uC5F0\uACB0\uB428 (SSE)")), /* @__PURE__ */ React.createElement("div", { style: { padding: variant === "web" ? "0 24px 24px" : "0 16px 24px" } }, loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 0", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\u2026") : list.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 20px", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uC544\uC9C1 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694")) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, list.map((n, i) => /* @__PURE__ */ React.createElement("div", { key: n.id, onClick: () => open(n.id), style: {
    display: "flex",
    gap: 12,
    padding: "14px 16px",
    cursor: "pointer",
    borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none",
    background: n.unread ? "rgba(49,130,246,0.025)" : "transparent"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 10, background: notifToneBg(n.tone), color: notifToneFg(n.tone), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, React.cloneElement(n.icon, { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, n.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, n.time)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45 }, className: "kr-heading" }, n.body)), n.unread && /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: "var(--brand-500)", marginTop: 12, flexShrink: 0 } }))))));
}
