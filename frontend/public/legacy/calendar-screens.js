const CAL_EVENTS = {};
const ROSTER_CALENDARS = {};
function WeekStudyPanel({ compact, go }) {
  const all = typeof useStudyTasks === "function" ? useStudyTasks() : [];
  const items = all.filter((t) => t.focus);
  const done = items.filter((i) => i.done).length;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC774\uBC88 \uC8FC \uD559\uC2B5 \uACC4\uD68D"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, done, "/", items.length)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, items.map((it, i, arr) => /* @__PURE__ */ React.createElement("div", { key: it.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 6, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 } }, it.day || it.subject.slice(0, 1)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: it.done ? "var(--fg-muted)" : "var(--fg-strong)", textDecoration: it.done ? "line-through" : "none", flex: 1 }, className: "kr-heading" }, it.title), it.done ? /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 16, color: "var(--success)" }) : go ? /* @__PURE__ */ React.createElement("button", { onClick: () => go("focus-timer"), style: { display: "flex", alignItems: "center", gap: 3, padding: "4px 9px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--brand-50)", color: "var(--brand-600)", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcZap, { size: 11 }), "\uD559\uC2B5") : /* @__PURE__ */ React.createElement("span", { style: { width: 14, height: 14, borderRadius: 999, border: "1.5px dashed var(--fg-subtle)" } })))), go && /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcZap, { size: 15 }), style: { marginTop: 12 }, onClick: () => go("focus-timer") }, "\uC790\uC2B5 \uD0C0\uC784\uC5B4\uD0DD\uC73C\uB85C \uD559\uC2B5\uD558\uB7EC \uAC00\uAE30"));
}
const TIME_OPTIONS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const DATE_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + i);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
});
function CalSelect({ value, onChange, options, render }) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("select", { value, onChange: (e) => onChange(e.target.value), style: {
    width: "100%",
    height: 52,
    padding: "0 38px 0 16px",
    borderRadius: 12,
    border: "1px solid var(--line-strong)",
    background: "var(--bg-surface)",
    fontSize: 15,
    color: "var(--fg-strong)",
    fontFamily: "var(--font-sans)",
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer"
  } }, options.map((o) => /* @__PURE__ */ React.createElement("option", { key: o, value: o }, render ? render(o) : o))), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-muted)" } }, /* @__PURE__ */ React.createElement(IcChevronDown, { size: 16 })));
}
function AddEventSheet({ open, onClose, date, onAdd, onPickDate = () => {
} }) {
  const [kind, setKind] = React.useState("personal");
  const [title, setTitle] = React.useState("");
  const [time, setTime] = React.useState("18:00");
  const [body, setBody] = React.useState("");
  const trapRef = useFocusTrap(open, onClose);
  React.useEffect(() => {
    if (open) {
      setTitle("");
      setBody("");
      setKind("personal");
    }
  }, [open]);
  if (!open) return null;
  const KINDS = [
    { id: "personal", label: "\uAC1C\uC778 \uC77C\uC815", tone: "purple", icon: /* @__PURE__ */ React.createElement(IcStar, null) },
    { id: "study-due", label: "\uD559\uC2B5 \uACC4\uD68D", tone: "brand", icon: /* @__PURE__ */ React.createElement(IcBook, null) },
    { id: "exam-prep", label: "\uC2DC\uD5D8 \uC900\uBE44", tone: "warning", icon: /* @__PURE__ */ React.createElement(IcClipboard, null) },
    { id: "admission", label: "\uC785\uC2DC \uC900\uBE44", tone: "danger", icon: /* @__PURE__ */ React.createElement(IcGraduation, null) }
  ];
  const typeFor = (k) => k === "study-due" ? "study-due" : k === "admission" ? "admissions-update" : k === "exam-prep" ? "performance-due" : "personal";
  const tb = (t) => `var(--${t === "brand" ? "brand-50" : t === "purple" ? "accent-purple-bg" : t === "warning" ? "warning-bg" : "danger-bg"})`;
  const tf = (t) => `var(--${t === "brand" ? "brand-600" : t === "purple" ? "accent-purple" : t === "warning" ? "warning" : "danger"})`;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC77C\uC815 \uCD94\uAC00", style: {
    position: "relative",
    width: "100%",
    maxHeight: "92%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: "24px 24px 0 0",
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 4, background: "var(--line-strong)", borderRadius: 999, margin: "10px auto 4px" } }), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 20px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC77C\uC815 \uCD94\uAC00"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, date.slice(5, 7), "\uC6D4 ", date.slice(8, 10), "\uC77C"), "\uC5D0 \uCD94\uAC00\uB3FC\uC694"), /* @__PURE__ */ React.createElement(FormField, { label: "\uBD84\uB958", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, KINDS.map((k) => /* @__PURE__ */ React.createElement("button", { key: k.id, onClick: () => setKind(k.id), style: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid",
    borderColor: kind === k.id ? tf(k.tone) : "var(--line-strong)",
    background: kind === k.id ? tb(k.tone) : "var(--bg-surface)",
    color: kind === k.id ? tf(k.tone) : "var(--fg-muted)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  } }, React.cloneElement(k.icon, { size: 13 }), k.label)))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC81C\uBAA9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: title, onChange: setTitle, placeholder: kind === "study-due" ? "\uC608) \uC218\uD559 \uBAA8\uC758\uACE0\uC0AC \uC624\uB2F5 \uC815\uB9AC" : "\uC608) \uB3C5\uC11C\uC2E4 \uC790\uC2B5", autoFocus: true })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uB0A0\uC9DC", style: { flex: 1 } }, /* @__PURE__ */ React.createElement(CalSelect, { value: date, onChange: onPickDate, options: DATE_OPTIONS, render: (d) => `${d.slice(5, 7)}\uC6D4 ${d.slice(8, 10)}\uC77C` })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uAC04", style: { flex: 1 } }, /* @__PURE__ */ React.createElement(CalSelect, { value: time, onChange: setTime, options: TIME_OPTIONS }))), /* @__PURE__ */ React.createElement(FormField, { label: "\uBA54\uBAA8 (\uC120\uD0DD)", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 3, placeholder: "\uBC94\uC704\xB7\uC900\uBE44\uBB3C \uB4F1\uC744 \uC801\uC5B4\uB450\uBA74 \uC88B\uC544\uC694" })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !title.trim(), onClick: () => {
    onAdd({ type: typeFor(kind), title: title.trim(), time, body: body.trim() || void 0 });
    showToast("\uC77C\uC815\uC744 \uCD94\uAC00\uD588\uC5B4\uC694", "success");
    onClose();
  } }, "\uCD94\uAC00\uD558\uAE30"))));
}
const eventColor = (t) => ({
  "counseling-request": { bg: "var(--warning-bg)", fg: "var(--warning)", dot: "#A16207" },
  "counseling-confirmed": { bg: "var(--success-bg)", fg: "var(--success)", dot: "#15803D" },
  "teacher-proposal": { bg: "var(--info-bg)", fg: "var(--brand-600)", dot: "#1B64DA" },
  "mock-exam": { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)", dot: "#7B61FF" },
  "admissions-update": { bg: "var(--bg-muted)", fg: "var(--fg-default)", dot: "#6B7684" },
  "study-due": { bg: "var(--accent-mint-bg)", fg: "var(--accent-mint)", dot: "#00B894" },
  "performance-due": { bg: "var(--danger-bg)", fg: "var(--danger)", dot: "#DC2626" },
  "memo": { bg: "var(--info-bg)", fg: "var(--brand-600)", dot: "#3182F6" },
  "personal": { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)", dot: "#7B61FF" }
})[t] || { bg: "var(--bg-muted)", fg: "var(--fg-default)", dot: "#6B7684" };
const eventChip = (t) => {
  const labels = {
    "counseling-request": "\uC0C1\uB2F4 \uC694\uCCAD",
    "counseling-confirmed": "\uC0C1\uB2F4 \uD655\uC815",
    "teacher-proposal": "\uC2DC\uAC04 \uC81C\uC548",
    "mock-exam": "\uBAA8\uC758\uACE0\uC0AC",
    "admissions-update": "\uC785\uC2DC \uC5C5\uB370\uC774\uD2B8",
    "study-due": "\uD559\uC2B5 \uB9C8\uAC10",
    "performance-due": "\uC218\uD589 \uB9C8\uAC10",
    "memo": "\uBA54\uBAA8",
    "personal": "\uAC1C\uC778 \uC77C\uC815"
  };
  const c = eventColor(t);
  return /* @__PURE__ */ React.createElement("span", { style: { background: c.bg, color: c.fg, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6 } }, labels[t]);
};
function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = [];
  for (let i = 0; i < startWeekday; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push({ day: d, key: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  while (grid.length < 42) grid.push(null);
  return grid;
}
function dateKey(d) {
  const dt = new Date(d);
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
}
const CAT_COLOR = { volunteer: "var(--accent-mint)", experience: "var(--accent-purple)", exam: "var(--danger)", counseling: "var(--success)", study: "var(--brand-500)", other: "var(--fg-subtle)" };
function StudentCalendar({ go }) {
  const today = /* @__PURE__ */ new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [events, setEvents] = React.useState([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const grid = buildMonth(month.y, month.m);
  const monthLabel = `${month.y}\uB144 ${month.m + 1}\uC6D4`;
  const load = React.useCallback(async () => {
    const from = new Date(month.y, month.m, 1).toISOString();
    const to = new Date(month.y, month.m + 1, 0, 23, 59, 59).toISOString();
    try {
      const r = await window.__apiFetch("/calendar/events?from=" + from + "&to=" + to, { method: "GET" });
      setEvents(r.data || []);
    } catch (e) {
      setEvents([]);
    }
  }, [month.y, month.m]);
  React.useEffect(() => {
    load();
  }, [load]);
  const byDate = {};
  events.forEach((e) => {
    const k = dateKey(e.startsAt);
    (byDate[k] = byDate[k] || []).push(e);
  });
  const eventsFor = (key) => byDate[key] || [];
  const selectedEvents = eventsFor(selected);
  const upcoming = [...events].filter((e) => new Date(e.startsAt) >= new Date(todayKey)).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)).slice(0, 4);
  const addEvent = async (ev) => {
    const time = ev && ev.time && /^\d{1,2}:\d{2}/.test(ev.time) ? ev.time.slice(0, 5) : "09:00";
    const startsAt = (/* @__PURE__ */ new Date(selected + "T" + time + ":00")).toISOString();
    try {
      await window.__apiFetch("/calendar/events", { method: "POST", body: JSON.stringify({
        title: ev && ev.title || "\uC0C8 \uC77C\uC815",
        category: ev && ev.category || "other",
        startsAt,
        ...ev && ev.location ? { location: ev.location } : {}
      }) });
      load();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uC77C\uC815 \uCD94\uAC00\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  const fmtTime = (d) => new Date(d).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uCE98\uB9B0\uB354", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcPlus, { size: 20 }), onClick: () => setAddOpen(true), ariaLabel: "\uC77C\uC815 \uCD94\uAC00" }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronLeft, { size: 20 }), onClick: () => setMonth((m) => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 })), ariaLabel: "\uC774\uC804" }), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, monthLabel), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20 }), onClick: () => setMonth((m) => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 })), ariaLabel: "\uB2E4\uC74C" })), /* @__PURE__ */ React.createElement(Card, { padding: 12, style: { margin: "0 16px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 6 } }, ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"].map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d, style: { textAlign: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "var(--danger)" : i === 6 ? "var(--brand-600)" : "var(--fg-muted)", padding: "6px 0" } }, d))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: 38, gap: 2 } }, grid.map((cell, i) => {
    if (!cell) return /* @__PURE__ */ React.createElement("div", { key: i });
    const evs = eventsFor(cell.key);
    const isSelected = selected === cell.key;
    const isToday = cell.key === todayKey;
    return /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => setSelected(cell.key), style: {
      height: "100%",
      border: "none",
      cursor: "pointer",
      position: "relative",
      background: isSelected ? "var(--brand-500)" : isToday ? "var(--brand-50)" : "transparent",
      color: isSelected ? "#fff" : isToday ? "var(--brand-600)" : i % 7 === 0 ? "var(--danger)" : "var(--fg-strong)",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: isSelected || isToday ? 700 : 500,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 2
    } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, cell.day), evs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 2, marginTop: 2 } }, evs.slice(0, 3).map((e, k) => /* @__PURE__ */ React.createElement("span", { key: k, style: { width: 4, height: 4, borderRadius: "50%", background: isSelected ? "#fff" : CAT_COLOR[e.category] || "var(--fg-subtle)" } }))));
  }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, selected.slice(5, 7), "\uC6D4 ", selected.slice(8, 10), "\uC77C"), " \uC77C\uC815"), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 12 }), onClick: () => setAddOpen(true) }, "\uC77C\uC815 \uCD94\uAC00")), selectedEvents.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCalendar, { size: 22 }), title: "\uC774 \uB0A0 \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694", body: "\uBD09\uC0AC\xB7\uC785\uC2DC \uD654\uBA74\uC5D0\uC11C \u2018\uCE98\uB9B0\uB354 \uCD94\uAC00\u2019\uB97C \uB204\uB974\uAC70\uB098, \uC9C1\uC811 \uC77C\uC815\uC744 \uCD94\uAC00\uD560 \uC218 \uC788\uC5B4\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, selectedEvents.map((e) => /* @__PURE__ */ React.createElement(Card, { key: e.id, padding: 12 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 3, height: 36, background: CAT_COLOR[e.category] || "var(--fg-subtle)", borderRadius: 999 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, fmtTime(e.startsAt), e.location ? " \xB7 " + e.location : "")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcTrash, { size: 15 }), ariaLabel: "\uC0AD\uC81C", onClick: async () => {
    try {
      await window.__apiFetch("/calendar/events/" + e.id, { method: "DELETE" });
      load();
    } catch (er) {
    }
  } }))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 10 } }, "\uB2E4\uAC00\uC624\uB294 \uC77C\uC815"), upcoming.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", padding: "4px 4px 12px" } }, "\uC608\uC815\uB41C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, upcoming.map((e) => /* @__PURE__ */ React.createElement(Card, { key: e.id, padding: 12, onClick: () => setSelected(dateKey(e.startsAt)), hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", minWidth: 38 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)" } }, dateKey(e.startsAt).slice(8, 10)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, dateKey(e.startsAt).slice(5, 7), "\uC6D4")), /* @__PURE__ */ React.createElement("div", { style: { width: 3, height: 32, background: CAT_COLOR[e.category] || "var(--fg-subtle)", borderRadius: 999 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, fmtTime(e.startsAt), e.location ? ` \xB7 ${e.location}` : "")))))))), /* @__PURE__ */ React.createElement(AddEventSheet, { open: addOpen, onClose: () => setAddOpen(false), date: selected, onAdd: addEvent, onPickDate: setSelected }));
}
function EventCard({ ev, onReschedule, onAccept }) {
  const c = eventColor(ev.type);
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const isCounseling = ev.type === "counseling-confirmed";
  return /* @__PURE__ */ React.createElement(Card, { padding: 14, style: { borderLeft: `3px solid ${c.dot}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, eventChip(ev.type), ev.fromTeacher && /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uC120\uC0DD\uB2D8")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-muted)" } }, ev.time)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, ev.title), ev.owner && /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "var(--brand-600)", background: "var(--brand-50)", padding: "3px 8px", borderRadius: 6, marginTop: 6 } }, /* @__PURE__ */ React.createElement(IcCalendar, { size: 10 }), ev.owner), ev.who && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "7px 10px", background: "var(--bg-muted)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement(IcUsers, { size: 13, color: "var(--brand-600)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, ev.who)), ev.topic && /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--fg-muted)", marginTop: 6 } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 11 }), ev.topic), ev.location && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 6 } }, "\u{1F4CD} ", ev.location), ev.fromTeacher && ev.body && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 6, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }, className: "kr-heading" }, ev.body), ev.fromTeacher && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--brand-600)", fontWeight: 700, marginTop: 6, display: "flex", alignItems: "center", gap: 2 } }, "\uC790\uC138\uD788 \uBCF4\uAE30 ", /* @__PURE__ */ React.createElement(IcChevronRight, { size: 11 })), isCounseling && ev.editable && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 13 }), onClick: (e) => {
    e.stopPropagation();
    setRescheduleOpen(true);
  } }, "\uC2DC\uAC04 \uBCC0\uACBD")), ev.type === "teacher-proposal" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: (e) => {
    e.stopPropagation();
    if (window.showToast) showToast("15:00 \uC0C1\uB2F4\uC73C\uB85C \uD655\uC815\uD588\uC5B4\uC694 \xB7 \uC120\uC0DD\uB2D8\uAED8 \uC54C\uB9BC\uC774 \uAC14\uC5B4\uC694", "success");
  } }, "15:00 \uC218\uB77D"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: (e) => {
    e.stopPropagation();
    if (window.showToast) showToast("16:00 \uC0C1\uB2F4\uC73C\uB85C \uD655\uC815\uD588\uC5B4\uC694 \xB7 \uC120\uC0DD\uB2D8\uAED8 \uC54C\uB9BC\uC774 \uAC14\uC5B4\uC694", "success");
  } }, "16:00 \uC218\uB77D"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: (e) => {
    e.stopPropagation();
    setRescheduleOpen(true);
  } }, "\uB2E4\uB978 \uC2DC\uAC04 \uC81C\uC548")), ev.type === "counseling-request" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11.5, color: "var(--fg-muted)" } }, "\uC0C1\uB300\uAC00 \uC218\uB77D\uD558\uBA74 \uC77C\uC815\uC774 \uD655\uC815\uB418\uACE0 \uC54C\uB9BC\uC744 \uBC1B\uC544\uC694."), rescheduleOpen && /* @__PURE__ */ React.createElement(RescheduleDialog, { ev, onClose: () => setRescheduleOpen(false) }));
}
function RescheduleDialog({ ev, onClose }) {
  const [date, setDate] = React.useState(typeof DATE_OPTIONS !== "undefined" ? DATE_OPTIONS[2] : (() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })());
  const [time, setTime] = React.useState((ev.time || "15:00").slice(0, 5));
  const trapRef = typeof useFocusTrap !== "undefined" ? useFocusTrap(true, onClose) : null;
  const Sel = typeof CalSelect !== "undefined" ? CalSelect : null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0C1\uB2F4 \uC2DC\uAC04 \uBCC0\uACBD", style: { position: "relative", width: 400, maxWidth: "94%", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 700 } }, "\uC0C1\uB2F4 \uC2DC\uAC04 \uBCC0\uACBD"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--fg-muted)", marginBottom: 16 }, className: "kr-heading" }, ev.who ? `${ev.who}\uC640\uC758 ` : "", "\uC0C1\uB2F4 \uC2DC\uAC04\uC744 \uBC14\uAFD4\uC694. \uBCC0\uACBD\uD558\uBA74 \uC0C1\uB300\uC5D0\uAC8C \uC54C\uB9BC\uC774 \uAC00\uACE0, \uC0C1\uB300\uAC00 \uD655\uC778\uD558\uBA74 \uD655\uC815\uB3FC\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 18 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uB0A0\uC9DC", style: { flex: 1, minWidth: 0 } }, Sel ? /* @__PURE__ */ React.createElement(Sel, { value: date, onChange: setDate, options: DATE_OPTIONS, render: (d) => `${d.slice(5, 7)}\uC6D4 ${d.slice(8, 10)}\uC77C` }) : /* @__PURE__ */ React.createElement(TextInput, { value: date, onChange: setDate })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uAC04", style: { flex: 1, minWidth: 0 } }, Sel ? /* @__PURE__ */ React.createElement(Sel, { value: time, onChange: setTime, options: TIME_OPTIONS }) : /* @__PURE__ */ React.createElement(TextInput, { value: time, onChange: setTime }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: () => {
    if (window.showToast) showToast(`${date.slice(5, 7)}/${date.slice(8, 10)} ${time}\uB85C \uBCC0\uACBD \uC694\uCCAD\uC744 \uBCF4\uB0C8\uC5B4\uC694`, "success");
    onClose();
  } }, "\uBCC0\uACBD \uC694\uCCAD \uBCF4\uB0B4\uAE30"))));
}
function BroadcastDetailSheet({ open, ev, onClose, forTeacher }) {
  if (!open || !ev) return null;
  let recipientLabel = null;
  if (forTeacher && ev.bcId) {
    try {
      const bc = teacherBroadcastStore().find((b) => b.id === ev.bcId);
      if (bc) recipientLabel = bc.targets.includes("all") ? "\uC6B0\uB9AC \uBC18 \uC804\uCCB4" : `${bc.targets.length}\uBA85`;
    } catch (e) {
    }
  }
  return /* @__PURE__ */ React.createElement(BottomSheet, { open, onClose, title: forTeacher ? "\uB0B4\uAC00 \uBCF4\uB0B8 \uC548\uB0B4" : "\uC120\uC0DD\uB2D8\uC774 \uBCF4\uB0B8 \uC548\uB0B4", maxHeight: "70%" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" } }, eventChip(ev.type), forTeacher ? /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", leading: /* @__PURE__ */ React.createElement(IcUsers, { size: 11 }) }, recipientLabel || "\uC804\uC1A1\uB428") : /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uB2F4\uC784 \uC120\uC0DD\uB2D8")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)", wordBreak: "keep-all" }, className: "kr-heading" }, ev.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--fg-muted)", fontSize: 13 } }, /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }), " ", /* @__PURE__ */ React.createElement("span", { className: "num" }, ev.time)), ev.body && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 16, background: "var(--bg-muted)", borderRadius: 12, fontSize: 14, color: "var(--fg-default)", lineHeight: 1.6, wordBreak: "keep-all" }, className: "kr-heading" }, ev.body), forTeacher ? /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "lg", full: true, style: { marginTop: 16 }, onClick: onClose }, "\uB2EB\uAE30") : /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, style: { marginTop: 16 }, onClick: onClose }, "\uD655\uC778\uD588\uC5B4\uC694")));
}
function CounselingRequest({ go }) {
  const [date, setDate] = React.useState(typeof DATE_OPTIONS !== "undefined" ? DATE_OPTIONS[0] : (() => {
    const d = /* @__PURE__ */ new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })());
  const [time, setTime] = React.useState("15:00");
  const [why, setWhy] = React.useState("");
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC0C1\uB2F4 \uC694\uCCAD", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("calendar") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(CounselingRequestDraft, { onUse: (draft) => setWhy(draft.body) }), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC0C1\uB2F4 \uB300\uC0C1", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Avatar, { name: "\uB2F4", size: 44 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, "\uB2F4\uC784 \uC120\uC0DD\uB2D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uD559\uAE09 \uB2F4\uC784 \uC120\uC0DD\uB2D8\uAED8 \uC0C1\uB2F4\uC744 \uC694\uCCAD\uD574\uC694")))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uD76C\uB9DD \uC77C\uC2DC", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uB0A0\uC9DC", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: date, onChange: setDate, placeholder: "YYYY-MM-DD", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }) })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uAC04\uB300" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 } }, ["13:00", "14:00", "15:00", "16:00"].map((t) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setTime(t), style: {
    padding: "10px 4px",
    border: "1px solid",
    borderColor: time === t ? "var(--brand-500)" : "var(--line-strong)",
    background: time === t ? "var(--brand-50)" : "var(--bg-surface)",
    color: time === t ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: time === t ? 700 : 500,
    cursor: "pointer"
  } }, t))))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC0C1\uB2F4\uD558\uACE0 \uC2F6\uC740 \uB0B4\uC6A9", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Textarea, { value: why, onChange: setWhy, rows: why ? 12 : 5, placeholder: "\uC9C4\uB85C \uBC29\uD5A5, \uC131\uC801 \uACE0\uBBFC, \uD559\uC2B5 \uC5B4\uB824\uC6C0 \uB4F1 \uC790\uC720\uB86D\uAC8C \uC801\uC5B4\uC8FC\uC138\uC694" })), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--brand-50)", borderRadius: 12, fontSize: 12, color: "var(--brand-600)", lineHeight: 1.55, marginBottom: 16 }, className: "kr-heading" }, "\uC120\uC0DD\uB2D8\uC774 \uC694\uCCAD\uC744 \uD655\uC778\uD558\uBA74 \uC54C\uB9BC\uC73C\uB85C \uC54C\uB824\uB4DC\uB824\uC694. \uC2DC\uAC04\uC774 \uC548 \uB9DE\uC73C\uBA74 \uB2E4\uB978 \uC2DC\uAC04\uC744 \uC81C\uC548\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !why.trim(), onClick: () => go("calendar") }, "\uC0C1\uB2F4 \uC694\uCCAD \uBCF4\uB0B4\uAE30")));
}
function TeacherCalendar({ openNotif }) {
  const today = /* @__PURE__ */ new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [events, setEvents] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [dialog, setDialog] = React.useState(null);
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
  const reload = () => {
    loadEvents();
    loadRequests();
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { title: "\uCE98\uB9B0\uB354", subtitle: "\uD559\uC0DD \uC0C1\uB2F4 \uC694\uCCAD\uC744 \uC218\uB77D\uD558\uACE0, \uC77C\uC815 \uBCC0\uACBD\xB7\uCDE8\uC18C \uC2DC \uD559\uC0DD\uC5D0\uAC8C \uC0AC\uC720\uC640 \uD568\uAED8 \uC54C\uB9BC\uC774 \uAC00\uC694", openNotif }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr", background: "var(--bg-canvas)", minHeight: 0, padding: 24, gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, monthLabel), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", onClick: () => {
    setMonth({ y: today.getFullYear(), m: today.getMonth() });
    setSelected(todayKey);
  } }, "\uC624\uB298"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronLeft, { size: 16 }), onClick: () => setMonth((m) => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 })), ariaLabel: "\uC774\uC804" }), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 16 }), onClick: () => setMonth((m) => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 })), ariaLabel: "\uB2E4\uC74C" }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0, marginBottom: 4 } }, ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"].map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d, style: { textAlign: "left", fontSize: 11, fontWeight: 700, color: i === 0 ? "var(--danger)" : i === 6 ? "var(--brand-600)" : "var(--fg-muted)", padding: "8px 6px" } }, d))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "90px", gap: 4 } }, grid.map((cell, i) => {
    if (!cell) return /* @__PURE__ */ React.createElement("div", { key: i });
    const evs = byDate[cell.key] || [];
    const isSelected = selected === cell.key;
    const isToday = cell.key === todayKey;
    return /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => setSelected(cell.key), style: {
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      padding: 6,
      background: isSelected ? "var(--brand-50)" : "var(--bg-muted)",
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      gap: 3,
      outline: isSelected ? "2px solid var(--brand-500)" : "none",
      outlineOffset: -2
    } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 13, fontWeight: 700, color: isToday ? "var(--brand-600)" : i % 7 === 0 ? "var(--danger)" : "var(--fg-strong)" } }, cell.day, isToday && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 4, fontSize: 9, color: "var(--brand-600)" } }, "\uC624\uB298")), evs.slice(0, 2).map((e, k) => /* @__PURE__ */ React.createElement("div", { key: k, style: { background: "var(--bg-surface)", color: "var(--fg-default)", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, borderLeft: `2px solid ${CAT_COLOR[e.category] || "var(--fg-subtle)"}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, e.title)), evs.length > 2 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--fg-muted)", paddingLeft: 4 } }, "+", evs.length - 2));
  }))), /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, selected.slice(5, 7), "\uC6D4 ", selected.slice(8, 10), "\uC77C"), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "var(--line-subtle)", margin: "14px 0" } }), selectedEvents.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcCalendar, { size: 20 }), title: "\uC77C\uC815 \uC5C6\uC74C", body: "\uC774 \uB0A0 \uB4F1\uB85D\uB41C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, selectedEvents.map((e) => {
    const isCounsel = e.category === "counseling";
    return /* @__PURE__ */ React.createElement("div", { key: e.id, style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, borderLeft: `3px solid ${CAT_COLOR[e.category] || "var(--fg-subtle)"}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, e.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)", flexShrink: 0 } }, fmtTime(e.startsAt))), e.notes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4 } }, e.notes), isCounsel && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 13 }), onClick: () => setDialog({ kind: "reschedule", ev: e }) }, "\uC2DC\uAC04 \uBCC0\uACBD"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", style: { color: "var(--danger)" }, leading: /* @__PURE__ */ React.createElement(IcTrash, { size: 13 }), onClick: () => setDialog({ kind: "cancel", ev: e }) }, "\uCDE8\uC18C")), !isCounsel && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", style: { color: "var(--fg-muted)" }, leading: /* @__PURE__ */ React.createElement(IcTrash, { size: 13 }), onClick: () => setDialog({ kind: "cancel", ev: e }) }, "\uC0AD\uC81C")));
  })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, paddingTop: 14, borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 10 } }, "\uB300\uAE30 \uC911\uC778 \uC0C1\uB2F4 \uC694\uCCAD ", pending.length), pending.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, "\uC0C8 \uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC624\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, pending.map((r) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--line-subtle)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (((_a = r.student) == null ? void 0 : _a.name) || "?")[0], size: 28 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-strong)" } }, (_b = r.student) == null ? void 0 : _b.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: "var(--fg-muted)" } }, "\xB7 ", r.topic)), r.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, r.note)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => setDialog({ kind: "accept", req: r }) }, "\uC218\uB77D"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", style: { color: "var(--fg-muted)" }, onClick: () => setDialog({ kind: "decline", req: r }) }, "\uAC70\uC808")));
  }))))), dialog && /* @__PURE__ */ React.createElement(CounselActionDialog, { dialog, selectedDate: selected, onClose: () => setDialog(null), onDone: () => {
    setDialog(null);
    reload();
  } }));
}
function CounselActionDialog({ dialog, selectedDate, onClose, onDone }) {
  var _a, _b;
  const { kind, req, ev } = dialog;
  const defaultDT = (() => {
    const base = ev ? new Date(ev.startsAt) : /* @__PURE__ */ new Date(selectedDate + "T15:00:00");
    const p = (n) => String(n).padStart(2, "0");
    return `${base.getFullYear()}-${p(base.getMonth() + 1)}-${p(base.getDate())}T${p(base.getHours())}:${p(base.getMinutes())}`;
  })();
  const [dt, setDt] = React.useState(defaultDT);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const titles = { accept: "\uC0C1\uB2F4 \uC218\uB77D \xB7 \uC2DC\uAC04 \uD655\uC815", decline: "\uC0C1\uB2F4 \uC694\uCCAD \uAC70\uC808", cancel: "\uC77C\uC815 \uCDE8\uC18C", reschedule: "\uC0C1\uB2F4 \uC2DC\uAC04 \uBCC0\uACBD" };
  const needsTime = kind === "accept" || kind === "reschedule";
  const needsReason = kind === "decline" || kind === "cancel" || kind === "reschedule";
  const reasonRequired = kind === "cancel" || kind === "decline";
  const submit = async () => {
    setErr("");
    if (needsReason && reasonRequired && !reason.trim()) {
      setErr("\uD559\uC0DD\uC5D0\uAC8C \uC804\uB2EC\uD560 \uC0AC\uC720\uB97C \uC801\uC5B4\uC8FC\uC138\uC694.");
      return;
    }
    setBusy(true);
    try {
      if (kind === "accept") {
        await window.__apiFetch("/counseling-requests/" + req.id + "/accept", { method: "POST", body: JSON.stringify({ at: new Date(dt).toISOString(), note: reason.trim() || void 0 }) });
      } else if (kind === "decline") {
        await window.__apiFetch("/counseling-requests/" + req.id + "/decline", { method: "POST", body: JSON.stringify({ note: reason.trim() }) });
      } else if (kind === "cancel") {
        await window.__apiFetch("/calendar/events/" + ev.id, { method: "DELETE", body: JSON.stringify({ reason: reason.trim() }) });
      } else if (kind === "reschedule") {
        await window.__apiFetch("/calendar/events/" + ev.id, { method: "PATCH", body: JSON.stringify({ startsAt: new Date(dt).toISOString(), reason: reason.trim() || void 0 }) });
      }
      onDone();
    } catch (e) {
      setErr(e && e.body && e.body.message || "\uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: "var(--bg-elevated)", borderRadius: 16, padding: 22, width: "min(440px, 100%)", boxShadow: "var(--shadow-pop)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)", marginBottom: 6 } }, titles[kind]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginBottom: 16 } }, kind === "accept" && `${(_a = req.student) == null ? void 0 : _a.name} \uD559\uC0DD \xB7 ${req.topic} \u2014 \uC2DC\uAC04\uC744 \uD655\uC815\uD558\uBA74 \uD559\uC0DD \uCE98\uB9B0\uB354\uC5D0\uB3C4 \uCD94\uAC00\uB418\uACE0 \uC54C\uB9BC\uC774 \uAC00\uC694.`, kind === "decline" && `${(_b = req.student) == null ? void 0 : _b.name} \uD559\uC0DD\uC758 \uC694\uCCAD\uC744 \uBCF4\uB958\uD574\uC694. \uC0AC\uC720\uB294 \uD559\uC0DD\uC5D0\uAC8C \uC804\uB2EC\uB3FC\uC694.`, kind === "cancel" && `\uC774 \uC77C\uC815\uC744 \uCDE8\uC18C\uD574\uC694.${ev.category === "counseling" ? " \uD559\uC0DD \uCE98\uB9B0\uB354\uC5D0\uC11C\uB3C4 \uC0AD\uC81C\uB418\uACE0 \uC0AC\uC720 \uC54C\uB9BC\uC774 \uAC00\uC694." : ""}`, kind === "reschedule" && "\uBC14\uB010 \uC2DC\uAC04\uC774 \uD559\uC0DD \uCE98\uB9B0\uB354\uC5D0 \uBC18\uC601\uB418\uACE0 \uC0AC\uC720\uC640 \uD568\uAED8 \uC54C\uB9BC\uC774 \uAC00\uC694."), needsTime && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 6 } }, kind === "accept" ? "\uD655\uC815 \uC2DC\uAC04" : "\uBCC0\uACBD\uD560 \uC2DC\uAC04"), /* @__PURE__ */ React.createElement("input", { type: "datetime-local", value: dt, onChange: (e) => setDt(e.target.value), style: { width: "100%", padding: "10px 12px", border: "1px solid var(--line-strong)", borderRadius: 10, fontSize: 14, fontFamily: "inherit" } })), needsReason && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", marginBottom: 6 } }, "\uD559\uC0DD\uC5D0\uAC8C \uC804\uB2EC\uD560 \uC0AC\uC720 ", reasonRequired ? "" : "(\uC120\uD0DD)"), /* @__PURE__ */ React.createElement(Textarea, { value: reason, onChange: setReason, rows: 3, placeholder: kind === "cancel" ? "\uC608) \uD559\uC0DD \uC870\uD1F4\uB85C \uC0C1\uB2F4\uC744 \uCDE8\uC18C\uD569\uB2C8\uB2E4." : kind === "reschedule" ? "\uC608) \uD68C\uC758 \uC77C\uC815\uC774 \uACB9\uCCD0 \uC2DC\uAC04\uC744 \uC62E\uACBC\uC5B4\uC694." : "\uC608) \uC774\uBC88 \uC8FC\uB294 \uC77C\uC815\uC774 \uC5B4\uB824\uC6CC\uC694. \uB2E4\uC74C \uC8FC\uC5D0 \uB2E4\uC2DC \uC7A1\uC544\uC694." })), err && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--danger)", fontSize: 13, marginBottom: 10 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", onClick: onClose }, "\uB2EB\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: kind === "cancel" || kind === "decline" ? "danger" : "primary", size: "md", disabled: busy, onClick: submit }, busy ? "\uCC98\uB9AC \uC911\u2026" : kind === "accept" ? "\uD655\uC815" : kind === "decline" ? "\uAC70\uC808" : kind === "cancel" ? "\uCDE8\uC18C\uD558\uAE30" : "\uBCC0\uACBD"))));
}
Object.assign(window, {
  StudentCalendar,
  TeacherCalendar,
  CounselingRequest,
  CAL_EVENTS,
  eventColor,
  eventChip,
  buildMonth,
  EventCard,
  WeekStudyPanel,
  AddEventSheet,
  ROSTER_CALENDARS,
  BroadcastDetailSheet,
  CalSelect,
  DATE_OPTIONS,
  TIME_OPTIONS
});
