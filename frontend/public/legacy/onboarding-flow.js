const ONB_STEPS = [
  {
    id: "grade",
    q: "\uC9C0\uAE08 \uBA87 \uD559\uB144\uC774\uC5D0\uC694?",
    sub: "\uB300\uB7B5\uB9CC \uC54C\uB824\uC918\uB3C4 \uAD1C\uCC2E\uC544\uC694",
    opts: ["\uC9113", "\uACE01", "\uACE02", "\uACE03", "N\uC218", "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694"]
  },
  {
    id: "track",
    q: "\uACC4\uC5F4\uC740 \uC815\uD588\uC5B4\uC694?",
    sub: "\uC548 \uC815\uD574\uB3C4 \uC804\uD600 \uBB38\uC81C \uC5C6\uC5B4\uC694",
    opts: ["\uBB38\uACFC", "\uC774\uACFC", "\uD1B5\uD569", "\uC608\uCCB4\uB2A5", "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694"]
  },
  {
    id: "field",
    q: "\uAD00\uC2EC \uAC00\uB294 \uBD84\uC57C\uAC00 \uC788\uC5B4\uC694?",
    sub: "1~2\uAC1C\uB9CC \uACE8\uB77C\uB3C4 \uB418\uACE0, \uBAB0\uB77C\uB3C4 \uB3FC\uC694",
    multi: true,
    opts: ["\uACF5\uD559\xB7IT", "\uC758\uB8CC\xB7\uBCF4\uAC74", "\uACBD\uC601\xB7\uACBD\uC81C", "\uC778\uBB38\xB7\uC0AC\uD68C", "\uC608\uC220\xB7\uB514\uC790\uC778", "\uAD50\uC721", "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694"]
  },
  {
    id: "grade_band",
    q: "\uC694\uC998 \uC131\uC801\uB300\uB294 \uC5B4\uB290 \uC815\uB3C4\uC608\uC694?",
    sub: "\uC815\uD655\uD55C \uC810\uC218\uB294 \uB098\uC911\uC5D0. \uB290\uB08C\uB9CC\uC694",
    opts: ["\uC0C1\uC704\uAD8C", "\uC911\uC0C1\uC704\uAD8C", "\uC911\uC704\uAD8C", "\uC911\uD558\uC704\uAD8C", "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694"]
  }
];
function OnboardingFlow({ role = "student", onFinish }) {
  const [phase, setPhase] = React.useState("intro");
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [other, setOther] = React.useState("");
  if (role === "teacher") return /* @__PURE__ */ React.createElement(TeacherOnboarding, { onFinish });
  const cur = ONB_STEPS[step];
  const pick = (opt) => {
    if (cur.multi) {
      setAnswers((a) => {
        const prev = a[cur.id] || [];
        if (opt === "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694") return { ...a, [cur.id]: ["\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694"] };
        const cleaned = prev.filter((x) => x !== "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694");
        return { ...a, [cur.id]: cleaned.includes(opt) ? cleaned.filter((x) => x !== opt) : [...cleaned, opt] };
      });
    } else {
      setAnswers((a) => ({ ...a, [cur.id]: opt }));
    }
  };
  const isPicked = (opt) => cur.multi ? (answers[cur.id] || []).includes(opt) : answers[cur.id] === opt;
  const canNext = cur.multi ? (answers[cur.id] || []).length > 0 || cur.id === "field" && other.trim() : !!answers[cur.id];
  const next = () => {
    if (step < ONB_STEPS.length - 1) setStep((s) => s + 1);
    else setPhase("explain");
  };
  if (phase === "intro") {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" } }, typeof CompassMascot !== "undefined" && /* @__PURE__ */ React.createElement(CompassMascot, { size: 130 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.6px", marginTop: 20, lineHeight: 1.3 }, className: "kr-heading" }, "\uBC18\uAC00\uC6CC\uC694!", /* @__PURE__ */ React.createElement("br", null), "\uB531 4\uAC00\uC9C0\uB9CC \uBB3C\uC5B4\uBCFC\uAC8C\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14.5, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.6 }, className: "kr-heading" }, "\uC9C4\uB85C\uB97C \uC544\uC9C1 \uBABB \uC815\uD574\uB3C4 \uAD1C\uCC2E\uC544\uC694.", /* @__PURE__ */ React.createElement("br", null), '"\uBAA8\uB974\uACA0\uC5B4\uC694"\uB3C4 \uC88B\uC740 \uCD9C\uBC1C\uC810\uC774\uC5D0\uC694.'), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, padding: "8px 14px", background: "var(--brand-50)", borderRadius: 999, fontSize: 12.5, color: "var(--brand-600)", fontWeight: 600 } }, "\uC131\uC801 \uC785\uB825\uC740 \uC5C6\uC5B4\uC694 \xB7 1\uBD84\uC774\uBA74 \uB05D\uB098\uC694")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 22px" } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", full: true, onClick: () => setPhase("chips") }, "\uC2DC\uC791\uD558\uAE30")));
  }
  if (phase === "chips") {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, marginBottom: 6 } }, ONB_STEPS.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, height: 4, borderRadius: 999, background: i <= step ? "var(--brand-500)" : "var(--line)" } }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, step + 1, " / ", ONB_STEPS.length)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "24px 24px 0", overflow: "auto" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.5px" }, className: "kr-heading" }, cur.q), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", marginTop: 8 }, className: "kr-heading" }, cur.sub), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 } }, cur.opts.map((opt) => {
      const on = isPicked(opt);
      const unknown = opt === "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694";
      return /* @__PURE__ */ React.createElement("button", { key: opt, onClick: () => pick(opt), style: {
        padding: "12px 18px",
        borderRadius: 14,
        cursor: "pointer",
        fontSize: 15,
        fontWeight: 600,
        border: `1.5px solid ${on ? "var(--brand-500)" : "var(--line-strong)"}`,
        background: on ? "var(--brand-500)" : unknown ? "var(--bg-muted)" : "var(--bg-surface)",
        color: on ? "#fff" : unknown ? "var(--fg-muted)" : "var(--fg-strong)",
        transition: "all 140ms var(--ease-std)"
      }, className: "kr-heading" }, unknown && !on && /* @__PURE__ */ React.createElement("span", { style: { marginRight: 4 } }, "\u{1F914}"), opt);
    })), cur.multi && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", marginTop: 14 } }, "\uC5EC\uB7EC \uAC1C \uC120\uD0DD\uD560 \uC218 \uC788\uC5B4\uC694"), cur.id === "field" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-default)", marginBottom: 8 } }, "\uAE30\uD0C0 (\uC9C1\uC811 \uC785\uB825)"), /* @__PURE__ */ React.createElement(TextInput, { value: other, onChange: (v) => {
      setOther(v);
      setAnswers((a) => ({ ...a, field_other: v }));
    }, placeholder: "\uC608) \uD56D\uACF5\xB7\uC6B0\uC8FC, \uC694\uB9AC, \uC2A4\uD3EC\uCE20 \uB4F1" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 22px", display: "flex", gap: 10 } }, step > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "xl", onClick: () => setStep((s) => s - 1), style: { flex: "0 0 92px" } }, "\uC774\uC804"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", full: true, disabled: !canNext, onClick: next }, step < ONB_STEPS.length - 1 ? "\uB2E4\uC74C" : "AI \uC0C1\uB2F4 \uC2DC\uC791")));
  }
  if (phase === "explain") {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => setPhase("chips") }) }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "8px 28px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7B61FF, #3182F6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 28 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 23, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.5px", lineHeight: 1.3 }, className: "kr-heading" }, "\uC7A0\uAE50, AI \uC0C1\uB2F4\uC774", /* @__PURE__ */ React.createElement("br", null), "\uC65C \uD544\uC694\uD560\uAE4C\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14.5, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.65 }, className: "kr-heading" }, "\uC9C4\uB85C\uB294 \uC810\uC218\uB85C \uC815\uD574\uC9C0\uC9C0 \uC54A\uC544\uC694. \uBB34\uC5C7\uC744 \uD560 \uB54C \uC990\uAC70\uC6B4\uC9C0, \uC5B4\uB5A4 \uAC78 \uC798\uD558\uB294\uC9C0 \uAC19\uC740 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-default)" } }, '"\uB2E8\uC11C"'), "\uAC00 \uBAA8\uC5EC\uC57C \uBC29\uD5A5\uC774 \uBCF4\uC5EC\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 24 } }, [
      { icon: /* @__PURE__ */ React.createElement(IcMessage, null), t: "\uD3B8\uD558\uAC8C \uB300\uD654\uD574\uC694", d: "\uC815\uB2F5\uC774 \uC5C6\uC5B4\uC694. \uB5A0\uC624\uB974\uB294 \uB300\uB85C \uB2F5\uD558\uBA74 \uB3FC\uC694." },
      { icon: /* @__PURE__ */ React.createElement(IcSparkles, null), t: "AI\uAC00 \uB2E8\uC11C\uB97C \uBAA8\uC544\uC694", d: "\uB300\uD654 \uC18D \uD765\uBBF8\xB7\uAC15\uC810\xB7\uAC00\uCE58\uB97C \uCC3E\uC544 \uC815\uB9AC\uD574\uC918\uC694." },
      { icon: /* @__PURE__ */ React.createElement(IcTarget, null), t: "\uBC29\uD5A5\uC744 \uD568\uAED8 \uC881\uD600\uC694", d: "\uB2E8\uC11C\uAC00 \uC313\uC774\uBA74 \uC5B4\uC6B8\uB9AC\uB294 \uC9C4\uB85C\uB97C \uC81C\uC548\uD574\uC694." }
    ].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 12, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, React.cloneElement(s.icon, { size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, s.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.5 }, className: "kr-heading" }, s.d))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, padding: 14, background: "var(--bg-muted)", borderRadius: 12, fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uB300\uD654 \uB0B4\uC6A9\uC740 \uBCF8\uC778\uACFC \uB2F4\uB2F9 \uC120\uC0DD\uB2D8\uB9CC \uBCFC \uC218 \uC788\uC5B4\uC694. \uBD80\uB2F4 \uAC16\uC9C0 \uB9D0\uACE0 \uC2DC\uC791\uD574\uBCF4\uC138\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 20px 22px" } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", full: true, onClick: () => setPhase("session"), leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 17 }) }, "\uB300\uD654 \uC2DC\uC791\uD558\uAE30")));
  }
  if (phase === "session") {
    return /* @__PURE__ */ React.createElement(FirstCounselingSession, { answers, onHandoff: () => setPhase("done"), onSkip: () => setPhase("done") });
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 72, height: 72, borderRadius: 22, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 40 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 23, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.5px", lineHeight: 1.3 }, className: "kr-heading" }, "\uC900\uBE44\uB410\uC5B4\uC694!", /* @__PURE__ */ React.createElement("br", null), "\uC774\uC81C \uB098\uB9CC\uC758 \uC9C4\uB85C \uC5EC\uC815\uC744 \uC2DC\uC791\uD574\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.6 }, className: "kr-heading" }, "\uC624\uB298 \uB098\uB208 \uB300\uD654\uB294 \uB300\uC2DC\uBCF4\uB4DC\uC5D0 \uC800\uC7A5\uB410\uC5B4\uC694.", /* @__PURE__ */ React.createElement("br", null), "\uC5B8\uC81C\uB4E0 \uC774\uC5B4\uC11C \uC0C1\uB2F4\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 22px" } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", full: true, onClick: onFinish }, "\uB300\uC2DC\uBCF4\uB4DC\uB85C \uAC00\uAE30")));
}
function FirstCounselingSession({ answers, onHandoff, onSkip }) {
  const grade = answers.grade && answers.grade !== "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694" ? answers.grade : null;
  const track = answers.track && answers.track !== "\uC544\uC9C1 \uBAA8\uB974\uACA0\uC5B4\uC694" ? answers.track : null;
  const ctx = [grade, track].filter(Boolean).join(" ");
  const opening = ctx ? `${ctx}\uAD6C\uB098. \uBD84\uC57C\uB294 \uC544\uC9C1 \uC815\uD558\uB294 \uC911\uC774\uC9C0? \uADF8\uAC70 \uAC19\uC774 \uCC3E\uC73C\uB824\uACE0 \uC628 \uAC70\uB2C8\uAE4C \uCC9C\uCC9C\uD788 \uBCF4\uC790.` : "\uC544\uC9C1 \uC9C4\uB85C\uAC00 \uB9C9\uB9C9\uD558\uAD6C\uB098. \uAD1C\uCC2E\uC544, \uADF8\uAC70 \uAC19\uC774 \uCC3E\uC73C\uB824\uACE0 \uC628 \uAC70\uB2C8\uAE4C \uCC9C\uCC9C\uD788 \uBCF4\uC790.";
  const SCRIPT = [
    { role: "ai", text: opening },
    { role: "ai", text: "\uBA3C\uC800 \uAC00\uBCCD\uAC8C \u2014 \uC694\uC998 \uBB50 \uD560 \uB54C \uC2DC\uAC04 \uAC00\uB294 \uC904 \uBAA8\uB974\uACA0\uC5B4?" }
  ];
  const FOLLOWUPS = [
    "\uC624 \uADF8\uAC70 \uC7AC\uBC0C\uC5C8\uACA0\uB2E4. \uADF8\uB54C \uC5B4\uB5A4 \uC810\uC774 \uC81C\uC77C \uC88B\uC558\uC5B4?",
    "\uC88B\uC544. \uADF8\uB7FC \uD559\uAD50 \uACFC\uBAA9 \uC911\uC5D0 \uADF8\uB098\uB9C8 \uB35C \uC2EB\uC740 \uAC74 \uBB50\uC57C?"
  ];
  const DIRECTION = "\uC598\uAE30 \uB4E4\uC5B4\uBCF4\uB2C8 \uBB34\uC5B8\uAC00\uB97C \uB9CC\uB4E4\uAC70\uB098 \uD45C\uD604\uD558\uB294 \uCABD\uC5D0 \uD765\uBBF8\uAC00 \uC788\uC5B4 \uBCF4\uC5EC. \uCF58\uD150\uCE20\xB7\uB514\uC790\uC778 \uAC19\uC740 \uBD84\uC57C\uB3C4 \uD55C \uBC88 \uBCFC \uB9CC\uD558\uACE0, \uAD00\uB828\uD574\uC11C \uC5B4\uB5A4 \uAE38\uC774 \uC788\uB294\uC9C0 \uCC9C\uCC9C\uD788 \uAC19\uC774 \uC0B4\uD3B4\uBCF4\uC790.";
  const [msgs, setMsgs] = React.useState(SCRIPT);
  const [input, setInput] = React.useState("");
  const [turn, setTurn] = React.useState(0);
  const [thinking, setThinking] = React.useState(false);
  const [handoff, setHandoff] = React.useState(false);
  const scRef = React.useRef(null);
  React.useEffect(() => {
    if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight;
  }, [msgs, thinking, handoff]);
  const send = (text) => {
    if (!text.trim() || handoff) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      if (turn < FOLLOWUPS.length) {
        setMsgs((m) => [...m, { role: "ai", text: FOLLOWUPS[turn] }]);
        setTurn((t) => t + 1);
      } else {
        setMsgs((m) => [...m, { role: "ai", text: DIRECTION }]);
        setTimeout(() => setHandoff(true), 600);
      }
    }, 1e3);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #7B61FF, #3182F6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "\uCCAB \uC9C4\uB85C \uC0C1\uB2F4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uD3B8\uD558\uAC8C \uB2F5\uD574\uB3C4 \uAD1C\uCC2E\uC544\uC694"))), /* @__PURE__ */ React.createElement("div", { ref: scRef, className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 8 } }, msgs.map((m, i) => {
    const isUser = m.role === "user";
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 6, alignItems: "flex-end" } }, !isUser && /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg, #7B61FF, #3182F6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "80%", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, background: isUser ? "var(--brand-500)" : "var(--bg-surface)", color: isUser ? "#fff" : "var(--fg-strong)", borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px", boxShadow: isUser ? "none" : "0 1px 2px rgba(0,0,0,0.04)" }, className: "kr-heading" }, m.text));
  }), thinking && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg, #7B61FF, #3182F6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "var(--bg-surface)", borderRadius: "4px 16px 16px 16px", display: "flex", gap: 4 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { width: 6, height: 6, borderRadius: "50%", background: "var(--fg-subtle)", animation: `bounce 1.2s ${i * 0.16}s infinite ease-in-out` } })), /* @__PURE__ */ React.createElement("style", null, `@keyframes bounce{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}`))), handoff && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, padding: 16, borderRadius: 16, background: "linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)", border: "1px solid rgba(49,130,246,0.15)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 15, color: "var(--brand-600)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--brand-600)" } }, "\uB2E4\uC74C \uB2E8\uACC4")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--fg-default)", lineHeight: 1.55, marginBottom: 14 }, className: "kr-heading" }, "\uB354 \uAD6C\uCCB4\uC801\uC778 \uD559\uACFC\xB7\uB300\uD559\uC744 \uCD94\uCC9C\uBC1B\uC73C\uB824\uBA74 \uC131\uC801\uC774 \uD544\uC694\uD574. \uC785\uB825\uD574\uC8FC\uBA74 \uB108\uD55C\uD14C \uB9DE\uB294 \uAC78 \uCD94\uB824\uC904\uAC8C."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcChart, { size: 16 }), onClick: onHandoff, style: { marginBottom: 8 } }, "\uC131\uC801 \uC785\uB825\uD558\uACE0 \uCD94\uCC9C\uBC1B\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", full: true, onClick: onSkip }, "\uC870\uAE08 \uB354 \uC598\uAE30\uD560\uB798"))), !handoff && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", background: "var(--bg-muted)", borderRadius: 24, padding: "6px 6px 6px 16px" } }, /* @__PURE__ */ React.createElement("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter") send(input);
  }, placeholder: "\uD3B8\uD558\uAC8C \uB2F5\uD574\uBCF4\uC138\uC694", style: { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, color: "var(--fg-strong)", minWidth: 0 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => send(input), disabled: !input.trim(), style: { width: 36, height: 36, borderRadius: "50%", border: "none", background: input.trim() ? "var(--brand-500)" : "var(--line-strong)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default" } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, overflow: "auto" }, className: "toss-scroll" }, ["\uC798 \uBAA8\uB974\uACA0\uC5B4\uC694", "\uC74C... \uAC8C\uC784\uC774\uC694", "\uC601\uC0C1 \uBCF4\uB294 \uAC70\uC694"].map((q) => /* @__PURE__ */ React.createElement("button", { key: q, onClick: () => send(q), style: { flexShrink: 0, border: "1px solid var(--line)", background: "var(--bg-surface)", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, color: "var(--fg-default)", cursor: "pointer", whiteSpace: "nowrap" } }, q)))));
}
function TeacherOnboarding({ onFinish }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    { icon: /* @__PURE__ */ React.createElement(IcSchool, null), title: "\uD559\uAE09\uC744 \uB9CC\uB4E4\uC5C8\uC5B4\uC694", body: "\uD55C\uBE5B\uACE0 2-3 \uD559\uAE09\uC774 \uC0DD\uC131\uB410\uC5B4\uC694. \uD559\uAD50\xB7\uD559\uAE09 \uC815\uBCF4\uB294 \uC5B8\uC81C\uB4E0 \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694." },
    { icon: /* @__PURE__ */ React.createElement(IcCopy, null), title: "\uCD08\uB300\uCF54\uB4DC\uB85C \uD559\uC0DD\uC744 \uCD08\uB300\uD574\uC694", body: "\uD559\uC0DD\uC774 \uD68C\uC6D0\uAC00\uC785 \uB54C \uCF54\uB4DC\uB97C \uC785\uB825\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uD559\uAE09\uC5D0 \uCC38\uC5EC\uD574\uC694. \uBB34\uB8CC \uCCB4\uD5D8 \uC911\uC5D0\uB3C4 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694." },
    { icon: /* @__PURE__ */ React.createElement(IcUsers, null), title: "\uD559\uC0DD \uD55C \uBA85\uC529 \uC0B4\uD3B4\uBD10\uC694", body: "\uC131\uC801 \uCD94\uC774, AI \uC9C4\uB85C \uB2E8\uC11C, \uD559\uC2B5 \uC9C4\uB3C4, \uC0C1\uB2F4 \uC694\uCCAD\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694." }
  ];
  const cur = steps[step];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px 0", display: "flex", gap: 5 } }, steps.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, height: 4, borderRadius: 999, background: i <= step ? "var(--accent-purple)" : "var(--line)" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: 24, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 } }, React.cloneElement(cur.icon, { size: 40 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 23, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.5px" }, className: "kr-heading" }, cur.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14.5, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.6 }, className: "kr-heading" }, cur.body)), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 22px" } }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "primary",
      size: "xl",
      full: true,
      style: { background: "var(--accent-purple)" },
      onClick: () => {
        if (step < steps.length - 1) setStep((s) => s + 1);
        else onFinish();
      }
    },
    step < steps.length - 1 ? "\uB2E4\uC74C" : "\uB300\uC2DC\uBCF4\uB4DC\uB85C \uAC00\uAE30"
  )));
}
Object.assign(window, { OnboardingFlow, FirstCounselingSession, TeacherOnboarding, ONB_STEPS, MobileCoachTour });
const MOBILE_TOUR = {
  student: [
    { sel: '[data-tour="mnav-dashboard"]', title: "\uD648", body: "\uC624\uB298\uC758 \uC9C4\uB85C \uC9C8\uBB38\xB7\uC131\uC801\xB7\uC774\uBC88 \uC8FC \uC561\uC158\uC744 \uD55C\uB208\uC5D0 \uBD10\uC694." },
    { sel: '[data-tour="mnav-grades-trend"]', title: "\uC131\uC801", body: "\uBAA8\uC758\uACE0\uC0AC\xB7\uB0B4\uC2E0 \uCD94\uC774\uC640 \uACFC\uBAA9\uBCC4 \uBD84\uC11D\uC744 \uD655\uC778\uD574\uC694." },
    { sel: '[data-tour="mnav-career-report"]', title: "\uC9C4\uB85C", body: "AI \uC0C1\uB2F4\uACFC \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uAC00 \uBAA8\uC774\uB294 \uD575\uC2EC \uBA54\uB274\uC608\uC694." },
    { sel: '[data-tour="mnav-calendar"]', title: "\uCE98\uB9B0\uB354", body: "\uC0C1\uB2F4\xB7\uC218\uD589\uD3C9\uAC00\xB7\uBAA8\uC758\uACE0\uC0AC \uC77C\uC815\uC774 \uBAA8\uB450 \uBAA8\uC5EC\uC694." },
    { sel: '[data-tour="mnav-profile"]', title: "\uB354\uBCF4\uAE30", body: "\uB0B4 \uC815\uBCF4\xB7\uAD6C\uB3C5\xB7\uACF5\uC9C0\uC0AC\uD56D\xB7\uAC74\uC758\uB97C \uC5EC\uAE30\uC11C \uCC3E\uC544\uC694." }
  ],
  teacher: [
    { sel: '[data-tour="mnav-dashboard"]', title: "\uD648", body: "\uD559\uAE09 \uC694\uC57D\uACFC \uC624\uB298 \uC8FC\uBAA9\uD560 \uD559\uC0DD\uC744 \uBD10\uC694." },
    { sel: '[data-tour="mnav-students"]', title: "\uD559\uC0DD", body: "\uD559\uC0DD\uBCC4 \uC131\uC801\xB7AI \uB9AC\uD3EC\uD2B8\xB7\uD559\uC2B5\uC744 \uAD00\uB9AC\uD574\uC694." },
    { sel: '[data-tour="mnav-completion"]', title: "\uD559\uC2B5", body: "\uD559\uAE09 \uC804\uCCB4 \uD559\uC2B5 \uC644\uB8CC \uD604\uD669\uC744 \uD655\uC778\uD574\uC694." },
    { sel: '[data-tour="mnav-messages"]', title: "\uBA54\uC2DC\uC9C0", body: "\uD559\uC0DD\uACFC 1:1 \uBA54\uC2DC\uC9C0\xB7\uC0C1\uB2F4 \uBA54\uBAA8\uB97C \uC8FC\uACE0\uBC1B\uC544\uC694." },
    { sel: '[data-tour="mnav-more"]', title: "\uB354\uBCF4\uAE30", body: "\uD559\uAE09\xB7\uCE98\uB9B0\uB354\xB7\uC54C\uB9BC\xB7\uACB0\uC81C\xB7\uB0B4 \uC815\uBCF4\uAC00 \uBAA8\uC5EC \uC788\uC5B4\uC694." }
  ]
};
function MobileCoachTour({ role = "student", onDone }) {
  const steps = MOBILE_TOUR[role] || MOBILE_TOUR.student;
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const last = i === steps.length - 1;
  React.useEffect(() => {
    const el = document.querySelector(steps[i].sel);
    if (el) {
      const r = el.getBoundingClientRect();
      const host = el.closest("[data-app-root]") || document.body;
      const hr = host.getBoundingClientRect();
      setRect({ left: r.left - hr.left, top: r.top - hr.top, width: r.width, height: r.height, bottom: r.bottom - hr.top });
    } else setRect(null);
  }, [i, role]);
  const s = steps[i];
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 90 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => last ? onDone() : setI(i + 1), style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.6)", animation: "fadeIn .2s ease" } }), rect && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: rect.left - 4, top: rect.top - 4, width: rect.width + 8, height: rect.height + 8, borderRadius: 12, boxShadow: "0 0 0 3px var(--brand-500), 0 0 0 9999px rgba(17,24,39,0.6)", pointerEvents: "none", transition: "all .25s var(--ease-toss)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 16, right: 16, bottom: rect ? `calc(100% - ${rect.top}px + 18px)` : 120, animation: "sheetIn .3s var(--ease-toss)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", background: "var(--bg-elevated)", borderRadius: 16, padding: 18, boxShadow: "var(--shadow-pop)" } }, rect && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "100%",
    left: Math.max(16, Math.min(rect.left + rect.width / 2 - 16, typeof window !== "undefined" ? 360 : 360)),
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "12px solid var(--bg-elevated)",
    filter: "drop-shadow(0 3px 2px rgba(17,24,39,0.12))"
  } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: "var(--fg-strong)" }, className: "kr-heading" }, s.title), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, color: "var(--fg-subtle)" } }, i + 1, "/", steps.length)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, s.body), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 16 } }, /* @__PURE__ */ React.createElement("button", { onClick: onDone, style: { border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "8px 4px" } }, "\uAC74\uB108\uB6F0\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), i > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "sm", onClick: () => setI(i - 1) }, "\uC774\uC804"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => last ? onDone() : setI(i + 1) }, last ? "\uC2DC\uC791\uD558\uAE30" : "\uB2E4\uC74C")))));
}
