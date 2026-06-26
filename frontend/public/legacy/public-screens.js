function LandingPage({ variant = "A", onNav }) {
  const nav = onNav || (() => {
  });
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100%",
    background: "#fff",
    fontFamily: "var(--font-sans)",
    color: "var(--fg-strong)",
    overflow: "auto"
  }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement(LandingNav, { onNav: nav }), variant === "A" ? /* @__PURE__ */ React.createElement(LandingHeroA, { onNav: nav }) : /* @__PURE__ */ React.createElement(LandingHeroB, { onNav: nav }), /* @__PURE__ */ React.createElement(LandingApproach, null), "           ", /* @__PURE__ */ React.createElement(LandingDataSources, null), "        ", /* @__PURE__ */ React.createElement(LandingProductCards, null), /* @__PURE__ */ React.createElement(LandingFeatureCards, null), "       ", /* @__PURE__ */ React.createElement(LandingStudentValue, null), /* @__PURE__ */ React.createElement(LandingTeacherValue, null), /* @__PURE__ */ React.createElement(LandingAiSafety, null), "           ", /* @__PURE__ */ React.createElement(LandingSecurity, null), /* @__PURE__ */ React.createElement(LandingPricing, { onNav: nav }), /* @__PURE__ */ React.createElement(LandingFinalCTA, { onNav: nav }), /* @__PURE__ */ React.createElement(LandingFooter, null));
}
function LandingNav({ onNav = () => {
} }) {
  return /* @__PURE__ */ React.createElement("nav", { style: {
    padding: "16px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--line-subtle)",
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(20px)",
    zIndex: 10
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 18, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.3px" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", onClick: () => onNav("auth", "student", "login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", onClick: () => onNav("auth", "student", "signup") }, "\uC2DC\uC791\uD558\uAE30")));
}
function LandingHeroA({ onNav = () => {
} }) {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "96px 40px 80px", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "lg", style: { marginBottom: 20 } }, "AI \uC9C4\uB85C \uC0C1\uB2F4 \xB7 \uD559\uC0DD/\uAD50\uC0AC \uD1B5\uD569"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontSize: 56,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-1.5px",
    color: "var(--fg-strong)",
    margin: 0,
    marginBottom: 20
  }, className: "kr-heading" }, "\uC131\uC801\uACFC \uB300\uD654\uB97C \uBC14\uD0D5\uC73C\uB85C", /* @__PURE__ */ React.createElement("br", null), "\uC9C4\uB85C\uB97C \uD568\uAED8 \uCC3E\uB294", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { background: "linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } }, "AI \uC9C4\uB85C \uB098\uCE68\uBC18")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 17, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0, marginBottom: 32, maxWidth: 460 }, className: "kr-heading" }, "\uD559\uC0DD\uC740 \uC790\uC2E0\uC758 \uD765\uBBF8\xB7\uAC15\uC810\xB7\uC131\uC801\uC744 \uBC14\uD0D5\uC73C\uB85C \uC9C4\uB85C\uB97C \uD0D0\uC0C9\uD558\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uAD50\uC0AC\uB294 \uD559\uAE09 \uC804\uCCB4\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uC0B4\uD3B4\uBCFC \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", trailing: /* @__PURE__ */ React.createElement(IcArrowRight, { size: 18 }), onClick: () => onNav("auth", "student", "signup") }, "\uD559\uC0DD\uC73C\uB85C \uC2DC\uC791\uD558\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "xl", onClick: () => onNav("auth", "teacher", "signup") }, "\uAD50\uC0AC\uB85C \uC2DC\uC791\uD558\uAE30")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, marginTop: 28, fontSize: 13, color: "var(--fg-muted)" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcCheck, { size: 14, color: "var(--success)" }), " \uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcCheck, { size: 14, color: "var(--success)" }), " \uC2E0\uC6A9\uCE74\uB4DC \uB4F1\uB85D \uC5C6\uC774 \uC2DC\uC791"), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcCheck, { size: 14, color: "var(--success)" }), " \uD559\uAD50 \uB2E8\uC704 \uB3C4\uC785 \uAC00\uB2A5"))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(HeroVisual, null)));
}
function LandingHeroB({ onNav = () => {
} }) {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "120px 40px 80px", maxWidth: 880, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "lg", style: { marginBottom: 28 } }, "AI \uC9C4\uB85C \uC0C1\uB2F4 \uC11C\uBE44\uC2A4"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontSize: 64,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-1.8px",
    color: "var(--fg-strong)",
    margin: 0,
    marginBottom: 24
  }, className: "kr-heading" }, "\uC9C4\uB85C \uACE0\uBBFC\uC5D0 \uB2F5\uC774 \uD544\uC694\uD560 \uB54C,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { background: "linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } }, "\uB300\uD654\uB85C \uC2DC\uC791\uD558\uC138\uC694")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 18, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0, marginBottom: 36, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }, className: "kr-heading" }, "\uD765\uBBF8\xB7\uAC15\uC810\xB7\uC131\uC801\uC744 \uC885\uD569\uD574 \uC9C4\uB85C \uAC00\uC124\uC744 \uB9CC\uB4E4\uC5B4\uC8FC\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uC120\uC0DD\uB2D8\uC774 \uD559\uAE09 \uC804\uCCB4\uB97C \uC0B4\uD53C\uBA70 \uD568\uAED8 \uAE38\uC744 \uC548\uB0B4\uD574\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 56 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", trailing: /* @__PURE__ */ React.createElement(IcArrowRight, { size: 18 }), onClick: () => onNav("auth", "student", "signup") }, "\uBB34\uB8CC \uCCB4\uD5D8 \uC2DC\uC791\uD558\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "xl", onClick: () => onNav("auth", "student", "login") }, "\uC11C\uBE44\uC2A4 \uC18C\uAC1C")), /* @__PURE__ */ React.createElement(HeroVisual, null));
}
function HeroVisual() {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 420 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, overflow: "hidden", borderRadius: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 320, height: 320, top: -80, right: -80, borderRadius: "50%", background: "radial-gradient(circle, rgba(49,130,246,0.18) 0%, transparent 70%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", width: 280, height: 280, bottom: -80, left: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.15) 0%, transparent 70%)" } })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    right: 60,
    top: 30,
    bottom: 30,
    width: 220,
    borderRadius: 32,
    background: "#fff",
    boxShadow: "0 28px 64px rgba(17,24,39,0.18)",
    border: "1px solid var(--line-subtle)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 8px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "AI"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700 } }, "\uC9C4\uB85C \uC0C1\uB2F4"), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: 9, color: "var(--fg-subtle)" } }, "62%")), /* @__PURE__ */ React.createElement("div", { style: { height: 3, background: "#EEF", borderRadius: 999, marginTop: 8, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", width: "62%", background: "var(--brand-500)" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { alignSelf: "flex-start", maxWidth: "85%", padding: "8px 10px", background: "#F5F7FA", borderRadius: "4px 12px 12px 12px", fontSize: 10, lineHeight: 1.45, color: "var(--fg-default)" }, className: "kr-heading" }, "\uC601\uC0C1 \uB9CC\uB4E4 \uB54C \uC5B4\uB5A4 \uBD80\uBD84\uC774 \uC81C\uC77C \uC7AC\uBC0C\uC5C8\uC5B4\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { alignSelf: "flex-end", maxWidth: "85%", padding: "8px 10px", background: "var(--brand-500)", color: "#fff", borderRadius: "12px 12px 4px 12px", fontSize: 10, lineHeight: 1.45 }, className: "kr-heading" }, "\uD3B8\uC9D1\uD560 \uB54C\uC694! \uCEF7 \uBC14\uB00C\uBA74 \uBD84\uC704\uAE30\uB3C4 \uBC14\uB00C\uB294 \uAC8C \uC2E0\uAE30\uD574\uC694"), /* @__PURE__ */ React.createElement("div", { style: { alignSelf: "flex-start", maxWidth: "85%", padding: "8px 10px", background: "#F5F7FA", borderRadius: "4px 12px 12px 12px", fontSize: 10, lineHeight: 1.45, color: "var(--fg-default)" }, className: "kr-heading" }, "\uC624 \uC2DC\uAC01\uC801 \uD750\uB984\uC5D0 \uAC15\uC810\uC774 \uC788\uB124\uC694. \uC7A0\uC2DC\uB9CC\uC694..."), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "8px 10px",
    background: "linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)",
    borderRadius: 8,
    fontSize: 9,
    color: "var(--accent-purple)",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 4
  } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 10 }), " \uC0C8\uB85C\uC6B4 \uB2E8\uC11C \uBC1C\uACAC: \uC2DC\uAC01\uC801 \uD45C\uD604"))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: 20,
    top: 70,
    width: 280,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 20px 48px rgba(17,24,39,0.14)",
    border: "1px solid var(--line-subtle)",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", borderBottom: "1px solid var(--line-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700 } }, "2-3\uBC18 \uD559\uC0DD \uAD00\uB9AC"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "18/30\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, display: "flex", flexDirection: "column", gap: 8 } }, [
    { n: "\uAE40\uC9C0\uD6C8", s: 84.8, d: "+2.4", t: "success" },
    { n: "\uC774\uC11C\uC5F0", s: 92.1, d: "+0.6", t: "success" },
    { n: "\uBC15\uBBFC\uD638", s: 76.4, d: "-1.8", t: "danger" }
  ].map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: "50%", background: "#FFE2D6", fontSize: 9, fontWeight: 700, color: "#A4441C", display: "flex", alignItems: "center", justifyContent: "center" } }, r.n[0]), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, flex: 1 } }, r.n), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 11, fontWeight: 700 } }, r.s), /* @__PURE__ */ React.createElement(Chip, { tone: r.t, size: "sm" }, r.d))))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    right: 0,
    bottom: 40,
    padding: "10px 14px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 24px rgba(17,24,39,0.12)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 16 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, "1\uCC28 \uB9AC\uD3EC\uD2B8 \uC900\uBE44\uB428"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)" } }, "\uB300\uD654 12\uD68C \uAE30\uBC18"))));
}
function LandingProductCards() {
  const cards = [
    { tag: "\uD559\uC0DD", title: "AI \uC9C4\uB85C \uC0C1\uB2F4", body: "\uB300\uD654\uB85C \uD765\uBBF8\uC640 \uAC15\uC810\uC744 \uBC1C\uACAC\uD558\uACE0 \uC9C4\uB85C \uAC00\uC124\uC744 \uB9CC\uB4E4\uC5B4\uC694.", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), color: "var(--accent-purple)", bg: "var(--accent-purple-bg)" },
    { tag: "\uD559\uC0DD", title: "\uC131\uC801 \uBCC0\uD654 \uBD84\uC11D", body: "\uBAA8\uC758\uACE0\uC0AC \uCD94\uC774\uB97C \uD55C\uB208\uC5D0 \uBCF4\uACE0 \uC57D\uC810 \uB2E8\uC6D0\uC744 \uC9DA\uC5B4\uB4DC\uB824\uC694.", icon: /* @__PURE__ */ React.createElement(IcChart, null), color: "var(--brand-600)", bg: "var(--brand-50)" },
    { tag: "\uAD50\uC0AC", title: "\uD559\uAE09 \uC0C1\uB2F4 \uAD00\uB9AC", body: "\uD559\uC0DD\uBCC4 \uC9C4\uB85C\xB7\uC131\uC801\xB7\uD559\uC2B5\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C \uAD00\uB9AC\uD574\uC694.", icon: /* @__PURE__ */ React.createElement(IcUsers, null), color: "var(--accent-mint)", bg: "var(--accent-mint-bg)" },
    { tag: "\uD559\uC0DD", title: "\uB9DE\uCDA4 \uD559\uC2B5 \uACC4\uD68D", body: "\uBAA9\uD45C \uB300\uD559\xB7\uD559\uACFC\uAE4C\uC9C0 \uC774\uB974\uB294 \uC8FC\uAC04 \uD559\uC2B5\uC744 \uC124\uACC4\uD574\uB4DC\uB824\uC694.", icon: /* @__PURE__ */ React.createElement(IcCheck, null), color: "var(--success)", bg: "var(--success-bg)" }
  ];
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1200, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", style: { marginBottom: 12 } }, "\uC774\uB7F0 \uAE30\uB2A5\uC774 \uC788\uC5B4\uC694"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 36, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1px" }, className: "kr-heading" }, "\uB300\uD654\uB85C \uC2DC\uC791\uD574, \uB370\uC774\uD130\uB85C \uAC80\uC99D\uD558\uACE0, \uC2E4\uC81C\uB85C \uC6C0\uC9C1\uC5EC\uC694")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 } }, cards.map((c, i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 24, style: { background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 } }, React.cloneElement(c.icon, { size: 22 })), /* @__PURE__ */ React.createElement(Chip, { tone: c.tag === "\uAD50\uC0AC" ? "purple" : "brand", size: "sm", style: { marginBottom: 8 } }, c.tag), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, c.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, c.body))))));
}
function LandingStudentValue() {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", style: { marginBottom: 16 } }, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 40, fontWeight: 800, color: "var(--fg-strong)", margin: 0, marginBottom: 16, letterSpacing: "-1.2px", lineHeight: 1.2 }, className: "kr-heading" }, "\uC9C4\uB85C \uACE0\uBBFC\uC744", /* @__PURE__ */ React.createElement("br", null), "\uD63C\uC790 \uC548\uACE0 \uAC00\uC9C0 \uB9C8\uC138\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, color: "var(--fg-muted)", lineHeight: 1.65, margin: 0, marginBottom: 32 }, className: "kr-heading" }, "\uC815\uB2F5\uC744 \uC8FC\uB294 \uB3C4\uAD6C\uAC00 \uC544\uB2C8\uB77C, \uD568\uAED8 \uC0DD\uAC01\uD574\uC8FC\uB294 \uB3C4\uAD6C\uC608\uC694. 1-5\uC810 \uC124\uBB38\uC774 \uC544\uB2CC \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uB300\uD654\uB85C \uC9C4\uB85C\uB97C \uD0D0\uC0C9\uD574\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, [
    { t: "\uB300\uD654\uD615 AI \uC0C1\uB2F4", d: "\uAC15\uC694 \uC5C6\uC774 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB2F5\uD574\uB3C4 \uB3FC\uC694. AI\uAC00 \uB2E8\uC11C\uB97C \uBAA8\uC544 \uAC00\uC124\uC744 \uC138\uC6CC\uC918\uC694." },
    { t: "\uBAA9\uD45C \uB300\uD559\xB7\uD559\uACFC \uC124\uC815", d: "\uCD94\uCC9C\uB9CC \uBC1B\uB294 \uAC8C \uC544\uB2C8\uB77C, \uC9C1\uC811 \uBAA9\uD45C\uB97C \uC815\uD558\uACE0 \uB3C4\uB2EC \uACBD\uB85C\uB97C \uBC1B\uC544\uC694." },
    { t: "\uC131\uC7A5 \uB9AC\uD3EC\uD2B8", d: "\uC131\uC801\uC774 \uBCC0\uD558\uB294 \uD750\uB984\uC744, \uC810\uC218\uAC00 \uC544\uB2CC \uC774\uC57C\uAE30\uB85C \uC77D\uC5B4\uB4DC\uB824\uC694." }
  ].map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcCheck, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, it.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.55 }, className: "kr-heading" }, it.d)))))), /* @__PURE__ */ React.createElement(Card, { padding: 28, style: { background: "linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)" } }, /* @__PURE__ */ React.createElement(ChatPreview, null))));
}
function ChatPreview() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: "10px 14px", borderRadius: "4px 14px 14px 14px", fontSize: 13, lineHeight: 1.5, maxWidth: "78%" }, className: "kr-heading" }, "\uCD95\uC81C \uC601\uC0C1\uC744 \uB9CC\uB4E4 \uB54C \uCE5C\uAD6C\uB4E4\uC774 \uC5B4\uB5A4 \uBC18\uC751\uC774\uC5C8\uC744 \uB54C \uAC00\uC7A5 \uAE30\uBEE4\uC5B4\uC694?")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--brand-500)", color: "#fff", padding: "10px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 13, lineHeight: 1.5, maxWidth: "78%" }, className: "kr-heading" }, "\uC608\uACE0\uD3B8\uC774 \uB72C\uB2E4\uACE0 SNS\uC5D0 \uC62C\uB824\uC900 \uCE5C\uAD6C\uAC00 \uC788\uC5C8\uC5B4\uC694. \uADF8\uB54C \uC9C4\uC9DC \uC2E0\uB0AC\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, "AI"), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: "10px 14px", borderRadius: "4px 14px 14px 14px", fontSize: 13, lineHeight: 1.5, maxWidth: "78%" }, className: "kr-heading" }, "\uC791\uD488\uC774 \uB204\uAD70\uAC00\uC5D0\uAC8C \uB2FF\uB294 \uC21C\uAC04\uC744 \uC990\uAE30\uB294 \uAC70\uB124\uC694. \uD765\uBBF8\uB85C\uC6CC\uC694.")), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    border: "1px dashed rgba(123,97,255,0.3)",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, /* @__PURE__ */ React.createElement(IcSparkles, { size: 14, color: "var(--accent-purple)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--accent-purple)", fontWeight: 700 } }, "\uC0C8\uB85C\uC6B4 \uB2E8\uC11C: \uD45C\uD604 \uB3D9\uAE30 \xB7 \uC2DC\uAC01\uC801 \uD750\uB984")));
}
function LandingTeacherValue() {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Card, { padding: 28 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "2\uD559\uB144 3\uBC18 \uC885\uD569"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "18/30\uBA85")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 } }, [
    { l: "\uD3C9\uADE0", v: "82.8", d: "success" },
    { l: "\uC0C1\uB2F4\uC694\uCCAD", v: "3", d: "warning" },
    { l: "AI \uC644\uB8CC", v: "11", d: "brand" }
  ].map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 22, fontWeight: 700, color: `var(--${m.d}${m.d === "brand" ? "-600" : ""})` } }, m.v), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, m.l)))), /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid var(--line-subtle)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 } }, [
    { n: "\uBC15\uBBFC\uD638", s: "\uC218\uD559 -8\uC810", t: "danger" },
    { n: "\uC774\uC11C\uC5F0", s: "\uC0C1\uB2F4 \uC694\uCCAD", t: "warning" },
    { n: "\uC815\uD604\uC6B0", s: "\uAFB8\uC900\uD55C \uC0C1\uC2B9", t: "success" }
  ].map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: r.n[0], size: 28 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", flex: 1 } }, r.n), /* @__PURE__ */ React.createElement(Chip, { tone: r.t, size: "sm" }, r.s))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", style: { marginBottom: 16 } }, "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 40, fontWeight: 800, color: "var(--fg-strong)", margin: 0, marginBottom: 16, letterSpacing: "-1.2px", lineHeight: 1.2 }, className: "kr-heading" }, "\uD559\uC0DD \uD55C \uBA85 \uD55C \uBA85\uC744", /* @__PURE__ */ React.createElement("br", null), "\uB193\uCE58\uC9C0 \uC54A\uAC8C \uB3C4\uC640\uB4DC\uB824\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, color: "var(--fg-muted)", lineHeight: 1.65, margin: 0, marginBottom: 32 }, className: "kr-heading" }, "\uCD5C\uB300 30\uBA85\uAE4C\uC9C0 \uD559\uAE09\uC744 \uC6B4\uC601\uD560 \uC218 \uC788\uC5B4\uC694. \uC0C1\uB2F4 \uC694\uCCAD, \uC131\uC801 \uBCC0\uB3D9, \uD559\uC2B5 \uC9C4\uB3C4\uB97C \uC2E4\uC2DC\uAC04\uC73C\uB85C \uD655\uC778\uD558\uC138\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, [
    { t: "\uCD08\uB300\uCF54\uB4DC\uB85C \uC2DC\uC791", d: "\uD559\uC0DD\uC774 \uCF54\uB4DC \uD558\uB098\uB85C \uAC00\uC785\uD574 \uD559\uAE09\uC5D0 \uC790\uB3D9 \uD569\uB958\uD574\uC694." },
    { t: "\uD559\uC0DD\uBCC4 \uC9C4\uB85C \uB9AC\uD3EC\uD2B8", d: "AI \uB300\uD654 \uB2E8\uC11C\uAE4C\uC9C0 \uD568\uAED8 \uBCF4\uACE0 \uBA74\uB2F4\uC744 \uC900\uBE44\uD560 \uC218 \uC788\uC5B4\uC694." },
    { t: "\uC0C1\uB2F4 \uC694\uCCAD / \uBA54\uBAA8", d: "\uC694\uCCAD \uC54C\uB9BC\uC744 SSE\uB85C \uC2E4\uC2DC\uAC04 \uBC1B\uACE0, \uBA54\uBAA8\uB294 \uD559\uC0DD \uACF5\uAC1C \uC5EC\uBD80\uB3C4 \uC120\uD0DD\uD574\uC694." }
  ].map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcCheck, { size: 18 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" } }, it.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.55 }, className: "kr-heading" }, it.d))))))));
}
function LandingPricing({ onNav = () => {
} }) {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1e3, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", style: { marginBottom: 12 } }, "\uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 40, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1.2px" }, className: "kr-heading" }, "\uC815\uC9C1\uD55C \uAC00\uACA9, \uBD80\uB2F4 \uC5C6\uB294 \uC2DC\uC791")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "md" }, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginTop: 10 } }, "\uD559\uC0DD \uD50C\uB79C")), /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 44, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1.5px" } }, "3,000"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: "var(--fg-muted)" } }, "\uC6D0 / \uC6D4")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--success)", fontWeight: 700, marginBottom: 24 } }, "\uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 } }, ["AI \uC9C4\uB85C \uC0C1\uB2F4 \uBB34\uC81C\uD55C", "\uC131\uC801 \uCD94\uC774 \uBD84\uC11D + \uC131\uC7A5 \uB9AC\uD3EC\uD2B8", "\uB9DE\uCDA4 \uD559\uC2B5 \uACC4\uD68D + \uC9C4\uB3C4 \uCCB4\uD06C", "\uCD94\uCC9C \uC9C1\uC5C5\xB7\uD559\uACFC\xB7\uB300\uD559"].map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--brand-500)" }), f))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => onNav("auth", "student", "signup") }, "\uD559\uC0DD\uC73C\uB85C \uC2DC\uC791\uD558\uAE30")), /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)", border: "1px solid var(--brand-200)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "md" }, "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginTop: 10 } }, "\uAD50\uC0AC \uD50C\uB79C")), /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcGraduation, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 44, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1.5px" } }, "30,000"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: "var(--fg-muted)" } }, "\uC6D0 / \uC6D4")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--success)", fontWeight: 700, marginBottom: 24 } }, "\uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694 \xB7 \uCD5C\uB300 30\uBA85"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 } }, ["\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC \uBC1C\uAE09", "\uD559\uC0DD \uCD5C\uB300 30\uBA85\uAE4C\uC9C0 \uAD00\uB9AC", "\uD559\uC0DD\uBCC4 \uC9C4\uB85C\xB7\uC131\uC801\xB7\uD559\uC2B5 \uB9AC\uD3EC\uD2B8", "\uC0C1\uB2F4 \uC694\uCCAD\xB7\uBA54\uBAA8 \xB7 \uC2E4\uC2DC\uAC04 \uC54C\uB9BC"].map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--accent-purple)" }), f))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, style: { background: "var(--accent-purple)" }, onClick: () => onNav("auth", "teacher", "signup") }, "\uAD50\uC0AC\uB85C \uC2DC\uC791\uD558\uAE30"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, padding: 16, background: "var(--bg-muted)", borderRadius: 12, fontSize: 13, color: "var(--fg-muted)", textAlign: "center", lineHeight: 1.55 }, className: "kr-heading" }, "\uD559\uAD50 \uB2E8\uC704 \uB3C4\uC785 \xB7 \uBD80\uC11C\uBCC4 \uACB0\uC81C\uB294 \uBCC4\uB3C4 \uBB38\uC758\uD574\uC8FC\uC138\uC694. \uACB0\uC81C \uC815\uBCF4\uB294 \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20\uB97C \uD1B5\uD574 \uC548\uC804\uD558\uAC8C \uCC98\uB9AC\uB3FC\uC694.")));
}
function LandingSecurity() {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1200, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", leading: /* @__PURE__ */ React.createElement(IcShield, { size: 11 }), style: { marginBottom: 12 } }, "\uC548\uC2EC\uD558\uACE0 \uC0AC\uC6A9\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 36, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1px" }, className: "kr-heading" }, "\uD559\uC0DD\uC758 \uB370\uC774\uD130\uB294 \uAC00\uC7A5 \uBCF4\uC218\uC801\uC73C\uB85C \uB2E4\uB904\uC694")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, [
    { t: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638", d: "\uC8FC\uBBFC\uBC88\uD638 \uB4F1 \uBBFC\uAC10\uC815\uBCF4\uB294 \uC218\uC9D1\uD558\uC9C0 \uC54A\uC544\uC694. \uC0C1\uB2F4 \uB0B4\uC6A9\uC740 \uBCF8\uC778\xB7\uAD50\uC0AC\uB9CC \uBCFC \uC218 \uC788\uC5B4\uC694.", icon: /* @__PURE__ */ React.createElement(IcShield, null) },
    { t: "\uAD8C\uD55C \uAE30\uBC18 \uC811\uADFC", d: "\uD559\uC0DD/\uAD50\uC0AC/\uAD00\uB9AC\uC790 \uC5ED\uD560\uC5D0 \uB530\uB77C \uC811\uADFC \uAC00\uB2A5\uD55C \uB370\uC774\uD130\uAC00 \uC5C4\uACA9\uD788 \uBD84\uB9AC\uB3FC\uC694.", icon: /* @__PURE__ */ React.createElement(IcLock, null) },
    { t: "\uC0C1\uB2F4 \uAE30\uB85D \uAD00\uB9AC", d: "\uAD50\uC0AC \uBA54\uBAA8\uC758 \uD559\uC0DD \uACF5\uAC1C \uC5EC\uBD80\uB97C \uBCC4\uB3C4\uB85C \uC124\uC815\uD560 \uC218 \uC788\uC5B4\uC694.", icon: /* @__PURE__ */ React.createElement(IcDoc, null) }
  ].map((it, i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 24 }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 } }, React.cloneElement(it.icon, { size: 22 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, it.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, it.d))))));
}
function LandingFinalCTA({ onNav = () => {
} }) {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 64, style: {
    maxWidth: 960,
    margin: "0 auto",
    textAlign: "center",
    background: "linear-gradient(135deg, #3182F6 0%, #1957C2 100%)",
    color: "#fff"
  } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 40, fontWeight: 800, color: "#fff", margin: 0, marginBottom: 14, letterSpacing: "-1.2px", lineHeight: 1.2 }, className: "kr-heading" }, "\uC9C4\uB85C\uB97C \uCC3E\uB294 \uAC00\uC7A5 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uBC29\uBC95,", /* @__PURE__ */ React.createElement("br", null), "\uC624\uB298 \uC2DC\uC791\uD574\uBCF4\uC138\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 16, opacity: 0.9, lineHeight: 1.6, margin: 0, marginBottom: 32 }, className: "kr-heading" }, "\uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694. \uACB0\uC81C \uC815\uBCF4 \uB4F1\uB85D \uC5C6\uC774 \uBC14\uB85C \uC2DC\uC791\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", style: { background: "#fff", color: "var(--brand-600)" }, onClick: () => onNav("auth", "student", "signup") }, "\uD559\uC0DD\uC73C\uB85C \uC2DC\uC791"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "xl", style: { background: "rgba(255,255,255,0.18)", color: "#fff", backdropFilter: "blur(20px)" }, onClick: () => onNav("auth", "teacher", "signup") }, "\uAD50\uC0AC\uB85C \uC2DC\uC791"))));
}
function LandingFooter() {
  return /* @__PURE__ */ React.createElement("footer", { style: { padding: "40px 40px", background: "#101727", color: "#94A3B8", fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: 6, background: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 15, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 800, color: "#fff" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#64748B", lineHeight: 1.6 } }, "\uC9C4\uB85C\uB098\uCE68\uBC18 \xB7 \uB300\uD45C \uC774\uCC3D\uD638", /* @__PURE__ */ React.createElement("br", null), "\uBB38\uC758\uC0AC\uD56D dlckdgh135@naver.com", /* @__PURE__ */ React.createElement("br", null), "\uAC1C\uC778 \uC6B4\uC601 (\uC0AC\uC5C5\uC790 \uBBF8\uB4F1\uB85D)")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontWeight: 700, marginBottom: 4 } }, "\uC11C\uBE44\uC2A4"), /* @__PURE__ */ React.createElement("a", null, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("a", null, "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("a", null, "\uC694\uAE08")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontWeight: 700, marginBottom: 4 } }, "\uBC95\uC801 \uACE0\uC9C0"), /* @__PURE__ */ React.createElement("a", null, "\uC774\uC6A9\uC57D\uAD00"), /* @__PURE__ */ React.createElement("a", null, "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68"), /* @__PURE__ */ React.createElement("a", null, "\uCCAD\uC18C\uB144\uBCF4\uD638\uC815\uCC45")))));
}
function LandingApproach() {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px", background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 48 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--brand-500)", marginBottom: 8 } }, "\uC774\uB807\uAC8C \uC791\uB3D9\uD574\uC694"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 36, fontWeight: 800, letterSpacing: "-0.6px", margin: 0, lineHeight: 1.3 } }, "\uB300\uD654\uB85C \uC2DC\uC791\uD574, ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--brand-500)" } }, "\uB370\uC774\uD130\uB85C \uAC80\uC99D"), "\uD558\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uC9C4\uB85C \uCE74\uB4DC\uB85C \uC815\uB9AC\uD574\uC694")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 } }, [
    { n: "1", t: "\uB300\uD654\uB85C \uC2DC\uC791", d: "AI\uAC00 \uD559\uB144\uC5D0 \uB9DE\uCDB0 \uD765\uBBF8\xB7\uAC15\uC810\xB7\uAC00\uCE58\uB97C \uBB3B\uACE0, \uD559\uC0DD\uC774 \uC2A4\uC2A4\uB85C \uB2F5\uD558\uBA74\uC11C \uC9C4\uB85C\uB97C \uD0D0\uC0C9\uD574\uC694." },
    { n: "2", t: "\uB370\uC774\uD130\uB85C \uAC80\uC99D", d: "\uCEE4\uB9AC\uC5B4\uB137\xB7\uB300\uD559\uC54C\uB9AC\uBBF8\xB7College Scorecard \uB4F1 \uC2E4 \uACF5\uACF5\uB370\uC774\uD130\uB85C \uC9C1\uC5C5\xB7\uC804\uACF5\xB7\uB300\uD559\xB7\uCDE8\uC5C5\uB960\uC744 \uADFC\uAC70 \uC788\uAC8C \uBCF4\uC5EC\uB4DC\uB824\uC694." },
    { n: "3", t: "\uCE74\uB4DC\uB85C \uC815\uB9AC", d: "\uAD00\uC2EC \uC9C1\uC5C5\xB7\uC804\uACF5\xB7\uB300\uD559\xB7\uD65C\uB3D9\uC744 \uCE74\uB4DC\uB85C \uBAA8\uC544 \uCE98\uB9B0\uB354\xB7\uB9AC\uD3EC\uD2B8\uB85C \uAD00\uB9AC\uD574\uC694." }
  ].map((s) => /* @__PURE__ */ React.createElement("div", { key: s.n, style: { padding: 28, border: "1px solid var(--line)", borderRadius: 16, background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, marginBottom: 12 } }, s.n), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 18, fontWeight: 700, margin: "0 0 8px" } }, s.t), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0 } }, s.d))))));
}
function LandingDataSources() {
  const SRC = [
    { name: "\uCEE4\uB9AC\uC5B4\uB137", stat: "\uC9C1\uC5C5 552\xB7\uD559\uACFC 501\xB7\uC0C1\uB2F4\uC0AC\uB840 188" },
    { name: "\uB300\uD559\uC54C\uB9AC\uBBF8", stat: "\uB300\uD559 472\xB7\uD559\uACFC 48,308\xB7\uACBD\uC7C1\uB960\xB7\uCDA9\uC6D0\uC728" },
    { name: "College Scorecard", stat: "\uBBF8\uAD6D \uB300\uD559 \uD559\uBE44\xB7\uC878\uC5C5\uB960\xB7\uC911\uC704\uC18C\uB4DD" },
    { name: "VMS\xB71365", stat: "\uCCAD\uC18C\uB144 \uAC00\uB2A5 \uBD09\uC0AC 1,000+\uAC74" },
    { name: "\uD55C\uAD6D\uC7A5\uD559\uC7AC\uB2E8", stat: "\uD559\uC790\uAE08\xB7\uC7A5\uD559\uAE08 1,850+\uAC74" },
    { name: "\uACBD\uAE30\uB370\uC774\uD130\uB4DC\uB9BC", stat: "\uCDE8\uC5C5\uB960\xB7\uAD50\uD658\uD559\uC0DD\xB7\uC2E0\uC785\uC0DD \uCDA9\uC6D0" }
  ];
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "60px 40px", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 36 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 8 } }, "\uC2E4 \uACF5\uACF5\uB370\uC774\uD130"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 } }, "\uCD94\uCE21\uC774 \uC544\uB2CC, ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--success)" } }, "\uAD6D\uAC00\uAC00 \uACF5\uC2DC\uD55C \uB370\uC774\uD130"), "\uB85C \uC54C\uB824\uB4DC\uB824\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.6 } }, "\uC5F0\uBD09\xB7\uCDE8\uC5C5\uB960\xB7\uACBD\uC7C1\uB960 \uAC19\uC740 \uC218\uCE58\uB294 \uBAA8\uB450 \uACF5\uACF5\uAE30\uAD00 API\uB85C \uBC1B\uC544\uC635\uB2C8\uB2E4. \uCD9C\uCC98\uC640 \uC870\uC0AC\uC5F0\uB3C4\uB97C \uD568\uAED8 \uD45C\uC2DC\uD574\uC694.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 } }, SRC.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.name, style: { background: "#fff", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 } }, s.stat))))));
}
function LandingFeatureCards() {
  const USE_CASES = [
    { emoji: "\u{1F91D}", title: "\uBD09\uC0AC\uD65C\uB3D9 \uAC80\uC0C9\xB7\uCE98\uB9B0\uB354 \uB4F1\uB85D", desc: "\uAD00\uC2EC \uBD84\uC57C\uC758 \uBD09\uC0AC\uB97C \uCC3E\uACE0 \uCE98\uB9B0\uB354\uC5D0 \uBC14\uB85C \uCD94\uAC00\uD574 \uD559\uC0DD\uBD80 \uC778\uC131 \uC601\uC5ED\uC744 \uCC44\uC6CC\uC694. \uAE30\uAD00 \uC804\uD654\uBC88\uD638\uB3C4 \uD568\uAED8 \uC548\uB0B4." },
    { emoji: "\u{1F4B0}", title: "\uC7A5\uD559\uAE08 \uC815\uBCF4", desc: "\uD55C\uAD6D\uC7A5\uD559\uC7AC\uB2E8\xB7\uC9C0\uC790\uCCB4\xB7\uAE30\uC5C5 \uC7A5\uD559\uAE08 1,850+\uAC74. AI\uAC00 \uD559\uC0DD \uC0C1\uD669\uC5D0 \uB9DE\uB294 \uC7A5\uD559\uAE08\uC744 \uC0C1\uB2F4 \uC911\uC5D0 \uCD94\uCC9C\uD574\uC918\uC694." },
    { emoji: "\u{1F4C5}", title: "\uCE98\uB9B0\uB354\uB85C \uAD00\uB9AC", desc: "\uBD09\uC0AC\xB7\uCCB4\uD5D8\xB7\uC2DC\uD5D8\xB7\uC0C1\uB2F4 \uC77C\uC815\uC744 \uD55C \uACF3\uC5D0\uC11C. \uCE98\uB9B0\uB354\uC5D0\uC11C \uC9C1\uC811 \uCD94\uAC00\xB7\uC218\uC815\xB7\uC0AD\uC81C\uD560 \uC218 \uC788\uC5B4\uC694." },
    { emoji: "\u{1F30F}", title: "\uAD50\uD658\uD559\uC0DD \uC815\uBCF4", desc: '\uB300\uD559\uBCC4 \uC678\uAD6D\uB300\uD559 \uAD50\uB958 \uC778\uC6D0(\uD30C\uACAC\xB7\uC720\uCE58)\uC73C\uB85C "\uAD6D\uC81C\uD654 \uC815\uB3C4"\uB97C \uD55C\uB208\uC5D0 \uD655\uC778\uD558\uACE0 \uC9C4\uD559 \uACB0\uC815\uC5D0 \uCC38\uACE0.' },
    { emoji: "\u{1F3AF}", title: "\uC9C4\uB85C\xB7\uC9C1\uC5C5\uCCB4\uD5D8", desc: "\uCEE4\uB9AC\uC5B4\uB137 \uCCB4\uD5D8 \uC790\uB8CC 455+\uAC74. \uD559\uB144\xB7\uAD00\uC2EC\uBD84\uC57C\uB85C \uD544\uD130\uD574 \uC804\uACF5\uC801\uD569\uC131\uC744 \uD559\uC0DD\uBD80\uC5D0 \uCC44\uC6CC\uAC00\uC694." },
    { emoji: "\u{1F468}\u200D\u{1F3EB}", title: "\uAD50\uC0AC \uAE30\uB2A5", desc: "\uD559\uC0DD\uBCC4 \uC9C4\uB85C\xB7\uC131\uC801\xB7\uD559\uC2B5 \uD604\uD669\uC744 \uD55C \uD654\uBA74\uC5D0\uC11C. 1:1 \uC0C1\uB2F4 \uBA54\uBAA8, \uD559\uAE09 \uB2E8\uC704 \uD1B5\uACC4, \uADF8\uB8F9 \uBA54\uC2DC\uC9C0\uAE4C\uC9C0." }
  ];
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px", background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--brand-500)", marginBottom: 8 } }, "\uD65C\uC6A9 \uC0AC\uB840"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 } }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC740 \uC774\uB807\uAC8C \uC4F0\uC5EC\uC694")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 } }, USE_CASES.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.title, style: { padding: 24, border: "1px solid var(--line)", borderRadius: 16, background: "#fff", transition: "box-shadow .15s" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 36, marginBottom: 12 } }, u.emoji), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 17, fontWeight: 700, margin: "0 0 8px" } }, u.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0 } }, u.desc))))));
}
function LandingAiSafety() {
  return /* @__PURE__ */ React.createElement("section", { style: { padding: "60px 40px", background: "linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1e3, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#C2410C", marginBottom: 12 } }, "\u26A0\uFE0F \uC9C4\uB85C\uB098\uCE68\uBC18\uC740 \uBCF4\uC870 \uB3C4\uAD6C\uC608\uC694"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 28, fontWeight: 800, letterSpacing: "-0.4px", margin: "0 0 18px", lineHeight: 1.4 } }, "AI \uB300\uD654\uB294 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#C2410C" } }, "\uB108\uBB34 \uC2E0\uC6A9\uD558\uC9C0 \uB9C8\uC138\uC694"), /* @__PURE__ */ React.createElement("br", null), "\uC9C4\uD559\xB7\uC804\uACF5 \uAC19\uC740 \uD070 \uACB0\uC815\uC740 \uC120\uC0DD\uB2D8\uACFC \uD568\uAED8"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "var(--fg-default)", lineHeight: 1.7, margin: 0 } }, "\uC9C4\uB85C\uB098\uCE68\uBC18\uC740 \uD559\uC0DD\uC774 \uC2A4\uC2A4\uB85C \uC9C4\uB85C\uB97C \uD0D0\uC0C9\uD558\uB3C4\uB85D \uB3D5\uB294 \uB3C4\uAD6C\uC608\uC694. AI \uC0C1\uB2F4\uC5D0\uC11C \uB098\uC628 \uACB0\uACFC\uB97C \uC815\uB2F5\uC73C\uB85C \uBC1B\uC9C0 \uB9D0\uACE0,", /* @__PURE__ */ React.createElement("br", null), "\uBC18\uB4DC\uC2DC \uD559\uAD50 \uC9C4\uB85C\xB7\uB2F4\uC784 \uC120\uC0DD\uB2D8 \uB610\uB294 \uC804\uBB38 \uC0C1\uB2F4\uC0AC\uC640 \uD568\uAED8 \uD070 \uACB0\uC815\uC744 \uC815\uD574\uC8FC\uC138\uC694.", /* @__PURE__ */ React.createElement("br", null), "AI\uB294 \uB370\uC774\uD130\uB85C \uAC00\uB2A5\uC131\uC744 \uB113\uD600\uC904 \uBFD0, \uACB0\uC815\uC740 \uD559\uC0DD\uACFC \uC5B4\uB978\uC774 \uD568\uAED8 \uD569\uB2C8\uB2E4.")));
}
function AuthScreen({ role = "student", mode = "login", onNav, onBack, setRole, setMode }) {
  const isMobile = useViewportMobile();
  const isTeacher = role === "teacher";
  const isSignup = mode === "signup";
  const switchRole = setRole || (() => {
  });
  const switchMode = setMode || (() => {
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [inviteCode, setInviteCode] = React.useState("");
  const [school, setSchool] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const STUDENT_REQUIRED = [
    { id: "tos", label: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00 \uB3D9\uC758", linkLabel: "\uC57D\uAD00 \uBCF4\uAE30" },
    { id: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9 \uB3D9\uC758 (\uC774\uBA54\uC77C, \uC774\uB984, \uD559\uAD50)", linkLabel: "\uC790\uC138\uD788" },
    { id: "academic", label: "\uD559\uC5C5/\uC131\uC801 \uB370\uC774\uD130 \uCC98\uB9AC \uB3D9\uC758 (\uBAA8\uC758\uACE0\uC0AC\xB7\uB0B4\uC2E0\xB7\uC218\uD589\uD3C9\uAC00)", linkLabel: "\uC790\uC138\uD788" },
    { id: "ai", label: "AI \uC9C4\uB85C\uC0C1\uB2F4 \uB300\uD654 \uB370\uC774\uD130 \uCC98\uB9AC \uB3D9\uC758", linkLabel: "\uC790\uC138\uD788" },
    { id: "age", label: "\uB9CC 14\uC138 \uC774\uC0C1\uC774\uBA70 \uBC95\uC815\uB300\uB9AC\uC778 \uB3D9\uC758\uB97C \uBC1B\uC558\uC5B4\uC694", linkLabel: null }
  ];
  const TEACHER_REQUIRED = [
    { id: "tos", label: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00 \uB3D9\uC758", linkLabel: "\uC57D\uAD00 \uBCF4\uAE30" },
    { id: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1\xB7\uC774\uC6A9 \uB3D9\uC758 (\uC774\uBA54\uC77C, \uC774\uB984, \uC18C\uC18D\uD559\uAD50)", linkLabel: "\uC790\uC138\uD788" },
    { id: "class", label: "\uD559\uAE09/\uD559\uC0DD \uC815\uBCF4 \uCC98\uB9AC \uB3D9\uC758 (\uC131\uC801, \uC0C1\uB2F4 \uB0B4\uC6A9)", linkLabel: "\uC790\uC138\uD788" },
    { id: "billing", label: "\uACB0\uC81C\xB7\uAD6C\uB3C5 \uC548\uB0B4 \uC218\uC2E0 \uB3D9\uC758", linkLabel: "\uC790\uC138\uD788" }
  ];
  const OPTIONAL = [
    { id: "mkt", label: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0 \uB3D9\uC758 (\uC120\uD0DD)" }
  ];
  const required = isTeacher ? TEACHER_REQUIRED : STUDENT_REQUIRED;
  const [consents, setConsents] = React.useState({});
  const toggle = (id) => setConsents((c) => ({ ...c, [id]: !c[id] }));
  const allRequiredChecked = required.every((c) => consents[c.id]);
  const allChecked = required.every((c) => consents[c.id]) && OPTIONAL.every((c) => consents[c.id]);
  const toggleAll = () => {
    const next = !allChecked;
    const m = {};
    [...required, ...OPTIONAL].forEach((c) => {
      m[c.id] = next;
    });
    setConsents(m);
  };
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = !password || password.length >= 8;
  const canSubmit = isSignup ? email && emailValid && password && pwValid && name && allRequiredChecked && (isTeacher ? school : true) : email && emailValid && password;
  const [busy, setBusy] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const submit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setAuthError("");
    try {
      const path = isSignup ? isTeacher ? "/v1/auth/signup/teacher" : "/v1/auth/signup/student" : "/v1/auth/login";
      const payload = isSignup ? isTeacher ? { email: email.trim(), password, name: name.trim(), school: school.trim(), classroom: school.trim(), consents: { tos: !!consents.tos, privacy: !!consents.privacy, class: !!consents.class, billing: !!consents.billing } } : { email: email.trim(), password, name: name.trim(), inviteCode: inviteCode.trim() || void 0, consents: { tos: !!consents.tos, privacy: !!consents.privacy, academic: !!consents.academic, ai: !!consents.ai, age: !!consents.age } } : { email: email.trim(), password };
      const res = await fetch((window.VITE_API_BASE_URL || "/v1") + path.replace("/v1", ""), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(data.message || "\uB85C\uADF8\uC778\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694");
        setBusy(false);
        return;
      }
      try {
        if (data.accessToken) localStorage.setItem("jinro:accessToken", data.accessToken);
        if (data.refreshToken) localStorage.setItem("jinro:refreshToken", data.refreshToken);
      } catch (e) {
      }
      const _role = data.user && data.user.role;
      const targetRole = _role === "teacher" ? "teacher-web" : _role === "admin" ? "admin" : "student-web";
      if (typeof window.__navTo === "function") window.__navTo(targetRole);
      else {
        window.location.hash = targetRole;
        window.location.reload();
      }
    } catch (e) {
      setAuthError("\uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694");
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100%",
    maxHeight: "100%",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    background: "var(--bg-canvas)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: isMobile ? "20px 16px" : 40
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr", maxWidth: 1080, gap: isMobile ? 24 : 60, width: "100%", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 36 } }, /* @__PURE__ */ React.createElement("button", { onClick: onBack, style: { display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", cursor: onBack ? "pointer" : "default", padding: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 9, background: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 20, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.3px" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18")), onBack && /* @__PURE__ */ React.createElement("button", { onClick: onBack, style: { marginLeft: "auto", border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcArrowLeft, { size: 14 }), "\uD648\uC73C\uB85C")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20 } }, [
    { v: "student", l: "\uD559\uC0DD", d: "\uC9C4\uB85C \uD0D0\uC0C9\xB7\uC131\uC801\xB7AI \uC0C1\uB2F4", icon: /* @__PURE__ */ React.createElement(IcUser, null), c: "var(--brand-500)", bg: "var(--brand-50)" },
    { v: "teacher", l: "\uAD50\uC0AC", d: "\uD559\uAE09 \uAD00\uB9AC\xB7\uD559\uC0DD \uB9AC\uD3EC\uD2B8", icon: /* @__PURE__ */ React.createElement(IcGraduation, null), c: "var(--accent-purple)", bg: "var(--accent-purple-bg)" }
  ].map((o) => {
    const on = role === o.v;
    return /* @__PURE__ */ React.createElement("button", { key: o.v, onClick: () => switchRole(o.v), style: {
      flex: 1,
      textAlign: "left",
      cursor: "pointer",
      padding: "14px 16px",
      borderRadius: 14,
      border: `2px solid ${on ? o.c : "var(--line-strong)"}`,
      background: on ? o.bg : "var(--bg-surface)",
      transition: "all 140ms var(--ease-std)",
      position: "relative"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 30, height: 30, borderRadius: 9, background: on ? o.c : "var(--neutral-bg)", color: on ? "#fff" : "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, React.cloneElement(o.icon, { size: 17 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: on ? o.c : "var(--fg-strong)" } }, o.l), on && /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 17, color: o.c, style: { marginLeft: "auto" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" }, className: "kr-heading" }, o.d));
  })), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: isMobile ? 26 : 40, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1.2px", lineHeight: 1.2, marginBottom: 16 }, className: "kr-heading" }, isTeacher ? isSignup ? "\uD559\uAE09\uC744 \uB9CC\uB4E4\uACE0\n\uD559\uC0DD\uC744 \uCD08\uB300\uD574\uBCF4\uC138\uC694" : "\uC624\uB298 \uD559\uAE09\uB3C4 \uC798 \uBD80\uD0C1\uD574\uC694" : isSignup ? "\uC9C4\uB85C \uACE0\uBBFC,\n\uB300\uD654\uB85C \uC2DC\uC791\uD574\uC694" : "\uB2E4\uC2DC \uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC\uC694"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.65 }, className: "kr-heading" }, isTeacher && isSignup && "\uD68C\uC6D0\uAC00\uC785 \uD6C4 \uD559\uAE09\uC744 \uB9CC\uB4E4\uBA74 6\uC790\uB9AC \uCD08\uB300\uCF54\uB4DC\uAC00 \uBC1C\uAE09\uB3FC\uC694. \uD559\uC0DD\uC740 \uCF54\uB4DC \uD558\uB098\uB85C \uD559\uAE09\uC5D0 \uD569\uB958\uD574\uC694. \uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC774\uBA70, \uACB0\uC81C \uC815\uBCF4 \uB4F1\uB85D \uC5C6\uC774 \uC2DC\uC791\uD560 \uC218 \uC788\uC5B4\uC694.", isTeacher && !isSignup && "\uC0C1\uB2F4 \uC694\uCCAD, \uC131\uC801 \uBCC0\uB3D9, \uD559\uC2B5 \uC9C4\uB3C4\uB97C \uC2E4\uC2DC\uAC04\uC73C\uB85C \uD655\uC778\uD574\uC694.", !isTeacher && isSignup && "\uC120\uC0DD\uB2D8\uC774 \uC54C\uB824\uC900 6\uC790\uB9AC \uCD08\uB300\uCF54\uB4DC\uB294 \uAC00\uC785 \uC2DC \uB610\uB294 \uB098\uC911\uC5D0 \uC785\uB825\uD574\uB3C4 \uAD1C\uCC2E\uC544\uC694. \uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694.", !isTeacher && !isSignup && "\uC624\uB298\uC758 \uC9C4\uB85C \uC9C8\uBB38\uC774 \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement(Card, { padding: 36 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 24 } }, isSignup ? "\uD68C\uC6D0\uAC00\uC785" : "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcGoogle, { size: 18 }), style: { marginBottom: 10 }, onClick: () => {
    window.location.href = "/v1/auth/google/start";
  } }, "Google\uB85C ", isSignup ? "\uC2DC\uC791\uD558\uAE30" : "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "lg", full: true, leading: /* @__PURE__ */ React.createElement(IcKakao, { size: 18 }), style: { marginBottom: 20, background: "#FEE500", borderColor: "#FEE500" }, onClick: () => {
    window.location.href = "/v1/auth/kakao/start";
  } }, "\uCE74\uCE74\uC624\uB85C ", isSignup ? "\uC2DC\uC791\uD558\uAE30" : "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "var(--line)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, "\uB610\uB294 \uC774\uBA54\uC77C\uB85C"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "var(--line)" } })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uBA54\uC77C", required: isSignup, style: { marginBottom: 14 }, error: email && !emailValid ? "\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC544\uB2C8\uC5D0\uC694" : null }, /* @__PURE__ */ React.createElement(TextInput, { value: email, onChange: setEmail, placeholder: "\uC774\uBA54\uC77C\uC744 \uC785\uB825\uD558\uC138\uC694", type: "email", onKeyDown: (e) => {
    if (e.key === "Enter") submit();
  } })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBE44\uBC00\uBC88\uD638", required: isSignup, style: { marginBottom: 14 }, hint: isSignup ? "\uC601\uBB38, \uC22B\uC790 \uD3EC\uD568 8\uC790 \uC774\uC0C1" : null, error: password && !pwValid ? "\uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD574\uC694" : null }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      value: password,
      onChange: setPassword,
      type: showPw ? "text" : "password",
      placeholder: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694",
      onKeyDown: (e) => {
        if (e.key === "Enter") submit();
      },
      trailing: /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPw((s) => !s), style: { background: "transparent", border: "none", color: "var(--fg-subtle)", cursor: "pointer", padding: 4, display: "flex" } }, showPw ? /* @__PURE__ */ React.createElement(IcEye, { size: 16 }) : /* @__PURE__ */ React.createElement(IcEyeOff, { size: 16 }))
    }
  )), isSignup && /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uB984", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: name, onChange: setName, placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694" })), isSignup && !isTeacher && /* @__PURE__ */ React.createElement(FormField, { label: "\uCD08\uB300\uCF54\uB4DC", hint: "\uC120\uD0DD \xB7 \uB098\uC911\uC5D0 \uB9C8\uC774\uD398\uC774\uC9C0\uC5D0\uC11C \uC785\uB825\uD574\uB3C4 \uAD1C\uCC2E\uC544\uC694", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: inviteCode, onChange: setInviteCode, placeholder: "6\uC790\uB9AC \uCF54\uB4DC\uB97C \uC785\uB825\uD558\uC138\uC694", leading: /* @__PURE__ */ React.createElement(IcSchool, { size: 16, color: "var(--fg-subtle)" }) })), isSignup && isTeacher && /* @__PURE__ */ React.createElement(FormField, { label: "\uC18C\uC18D \uD559\uAD50 / \uD559\uAE09", required: true, hint: "\uAC00\uC785 \uD6C4 \uD559\uAE09 \uC124\uC815\uC5D0\uC11C \uBCC0\uACBD\uD560 \uC218 \uC788\uC5B4\uC694", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: school, onChange: setSchool, placeholder: "\uD559\uAD50\uBA85\uACFC \uD559\uAE09\uC744 \uC785\uB825\uD558\uC138\uC694", leading: /* @__PURE__ */ React.createElement(IcSchool, { size: 16, color: "var(--fg-subtle)" }) })), isSignup && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, marginBottom: 18, padding: 16, border: "1px solid var(--line)", borderRadius: 12, background: "var(--bg-muted)" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", paddingBottom: 12, borderBottom: "1px solid var(--line-subtle)", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: allChecked, onChange: toggleAll, style: { width: 18, height: 18, accentColor: "var(--brand-500)", cursor: "pointer" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, "\uC804\uCCB4 \uB3D9\uC758"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", marginLeft: "auto" } }, "\uC120\uD0DD \uD56D\uBAA9 \uD3EC\uD568")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, required.map((c) => /* @__PURE__ */ React.createElement(ConsentRow, { key: c.id, required: true, checked: !!consents[c.id], onToggle: () => toggle(c.id), label: c.label, linkLabel: c.linkLabel })), OPTIONAL.map((c) => /* @__PURE__ */ React.createElement(ConsentRow, { key: c.id, checked: !!consents[c.id], onToggle: () => toggle(c.id), label: c.label }))), !allRequiredChecked && Object.keys(consents).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontSize: 12, color: "var(--danger)", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 12 }), " \uD544\uC218 \uD56D\uBAA9\uC744 \uBAA8\uB450 \uB3D9\uC758\uD574\uC8FC\uC138\uC694")), authError && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "var(--danger)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 14 }), " ", authError), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !canSubmit || busy, onClick: submit }, busy ? "\uCC98\uB9AC \uC911\u2026" : isSignup ? "\uD68C\uC6D0\uAC00\uC785 \xB7 \uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8 \uC2DC\uC791" : "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, isSignup ? "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uB098\uC694? " : "\uC544\uC9C1 \uACC4\uC815\uC774 \uC5C6\uB098\uC694? ", /* @__PURE__ */ React.createElement("a", { onClick: () => {
    setAuthError("");
    switchMode(isSignup ? "login" : "signup");
  }, style: { color: "var(--brand-600)", fontWeight: 700, cursor: "pointer" } }, isSignup ? "\uB85C\uADF8\uC778" : "\uD68C\uC6D0\uAC00\uC785")), !isSignup && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, textAlign: "center", fontSize: 13, color: "var(--fg-subtle)" } }, /* @__PURE__ */ React.createElement("a", { style: { cursor: "pointer" } }, "\uBE44\uBC00\uBC88\uD638\uB97C \uC78A\uC73C\uC168\uB098\uC694?")))));
}
function ConsentRow({ required, checked, onToggle, label, linkLabel }) {
  return /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, lineHeight: 1.4 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked, onChange: onToggle, style: { width: 16, height: 16, marginTop: 1, accentColor: "var(--brand-500)", cursor: "pointer", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("span", { style: { color: required ? "var(--danger)" : "var(--fg-subtle)", fontWeight: 700, marginRight: 4 } }, "[", required ? "\uD544\uC218" : "\uC120\uD0DD", "]"), label), linkLabel && /* @__PURE__ */ React.createElement("a", { style: { fontSize: 11, color: "var(--fg-subtle)", textDecoration: "underline", cursor: "pointer", flexShrink: 0, paddingTop: 2 } }, linkLabel));
}
function GoogleCallback() {
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", maxWidth: 360 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "var(--bg-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", border: "3px solid var(--brand-500)", borderTopColor: "transparent", animation: "spin 1s linear infinite" } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 8 } }, "Google \uB85C\uADF8\uC778 \uC911\uC774\uC5D0\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uACC4\uC815\uC744 \uD655\uC778\uD558\uACE0 \uC788\uC5B4\uC694. \uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694.")));
}
function PaymentResult({ status = "success" }) {
  const config = {
    success: {
      icon: /* @__PURE__ */ React.createElement(IcCheckCircle, null),
      color: "var(--success)",
      bg: "var(--success-bg)",
      title: "\uACB0\uC81C\uAC00 \uC644\uB8CC\uB410\uC5B4\uC694",
      body: "\uD559\uC0DD \uD50C\uB79C\uC774 \uD65C\uC131\uD654\uB410\uC5B4\uC694. \uC601\uC218\uC99D\uC744 \uB4F1\uB85D\uB41C \uC774\uBA54\uC77C\uB85C \uBCF4\uB0B4\uB4DC\uB838\uC5B4\uC694.",
      detail: [
        ["\uACB0\uC81C \uAE08\uC561", "\u20A93,000"],
        ["\uACB0\uC81C \uC218\uB2E8", "\uC2E0\uD55C BC\uCE74\uB4DC (****1234)"],
        ["\uACB0\uC81C\uC77C", "2026. 06. 01 09:12"],
        ["\uB2E4\uC74C \uACB0\uC81C \uC608\uC815\uC77C", "2026. 07. 01"]
      ],
      cta: "\uB300\uC2DC\uBCF4\uB4DC\uB85C \uAC00\uAE30"
    },
    fail: {
      icon: /* @__PURE__ */ React.createElement(IcXCircle, null),
      color: "var(--danger)",
      bg: "var(--danger-bg)",
      title: "\uACB0\uC81C\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694",
      body: "\uCE74\uB4DC \uD55C\uB3C4 \uB610\uB294 \uC794\uC561\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694. \uB2E4\uB978 \uCE74\uB4DC\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098, \uC7A0\uC2DC \uD6C4 \uC7AC\uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.",
      detail: [
        ["\uACB0\uC81C \uAE08\uC561", "\u20A93,000"],
        ["\uC2E4\uD328 \uCF54\uB4DC", "OVER_LIMIT_AMOUNT"],
        ["\uC2DC\uAC01", "2026. 06. 01 09:12"]
      ],
      cta: "\uB2E4\uC2DC \uACB0\uC81C\uD558\uAE30"
    },
    cancel: {
      icon: /* @__PURE__ */ React.createElement(IcAlert, null),
      color: "var(--warning)",
      bg: "var(--warning-bg)",
      title: "\uACB0\uC81C\uB97C \uCDE8\uC18C\uD588\uC5B4\uC694",
      body: "\uACB0\uC81C\uAC00 \uC9C4\uD589\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694. \uC5B8\uC81C\uB4E0 \uB2E4\uC2DC \uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.",
      detail: [
        ["\uC2DC\uAC01", "2026. 06. 01 09:12"]
      ],
      cta: "\uD50C\uB79C \uC120\uD0DD\uD558\uB7EC \uAC00\uAE30"
    }
  }[status];
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100%", background: "var(--bg-canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 } }, /* @__PURE__ */ React.createElement(Card, { padding: 40, style: { width: "100%", maxWidth: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: config.bg,
    color: config.color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px"
  } }, React.cloneElement(config.icon, { size: 36 })), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 800, color: "var(--fg-strong)", margin: 0, marginBottom: 10, letterSpacing: "-0.6px" }, className: "kr-heading" }, config.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6, margin: 0, marginBottom: 24 }, className: "kr-heading" }, config.body), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-muted)", borderRadius: 12, padding: "14px 16px", textAlign: "left", marginBottom: 24 } }, config.detail.map(([k, v], i, arr) => /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none", fontSize: 13 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, k), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-strong)", fontWeight: 600 }, className: "num" }, v)))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true }, config.cta), status !== "success" && /* @__PURE__ */ React.createElement("button", { style: { marginTop: 12, background: "transparent", border: "none", color: "var(--fg-muted)", fontSize: 13, cursor: "pointer" } }, "\uD648\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30")));
}
function WebAuthScreen() {
  const [view, setView] = React.useState("landing");
  const [role, setRole] = React.useState("student");
  const [mode, setMode] = React.useState("login");
  const nav = (v, r, m) => {
    if (r) setRole(r);
    if (m) setMode(m);
    setView(v);
  };
  if (view === "auth") {
    return /* @__PURE__ */ React.createElement(AuthScreen, { role, mode, setRole, setMode, onBack: () => setView("landing"), onNav: nav });
  }
  if (typeof Landing3D === "function") return /* @__PURE__ */ React.createElement(Landing3D, { onNav: nav });
  return /* @__PURE__ */ React.createElement(LandingPage, { variant: "A", onNav: nav });
}
Object.assign(window, {
  LandingPage,
  AuthScreen,
  WebAuthScreen,
  GoogleCallback,
  PaymentResult,
  TermsPage,
  PrivacyPage,
  PricingPage,
  ForgotPasswordPage,
  FindIdPage
});
function AuthShell({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100%", background: "var(--bg-canvas)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 460 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 28, height: 28, borderRadius: 8, background: "var(--brand-500)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCompass, { size: 18, color: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-0.3px" } }, "\uC9C4\uB85C\uB098\uCE68\uBC18")), /* @__PURE__ */ React.createElement(Card, { padding: 36 }, children)));
}
function ForgotPasswordPage() {
  const [step, setStep] = React.useState("request");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [pwConfirm, setPwConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  const pwMatch = pw && pw === pwConfirm;
  return /* @__PURE__ */ React.createElement(AuthShell, null, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "pw", label: "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30" }, { id: "id", label: "\uC544\uC774\uB514 \uCC3E\uAE30" }], activeId: "pw", onChange: () => {
  } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24 } }, step === "request" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, "\uBE44\uBC00\uBC88\uD638\uB97C \uC78A\uC73C\uC168\uB098\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 24 }, className: "kr-heading" }, "\uAC00\uC785 \uC2DC \uC0AC\uC6A9\uD55C \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD558\uBA74 \uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815 \uB9C1\uD06C\uB97C \uBCF4\uB0B4\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uBA54\uC77C", required: true, style: { marginBottom: 20 }, error: email && !emailValid ? "\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uD615\uC2DD\uC774 \uC544\uB2C8\uC5D0\uC694" : null }, /* @__PURE__ */ React.createElement(TextInput, { value: email, onChange: setEmail, placeholder: "\uAC00\uC785\uD55C \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD558\uC138\uC694", type: "email", leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !email || !emailValid, onClick: () => setStep("sent") }, "\uC778\uC99D \uBA54\uC77C \uBC1B\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uACC4\uC815\uC774 \uAE30\uC5B5\uB098\uC168\uB098\uC694? ", /* @__PURE__ */ React.createElement("a", { style: { color: "var(--brand-600)", fontWeight: 700, cursor: "pointer" } }, "\uB85C\uADF8\uC778"))), step === "sent" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 26 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, "\uBA54\uC77C\uC744 \uBCF4\uB0C8\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 20 }, className: "kr-heading" }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-strong)" } }, email), "\uB85C \uBCF4\uB0B8 6\uC790\uB9AC \uC778\uC99D\uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694. \uBA54\uC77C\uC774 \uC624\uC9C0 \uC54A\uC73C\uBA74 \uC2A4\uD338\uD568\uB3C4 \uD655\uC778\uD574\uBCF4\uC138\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uC778\uC99D\uCF54\uB4DC", required: true, style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(TextInput, { value: code, onChange: (v) => setCode(v.replace(/\D/g, "").slice(0, 6)), placeholder: "6\uC790\uB9AC \uC22B\uC790", leading: /* @__PURE__ */ React.createElement(IcLock, { size: 16 }) })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: code.length !== 6, onClick: () => setStep("reset") }, "\uC778\uC99D\uD558\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, textAlign: "center", fontSize: 12, color: "var(--fg-subtle)" } }, /* @__PURE__ */ React.createElement("span", null, "\uBA54\uC77C\uC744 \uBC1B\uC9C0 \uBABB\uD558\uC168\uB098\uC694? "), /* @__PURE__ */ React.createElement("a", { style: { color: "var(--brand-600)", fontWeight: 700, cursor: "pointer" } }, "\uB2E4\uC2DC \uBCF4\uB0B4\uAE30 (60s)"))), step === "reset" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, "\uC0C8 \uBE44\uBC00\uBC88\uD638\uB97C \uC124\uC815\uD558\uC138\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 24 }, className: "kr-heading" }, "\uC601\uBB38, \uC22B\uC790\uB97C \uD3EC\uD568\uD55C 8\uC790 \uC774\uC0C1\uC73C\uB85C \uC124\uC815\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uC0C8 \uBE44\uBC00\uBC88\uD638", required: true, style: { marginBottom: 14 }, hint: pw && !pwValid ? "\uC601\uBB38\xB7\uC22B\uC790 \uD3EC\uD568 8\uC790 \uC774\uC0C1\uC774 \uD544\uC694\uD574\uC694" : null }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      value: pw,
      onChange: setPw,
      type: showPw ? "text" : "password",
      placeholder: "\uC0C8 \uBE44\uBC00\uBC88\uD638",
      trailing: /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPw((s) => !s), style: { background: "transparent", border: "none", color: "var(--fg-subtle)", cursor: "pointer", padding: 4, display: "flex" } }, showPw ? /* @__PURE__ */ React.createElement(IcEye, { size: 16 }) : /* @__PURE__ */ React.createElement(IcEyeOff, { size: 16 }))
    }
  )), /* @__PURE__ */ React.createElement(FormField, { label: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", required: true, style: { marginBottom: 20 }, error: pwConfirm && !pwMatch ? "\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC544\uC694" : null }, /* @__PURE__ */ React.createElement(TextInput, { value: pwConfirm, onChange: setPwConfirm, type: "password", placeholder: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uB2E4\uC2DC \uC785\uB825" })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !pwValid || !pwMatch, onClick: () => setStep("done") }, "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uD558\uAE30")), step === "done" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 28 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB410\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 24 }, className: "kr-heading" }, "\uC0C8 \uBE44\uBC00\uBC88\uD638\uB85C \uB2E4\uC2DC \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true }, "\uB85C\uADF8\uC778\uD558\uB7EC \uAC00\uAE30"))));
}
function FindIdPage() {
  const [step, setStep] = React.useState("request");
  const [name, setName] = React.useState("");
  const [school, setSchool] = React.useState("");
  return /* @__PURE__ */ React.createElement(AuthShell, null, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "pw", label: "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30" }, { id: "id", label: "\uC544\uC774\uB514 \uCC3E\uAE30" }], activeId: "id", onChange: () => {
  } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24 } }, step === "request" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, "\uAC00\uC785\uD55C \uC774\uBA54\uC77C\uC744 \uCC3E\uC544\uB4DC\uB9B4\uAC8C\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 24 }, className: "kr-heading" }, "\uC774\uB984\uACFC \uD559\uAD50\uB97C \uC785\uB825\uD558\uBA74 \uAC00\uC785\uB41C \uC774\uBA54\uC77C\uC758 \uC77C\uBD80\uB97C \uC54C\uB824\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uC774\uB984", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: name, onChange: setName, placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uAD50\uBA85", required: true, style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(TextInput, { value: school, onChange: setSchool, placeholder: "\uD559\uAD50\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694", leading: /* @__PURE__ */ React.createElement(IcSchool, { size: 16 }) })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !name || !school, onClick: () => setStep("result") }, "\uC774\uBA54\uC77C \uCC3E\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694? ", /* @__PURE__ */ React.createElement("a", { style: { color: "var(--brand-600)", fontWeight: 700, cursor: "pointer" } }, "\uD68C\uC6D0\uAC00\uC785"))), step === "result" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 28 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 20, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, name, "\uB2D8\uC758 \uAC00\uC785 \uC774\uBA54\uC77C"), /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg-muted)", borderRadius: 12, textAlign: "center", margin: "14px 0 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", fontFamily: "monospace" } }, "jih****@gmail.com"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 } }, "\uAC00\uC785\uC77C 2026.05.02")), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true }, "\uB85C\uADF8\uC778\uD558\uB7EC \uAC00\uAE30"), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "md", full: true, style: { marginTop: 6 } }, "\uBE44\uBC00\uBC88\uD638\uB3C4 \uCC3E\uAE30"))));
}
function PricingPage() {
  const [cycle, setCycle] = React.useState("annual");
  const plans = cycle === "monthly" ? {
    student: { price: "3,000", unit: "\uC6D0 / \uC6D4", sub: "\uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694", save: null, billing: "\uB9E4\uC6D4 \uC790\uB3D9\uACB0\uC81C" },
    teacher: { price: "30,000", unit: "\uC6D0 / \uC6D4", sub: "\uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694 \xB7 \uCD5C\uB300 30\uBA85", save: null, billing: "\uB9E4\uC6D4 \uC790\uB3D9\uACB0\uC81C" }
  } : {
    student: { price: "30,000", unit: "\uC6D0 / \uB144", sub: "\uC6D4 \u20A92,500 \uAF34 \xB7 \uCCAB \uB2EC\uC740 \uBB34\uB8CC\uC608\uC694", save: "\uC6D4\uAC04 \uB300\uBE44 -\u20A96,000", billing: "\uC5F0 1\uD68C \uC790\uB3D9\uACB0\uC81C" },
    teacher: { price: "300,000", unit: "\uC6D0 / \uB144", sub: "\uC6D4 \u20A925,000 \uAF34 \xB7 \uCD5C\uB300 30\uBA85", save: "\uC6D4\uAC04 \uB300\uBE44 -\u20A960,000", billing: "\uC5F0 1\uD68C \uC790\uB3D9\uACB0\uC81C" }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100%", background: "#fff", overflow: "auto" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement(LandingNav, null), /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 40px 32px", textAlign: "center", maxWidth: 1e3, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "success", style: { marginBottom: 14 } }, "\uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 48, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1.5px", lineHeight: 1.15 }, className: "kr-heading" }, "\uC815\uC9C1\uD55C \uAC00\uACA9,", /* @__PURE__ */ React.createElement("br", null), "\uBD80\uB2F4 \uC5C6\uB294 \uC2DC\uC791"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 17, color: "var(--fg-muted)", marginTop: 16, lineHeight: 1.6 }, className: "kr-heading" }, "\uC6D4\uAC04 / \uC5F0\uAC04 \uC911 \uD3B8\uD55C \uBC29\uC2DD\uC73C\uB85C \uC2DC\uC791\uD558\uC138\uC694. \uCCAB \uB2EC \uD6C4 \uC790\uB3D9 \uACB0\uC81C\uB418\uBA70, \uC5B8\uC81C\uB4E0 \uD574\uC9C0\uD560 \uC218 \uC788\uC5B4\uC694.")), /* @__PURE__ */ React.createElement("section", { style: { display: "flex", justifyContent: "center", padding: "0 40px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    background: "var(--bg-muted)",
    borderRadius: 12,
    padding: 4,
    gap: 2,
    alignItems: "center"
  } }, [
    { id: "monthly", label: "\uC6D4\uAC04 \uACB0\uC81C" },
    { id: "annual", label: "\uC5F0\uAC04 \uACB0\uC81C", badge: "\uC57D 17% \uD560\uC778" }
  ].map((it) => {
    const active = cycle === it.id;
    return /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => setCycle(it.id), style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      border: "none",
      cursor: "pointer",
      background: active ? "var(--bg-surface)" : "transparent",
      color: active ? "var(--fg-strong)" : "var(--fg-muted)",
      padding: "10px 18px",
      borderRadius: 10,
      fontSize: 14,
      fontWeight: 700,
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none"
    } }, it.label, it.badge && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { height: 20, padding: "0 6px", fontSize: 10 } }, it.badge));
  }))), /* @__PURE__ */ React.createElement("section", { style: { padding: "0 40px 60px", maxWidth: 1e3, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "md" }, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginTop: 10 } }, "\uD559\uC0DD \uAC1C\uC778 \uD50C\uB79C")), /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 44, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1.5px" } }, plans.student.price), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: "var(--fg-muted)" } }, plans.student.unit)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--success)", fontWeight: 700, marginBottom: 8 } }, plans.student.sub), plans.student.save && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { marginBottom: 16 } }, plans.student.save), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 20 } }, plans.student.billing), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 } }, [
    "AI \uC9C4\uB85C \uC0C1\uB2F4 \uBB34\uC81C\uD55C",
    "\uAC1C\uC778 \uC9C4\uB85C \uB9AC\uD3EC\uD2B8",
    "\uBAA9\uD45C \uB300\uD559/\uD559\uACFC \uBD84\uC11D",
    "\uC131\uC801 \uAE30\uBC18 \uBD80\uC871 \uC601\uC5ED \uBD84\uC11D",
    "\uB9DE\uCDA4 \uD559\uC2B5 \uACC4\uD68D + \uC9C4\uB3C4 \uCCB4\uD06C",
    "\uC11C\uC6B8 \uC8FC\uC694 \uB300\uD559 \uC785\uC2DC \uC815\uBCF4 \uC5F4\uB78C"
  ].map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--brand-500)" }), f))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true }, "\uD559\uC0DD\uC73C\uB85C \uC2DC\uC791\uD558\uAE30")), /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)", border: "1px solid var(--brand-200)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "md" }, "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--fg-strong)", marginTop: 10 } }, "\uAD50\uC0AC \uD559\uAE09 \uD50C\uB79C")), /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: 12, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcGraduation, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 44, fontWeight: 800, color: "var(--fg-strong)", letterSpacing: "-1.5px" } }, plans.teacher.price), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: "var(--fg-muted)" } }, plans.teacher.unit)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--success)", fontWeight: 700, marginBottom: 8 } }, plans.teacher.sub), plans.teacher.save && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", style: { marginBottom: 16 } }, plans.teacher.save), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 20 } }, plans.teacher.billing), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 } }, [
    "\uD559\uAE09 \uCD08\uB300\uCF54\uB4DC \uBC1C\uAE09",
    "\uD559\uC0DD \uCD5C\uB300 30\uBA85\uAE4C\uC9C0 \uAD00\uB9AC",
    "\uD559\uC0DD\uBCC4 \uC9C4\uB85C\xB7\uC131\uC801\xB7\uD559\uC2B5 \uB9AC\uD3EC\uD2B8",
    "\uC0C1\uB2F4 \uC694\uCCAD\xB7\uBA54\uBAA8\xB7\uBA54\uC2DC\uC9C0",
    "\uC2E4\uC2DC\uAC04 SSE \uC54C\uB9BC",
    "\uC0C1\uB2F4 \uC77C\uC815 \uCE98\uB9B0\uB354"
  ].map((f) => /* @__PURE__ */ React.createElement("li", { key: f, style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--accent-purple)" }), f))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, style: { background: "var(--accent-purple)" } }, "\uAD50\uC0AC\uB85C \uC2DC\uC791\uD558\uAE30"))), cycle === "annual" && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 16,
    padding: 18,
    background: "var(--success-bg)",
    borderRadius: 12,
    fontSize: 13,
    color: "var(--success)",
    lineHeight: 1.55,
    display: "flex",
    gap: 10,
    alignItems: "flex-start"
  } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uC5F0\uAC04 \uACB0\uC81C \uC2DC \uD559\uC0DD\uC740 ", /* @__PURE__ */ React.createElement("strong", null, "\u20A96,000"), ", \uAD50\uC0AC\uB294 ", /* @__PURE__ */ React.createElement("strong", null, "\u20A960,000"), "\uC744 \uC544\uB084 \uC218 \uC788\uC5B4\uC694. \uC911\uB3C4 \uD574\uC9C0 \uC2DC \uC794\uC5EC \uAC1C\uC6D4 \uB9CC\uD07C \uC77C\uD560 \uD658\uBD88\uB429\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 18, background: "var(--warning-bg)", borderRadius: 12, fontSize: 13, color: "var(--warning)", lineHeight: 1.55, display: "flex", gap: 10, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 16, style: { marginTop: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, "\uACB0\uC81C \uC5F0\uB3D9 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uACB0\uC81C\uB294 \uBC31\uC5D4\uB4DC PG \uC5F0\uB3D9(\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 / \uD3EC\uD2B8\uC6D0) \uC644\uB8CC \uD6C4 \uD65C\uC131\uD654\uB429\uB2C8\uB2E4. \uD604\uC7AC\uB294 \uBB34\uB8CC \uCCB4\uD5D8\uB9CC \uC2DC\uC791\uD560 \uC218 \uC788\uC5B4\uC694."))), /* @__PURE__ */ React.createElement("section", { style: { padding: "40px 40px 80px", maxWidth: 800, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 28, fontWeight: 800, color: "var(--fg-strong)", textAlign: "center", marginBottom: 32 }, className: "kr-heading" }, "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [
    { q: "\uBB34\uB8CC \uCCB4\uD5D8 \uD6C4 \uC790\uB3D9\uC73C\uB85C \uACB0\uC81C\uB418\uB098\uC694?", a: "\uACB0\uC81C \uC218\uB2E8\uC744 \uB4F1\uB85D\uD55C \uACBD\uC6B0\uC5D0\uB9CC \uC790\uB3D9\uACB0\uC81C\uB429\uB2C8\uB2E4. \uB4F1\uB85D\uD558\uC9C0 \uC54A\uC73C\uBA74 \uCCB4\uD5D8 \uC885\uB8CC \uC2DC \uAE30\uB2A5\uC774 \uBA48\uCD94\uACE0, \uB370\uC774\uD130\uB294 \uADF8\uB300\uB85C \uBCF4\uAD00\uB3FC\uC694." },
    { q: "\uD559\uAD50 \uB2E8\uC704\uB85C \uB3C4\uC785\uD558\uB824\uBA74 \uC5B4\uB5BB\uAC8C \uD574\uC57C \uD558\uB098\uC694?", a: "\uAD50\uBB34\uC2E4 \uB610\uB294 \uD559\uC0AC \uBD80\uC11C \uB2E8\uC704 \uACB0\uC81C\uB294 \uBCC4\uB3C4 \uBB38\uC758\uD574\uC8FC\uC138\uC694. \uD559\uAD50 \uC804\uC6A9 \uC778\uBCF4\uC774\uC2A4 \uBC1C\uD589\uC774 \uAC00\uB2A5\uD574\uC694." },
    { q: "\uD559\uC0DD \uB370\uC774\uD130\uB294 \uC5B4\uB5BB\uAC8C \uBCF4\uD638\uB418\uB098\uC694?", a: "\uC8FC\uBBFC\uBC88\uD638 \uB4F1 \uBBFC\uAC10\uC815\uBCF4\uB294 \uC218\uC9D1\uD558\uC9C0 \uC54A\uC544\uC694. AI \uC0C1\uB2F4 \uB0B4\uC6A9\uC740 \uBCF8\uC778\uACFC \uB2F4\uC784\uAD50\uC0AC\uB9CC \uC5F4\uB78C\uD560 \uC218 \uC788\uC5B4\uC694." },
    { q: "\uC785\uC2DC \uC815\uBCF4\uB294 \uC5B4\uB514\uC11C \uBC1B\uC544\uC624\uB098\uC694?", a: "\uB300\uC785\uC815\uBCF4\uD3EC\uD138\xB7\uB300\uD559\uC54C\uB9AC\uBBF8\xB7\uCEE4\uB9AC\uC5B4\uB137 \uB4F1 \uACF5\uC2DD \uB370\uC774\uD130\uB97C \uBC31\uC5D4\uB4DC\uAC00 \uCE90\uC2F1\xB7\uC815\uADDC\uD654\uD574 \uC81C\uACF5\uD574\uC694. \uCD9C\uCC98\uC640 \uAC31\uC2E0\uC77C\uC774 \uD568\uAED8 \uD45C\uC2DC\uB3FC\uC694." }
  ].map((f, i) => /* @__PURE__ */ React.createElement(FAQRow, { key: i, q: f.q, a: f.a })))), /* @__PURE__ */ React.createElement(LandingFooter, null));
}
function FAQRow({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((o) => !o), style: { width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, q), /* @__PURE__ */ React.createElement(IcChevronDown, { size: 18, color: "var(--fg-muted)", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 220ms var(--ease-toss)" } })), open && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 18px", fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.6 }, className: "kr-heading" }, a));
}
function LegalDoc({ title, badge, sections }) {
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100%", background: "#fff", overflow: "auto" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement(LandingNav, null), /* @__PURE__ */ React.createElement("article", { style: { maxWidth: 720, margin: "0 auto", padding: "60px 40px 80px" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", style: { marginBottom: 14 } }, badge), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 36, fontWeight: 800, color: "var(--fg-strong)", margin: 0, letterSpacing: "-1px" }, className: "kr-heading" }, title), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 12, color: "var(--fg-subtle)" } }, "\uCD5C\uC885 \uAC1C\uC815\uC77C: 2026\uB144 5\uC6D4 17\uC77C \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { background: "var(--warning-bg)", color: "var(--warning)", padding: "2px 6px", borderRadius: 4, fontWeight: 700 } }, "\uBC95\uBB34 \uAC80\uD1A0 \uC804 \uCD08\uC548")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 32, display: "flex", flexDirection: "column", gap: 28 } }, sections.map((s, i) => /* @__PURE__ */ React.createElement("section", { key: i }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 17, fontWeight: 700, color: "var(--fg-strong)", margin: 0, marginBottom: 8 } }, "\uC81C", i + 1, "\uC870 (", s.title, ")"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-default)", lineHeight: 1.7, whiteSpace: "pre-line" }, className: "kr-heading" }, s.body))))), /* @__PURE__ */ React.createElement(LandingFooter, null));
}
function TermsPage() {
  return /* @__PURE__ */ React.createElement(
    LegalDoc,
    {
      title: "\uC11C\uBE44\uC2A4 \uC774\uC6A9\uC57D\uAD00",
      badge: "\uC774\uC6A9\uC57D\uAD00",
      sections: [
        { title: "\uBAA9\uC801", body: '\uBCF8 \uC57D\uAD00\uC740 (\uC8FC)\uC9C4\uB85C\uB098\uCE68\uBC18\uC774 \uC81C\uACF5\uD558\uB294 \uC9C4\uB85C\uB098\uCE68\uBC18 \uC11C\uBE44\uC2A4(\uC774\uD558 "\uC11C\uBE44\uC2A4")\uC758 \uC774\uC6A9\uACFC \uAD00\uB828\uD574 \uD68C\uC0AC\uC640 \uD68C\uC6D0\uC758 \uAD8C\uB9AC\xB7\uC758\uBB34 \uBC0F \uCC45\uC784\uC0AC\uD56D\uC744 \uADDC\uC815\uD558\uB294 \uAC83\uC744 \uBAA9\uC801\uC73C\uB85C \uD569\uB2C8\uB2E4.' },
        { title: "\uC815\uC758", body: '"\uD559\uC0DD \uD68C\uC6D0"\uC774\uB77C \uD568\uC740 \uAD50\uB0B4\xB7\uC678\uC5D0\uC11C \uC9C4\uB85C \uC0C1\uB2F4\uC744 \uBC1B\uAE30 \uC704\uD574 \uC11C\uBE44\uC2A4\uC5D0 \uAC00\uC785\uD55C \uB9CC 14\uC138 \uC774\uC0C1\uC758 \uAC1C\uC778\uC744 \uB9D0\uD569\uB2C8\uB2E4.\n"\uAD50\uC0AC \uD68C\uC6D0"\uC774\uB77C \uD568\uC740 \uD559\uAE09\uC744 \uC6B4\uC601\uD558\uACE0 \uD559\uC0DD\uC744 \uAD00\uB9AC\uD558\uAE30 \uC704\uD574 \uC11C\uBE44\uC2A4\uC5D0 \uAC00\uC785\uD55C \uAD50\uC721 \uC885\uC0AC\uC790\uB97C \uB9D0\uD569\uB2C8\uB2E4.' },
        { title: "\uD68C\uC6D0\uAC00\uC785", body: "\uD68C\uC6D0\uAC00\uC785\uC740 \uC2E0\uCCAD\uC790\uAC00 \uC774\uC6A9\uC57D\uAD00\uACFC \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68\uC5D0 \uB3D9\uC758\uD558\uACE0 \uD68C\uC0AC\uAC00 \uC815\uD55C \uAC00\uC785 \uC591\uC2DD\uC5D0 \uC815\uBCF4\uB97C \uAE30\uC785\uD558\uC5EC \uC2E0\uCCAD\uD55C \uD6C4 \uD68C\uC0AC\uAC00 \uC774\uB97C \uC2B9\uB099\uD568\uC73C\uB85C\uC368 \uCCB4\uACB0\uB429\uB2C8\uB2E4." },
        { title: "\uBB34\uB8CC \uCCB4\uD5D8 \uBC0F \uC720\uB8CC \uC11C\uBE44\uC2A4", body: "\uD68C\uC0AC\uB294 \uC2E0\uADDC \uAC00\uC785\uC790\uC5D0\uAC8C 1\uAC1C\uC6D4\uC758 \uBB34\uB8CC \uCCB4\uD5D8\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4. \uBB34\uB8CC \uCCB4\uD5D8 \uC885\uB8CC \uD6C4 \uACB0\uC81C \uC218\uB2E8\uC744 \uB4F1\uB85D\uD55C \uD68C\uC6D0\uC740 \uD559\uC0DD \uD50C\uB79C \uC6D4 3,000\uC6D0, \uAD50\uC0AC \uD50C\uB79C \uC6D4 30,000\uC6D0\uC73C\uB85C \uC790\uB3D9 \uACB0\uC81C\uB429\uB2C8\uB2E4. \uD68C\uC6D0\uC740 \uC5B8\uC81C\uB4E0\uC9C0 \uAD6C\uB3C5\uC744 \uD574\uC9C0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." },
        { title: "\uD68C\uC6D0\uC758 \uC758\uBB34", body: "\uD68C\uC6D0\uC740 \uD0C0\uC778\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uB3C4\uC6A9\uD574 \uAC00\uC785\uD558\uAC70\uB098 \uC11C\uBE44\uC2A4 \uB0B4\uC5D0 \uD5C8\uC704 \uC815\uBCF4\uB97C \uC785\uB825\uD558\uC9C0 \uC54A\uC544\uC57C \uD569\uB2C8\uB2E4. \uAD50\uC0AC \uD68C\uC6D0\uC740 \uD559\uC0DD \uC815\uBCF4\uB97C \uBCF8 \uC11C\uBE44\uC2A4 \uC678 \uBAA9\uC801\uC73C\uB85C \uC0AC\uC6A9\uD574\uC11C\uB294 \uC548 \uB429\uB2C8\uB2E4." },
        { title: "\uD68C\uC0AC\uC758 \uC758\uBB34", body: "\uD68C\uC0AC\uB294 \uC548\uC815\uC801\uC778 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC744 \uC704\uD574 \uB178\uB825\uD558\uBA70, \uD68C\uC6D0\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uBCF4\uD638\uD558\uAE30 \uC704\uD574 \uBCF4\uC548 \uC2DC\uC2A4\uD15C\uC744 \uC6B4\uC601\uD569\uB2C8\uB2E4." },
        { title: "\uCC45\uC784 \uC81C\uD55C", body: "AI \uC9C4\uB85C \uC0C1\uB2F4 \uACB0\uACFC\uB294 \uD559\uC0DD\uC758 \uC9C4\uB85C \uD0D0\uC0C9\uC744 \uB3D5\uAE30 \uC704\uD55C \uCC38\uACE0 \uC790\uB8CC\uC774\uBA70, \uC9C4\uD559\xB7\uC9C4\uB85C \uC120\uD0DD\uC758 \uCD5C\uC885 \uACB0\uC815\uC740 \uD559\uC0DD, \uBCF4\uD638\uC790, \uB2F4\uC784\uAD50\uC0AC\uC758 \uC0C1\uB2F4\uC744 \uAC70\uCCD0 \uC774\uB904\uC838\uC57C \uD569\uB2C8\uB2E4." },
        { title: "\uC57D\uAD00\uC758 \uBCC0\uACBD", body: "\uD68C\uC0AC\uB294 \uC57D\uAD00\uC744 \uBCC0\uACBD\uD560 \uC218 \uC788\uC73C\uBA70, \uBCC0\uACBD \uC2DC \uC801\uC6A9\uC77C\uC790 7\uC77C \uC804\uBD80\uD130 \uACF5\uC9C0\uD569\uB2C8\uB2E4. \uD68C\uC6D0\uC5D0\uAC8C \uBD88\uB9AC\uD55C \uBCC0\uACBD\uC758 \uACBD\uC6B0 30\uC77C \uC804\uBD80\uD130 \uACF5\uC9C0\uD569\uB2C8\uB2E4." }
      ]
    }
  );
}
function PrivacyPage() {
  return /* @__PURE__ */ React.createElement(
    LegalDoc,
    {
      title: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68",
      badge: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638",
      sections: [
        { title: "\uC218\uC9D1\uD558\uB294 \uAC1C\uC778\uC815\uBCF4", body: "\uD68C\uC0AC\uB294 \uD68C\uC6D0\uAC00\uC785, \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uACFC\uC815\uC5D0\uC11C \uB2E4\uC74C \uC815\uBCF4\uB97C \uC218\uC9D1\uD569\uB2C8\uB2E4:\n- \uD544\uC218: \uC774\uBA54\uC77C, \uBE44\uBC00\uBC88\uD638, \uC774\uB984\n- \uD559\uC0DD \uD68C\uC6D0: \uD559\uAD50\uBA85, \uD559\uB144/\uBC18, \uBAA8\uC758\uACE0\uC0AC\xB7\uB0B4\uC2E0\xB7\uC218\uD589\uD3C9\uAC00 \uC810\uC218, AI \uC0C1\uB2F4 \uB300\uD654\n- \uAD50\uC0AC \uD68C\uC6D0: \uC18C\uC18D\uD559\uAD50, \uB2F4\uB2F9 \uD559\uAE09, \uD559\uC0DD \uAD00\uB9AC \uB0B4\uC5ED\n- \uC790\uB3D9\uC218\uC9D1: \uC811\uC18D IP, \uCFE0\uD0A4, \uAE30\uAE30 \uC815\uBCF4, \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uB85C\uADF8" },
        { title: "\uC218\uC9D1 \uBC0F \uC774\uC6A9 \uBAA9\uC801", body: "\uD68C\uC6D0 \uC2DD\uBCC4 \uBC0F \uC778\uC99D\n\uC9C4\uB85C \uC0C1\uB2F4 \uBC0F \uD559\uC2B5 \uBD84\uC11D \uC11C\uBE44\uC2A4 \uC81C\uACF5\n\uACB0\uC81C \uBC0F \uAD6C\uB3C5 \uAD00\uB9AC\n\uC54C\uB9BC \uBC1C\uC1A1 (\uC0C1\uB2F4 \uC694\uCCAD, \uC131\uC801 \uBCC0\uB3D9, \uACB0\uC81C \uC0C1\uD0DC)\n\uC11C\uBE44\uC2A4 \uAC1C\uC120\uC744 \uC704\uD55C \uD1B5\uACC4 \uBD84\uC11D (\uAC1C\uC778 \uC2DD\uBCC4\uC774 \uBD88\uAC00\uB2A5\uD55C \uD615\uD0DC)" },
        { title: "\uBCF4\uC720 \uBC0F \uC774\uC6A9 \uAE30\uAC04", body: "\uD68C\uC6D0 \uD0C8\uD1F4 \uC2DC \uBAA8\uB4E0 \uAC1C\uC778\uC815\uBCF4\uB97C \uC9C0\uCCB4 \uC5C6\uC774 \uD30C\uAE30\uD569\uB2C8\uB2E4. \uB2E8, \uAD00\uB828 \uBC95\uB839\uC5D0 \uB530\uB77C \uBCF4\uC874\uD574\uC57C \uD558\uB294 \uACBD\uC6B0 \uD574\uB2F9 \uAE30\uAC04 \uB3D9\uC548 \uBCC4\uB3C4 \uBCF4\uAD00\uD569\uB2C8\uB2E4.\n- \uC804\uC790\uC0C1\uAC70\uB798\uBC95: \uACB0\uC81C \uAE30\uB85D 5\uB144, \uC18C\uBE44\uC790 \uBD88\uB9CC \uCC98\uB9AC \uAE30\uB85D 3\uB144\n- \uD1B5\uC2E0\uBE44\uBC00\uBCF4\uD638\uBC95: \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uB85C\uADF8 3\uAC1C\uC6D4" },
        { title: "\uC81C3\uC790 \uC81C\uACF5", body: "\uD68C\uC0AC\uB294 \uD68C\uC6D0\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uC678\uBD80\uC5D0 \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uB2E8, \uD68C\uC6D0\uC774 \uBA85\uC2DC\uC801\uC73C\uB85C \uB3D9\uC758\uD55C \uACBD\uC6B0, \uACB0\uC81C \uCC98\uB9AC\uB97C \uC704\uD574 \uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20/\uD3EC\uD2B8\uC6D0 \uB4F1 \uACB0\uC81C \uB300\uD589\uC0AC\uC5D0 \uD544\uC694\uD55C \uC815\uBCF4\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4." },
        { title: "AI \uC0C1\uB2F4 \uB370\uC774\uD130 \uCC98\uB9AC", body: "AI \uC9C4\uB85C \uC0C1\uB2F4 \uB300\uD654\uB294 OpenAI/Anthropic \uB4F1\uC758 LLM API\uB97C \uD1B5\uD574 \uCC98\uB9AC\uB429\uB2C8\uB2E4. \uD559\uC0DD \uC2DD\uBCC4 \uC815\uBCF4\uB294 \uB9C8\uC2A4\uD0B9\uB41C \uC0C1\uD0DC\uB85C \uC804\uB2EC\uB418\uBA70, \uBAA8\uB378 \uD559\uC2B5 \uBAA9\uC801\uC73C\uB85C \uC7AC\uC0AC\uC6A9\uB418\uC9C0 \uC54A\uB3C4\uB85D \uACC4\uC57D\uC0C1 \uBCF4\uC7A5\uB429\uB2C8\uB2E4." },
        { title: "\uD68C\uC6D0\uC758 \uAD8C\uB9AC", body: "\uD68C\uC6D0\uC740 \uC5B8\uC81C\uB4E0\uC9C0 \uBCF8\uC778\uC758 \uAC1C\uC778\uC815\uBCF4\uB97C \uC5F4\uB78C, \uC218\uC815, \uC0AD\uC81C\uD560 \uC218 \uC788\uC73C\uBA70, \uB3D9\uC758\uB97C \uCCA0\uD68C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB9CC 14\uC138 \uBBF8\uB9CC\uC758 \uC790\uB140\uC5D0 \uB300\uD574\uC11C\uB294 \uBC95\uC815\uB300\uB9AC\uC778\uC774 \uAD8C\uB9AC\uB97C \uD589\uC0AC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." },
        { title: "\uC548\uC804\uC131 \uD655\uBCF4 \uC870\uCE58", body: "\uC804\uC1A1 \uAD6C\uAC04 TLS 1.3 \uC554\uD638\uD654\n\uBE44\uBC00\uBC88\uD638 bcrypt \uD574\uC2F1\n\uC5ED\uD560 \uAE30\uBC18 \uC811\uADFC \uC81C\uC5B4(RBAC) \uBC0F \uAC10\uC0AC \uB85C\uADF8\n\uBD84\uAE30\uBCC4 \uBCF4\uC548 \uC810\uAC80" },
        { title: "\uAC1C\uC778\uC815\uBCF4 \uBCF4\uD638\uCC45\uC784\uC790", body: "\uCC45\uC784\uC790: \uD64D\uAE38\uB3D9 (privacy@jinronavi.kr)\n\uACE0\uAC1D\uC13C\uD130: 1599-0000" }
      ]
    }
  );
}
