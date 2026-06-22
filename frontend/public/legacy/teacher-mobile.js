const TEACHER_MOBILE_NAV_FULL = [
  { id: "dashboard", label: "\uD648", icon: /* @__PURE__ */ React.createElement(IcHome, null) },
  { id: "students", label: "\uD559\uC0DD", icon: /* @__PURE__ */ React.createElement(IcUsers, null) },
  { id: "completion", label: "\uD559\uC2B5", icon: /* @__PURE__ */ React.createElement(IcCheck, null) },
  { id: "messages", label: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null) },
  { id: "more", label: "\uB354\uBCF4\uAE30", icon: /* @__PURE__ */ React.createElement(IcMore, null) }
];
function TMHeader({ title, leading, trailing, subtitle, help }) {
  return /* @__PURE__ */ React.createElement(ScreenHeader, { title, subtitle, leading, trailing, help });
}
function TMClassroom({ go }) {
  var _a;
  const { rows, meta, loading } = useTeacherRoster();
  const count = (_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length;
  const classroomLabel = [meta == null ? void 0 : meta.school, meta == null ? void 0 : meta.classroom].filter(Boolean).join(" ") || "\uC6B0\uB9AC \uD559\uAE09";
  const recent = rows.filter((s) => s.lastActivityAt).sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)).slice(0, 5);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { help: "teacher-classroom", title: "\uC6B0\uB9AC \uD559\uAE09", subtitle: `${classroomLabel} \xB7 ${loading ? "\u2026" : count}/30\uBA85`, leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 24, style: { marginBottom: 12, background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff", marginBottom: 12 } }, "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 36, fontWeight: 800, letterSpacing: "5px" } }, "H8K4 9P"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginTop: 8 }, className: "kr-heading" }, "\uD559\uC0DD\uC774 \uD68C\uC6D0\uAC00\uC785 \uC2DC \uC774 \uCF54\uB4DC\uB97C \uC785\uB825\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uD559\uAE09\uC5D0 \uCC38\uC5EC\uB3FC\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcCopy, { size: 14 }), style: { flex: 1, background: "#fff", color: "var(--brand-600)" }, onClick: () => copyToast("H8K49P", "\uCD08\uB300\uCF54\uB4DC\uB97C \uBCF5\uC0AC\uD588\uC5B4\uC694") }, "\uCF54\uB4DC \uBCF5\uC0AC"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), style: { flex: 1, background: "rgba(255,255,255,0.18)", color: "#fff" } }, "\uC7AC\uBC1C\uAE09"))), /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginBottom: 10, fontWeight: 600 } }, "\uD559\uAE09 \uC815\uC6D0"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 140, height: 140, margin: "0 auto 12px" } }, /* @__PURE__ */ React.createElement("svg", { width: "140", height: "140", viewBox: "0 0 140 140" }, /* @__PURE__ */ React.createElement("circle", { cx: "70", cy: "70", r: "60", fill: "none", stroke: "#E5E8EB", strokeWidth: "10" }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "70",
      cy: "70",
      r: "60",
      fill: "none",
      stroke: "#3182F6",
      strokeWidth: "10",
      strokeDasharray: `${Math.min(count, 30) / 30 * 2 * Math.PI * 60} ${2 * Math.PI * 60}`,
      strokeLinecap: "round",
      transform: "rotate(-90 70 70)"
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 32, fontWeight: 800, color: "var(--fg-strong)" } }, loading ? "\u2013" : count), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "/30\uBA85"))), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--brand-50)", borderRadius: 10, fontSize: 11, color: "var(--brand-600)", textAlign: "center" }, className: "kr-heading" }, loading ? "\u2026" : `${Math.max(0, 30 - count)}\uC790\uB9AC \uB0A8\uC558\uC5B4\uC694.`, " \uBB34\uB8CC \uCCB4\uD5D8 \uC911\uC5D0\uB294 \uCD08\uB300\uCF54\uB4DC\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD5C\uADFC \uCC38\uC5EC", action: /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => go("students"), trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 }) }, "\uC804\uCCB4") }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 48, radius: 10 }))) : recent.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 22 }), title: "\uC544\uC9C1 \uCC38\uC5EC\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574 \uCCAB \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, recent.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, fmtActivity(s.lastActivityAt), " \uD65C\uB3D9")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" })))))));
}
function TMStudents({ go }) {
  var _a;
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const { rows, meta, loading, error, refetch } = useTeacherRoster();
  const classroomLabel = [meta == null ? void 0 : meta.school, meta == null ? void 0 : meta.classroom].filter(Boolean).join(" ") || "\uC6B0\uB9AC \uD559\uAE09";
  const needsCount = rows.filter((s) => s.needsCounseling).length;
  const aiCount = rows.filter((s) => (s.aiProgress || 0) > 0).length;
  const ungradedCount = rows.filter((s) => s.gradeAverage == null).length;
  const filtered = rows.filter((s) => {
    if (q && !(s.name || "").includes(q)) return false;
    if (filter === "all") return true;
    if (filter === "needs-counseling") return s.needsCounseling;
    if (filter === "ai") return (s.aiProgress || 0) > 0;
    if (filter === "ungraded") return s.gradeAverage == null;
    return true;
  });
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { help: "teacher-students", title: "\uD559\uC0DD \uAD00\uB9AC", subtitle: `${classroomLabel} ${loading ? "" : ((_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length) + "\uBA85"}`, leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD \uC774\uB984 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflow: "auto" }, className: "toss-scroll" }, [
    { id: "all", label: `\uC804\uCCB4 ${rows.length}` },
    { id: "needs-counseling", label: `\uC0C1\uB2F4 \uD544\uC694 ${needsCount}` },
    { id: "ai", label: `AI \uC9C4\uD589 ${aiCount}` },
    { id: "ungraded", label: `\uC131\uC801 \uBBF8\uC785\uB825 ${ungradedCount}` }
  ].map((t) => {
    const active = filter === t.id;
    return /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setFilter(t.id), style: {
      border: "none",
      padding: "6px 12px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      background: active ? "var(--brand-500)" : "var(--bg-surface)",
      color: active ? "#fff" : "var(--fg-default)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      flexShrink: 0,
      boxShadow: active ? "none" : "0 1px 2px rgba(0,0,0,0.04)"
    } }, t.label);
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 8 } }, loading ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 86, radius: 12 })) : error ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uD559\uC0DD \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: refetch }, "\uB2E4\uC2DC \uC2DC\uB3C4") })) : rows.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uAE09 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574 \uCCAB \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694." })) : filtered.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSearch, { size: 24 }), title: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694", body: "\uB2E4\uB978 \uC774\uB984\uC774\uB098 \uD544\uD130\uB97C \uC2DC\uB3C4\uD574\uBCF4\uC138\uC694." })) : filtered.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.id, padding: 14, onClick: () => openStudentDetail(go, s.id), hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), s.needsCounseling && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, "\uC0C1\uB2F4 \uD544\uC694")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, s.gradeAverage == null ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)" } }, "\uC131\uC801 \uBBF8\uC785\uB825") : /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.gradeAverage), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\xB7 ", fmtActivity(s.lastActivityAt)))), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(ProgressBar, { value: s.studyDone || 0, max: Math.max(s.studyTotal || 0, 1), height: 4 }), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 10, color: "var(--fg-muted)", minWidth: 40, textAlign: "right", flexShrink: 0 } }, "\uD559\uC2B5 ", s.studyDone || 0, "/", s.studyTotal || 0), aiProgressBadge(s.aiProgress || 0))))));
}
function TMStudentDetail({ go }) {
  const [tab, setTab] = React.useState("overview");
  const [year, setYear] = React.useState("all");
  const [gradeOpen, setGradeOpen] = React.useState(false);
  const [memoOpen, setMemoOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
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
  const studentName = loading ? "\uD559\uC0DD" : student.name || "\uD559\uC0DD";
  const subtitle = [student.school, student.classroom].filter(Boolean).join(" ") || (loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : "");
  const grades = (detail == null ? void 0 : detail.grades) || [];
  const signals = (detail == null ? void 0 : detail.signals) || [];
  const targets = (detail == null ? void 0 : detail.targets) || [];
  const aiProgress = (detail == null ? void 0 : detail.aiProgress) || 0;
  const terms = loading ? [] : groupGradesByTerm(grades);
  const lastAvg = terms.length ? terms[terms.length - 1].avg : null;
  const topTarget = targets[0];
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: studentName, subtitle, leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("students") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 18 }), ariaLabel: "\uBA54\uC2DC\uC9C0", onClick: () => go("messages") }) }), error && !loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 24 }), title: "\uD559\uC0DD \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: !id ? "\uD559\uC0DD \uBAA9\uB85D\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694." : "\uB2F4\uB2F9 \uD559\uAE09 \uD559\uC0DD\uB9CC \uC870\uD68C\uD560 \uC218 \uC788\uC5B4\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => go("students") }, "\uD559\uC0DD \uBAA9\uB85D") }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflow: "auto", paddingBottom: 4 }, className: "toss-scroll" }, [
    { id: "overview", label: "\uC885\uD569" },
    { id: "ai-talk", label: "AI \uC0C1\uB2F4" },
    { id: "grades", label: "\uC131\uC801" },
    { id: "report", label: "AI \uB9AC\uD3EC\uD2B8" },
    { id: "study", label: "\uD559\uC2B5" },
    { id: "memo", label: "\uC0C1\uB2F4 \uBA54\uBAA8" }
  ].map((t) => {
    const active = tab === t.id;
    return /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
      border: "none",
      padding: "6px 12px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      background: active ? "var(--brand-500)" : "var(--bg-surface)",
      color: active ? "#fff" : "var(--fg-default)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      flexShrink: 0
    } }, t.label);
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, loading && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 96, radius: 12 }))), !loading && tab === "overview" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uCD5C\uADFC \uD3C9\uADE0"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, lastAvg == null ? "\uBBF8\uC785\uB825" : lastAvg)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "AI \uC9C4\uD589\uB3C4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, aiProgress, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)", fontWeight: 500 } }, "%")), aiProgressBadge(aiProgress)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC9C4\uB85C \uB2E8\uC11C"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, signals.length, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)", fontWeight: 500 } }, "\uAC1C"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "md", style: { flex: 1 }, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 14 }), onClick: () => setMemoOpen(true) }, "\uBA54\uBAA8 \uB0A8\uAE30\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", style: { flex: 1 }, leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), onClick: () => setReportOpen(true) }, "\uB9AC\uD3EC\uD2B8 \uBCF4\uAE30")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C4\uB85C \uBAA9\uD45C", style: { marginBottom: 12 } }, targets.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 22 }), title: "\uC124\uC815\uB41C \uC9C4\uB85C \uBAA9\uD45C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uBAA9\uD45C\uB97C \uC124\uC815\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, topTarget.career || topTarget.dept || "\uC9C4\uB85C \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, [topTarget.univ, topTarget.dept].filter(Boolean).join(" \xB7 ") || topTarget.track || ""))), /* @__PURE__ */ React.createElement(SectionCard, { title: "AI \uC9C4\uB85C \uB2E8\uC11C", subtitle: "\uB300\uD654\uC5D0\uC11C \uBCF4\uC778 \uD328\uD134" }, signals.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 22 }), title: "\uC544\uC9C1 \uC9C4\uB85C \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74 \uB2E8\uC11C\uAC00 \uC313\uC5EC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, signals.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-default)", flex: 1 }, className: "kr-heading" }, s.text)))))), !loading && tab === "ai-talk" && /* @__PURE__ */ React.createElement(StudentAICounselingView, { studentName }), !loading && tab === "grades" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(GradeYearTabs, { value: year, onChange: setYear })), /* @__PURE__ */ React.createElement(GradeHistoryView, { year, onYearChange: setYear, editable: true, onAddGrade: () => setGradeOpen(true) })), !loading && tab === "report" && /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8",
      subtitle: "\uD559\uC0DD\uC774 \uACF5\uC720\uD55C \uB9AC\uD3EC\uD2B8",
      action: signals.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), onClick: () => setReportOpen(true) }, "\uC804\uCCB4 \uBCF4\uAE30")
    },
    signals.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 22 }), title: "\uC544\uC9C1 \uACF5\uC720\uB41C \uB9AC\uD3EC\uD2B8\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD574 \uB9AC\uD3EC\uD2B8\uB97C \uACF5\uC720\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.6 }, className: "kr-heading" }, "\uB300\uD654\uC5D0\uC11C \uBC18\uBCF5\uC801\uC73C\uB85C \uAD00\uCC30\uB41C \uC9C4\uB85C \uB2E8\uC11C ", signals.length, "\uAC1C\uB97C \uBC14\uD0D5\uC73C\uB85C \uB9AC\uD3EC\uD2B8\uAC00 \uC900\uBE44\uB3FC \uC788\uC5B4\uC694. \uC804\uCCB4 \uBCF4\uAE30\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.")
  ), !loading && tab === "study" && /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uD56D\uBAA9" }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 22 }), title: "\uD559\uC2B5 \uAE30\uB85D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uD559\uC2B5 \uACC4\uD68D\uC744 \uC9C4\uD589\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })), !loading && tab === "memo" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 15 }), style: { marginBottom: 12 }, onClick: () => setMemoOpen(true) }, "\uC0C1\uB2F4 \uBA54\uBAA8 \uCD94\uAC00"), /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 22 }), title: "\uC0C1\uB2F4 \uAE30\uB85D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694", body: "\uC774 \uD559\uC0DD\uACFC\uC758 \uC0C1\uB2F4 \uBA54\uBAA8\uB97C \uCD94\uAC00\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uC313\uC5EC\uC694." }))))), gradeOpen && /* @__PURE__ */ React.createElement(GradeInputDialog, { studentName, onSave: () => {
    setGradeOpen(false);
    showToast("\uC131\uC801\uC744 \uC800\uC7A5\uD588\uC5B4\uC694", "success");
  }, onClose: () => setGradeOpen(false) }), memoOpen && /* @__PURE__ */ React.createElement(MemoOverlay, { onClose: () => setMemoOpen(false) }), /* @__PURE__ */ React.createElement(ReportViewer, { open: reportOpen, onClose: () => setReportOpen(false), forTeacher: true }));
}
function TMCounseling({ go }) {
  const [tab, setTab] = React.useState("requests");
  const [requests, setRequests] = React.useState(null);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/counseling-requests", { method: "GET" });
      setRequests(r.data || []);
    } catch (e) {
      setRequests([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const pending = (requests || []).filter((r) => r.status === "pending");
  const act = async (req, action) => {
    var _a;
    try {
      await window.__apiFetch("/counseling-requests/" + req.id + "/" + action, { method: "POST", body: JSON.stringify(action === "accept" ? { at: (/* @__PURE__ */ new Date()).toISOString() } : { note: "" }) });
      showToast(action === "accept" ? `${((_a = req.student) == null ? void 0 : _a.name) || "\uD559\uC0DD"} \uC0C1\uB2F4\uC744 \uC218\uB77D\uD588\uC5B4\uC694` : "\uC0C1\uB2F4 \uC694\uCCAD\uC744 \uBCF4\uB958\uD588\uC5B4\uC694", "success");
      load();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  const fmt = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + " " + dt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { help: "teacher-counseling", title: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px" } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "requests", label: `\uC694\uCCAD ${requests === null ? "\u2026" : pending.length}` }, { id: "memos", label: "\uC0C1\uB2F4 \uAE30\uB85D" }], activeId: tab, onChange: setTab })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px" } }, tab === "requests" && (requests === null ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 120, radius: 12 }))) : pending.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 24 }), title: "\uB300\uAE30 \uC911\uC778 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC5C6\uC5B4\uC694", body: "\uC0C8 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC624\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, pending.map((r) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(Card, { key: r.id, padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (((_a = r.student) == null ? void 0 : _a.name) || "?")[0], size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, ((_b = r.student) == null ? void 0 : _b.name) || "\uD559\uC0DD"), r.topic && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, r.topic)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, fmt(r.createdAt || r.preferredAt)))), r.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.5, marginBottom: 10 }, className: "kr-heading" }, r.note), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", style: { flex: 1 }, onClick: () => act(r, "accept") }, "\uC218\uB77D"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", style: { flex: 1 }, onClick: () => act(r, "decline") }, "\uBCF4\uB958")));
  }))), tab === "memos" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 24 }), title: "\uC0C1\uB2F4 \uAE30\uB85D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694", body: "\uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uACE0 \uBA54\uBAA8\uB97C \uB0A8\uAE30\uBA74 \uC5EC\uAE30\uC5D0 \uC313\uC5EC\uC694." })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: 12, background: "var(--info-bg)", borderRadius: 10, fontSize: 11, color: "var(--brand-600)", display: "flex", gap: 8, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcShield, { size: 13, style: { flexShrink: 0, marginTop: 1 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC0C1\uB2F4 \uAE30\uB85D\uC740 \uB2F4\uB2F9 \uD559\uC0DD\xB7\uAD50\uC0AC\uB9CC \uC5F4\uB78C\uD560 \uC218 \uC788\uC5B4\uC694. \uBAA8\uB4E0 \uC5F4\uB78C\xB7\uC218\uC815\uC740 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uB0A8\uC544\uC694.")))));
}
function TMMessages({ go }) {
  const [selected, setSelected] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [threads, setThreads] = React.useState(null);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/messages/threads", { method: "GET" });
      setThreads(r.data || []);
    } catch (e) {
      setThreads([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  if (selected) {
    return /* @__PURE__ */ React.createElement(RealMessageThread, { go: () => {
      setSelected(null);
      load();
    }, other: selected });
  }
  const fmt = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + " " + dt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };
  const filtered = (threads || []).filter((t) => (t.otherName || "").includes(search));
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uBA54\uC2DC\uC9C0", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcPlus, { size: 20 }), ariaLabel: "\uC0C8 \uBA54\uC2DC\uC9C0", onClick: () => setComposeOpen(true) }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px" } }, /* @__PURE__ */ React.createElement(TextInput, { value: search, onChange: setSearch, placeholder: "\uD559\uC0DD \uC774\uB984 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, threads === null ? /* @__PURE__ */ React.createElement(Card, { padding: 14 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 48 })) : threads.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 24 }), title: "\uC544\uC9C1 \uC8FC\uACE0\uBC1B\uC740 \uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC5B4\uC694", body: "\uC0C8 \uBA54\uC2DC\uC9C0\uB85C \uD559\uC0DD\uC5D0\uAC8C \uBA3C\uC800 \uBCF4\uB0B4\uBCF4\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", onClick: () => setComposeOpen(true) }, "\uC0C8 \uBA54\uC2DC\uC9C0") })) : filtered.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSearch, { size: 24 }), title: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694", body: "\uB2E4\uB978 \uC774\uB984\uC744 \uC2DC\uB3C4\uD574\uBCF4\uC138\uC694." })) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, filtered.map((t, i, arr) => /* @__PURE__ */ React.createElement("div", { key: t.otherId, onClick: () => setSelected({ otherId: t.otherId, otherName: t.otherName }), style: {
    display: "flex",
    gap: 12,
    padding: "14px 16px",
    borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none",
    cursor: "pointer",
    background: t.unread ? "rgba(49,130,246,0.025)" : "transparent"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: (t.otherName || "?").slice(0, 1), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, t.otherName), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, fmt(t.lastAt))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: t.unread ? "var(--fg-default)" : "var(--fg-muted)", fontWeight: t.unread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, t.lastBody), t.unread > 0 && /* @__PURE__ */ React.createElement("span", { style: { background: "var(--brand-500)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "0 5px", minWidth: 16, height: 16, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" } }, t.unread))))))), composeOpen && /* @__PURE__ */ React.createElement(TMComposeSheet, { onClose: () => setComposeOpen(false), onOpenThread: (t) => {
    setComposeOpen(false);
    setSelected(t);
  } }));
}
function TMComposeSheet({ onClose, onOpenThread }) {
  const [target, setTarget] = React.useState("individual");
  const [picked, setPicked] = React.useState(null);
  const [q, setQ] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const { rows, loading } = useTeacherRoster();
  const roster = rows.filter((s) => (s.name || "").includes(q));
  const canSend = body.trim() && (target === "all" || picked) && !busy;
  const send = async () => {
    if (!canSend) return;
    setBusy(true);
    const text = body.trim();
    try {
      if (target === "all") {
        if (rows.length === 0) {
          setBusy(false);
          return;
        }
        await Promise.all(rows.map((s) => window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: s.id, body: text }) })));
        showToast(`\uD559\uAE09 \uC804\uCCB4(${rows.length}\uBA85)\uC5D0\uAC8C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C8\uC5B4\uC694`, "success");
        onClose();
      } else {
        await window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: picked.id, body: text }) });
        showToast(`${picked.name} \uD559\uC0DD\uC5D0\uAC8C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C8\uC5B4\uC694`, "success");
        onOpenThread({ otherId: picked.id, otherName: picked.name });
      }
    } catch (e) {
      alert(e && e.body && e.body.message || "\uBA54\uC2DC\uC9C0 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement(BottomSheet, { open: true, onClose, title: "\uC0C8 \uBA54\uC2DC\uC9C0", maxHeight: "88%" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 16px" } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uBC1B\uB294 \uC0AC\uB78C", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "individual", label: "\uD559\uC0DD 1\uBA85" }, { id: "all", label: `\uD559\uAE09 \uC804\uCCB4 (${loading ? "\u2026" : rows.length}\uBA85)` }], activeId: target, onChange: (v) => {
    setTarget(v);
    setPicked(null);
  } })), target === "individual" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD \uC774\uB984 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 220, overflow: "auto", marginBottom: 12, border: "1px solid var(--line-subtle)", borderRadius: 12 }, className: "toss-scroll" }, loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026") : roster.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, rows.length === 0 ? "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694" : "\uD559\uC0DD\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694") : roster.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => setPicked(s), style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    border: "none",
    cursor: "pointer",
    borderBottom: i < roster.length - 1 ? "1px solid var(--line-subtle)" : "none",
    background: picked && picked.id === s.id ? "var(--brand-50)" : "transparent"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?").slice(0, 1), size: 34 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.grade || "")), picked && picked.id === s.id && /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--brand-500)" }))))), /* @__PURE__ */ React.createElement(FormField, { label: "\uB0B4\uC6A9", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 4, placeholder: target === "all" ? "\uD559\uAE09 \uC804\uCCB4\uC5D0\uAC8C \uBCF4\uB0BC \uBA54\uC2DC\uC9C0" : picked ? `${picked.name} \uD559\uC0DD\uC5D0\uAC8C \uBCF4\uB0BC \uBA54\uC2DC\uC9C0` : "\uBA3C\uC800 \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uC138\uC694" })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !canSend, trailing: /* @__PURE__ */ React.createElement(IcSend, { size: 15 }), onClick: send }, target === "all" ? "\uD559\uAE09 \uC804\uCCB4\uC5D0\uAC8C \uBCF4\uB0B4\uAE30" : "\uBCF4\uB0B4\uAE30")));
}
function TMCalendar({ go }) {
  const today = /* @__PURE__ */ new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  useBroadcasts();
  const grid = buildMonth(month.y, month.m);
  const monthLabel = `${month.y}\uB144 ${month.m + 1}\uC6D4`;
  const loadEvents = React.useCallback(async () => {
    const from = new Date(month.y, month.m, 1).toISOString();
    const to = new Date(month.y, month.m + 1, 0, 23, 59, 59).toISOString();
    try {
      const r = await window.__apiFetch("/calendar/events?from=" + from + "&to=" + to, { method: "GET" });
      setEvents(r.data || []);
    } catch (e) {
      setEvents([]);
    }
  }, [month.y, month.m]);
  const loadRequests = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/counseling-requests", { method: "GET" });
      setRequests(r.data || []);
    } catch (e) {
      setRequests([]);
    }
  }, []);
  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);
  const byDate = {};
  events.forEach((e) => {
    const k = dateKey(e.startsAt);
    (byDate[k] = byDate[k] || []).push(e);
  });
  const selectedEvents = byDate[selected] || [];
  const pending = requests.filter((r) => r.status === "pending");
  const fmtTime = (d) => new Date(d).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  const accept = async (req) => {
    var _a;
    try {
      await window.__apiFetch("/counseling-requests/" + req.id + "/accept", { method: "POST", body: JSON.stringify({ at: (/* @__PURE__ */ new Date(selected + "T15:00:00")).toISOString() }) });
      showToast(`${((_a = req.student) == null ? void 0 : _a.name) || "\uD559\uC0DD"} \uC0C1\uB2F4\uC744 ${selected.slice(5, 7)}/${selected.slice(8, 10)}\uC5D0 \uD655\uC815\uD588\uC5B4\uC694`, "success");
      loadEvents();
      loadRequests();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uCE98\uB9B0\uB354", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcPlus, { size: 20 }), ariaLabel: "\uC77C\uC815\xB7\uBA54\uBAA8 \uBCF4\uB0B4\uAE30", onClick: () => setComposeOpen(true) }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronLeft, { size: 20 }), onClick: () => setMonth((m) => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 })), ariaLabel: "\uC774\uC804" }), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, monthLabel), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20 }), onClick: () => setMonth((m) => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 })), ariaLabel: "\uB2E4\uC74C" })), /* @__PURE__ */ React.createElement(Card, { padding: 10, style: { margin: "0 16px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 } }, ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"].map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d, style: { textAlign: "center", fontSize: 10, fontWeight: 700, color: i === 0 ? "var(--danger)" : i === 6 ? "var(--brand-600)" : "var(--fg-muted)", padding: "4px 0" } }, d))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 } }, grid.map((cell, i) => {
    if (!cell) return /* @__PURE__ */ React.createElement("div", { key: i, style: { aspectRatio: "1" } });
    const evs = byDate[cell.key] || [];
    const isSelected = selected === cell.key;
    const isToday = cell.key === todayKey;
    return /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => setSelected(cell.key), style: {
      aspectRatio: "1",
      border: "none",
      cursor: "pointer",
      position: "relative",
      background: isSelected ? "var(--brand-500)" : isToday ? "var(--brand-50)" : "transparent",
      color: isSelected ? "#fff" : isToday ? "var(--brand-600)" : i % 7 === 0 ? "var(--danger)" : "var(--fg-strong)",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: isSelected || isToday ? 700 : 500,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, cell.day), evs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, marginTop: 1 } }, evs.slice(0, 3).map((e, k) => /* @__PURE__ */ React.createElement("span", { key: k, style: { width: 3, height: 3, borderRadius: "50%", background: isSelected ? "#fff" : CAT_COLOR[e.category] || "var(--fg-subtle)" } }))));
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, selected.slice(5, 7), "\uC6D4 ", selected.slice(8, 10), "\uC77C"), " \uC77C\uC815"), selectedEvents.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCalendar, { size: 20 }), title: "\uC77C\uC815 \uC5C6\uC74C", body: "\uC774 \uB0A0 \uB4F1\uB85D\uB41C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 } }, selectedEvents.map((e) => /* @__PURE__ */ React.createElement(Card, { key: e.id, padding: 12, style: { borderLeft: `3px solid ${CAT_COLOR[e.category] || "var(--fg-subtle)"}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)", flexShrink: 0 } }, fmtTime(e.startsAt))), e.notes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4 }, className: "kr-heading" }, e.notes)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", margin: "16px 0 4px" } }, "\uB300\uAE30 \uC911\uC778 \uC0C1\uB2F4 \uC694\uCCAD ", pending.length), pending.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 8 } }, "\uC0C8 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC624\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 8 } }, "\uC218\uB77D\uD558\uBA74 ", /* @__PURE__ */ React.createElement("strong", null, selected.slice(5, 7), "/", selected.slice(8, 10)), "\uC5D0 \uD655\uC815 \xB7 \uD559\uC0DD\uC5D0\uAC8C \uC54C\uB9BC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, pending.map((r) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(Card, { key: r.id, padding: 12 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (((_a = r.student) == null ? void 0 : _a.name) || "?")[0], size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, ((_b = r.student) == null ? void 0 : _b.name) || "\uD559\uC0DD", " ", r.topic && /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: "var(--fg-muted)" } }, "\xB7 ", r.topic)), r.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.note)), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => accept(r) }, "\uC218\uB77D")));
  })))), /* @__PURE__ */ React.createElement(BroadcastComposeDialog, { open: composeOpen, onClose: () => setComposeOpen(false) }));
}
const tmNotifIcon = (type) => {
  const t = String(type || "");
  if (t.includes("message") || t.includes("counsel")) return { icon: /* @__PURE__ */ React.createElement(IcMessage, null), tone: "warning" };
  if (t.includes("report") || t.includes("ai")) return { icon: /* @__PURE__ */ React.createElement(IcSparkles, null), tone: "purple" };
  if (t.includes("grade") || t.includes("chart") || t.includes("score")) return { icon: /* @__PURE__ */ React.createElement(IcChart, null), tone: "info" };
  if (t.includes("join") || t.includes("accept") || t.includes("complete")) return { icon: /* @__PURE__ */ React.createElement(IcCheckCircle, null), tone: "success" };
  if (t.includes("bill") || t.includes("pay") || t.includes("trial")) return { icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), tone: "neutral" };
  return { icon: /* @__PURE__ */ React.createElement(IcBell, null), tone: "brand" };
};
function TMNotifications({ go }) {
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
  const markAll = async () => {
    try {
      await window.__apiFetch("/notifications/read-all", { method: "POST" });
    } catch (e) {
    }
    setItems((its) => (its || []).map((i) => ({ ...i, read: true })));
  };
  const loading = items === null;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uC54C\uB9BC", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), trailing: !loading && items.length > 0 ? /* @__PURE__ */ React.createElement("button", { onClick: markAll, style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" } }, "\uBAA8\uB450 \uC77D\uC74C") : null }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--fg-subtle)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--success)" } }), "\uC2E4\uC2DC\uAC04 \uC5F0\uACB0\uB428 (SSE)"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 0", textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\u2026") : items.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 22 }), title: "\uC544\uC9C1 \uC54C\uB9BC\uC774 \uC5C6\uC5B4\uC694" })) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, items.map((n, i) => {
    const unread = !(n.read || n.readAt);
    const m = tmNotifIcon(n.type);
    return /* @__PURE__ */ React.createElement("div", { key: n.id || i, style: {
      display: "flex",
      gap: 12,
      padding: "14px 16px",
      borderBottom: i < items.length - 1 ? "1px solid var(--line-subtle)" : "none",
      background: unread ? "rgba(49,130,246,0.025)" : "transparent"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: `var(--${m.tone === "brand" ? "brand-50" : m.tone === "purple" ? "accent-purple-bg" : m.tone === "success" ? "success-bg" : m.tone === "warning" ? "warning-bg" : m.tone === "info" ? "info-bg" : "neutral-bg"})`,
      color: `var(--${m.tone === "brand" ? "brand-500" : m.tone === "purple" ? "accent-purple" : m.tone === "success" ? "success" : m.tone === "warning" ? "warning" : m.tone === "info" ? "info" : "neutral-fg"})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    } }, React.cloneElement(m.icon, { size: 16 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, n.title || n.type || "\uC54C\uB9BC"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)", flexShrink: 0 } }, fmtActivity(n.createdAt))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.45 }, className: "kr-heading" }, n.body || n.message)), unread && /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--brand-500)", marginTop: 12 } }));
  }))));
}
function TMBilling({ go }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uBB34\uB8CC \uCCB4\uD5D8 \uC911"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginTop: 10 } }, "\uAD50\uC0AC \uD50C\uB79C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, "\uD559\uAE09 \uAD00\uB9AC \xB7 \uCD08\uB300\uCF54\uB4DC \xB7 \uD559\uC0DD \uB9AC\uD3EC\uD2B8"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 12, background: "rgba(255,255,255,0.7)", borderRadius: 12, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC6D4 \uACB0\uC81C \uAE08\uC561"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "30,000\uC6D0")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "rgba(255,255,255,0.7)", borderRadius: 12, display: "flex", justifyContent: "space-between", marginTop: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uCCB4\uD5D8 \uC885\uB8CC\uC77C"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "2026. 05. 31")), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, style: { marginTop: 16 } }, "\uC9C0\uAE08 \uACB0\uC81C \uC2DC\uC791")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACB0\uC81C \uC218\uB2E8", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg-muted)", borderRadius: 12, textAlign: "center", border: "1px dashed var(--line-strong)" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 22, color: "var(--fg-subtle)", style: { margin: "0 auto 8px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911"))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACB0\uC81C \uB0B4\uC5ED" }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 22 }), title: "\uC544\uC9C1 \uACB0\uC81C \uB0B4\uC5ED\uC774 \uC5C6\uC5B4\uC694" }))));
}
function TMProfile({ go }) {
  var _a;
  const [me, setMe] = React.useState(null);
  const { rows, meta, loading } = useTeacherRoster();
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
      }
    })();
  }, []);
  const name = me && me.name || "\uC120\uC0DD\uB2D8";
  const classroomLabel = me ? [me.school, me.classroom].filter(Boolean).join(" ") : "";
  const count = (_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uB0B4\uC815\uBCF4" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: name[0], size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, classroomLabel || "\xA0"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { marginTop: 6 } }, "\uAD50\uC0AC \uD50C\uB79C \xB7 \uBB34\uB8CC \uCCB4\uD5D8"))), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcSchool, { size: 16 })), title: "\uD559\uAE09 \uAD00\uB9AC", subtitle: loading ? "\u2026" : `${count}/30\uBA85`, trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("classroom") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUsers, { size: 16 })), title: "\uD559\uC0DD \uAD00\uB9AC", subtitle: loading ? "\u2026" : `${count}\uBA85`, trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("students") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 })), title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", subtitle: "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("billing"), divider: false })), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })), title: "\uC54C\uB9BC \uC124\uC815", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => notReady("\uC54C\uB9BC \uC124\uC815") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16 })), title: "\uAC1C\uC778\uC815\uBCF4 \uBC0F \uBCF4\uC548", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => notReady("\uAC1C\uC778\uC815\uBCF4 \uBC0F \uBCF4\uC548"), divider: false })), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: 14, border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 14, cursor: "pointer" } }, "\uB85C\uADF8\uC544\uC6C3")));
}
function TMDashboard({ go }) {
  var _a;
  const { rows, meta, loading } = useTeacherRoster();
  const [me, setMe] = React.useState(null);
  const [requests, setRequests] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
      }
    })();
  }, []);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/counseling-requests", { method: "GET" });
        setRequests(r.data || []);
      } catch (e) {
        setRequests([]);
      }
    })();
  }, []);
  const count = (_a = meta == null ? void 0 : meta.count) != null ? _a : rows.length;
  const classroomLabel = [me == null ? void 0 : me.school, me == null ? void 0 : me.classroom].filter(Boolean).join(" ") || (meta ? [meta.school, meta.classroom].filter(Boolean).join(" ") : "");
  const activeCount = rows.filter((s) => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const focus = rows.filter((s) => s.needsCounseling).slice(0, 3);
  const pending = (requests || []).filter((r) => r.status === "pending");
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 24px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 19, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, "\uC548\uB155\uD558\uC138\uC694, ", me && me.name || "\uC120\uC0DD\uB2D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 } }, classroomLabel, classroomLabel ? " \xB7 " : "", loading ? "\u2026" : count, "/30\uBA85")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 22 }), onClick: () => go("notifications"), ariaLabel: "\uC54C\uB9BC" })), /* @__PURE__ */ React.createElement(Card, { padding: 18, style: { marginBottom: 12, background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff" }, onClick: () => go("classroom"), hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginBottom: 6 } }, "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 26, fontWeight: 800, letterSpacing: "5px" } }, "H8K4 9P"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { style: { flex: 1, padding: "8px 0", border: "none", borderRadius: 10, background: "rgba(255,255,255,0.18)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uBCF5\uC0AC"), /* @__PURE__ */ React.createElement("button", { style: { flex: 1, padding: "8px 0", border: "none", borderRadius: 10, background: "#fff", color: "var(--brand-600)", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uD559\uAE09 \uBCF4\uAE30"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => go("completion"), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC774\uBC88 \uC8FC \uD65C\uB3D9", value: loading ? "\u2013" : `${activeCount}\uBA85`, delta: activeCount > 0 ? "\uD65C\uC131" : void 0, deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcZap, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { onClick: () => go("counseling"), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC0C1\uB2F4 \uC694\uCCAD", value: requests === null ? "\u2013" : `${pending.length}\uAC74`, delta: pending.length > 0 ? "\uD655\uC778 \uD544\uC694" : void 0, deltaTone: "warning", icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC624\uB298 \uC8FC\uBAA9\uD560 \uD559\uC0DD", subtitle: "\uC0C1\uB2F4\uC774 \uD544\uC694\uD55C \uD559\uC0DD", style: { marginBottom: 12 }, action: /* @__PURE__ */ React.createElement("button", { onClick: () => go("students"), style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 12, fontWeight: 600 } }, "\uC804\uCCB4") }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 56, radius: 10 }))) : focus.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 22 }), title: "\uC8FC\uBAA9\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD604\uC7AC \uBAA8\uB4E0 \uD559\uC0DD\uC774 \uC798 \uB530\uB77C\uC624\uACE0 \uC788\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, focus.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line-subtle)", borderRadius: 10, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?")[0], size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" }, className: "kr-heading" }, counselReason(s), " \xB7 ", s.grade || "\uD559\uB144 \uBBF8\uC815")), /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC0C1\uB2F4 \uD544\uC694"))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC0C1\uB2F4 \uC694\uCCAD \uB300\uAE30", subtitle: requests === null ? "\u2026" : `${pending.length}\uAC74`, style: { marginBottom: 12 }, action: /* @__PURE__ */ React.createElement("button", { onClick: () => go("counseling"), style: { background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 12, fontWeight: 600 } }, "\uC804\uCCB4") }, requests === null ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 36 }))) : pending.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: "\uB300\uAE30 \uC911\uC778 \uC694\uCCAD\uC774 \uC5C6\uC5B4\uC694", body: "\uC0C8 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC624\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, pending.slice(0, 3).map((r) => {
    var _a2, _b;
    return /* @__PURE__ */ React.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (((_a2 = r.student) == null ? void 0 : _a2.name) || "?")[0], size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, ((_b = r.student) == null ? void 0 : _b.name) || "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" }, className: "kr-heading" }, r.topic || "\uC0C1\uB2F4 \uC694\uCCAD")), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", onClick: () => go("counseling") }, "\uCC98\uB9AC"));
  }))), /* @__PURE__ */ React.createElement(Card, { padding: 16, onClick: () => go("billing"), hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uAD50\uC0AC \uD50C\uB79C \xB7 \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", marginTop: 6 } }, "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "5\uC6D4 31\uC77C\uAE4C\uC9C0")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "var(--fg-subtle)" }))));
}
function TeacherMobileFullApp({ initialScreen = "dashboard", withToasts = false }) {
  const [screen, setScreen] = usePersistentScreen("teacher-mobile", initialScreen);
  const showBottomNav = ["dashboard", "students", "completion", "messages", "calendar", "more", "profile", "announcements", "teacher-info"].includes(screen);
  const [coach, setCoach] = React.useState(() => {
    try {
      return window.__LIVE_MODE && !localStorage.getItem("jinro:mtour:teacher");
    } catch (e) {
      return false;
    }
  });
  const endCoach = () => {
    try {
      localStorage.setItem("jinro:mtour:teacher", "1");
    } catch (e) {
    }
    setCoach(false);
  };
  const navId = screen === "student-detail" ? "students" : screen === "profile" || screen === "billing" || screen === "classroom" || screen === "counseling" || screen === "notifications" || screen === "ai-view" || screen === "calendar" || screen === "consents" || screen === "announcements" || screen === "teacher-info" ? "more" : screen;
  const cycle = withToasts ? useToastCycle(SAMPLE_TOASTS.teacher, 4200) : { active: [], close: () => {
  } };
  return /* @__PURE__ */ React.createElement("div", { "data-app-root": true, style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto", paddingTop: 54 }, className: "toss-scroll" }, screen === "dashboard" && /* @__PURE__ */ React.createElement(TMDashboard, { go: setScreen }), screen === "classroom" && /* @__PURE__ */ React.createElement(TMClassroom, { go: setScreen }), screen === "students" && /* @__PURE__ */ React.createElement(TMStudents, { go: setScreen }), screen === "student-detail" && /* @__PURE__ */ React.createElement(TMStudentDetail, { go: setScreen }), screen === "counseling" && /* @__PURE__ */ React.createElement(TMCounseling, { go: setScreen }), screen === "messages" && /* @__PURE__ */ React.createElement(TMMessages, { go: setScreen }), screen === "calendar" && /* @__PURE__ */ React.createElement(TMCalendar, { go: setScreen }), screen === "notifications" && /* @__PURE__ */ React.createElement(TMNotifications, { go: setScreen }), screen === "billing" && /* @__PURE__ */ React.createElement(TMBilling, { go: setScreen }), screen === "profile" && /* @__PURE__ */ React.createElement(TeacherProfileMobile, { go: setScreen }), screen === "settings-password" && /* @__PURE__ */ React.createElement(SettingsPassword, { back: () => setScreen("profile") }), screen === "settings-notifications" && /* @__PURE__ */ React.createElement(SettingsNotifications, { back: () => setScreen("profile"), role: "teacher" }), screen === "settings-suggest" && /* @__PURE__ */ React.createElement(SettingsSuggestion, { back: () => setScreen("profile") }), screen === "settings-announcements" && /* @__PURE__ */ React.createElement(SettingsAnnouncements, { back: () => setScreen("profile") }), screen === "settings-terms" && /* @__PURE__ */ React.createElement(SettingsTerms, { back: () => setScreen("profile") }), screen === "more" && /* @__PURE__ */ React.createElement(TMMore, { go: setScreen }), screen === "completion" && /* @__PURE__ */ React.createElement(TMCompletion, { go: setScreen }), screen === "ai-view" && /* @__PURE__ */ React.createElement(TMAIView, { go: setScreen }), screen === "consents" && /* @__PURE__ */ React.createElement(ConsentManagement, { go: setScreen, role: "teacher" }), screen === "announcements" && /* @__PURE__ */ React.createElement(AnnouncementsScreen, { role: "teacher", variant: "mobile", onBack: () => setScreen("more") }), screen === "teacher-info" && /* @__PURE__ */ React.createElement(TeacherInfoScreen, { go: setScreen })), showBottomNav && /* @__PURE__ */ React.createElement(MobileBottomNav, { items: TEACHER_MOBILE_NAV_FULL, activeId: navId, onChange: (id) => {
    if (id === "more") setScreen("more");
    else setScreen(id);
  } }), withToasts && /* @__PURE__ */ React.createElement(MobileToastHost, { toasts: cycle.active, onClose: cycle.close }), coach && screen === "dashboard" && /* @__PURE__ */ React.createElement(MobileCoachTour, { role: "teacher", onDone: endCoach }));
}
function TMCompletion({ go }) {
  const { rows, loading } = useTeacherRoster();
  const withTotal = rows.filter((s) => (s.studyTotal || 0) > 0);
  const sorted = [...rows].sort((a, b) => {
    const pa = (a.studyTotal || 0) > 0 ? (a.studyDone || 0) / a.studyTotal : 0;
    const pb = (b.studyTotal || 0) > 0 ? (b.studyDone || 0) / b.studyTotal : 0;
    return pb - pa;
  });
  const avgPct = withTotal.length ? Math.round(withTotal.reduce((acc, s) => acc + (s.studyDone || 0) / s.studyTotal, 0) / withTotal.length * 100) : 0;
  const attention = withTotal.filter((s) => (s.studyDone || 0) / s.studyTotal < 0.4).length;
  const toneFor = (pct) => pct >= 75 ? "success" : pct >= 40 ? "info" : "danger";
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { help: "teacher-completion", title: "\uD559\uC2B5 \uC644\uB8CC \uD604\uD669", subtitle: "\uC774\uBC88 \uC8FC \uC9C4\uD589\uB960", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD559\uAE09 \uD3C9\uADE0", value: loading ? "\u2013" : `${avgPct}%`, icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC8FC\uC758 \uD544\uC694", value: loading ? "\u2013" : `${attention}\uBA85`, delta: attention > 0 ? "40% \uBBF8\uB9CC" : void 0, deltaTone: "danger", icon: /* @__PURE__ */ React.createElement(IcAlert, { size: 16 }) })), loading ? /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 36 })))) : rows.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUsers, { size: 24 }), title: "\uC544\uC9C1 \uB4F1\uB85D\uB41C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574 \uCCAB \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694." })) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, sorted.map((s, i, arr) => {
    const total = s.studyTotal || 0;
    const done = s.studyDone || 0;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    const tone = toneFor(pct);
    return /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => openStudentDetail(go, s.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px",
      borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none",
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?")[0], size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, color: "var(--fg-muted)" } }, done, "/", total)), /* @__PURE__ */ React.createElement(ProgressBar, { value: done, max: Math.max(total, 1), height: 4, color: `var(--${tone === "info" ? "brand-500" : tone})` })), /* @__PURE__ */ React.createElement(Chip, { tone, size: "sm" }, pct, "%"));
  }))));
}
function TMAIView({ go }) {
  const [tab, setTab] = React.useState("signals");
  const id = typeof window !== "undefined" && window.__selectedStudentId || null;
  const [detail, setDetail] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    setDetail(null);
    setError(null);
    if (!id) {
      setError(new Error("\uD559\uC0DD \uBBF8\uC120\uD0DD"));
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
  const signals = (detail == null ? void 0 : detail.signals) || [];
  const aiProgress = (detail == null ? void 0 : detail.aiProgress) || 0;
  const studentName = student.name || "\uD559\uC0DD";
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: loading ? "AI \uB9AC\uD3EC\uD2B8" : `${studentName} \xB7 AI \uB9AC\uD3EC\uD2B8`, subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `\uC9C4\uB85C \uB2E8\uC11C ${signals.length}\uAC1C \xB7 \uC9C4\uD589\uB3C4 ${aiProgress}%`, leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("students") }) }), !id || error && !loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }), title: "\uD559\uC0DD\uC744 \uBA3C\uC800 \uC120\uD0DD\uD574\uC8FC\uC138\uC694", body: "\uD559\uC0DD \uBAA9\uB85D\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uBA74 AI \uC9C4\uB85C \uB2E8\uC11C\uB97C \uBCFC \uC218 \uC788\uC5B4\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => go("students") }, "\uD559\uC0DD \uBAA9\uB85D") }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflow: "auto" }, className: "toss-scroll" }, [
    { id: "signals", label: "\uB2E8\uC11C" },
    { id: "summary", label: "\uC694\uC57D" }
  ].map((t) => {
    const active = tab === t.id;
    return /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
      border: "none",
      padding: "6px 12px",
      borderRadius: 999,
      whiteSpace: "nowrap",
      background: active ? "var(--brand-500)" : "var(--bg-surface)",
      color: active ? "#fff" : "var(--fg-default)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      flexShrink: 0
    } }, t.label);
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--warning-bg)", borderRadius: 10, fontSize: 11, color: "var(--warning)", display: "flex", gap: 8, marginBottom: 12, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement(IcShield, { size: 13, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uD559\uC0DD \uC0AC\uC804 \uB3D9\uC758\uC5D0 \uB530\uB77C \uC5F4\uB78C \uC911. \uC678\uBD80 \uACF5\uC720 \uC2DC \uD559\uC0DD\uC5D0\uAC8C \uC54C\uB9BC\uC774 \uAC00\uC694.")), loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 64, radius: 12 }))) : tab === "signals" ? signals.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }), title: "\uC544\uC9C1 \uC9C4\uB85C \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74 \uB2E8\uC11C\uAC00 \uC313\uC5EC\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, signals.map((s, i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 12 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1 }, className: "kr-heading" }, s.text))))) : signals.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 24 }), title: "\uC544\uC9C1 \uC694\uC57D\uD560 \uB0B4\uC6A9\uC774 \uC5C6\uC5B4\uC694", body: "\uC9C4\uB85C \uB2E8\uC11C\uAC00 \uC313\uC774\uBA74 \uC694\uC57D\uC774 \uB9CC\uB4E4\uC5B4\uC838\uC694." })) : /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", style: { marginBottom: 10 } }, "\uC9C4\uB85C \uB2E8\uC11C \uC694\uC57D"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", lineHeight: 1.6 }, className: "kr-heading" }, studentName, " \uD559\uC0DD\uC758 \uB300\uD654\uC5D0\uC11C \uC9C4\uB85C \uB2E8\uC11C ", signals.length, "\uAC1C\uAC00 \uAD00\uCC30\uB410\uC5B4\uC694. AI \uC9C4\uD589\uB3C4\uB294 ", aiProgress, "%\uC608\uC694. \uC790\uC138\uD55C \uB0B4\uC6A9\uC740 \uB2E8\uC11C \uD0ED\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.")))));
}
function TMMore({ go }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TMHeader, { title: "\uB354\uBCF4\uAE30" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 0 }, [
    { id: "classroom", label: "\uD559\uAE09 \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcSchool, null), sub: "\uCD08\uB300\uCF54\uB4DC \xB7 \uC815\uC6D0", tone: "brand" },
    { id: "calendar", label: "\uCE98\uB9B0\uB354", icon: /* @__PURE__ */ React.createElement(IcCalendar, null), sub: "\uC77C\uC815 \xB7 \uC0C1\uB2F4 \uC694\uCCAD", tone: "purple" },
    { id: "counseling", label: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", icon: /* @__PURE__ */ React.createElement(IcClipboard, null), sub: "\uC0C1\uB2F4 \uC694\uCCAD \xB7 \uAE30\uB85D \uAD00\uB9AC", tone: "warning" },
    { id: "ai-view", label: "\uD559\uC0DD AI \uB9AC\uD3EC\uD2B8", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), sub: "\uD559\uC0DD\uBCC4 \uC9C4\uB85C \uB2E8\uC11C", tone: "purple" },
    { id: "notifications", label: "\uC54C\uB9BC", icon: /* @__PURE__ */ React.createElement(IcBell, null), sub: "\uC2E4\uC2DC\uAC04 \uC54C\uB9BC", tone: "info" },
    { id: "consents", label: "\uB3D9\uC758 \uAD00\uB9AC", icon: /* @__PURE__ */ React.createElement(IcShield, null), sub: "\uAC1C\uC778\uC815\uBCF4 \xB7 \uACB0\uC81C \uB3D9\uC758", tone: "success" },
    { id: "announcements", label: "\uACF5\uC9C0\uC0AC\uD56D", icon: /* @__PURE__ */ React.createElement(IcFlag, null), sub: "\uC5C5\uB370\uC774\uD2B8 \uC18C\uC2DD \xB7 \uAC74\uC758\xB7\uBC84\uADF8 \uC81C\uBCF4", tone: "mint" },
    { id: "billing", label: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), sub: "\uBB34\uB8CC \uCCB4\uD5D8", tone: "mint" },
    { id: "profile", label: "\uB0B4\uC815\uBCF4", icon: /* @__PURE__ */ React.createElement(IcUser, null), sub: "\uACC4\uC815 \xB7 \uC124\uC815", tone: "neutral" }
  ].map((it, i, arr) => /* @__PURE__ */ React.createElement(
    ListRow,
    {
      key: it.id,
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: toneBg(it.tone), color: toneFg(it.tone), display: "flex", alignItems: "center", justifyContent: "center" } }, React.cloneElement(it.icon, { size: 16 })),
      title: it.label,
      subtitle: it.sub,
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go(it.id),
      divider: i < arr.length - 1
    }
  )))));
}
Object.assign(window, { TeacherMobileFullApp });
