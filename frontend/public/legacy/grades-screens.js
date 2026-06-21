const GRADE_TYPES = [
  { id: "mock", label: "\uBAA8\uC758\uACE0\uC0AC", icon: /* @__PURE__ */ React.createElement(IcDoc, null) },
  { id: "midterm", label: "\uC911\uAC04\uACE0\uC0AC", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
  { id: "final", label: "\uAE30\uB9D0\uACE0\uC0AC", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
  { id: "performance", label: "\uC218\uD589\uD3C9\uAC00", icon: /* @__PURE__ */ React.createElement(IcStar, null) }
];
function GradesInputV2({ go }) {
  const CATS = ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559", "\uD55C\uAD6D\uC0AC", "\uC81C2\uC678\uAD6D\uC5B4", "\uC608\uCCB4\uB2A5", "\uAE30\uD0C0"];
  const thisYear = (/* @__PURE__ */ new Date()).getFullYear();
  const TERMS = [thisYear + "-1", thisYear + "-2", thisYear - 1 + "-2", thisYear - 1 + "-1"];
  const [term, setTerm] = React.useState(TERMS[0]);
  const [rows, setRows] = React.useState([{ subject: "", category: "", score: "", rank: "" }]);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState("");
  const upd = (i, k, v) => setRows((r) => r.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addRow = () => setRows((r) => [...r, { subject: "", category: "", score: "", rank: "" }]);
  const delRow = (i) => setRows((r) => r.length > 1 ? r.filter((_, j) => j !== i) : r);
  const save = async () => {
    setErr("");
    if (!term.trim()) {
      setErr("\uD559\uAE30\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694 (\uC608: 2026-1).");
      return;
    }
    const valid = rows.filter((r) => r.subject.trim() && (r.score !== "" || r.rank !== ""));
    if (!valid.length) {
      setErr("\uACFC\uBAA9\uBA85\uACFC \uC810\uC218(\uB610\uB294 \uB4F1\uAE09)\uB97C \uCD5C\uC18C 1\uAC1C \uC785\uB825\uD574\uC8FC\uC138\uC694.");
      return;
    }
    setSaving(true);
    try {
      for (const r of valid) {
        await window.__apiFetch("/grades", { method: "POST", body: JSON.stringify({
          term: term.trim(),
          subject: r.subject.trim(),
          ...r.category ? { category: r.category } : {},
          ...r.score !== "" ? { score: Number(r.score) } : {},
          ...r.rank !== "" ? { rank: Number(r.rank) } : {}
        }) });
      }
      go("grades-trend");
    } catch (e) {
      setErr(e && e.body && e.body.message || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC131\uC801 \uC785\uB825", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("grades-trend") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: 16 } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD559\uAE30", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SelectChips, { value: term, onChange: setTerm, options: TERMS }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(TextInput, { value: term, onChange: setTerm, placeholder: "\uC9C1\uC811 \uC785\uB825 (\uC608: 2026-1)", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }) }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACFC\uBAA9\uBCC4 \uC131\uC801", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, rows.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: 12, background: "var(--bg-muted)", borderRadius: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: r.subject, onChange: (v) => upd(i, "subject", v), placeholder: "\uACFC\uBAA9\uBA85 (\uC608: \uBBF8\uC801\uBD84)", style: { flex: 1, minWidth: 0, boxSizing: "border-box" } }), rows.length > 1 && /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcTrash, { size: 16 }), ariaLabel: "\uC0AD\uC81C", onClick: () => delRow(i) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: r.score, onChange: (v) => upd(i, "score", v.replace(/[^0-9.]/g, "")), placeholder: "\uC810\uC218 0~100", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uC810"), style: { flex: 1, minWidth: 0, boxSizing: "border-box" } }), /* @__PURE__ */ React.createElement(TextInput, { value: r.rank, onChange: (v) => upd(i, "rank", v.replace(/[^1-9]/g, "").slice(0, 1)), placeholder: "\uB4F1\uAE09 1~9", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uB4F1\uAE09"), style: { flex: 1, minWidth: 0, boxSizing: "border-box" } })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" } }, CATS.map((c) => {
    const sel = r.category === c;
    const pickCat = (row) => sel ? "" : c;
    const pickSubject = (row) => {
      if (sel) return row.subject;
      if (!row.subject.trim() || row.subject.trim() === row.category) return c;
      return row.subject;
    };
    return /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setRows((rs) => rs.map((x, j) => j === i ? { ...x, subject: pickSubject(x), category: pickCat(x) } : x)), style: { border: "none", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer", background: sel ? "var(--brand-500)" : "var(--bg-surface)", color: sel ? "#fff" : "var(--fg-muted)" } }, c);
  }))))), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: addRow, style: { marginTop: 10 } }, "\uACFC\uBAA9 \uCD94\uAC00")), err && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--danger)", fontSize: 13, marginBottom: 12, padding: "0 4px" } }, err), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: saving, onClick: save }, saving ? "\uC800\uC7A5 \uC911\u2026" : "\uC800\uC7A5\uD558\uAE30")));
}
function MockExamForm({ go }) {
  const [date, setDate] = React.useState("");
  const [examName, setExamName] = React.useState("");
  const [year, setYear] = React.useState("\uACE02");
  const [korean, setKorean] = React.useState({ raw: "", percent: "", grade: "" });
  const [math, setMath] = React.useState({ raw: "", percent: "", grade: "" });
  const [english, setEnglish] = React.useState({ grade: "" });
  const [history, setHistory] = React.useState({ grade: "" });
  const [insp1, setInsp1] = React.useState({ subject: "", raw: "", grade: "" });
  const [insp2, setInsp2] = React.useState({ subject: "", raw: "", grade: "" });
  const [notes, setNotes] = React.useState("");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC2DC\uD5D8 \uC815\uBCF4", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uD5D8\uBA85", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: examName, onChange: setExamName, placeholder: "\uC608) 5\uC6D4 \uC804\uAD6D\uC5F0\uD569\uD559\uB825\uD3C9\uAC00", leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 16 }) })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uD5D8\uC77C", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: date, onChange: setDate, placeholder: "YYYY-MM-DD", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }) })), /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uB144", required: true }, /* @__PURE__ */ React.createElement(SelectChips, { value: year, onChange: setYear, options: ["\uACE01", "\uACE02", "\uACE03"] }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACF5\uD1B5 \uACFC\uBAA9", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ScoreTriplet, { label: "\uAD6D\uC5B4", value: korean, onChange: setKorean }), /* @__PURE__ */ React.createElement(ScoreTriplet, { label: "\uC218\uD559", value: math, onChange: setMath }), /* @__PURE__ */ React.createElement(FormField, { label: "\uC601\uC5B4 (\uC808\uB300\uD3C9\uAC00)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SelectChips, { value: english.grade, onChange: (v) => setEnglish({ grade: v }), options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], suffix: "\uB4F1\uAE09" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uD55C\uAD6D\uC0AC (\uC808\uB300\uD3C9\uAC00)" }, /* @__PURE__ */ React.createElement(SelectChips, { value: history.grade, onChange: (v) => setHistory({ grade: v }), options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"], suffix: "\uB4F1\uAE09" }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD0D0\uAD6C \uC601\uC5ED", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SubjectScoreRow, { label: "\uD0D0\uAD6C 1", value: insp1, onChange: setInsp1 }), /* @__PURE__ */ React.createElement("div", { style: { height: 12 } }), /* @__PURE__ */ React.createElement(SubjectScoreRow, { label: "\uD0D0\uAD6C 2", value: insp2, onChange: setInsp2 })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBA54\uBAA8 (\uC120\uD0DD)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Textarea, { value: notes, onChange: setNotes, placeholder: "\uC774\uBC88 \uC2DC\uD5D8\uC5D0\uC11C \uB290\uB080 \uC810, \uC57D\uC810\uC774\uC5C8\uB358 \uB2E8\uC6D0 \uB4F1", rows: 3 })), /* @__PURE__ */ React.createElement(InfoStrip, { text: "\uC785\uB825\uD55C \uC131\uC801\uC740 \uC120\uC0DD\uB2D8\uAED8\uB3C4 \uACF5\uC720\uB3FC\uC694. AI \uC9C4\uB85C \uBD84\uC11D\uC5D0 \uC790\uB3D9 \uBC18\uC601\uB429\uB2C8\uB2E4." }), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => go("grades-trend"), style: { marginTop: 16 } }, "\uC800\uC7A5\uD558\uAE30"));
}
function SchoolExamForm({ go, type }) {
  const [semester, setSemester] = React.useState("2-1");
  const [subjects, setSubjects] = React.useState([
    { subject: "\uAD6D\uC5B4", score: "", max: "100", weight: "1" },
    { subject: "\uC218\uD559", score: "", max: "100", weight: "1" },
    { subject: "\uC601\uC5B4", score: "", max: "100", weight: "1" }
  ]);
  const [notes, setNotes] = React.useState("");
  const addSubject = () => setSubjects((s) => [...s, { subject: "", score: "", max: "100", weight: "1" }]);
  const updateSubject = (i, k, v) => setSubjects((s) => s.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const removeSubject = (i) => setSubjects((s) => s.filter((_, j) => j !== i));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC2DC\uD5D8 \uC815\uBCF4", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uAE30", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(SelectChips, { value: semester, onChange: setSemester, options: ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"], suffix: "\uD559\uAE30" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uD5D8 \uC885\uB958" }, /* @__PURE__ */ React.createElement(Chip, { tone: type === "midterm" ? "info" : "purple", size: "lg" }, type === "midterm" ? "\uC911\uAC04\uACE0\uC0AC" : "\uAE30\uB9D0\uACE0\uC0AC"))), /* @__PURE__ */ React.createElement(
    SectionCard,
    {
      title: "\uACFC\uBAA9\uBCC4 \uC810\uC218",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 12 }), onClick: addSubject }, "\uACFC\uBAA9 \uCD94\uAC00"),
      style: { marginBottom: 12 }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, subjects.map((row, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: row.subject, onChange: (v) => updateSubject(i, "subject", v), placeholder: "\uACFC\uBAA9\uBA85 (\uC608: \uC218\uD559)", style: { height: 40, flex: 1 } }), subjects.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => removeSubject(i), style: { marginLeft: 8, background: "transparent", border: "none", color: "var(--fg-subtle)", cursor: "pointer", padding: 6 } }, /* @__PURE__ */ React.createElement(IcX, { size: 14 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: row.score, onChange: (v) => updateSubject(i, "score", v), placeholder: "\uC810\uC218", suffix: "\uC810" }), /* @__PURE__ */ React.createElement(SmallNumInput, { value: row.max, onChange: (v) => updateSubject(i, "max", v), placeholder: "\uB9CC\uC810", suffix: "\uC810" }), /* @__PURE__ */ React.createElement(SmallNumInput, { value: row.weight, onChange: (v) => updateSubject(i, "weight", v), placeholder: "\uBE44\uC911", suffix: "x" })))))
  ), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBA54\uBAA8 (\uC120\uD0DD)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Textarea, { value: notes, onChange: setNotes, placeholder: "\uC774\uBC88 \uC2DC\uD5D8\uC5D0\uC11C \uB290\uB080 \uC810, \uB2E4\uC74C\uC5D0 \uBCF4\uC644\uD560 \uBD80\uBD84", rows: 3 })), /* @__PURE__ */ React.createElement(InfoStrip, { text: "\uC6D0\uC810\uC218\uC640 \uB9CC\uC810\uC744 \uBAA8\uB450 \uC785\uB825\uD558\uBA74 \uD658\uC0B0 \uC810\uC218\uAC00 \uC790\uB3D9\uC73C\uB85C \uACC4\uC0B0\uB3FC\uC694." }), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => go("grades-trend"), style: { marginTop: 16 } }, "\uC800\uC7A5\uD558\uAE30"));
}
function PerformanceForm({ go }) {
  const [subject, setSubject] = React.useState("");
  const [task, setTask] = React.useState("");
  const [score, setScore] = React.useState("");
  const [max, setMax] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [due, setDue] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC218\uD589\uD3C9\uAC00 \uC815\uBCF4", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uACFC\uBAA9", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: subject, onChange: setSubject, placeholder: "\uC608) \uC0AC\uD68C" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uACFC\uC81C\uBA85", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: task, onChange: setTask, placeholder: "\uC608) \uB2E8\uC6D0\uD3C9\uAC00 7\uB2E8\uC6D0 \uBCF4\uACE0\uC11C" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC81C\uCD9C\uC77C" }, /* @__PURE__ */ React.createElement(TextInput, { value: due, onChange: setDue, placeholder: "YYYY-MM-DD", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }) }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC810\uC218", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uD68D\uB4DD \uC810\uC218" }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: score, onChange: setScore, placeholder: "0", suffix: "\uC810" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uB9CC\uC810" }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: max, onChange: setMax, placeholder: "100", suffix: "\uC810" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBC18\uC601 \uBE44\uC911" }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: weight, onChange: setWeight, placeholder: "20", suffix: "%" })))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD53C\uB4DC\uBC31 / \uBA54\uBAA8 (\uC120\uD0DD)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Textarea, { value: feedback, onChange: setFeedback, placeholder: "\uC120\uC0DD\uB2D8 \uD53C\uB4DC\uBC31, \uB2E4\uC74C\uC5D0 \uBCF4\uC644\uD560 \uBD80\uBD84 \uB4F1", rows: 4 })), /* @__PURE__ */ React.createElement(InfoStrip, { text: "\uC218\uD589\uD3C9\uAC00\uB294 \uB0B4\uC2E0 \uC0B0\uCD9C\uC5D0 \uBC18\uC601\uB3FC\uC694. \uB204\uC801 \uC810\uC218\uB294 \uD559\uAE30 \uC885\uD569 \uC810\uC218\uC5D0 \uC790\uB3D9\uC73C\uB85C \uD569\uCCD0\uC838\uC694." }), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => go("grades-trend"), style: { marginTop: 16 } }, "\uC800\uC7A5\uD558\uAE30"));
}
function ScoreTriplet({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement(FormField, { label, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: value.raw, onChange: (v) => onChange({ ...value, raw: v }), placeholder: "\uC6D0\uC810\uC218", suffix: "\uC810" }), /* @__PURE__ */ React.createElement(SmallNumInput, { value: value.percent, onChange: (v) => onChange({ ...value, percent: v }), placeholder: "\uBC31\uBD84\uC704", suffix: "%" }), /* @__PURE__ */ React.createElement(SmallNumInput, { value: value.grade, onChange: (v) => onChange({ ...value, grade: v }), placeholder: "\uB4F1\uAE09", suffix: "\uB4F1\uAE09" })));
}
function SubjectScoreRow({ label, value, onChange }) {
  const SUBJECTS = ["\uC0DD\uD65C\uACFC\uC724\uB9AC", "\uC724\uB9AC\uC640\uC0AC\uC0C1", "\uD55C\uAD6D\uC9C0\uB9AC", "\uC138\uACC4\uC9C0\uB9AC", "\uB3D9\uC544\uC2DC\uC544\uC0AC", "\uC138\uACC4\uC0AC", "\uACBD\uC81C", "\uC815\uCE58\uC640\uBC95", "\uC0AC\uD68C\uBB38\uD654", "\uBB3C\uB9AC\uD559I", "\uD654\uD559I", "\uC0DD\uBA85\uACFC\uD559I", "\uC9C0\uAD6C\uACFC\uD559I"];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormField, { label, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: value.subject, onChange: (v) => onChange({ ...value, subject: v }), placeholder: "\uACFC\uBAA9 \uC120\uD0DD (\uC608: \uC0AC\uD68C\uBB38\uD654)" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, /* @__PURE__ */ React.createElement(SmallNumInput, { value: value.raw, onChange: (v) => onChange({ ...value, raw: v }), placeholder: "\uD45C\uC900\uC810\uC218", suffix: "\uC810" }), /* @__PURE__ */ React.createElement(SmallNumInput, { value: value.grade, onChange: (v) => onChange({ ...value, grade: v }), placeholder: "\uB4F1\uAE09", suffix: "\uB4F1\uAE09" })));
}
function SmallNumInput({ value, onChange, placeholder, suffix }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    height: 42,
    padding: "0 10px",
    background: "var(--bg-surface)",
    border: "1px solid var(--line-strong)",
    borderRadius: 10
  } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value,
      onChange: (e) => onChange(e.target.value.replace(/[^\d.]/g, "")),
      placeholder,
      inputMode: "decimal",
      style: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: 14,
        color: "var(--fg-strong)",
        minWidth: 0,
        fontVariantNumeric: "tabular-nums",
        width: "100%"
      }
    }
  ), suffix && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, suffix));
}
function SelectChips({ value, onChange, options, suffix }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, overflow: "auto" }, className: "toss-scroll" }, options.map((o) => /* @__PURE__ */ React.createElement("button", { key: o, onClick: () => onChange(o), style: {
    flex: 1,
    minWidth: 38,
    padding: "8px 4px",
    border: "1px solid",
    borderColor: value === o ? "var(--brand-500)" : "var(--line-strong)",
    background: value === o ? "var(--brand-50)" : "var(--bg-surface)",
    color: value === o ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: value === o ? 700 : 500,
    cursor: "pointer"
  } }, o, suffix && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, opacity: 0.7 } }, suffix))));
}
function InfoStrip({ text, tone = "info" }) {
  const c = tone === "info" ? { bg: "var(--brand-50)", fg: "var(--brand-600)" } : { bg: "var(--warning-bg)", fg: "var(--warning)" };
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: 14,
    background: c.bg,
    borderRadius: 12,
    fontSize: 12,
    color: c.fg,
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    lineHeight: 1.5
  } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, text));
}
Object.assign(window, { GradesInputV2 });
