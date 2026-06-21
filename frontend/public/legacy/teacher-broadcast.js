const _bcListeners = /* @__PURE__ */ new Set();
function _bcEmit() {
  _bcListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
    }
  });
}
window.__TEACHER_BROADCASTS = window.__TEACHER_BROADCASTS || [];
function teacherBroadcastStore() {
  return window.__TEACHER_BROADCASTS;
}
function addTeacherBroadcast(bc) {
  const full = { id: "bc_" + Date.now(), createdAt: "\uBC29\uAE08", ...bc };
  window.__TEACHER_BROADCASTS = [full, ...window.__TEACHER_BROADCASTS];
  _bcEmit();
  return full;
}
function broadcastsForStudent(studentId = "s1") {
  return teacherBroadcastStore().filter((b) => b.targets.includes("all") || b.targets.includes(studentId));
}
function useBroadcasts() {
  const [, setN] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setN((n) => n + 1);
    _bcListeners.add(fn);
    return () => _bcListeners.delete(fn);
  }, []);
  return teacherBroadcastStore();
}
const BC_CATEGORIES = [
  { id: "mock-exam", label: "\uBAA8\uC758\uACE0\uC0AC", tone: "brand", icon: /* @__PURE__ */ React.createElement(IcChart, null) },
  { id: "exam", label: "\uC911\uAC04/\uAE30\uB9D0", tone: "warning", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
  { id: "performance", label: "\uC218\uD589\uD3C9\uAC00", tone: "purple", icon: /* @__PURE__ */ React.createElement(IcDoc, null) },
  { id: "admission", label: "\uC785\uC2DC\xB7\uC218\uC2DC", tone: "danger", icon: /* @__PURE__ */ React.createElement(IcGraduation, null) },
  { id: "certificate", label: "\uC790\uACA9\uC99D \uC2DC\uD5D8", tone: "mint", icon: /* @__PURE__ */ React.createElement(IcStar, null) },
  { id: "counseling", label: "\uC0C1\uB2F4", tone: "info", icon: /* @__PURE__ */ React.createElement(IcMessage, null) },
  { id: "admin", label: "\uD589\uC815\xB7\uAE30\uD0C0", tone: "neutral", icon: /* @__PURE__ */ React.createElement(IcInfo, null) }
];
const bcCat = (id) => BC_CATEGORIES.find((c) => c.id === id) || BC_CATEGORIES[BC_CATEGORIES.length - 1];
function bcCatChip(id) {
  const c = bcCat(id);
  return /* @__PURE__ */ React.createElement(Chip, { tone: c.tone, size: "sm" }, c.label);
}
function bcRoster() {
  if (typeof TEACHER_STUDENTS !== "undefined") return TEACHER_STUDENTS;
  return typeof window !== "undefined" && Array.isArray(window.__teacherRoster) ? window.__teacherRoster : [];
}
function mergeBroadcasts(baseEvents, studentId) {
  const out = {};
  Object.keys(baseEvents || {}).forEach((k) => {
    out[k] = [...baseEvents[k]];
  });
  try {
    broadcastsForStudent(studentId).forEach((b) => {
      if (!b.date) return;
      const ev = { type: b.category === "counseling" ? "counseling-confirmed" : b.category === "mock-exam" ? "mock-exam" : b.category === "exam" || b.category === "performance" ? "performance-due" : "memo", title: b.title, time: b.time, fromTeacher: true, body: b.body, bcId: b.id };
      out[b.date] = [...out[b.date] || [], ev];
    });
  } catch (e) {
  }
  return out;
}
Object.assign(window, {
  teacherBroadcastStore,
  addTeacherBroadcast,
  broadcastsForStudent,
  useBroadcasts,
  mergeBroadcasts,
  BC_CATEGORIES,
  bcCat,
  bcCatChip,
  bcRoster,
  toneBg,
  toneFg
});
function toneBg(t) {
  return `var(--${t === "brand" ? "brand-50" : t === "purple" ? "accent-purple-bg" : t === "success" ? "success-bg" : t === "warning" ? "warning-bg" : t === "info" ? "info-bg" : t === "mint" ? "accent-mint-bg" : t === "danger" ? "danger-bg" : "neutral-bg"})`;
}
function toneFg(t) {
  return `var(--${t === "brand" ? "brand-600" : t === "purple" ? "accent-purple" : t === "success" ? "success" : t === "warning" ? "warning" : t === "info" ? "info" : t === "mint" ? "accent-mint" : t === "danger" ? "danger" : "neutral-fg"})`;
}
function BroadcastComposeDialog({ open, onClose, presetCategory }) {
  const roster = bcRoster();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [date, setDate] = React.useState("2026-06-15");
  const [time, setTime] = React.useState("09:00");
  const [category, setCategory] = React.useState(presetCategory || "mock-exam");
  const [targets, setTargets] = React.useState(["all"]);
  const trapRef = useFocusTrap(open, onClose);
  React.useEffect(() => {
    if (open) {
      setTitle("");
      setBody("");
      setTargets(["all"]);
      setCategory(presetCategory || "mock-exam");
    }
  }, [open, presetCategory]);
  if (!open) return null;
  const allSelected = targets.includes("all");
  const toggleAll = () => setTargets(allSelected ? [] : ["all"]);
  const toggleOne = (id) => {
    setTargets((prev) => {
      const base = prev.filter((t) => t !== "all");
      return base.includes(id) ? base.filter((t) => t !== id) : [...base, id];
    });
  };
  const selectedCount = allSelected ? roster.length : targets.length;
  const canSend = title.trim() && body.trim() && selectedCount > 0;
  const submit = () => {
    addTeacherBroadcast({ title: title.trim(), body: body.trim(), date, time, category, targets: allSelected ? ["all"] : [...targets] });
    showToast(`${selectedCount}\uBA85\uC5D0\uAC8C "${title.trim()}"\uC744(\uB97C) \uBCF4\uB0C8\uC5B4\uC694`, "success");
    onClose();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uD559\uC0DD\uC5D0\uAC8C \uC77C\uC815\xB7\uBA54\uBAA8 \uBCF4\uB0B4\uAE30", style: {
    position: "relative",
    width: "min(540px, 100%)",
    maxHeight: "92%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-pop)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, "\uD559\uC0DD\uC5D0\uAC8C \uC77C\uC815\xB7\uBA54\uBAA8 \uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, "\uC120\uD0DD\uD55C \uD559\uC0DD\uC758 \uCE98\uB9B0\uB354\xB7\uBA54\uC2DC\uC9C0\uC5D0 \uB3D9\uAE30\uD654\uB3FC\uC694")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBD84\uB958", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, BC_CATEGORIES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => setCategory(c.id), style: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid",
    borderColor: category === c.id ? toneFg(c.tone) : "var(--line-strong)",
    background: category === c.id ? toneBg(c.tone) : "var(--bg-surface)",
    color: category === c.id ? toneFg(c.tone) : "var(--fg-muted)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer"
  } }, React.cloneElement(c.icon, { size: 12 }), c.label)))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC81C\uBAA9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: title, onChange: setTitle, placeholder: "\uC608) 6\uC6D4 \uBAA8\uC758\uACE0\uC0AC, \uC815\uBCF4\uCC98\uB9AC\uAE30\uB2A5\uC0AC \uD544\uAE30", autoFocus: true })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uB0A0\uC9DC", style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement(CalSelect, { value: date, onChange: setDate, options: DATE_OPTIONS, render: (d) => `${d.slice(5, 7)}\uC6D4 ${d.slice(8, 10)}\uC77C` })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uAC04", style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement(CalSelect, { value: time, onChange: setTime, options: TIME_OPTIONS }))), /* @__PURE__ */ React.createElement(FormField, { label: "\uB0B4\uC6A9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 4, placeholder: "\uD559\uC0DD\uC774 \uBC1B\uC544\uBCFC \uC548\uB0B4 \uB0B4\uC6A9\uC744 \uC801\uC5B4\uC8FC\uC138\uC694. \uC900\uBE44\uBB3C\xB7\uBC94\uC704\xB7\uC7A5\uC18C \uB4F1." })), /* @__PURE__ */ React.createElement(FormField, { label: `\uBC1B\uB294 \uD559\uC0DD (${selectedCount}\uBA85)`, required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("button", { onClick: toggleAll, style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: 12,
    cursor: "pointer",
    marginBottom: 8,
    border: "1px solid",
    borderColor: allSelected ? "var(--brand-500)" : "var(--line-strong)",
    background: allSelected ? "var(--brand-50)" : "var(--bg-surface)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: allSelected ? "none" : "2px solid var(--line-strong)", background: allSelected ? "var(--brand-500)" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } }, allSelected && /* @__PURE__ */ React.createElement(IcCheck, { size: 13 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC6B0\uB9AC \uBC18 \uC804\uCCB4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, roster.length, "\uBA85 \uBAA8\uB450\uC5D0\uAC8C \uBCF4\uB0B4\uAE30")), /* @__PURE__ */ React.createElement(IcUsers, { size: 18, color: allSelected ? "var(--brand-600)" : "var(--fg-subtle)" })), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 200, overflow: "auto", border: "1px solid var(--line-subtle)", borderRadius: 12, opacity: allSelected ? 0.5 : 1, pointerEvents: allSelected ? "none" : "auto" }, className: "toss-scroll" }, roster.map((s, i) => {
    const on = targets.includes(s.id);
    return /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => toggleOne(s.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      textAlign: "left",
      padding: "10px 14px",
      border: "none",
      cursor: "pointer",
      borderBottom: i < roster.length - 1 ? "1px solid var(--line-subtle)" : "none",
      background: on ? "var(--brand-50)" : "transparent"
    } }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: on ? "none" : "2px solid var(--line-strong)", background: on ? "var(--brand-500)" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" } }, on && /* @__PURE__ */ React.createElement(IcCheck, { size: 12 })), /* @__PURE__ */ React.createElement(Avatar, { name: s.name[0], size: 30 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.grade)));
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !canSend, trailing: /* @__PURE__ */ React.createElement(IcSend, { size: 14 }), onClick: submit }, selectedCount, "\uBA85\uC5D0\uAC8C \uBCF4\uB0B4\uAE30"))));
}
Object.assign(window, { BroadcastComposeDialog });
