const FOCUS_PRESETS = [
  { id: "short", label: "25\uBD84", minutes: 25 },
  { id: "mid", label: "50\uBD84", minutes: 50 },
  { id: "long", label: "90\uBD84", minutes: 90 },
  { id: "custom", label: "\uC9C1\uC811", minutes: 0 }
];
const FOCUS_SUBJECTS = ["\uAD6D\uC5B4", "\uC218\uD559", "\uC601\uC5B4", "\uC0AC\uD68C", "\uACFC\uD559", "\uD55C\uAD6D\uC0AC", "\uAE30\uD0C0"];
const focusSessionStore = {
  active: false,
  subject: null,
  startedAt: null,
  endsAt: null,
  totalSeconds: 0,
  elapsedSeconds: 0,
  pomodoros: 0,
  // 이번 세션 동안 완료한 자습 횟수 (로컬 상태 — 집계 엔드포인트 없음)
  todaySeconds: 0
  // 이번 세션 동안 누적된 자습 시간(초). 서버 집계 없음 → 로컬만.
};
function FocusTimer({ go }) {
  const [phase, setPhase] = React.useState(focusSessionStore.active ? "running" : "setup");
  const [preset, setPreset] = React.useState("mid");
  const [customMin, setCustomMin] = React.useState("30");
  const [subject, setSubject] = React.useState(focusSessionStore.subject || "\uC218\uD559");
  const [task, setTask] = React.useState("");
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [, forceTick] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(focusSessionStore.elapsedSeconds || 0);
  const [total, setTotal] = React.useState(focusSessionStore.totalSeconds || 50 * 60);
  const weekly = useStudyTasks().filter((t) => t.focus);
  const doneCount = weekly.filter((t) => t.done).length;
  const todayMin = Math.floor((focusSessionStore.todaySeconds || 0) / 60);
  const sessionDone = focusSessionStore.pomodoros || 0;
  const pickTask = (t) => {
    if (t.done) return;
    setSelectedTaskId(t.id);
    setSubject(t.subject);
    setTask(t.title);
  };
  React.useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        focusSessionStore.elapsedSeconds = next;
        if (next >= total) {
          setPhase("done");
          focusSessionStore.active = false;
          return total;
        }
        return next;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [phase, total]);
  const start = () => {
    const m = preset === "custom" ? Math.max(5, Math.min(240, parseInt(customMin, 10) || 30)) : FOCUS_PRESETS.find((p) => p.id === preset).minutes;
    const totalSec = m * 60;
    Object.assign(focusSessionStore, {
      active: true,
      subject,
      task,
      startedAt: Date.now(),
      endsAt: Date.now() + totalSec * 1e3,
      totalSeconds: totalSec,
      elapsedSeconds: 0,
      pomodoros: focusSessionStore.pomodoros || 0
    });
    setTotal(totalSec);
    setElapsed(0);
    setPhase("running");
  };
  const stop = () => {
    focusSessionStore.active = false;
    setPhase("setup");
  };
  const finish = () => {
    focusSessionStore.pomodoros = (focusSessionStore.pomodoros || 0) + 1;
    focusSessionStore.todaySeconds = (focusSessionStore.todaySeconds || 0) + elapsed;
    focusSessionStore.active = false;
    if (selectedTaskId) {
      setTaskDone(selectedTaskId, true);
      forceTick((n) => n + 1);
    }
    setPhase("done");
  };
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const remaining = total - elapsed;
  const pct = elapsed / total * 100;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC790\uC2B5 \uD0C0\uC784\uC5B4\uD0DD", subtitle: "\uC571\uC744 \uB098\uAC00\uBA74 \uC790\uB3D9 \uC885\uB8CC\uB3FC\uC694", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, phase === "setup" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, background: "linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(IcZap, { size: 16, color: "var(--brand-600)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--brand-600)" } }, "\uC624\uB298 \uB204\uC801 \uC790\uC2B5")), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 32, fontWeight: 800, color: "var(--fg-strong)" } }, Math.floor(todayMin / 60), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--fg-muted)", fontWeight: 500 } }, "\uC2DC\uAC04 "), todayMin % 60, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--fg-muted)", fontWeight: 500 } }, "\uBD84")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 4 } }, sessionDone > 0 ? `\uC644\uB8CC ${sessionDone}\uD68C` : "\uC544\uC9C1 \uC644\uB8CC\uD55C \uC790\uC2B5\uC774 \uC5C6\uC5B4\uC694")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACFC\uBAA9 \uC120\uD0DD", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, FOCUS_SUBJECTS.map((s) => /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => setSubject(s), style: {
    padding: "8px 14px",
    border: "1px solid",
    borderColor: subject === s ? "var(--brand-500)" : "var(--line-strong)",
    background: subject === s ? "var(--brand-50)" : "var(--bg-surface)",
    color: subject === s ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: subject === s ? 700 : 500,
    cursor: "pointer"
  } }, s)))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC2DC\uAC04 \uC124\uC815", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: preset === "custom" ? 12 : 0 } }, FOCUS_PRESETS.map((p) => /* @__PURE__ */ React.createElement("button", { key: p.id, onClick: () => setPreset(p.id), style: {
    padding: "14px 4px",
    border: "1px solid",
    borderColor: preset === p.id ? "var(--brand-500)" : "var(--line-strong)",
    background: preset === p.id ? "var(--brand-50)" : "var(--bg-surface)",
    color: preset === p.id ? "var(--brand-600)" : "var(--fg-default)",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: preset === p.id ? 700 : 500,
    cursor: "pointer"
  } }, p.label))), preset === "custom" && /* @__PURE__ */ React.createElement(TextInput, { value: customMin, onChange: setCustomMin, placeholder: "\uBD84 \uB2E8\uC704 \uC785\uB825", trailing: /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uBD84") })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC774\uBC88 \uC8FC \uC9C4\uB3C4\uC5D0\uC11C \uC120\uD0DD", subtitle: `\uC644\uB8CC ${doneCount}/${weekly.length} \xB7 \uC120\uD0DD\uD558\uBA74 \uC790\uC2B5 \uC644\uB8CC \uC2DC \uC790\uB3D9 \uCCB4\uD06C\uB3FC\uC694`, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, weekly.map((t) => {
    const active = selectedTaskId === t.id;
    return /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => pickTask(t), disabled: t.done, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      textAlign: "left",
      padding: "12px 14px",
      borderRadius: 12,
      cursor: t.done ? "default" : "pointer",
      border: "1px solid",
      borderColor: active ? "var(--brand-500)" : "var(--line-subtle)",
      background: t.done ? "var(--success-bg)" : active ? "var(--brand-50)" : "var(--bg-surface)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      flexShrink: 0,
      border: t.done ? "none" : active ? "2px solid var(--brand-500)" : "2px solid var(--line-strong)",
      background: t.done ? "var(--success)" : "transparent",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } }, t.done ? /* @__PURE__ */ React.createElement(IcCheck, { size: 13 }) : active ? /* @__PURE__ */ React.createElement(IcDot, { size: 8, color: "var(--brand-500)" }) : null), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: t.done ? "var(--success)" : "var(--fg-strong)", textDecoration: t.done ? "line-through" : "none" }, className: "kr-heading" }, t.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 1 } }, t.subject, t.done ? " \xB7 \uC644\uB8CC\uB428" : active ? " \xB7 \uC120\uD0DD\uB428" : "")), !t.done && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, t.subject));
  }))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC9C1\uC811 \uC785\uB825 (\uC120\uD0DD)", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: task, onChange: (v) => {
    setTask(v);
    setSelectedTaskId(null);
  }, placeholder: "\uC608) \uC218\uD559 II 5\uB2E8\uC6D0 \uBB38\uC81C\uD480\uC774 30\uAC1C" })), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--warning-bg)", borderRadius: 10, fontSize: 12, color: "var(--warning)", lineHeight: 1.55, marginBottom: 16 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcAlert, { size: 13, style: { display: "inline", verticalAlign: -2, marginRight: 4 } }), /* @__PURE__ */ React.createElement("strong", null, "\uC8FC\uC758:"), " \uC571\uC744 \uB044\uAC70\uB098 \uB2E4\uB978 \uD654\uBA74\uC73C\uB85C \uC774\uB3D9\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uC790\uC2B5\uC774 \uC885\uB8CC\uB429\uB2C8\uB2E4. \uB204\uC801 \uC2DC\uAC04\uC740 \uC885\uB8CC \uC2DC\uC810\uAE4C\uC9C0\uB9CC \uAE30\uB85D\uB3FC\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcZap, { size: 18 }), onClick: start }, "\uC790\uC2B5 \uC2DC\uC791\uD558\uAE30")), phase === "running" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 28, style: { marginBottom: 12, background: "linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)", color: "#fff", textAlign: "center" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff", marginBottom: 12 } }, subject, " \uC790\uC2B5 \uC911"), /* @__PURE__ */ React.createElement(FocusRing, { pct, timeText: fmt(remaining) }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginTop: 14 } }, /* @__PURE__ */ React.createElement("span", { className: "num" }, fmt(elapsed)), " \uACBD\uACFC \xB7 \uCD1D ", /* @__PURE__ */ React.createElement("span", { className: "num" }, Math.floor(total / 60)), "\uBD84"), task && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 12, background: "rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 12 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, opacity: 0.85, marginBottom: 4 } }, "\uC774\uBC88 \uC790\uC2B5 \uBAA9\uD45C"), task)), /* @__PURE__ */ React.createElement(Card, { padding: 14, style: { marginBottom: 12, background: "var(--warning-bg)", boxShadow: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 14, color: "var(--warning)", style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--warning)", lineHeight: 1.5 }, className: "kr-heading" }, "\uC571\uC744 \uB044\uAC70\uB098 \uC7A0\uAE08\uD654\uBA74\uC73C\uB85C \uAC00\uBA74 \uC790\uC2B5\uC774 \uC885\uB8CC\uB3FC\uC694. \uC120\uC0DD\uB2D8\uAED8\uB3C4 \uC885\uB8CC \uC2DC\uC810\uAE4C\uC9C0\uB9CC \uAE30\uB85D\uB3FC\uC694."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: stop }, "\uC911\uB3C4 \uC885\uB8CC"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, leading: /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 14 }), onClick: finish }, "\uC644\uB8CC\uB85C \uAE30\uB85D"))), phase === "done" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, { padding: 28, style: { marginBottom: 12, background: "var(--success-bg)", textAlign: "center", border: "1px solid #C8E5D2" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 18, background: "var(--success)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 32 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--success)", marginBottom: 6 }, className: "kr-heading" }, "\uC790\uC2B5 \uC644\uB8CC!"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--success)" } }, subject, " ", /* @__PURE__ */ React.createElement("span", { className: "num" }, Math.floor(elapsed / 60)), "\uBD84 \xB7 \uC624\uB298 \uB204\uC801 ", /* @__PURE__ */ React.createElement("span", { className: "num" }, Math.floor((focusSessionStore.todaySeconds || 0) / 60)), "\uBD84")), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC774\uBC88 \uC790\uC2B5 \uAE30\uB85D", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uACFC\uBAA9"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginTop: 4 } }, subject)), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC2E4\uC81C \uC2DC\uAC04"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginTop: 4 } }, Math.floor(elapsed / 60), "\uBD84")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC624\uB298 \uC644\uB8CC"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 14, fontWeight: 700, color: "var(--success)", marginTop: 4 } }, focusSessionStore.pomodoros || 0, "\uD68C")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: () => {
    setPhase("setup");
    setElapsed(0);
  } }, "\uD55C \uBC88 \uB354"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: () => go("dashboard") }, "\uB300\uC2DC\uBCF4\uB4DC\uB85C")))));
}
function FocusRing({ pct, timeText }) {
  const r = 90, c = 2 * Math.PI * r;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 220, height: 220, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("svg", { width: "220", height: "220", viewBox: "0 0 220 220" }, /* @__PURE__ */ React.createElement("circle", { cx: "110", cy: "110", r, fill: "none", stroke: "rgba(255,255,255,0.18)", strokeWidth: "10" }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "110",
      cy: "110",
      r,
      fill: "none",
      stroke: "#fff",
      strokeWidth: "10",
      strokeDasharray: `${pct / 100 * c} ${c}`,
      strokeLinecap: "round",
      transform: "rotate(-90 110 110)"
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 44, fontWeight: 800, letterSpacing: "-1px" } }, timeText), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85, marginTop: 2 } }, "\uB0A8\uC740 \uC2DC\uAC04")));
}
Object.assign(window, { FocusTimer, FOCUS_PRESETS, FOCUS_SUBJECTS });
