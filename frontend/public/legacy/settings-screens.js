function SettingsPassword({ back }) {
  const [cur, setCur] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const rules = [
    { id: "len", label: "8\uC790 \uC774\uC0C1", ok: next.length >= 8 },
    { id: "mix", label: "\uC601\uBB38 + \uC22B\uC790 \uD3EC\uD568", ok: /[a-zA-Z]/.test(next) && /[0-9]/.test(next) },
    { id: "special", label: "\uD2B9\uC218\uBB38\uC790 1\uAC1C \uC774\uC0C1", ok: /[^a-zA-Z0-9]/.test(next) }
  ];
  const allOk = rules.every((r) => r.ok);
  const match = next.length > 0 && next === confirm;
  const canSubmit = cur.length > 0 && allOk && match;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: back }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(SectionCard, { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(
    TextInput,
    {
      value: cur,
      onChange: setCur,
      type: show ? "text" : "password",
      placeholder: "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638",
      trailing: /* @__PURE__ */ React.createElement("button", { onClick: () => setShow((s) => !s), style: { border: "none", background: "transparent", cursor: "pointer", color: "var(--fg-subtle)", display: "flex" } }, show ? /* @__PURE__ */ React.createElement(IcEyeOff, { size: 16 }) : /* @__PURE__ */ React.createElement(IcEye, { size: 16 }))
    }
  )), /* @__PURE__ */ React.createElement(FormField, { label: "\uC0C8 \uBE44\uBC00\uBC88\uD638", required: true, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(TextInput, { value: next, onChange: (v) => {
    setNext(v);
    setTouched(true);
  }, type: show ? "text" : "password", placeholder: "\uC0C8 \uBE44\uBC00\uBC88\uD638" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 } }, rules.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: r.ok ? "var(--success)" : "var(--fg-subtle)" } }, r.ok ? /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 14 }) : /* @__PURE__ */ React.createElement("div", { style: { width: 14, height: 14, borderRadius: "50%", border: "1.5px solid var(--line-strong)" } }), r.label))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778", required: true, error: confirm.length > 0 && !match ? "\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC544\uC694" : null }, /* @__PURE__ */ React.createElement(TextInput, { value: confirm, onChange: setConfirm, type: show ? "text" : "password", placeholder: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uB2E4\uC2DC \uC785\uB825" }))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !canSubmit, onClick: () => {
    showToast("\uBE44\uBC00\uBC88\uD638\uB97C \uBCC0\uACBD\uD588\uC5B4\uC694", "success");
    back();
  } }, "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }, className: "kr-heading" }, "\uBCC0\uACBD \uD6C4 \uB2E4\uB978 \uAE30\uAE30\uC5D0\uC11C\uB294 \uB2E4\uC2DC \uB85C\uADF8\uC778\uC774 \uD544\uC694\uD574\uC694.")));
}
function Toggle({ on, onChange }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: () => onChange(!on), role: "switch", "aria-checked": on, style: {
    width: 46,
    height: 28,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    background: on ? "var(--brand-500)" : "var(--line-strong)",
    position: "relative",
    transition: "background 180ms var(--ease-std)"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    top: 3,
    left: on ? 21 : 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "left 180ms var(--ease-toss)"
  } }));
}
function SettingsNotifications({ back, role = "student" }) {
  const [channels, setChannels] = React.useState({ push: true, email: true, sse: true });
  const studentTypes = [
    { id: "memo", label: "\uC120\uC0DD\uB2D8 \uBA54\uBAA8 \uB3C4\uCC29", desc: "\uAD50\uC0AC\uAC00 \uC0C8 \uC0C1\uB2F4 \uBA54\uBAA8\uB97C \uB0A8\uAE30\uBA74 \uC54C\uB824\uC918\uC694", on: true },
    { id: "report", label: "AI \uB9AC\uD3EC\uD2B8 \uC900\uBE44\uB428", desc: "\uC9C4\uB85C \uB9AC\uD3EC\uD2B8\uAC00 \uC0DD\uC131\uB418\uBA74 \uC54C\uB824\uC918\uC694", on: true },
    { id: "counsel", label: "\uC0C1\uB2F4 \uC694\uCCAD \uC751\uB2F5", desc: "\uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC218\uB77D/\uBCC0\uACBD\uB418\uBA74 \uC54C\uB824\uC918\uC694", on: true },
    { id: "study", label: "\uD559\uC2B5 \uB9AC\uB9C8\uC778\uB354", desc: "\uBBF8\uC644\uB8CC \uD559\uC2B5 \uD56D\uBAA9\uC744 \uC815\uD574\uC9C4 \uC2DC\uAC01\uC5D0 \uC54C\uB824\uC918\uC694", on: false },
    { id: "billing", label: "\uAD6C\uB3C5\xB7\uACB0\uC81C \uC548\uB0B4", desc: "\uCCB4\uD5D8 \uC885\uB8CC, \uACB0\uC81C \uC608\uC815 \uC54C\uB9BC", on: true }
  ];
  const teacherTypes = [
    { id: "req", label: "\uD559\uC0DD \uC0C1\uB2F4 \uC694\uCCAD", desc: "\uD559\uC0DD\uC774 \uC0C1\uB2F4\uC744 \uC694\uCCAD\uD558\uBA74 \uC989\uC2DC \uC54C\uB824\uC918\uC694", on: true },
    { id: "report", label: "\uD559\uC0DD AI \uB9AC\uD3EC\uD2B8 \uC900\uBE44\uB428", desc: "\uB2F4\uB2F9 \uD559\uC0DD \uB9AC\uD3EC\uD2B8\uAC00 \uC0DD\uC131\uB418\uBA74 \uC54C\uB824\uC918\uC694", on: true },
    { id: "risk", label: "\uC8FC\uC758 \uC2E0\uD638 \uAC10\uC9C0", desc: "\uC131\uC801 \uAE09\uB77D\xB7\uD559\uC2B5 \uC815\uCCB4 \uB4F1 \uC2E0\uD638\uB97C \uC54C\uB824\uC918\uC694", on: true },
    { id: "join", label: "\uD559\uAE09 \uC2E0\uADDC \uAC00\uC785", desc: "\uCD08\uB300\uCF54\uB4DC\uB85C \uD559\uC0DD\uC774 \uD569\uB958\uD558\uBA74 \uC54C\uB824\uC918\uC694", on: true },
    { id: "billing", label: "\uAD6C\uB3C5\xB7\uACB0\uC81C \uC548\uB0B4", desc: "\uCCB4\uD5D8 \uC885\uB8CC, \uACB0\uC81C \uC608\uC815 \uC54C\uB9BC", on: true }
  ];
  const [types, setTypes] = React.useState(
    Object.fromEntries((role === "teacher" ? teacherTypes : studentTypes).map((t) => [t.id, t.on]))
  );
  const list = role === "teacher" ? teacherTypes : studentTypes;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC54C\uB9BC \uC124\uC815", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: back }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC54C\uB9BC \uCC44\uB110", subtitle: "\uC54C\uB9BC\uC744 \uBC1B\uC744 \uBC29\uBC95\uC744 \uC120\uD0DD\uD558\uC138\uC694", style: { marginBottom: 12 } }, [
    { id: "push", label: "\uD478\uC2DC \uC54C\uB9BC", desc: "\uC571/\uBE0C\uB77C\uC6B0\uC800 \uD478\uC2DC" },
    { id: "email", label: "\uC774\uBA54\uC77C", desc: "\uC8FC\uC694 \uC54C\uB9BC\uC744 \uBA54\uC77C\uB85C\uB3C4 \uBC1B\uAE30" },
    { id: "sse", label: "\uC2E4\uC2DC\uAC04 \uC54C\uB9BC", desc: "\uC571 \uC0AC\uC6A9 \uC911 \uC2E4\uC2DC\uAC04 \uD45C\uC2DC (SSE)" }
  ].map((c, i, arr) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--fg-strong)" } }, c.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 1 } }, c.desc)), /* @__PURE__ */ React.createElement(Toggle, { on: channels[c.id], onChange: (v) => setChannels((s) => ({ ...s, [c.id]: v })) })))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC54C\uB9BC \uC885\uB958", subtitle: "\uBC1B\uACE0 \uC2F6\uC740 \uC54C\uB9BC\uB9CC \uCF1C\uB450\uC138\uC694" }, list.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: t.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none", opacity: channels.push || channels.email || channels.sse ? 1 : 0.5 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--fg-strong)" } }, t.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginTop: 1, lineHeight: 1.4 }, className: "kr-heading" }, t.desc)), /* @__PURE__ */ React.createElement(Toggle, { on: types[t.id], onChange: (v) => setTypes((s) => ({ ...s, [t.id]: v })) })))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, style: { marginTop: 16 }, onClick: () => {
    showToast("\uC54C\uB9BC \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694", "success");
    back();
  } }, "\uC800\uC7A5\uD558\uAE30")));
}
function SettingsTerms({ back }) {
  const [tab, setTab] = React.useState("terms");
  const docs = {
    terms: {
      title: "\uC774\uC6A9\uC57D\uAD00",
      updated: "2026. 05. 01 \uC2DC\uD589",
      sections: [
        ["\uC81C1\uC870 (\uBAA9\uC801)", '\uBCF8 \uC57D\uAD00\uC740 \uC9C4\uB85C\uB098\uCE68\uBC18(\uC774\uD558 "\uD68C\uC0AC")\uC774 \uC81C\uACF5\uD558\uB294 AI \uC9C4\uB85C \uC0C1\uB2F4 \uBC0F \uD559\uC2B5 \uAD00\uB9AC \uC11C\uBE44\uC2A4(\uC774\uD558 "\uC11C\uBE44\uC2A4")\uC758 \uC774\uC6A9\uACFC \uAD00\uB828\uD558\uC5EC \uD68C\uC0AC\uC640 \uC774\uC6A9\uC790 \uAC04\uC758 \uAD8C\uB9AC, \uC758\uBB34 \uBC0F \uCC45\uC784\uC0AC\uD56D\uC744 \uADDC\uC815\uD568\uC744 \uBAA9\uC801\uC73C\uB85C \uD569\uB2C8\uB2E4.'],
        ["\uC81C2\uC870 (\uC815\uC758)", '"\uD559\uC0DD \uD68C\uC6D0"\uC740 \uC9C4\uB85C \uD0D0\uC0C9\xB7\uD559\uC2B5 \uAD00\uB9AC\uB97C \uC704\uD574 \uC11C\uBE44\uC2A4\uB97C \uC774\uC6A9\uD558\uB294 \uC790\uB97C, "\uAD50\uC0AC \uD68C\uC6D0"\uC740 \uD559\uAE09\uC744 \uC6B4\uC601\uD558\uBA70 \uD559\uC0DD\uC744 \uAD00\uB9AC\uD558\uB294 \uC790\uB97C \uC758\uBBF8\uD569\uB2C8\uB2E4. "\uCD08\uB300\uCF54\uB4DC"\uB294 \uAD50\uC0AC \uD68C\uC6D0\uC774 \uD559\uC0DD\uC744 \uD559\uAE09\uC5D0 \uC5F0\uACB0\uD558\uAE30 \uC704\uD574 \uBC1C\uAE09\uD558\uB294 \uCF54\uB4DC\uB97C \uB9D0\uD569\uB2C8\uB2E4.'],
        ["\uC81C3\uC870 (\uC11C\uBE44\uC2A4\uC758 \uC81C\uACF5)", "\uD68C\uC0AC\uB294 AI \uC9C4\uB85C \uC0C1\uB2F4, \uC131\uC801 \uBD84\uC11D, \uD559\uC2B5 \uACC4\uD68D, \uAD50\uC0AC\uC6A9 \uD559\uAE09 \uAD00\uB9AC \uAE30\uB2A5\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4. \uBB34\uB8CC \uC6B4\uC601 \uAE30\uAC04 \uB3D9\uC548\uC5D0\uB294 \uBCC4\uB3C4\uC758 \uC774\uC6A9\uB8CC\uAC00 \uCCAD\uAD6C\uB418\uC9C0 \uC54A\uC73C\uBA70, \uC720\uB8CC \uC804\uD658 \uC2DC \uCD5C\uC18C 30\uC77C \uC804\uC5D0 \uACE0\uC9C0\uD569\uB2C8\uB2E4."],
        ["\uC81C4\uC870 (\uD68C\uC6D0\uC758 \uC758\uBB34)", "\uD68C\uC6D0\uC740 \uD0C0\uC778\uC758 \uC815\uBCF4\uB97C \uB3C4\uC6A9\uD558\uAC70\uB098, \uC11C\uBE44\uC2A4\uB97C \uBD80\uC815\uD55C \uBAA9\uC801\uC73C\uB85C \uC774\uC6A9\uD574\uC11C\uB294 \uC548 \uB429\uB2C8\uB2E4. \uB9CC 14\uC138 \uBBF8\uB9CC \uC544\uB3D9\uC740 \uBC95\uC815\uB300\uB9AC\uC778\uC758 \uB3D9\uC758\uB97C \uBC1B\uC544\uC57C \uD569\uB2C8\uB2E4."],
        ["\uC81C5\uC870 (AI \uACB0\uACFC\uC758 \uD55C\uACC4)", "AI\uAC00 \uC81C\uACF5\uD558\uB294 \uC9C4\uB85C \uD0D0\uC0C9 \uACB0\uACFC\uB294 \uCC38\uACE0 \uC790\uB8CC\uC774\uBA70, \uC808\uB300\uC801 \uC9C4\uB2E8\uC774\uB098 \uD655\uC815\uC801 \uC608\uCE21\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uCD5C\uC885 \uC9C4\uB85C \uC120\uD0DD\uC740 \uD559\uC0DD\xB7\uBCF4\uD638\uC790\xB7\uAD50\uC0AC \uC0C1\uB2F4\uACFC \uD568\uAED8 \uACB0\uC815\uD558\uB294 \uAC83\uC744 \uAD8C\uC7A5\uD569\uB2C8\uB2E4."]
      ]
    },
    privacy: {
      title: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68",
      updated: "2026. 05. 01 \uC2DC\uD589",
      sections: [
        ["1. \uC218\uC9D1\uD558\uB294 \uD56D\uBAA9", "\uD544\uC218: \uC774\uBA54\uC77C, \uC774\uB984, \uBE44\uBC00\uBC88\uD638(\uC554\uD638\uD654 \uC800\uC7A5), \uD559\uAD50/\uD559\uAE09 \uC815\uBCF4. \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uC911 \uC0DD\uC131: \uC131\uC801 \uAE30\uB85D, AI \uC0C1\uB2F4 \uB300\uD654, \uD559\uC2B5 \uC9C4\uB3C4. \uD68C\uC0AC\uB294 \uC8FC\uBBFC\uB4F1\uB85D\uBC88\uD638 \uB4F1 \uACE0\uC720\uC2DD\uBCC4\uC815\uBCF4\uB97C \uC218\uC9D1\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."],
        ["2. \uC774\uC6A9 \uBAA9\uC801", "\uC9C4\uB85C \uC0C1\uB2F4 \uC81C\uACF5, \uC131\uC801\xB7\uD559\uC2B5 \uBD84\uC11D, \uAD50\uC0AC-\uD559\uC0DD \uC5F0\uACB0, \uAD6C\uB3C5\xB7\uACB0\uC81C \uCC98\uB9AC, \uC11C\uBE44\uC2A4 \uAC1C\uC120\uC744 \uC704\uD574\uC11C\uB9CC \uC0AC\uC6A9\uD569\uB2C8\uB2E4."],
        ["3. \uBCF4\uC720 \uBC0F \uD30C\uAE30", "\uD68C\uC6D0 \uD0C8\uD1F4 \uC2DC \uC9C0\uCCB4 \uC5C6\uC774 \uD30C\uAE30\uD569\uB2C8\uB2E4. \uB2E8, \uAD00\uACC4 \uBC95\uB839\uC5D0 \uB530\uB77C \uBCF4\uC874\uC774 \uD544\uC694\uD55C \uACB0\uC81C \uAE30\uB85D\uC740 5\uB144\uAC04 \uBCF4\uAD00\uD569\uB2C8\uB2E4."],
        ["4. \uC81C3\uC790 \uC81C\uACF5", "\uD68C\uC0AC\uB294 \uC774\uC6A9\uC790\uC758 \uB3D9\uC758 \uC5C6\uC774 \uAC1C\uC778\uC815\uBCF4\uB97C \uC81C3\uC790\uC5D0\uAC8C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uACB0\uC81C \uCC98\uB9AC\uB97C \uC704\uD574 \uACB0\uC81C\uB300\uD589\uC0AC(\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20/\uD3EC\uD2B8\uC6D0)\uC5D0 \uCD5C\uC18C\uD55C\uC758 \uC815\uBCF4\uB9CC \uC804\uB2EC\uD569\uB2C8\uB2E4."],
        ["5. \uC0C1\uB2F4 \uAE30\uB85D \uC5F4\uB78C", "\uAD50\uC0AC\uB294 \uB2F4\uB2F9 \uD559\uC0DD\uC758 AI \uB9AC\uD3EC\uD2B8\uB97C \uD559\uC0DD \uB3D9\uC758 \uBC94\uC704 \uB0B4\uC5D0\uC11C\uB9CC \uC5F4\uB78C\uD560 \uC218 \uC788\uC73C\uBA70, \uBAA8\uB4E0 \uC5F4\uB78C\uC740 \uAE30\uB85D\uB429\uB2C8\uB2E4."],
        ["6. \uC774\uC6A9\uC790\uC758 \uAD8C\uB9AC", "\uC774\uC6A9\uC790\uB294 \uC5B8\uC81C\uB4E0 \uBCF8\uC778\uC758 \uAC1C\uC778\uC815\uBCF4 \uC5F4\uB78C\xB7\uC815\uC815\xB7\uC0AD\uC81C\uB97C \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uBB38\uC758: privacy@jinronavi.kr"]
      ]
    }
  };
  const d = docs[tab];
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC57D\uAD00 \uBC0F \uC815\uCC45", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: back }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", maxWidth: 640, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "terms", label: "\uC774\uC6A9\uC57D\uAD00" }, { id: "privacy", label: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" }], activeId: tab, onChange: setTab })), /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 700, color: "var(--fg-strong)" } }, d.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", marginTop: 4, marginBottom: 20 } }, d.updated), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } }, d.sections.map(([h, body], i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, h), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.7 }, className: "kr-heading" }, body))))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", textAlign: "center", marginTop: 16, lineHeight: 1.5 }, className: "kr-heading" }, "(\uC8FC) \uC9C4\uB85C\uB098\uCE68\uBC18 \xB7 \uACE0\uAC1D\uC13C\uD130 1599-0000 \xB7 help@jinronavi.kr")));
}
function SettingsSuggestion({ back }) {
  const [category, setCategory] = React.useState("\uAE30\uD0C0");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const submit = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      await window.__apiFetch("/suggestions", { method: "POST", body: JSON.stringify({ category, body: body.trim() }) });
      showToast("\uC18C\uC911\uD55C \uC758\uACAC \uAC10\uC0AC\uD574\uC694! \uC798 \uC804\uB2EC\uD588\uC5B4\uC694", "success");
      back();
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uC804\uC1A1\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uAC74\uC758\uD558\uAE30", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: back }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", maxWidth: 520, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(SectionCard, { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uBD84\uB958", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "\uAE30\uB2A5", label: "\uAE30\uB2A5 \uC81C\uC548" }, { id: "\uBC84\uADF8", label: "\uBC84\uADF8 \uC2E0\uACE0" }, { id: "\uAE30\uD0C0", label: "\uAE30\uD0C0" }], activeId: category, onChange: setCategory })), /* @__PURE__ */ React.createElement(FormField, { label: "\uB0B4\uC6A9", required: true }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 6, placeholder: "\uAC1C\uC120\uD588\uC73C\uBA74 \uD558\uB294 \uC810, \uBD88\uD3B8\uD55C \uC810, \uC0C8 \uAE30\uB2A5 \uC81C\uC548 \uB4F1\uC744 \uC790\uC720\uB86D\uAC8C \uC801\uC5B4\uC8FC\uC138\uC694." }))), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, disabled: !body.trim() || busy, onClick: submit }, busy ? "\uBCF4\uB0B4\uB294 \uC911\u2026" : "\uC758\uACAC \uBCF4\uB0B4\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }, className: "kr-heading" }, "\uBCF4\uB0B4\uC8FC\uC2E0 \uC758\uACAC\uC740 \uC6B4\uC601\uD300\uC774 \uD655\uC778\uD574\uC694. \uB2F5\uBCC0\uC774 \uD544\uC694\uD558\uBA74 \uBA54\uC2DC\uC9C0\uB85C \uC5F0\uB77D\uB4DC\uB9B4 \uC218 \uC788\uC5B4\uC694.")));
}
function SettingsAnnouncements({ back }) {
  const [rows, setRows] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/announcements?limit=50", { method: "GET" });
        if (alive) setRows(r && r.data || []);
      } catch (e) {
        if (alive) setRows([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const loading = rows === null;
  const list = rows || [];
  const fmt = (d) => {
    try {
      const t = new Date(d);
      return isNaN(t) ? "" : t.toISOString().slice(0, 10);
    } catch (e) {
      return "";
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uACF5\uC9C0\uC0AC\uD56D", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: back }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px", maxWidth: 560, margin: "0 auto" } }, loading ? /* @__PURE__ */ React.createElement(SectionCard, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", padding: 8 } }, "\uBD88\uB7EC\uC624\uB294 \uC911\u2026")) : list.length === 0 ? /* @__PURE__ */ React.createElement(SectionCard, null, /* @__PURE__ */ React.createElement("div", { style: { padding: 16, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" }, className: "kr-heading" }, "\uB4F1\uB85D\uB41C \uACF5\uC9C0\uAC00 \uC5C6\uC5B4\uC694.")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, list.map((a) => /* @__PURE__ */ React.createElement(SectionCard, { key: a.id, style: { marginBottom: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } }, a.pinned && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uACE0\uC815"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, a.title)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-default)", whiteSpace: "pre-line", lineHeight: 1.6 }, className: "kr-heading" }, a.body), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8 } }, a.author || "\uC6B4\uC601\uD300", " \xB7 ", fmt(a.createdAt)))))));
}
Object.assign(window, { SettingsPassword, SettingsNotifications, SettingsTerms, SettingsSuggestion, SettingsAnnouncements, Toggle });
