function WebToast({ toast, onClose, onAction, exiting }) {
  const tones = {
    brand: { bg: "var(--brand-50)", fg: "var(--brand-600)", border: "#D6E6FF" },
    purple: { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)", border: "#E2D6FF" },
    success: { bg: "var(--success-bg)", fg: "var(--success)", border: "#C8E5D2" },
    warning: { bg: "var(--warning-bg)", fg: "var(--warning)", border: "#FBE0A2" },
    danger: { bg: "var(--danger-bg)", fg: "var(--danger)", border: "#F8C5C5" },
    info: { bg: "var(--info-bg)", fg: "var(--brand-600)", border: "#D1E1FA" },
    mint: { bg: "var(--accent-mint-bg)", fg: "var(--accent-mint)", border: "#A9E7D5" },
    neutral: { bg: "var(--bg-muted)", fg: "var(--fg-default)", border: "var(--line)" }
  };
  const t = tones[toast.tone] || tones.neutral;
  return /* @__PURE__ */ React.createElement("div", { style: {
    width: 360,
    background: "var(--bg-elevated)",
    borderRadius: 14,
    boxShadow: "var(--shadow-pop)",
    border: "1px solid var(--line-subtle)",
    overflow: "hidden",
    animation: exiting ? "toastExit 200ms var(--ease-toss) forwards" : "toastEnter 320ms var(--ease-toss)"
  } }, /* @__PURE__ */ React.createElement("style", null, `
        @keyframes toastEnter { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastExit { to { transform: translateX(100%); opacity: 0; } }
        @keyframes toastProgress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
      `), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, padding: "14px 14px 12px", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: t.bg,
    color: t.fg,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } }, React.cloneElement(toast.icon || /* @__PURE__ */ React.createElement(IcBell, null), { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 } }, toast.chip && /* @__PURE__ */ React.createElement(Chip, { tone: toast.tone, size: "sm", style: { height: 18, padding: "0 6px", fontSize: 10 } }, toast.chip), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, toast.title)), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--fg-subtle)", padding: 2, marginRight: -4, marginTop: -2 } }, /* @__PURE__ */ React.createElement(IcX, { size: 14 }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.45, marginBottom: toast.actions ? 8 : 0 }, className: "kr-heading" }, toast.body), toast.from && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Avatar, { name: toast.from.slice(0, 1), size: 14 }), toast.from, " \xB7 ", toast.time || "\uBC29\uAE08"), toast.actions && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8 } }, toast.actions.map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => onAction && onAction(a.id), style: {
    border: "none",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    background: a.primary ? t.fg : "transparent",
    color: a.primary ? "#fff" : t.fg
  } }, a.label))))), /* @__PURE__ */ React.createElement("div", { style: { height: 3, background: "var(--bg-muted)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    height: "100%",
    background: t.fg,
    transformOrigin: "left",
    animation: `toastProgress ${toast.duration || 6e3}ms linear forwards`
  } })));
}
function MobileToast({ toast, onClose, onTap, exiting }) {
  const tones = {
    brand: { bg: "var(--brand-50)", fg: "var(--brand-600)" },
    purple: { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)" },
    success: { bg: "var(--success-bg)", fg: "var(--success)" },
    warning: { bg: "var(--warning-bg)", fg: "var(--warning)" },
    danger: { bg: "var(--danger-bg)", fg: "var(--danger)" },
    info: { bg: "var(--info-bg)", fg: "var(--brand-600)" },
    mint: { bg: "var(--accent-mint-bg)", fg: "var(--accent-mint)" },
    neutral: { bg: "var(--bg-muted)", fg: "var(--fg-default)" }
  };
  const t = tones[toast.tone] || tones.neutral;
  return /* @__PURE__ */ React.createElement("div", { onClick: onTap, style: {
    background: "var(--bg-elevated)",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(17,24,39,0.18), 0 2px 6px rgba(17,24,39,0.06)",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    animation: exiting ? "mtoastExit 240ms var(--ease-toss) forwards" : "mtoastEnter 360ms var(--ease-toss)"
  } }, /* @__PURE__ */ React.createElement("style", null, `
        @keyframes mtoastEnter { from { transform: translateY(-120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes mtoastExit { to { transform: translateY(-120%); opacity: 0; } }
      `), /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: t.bg,
    color: t.fg,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } }, React.cloneElement(toast.icon || /* @__PURE__ */ React.createElement(IcBell, null), { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, toast.title), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)", flexShrink: 0 } }, "\uC9C0\uAE08")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, className: "kr-heading" }, toast.body)));
}
function WebToastHost({ toasts, onClose, onAction }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    right: 24,
    bottom: 24,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    pointerEvents: "none"
  } }, toasts.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { pointerEvents: "auto" } }, /* @__PURE__ */ React.createElement(WebToast, { toast: t, onClose: () => onClose(t.id), onAction: (a) => onAction && onAction(t.id, a) }))));
}
function MobileToastHost({ toasts, onClose, onTap }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 56,
    left: 10,
    right: 10,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    pointerEvents: "none"
  } }, toasts.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { pointerEvents: "auto" } }, /* @__PURE__ */ React.createElement(MobileToast, { toast: t, onClose: () => onClose(t.id), onTap: () => onTap && onTap(t.id) }))));
}
const SAMPLE_TOASTS = {
  student: [
    { id: "st-msg", tone: "brand", chip: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uC774\uC9C0\uC6D0 \uC120\uC0DD\uB2D8", body: "\uB0B4\uC77C \uC0C1\uB2F4 \uC2DC\uAC04 15:00\uC73C\uB85C \uC7A1\uC544\uB3C4 \uAD1C\uCC2E\uC744\uAE4C\uC694?", from: "\uC774\uC9C0\uC6D0", time: "\uBC29\uAE08", duration: 6e3 },
    { id: "st-memo", tone: "purple", chip: "\uBA54\uBAA8", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uC0C8 \uC0C1\uB2F4 \uBA54\uBAA8\uAC00 \uB3C4\uCC29\uD588\uC5B4\uC694", body: "\uC774\uBC88 \uC8FC \uC601\uC5B4 \uB2E8\uC5B4 \uC9C4\uB3C4\uAC00 \uC88B\uC544\uC694. \uBAA8\uC758\uACE0\uC0AC \uC5B4\uBC95 \uBD80\uBD84\uB3C4...", from: "\uC774\uC9C0\uC6D0 \uC120\uC0DD\uB2D8", duration: 6e3 },
    { id: "st-report", tone: "purple", icon: /* @__PURE__ */ React.createElement(IcSparkles, null), title: "AI \uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uAC00 \uC900\uBE44\uB410\uC5B4\uC694", body: "\uB300\uD654 12\uD68C\uB97C \uBC14\uD0D5\uC73C\uB85C 1\uCC28 \uB9AC\uD3EC\uD2B8\uB97C \uD655\uC778\uD574\uBCF4\uC138\uC694.", duration: 7e3, actions: [{ id: "view", label: "\uB9AC\uD3EC\uD2B8 \uBCF4\uAE30", primary: true }, { id: "later", label: "\uB098\uC911\uC5D0" }] },
    { id: "st-confirm", tone: "success", icon: /* @__PURE__ */ React.createElement(IcCheckCircle, null), title: "\uC0C1\uB2F4\uC774 \uD655\uC815\uB410\uC5B4\uC694", body: "5/19 (\uC6D4) 15:00, 2\uD559\uB144 3\uBC18 \uAD50\uC2E4\uC5D0\uC11C \uB9CC\uB098\uC694.", duration: 6e3 },
    { id: "st-due", tone: "mint", icon: /* @__PURE__ */ React.createElement(IcBook, null), title: "\uD559\uC2B5 \uB9C8\uAC10 \uC784\uBC15", body: "\uAD6D\uC5B4 \uBE44\uBB38\uD559 3\uC9C0\uBB38 \xB7 \uC624\uB298 23:59\uAE4C\uC9C0", duration: 5e3 },
    { id: "st-pay", tone: "warning", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), title: "\uACB0\uC81C\uAC00 \uACE7 \uC2DC\uC791\uB3FC\uC694", body: "\uBB34\uB8CC \uCCB4\uD5D8\uC774 5\uC6D4 31\uC77C\uC5D0 \uC885\uB8CC\uB3FC\uC694. \uACB0\uC81C \uC218\uB2E8\uC744 \uB4F1\uB85D\uD574\uC8FC\uC138\uC694.", duration: 8e3 }
  ],
  teacher: [
    { id: "t-req", tone: "warning", chip: "\uC0C1\uB2F4 \uC694\uCCAD", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uBC15\uBBFC\uD638 \uD559\uC0DD\uC774 \uC0C1\uB2F4\uC744 \uC694\uCCAD\uD588\uC5B4\uC694", body: '"\uC131\uC801\uC774 \uB5A8\uC5B4\uC9C0\uACE0 \uC788\uC5B4\uC11C \uAC71\uC815\uB3FC\uC694..." \xB7 5/27 14:00 \uD76C\uB9DD', from: "\uBC15\uBBFC\uD638", duration: 8e3, actions: [{ id: "accept", label: "\uC218\uB77D", primary: true }, { id: "propose", label: "\uB2E4\uB978 \uC2DC\uAC04" }] },
    { id: "t-join", tone: "success", icon: /* @__PURE__ */ React.createElement(IcUsers, null), title: "\uC0C8 \uD559\uC0DD\uC774 \uD559\uAE09\uC5D0 \uD569\uB958\uD588\uC5B4\uC694", body: "\uC724\uB2E4\uC740 (\uD55C\uBE5B\uACE0 2-3) \xB7 \uCD08\uB300\uCF54\uB4DC H8K49P", duration: 6e3 },
    { id: "t-grade", tone: "info", icon: /* @__PURE__ */ React.createElement(IcChart, null), title: "\uAE40\uC9C0\uD6C8 \uD559\uC0DD\uC774 \uC131\uC801\uC744 \uC785\uB825\uD588\uC5B4\uC694", body: "5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uD3C9\uADE0 84.8 (+2.4)", duration: 5e3 },
    { id: "t-msg", tone: "brand", chip: "\uBA54\uC2DC\uC9C0", icon: /* @__PURE__ */ React.createElement(IcMessage, null), title: "\uC774\uC11C\uC5F0", body: "\uC9C4\uB85C \uBC29\uD5A5 \uC810\uAC80\uD558\uACE0 \uC2F6\uC5B4\uC694. 5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uACB0\uACFC \uBCF4\uACE0...", from: "\uC774\uC11C\uC5F0 \uD559\uC0DD", duration: 6e3 },
    { id: "t-trial", tone: "warning", icon: /* @__PURE__ */ React.createElement(IcCreditCard, null), title: "\uBB34\uB8CC \uCCB4\uD5D8 \uC885\uB8CC\uAE4C\uC9C0 D-7", body: "\uAD50\uC0AC \uD50C\uB79C \uACB0\uC81C \uD6C4\uC5D0\uB3C4 \uD559\uAE09\uC740 \uADF8\uB300\uB85C \uC720\uC9C0\uB3FC\uC694.", duration: 7e3 }
  ],
  admin: [
    { id: "a-fail", tone: "danger", icon: /* @__PURE__ */ React.createElement(IcAlert, null), title: "\uACB0\uC81C \uC2E4\uD328\uC728 \uC784\uACC4\uCE58 \uCD08\uACFC", body: "\uCD5C\uADFC 10\uBD84\uAC04 \uC2E4\uD328\uC728 8.4% (\uC784\uACC4 5%). \uCC98\uB9AC \uD544\uC694.", duration: 1e4, actions: [{ id: "view", label: "\uACB0\uC81C \uBCF4\uAE30", primary: true }, { id: "dismiss", label: "\uD655\uC778" }] },
    { id: "a-webhook", tone: "warning", icon: /* @__PURE__ */ React.createElement(IcRefresh, null), title: "Webhook \uC7AC\uC2DC\uB3C4 \uD55C\uB3C4 \uB3C4\uB2EC", body: "pay_98121 \xB7 3\uD68C \uBAA8\uB450 \uC2E4\uD328 \xB7 \uC218\uB3D9 \uCC98\uB9AC \uD544\uC694", duration: 1e4 },
    { id: "a-deploy", tone: "success", icon: /* @__PURE__ */ React.createElement(IcServer, null), title: "\uC0C8 \uBC30\uD3EC\uAC00 \uC644\uB8CC\uB410\uC5B4\uC694", body: "v0.42.2 \u2192 main \xB7 1m 24s \xB7 \uC778\uC2A4\uD134\uC2A4 6/6 \uC815\uC0C1", duration: 6e3 },
    { id: "a-spike", tone: "info", icon: /* @__PURE__ */ React.createElement(IcZap, null), title: "AI \uC0AC\uC6A9\uB7C9 \uAE09\uC99D \uAC10\uC9C0", body: "\uCD5C\uADFC 5\uBD84 API \uD638\uCD9C +180% (\uC804 5\uBD84 \uB300\uBE44)", duration: 8e3 },
    { id: "a-mod", tone: "purple", icon: /* @__PURE__ */ React.createElement(IcShield, null), title: "\uC2E0\uACE0\uB41C \uCF58\uD150\uCE20 1\uAC74", body: "\uD559\uC0DD-\uD559\uC0DD \uBA54\uC2DC\uC9C0 \uC2E0\uACE0 \xB7 \uAC80\uD1A0 \uD544\uC694", duration: 8e3 }
  ]
};
Object.assign(window, {
  WebToast,
  MobileToast,
  WebToastHost,
  MobileToastHost,
  SAMPLE_TOASTS
});
