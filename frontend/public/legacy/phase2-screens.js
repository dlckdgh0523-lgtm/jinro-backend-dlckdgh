const CONSENT_DEFS = {
  student: [
    { id: "tos", label: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00", desc: "\uC11C\uBE44\uC2A4 \uC0AC\uC6A9 \uC804\uBC18\uC5D0 \uC801\uC6A9\uB418\uB294 \uAE30\uBCF8 \uC57D\uAD00", required: true, version: "v1.2", linkPath: "/terms" },
    { id: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9", desc: "\uC774\uBA54\uC77C, \uC774\uB984, \uD559\uAD50 \uB4F1 \uC2DD\uBCC4 \uC815\uBCF4 \uCC98\uB9AC", required: true, version: "v1.4", linkPath: "/privacy" },
    { id: "academic", label: "\uD559\uC5C5\xB7\uC131\uC801 \uB370\uC774\uD130 \uCC98\uB9AC", desc: "\uBAA8\uC758\uACE0\uC0AC\xB7\uB0B4\uC2E0\xB7\uC218\uD589\uD3C9\uAC00 \uC810\uC218 \uBD84\uC11D \uBAA9\uC801", required: true, version: "v1.0" },
    { id: "ai", label: "AI \uC9C4\uB85C\uC0C1\uB2F4 \uB300\uD654 \uB370\uC774\uD130 \uCC98\uB9AC", desc: "\uB300\uD654 \uB0B4\uC6A9\uC744 LLM\uC5D0 \uC804\uB2EC (\uAC1C\uC778\uC815\uBCF4 \uB9C8\uC2A4\uD0B9)", required: true, version: "v1.1" },
    { id: "age", label: "\uB9CC 14\uC138 \uC774\uC0C1 \xB7 \uBC95\uC815\uB300\uB9AC\uC778 \uB3D9\uC758", desc: "\uBBF8\uC131\uB144\uC790 \uBCF4\uD638 \uD544\uC218 \uC0AC\uD56D", required: true, version: "v1.0" },
    { id: "mkt", label: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0", desc: "\uC2E0\uAE30\uB2A5\xB7\uC774\uBCA4\uD2B8\xB7\uD560\uC778 \uC548\uB0B4 (\uC774\uBA54\uC77C/\uD478\uC2DC)", required: false, version: "v1.0" },
    { id: "analytics", label: "\uC11C\uBE44\uC2A4 \uAC1C\uC120 \uBD84\uC11D", desc: "\uC775\uBA85\uD654\uB41C \uC0AC\uC6A9 \uD328\uD134 \uBD84\uC11D (Google Analytics \uB4F1)", required: false, version: "v1.0" }
  ],
  teacher: [
    { id: "tos", label: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00", desc: "\uAD50\uC0AC \uC804\uC6A9 \uC57D\uAD00 \uD3EC\uD568", required: true, version: "v1.2", linkPath: "/terms" },
    { id: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9", desc: "\uC774\uBA54\uC77C, \uC774\uB984, \uC18C\uC18D\uD559\uAD50", required: true, version: "v1.4", linkPath: "/privacy" },
    { id: "class", label: "\uD559\uAE09\xB7\uD559\uC0DD \uC815\uBCF4 \uCC98\uB9AC", desc: "\uD559\uC0DD\uC758 \uC131\uC801\xB7\uC0C1\uB2F4 \uB370\uC774\uD130 \uC5F4\uB78C \uBC0F \uAD00\uB9AC", required: true, version: "v1.0" },
    { id: "billing", label: "\uACB0\uC81C\xB7\uAD6C\uB3C5 \uC548\uB0B4 \uC218\uC2E0", desc: "\uACB0\uC81C \uC601\uC218\uC99D, \uAC31\uC2E0/\uC2E4\uD328 \uD1B5\uC9C0", required: true, version: "v1.0" },
    { id: "mkt", label: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0", desc: "\uAD50\uC0AC \uB300\uC0C1 \uC2E0\uAE30\uB2A5/\uC138\uBBF8\uB098 \uC548\uB0B4", required: false, version: "v1.0" }
  ]
};
function ConsentManagement({ go, role = "student" }) {
  const defs = CONSENT_DEFS[role];
  const [state, setState] = React.useState(() => {
    const s = {};
    defs.forEach((d) => {
      s[d.id] = d.required || d.id !== "mkt";
    });
    return s;
  });
  const [history, setHistory] = React.useState([]);
  const toggle = (id, def) => {
    if (def.required) return;
    const next = !state[id];
    setState((s) => ({ ...s, [id]: next }));
    setHistory((h) => [{
      id: `h${Date.now()}`,
      when: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "),
      who: "\uBCF8\uC778",
      what: `${def.label} ${next ? "\uB3D9\uC758" : "\uB3D9\uC758 \uD574\uC81C"}`,
      items: [id],
      action: next ? "grant" : "revoke"
    }, ...h]);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uB3D9\uC758 \uD56D\uBAA9 \uAD00\uB9AC", subtitle: "\uAC1C\uC778\uC815\uBCF4\xB7\uC11C\uBE44\uC2A4 \uB3D9\uC758 \uB0B4\uC5ED\uC744 \uAD00\uB9AC\uD558\uC138\uC694", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--info-bg)", borderRadius: 12, fontSize: 12, color: "var(--brand-600)", lineHeight: 1.55, marginBottom: 14, display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, /* @__PURE__ */ React.createElement("strong", null, "\uD544\uC218 \uD56D\uBAA9"), "\uC740 \uC11C\uBE44\uC2A4 \uC774\uC6A9\uC744 \uC704\uD574 \uD574\uC81C\uD560 \uC218 \uC5C6\uC5B4\uC694. \uD574\uC81C\uD558\uB824\uBA74 \uD68C\uC6D0 \uD0C8\uD1F4\uB97C \uC9C4\uD589\uD574\uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD604\uC7AC \uB3D9\uC758 \uC0C1\uD0DC", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, defs.map((d, i) => {
    const on = state[d.id];
    return /* @__PURE__ */ React.createElement("div", { key: d.id, style: { display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 4px", borderTop: i === 0 ? "none" : "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement(Chip, { tone: d.required ? "danger" : "neutral", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, d.required ? "\uD544\uC218" : "\uC120\uD0DD"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, d.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)", fontFamily: "monospace" } }, d.version)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5 }, className: "kr-heading" }, d.desc), d.linkPath && /* @__PURE__ */ React.createElement("a", { style: { fontSize: 11, color: "var(--brand-600)", fontWeight: 600, cursor: "pointer", textDecoration: "underline", marginTop: 4, display: "inline-block" } }, "\uC804\uBB38 \uBCF4\uAE30")), /* @__PURE__ */ React.createElement(ToggleSwitch, { checked: on, onChange: () => toggle(d.id, d), disabled: d.required }));
  }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uBCC0\uACBD \uC774\uB825", subtitle: "\uBAA8\uB4E0 \uB3D9\uC758 \uBCC0\uACBD\uC740 \uC601\uAD6C \uAE30\uB85D\uB3FC\uC694", style: { marginBottom: 12 } }, history.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 4px", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uBCC0\uACBD \uC774\uB825\uC774 \uC5C6\uC5B4\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, history.map((h, i, arr) => /* @__PURE__ */ React.createElement("div", { key: h.id, style: { display: "flex", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: h.action === "revoke" ? "var(--warning)" : "var(--success)", marginTop: 6, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, h.what), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, h.who, " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "num" }, h.when))))))), /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { background: "var(--bg-muted)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uB3D9\uC758 \uB0B4\uC5ED\uC740 \uBC31\uC5D4\uB4DC ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace", background: "var(--bg-surface)", padding: "1px 6px", borderRadius: 4 } }, "POST /v1/consents"), "\uB85C \uAE30\uB85D\uB418\uBA70, \uD68C\uC6D0 \uD0C8\uD1F4 \uC2DC\uAE4C\uC9C0 \uBCF4\uAD00\uB429\uB2C8\uB2E4."))));
}
function ToggleSwitch({ checked, onChange, disabled }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onChange,
      disabled,
      role: "switch",
      "aria-checked": checked,
      style: {
        width: 44,
        height: 26,
        borderRadius: 999,
        border: "none",
        background: disabled ? "var(--line-strong)" : checked ? "var(--brand-500)" : "var(--line-strong)",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 180ms var(--ease-toss)",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: {
      position: "absolute",
      top: 3,
      left: checked ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      transition: "left 180ms var(--ease-toss)"
    } })
  );
}
const DAYS_KR = { mon: "\uC6D4", tue: "\uD654", wed: "\uC218", thu: "\uBAA9", fri: "\uAE08", sat: "\uD1A0", sun: "\uC77C" };
function isoWeekKey(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((dt - yearStart) / 864e5 + 1) / 7);
  return dt.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}
function StudyPlanFull({ go }) {
  const weekKey = isoWeekKey(/* @__PURE__ */ new Date());
  const [tasks, setTasks] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const SUBJECTS = ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559", "\uD55C\uAD6D\uC0AC", "\uAE30\uD0C0"];
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/study-tasks?weekKey=" + weekKey, { method: "GET" });
      setTasks(r.data || []);
    } catch (e) {
      setTasks([]);
    }
  }, [weekKey]);
  React.useEffect(() => {
    load();
  }, [load]);
  const total = (tasks || []).length;
  const done = (tasks || []).filter((t) => t.done).length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const toggle = async (t) => {
    setTasks((ts) => ts.map((x) => x.id === t.id ? { ...x, done: !x.done } : x));
    try {
      await window.__apiFetch("/study-tasks/" + t.id, { method: "PATCH", body: JSON.stringify({ done: !t.done }) });
    } catch (e) {
      load();
    }
  };
  const del = async (id) => {
    try {
      await window.__apiFetch("/study-tasks/" + id, { method: "DELETE" });
      load();
    } catch (e) {
    }
  };
  const add = async () => {
    if (!title.trim()) return;
    const body = { title: title.trim(), weekKey, ...subject ? { subject } : {} };
    setTitle("");
    try {
      await window.__apiFetch("/study-tasks", { method: "POST", body: JSON.stringify(body) });
      load();
    } catch (e) {
      alert("\uCD94\uAC00\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  const subjectColor = (s) => ({ "\uAD6D\uC5B4": "#FFE2D6", "\uC218\uD559": "#D6E6FF", "\uC601\uC5B4": "#E6F5E0", "\uC0AC\uD68C": "#EDD9FF", "\uACFC\uD559": "#FFE9D6", "\uD55C\uAD6D\uC0AC": "#D9F2EC" })[s] || "var(--bg-muted)";
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uD559\uC2B5 \uACC4\uD68D", subtitle: "\uC774\uBC88 \uC8FC(" + weekKey + ") \uC9C4\uB3C4\uB97C \uD55C\uB208\uC5D0" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uC644\uB8CC"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 32, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1px" } }, done), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: "var(--fg-muted)" }, className: "num" }, "/ ", total))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 28, fontWeight: 800, color: "var(--brand-600)" } }, pct, "%"))), /* @__PURE__ */ React.createElement(ProgressBar, { value: done, max: total || 1, height: 8 })), /* @__PURE__ */ React.createElement(Card, { padding: 12, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(TextInput, { value: title, onChange: setTitle, placeholder: "\uD560 \uC77C \uCD94\uAC00 (\uC608: \uC218\uD559 II 5\uB2E8\uC6D0 \uBB38\uC81C\uD480\uC774)", style: { flex: 1 }, onKeyDown: (e) => {
    if (e.key === "Enter") add();
  } }), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", onClick: add }, "\uCD94\uAC00")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" } }, SUBJECTS.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => setSubject(subject === s ? "" : s), style: { border: "none", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer", background: subject === s ? "var(--brand-500)" : "var(--bg-muted)", color: subject === s ? "#fff" : "var(--fg-muted)" } }, s)))), tasks === null ? /* @__PURE__ */ React.createElement(Card, { padding: 14 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 40 })) : tasks.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcBook, { size: 22 }), title: "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uACC4\uD68D\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694", body: "\uC704\uC5D0\uC11C \uD560 \uC77C\uC744 \uCD94\uAC00\uD574\uBCF4\uC138\uC694. \uC644\uB8CC\uD558\uBA74 \uCCB4\uD06C\uD574\uC11C \uC9C4\uD589\uB960\uC744 \uAD00\uB9AC\uD560 \uC218 \uC788\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC774\uBC88 \uC8FC \uD560 \uC77C" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, tasks.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { display: "flex", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 10, background: t.done ? "var(--bg-muted)" : "var(--bg-surface)", border: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => toggle(t), style: { width: 22, height: 22, borderRadius: "50%", border: t.done ? "none" : "2px solid var(--line-strong)", background: t.done ? "var(--success)" : "transparent", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, t.done && /* @__PURE__ */ React.createElement(IcCheck, { size: 14 })), t.subject && /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 7, background: subjectColor(t.subject), fontSize: 11, fontWeight: 700, color: "var(--fg-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, t.subject.slice(0, 1)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: t.done ? "var(--fg-muted)" : "var(--fg-strong)", textDecoration: t.done ? "line-through" : "none" }, className: "kr-heading" }, t.title)), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcTrash, { size: 15 }), ariaLabel: "\uC0AD\uC81C", onClick: () => del(t.id) })))))));
}
function AddTaskSheet({ onClose }) {
  const [title, setTitle] = React.useState("");
  const [subject, setSubject] = React.useState("\uC218\uD559");
  const [day, setDay] = React.useState("mon");
  const [est, setEst] = React.useState("60");
  return /* @__PURE__ */ React.createElement(BottomSheet, { open: true, onClose, title: "\uACFC\uC81C \uCD94\uAC00", maxHeight: "80%" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px" } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uACFC\uC81C \uC81C\uBAA9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: title, onChange: setTitle, placeholder: "\uC608) \uC218\uD559 II 5\uB2E8\uC6D0 \uBB38\uC81C\uD480\uC774" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uACFC\uBAA9", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflow: "auto" }, className: "toss-scroll" }, ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559", "\uD55C\uAD6D\uC0AC"].map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => setSubject(s), style: {
    padding: "8px 14px",
    border: "1px solid",
    borderColor: subject === s ? "var(--brand-500)" : "var(--line-strong)",
    background: subject === s ? "var(--brand-50)" : "var(--bg-surface)",
    color: subject === s ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: subject === s ? 700 : 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0
  } }, s)))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC694\uC77C", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 } }, Object.entries(DAYS_KR).map(([d, label]) => /* @__PURE__ */ React.createElement("button", { key: d, onClick: () => setDay(d), style: {
    padding: "10px 4px",
    border: "1px solid",
    borderColor: day === d ? "var(--brand-500)" : "var(--line-strong)",
    background: day === d ? "var(--brand-50)" : "var(--bg-surface)",
    color: day === d ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: day === d ? 700 : 500,
    cursor: "pointer"
  } }, label)))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC608\uC0C1 \uC18C\uC694 \uC2DC\uAC04 (\uBD84)", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(TextInput, { value: est, onChange: setEst, placeholder: "60", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uBD84") })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !title.trim(), onClick: onClose }, "\uCD94\uAC00\uD558\uAE30")));
}
const GOAL_PRESETS = [
  { career: "\uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108", univ: "\uD64D\uC775\uB300\uD559\uAD50", dept: "\uB514\uC9C0\uD138\uCF58\uD150\uCE20\uB514\uC790\uC778\uD559\uACFC", track: "\uC608\uCCB4\uB2A5" },
  { career: "\uC18C\uD504\uD2B8\uC6E8\uC5B4 \uAC1C\uBC1C\uC790", univ: "\uC11C\uC6B8\uB300\uD559\uAD50", dept: "\uCEF4\uD4E8\uD130\uACF5\uD559\uBD80", track: "\uC790\uC5F0" },
  { career: "\uC758\uC0AC", univ: "\uC5F0\uC138\uB300\uD559\uAD50", dept: "\uC758\uC608\uACFC", track: "\uC790\uC5F0" },
  { career: "\uAD50\uC0AC", univ: "\uC11C\uC6B8\uAD50\uC721\uB300\uD559\uAD50", dept: "\uCD08\uB4F1\uAD50\uC721\uACFC", track: "\uC778\uBB38" }
];
function GoalSetting({ go }) {
  const [career, setCareer] = React.useState("");
  const [univ, setUniv] = React.useState("");
  const [dept, setDept] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [step, setStep] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [searching, setSearching] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      setSearching(false);
      return;
    }
    let alive = true;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const r = await window.__apiFetch("/admissions/search?q=" + encodeURIComponent(q), { method: "GET" });
        if (alive) setResults(r.data || { universities: [], departments: [], offeringUniversities: [] });
      } catch (e) {
        if (alive) setResults({ universities: [], departments: [], offeringUniversities: [] });
      } finally {
        if (alive) setSearching(false);
      }
    }, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);
  const save = async () => {
    if (saving || !career.trim()) return;
    setSaving(true);
    const body = {
      career: career.trim(),
      ...univ.trim() ? { univ: univ.trim() } : {},
      ...dept.trim() ? { dept: dept.trim() } : {},
      ...track ? { track } : {},
      ...reason.trim() ? { reason: reason.trim() } : {}
    };
    try {
      await window.__apiFetch("/career/target", { method: "POST", body: JSON.stringify(body) });
      go("career-targets");
    } catch (e) {
      setSaving(false);
      alert(e && e.body && e.body.message || "\uBAA9\uD45C \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uBAA9\uD45C \uC124\uC815", subtitle: `${step}/3 \uB2E8\uACC4`, leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => step > 1 ? setStep((s) => s - 1) : go("profile") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 16 } }, [1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, height: 4, borderRadius: 999, background: i <= step ? "var(--brand-500)" : "var(--line-strong)" } })))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, step === 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 4 }, className: "kr-heading" }, "\uD76C\uB9DD \uC9C1\uC5C5\uC744 \uC815\uD574\uBCFC\uAE4C\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }, className: "kr-heading" }, "\uC544\uB798 \uC608\uC2DC\uC5D0\uC11C \uACE8\uB77C\uB3C4 \uB418\uACE0, \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uAC8C \uC5C6\uC73C\uBA74 \uC9C1\uC811 \uC785\uB825\uD574\uB3C4 \uB3FC\uC694."), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C1\uC5C5 \uC608\uC2DC", subtitle: "\uC785\uB825\uC744 \uB3D5\uB294 \uC608\uC2DC\uC608\uC694", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, GOAL_PRESETS.map((p) => {
    const active = career === p.career;
    return /* @__PURE__ */ React.createElement("button", { key: p.career, onClick: () => {
      setCareer(p.career);
      setUniv(p.univ);
      setDept(p.dept);
      setTrack(p.track || "");
    }, style: {
      textAlign: "left",
      padding: "12px 14px",
      border: "1px solid",
      borderColor: active ? "var(--brand-500)" : "var(--line-subtle)",
      background: active ? "var(--brand-50)" : "var(--bg-surface)",
      borderRadius: 12,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: active ? "var(--brand-600)" : "var(--fg-strong)" } }, p.career), /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm" }, p.track)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, p.univ, " ", p.dept));
  }))), /* @__PURE__ */ React.createElement(FormField, { label: "\uB610\uB294 \uC9C1\uC811 \uC785\uB825", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(TextInput, { value: career, onChange: setCareer, placeholder: "\uC6D0\uD558\uB294 \uC9C1\uC5C5\uC744 \uC785\uB825\uD558\uC138\uC694" })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !career.trim(), onClick: () => setStep(2), trailing: /* @__PURE__ */ React.createElement(IcArrowRight, { size: 16 }) }, "\uB2E4\uC74C")), step === 2 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 4 }, className: "kr-heading" }, "\uBAA9\uD45C \uB300\uD559\xB7\uD559\uACFC\uB294 \uC5B4\uB514\uC778\uAC00\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }, className: "kr-heading" }, career, "\uC640(\uACFC) \uAC00\uAE4C\uC6B4 \uD559\uACFC\uB97C \uCD94\uCC9C\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uB300\uD559", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: univ, onChange: setUniv, placeholder: "\uC608) \uD64D\uC775\uB300\uD559\uAD50", leading: /* @__PURE__ */ React.createElement(IcSchool, { size: 16 }) })), /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uACFC", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(TextInput, { value: dept, onChange: setDept, placeholder: "\uC608) \uB514\uC9C0\uD138\uCF58\uD150\uCE20\uB514\uC790\uC778\uD559\uACFC", leading: /* @__PURE__ */ React.createElement(IcGraduation, { size: 16 }) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uB300\uD559\xB7\uD559\uACFC \uAC80\uC0C9", subtitle: "\uB300\uD559\uBA85 \uB610\uB294 \uD559\uACFC\uBA85\uC73C\uB85C \uCC3E\uC544 \uC120\uD0DD\uD558\uC138\uC694", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(TextInput, { value: query, onChange: setQuery, placeholder: "\uC608) \uD64D\uC775\uB300 \uB610\uB294 \uB514\uC790\uC778", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) }), query.trim() === "" ? /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 4px", fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uB300\uD559\uBA85\uC774\uB098 \uD559\uACFC\uBA85\uC744 \uC785\uB825\uD558\uBA74 \uACB0\uACFC\uAC00 \uC5EC\uAE30\uC5D0 \uB098\uC640\uC694.") : searching ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 44, radius: 10 })) : !results || results.universities.length === 0 && results.departments.length === 0 && (results.offeringUniversities || []).length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 4px", fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, '"', query.trim(), '"\uC5D0 \uB300\uD55C \uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694. \uCCA0\uC790\uB97C \uBC14\uAFD4\uBCF4\uAC70\uB098 \uC9C1\uC811 \uC785\uB825\uD574\uC8FC\uC138\uC694.') : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 10 } }, results.universities.map((u) => /* @__PURE__ */ React.createElement("button", { key: "u" + u.id, onClick: () => {
    setUniv(u.name);
    setQuery("");
  }, style: {
    textAlign: "left",
    padding: "10px 12px",
    border: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, /* @__PURE__ */ React.createElement(IcSchool, { size: 14 }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, u.name), u.region && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, u.region))), (results.offeringUniversities || []).map((o, i) => /* @__PURE__ */ React.createElement("button", { key: "o" + i, onClick: () => {
    setUniv(o.schoolName);
    setDept(o.department);
    if (o.track) setTrack(o.track);
    setQuery("");
  }, style: {
    textAlign: "left",
    padding: "10px 12px",
    border: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, /* @__PURE__ */ React.createElement(IcGraduation, { size: 14 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, o.department), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" }, className: "kr-heading" }, o.schoolName, o.college ? " \xB7 " + o.college : "")), o.track && /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm" }, o.track))), results.departments.map((d) => /* @__PURE__ */ React.createElement("button", { key: "d" + d.id, onClick: () => {
    setDept(d.name);
    setQuery("");
  }, style: {
    textAlign: "left",
    padding: "10px 12px",
    border: "1px solid var(--line-subtle)",
    background: "var(--bg-surface)",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, /* @__PURE__ */ React.createElement(IcGraduation, { size: 14 }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, d.name), d.college && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, d.college))))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !univ.trim() || !dept.trim(), onClick: () => setStep(3), trailing: /* @__PURE__ */ React.createElement(IcArrowRight, { size: 16 }) }, "\uB2E4\uC74C")), step === 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 4 }, className: "kr-heading" }, "\uC65C \uC774 \uBAA9\uD45C\uB97C \uC815\uD588\uB098\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 16 }, className: "kr-heading" }, "\uC120\uD0DD. \uBCF8\uC778\uB9CC \uBCFC \uC218 \uC788\uC5B4\uC694. \uB098\uC911\uC5D0 \uD754\uB4E4\uB9B4 \uB54C \uB2E4\uC2DC \uC77D\uC73C\uBA74 \uB3C4\uC6C0\uC774 \uB3FC\uC694."), /* @__PURE__ */ React.createElement(SectionCard, { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Textarea, { value: reason, onChange: setReason, rows: 5, placeholder: "\uC608) \uC601\uC0C1 \uD3B8\uC9D1\uD560 \uB54C \uAC00\uC7A5 \uBAB0\uC785\uD588\uACE0, \uCE5C\uAD6C\uB4E4\uC774 \uBCF8 \uBC18\uC751\uC774 \uC7AC\uBC0C\uC5C8\uB2E4. \uC774 \uD750\uB984\uC744 \uB354 \uD0A4\uC6CC\uAC00\uACE0 \uC2F6\uB2E4." })), /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { marginBottom: 16, background: "linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--brand-600)", marginBottom: 6 } }, "\uC800\uC7A5 \uD6C4 \uC790\uB3D9\uC73C\uB85C \uC9C4\uD589\uB3FC\uC694"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--fg-default)", lineHeight: 1.7 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("li", null, "\uD574\uB2F9 \uD559\uACFC \uC785\uC2DC \uC815\uBCF4 \uCD94\uC801"), /* @__PURE__ */ React.createElement("li", null, "AI\uAC00 \uACA9\uCC28 \uBD84\uC11D \uB9AC\uD3EC\uD2B8 \uC0DD\uC131"), /* @__PURE__ */ React.createElement("li", null, "\uB2E4\uC74C \uD559\uC2B5 \uACC4\uD68D\uC5D0 \uC6B0\uC120\uC21C\uC704 \uBC18\uC601"))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: saving, onClick: save }, saving ? "\uC800\uC7A5 \uC911\u2026" : "\uBAA9\uD45C \uC800\uC7A5\uD558\uAE30"))));
}
function TeacherAIView() {
  const [tab, setTab] = React.useState("summary");
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
  const name = student.name || "\uD559\uC0DD";
  const signals = (detail == null ? void 0 : detail.signals) || [];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    TeacherTopbar,
    {
      title: !id ? "AI \uC9C4\uB85C \uC0C1\uB2F4" : `${loading ? "\uD559\uC0DD" : name} \uD559\uC0DD \xB7 AI \uC9C4\uB85C \uC0C1\uB2F4`,
      subtitle: "\uD559\uC0DD \uB3D9\uC758 \uD558\uC5D0 \uC5F4\uB78C \uC911 \xB7 \uBAA8\uB4E0 \uC870\uD68C\uB294 \uAC10\uC0AC \uB85C\uADF8\uC5D0 \uAE30\uB85D\uB429\uB2C8\uB2E4"
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 28px 0", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(Tabs, { variant: "underline", items: [
    { id: "summary", label: "\uC694\uC57D" },
    { id: "signals", label: "\uCD94\uCD9C\uB41C \uB2E8\uC11C" },
    { id: "hypothesis", label: "\uC7A0\uC815 \uAC00\uC124" },
    { id: "transcript", label: "\uB300\uD654 \uAE30\uB85D" },
    { id: "recommendations", label: "\uCD94\uCC9C" }
  ], activeId: tab, onChange: setTab })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, !id ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 24 }), title: "\uD559\uC0DD\uC744 \uBA3C\uC800 \uC120\uD0DD\uD574\uC8FC\uC138\uC694", body: "\uD559\uC0DD \uBAA9\uB85D\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uBA74 AI \uC9C4\uB85C \uC0C1\uB2F4 \uB0B4\uC6A9\uC744 \uC5F4\uB78C\uD560 \uC218 \uC788\uC5B4\uC694." })) : loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, height: 120, radius: 16 }))) : error ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 24 }), title: "\uD559\uC0DD \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694", body: "\uB2F4\uB2F9 \uD559\uAE09 \uD559\uC0DD\uB9CC \uC870\uD68C\uD560 \uC218 \uC788\uC5B4\uC694." })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
    padding: 14,
    background: "var(--warning-bg)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--warning)",
    display: "flex",
    gap: 10,
    marginBottom: 16,
    lineHeight: 1.5
  } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC774 \uB370\uC774\uD130\uB294 ", name, " \uD559\uC0DD\uC758 \uC0AC\uC804 \uB3D9\uC758\uC5D0 \uB530\uB77C \uB2F4\uC784 \uAD50\uC0AC\uC5D0\uAC8C\uB9CC \uACF5\uAC1C\uB429\uB2C8\uB2E4. \uC678\uBD80 \uACF5\uC720\xB7\uB2E4\uC6B4\uB85C\uB4DC \uC2DC \uD559\uC0DD\uC5D0\uAC8C \uC790\uB3D9 \uC54C\uB9BC\uC774 \uBC1C\uC1A1\uB3FC\uC694.")), tab === "summary" && /* @__PURE__ */ React.createElement(TAVSummary, null), tab === "signals" && /* @__PURE__ */ React.createElement(TAVSignals, { signals }), tab === "hypothesis" && /* @__PURE__ */ React.createElement(TAVHypothesis, null), tab === "transcript" && /* @__PURE__ */ React.createElement(TAVTranscript, null), tab === "recommendations" && /* @__PURE__ */ React.createElement(TAVRecommendations, null))));
}
function TAVSummary() {
  return /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }),
      title: "AI \uC0C1\uB2F4 \uC694\uC57D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694",
      body: "\uD559\uC0DD\uC758 AI \uC9C4\uB85C \uC0C1\uB2F4 \uC694\uC57D \uB9AC\uD3EC\uD2B8\uB294 \uC544\uC9C1 \uC81C\uACF5\uB418\uC9C0 \uC54A\uC544\uC694. \uCD94\uCD9C\uB41C \uB2E8\uC11C\uB294 \u2018\uCD94\uCD9C\uB41C \uB2E8\uC11C\u2019 \uD0ED\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694."
    }
  ));
}
function TAVSignals({ signals }) {
  const list = signals || [];
  return /* @__PURE__ */ React.createElement(SectionCard, { title: "\uCD94\uCD9C\uB41C \uB2E8\uC11C", subtitle: "\uD559\uC0DD\uC758 AI \uC0C1\uB2F4 \uB300\uD654\uC5D0\uC11C \uCD94\uCD9C\uB41C \uC9C4\uB85C \uB2E8\uC11C" }, list.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }), title: "\uC544\uC9C1 \uCD94\uCD9C\uB41C \uB2E8\uC11C\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC9C4\uD589\uD558\uBA74 \uB2E8\uC11C\uAC00 \uC313\uC5EC\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, list.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, s.tag), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-default)", flex: 1, lineHeight: 1.5 }, className: "kr-heading" }, s.text)))));
}
function TAVHypothesis() {
  return /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 24 }),
      title: "\uC7A0\uC815 \uAC00\uC124\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694",
      body: "\uCDA9\uBD84\uD55C \uC0C1\uB2F4 \uB2E8\uC11C\uAC00 \uC313\uC774\uBA74 AI\uAC00 \uC7A0\uC815\uC801\uC778 \uC9C4\uB85C \uAC00\uC124\uC744 \uC81C\uC2DC\uD574\uC694. \uAC00\uC124\uC740 \uC801\uC131\uAC80\uC0AC\xB7\uD559\uC5C5 \uC131\uCDE8\uB3C4\uC640 \uAD50\uCC28 \uAC80\uC99D\uC774 \uD544\uC694\uD574\uC694."
    }
  ));
}
function TAVTranscript() {
  return /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 24 }),
      title: "\uB300\uD654 \uC804\uBB38\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694",
      body: "\uC0C1\uB2F4 \uC804\uBB38\uC740 \uD559\uC0DD \uB3D9\uC758 \uD6C4 \uC81C\uACF5\uB3FC\uC694. \uD604\uC7AC\uB294 \uCD94\uCD9C\uB41C \uB2E8\uC11C\uB9CC \uC5F4\uB78C\uD560 \uC218 \uC788\uC5B4\uC694."
    }
  ));
}
function TAVRecommendations() {
  return /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcClipboard, { size: 24 }),
      title: "\uCD94\uCC9C\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694",
      body: "AI \uC0C1\uB2F4\uC774 \uCDA9\uBD84\uD788 \uC9C4\uD589\uB418\uBA74 \uCD94\uCC9C \uD559\uACFC\xB7\uD65C\uB3D9\uC774 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694."
    }
  ));
}
function CareerTargets({ go }) {
  const [targets, setTargets] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/career/targets", { method: "GET" });
        setTargets(r.data || []);
      } catch (e) {
        setTargets([]);
      }
    })();
  }, []);
  const current = targets && targets[0] || null;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC9C4\uB85C \uBAA9\uD45C \uAD00\uB9AC", subtitle: "\uCD5C\uB300 3\uAC1C\uC758 \uBAA9\uD45C\uB97C \uBE44\uAD50\uD558\uBA70 \uC900\uBE44\uD560 \uC218 \uC788\uC5B4\uC694", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcPlus, { size: 20 }), onClick: () => go("goal-setting"), ariaLabel: "\uBAA9\uD45C \uCD94\uAC00" }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, targets === null ? /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 80 })) : targets.length === 0 ? /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcTarget, { size: 22 }),
      title: "\uC544\uC9C1 \uC124\uC815\uD55C \uC9C4\uB85C \uBAA9\uD45C\uAC00 \uC5C6\uC5B4\uC694",
      body: "AI \uC0C1\uB2F4\uC73C\uB85C \uAD00\uC2EC \uC9C4\uB85C\uB97C \uCC3E\uAC70\uB098, \uC9C1\uC811 \uBAA9\uD45C\uB97C \uCD94\uAC00\uD574\uBCF4\uC138\uC694. \uBAA9\uD45C\uB294 \uCD5C\uB300 3\uAC1C\uAE4C\uC9C0 \uBE44\uAD50\uD560 \uC218 \uC788\uC5B4\uC694.",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 16 }), onClick: () => go("goal-setting") }, "\uBAA9\uD45C \uCD94\uAC00\uD558\uAE30")
    }
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)", color: "#fff" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff", marginBottom: 10 } }, "\uC8FC \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800 }, className: "kr-heading" }, current.career), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, opacity: 0.85, marginTop: 4 } }, [current.univ, current.dept].filter(Boolean).join(" ")), current.reason && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.18)", fontSize: 13, opacity: 0.92, lineHeight: 1.5 }, className: "kr-heading" }, current.reason)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 10 } }, "\uBAA8\uB4E0 \uBAA9\uD45C (", targets.length, "/3)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 } }, targets.map((t, i) => /* @__PURE__ */ React.createElement(Card, { key: t.id, padding: 16, style: { border: i === 0 ? "2px solid var(--brand-500)" : "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" } }, i === 0 && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, "\uC8FC \uBAA9\uD45C"), t.track && /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, t.track)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, t.career), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, [t.univ, t.dept].filter(Boolean).join(" ")))), t.reason && /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--bg-muted)", borderRadius: 8, fontSize: 12, color: "var(--fg-default)", display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 12, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, t.reason)), t.univ && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", full: true, onClick: () => go("admissions-hub") }, "\uB300\uD559\xB7\uC785\uC2DC \uBCF4\uAE30")))))), /* @__PURE__ */ React.createElement(Card, { padding: 14, style: { background: "var(--info-bg)", boxShadow: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--brand-600)", lineHeight: 1.55 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", null, '"\uD569\uACA9 \uD655\uB960 %"\uB294 \uBCF4\uC5EC\uB4DC\uB9AC\uC9C0 \uC54A\uC544\uC694. \uC9C4\uD559\uC740 \uBCC0\uC218\uAC00 \uB108\uBB34 \uB9CE\uACE0, \uC798\uBABB\uB41C \uC22B\uC790\uB294 \uC798\uBABB\uB41C \uC120\uD0DD\uC73C\uB85C \uC774\uC5B4\uC838\uC694. \uB300\uC2E0 ', /* @__PURE__ */ React.createElement("strong", null, "\uC804\uB7B5 \uC0C1\uD0DC"), "\uC640 ", /* @__PURE__ */ React.createElement("strong", null, "\uCC44\uC6CC\uC57C \uD560 \uACA9\uCC28"), "\uB97C \uC815\uC9C1\uD558\uAC8C \uC548\uB0B4\uB4DC\uB824\uC694.")))));
}
function CompletionStatus({ go }) {
  const isMobile = useViewportMobile();
  const [roster, setRoster] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/teacher/students", { method: "GET" });
        const rows = (r.data || []).map((s) => ({
          id: s.id,
          name: s.name,
          avatar: (s.name || "?").slice(0, 1),
          done: s.studyDone || 0,
          total: s.studyTotal || 0,
          needsCounseling: s.needsCounseling,
          lastActive: s.lastActivityAt ? new Date(s.lastActivityAt).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) : "\uC5C6\uC74C"
        })).sort((a, b) => (b.total ? b.done / b.total : 0) - (a.total ? a.done / a.total : 0));
        setRoster(rows);
      } catch (e) {
        setRoster([]);
      }
    })();
  }, []);
  const students = roster || [];
  const withTasks = students.filter((s) => s.total > 0);
  const classAvg = withTasks.length ? Math.round(withTasks.reduce((a, s) => a + s.done / s.total, 0) / withTasks.length * 100) : 0;
  const completed = withTasks.filter((s) => s.done === s.total).length;
  const risk = students.filter((s) => s.total === 0 || s.done / s.total < 0.4).length;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    TeacherTopbar,
    {
      title: "\uD559\uC0DD \uD559\uC2B5 \uC644\uB8CC \uD604\uD669",
      subtitle: "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uACC4\uD68D \uC9C4\uD589\uB960 \xB7 \uC2E4\uC2DC\uAC04 \uC5C5\uB370\uC774\uD2B8",
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => downloadCSV("\uD559\uC2B5\uC644\uB8CC\uD604\uD669", ["\uC774\uB984", "\uC644\uB8CC", "\uC804\uCCB4", "\uC644\uB8CC\uC728", "\uB9C8\uC9C0\uB9C9\uD65C\uB3D9"], students.map((s) => [s.name, s.done, s.total, `${s.total ? Math.round(s.done / s.total * 100) : 0}%`, s.lastActive])) }, "CSV \uB0B4\uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), onClick: () => exportReportPDF("\uD559\uC2B5 \uC644\uB8CC \uD604\uD669", ["\uC774\uB984", "\uC644\uB8CC", "\uC644\uB8CC\uC728", "\uB9C8\uC9C0\uB9C9 \uD65C\uB3D9"], students.map((s) => [s.name, `${s.done}/${s.total}`, `${s.total ? Math.round(s.done / s.total * 100) : 0}%`, s.lastActive]), { "\uD559\uAE09": "2-3" }) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30"))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: isMobile ? 14 : 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? 10 : 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD559\uAE09 \uD3C9\uADE0 \uC644\uB8CC\uC728", value: `${classAvg}%`, delta: "+8 \uC9C0\uB09C\uC8FC", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcCheck, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "100% \uC644\uB8CC", value: `${completed}\uBA85`, delta: "\uC798\uD558\uB294 \uD559\uC0DD", deltaTone: "success", icon: /* @__PURE__ */ React.createElement(IcStar, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC9C4\uD589 \uC911", value: `${students.length - completed - risk}\uBA85`, delta: "\uC815\uC0C1 \uD398\uC774\uC2A4", deltaTone: "info", icon: /* @__PURE__ */ React.createElement(IcZap, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC8FC\uC758 \uD544\uC694", value: `${risk}\uBA85`, delta: "40% \uBBF8\uB9CC", deltaTone: "danger", icon: /* @__PURE__ */ React.createElement(IcAlert, { size: 16 }) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD559\uC0DD\uBCC4 \uC9C4\uD589\uB960", subtitle: "\uC644\uB8CC\uC728 \uB192\uC740 \uC21C" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, students.map((s, i, arr) => {
    const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
    const tone = s.total === 0 ? "neutral" : pct >= 80 ? "success" : pct >= 40 ? "info" : "danger";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.id,
        onClick: () => {
          window.__selectedStudentId = s.id;
          go && go("student-detail");
        },
        style: {
          display: "grid",
          gridTemplateColumns: "180px 1fr 100px 100px 32px",
          alignItems: "center",
          gap: 16,
          padding: "14px 4px",
          borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none",
          cursor: "pointer",
          transition: "background 120ms"
        },
        onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg-muted)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: s.avatar, size: 32 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, "\uB9C8\uC9C0\uB9C9 \uD65C\uB3D9 ", s.lastActive))),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(ProgressBar, { value: s.done, max: s.total, height: 6, color: `var(--${tone === "info" ? "brand-500" : tone})` })), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)", minWidth: 36, textAlign: "right" } }, s.done, "/", s.total)),
      /* @__PURE__ */ React.createElement(Chip, { tone, size: "sm" }, pct, "%"),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11 } }, s.needsCounseling ? /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC0C1\uB2F4 \uD544\uC694") : /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)" } }, "\u2014")),
      /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16, color: "var(--fg-subtle)" })
    );
  }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD559\uAE09 \uC694\uC57D", style: { marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: "var(--fg-default)" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, "\uD559\uC2B5 \uACC4\uD68D \uB4F1\uB85D \uD559\uC0DD"), " ", /* @__PURE__ */ React.createElement("b", { className: "num" }, withTasks.length), "\uBA85"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, "\uC544\uC9C1 \uBBF8\uB4F1\uB85D"), " ", /* @__PURE__ */ React.createElement("b", { className: "num" }, students.length - withTasks.length), "\uBA85"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, "\uC0C1\uB2F4 \uD544\uC694"), " ", /* @__PURE__ */ React.createElement("b", { className: "num" }, students.filter((s) => s.needsCounseling).length), "\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 10, lineHeight: 1.5 }, className: "kr-heading" }, "\uC694\uC77C\uBCC4\xB7\uACFC\uBAA9\uBCC4 \uC0C1\uC138 \uD328\uD134\uC740 \uD559\uC0DD\uB4E4\uC774 \uD559\uC2B5 \uACC4\uD68D\uC744 \uB354 \uC785\uB825\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uC9D1\uACC4\uB3FC\uC694. \uD604\uC7AC\uB294 \uD559\uC0DD\uC774 \uC9C1\uC811 \uC785\uB825\uD55C \uC8FC\uAC04 \uD559\uC2B5 \uD56D\uBAA9\uC758 \uC644\uB8CC\uC728\uC744 \uAE30\uC900\uC73C\uB85C \uBCF4\uC5EC\uB4DC\uB9BD\uB2C8\uB2E4."))));
}
const AI_CHAT_RAG_INITIAL = [
  { role: "ai", text: "\uC548\uB155\uD558\uC138\uC694! \uC9C4\uB85C\uB098\uCE68\uBC18 AI\uC608\uC694. \uC9C4\uB85C, \uD559\uC2B5, \uC785\uC2DC, \uD559\uACFC \uC815\uBCF4 \uB4F1 \uBB34\uC5C7\uC774\uB4E0 \uBB3C\uC5B4\uBD10\uC8FC\uC138\uC694. \uACF5\uACF5\uB370\uC774\uD130(\uCEE4\uB9AC\uC5B4\uB137\xB7\uB300\uD559\uC54C\uB9AC\uBBF8)\uB97C \uADFC\uAC70\uB85C \uB2F5\uD574\uB4DC\uB9B4\uAC8C\uC694. \uB2E4\uB9CC \uD070 \uACB0\uC815\uC740 \uAF2D \uC120\uC0DD\uB2D8\uACFC \uD568\uAED8 \uC815\uD558\uC138\uC694." }
];
const RAG_SUGGEST = [
  "\uC601\uC0C1 \uD3B8\uC9D1\uC5D0 \uAD00\uC2EC\uC774 \uC788\uB294\uB370 \uC5B4\uB5A4 \uC9C1\uC5C5\uC774 \uC788\uC744\uAE4C?",
  "\uAD6D\uC5B4 \uBE44\uBB38\uD559 \uC810\uC218 \uC62C\uB9AC\uB294 \uBC29\uBC95\uC740?",
  "\uCEF4\uD4E8\uD130\uACF5\uD559\uACFC\uB294 \uC5B4\uB5A4 \uB300\uD559\uC5D0 \uC788\uC5B4?",
  "\uBD09\uC0AC\uD65C\uB3D9\uC740 \uC785\uC2DC\uC5D0 \uC5B4\uB5BB\uAC8C \uBC18\uC601\uB3FC?"
];
const COACH_INITIAL = [
  { role: "ai", text: "\uC548\uB155\uD558\uC138\uC694 \uC120\uC0DD\uB2D8! \uD559\uC0DD \uC9C4\uB85C\xB7\uC9C4\uD559 \uC0C1\uB2F4\uC744 \uB3D5\uB294 AI \uCF54\uCE58\uC608\uC694. \uC5B4\uB5A4 \uD559\uC0DD\uC744 \uC5B4\uB5BB\uAC8C \uC0C1\uB2F4\uD560\uC9C0, \uC5B4\uB5A4 \uD559\uACFC\xB7\uC9C1\uC5C5\xB7\uB300\uD559\uC744 \uC548\uB0B4\uD560\uC9C0 \uBB3C\uC5B4\uBD10\uC8FC\uC138\uC694. \uCEE4\uB9AC\uC5B4\uB137\xB7\uB300\uD559\uC54C\uB9AC\uBBF8 \uB4F1 \uACF5\uACF5\uB370\uC774\uD130\uB97C \uADFC\uAC70\uB85C \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694." }
];
const COACH_SUGGEST = [
  "\uC0DD\uBA85\uACFC\uD559\uC5D0 \uAD00\uC2EC\uC788\uB294 \uD559\uC0DD, \uC5B4\uB5A4 \uC9C8\uBB38\uC73C\uB85C \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD560\uAE4C\uC694?",
  "\uB0B4\uC2E0 3\uB4F1\uAE09\uB300 \uD559\uC0DD\uC5D0\uAC8C \uCD94\uCC9C\uD560 \uB9CC\uD55C \uACF5\uD559 \uACC4\uC5F4 \uD559\uACFC\uB294?",
  "\uC9C4\uB85C\uB97C \uBABB \uC815\uD55C \uACE02 \uD559\uC0DD \uC0C1\uB2F4\uC740 \uC5B4\uB5A4 \uC21C\uC11C\uB85C \uC9C4\uD589\uD558\uBA74 \uC88B\uC744\uAE4C\uC694?",
  "\uBD09\uC0AC\uD65C\uB3D9\uC744 \uD559\uC0DD\uBD80\uC5D0 \uC798 \uB179\uC774\uB824\uBA74 \uC5B4\uB5BB\uAC8C \uC548\uB0B4\uD560\uAE4C\uC694?"
];
function AIChatRAG({ go, coach = false }) {
  const [msgs, setMsgs] = React.useState(coach ? COACH_INITIAL : AI_CHAT_RAG_INITIAL);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const scrollRef = React.useRef(null);
  const [sessions, setSessions] = React.useState([]);
  const [showPicker, setShowPicker] = React.useState(false);
  const [roster, setRoster] = React.useState([]);
  const isMobile = useViewportMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);
  const refreshSessions = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/ai-counseling/sessions?status=all", { method: "GET" });
      const list = r && r.data || [];
      setSessions(list);
      return list;
    } catch (e) {
      return [];
    }
  }, []);
  const refreshRoster = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/teacher/students", { method: "GET" });
      setRoster(r && r.data || []);
    } catch (e) {
      setRoster([]);
    }
  }, []);
  React.useEffect(() => {
    if (!window.__isLoggedIn || !window.__isLoggedIn()) return;
    (async () => {
      if (coach) {
        const list = await refreshSessions();
        refreshRoster();
        const first = list.find((s) => s.status === "active") || list[0];
        if (first) setSessionId(first.id);
      } else {
        try {
          const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" });
          const sid = active && active.data && active.data.id || (await window.__apiFetch("/ai-counseling/sessions", { method: "POST" })).data.id;
          setSessionId(sid);
        } catch (e) {
        }
      }
    })();
  }, [coach, refreshSessions, refreshRoster]);
  React.useEffect(() => {
    if (!coach || !sessionId) return;
    (async () => {
      try {
        const t = await window.__apiFetch("/ai-counseling/sessions/" + sessionId + "/transcript", { method: "GET" });
        const loaded = (t && t.data && t.data.messages || []).map((m) => ({ role: m.role, text: m.text }));
        setMsgs(loaded.length ? loaded : COACH_INITIAL);
      } catch (e) {
        setMsgs(COACH_INITIAL);
      }
    })();
  }, [coach, sessionId]);
  const createSessionForStudent = async (st) => {
    try {
      const r = await window.__apiFetch("/ai-counseling/sessions", {
        method: "POST",
        body: JSON.stringify({ subjectStudentId: st.id, title: `${st.name} \uCF54\uCE6D` })
      });
      const sid = r && r.data && r.data.id;
      if (sid) {
        setSessionId(sid);
        refreshSessions();
      }
      setShowPicker(false);
      if (isMobile) setSidebarOpen(false);
    } catch (e) {
      alert(e && e.body && e.body.message || "\uC138\uC158 \uC0DD\uC131 \uC2E4\uD328");
    }
  };
  const createFreeSession = async () => {
    try {
      const r = await window.__apiFetch("/ai-counseling/sessions", {
        method: "POST",
        body: JSON.stringify({ title: "\uC790\uC720 \uB300\uD654" })
      });
      const sid = r && r.data && r.data.id;
      if (sid) {
        setSessionId(sid);
        refreshSessions();
      }
      setShowPicker(false);
      if (isMobile) setSidebarOpen(false);
    } catch (e) {
      alert("\uC138\uC158 \uC0DD\uC131 \uC2E4\uD328");
    }
  };
  const deleteSession = async (sid) => {
    if (!confirm("\uC774 \uB300\uD654\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694? \uBA54\uC2DC\uC9C0\uC640 \uB9AC\uD3EC\uD2B8\uAC00 \uD568\uAED8 \uC0AD\uC81C\uB3FC\uC694.")) return;
    try {
      await window.__apiFetch("/ai-counseling/sessions/" + sid + "/delete", { method: "POST" });
      const list = await refreshSessions();
      if (sessionId === sid) setSessionId(list[0] ? list[0].id : null);
    } catch (e) {
      alert("\uC0AD\uC81C \uC2E4\uD328");
    }
  };
  const renameSession = async (sid, currentTitle) => {
    const title = prompt("\uB300\uD654 \uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694", currentTitle || "");
    if (title === null) return;
    try {
      await window.__apiFetch("/ai-counseling/sessions/" + sid + "/patch", {
        method: "POST",
        body: JSON.stringify({ title })
      });
      refreshSessions();
    } catch (e) {
      alert("\uBCC0\uACBD \uC2E4\uD328");
    }
  };
  const exportReport = async (sid) => {
    try {
      const r = await window.__apiFetch("/ai-counseling/sessions/" + sid + "/report", { method: "POST" });
      const reportId = r && r.data && r.data.reportId;
      if (reportId) {
        if (typeof window.showToast === "function") window.showToast("\uB9AC\uD3EC\uD2B8\uB97C \uB9CC\uB4E4\uACE0 \uC788\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uC54C\uB9BC\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.", "success");
      }
    } catch (e) {
      alert(e && e.body && e.body.message || "\uB9AC\uD3EC\uD2B8 \uC0DD\uC131\uC5D0 \uB2E8\uC11C\uAC00 \uBD80\uC871\uD558\uAC70\uB098 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.");
    }
  };
  const send = async (text) => {
    if (!text.trim() || thinking) return;
    if (!window.__isLoggedIn || !window.__isLoggedIn()) {
      setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: "\uB85C\uADF8\uC778\uD558\uBA74 AI\uC5D0\uAC8C \uBB3C\uC5B4\uBCFC \uC218 \uC788\uC5B4\uC694." }]);
      setInput("");
      return;
    }
    let sid = sessionId;
    if (!sid) {
      try {
        if (coach) {
          const r = await window.__apiFetch("/ai-counseling/sessions", { method: "POST", body: JSON.stringify({ title: "\uC790\uC720 \uB300\uD654" }) });
          sid = r.data.id;
        } else {
          const active = await window.__apiFetch("/ai-counseling/sessions/active", { method: "GET" });
          sid = active && active.data && active.data.id || (await window.__apiFetch("/ai-counseling/sessions", { method: "POST" })).data.id;
        }
        setSessionId(sid);
      } catch (e) {
        setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: "\uC0C1\uB2F4\uC744 \uC2DC\uC791\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694." }]);
        setInput("");
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
      const aiText = res && res.data && res.data.message && res.data.message.text || "\uC751\uB2F5\uC744 \uBC1B\uC9C0 \uBABB\uD588\uC5B4\uC694.";
      setMsgs((m) => [...m, { role: "ai", text: aiText }]);
    } catch (e) {
      const msg = e && e.body && (e.body.message || e.body.error && e.body.error.message) || "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.";
      setMsgs((m) => [...m, { role: "ai", text: msg }]);
    } finally {
      setThinking(false);
    }
  };
  if (coach) {
    const currentSession = sessions.find((s) => s.id === sessionId);
    const isEmpty = msgs.length <= 1;
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go && go("dashboard") }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, currentSession ? currentSession.title || currentSession.subjectStudentName || "AI \uC0C1\uB2F4 \uCF54\uCE6D" : "AI \uC0C1\uB2F4 \uCF54\uCE6D"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, currentSession && currentSession.subjectStudentName ? "\uD559\uC0DD \uC131\uC801\xB7\uB2E8\uC11C\xB7\uC9C4\uB85C\uBAA9\uD45C \uC790\uB3D9 \uC8FC\uC785" : "\uAD50\uC0AC\uC6A9 \xB7 \uACF5\uACF5\uB370\uC774\uD130 \uADFC\uAC70")), sessionId && currentSession && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcMore, { size: 18 }), onClick: () => renameSession(sessionId, currentSession.title), ariaLabel: "\uB300\uD654 \uC774\uB984 \uBCC0\uACBD" }), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcTrash, { size: 18 }), onClick: () => deleteSession(sessionId), ariaLabel: "\uB300\uD654 \uC0AD\uC81C" }), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 18 }), ariaLabel: "\uC774 \uB300\uD654 \uB9AC\uD3EC\uD2B8 \uC0DD\uC131", onClick: () => exportReport(sessionId) }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPicker(true), style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      flexShrink: 0,
      padding: "7px 10px",
      borderRadius: 999,
      border: "1px dashed var(--brand-500)",
      background: "var(--brand-50)",
      color: "var(--brand-600)",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement(IcPlus, { size: 12 }), " \uC0C8 \uB300\uD654"), /* @__PURE__ */ React.createElement("button", { onClick: createFreeSession, style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      flexShrink: 0,
      padding: "7px 10px",
      borderRadius: 999,
      border: "1px solid var(--line)",
      background: "var(--bg-muted)",
      color: "var(--fg-muted)",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer"
    }, title: "\uD559\uC0DD \uBB34\uAD00\uD55C \uC790\uC720 \uC9C8\uBB38" }, /* @__PURE__ */ React.createElement(IcMessage, { size: 12 }), " \uC790\uC720"), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 20, background: "var(--line)", flexShrink: 0, margin: "0 2px" } }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { display: "flex", gap: 6, overflowX: "auto", overflowY: "hidden", flex: 1, paddingBottom: 2 } }, sessions.length === 0 ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", alignSelf: "center", whiteSpace: "nowrap" }, className: "kr-heading" }, "\uD559\uC0DD\uC744 \uC120\uD0DD\uD574 \uCCAB \uB300\uD654\uB97C \uC2DC\uC791\uD558\uC138\uC694 \u2192") : sessions.map((s) => {
      const isActive = s.id === sessionId;
      const label = s.subjectStudentName || s.title || "\uC790\uC720 \uB300\uD654";
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: s.id,
          onClick: () => setSessionId(s.id),
          style: {
            padding: "7px 12px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            background: isActive ? "var(--brand-500)" : "var(--bg-muted)",
            color: isActive ? "#fff" : "var(--fg-default)",
            fontSize: 12,
            fontWeight: isActive ? 700 : 600,
            whiteSpace: "nowrap"
          },
          className: "kr-heading"
        },
        s.subjectStudentName && "\u{1F464} ",
        label,
        s.status === "ended" ? " \xB7 \uC885\uB8CC" : ""
      );
    }))), /* @__PURE__ */ React.createElement("main", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "toss-scroll", style: { flex: 1, padding: "12px 14px 8px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 10 } }, msgs.map((m, i) => /* @__PURE__ */ React.createElement(RagBubble, { key: i, msg: m })), thinking && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", background: "var(--bg-surface)", borderRadius: "4px 14px 14px 14px", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uB2F5\uBCC0\uC744 \uB9CC\uB4E4\uACE0 \uC788\uC5B4\uC694\u2026"))), isEmpty && !thinking && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 4px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 } }, "\uC774\uB7F0 \uAC78 \uBB3C\uC5B4\uBCF4\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, COACH_SUGGEST.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => send(s), style: {
      textAlign: "left",
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid var(--line)",
      background: "var(--bg-surface)",
      color: "var(--fg-default)",
      fontSize: 13,
      lineHeight: 1.5,
      cursor: "pointer"
    }, className: "kr-heading" }, s))))), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, borderTop: "1px solid var(--line-subtle)", background: "var(--bg-surface)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-end", background: "var(--bg-muted)", borderRadius: 18, padding: "8px 8px 8px 14px" } }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: input,
        onChange: (e) => setInput(e.target.value),
        rows: 1,
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
          }
        },
        placeholder: currentSession && currentSession.subjectStudentName ? `${currentSession.subjectStudentName} \uD559\uC0DD\uC5D0 \uB300\uD574 \uBB3C\uC5B4\uBCF4\uC138\uC694` : "\uD559\uC0DD \uC9C0\uB3C4\uC5D0 \uB300\uD574 \uBB3C\uC5B4\uBCF4\uC138\uC694",
        style: { flex: 1, border: "none", background: "transparent", outline: "none", resize: "none", fontSize: 14, fontFamily: "inherit", lineHeight: 1.5, color: "var(--fg-strong)", maxHeight: 100, paddingTop: 6 }
      }
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => send(input), disabled: !input.trim() || thinking, style: { width: 36, height: 36, borderRadius: "50%", border: "none", background: input.trim() && !thinking ? "var(--brand-500)" : "var(--line-strong)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !thinking ? "pointer" : "not-allowed", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 }))))), showPicker && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setShowPicker(false), style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { role: "dialog", "aria-modal": "true", style: { position: "relative", width: "min(420px, 100%)", maxHeight: "85%", background: "var(--bg-elevated)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-pop)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", borderBottom: "1px solid var(--line-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, "\uD559\uC0DD \uC120\uD0DD"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 18 }), onClick: () => setShowPicker(false), ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflowY: "auto", padding: 6 } }, roster.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, fontSize: 13, color: "var(--fg-muted)", textAlign: "center" } }, "\uB4F1\uB85D\uB41C \uD559\uAE09 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694. \uD559\uC0DD \uAD00\uB9AC\uC5D0\uC11C \uCD08\uB300\uCF54\uB4DC\uB97C \uACF5\uC720\uD574\uBCF4\uC138\uC694.") : roster.map((st) => /* @__PURE__ */ React.createElement("button", { key: st.id, onClick: () => createSessionForStudent(st), style: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderRadius: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (st.name || "?").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, st.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, st.grade || "\uD559\uB144 \uBBF8\uC815", " \xB7 AI \uC9C4\uD589\uB3C4 ", st.aiProgress || 0, "%")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" })))))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go && go("dashboard") }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, coach ? "AI \uC0C1\uB2F4 \uCF54\uCE6D" : "AI \uB3C4\uC6C0\uB9D0"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, coach ? "\uAD50\uC0AC\uC6A9 \xB7 \uACF5\uACF5\uB370\uC774\uD130 \uADFC\uAC70" : "RAG \xB7 \uACF5\uC2DD \uC790\uB8CC \uAE30\uBC18")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcDownload, { size: 20 }), ariaLabel: "\uB300\uD654 PDF \uC800\uC7A5", onClick: () => exportReportPDF("AI \uB3C4\uC6C0\uB9D0 \uB300\uD654", ["\uAD6C\uBD84", "\uB0B4\uC6A9"], msgs.map((m) => [m.role === "user" ? "\uD559\uC0DD" : "AI", m.text + (m.sources ? "\n[\uCD9C\uCC98] " + m.sources.map((s) => s.title).join(", ") : "")]), { "\uC720\uD615": "RAG \uB3C4\uC6C0\uB9D0" }) }))), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "toss-scroll", style: { flex: 1, padding: "12px 14px 8px", overflow: "auto", display: "flex", flexDirection: "column", gap: 10 } }, msgs.map((m, i) => /* @__PURE__ */ React.createElement(RagBubble, { key: i, msg: m })), thinking && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", background: "var(--bg-surface)", borderRadius: "4px 14px 14px 14px", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(IcSearch, { size: 14, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uAD00\uB828 \uC790\uB8CC\uB97C \uCC3E\uACE0 \uC788\uC5B4\uC694..."))), msgs.length === 1 && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 } }, "\uC774\uB7F0 \uAC78 \uBB3C\uC5B4\uBCF4\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, (coach ? COACH_SUGGEST : RAG_SUGGEST).map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => send(s), style: {
    textAlign: "left",
    padding: "12px 14px",
    background: "var(--bg-surface)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    fontSize: 13,
    color: "var(--fg-default)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8
  }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 14, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, s), /* @__PURE__ */ React.createElement(IcArrowRight, { size: 14, color: "var(--fg-subtle)" })))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", background: "var(--bg-muted)", borderRadius: 24, padding: "6px 6px 6px 16px" } }, /* @__PURE__ */ React.createElement("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter") send(input);
  }, placeholder: "\uBB34\uC5C7\uC774\uB4E0 \uBB3C\uC5B4\uBCF4\uC138\uC694", style: { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, minWidth: 0 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => send(input), disabled: !input.trim(), style: {
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
  } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", textAlign: "center", marginTop: 6 }, className: "kr-heading" }, "AI \uC751\uB2F5\uC740 \uCC38\uACE0\uC6A9\uC774\uC5D0\uC694. \uC785\uC2DC \uACB0\uC815\uC740 \uD559\uAD50\xB7\uC785\uD559\uCC98 \uACF5\uC2DD \uC790\uB8CC\uB97C \uD655\uC778\uD574\uC8FC\uC138\uC694.")));
}
function RagBubble({ msg }) {
  const isUser = msg.role === "user";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 6 } }, !isUser && /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "88%" } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 14px",
    background: isUser ? "var(--brand-500)" : "var(--bg-surface)",
    color: isUser ? "#fff" : "var(--fg-strong)",
    borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
    fontSize: 14,
    lineHeight: 1.55,
    boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
    whiteSpace: isUser ? "pre-line" : "normal"
  }, className: "kr-heading" }, isUser ? msg.text : typeof FormattedText === "function" ? /* @__PURE__ */ React.createElement(FormattedText, { text: msg.text }) : msg.text), msg.sources && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 10 }), " \uCD9C\uCC98 ", msg.sources.length, "\uAC74"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, msg.sources.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10, border: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)", flex: 1 }, className: "kr-heading" }, s.title), /* @__PURE__ */ React.createElement(Chip, { tone: s.confidence === "confirmed" ? "success" : "warning", size: "sm", style: { height: 16, padding: "0 5px", fontSize: 9 } }, s.confidence === "confirmed" ? "\uD655\uC815" : "\uCD94\uC815")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace" } }, s.url), /* @__PURE__ */ React.createElement("span", { className: "num" }, "\uAC31\uC2E0 ", s.updated))))))));
}
Object.assign(window, {
  ConsentManagement,
  StudyPlanFull,
  GoalSetting,
  TeacherAIView,
  CareerTargets,
  CompletionStatus,
  AIChatRAG
});
