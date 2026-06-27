function TourTooltip({ target, title, body, step, total, onNext, onPrev, onSkip, position = "right" }) {
  const [rect, setRect] = React.useState(null);
  const [containerRect, setContainerRect] = React.useState(null);
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    if (!target) return;
    const update = () => {
      var _a;
      const container = (_a = containerRef.current) == null ? void 0 : _a.parentElement;
      if (!container) return;
      const el = typeof target === "string" ? container.querySelector(target) : target;
      if (el) {
        const r = el.getBoundingClientRect();
        const cr = container.getBoundingClientRect();
        setContainerRect(cr);
        setRect({
          top: r.top - cr.top,
          left: r.left - cr.left,
          width: r.width,
          height: r.height
        });
      }
    };
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [target]);
  if (!rect) return /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { display: "none" } });
  const W = 280;
  let style = {};
  let arrowStyle = {};
  if (position === "right") {
    style = { top: rect.top + rect.height / 2 - 40, left: rect.left + rect.width + 16, width: W };
    arrowStyle = { position: "absolute", top: 28, left: -8, width: 16, height: 16, background: "var(--bg-elevated)", transform: "rotate(45deg)", boxShadow: "-2px 2px 4px rgba(0,0,0,0.04)" };
  } else if (position === "left") {
    style = { top: rect.top + rect.height / 2 - 40, left: rect.left - W - 16, width: W };
    arrowStyle = { position: "absolute", top: 28, right: -8, width: 16, height: 16, background: "var(--bg-elevated)", transform: "rotate(45deg)", boxShadow: "2px -2px 4px rgba(0,0,0,0.04)" };
  } else if (position === "top") {
    style = { top: rect.top - 12 - 180, left: rect.left + rect.width / 2 - W / 2, width: W };
    arrowStyle = { position: "absolute", bottom: -8, left: W / 2 - 8, width: 16, height: 16, background: "var(--bg-elevated)", transform: "rotate(45deg)", boxShadow: "2px 2px 4px rgba(0,0,0,0.04)" };
  } else {
    style = { top: rect.top + rect.height + 16, left: rect.left + rect.width / 2 - W / 2, width: W };
    arrowStyle = { position: "absolute", top: -8, left: W / 2 - 8, width: 16, height: 16, background: "var(--bg-elevated)", transform: "rotate(45deg)", boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)" };
  }
  const M = 8;
  const bubbleH = 200;
  const cw = containerRect && containerRect.width || (typeof window !== "undefined" ? window.innerWidth : W + 2 * M);
  const ch = containerRect && containerRect.height || (typeof window !== "undefined" ? window.innerHeight : bubbleH + 2 * M);
  if (typeof style.left === "number") {
    style.left = Math.max(M, Math.min(style.left, cw - W - M));
  }
  if (typeof style.top === "number") {
    style.top = Math.max(M, Math.min(style.top, ch - bubbleH - M));
  }
  return /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 199 } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "rgba(17,24,39,0.55)",
    pointerEvents: "auto"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: rect.top - 6,
    left: rect.left - 6,
    width: rect.width + 12,
    height: rect.height + 12,
    borderRadius: 12,
    boxShadow: "inset 0 0 0 3px rgba(49,130,246,0.6)",
    background: "rgba(49,130,246,0.08)",
    pointerEvents: "none",
    animation: "tourPulse 1.6s ease-in-out infinite"
  } }), /* @__PURE__ */ React.createElement("style", null, `@keyframes tourPulse { 0%, 100% { box-shadow: inset 0 0 0 3px rgba(49,130,246,0.6); } 50% { box-shadow: inset 0 0 0 5px rgba(49,130,246,0.35); } }`), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    ...style,
    background: "var(--bg-elevated)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "var(--shadow-pop)",
    animation: "fadeIn 220ms var(--ease-toss)",
    pointerEvents: "auto"
  } }, /* @__PURE__ */ React.createElement("div", { style: arrowStyle }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uAC00\uC774\uB4DC ", step, "/", total)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, body), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 } }, /* @__PURE__ */ React.createElement("button", { onClick: onSkip, style: { background: "transparent", border: "none", color: "var(--fg-subtle)", fontSize: 12, cursor: "pointer" } }, "\uAC74\uB108\uB6F0\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, step > 1 && /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm", onClick: onPrev }, "\uC774\uC804"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: onNext, trailing: step === total ? /* @__PURE__ */ React.createElement(IcCheck, { size: 14 }) : /* @__PURE__ */ React.createElement(IcArrowRight, { size: 14 }) }, step === total ? "\uC2DC\uC791\uD558\uAE30" : "\uB2E4\uC74C"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, justifyContent: "center", marginTop: 10 } }, Array.from({ length: total }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
    width: i === step - 1 ? 18 : 6,
    height: 6,
    borderRadius: 999,
    background: i === step - 1 ? "var(--brand-500)" : "var(--line-strong)",
    transition: "all 240ms var(--ease-toss)"
  } })))));
}
function WelcomeModal({ onStart, onSkip, role = "student" }) {
  const [meName, setMeName] = React.useState("");
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!window.__apiFetch) return;
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        const nm = r && (r.data ? r.data.name : r.name) || "";
        if (alive) setMeName(nm);
      } catch (e) {
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const honorific = role === "teacher" ? " \uC120\uC0DD\uB2D8" : "\uB2D8";
  const greeting = {
    name: meName ? meName + honorific : role === "teacher" ? "\uC120\uC0DD\uB2D8" : "",
    tag: { student: "\uD559\uC0DD", teacher: "\uAD50\uC0AC", admin: "Super Admin" }[role] || "\uD559\uC0DD"
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)", animation: "fadeIn 240ms var(--ease-std)" } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: "min(460px, 100%)",
    background: "var(--bg-elevated)",
    borderRadius: 24,
    padding: 32,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: "linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    boxShadow: "0 12px 28px rgba(49,130,246,0.32)"
  } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 36 })), /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { marginBottom: 12 } }, greeting.tag), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)", margin: 0, marginBottom: 8, letterSpacing: "-0.5px" }, className: "kr-heading" }, "\uD658\uC601\uD574\uC694", greeting.name ? ", " + greeting.name : "", "!"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0, marginBottom: 24 }, className: "kr-heading" }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC744 \uCC98\uC74C \uC0AC\uC6A9\uD558\uC2DC\uB294\uAD70\uC694. 1\uBD84 \uC548\uC5D0 \uC8FC\uC694 \uAE30\uB2A5\uC744 \uD55C \uBC14\uD034 \uC548\uB0B4\uD574\uB4DC\uB9B4\uAC8C\uC694. \uBA54\uB274\uB9C8\uB2E4 \uC5B4\uB514\uC11C \uBB34\uC5C7\uC744 \uD560 \uC218 \uC788\uB294\uC9C0 \uC54C\uB824\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }), onClick: onStart }, "1\uBD84 \uAC00\uC774\uB4DC \uC2DC\uC791\uD558\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", full: true, onClick: onSkip }, "\uB2E4\uC74C\uC5D0 \uD560\uAC8C\uC694")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 11, color: "var(--fg-subtle)" }, className: "kr-heading" }, "\uC774 \uC548\uB0B4\uB294 \uCC98\uC74C \uD55C \uBC88\uB9CC \uD45C\uC2DC\uB3FC\uC694. \uB098\uC911\uC5D0 \uB0B4\uC815\uBCF4 \u2192 \uB3C4\uC6C0\uB9D0\uC5D0\uC11C \uB2E4\uC2DC \uBCFC \uC218 \uC788\uC5B4\uC694.")));
}
function useTour(steps, role = "student") {
  const [phase, setPhase] = React.useState("welcome");
  const [step, setStep] = React.useState(1);
  const next = () => {
    if (step >= steps.length) setPhase("done");
    else setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const skip = () => setPhase("done");
  const restart = () => {
    setStep(1);
    setPhase("welcome");
  };
  const current = steps[step - 1];
  return { phase, setPhase, step, next, prev, skip, restart, current, total: steps.length, role };
}
function TourPanel({ tour, onPickScreen }) {
  const isMobile = useViewportMobile();
  const CARDS = tour.role === "teacher" ? TEACHER_TOUR_CARDS : STUDENT_TOUR_CARDS;
  const visitedKey = `jinro:tourvisited:${tour.role}`;
  const [visited, setVisited] = React.useState(() => {
    try {
      const raw = localStorage.getItem(visitedKey);
      return raw ? new Set(JSON.parse(raw)) : /* @__PURE__ */ new Set();
    } catch (e) {
      return /* @__PURE__ */ new Set();
    }
  });
  const markVisited = (id) => {
    setVisited((v) => {
      const next = new Set(v);
      next.add(id);
      try {
        localStorage.setItem(visitedKey, JSON.stringify([...next]));
      } catch (e) {
      }
      return next;
    });
  };
  const pick = (card) => {
    markVisited(card.id);
    if (onPickScreen && card.screen) onPickScreen(card.screen);
    tour.setPhase("done");
  };
  const finishedCount = CARDS.filter((c) => visited.has(c.id)).length;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 24 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.6)", animation: "fadeIn 240ms var(--ease-std)" } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: "min(720px, 100%)",
    maxHeight: "92%",
    background: "var(--bg-elevated)",
    borderRadius: 24,
    padding: isMobile ? 20 : 28,
    boxShadow: "var(--shadow-pop)",
    overflow: "auto",
    animation: "sheetIn 320ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 26 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: isMobile ? 18 : 22, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.4px" }, className: "kr-heading" }, "\uC9C4\uB85C\uB098\uCE68\uBC18 \uB458\uB7EC\uBCF4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }, className: "kr-heading" }, "\uAD81\uAE08\uD55C \uAE30\uB2A5\uC744 \uACE8\uB77C \uBC14\uB85C \uAC00\uBCF4\uC138\uC694. ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--brand-600)" } }, finishedCount, "/", CARDS.length), " \uB458\uB7EC\uBD24\uC5B4\uC694.")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => tour.setPhase("done"),
      "aria-label": "\uB2EB\uAE30",
      style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--fg-muted)", padding: 6, flexShrink: 0 }
    },
    /* @__PURE__ */ React.createElement(IcX, { size: 20 })
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 10 } }, CARDS.map((c) => {
    const done = visited.has(c.id);
    return /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => pick(c), style: {
      textAlign: "left",
      padding: 14,
      borderRadius: 14,
      cursor: "pointer",
      border: "1px solid " + (done ? "var(--brand-200, var(--line))" : "var(--line)"),
      background: done ? "var(--brand-50)" : "var(--bg-surface)",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      transition: "all 160ms var(--ease-std)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: done ? "var(--brand-500)" : "var(--bg-muted)",
      color: done ? "#fff" : "var(--brand-600)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    } }, c.icon ? React.cloneElement(c.icon, { size: 20 }) : /* @__PURE__ */ React.createElement(IcSparkles, { size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, c.title), done && /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 13, color: "var(--brand-500)" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 }, className: "kr-heading" }, c.body)));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)" }, className: "kr-heading" }, "\uB098\uC911\uC5D0 \uB0B4\uC815\uBCF4 \u2192 \uB3C4\uC6C0\uB9D0\uC5D0\uC11C \uB2E4\uC2DC \uBCFC \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: () => tour.setPhase("done"), trailing: /* @__PURE__ */ React.createElement(IcCheck, { size: 14 }) }, "\uB458\uB7EC\uBCF4\uAE30 \uC644\uB8CC"))));
}
function TourOverlay({ tour, onPickScreen }) {
  if (tour.phase === "done") return null;
  if (tour.phase === "welcome") {
    return /* @__PURE__ */ React.createElement(WelcomeModal, { role: tour.role, onStart: () => tour.setPhase("tour"), onSkip: () => tour.setPhase("done") });
  }
  if (tour.phase === "tour") {
    return /* @__PURE__ */ React.createElement(TourPanel, { tour, onPickScreen });
  }
  return null;
}
const STUDENT_TOUR_CARDS = [
  { id: "ai", screen: "ai-counseling", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), title: "AI \uC9C4\uB85C \uC0C1\uB2F4", body: "\uC9C4\uB85C \uACE0\uBBFC\uC744 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uB300\uD654\uB85C \uD480\uC5B4\uAC00\uB294 \uD575\uC2EC. AI\uAC00 \uB2E8\uC11C\uB97C \uBAA8\uC544 \uAC00\uC124\uC744 \uC138\uC6CC\uC918\uC694." },
  { id: "targets", screen: "career-targets", icon: /* @__PURE__ */ React.createElement(IcTarget, null), title: "\uC9C4\uB85C \uBAA9\uD45C", body: "\uAD00\uC2EC \uC9C1\uC5C5\xB7\uD559\uACFC\uB97C \uB4F1\uB85D\uD558\uACE0 \uBE44\uAD50\uD574\uC694. \uBCC4 \u2605\uB85C \uC785\uC2DC \uD76C\uB9DD\uB3C4 \uBAA8\uC544\uB46C\uC694." },
  { id: "admissions", screen: "admissions-hub", icon: /* @__PURE__ */ React.createElement(IcGraduation, null), title: "\uB300\uD559\xB7\uC785\uC2DC", body: '\uC804\uAD6D \uB300\uD559\xB7\uD559\uACFC\uB97C \uAC80\uC0C9\uD558\uACE0 \uACBD\uC7C1\uB960\xB7\uCDA9\uC6D0\uC728\uC744 \uD655\uC778. \uD559\uACFC\uBA85("\uC57D\uD559")\uB3C4 \uAC80\uC0C9\uB3FC\uC694.' },
  { id: "grades", screen: "grades-trend", icon: /* @__PURE__ */ React.createElement(IcChart, null), title: "\uC131\uC801 \uC785\uB825 & \uCD94\uC774", body: "\uBAA8\uC758\uACE0\uC0AC\xB7\uB0B4\uC2E0\uC744 \uC785\uB825\uD558\uBA74 \uCD94\uC774\uAC00 \uADF8\uB824\uC9C0\uACE0 AI \uC0C1\uB2F4\uC5D0\uB3C4 \uBC18\uC601\uB3FC\uC694." },
  { id: "study", screen: "study-plan", icon: /* @__PURE__ */ React.createElement(IcBook, null), title: "\uD559\uC2B5 \uACC4\uD68D", body: "\uC8FC\uAC04 \uACC4\uD68D\xB7\uC790\uC2B5 \uD0C0\uC784\uC5B4\uD0DD. \uC644\uB8CC\uD558\uBA74 \uC9C4\uB3C4\uC5D0 \uC790\uB3D9 \uBC18\uC601\uB3FC\uC694." },
  { id: "counseling", screen: "counseling", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", body: "\uB2F4\uC784 \uC120\uC0DD\uB2D8 \uC0C1\uB2F4 \uC694\uCCAD + AI \uC0C1\uB2F4 \uAE30\uB85D\uC744 \uD55C \uACF3\uC5D0\uC11C." },
  { id: "calendar", screen: "calendar", icon: /* @__PURE__ */ React.createElement(IcCalendar, null), title: "\uCE98\uB9B0\uB354", body: "\uC0C1\uB2F4\xB7\uD559\uC2B5 \uB9C8\uAC10\xB7\uBD09\uC0AC\xB7\uC785\uC2DC \uC77C\uC815\uC744 \uD55C \uACF3\uC5D0. \uFF0B\uB85C \uC77C\uC815 \uCD94\uAC00\uB3C4 \uAC00\uB2A5." }
];
const TEACHER_TOUR_CARDS = [
  { id: "classroom", screen: "classroom", icon: /* @__PURE__ */ React.createElement(IcSchool, null), title: "\uD559\uAE09 + \uCD08\uB300\uCF54\uB4DC", body: "6\uC790\uB9AC \uCD08\uB300\uCF54\uB4DC\uB97C \uD559\uC0DD\uC5D0\uAC8C \uC54C\uB824\uC8FC\uBA74 \uC790\uB3D9 \uD569\uB958. \uCD5C\uB300 30\uBA85 \uAD00\uB9AC." },
  { id: "students", screen: "students", icon: /* @__PURE__ */ React.createElement(IcUsers, null), title: "\uD559\uC0DD \uAD00\uB9AC", body: "\uD559\uAE09 \uD559\uC0DD\uB4E4\uC758 \uC131\uC801\xB7AI \uB9AC\uD3EC\uD2B8\xB7\uD559\uC2B5 \uC9C4\uB3C4\uB97C \uD55C\uB208\uC5D0. \uAC80\uC0C9\xB7\uD544\uD130." },
  { id: "ai-coach", screen: "ai-coach", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), title: "AI \uC0C1\uB2F4 \uCF54\uCE6D", body: "\uD559\uC0DD\uBCC4 \uB300\uD654\uCC3D \u2014 AI\uAC00 \uADF8 \uD559\uC0DD \uC131\uC801/\uB2E8\uC11C/\uC9C4\uB85C \uBAA9\uD45C\uB97C \uC790\uB3D9\uC73C\uB85C \uBCF4\uACE0 \uB2F5\uD574\uC694." },
  { id: "completion", screen: "completion", icon: /* @__PURE__ */ React.createElement(IcCheck, null), title: "\uD559\uC2B5 \uC644\uB8CC \uD604\uD669", body: "\uD559\uAE09 \uC8FC\uAC04 \uD559\uC2B5 \uC644\uB8CC\uC728\uC744 \uBCF4\uACE0, \uB4A4\uCC98\uC9C0\uB294 \uD559\uC0DD\uC744 \uBE60\uB974\uAC8C \uC0C1\uB2F4." },
  { id: "counseling", screen: "counseling", icon: /* @__PURE__ */ React.createElement(IcClipboard, null), title: "\uC0C1\uB2F4 \xB7 \uAE30\uB85D", body: "\uC0C1\uB2F4 \uC694\uCCAD \uC218\uB77D\xB7\uCC98\uB9AC + \uD559\uAE09 \uC0C1\uB2F4 \uAE30\uB85D \uAC80\uC0C9." },
  { id: "messages", screen: "messages", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uBA54\uC2DC\uC9C0 & \uBA54\uBAA8", body: "\uD559\uC0DD\uACFC 1:1 \uBA54\uC2DC\uC9C0 + \uC0C1\uB2F4 \uBA54\uBAA8 + \uC0C1\uB2F4 \uC608\uC57D \uD55C \uD654\uBA74." },
  { id: "calendar", screen: "calendar", icon: /* @__PURE__ */ React.createElement(IcCalendar, null), title: "\uCE98\uB9B0\uB354", body: "\uC0C1\uB2F4 \uC77C\uC815\xB7\uD559\uC0AC \uC77C\uC815 \uAD00\uB9AC. \uFF0B\uB85C \uC77C\uC815 \uCD94\uAC00 + \uD559\uC0DD \uC54C\uB9BC." }
];
const STUDENT_TOUR_STEPS = STUDENT_TOUR_CARDS.map((c) => ({ title: c.title, body: c.body, screen: c.screen }));
const TEACHER_TOUR_STEPS = TEACHER_TOUR_CARDS.map((c) => ({ title: c.title, body: c.body, screen: c.screen }));
const FEEDBACK_TYPES = [
  { id: "bug", label: "\u{1F41B} \uBC84\uADF8 \uC81C\uBCF4", desc: "\uC624\uB958, \uAE68\uC9C4 \uD654\uBA74, \uC548 \uB418\uB294 \uAE30\uB2A5" },
  { id: "suggestion", label: "\u{1F4A1} \uAE30\uB2A5 \uAC74\uC758", desc: "\uC788\uC73C\uBA74 \uC88B\uC744 \uAE30\uB2A5\uC774 \uC788\uC5B4\uC694" },
  { id: "question", label: "\u2753 \uC0AC\uC6A9\uBC95 \uBB38\uC758", desc: "\uC0AC\uC6A9 \uC911 \uB9C9\uD78C \uBD80\uBD84\uC774 \uC788\uC5B4\uC694" },
  { id: "praise", label: "\u{1F48C} \uCE6D\uCC2C/\uAC10\uC0AC", desc: "\uC88B\uC740 \uC810\uC744 \uC54C\uB824\uC8FC\uC138\uC694" }
];
const SEVERITY = [
  { id: "low", label: "\uB0AE\uC74C", desc: "\uC57D\uAC04 \uBD88\uD3B8\uD55C \uC815\uB3C4", tone: "success" },
  { id: "mid", label: "\uBCF4\uD1B5", desc: "\uC0AC\uC6A9\uD558\uAE30 \uC5B4\uB824\uC6CC\uC694", tone: "warning" },
  { id: "high", label: "\uB192\uC74C", desc: "\uC11C\uBE44\uC2A4\uB97C \uBABB \uC4F0\uACA0\uC5B4\uC694", tone: "danger" }
];
function FeedbackButton({ position = "bottom-right" }) {
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      "data-tour": "feedback",
      onClick: () => setOpen(true),
      style: {
        position: "absolute",
        zIndex: 90,
        right: 20,
        bottom: 20,
        padding: "12px 18px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        background: "var(--fg-strong)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "var(--shadow-elevated)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "transform 120ms"
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
      onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)"
    },
    /* @__PURE__ */ React.createElement(IcMessage, { size: 14 }),
    "\uAC74\uC758 / \uBC84\uADF8 \uC81C\uBCF4"
  ), open && /* @__PURE__ */ React.createElement(FeedbackDialog, { onClose: () => setOpen(false) }));
}
function FeedbackDialog({ onClose }) {
  const [type, setType] = React.useState("bug");
  const [severity, setSeverity] = React.useState("mid");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [where, setWhere] = React.useState("");
  const [attach, setAttach] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const canSubmit = title.trim() && body.trim();
  if (submitted) {
    return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 220, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "min(440px,100%)", background: "var(--bg-elevated)", borderRadius: 20, padding: 32, textAlign: "center", boxShadow: "var(--shadow-pop)", animation: "sheetIn 280ms var(--ease-toss)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 18, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 32 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)", marginBottom: 8 }, className: "kr-heading" }, "\uC798 \uBC1B\uC558\uC5B4\uC694!"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 20 }, className: "kr-heading" }, "\uC18C\uC911\uD55C \uC758\uACAC \uAC10\uC0AC\uD569\uB2C8\uB2E4. \uAC00\uC785\uD55C \uC774\uBA54\uC77C\uB85C \uCC98\uB9AC \uACB0\uACFC\uB97C \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694. \uD3C9\uADE0 24\uC2DC\uAC04 \uB0B4\uC5D0 \uB2F5\uBCC0\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "var(--bg-muted)", borderRadius: 10, fontSize: 11, color: "var(--fg-muted)", marginBottom: 20 }, className: "num" }, "\uD2F0\uCF13 \uBC88\uD638 \xB7 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-strong)" } }, "FB-2026-0517-3814")), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, onClick: onClose }, "\uD655\uC778")));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 220, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)", animation: "fadeIn 240ms" } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: "min(540px, 100%)",
    maxHeight: "90vh",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 28,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)" }, className: "kr-heading" }, "\uAC74\uC758 / \uBC84\uADF8 \uC81C\uBCF4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 4 }, className: "kr-heading" }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC744 \uB354 \uC88B\uC740 \uC11C\uBE44\uC2A4\uB85C \uB9CC\uB4E4\uC5B4\uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC5B4\uB5A4 \uB0B4\uC6A9\uC778\uAC00\uC694?", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 } }, FEEDBACK_TYPES.map((t) => {
    const active = type === t.id;
    return /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setType(t.id), style: {
      textAlign: "left",
      padding: "12px 14px",
      border: "1px solid",
      borderColor: active ? "var(--brand-500)" : "var(--line)",
      background: active ? "var(--brand-50)" : "var(--bg-surface)",
      borderRadius: 12,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: active ? "var(--brand-600)" : "var(--fg-strong)", marginBottom: 2 } }, t.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" }, className: "kr-heading" }, t.desc));
  }))), type === "bug" && /* @__PURE__ */ React.createElement(FormField, { label: "\uC2EC\uAC01\uB3C4", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 } }, SEVERITY.map((s) => {
    const active = severity === s.id;
    return /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => setSeverity(s.id), style: {
      textAlign: "left",
      padding: "10px 12px",
      border: "1px solid",
      borderColor: active ? `var(--${s.tone})` : "var(--line)",
      background: active ? `var(--${s.tone}-bg)` : "var(--bg-surface)",
      borderRadius: 10,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: active ? `var(--${s.tone})` : "var(--fg-strong)" } }, s.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, s.desc));
  }))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC81C\uBAA9", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: title, onChange: setTitle, placeholder: type === "bug" ? "\uC608) AI \uC0C1\uB2F4 \uD654\uBA74\uC774 \uBA48\uCDB0\uC694" : "\uC608) \uD559\uC2B5 \uC54C\uB9BC\uC744 \uCE74\uCE74\uC624\uD1A1\uC73C\uB85C \uBC1B\uACE0 \uC2F6\uC5B4\uC694" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBC1C\uC0DD \uC704\uCE58", hint: "\uC120\uD0DD \xB7 \uC5B4\uB290 \uD654\uBA74\uC5D0\uC11C \uC77C\uC5B4\uB0AC\uB098\uC694?", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: where, onChange: setWhere, placeholder: "\uC608) \uD559\uC0DD \uB300\uC2DC\uBCF4\uB4DC / AI \uC0C1\uB2F4 \uD654\uBA74" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC790\uC138\uD55C \uB0B4\uC6A9", required: true, hint: "\uBC84\uADF8 \uC81C\uBCF4\uC758 \uACBD\uC6B0 \uC7AC\uD604 \uB2E8\uACC4\uB97C \uD568\uAED8 \uC801\uC5B4\uC8FC\uC138\uC694", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 5, placeholder: type === "bug" ? "1. \uC5B4\uB5A4 \uD589\uB3D9\uC744 \uD588\uACE0\n2. \uC5B4\uB5A4 \uACB0\uACFC\uB97C \uAE30\uB300\uD588\uACE0\n3. \uC2E4\uC81C\uB85C\uB294 \uC5B4\uB5A4 \uC77C\uC774 \uC77C\uC5B4\uB0AC\uB294\uC9C0" : "\uC790\uC720\uB86D\uAC8C \uC801\uC5B4\uC8FC\uC138\uC694" })), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, padding: 12, background: "var(--bg-muted)", borderRadius: 10, cursor: "pointer", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: attach, onChange: () => setAttach((a) => !a), style: { width: 16, height: 16, accentColor: "var(--brand-500)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-strong)" } }, "\uC9C4\uB2E8 \uC815\uBCF4 \uD568\uAED8 \uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 }, className: "kr-heading" }, "\uD604\uC7AC \uD654\uBA74 URL, \uBE0C\uB77C\uC6B0\uC800 \uC815\uBCF4, \uB85C\uADF8\uC778 ID. \uBB38\uC81C \uD574\uACB0\uC5D0 \uB3C4\uC6C0\uC774 \uB3FC\uC694."))), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--info-bg)", borderRadius: 10, fontSize: 11, color: "var(--brand-600)", lineHeight: 1.5, marginBottom: 20 }, className: "kr-heading" }, "\uB2F5\uBCC0\uC740 \uAC00\uC785\uD55C \uC774\uBA54\uC77C\uB85C \uBCF4\uB0B4\uB4DC\uB824\uC694. \uAE34\uAE09\uD55C \uACBD\uC6B0 \uACE0\uAC1D\uC13C\uD130 1599-0000 (\uD3C9\uC77C 09~18\uC2DC)\uC73C\uB85C \uBB38\uC758\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, disabled: !canSubmit, onClick: () => setSubmitted(true) }, "\uC81C\uCD9C\uD558\uAE30"))));
}
function HelpCenterCard({ onTour, onFeedback }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 12 } }, "\uB3C4\uC6C0\uB9D0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 })),
      title: "\uAC00\uC774\uB4DC \uD22C\uC5B4 \uB2E4\uC2DC \uBCF4\uAE30",
      subtitle: "\uCC98\uC74C \uB4E4\uC5B4\uC654\uC744 \uB54C \uBCF8 \uC548\uB0B4\uB97C \uB2E4\uC2DC \uBD10\uC694",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: onTour
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 16 })),
      title: "\uAC74\uC758 / \uBC84\uADF8 \uC81C\uBCF4",
      subtitle: "\uBD88\uD3B8\uD55C \uC810\uC774\uB098 \uC758\uACAC\uC744 \uC54C\uB824\uC8FC\uC138\uC694",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: onFeedback,
      divider: false
    }
  )));
}
Object.assign(window, {
  TourTooltip,
  WelcomeModal,
  TourOverlay,
  useTour,
  STUDENT_TOUR_STEPS,
  TEACHER_TOUR_STEPS,
  FeedbackButton,
  FeedbackDialog,
  HelpCenterCard
});
