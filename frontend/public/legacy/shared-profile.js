function DeleteAccountDialog({ open, onClose, onConfirm, role = "student" }) {
  const [step, setStep] = React.useState("confirm");
  const [reason, setReason] = React.useState("");
  const trapRef = useFocusTrap(open, onClose);
  const [typed, setTyped] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  React.useEffect(() => {
    if (open) {
      setStep("confirm");
      setReason("");
      setTyped("");
      setPwd("");
      setErr("");
      setBusy(false);
    }
  }, [open]);
  if (!open) return null;
  const requiredText = "\uD68C\uC6D0 \uD0C8\uD1F4";
  const canDelete = typed.trim() === requiredText && pwd.length > 0 && !busy;
  const doDelete = async () => {
    setErr("");
    setBusy(true);
    try {
      await window.__apiFetch("/auth/me", { method: "DELETE", body: JSON.stringify({ currentPassword: pwd }) });
      setStep("done");
    } catch (e) {
      setErr(e && e.body && (e.body.message || e.body.error && e.body.error.message) || "\uD0C8\uD1F4\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    } finally {
      setBusy(false);
    }
  };
  const REASONS = role === "teacher" ? ["\uB354 \uC774\uC0C1 \uD559\uAE09\uC744 \uC6B4\uC601\uD558\uC9C0 \uC54A\uC544\uC694", "\uAE30\uB2A5\uC774 \uBD80\uC871\uD574\uC694", "\uAC00\uACA9\uC774 \uBD80\uB2F4\uB3FC\uC694", "\uB2E4\uB978 \uC11C\uBE44\uC2A4\uB85C \uC62E\uACA8\uC694", "\uAE30\uD0C0"] : ["\uBAA9\uD45C\uB97C \uC774\uBBF8 \uC815\uD588\uC5B4\uC694", "AI \uC0C1\uB2F4\uC774 \uB3C4\uC6C0\uC774 \uC548 \uB3FC\uC694", "\uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694", "\uAC00\uACA9\uC774 \uBD80\uB2F4\uB3FC\uC694", "\uAE30\uD0C0"];
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.55)", animation: "fadeIn 240ms" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "alertdialog", "aria-modal": "true", "aria-label": "\uD68C\uC6D0 \uD0C8\uD1F4", style: {
    position: "relative",
    width: "min(440px, 100%)",
    maxHeight: "92%",
    overflow: "auto",
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 28,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 320ms var(--ease-toss)"
  }, className: "toss-scroll" }, step === "confirm" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 16, background: "var(--danger-bg)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(IcAlert, { size: 28 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)", marginBottom: 8 }, className: "kr-heading" }, "\uC815\uB9D0 \uD0C8\uD1F4\uD558\uC2DC\uACA0\uC5B4\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 16 }, className: "kr-heading" }, "\uD68C\uC6D0 \uD0C8\uD1F4 \uC2DC \uB2E4\uC74C \uB370\uC774\uD130\uAC00 \uC601\uAD6C\uD788 \uC0AD\uC81C\uB3FC\uC694:"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 } }, (role === "teacher" ? [
    "\uAD00\uB9AC \uC911\uC778 \uD559\uAE09 \uBC0F \uCD08\uB300\uCF54\uB4DC",
    "\uD559\uC0DD \uC0C1\uB2F4 \uBA54\uBAA8 (\uD559\uC0DD\uC5D0\uAC8C\uB294 \uBCF4\uC874)",
    "\uACB0\uC81C \uC815\uBCF4 \uBC0F \uAD6C\uB3C5 \uC774\uB825",
    "\uACC4\uC815 \uC815\uBCF4 \uBC0F \uB85C\uADF8\uC778 \uAE30\uB85D"
  ] : [
    "AI \uC9C4\uB85C \uC0C1\uB2F4 \uB300\uD654 \uAE30\uB85D",
    "\uC785\uB825\uD55C \uC131\uC801 \uB370\uC774\uD130",
    "\uC9C4\uB85C \uBAA9\uD45C \uBC0F \uD559\uC2B5 \uACC4\uD68D",
    "\uACB0\uC81C \uC815\uBCF4 \uBC0F \uAD6C\uB3C5 \uC774\uB825"
  ]).map((it) => /* @__PURE__ */ React.createElement("li", { key: it, style: { display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--fg-default)" }, className: "kr-heading" }, /* @__PURE__ */ React.createElement(IcX, { size: 14, color: "var(--danger)", style: { flexShrink: 0 } }), it))), /* @__PURE__ */ React.createElement("div", { style: {
    padding: 14,
    background: "var(--warning-bg)",
    borderRadius: 10,
    fontSize: 12,
    color: "var(--warning)",
    lineHeight: 1.55,
    marginBottom: 18,
    display: "flex",
    gap: 8,
    alignItems: "flex-start"
  } }, /* @__PURE__ */ React.createElement(IcInfo, { size: 14, style: { marginTop: 1, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { className: "kr-heading" }, role === "teacher" ? '\uD559\uAE09\uC5D0 \uC18D\uD55C \uD559\uC0DD\uC740 \uB2E4\uB978 \uAD50\uC0AC\uAC00 \uAC00\uC785\uD558\uAE30 \uC804\uAE4C\uC9C0 "\uAD50\uC0AC \uC5C6\uC74C" \uC0C1\uD0DC\uB85C \uC804\uD658\uB3FC\uC694.' : "\uD559\uC0DD \uB370\uC774\uD130\uB97C 30\uC77C\uAC04 \uBCF5\uAD6C\uD560 \uC218 \uC788\uC5B4\uC694. 30\uC77C \uD6C4 \uC601\uAD6C \uC0AD\uC81C\uB3FC\uC694.")), /* @__PURE__ */ React.createElement(FormField, { label: "\uD0C8\uD1F4 \uC0AC\uC720 (\uC120\uD0DD)", hint: "\uC11C\uBE44\uC2A4 \uAC1C\uC120\uC5D0 \uD070 \uB3C4\uC6C0\uC774 \uB3FC\uC694", style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, REASONS.map((r) => /* @__PURE__ */ React.createElement("label", { key: r, style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: "1px solid",
    borderColor: reason === r ? "var(--brand-500)" : "var(--line)",
    background: reason === r ? "var(--brand-50)" : "var(--bg-surface)",
    borderRadius: 10,
    cursor: "pointer"
  } }, /* @__PURE__ */ React.createElement("input", { type: "radio", checked: reason === r, onChange: () => setReason(r), style: { accentColor: "var(--brand-500)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: reason === r ? "var(--brand-600)" : "var(--fg-default)", fontWeight: reason === r ? 600 : 500 } }, r))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "danger", full: true, onClick: () => setStep("typed") }, "\uACC4\uC18D"))), step === "typed" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)", marginBottom: 8 }, className: "kr-heading" }, "\uB9C8\uC9C0\uB9C9 \uD655\uC778\uC774\uC5D0\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, marginBottom: 16 }, className: "kr-heading" }, "\uC544\uB798\uC5D0 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--danger)" } }, '"', requiredText, '"'), "\uC744(\uB97C) \uC815\uD655\uD788 \uC785\uB825\uD558\uACE0, \uBCF8\uC778 \uD655\uC778\uC744 \uC704\uD574 \uBE44\uBC00\uBC88\uD638\uB97C \uD55C \uBC88 \uB354 \uC785\uB825\uD574\uC8FC\uC138\uC694."), /* @__PURE__ */ React.createElement(FormField, { label: "\uD655\uC778 \uBB38\uAD6C", required: true, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: typed, onChange: setTyped, placeholder: requiredText, autoFocus: true })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uD655\uC778", required: true, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(TextInput, { value: pwd, onChange: setPwd, type: "password", placeholder: "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638" })), err && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "var(--danger)", fontSize: 13 } }, err), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: () => setStep("confirm"), disabled: busy }, "\uC774\uC804"), /* @__PURE__ */ React.createElement(Button, { variant: "danger", full: true, disabled: !canDelete, onClick: doDelete }, busy ? "\uCC98\uB9AC \uC911\u2026" : "\uD0C8\uD1F4\uD558\uAE30"))), step === "done" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 18, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 32 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "var(--fg-strong)", textAlign: "center", marginBottom: 8 }, className: "kr-heading" }, "\uD0C8\uD1F4 \uCC98\uB9AC\uAC00 \uC644\uB8CC\uB410\uC5B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55, textAlign: "center", marginBottom: 20 }, className: "kr-heading" }, "\uADF8\uB3D9\uC548 \uC9C4\uB85C\uB098\uCE68\uBC18\uC744 \uC774\uC6A9\uD574\uC8FC\uC154\uC11C \uAC10\uC0AC\uD588\uC5B4\uC694.", role !== "teacher" && "\n\uB3D9\uC77C \uC774\uBA54\uC77C\uB85C \uB2E4\uC2DC \uAC00\uC785\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "lg", full: true, onClick: () => {
    onConfirm && onConfirm();
    onClose();
    try {
      window.dispatchEvent(new Event("jinro:logout"));
    } catch (e) {
    }
  } }, "\uCC98\uC74C\uC73C\uB85C"))));
}
function TeacherProfile({ go, openNotif }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  const [roster, setRoster] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
      }
      try {
        const r = await window.__apiFetch("/teacher/students", { method: "GET" });
        setRoster(r.data || []);
      } catch (e) {
        setRoster([]);
      }
    })();
  }, []);
  const list = roster || [];
  const active = list.filter((s) => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const need = list.filter((s) => s.needsCounseling).length;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement(TeacherTopbar, { title: "\uB0B4\uC815\uBCF4", subtitle: "\uD504\uB85C\uD544, \uB3D9\uC758 \uD56D\uBAA9, \uBCF4\uC548 \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694", openNotif }), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 28, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 24, style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (me && me.name || "\uAD50")[0], size: 72 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "var(--fg-strong)" } }, me && me.name || "\uC120\uC0DD\uB2D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 8 } }, me && [me.school, me.classroom].filter(Boolean).join(" \xB7 ") || "\uD559\uAE09 \uC815\uBCF4 \uC5C6\uC74C"), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }) }, "\uAD50\uC0AC \uD50C\uB79C \xB7 \uBB34\uB8CC"))), /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 12, fontWeight: 600 } }, "\uD559\uAE09 \uC694\uC57D"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 } }, /* @__PURE__ */ React.createElement(Stat, { label: "\uD559\uC0DD", value: roster === null ? "\u2026" : String(list.length) }), /* @__PURE__ */ React.createElement(Stat, { label: "\uD65C\uB3D9 \uC911", value: roster === null ? "\u2026" : active + "\uBA85" }), /* @__PURE__ */ React.createElement(Stat, { label: "\uC0C1\uB2F4 \uD544\uC694", value: roster === null ? "\u2026" : need + "\uBA85" })))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uACC4\uC815 \uAD00\uB9AC", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { boxShadow: "none", border: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-mint-bg)", color: "var(--accent-mint)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcFlag, { size: 16 })),
      title: "\uACF5\uC9C0\uC0AC\uD56D",
      subtitle: "\uC5C5\uB370\uC774\uD2B8 \uC18C\uC2DD \xB7 \uAC74\uC758\xB7\uBC84\uADF8 \uC81C\uBCF4",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("announcements")
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16 })),
      title: "\uB3D9\uC758 \uD56D\uBAA9 \uAD00\uB9AC",
      subtitle: "\uAC1C\uC778\uC815\uBCF4\xB7\uACB0\uC81C \uB4F1 \uB3D9\uC758 \uB0B4\uC5ED \uAD00\uB9AC",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("consents")
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 })),
      title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C",
      subtitle: "\uBB34\uB8CC \uCCB4\uD5D8 18\uC77C \uB0A8\uC74C",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("billing")
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcLock, { size: 16 })),
      title: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD",
      subtitle: "2026-04-12 \uB9C8\uC9C0\uB9C9 \uBCC0\uACBD",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("settings-password")
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })),
      title: "\uC54C\uB9BC \uC124\uC815",
      subtitle: "SSE \xB7 \uC774\uBA54\uC77C \xB7 \uD478\uC2DC \uCC44\uB110",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("settings-notifications")
    }
  ), /* @__PURE__ */ React.createElement(
    ListRow,
    {
      leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 16 })),
      title: "\uC774\uC6A9\uC57D\uAD00 \xB7 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68",
      trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }),
      onClick: () => go("settings-terms"),
      divider: false
    }
  ))), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC704\uD5D8 \uC791\uC5C5", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "var(--danger-bg)", boxShadow: "none", border: "1px solid #F5C2C7" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--danger)", marginBottom: 4 } }, "\uD68C\uC6D0 \uD0C8\uD1F4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)", opacity: 0.85, lineHeight: 1.55 }, className: "kr-heading" }, "\uD559\uAE09, \uD559\uC0DD \uBA54\uBAA8, \uACB0\uC81C \uB0B4\uC5ED\uC774 \uC601\uAD6C \uC0AD\uC81C\uB3FC\uC694. \uC2E0\uC911\uD788 \uACB0\uC815\uD574\uC8FC\uC138\uC694.")), /* @__PURE__ */ React.createElement(Button, { variant: "danger", size: "md", onClick: () => setDeleteOpen(true), leading: /* @__PURE__ */ React.createElement(IcLogout, { size: 14 }) }, "\uD0C8\uD1F4 \uC9C4\uD589")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { style: { padding: "14px 28px", border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 14, cursor: "pointer" } }, "\uB85C\uADF8\uC544\uC6C3"))), /* @__PURE__ */ React.createElement(DeleteAccountDialog, { open: deleteOpen, onClose: () => setDeleteOpen(false), role: "teacher" }));
}
function TeacherProfileMobile({ go }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
    })();
  }, []);
  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(" ") || "\uD559\uAE09 \uC815\uBCF4 \uC5C6\uC74C";
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uB354\uBCF4\uAE30" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, hoverable: true, onClick: () => go("teacher-info"), style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (u.name || "\uAD50")[0], size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, me === null ? "\u2026" : (u.name || "\uC774\uB984 \uBBF8\uC124\uC815") + " \uC120\uC0DD\uB2D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, classLine), /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm", style: { marginTop: 6 } }, "\uAD50\uC0AC \uD50C\uB79C \xB7 \uBB34\uB8CC \uCCB4\uD5D8")), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "var(--fg-subtle)" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uD559\uAE09"), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--neutral-bg)", color: "var(--neutral-fg)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 16 })), title: "\uB0B4 \uC815\uBCF4", subtitle: "\uC774\uB984 \xB7 \uC774\uBA54\uC77C \xB7 \uB2F4\uB2F9 \uD559\uAE09", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("teacher-info") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcSchool, { size: 16 })), title: "\uD559\uAE09 \uAD00\uB9AC", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("classroom") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUsers, { size: 16 })), title: "\uD559\uC0DD \uAD00\uB9AC", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("students"), divider: false })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uACC4\uC815 \uAD00\uB9AC"), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-mint-bg)", color: "var(--accent-mint)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcFlag, { size: 16 })), title: "\uACF5\uC9C0\uC0AC\uD56D", subtitle: "\uC5C5\uB370\uC774\uD2B8 \uC18C\uC2DD \xB7 \uAC74\uC758\xB7\uBC84\uADF8 \uC81C\uBCF4", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("announcements") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16 })), title: "\uB3D9\uC758 \uD56D\uBAA9 \uAD00\uB9AC", subtitle: "\uAC1C\uC778\uC815\uBCF4 \xB7 \uACB0\uC81C \uB3D9\uC758 \uB0B4\uC5ED", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("consents") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 })), title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", subtitle: "\uBB34\uB8CC \uCCB4\uD5D8 \uC911 (\uACB0\uC81C \uBBF8\uC5F0\uB3D9)", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("billing") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcLock, { size: 16 })), title: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-password") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })), title: "\uC54C\uB9BC \uC124\uC815", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-notifications") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })), title: "\uACF5\uC9C0\uC0AC\uD56D", subtitle: "\uC6B4\uC601\uD300 \uACF5\uC9C0\uB97C \uD655\uC778\uD574\uC694", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-announcements") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 16 })), title: "\uAC74\uC758\uD558\uAE30", subtitle: "\uAC1C\uC120 \uC758\uACAC\xB7\uBC84\uADF8\uB97C \uC6B4\uC601\uD300\uC5D0 \uBCF4\uB0B4\uC694", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-suggest") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 16 })), title: "\uC774\uC6A9\uC57D\uAD00 \xB7 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-terms"), divider: false })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uC704\uD5D8 \uC791\uC5C5"), /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { marginBottom: 16, background: "var(--danger-bg)", boxShadow: "none", border: "1px solid #F5C2C7" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 4 } }, "\uD68C\uC6D0 \uD0C8\uD1F4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)", opacity: 0.85, lineHeight: 1.55, marginBottom: 12 }, className: "kr-heading" }, "\uD559\uAE09, \uD559\uC0DD \uBA54\uBAA8, \uACB0\uC81C \uB0B4\uC5ED\uC774 \uC601\uAD6C \uC0AD\uC81C\uB3FC\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "danger", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcLogout, { size: 14 }), onClick: () => setDeleteOpen(true) }, "\uD0C8\uD1F4 \uC9C4\uD589")), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: 14, border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 14, cursor: "pointer" } }, "\uB85C\uADF8\uC544\uC6C3")), /* @__PURE__ */ React.createElement(DeleteAccountDialog, { open: deleteOpen, onClose: () => setDeleteOpen(false), role: "teacher" }));
}
function StudentProfileV2({ go }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
    })();
  }, []);
  const u = me || {};
  const schoolLine = [u.school, u.classroom].filter(Boolean).join(" \xB7 ") || (typeof gradeLabel === "function" ? gradeLabel(u.grade) : u.grade || "");
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uB354\uBCF4\uAE30" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, hoverable: true, onClick: () => go("student-info"), style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (u.name || "\uD559")[0], size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, me === null ? "\u2026" : u.name || "\uC774\uB984 \uBBF8\uC124\uC815"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, schoolLine || "\uD559\uAD50 \uC815\uBCF4 \uBBF8\uC124\uC815"), u.classroom ? /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { marginTop: 6 } }, u.classroom) : null), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 20, color: "var(--fg-subtle)" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uC9C4\uB85C \xB7 \uD559\uC2B5"), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--neutral-bg)", color: "var(--neutral-fg)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcUser, { size: 16 })), title: "\uB0B4 \uC815\uBCF4", subtitle: "\uC774\uB984 \xB7 \uC774\uBA54\uC77C \xB7 \uD559\uAD50 \uC815\uBCF4", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("student-info") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcTarget, { size: 16 })), title: "\uC9C4\uB85C \uBAA9\uD45C \uAD00\uB9AC", subtitle: "3\uAC1C \uBAA9\uD45C \xB7 \uBBF8\uB514\uC5B4 \uCF58\uD150\uCE20 \uB514\uC790\uC774\uB108", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("career-targets") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--info-bg)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcSchool, { size: 16 })), title: "\uD559\uAE09 \uC815\uBCF4", subtitle: u.classroom || "\uBBF8\uBC30\uC815", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("class-info"), divider: false })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uACC4\uC815 \uAD00\uB9AC"), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-mint-bg)", color: "var(--accent-mint)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcFlag, { size: 16 })), title: "\uACF5\uC9C0\uC0AC\uD56D", subtitle: "\uC5C5\uB370\uC774\uD2B8 \uC18C\uC2DD \xB7 \uAC74\uC758\xB7\uBC84\uADF8 \uC81C\uBCF4", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("announcements") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcShield, { size: 16 })), title: "\uB3D9\uC758 \uD56D\uBAA9 \uAD00\uB9AC", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("consents") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcCreditCard, { size: 16 })), title: "\uAD6C\uB3C5 \uBC0F \uACB0\uC81C", subtitle: "\uBB34\uB8CC \uCCB4\uD5D8 \uC911 (\uACB0\uC81C \uBBF8\uC5F0\uB3D9)", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("billing") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcLock, { size: 16 })), title: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-password") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--warning-bg)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })), title: "\uC54C\uB9BC \uC124\uC815", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-notifications") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcBell, { size: 16 })), title: "\uACF5\uC9C0\uC0AC\uD56D", subtitle: "\uC6B4\uC601\uD300 \uACF5\uC9C0\uB97C \uD655\uC778\uD574\uC694", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-announcements") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--bg-muted)", color: "var(--fg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcMessage, { size: 16 })), title: "\uAC74\uC758\uD558\uAE30", subtitle: "\uAC1C\uC120 \uC758\uACAC\xB7\uBC84\uADF8\uB97C \uC6B4\uC601\uD300\uC5D0 \uBCF4\uB0B4\uC694", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-suggest") }), /* @__PURE__ */ React.createElement(ListRow, { leading: /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 8, background: "var(--accent-purple-bg)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcDoc, { size: 16 })), title: "\uC774\uC6A9\uC57D\uAD00 \xB7 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68", trailing: /* @__PURE__ */ React.createElement(IcChevronRight, { size: 18, color: "var(--fg-subtle)" }), onClick: () => go("settings-terms"), divider: false })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", letterSpacing: 0.5, margin: "14px 4px 8px" } }, "\uC704\uD5D8 \uC791\uC5C5"), /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { marginBottom: 16, background: "var(--danger-bg)", boxShadow: "none", border: "1px solid #F5C2C7" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 4 } }, "\uD68C\uC6D0 \uD0C8\uD1F4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)", opacity: 0.85, lineHeight: 1.55, marginBottom: 12 }, className: "kr-heading" }, "AI \uC0C1\uB2F4\xB7\uC131\uC801\xB7\uC9C4\uB85C \uB370\uC774\uD130\uAC00 \uC601\uAD6C \uC0AD\uC81C\uB3FC\uC694. 30\uC77C \uC774\uB0B4\uB77C\uBA74 \uBCF5\uAD6C\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "danger", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcLogout, { size: 14 }), onClick: () => setDeleteOpen(true) }, "\uD0C8\uD1F4 \uC9C4\uD589")), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: 14, border: "none", background: "transparent", color: "var(--fg-muted)", fontSize: 14, cursor: "pointer" } }, "\uB85C\uADF8\uC544\uC6C3")), /* @__PURE__ */ React.createElement(DeleteAccountDialog, { open: deleteOpen, onClose: () => setDeleteOpen(false), role: "student" }));
}
Object.assign(window, { DeleteAccountDialog, TeacherProfile, TeacherProfileMobile, StudentProfileV2, StudentInfoScreen, ClassInfoScreen, TeacherInfoScreen });
function EditableInfoRow({ label, value, editing, onChange, last, type = "text" }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: last ? "none" : "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)", flexShrink: 0 } }, label), editing ? /* @__PURE__ */ React.createElement("input", { value, onChange: (e) => onChange(e.target.value), type, style: {
    flex: 1,
    textAlign: "right",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--fg-strong)",
    minWidth: 0,
    borderBottom: "1.5px solid var(--brand-500)",
    paddingBottom: 2
  } }) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "var(--fg-strong)", textAlign: "right" }, className: "kr-heading" }, value));
}
const STUDENT_GRADE_LABELS = { E4: "\uCD084", E5: "\uCD085", E6: "\uCD086", M1: "\uC9111", M2: "\uC9112", M3: "\uC9113", H1: "\uACE01", H2: "\uACE02", H3: "\uACE03" };
const STUDENT_GRADE_OPTIONS = Object.keys(STUDENT_GRADE_LABELS);
function gradeLabel(code) {
  return STUDENT_GRADE_LABELS[code] || (code ? String(code) : "\uBBF8\uC124\uC815");
}
function StudentInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/auth/me", { method: "GET" });
      const u2 = r.data || r;
      setMe(u2);
      setName(u2.name || "");
      setGrade(u2.grade || "");
    } catch (e) {
      setMe({});
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const startEdit = () => {
    if (me) {
      setName(me.name || "");
      setGrade(me.grade || "");
    }
    setEditing(true);
  };
  const save = async () => {
    if (!name.trim()) {
      showToast("\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694", "error");
      return;
    }
    setSaving(true);
    try {
      const body = { name: name.trim() };
      if (grade) body.grade = grade;
      await window.__apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify(body) });
      await load();
      setEditing(false);
      showToast("\uB0B4 \uC815\uBCF4\uB97C \uC800\uC7A5\uD588\uC5B4\uC694", "success");
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694", "error");
    } finally {
      setSaving(false);
    }
  };
  const u = me || {};
  const schoolLine = [u.school, u.classroom].filter(Boolean).join(" \xB7 ") || gradeLabel(u.grade);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      title: "\uB0B4 \uC815\uBCF4",
      leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }),
      trailing: editing ? /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: save, disabled: saving }, saving ? "\uC800\uC7A5 \uC911\u2026" : "\uC800\uC7A5") : /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSettings, { size: 13 }), onClick: startEdit }, "\uC218\uC815")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (u.name || "\uD559")[0], size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, me === null ? "\u2026" : u.name || "\uC774\uB984 \uBBF8\uC124\uC815"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, schoolLine))), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uC774\uB984", value: name, editing, onChange: setName }), editing ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)", flexShrink: 0 } }, "\uD559\uB144"), /* @__PURE__ */ React.createElement("select", { value: grade, onChange: (e) => setGrade(e.target.value), style: { border: "1.5px solid var(--brand-500)", borderRadius: 8, padding: "6px 10px", fontSize: 14, fontWeight: 600, color: "var(--fg-strong)", background: "#fff" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\uBBF8\uC124\uC815"), STUDENT_GRADE_OPTIONS.map((g) => /* @__PURE__ */ React.createElement("option", { key: g, value: g }, STUDENT_GRADE_LABELS[g])))) : /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uD559\uB144", value: gradeLabel(u.grade), editing: false, onChange: () => {
  } }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uC774\uBA54\uC77C", value: u.email || "-", editing: false, onChange: () => {
  } }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uD559\uAD50", value: u.school || "\uBBF8\uC124\uC815", editing: false, onChange: () => {
  } }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uBC18", value: u.classroom || "\uBBF8\uBC30\uC815", editing: false, onChange: () => {
  }, last: true })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", textAlign: "center", lineHeight: 1.5 }, className: "kr-heading" }, editing ? "\uC774\uB984\uACFC \uD559\uB144\uC744 \uBCC0\uACBD\uD560 \uC218 \uC788\uC5B4\uC694. \uD559\uAD50\xB7\uBC18\uC740 \uB2F4\uB2F9 \uC120\uC0DD\uB2D8 \uD559\uAE09\uC5D0 \uAC00\uC785\uD558\uBA74 \uC790\uB3D9 \uBC18\uC601\uB3FC\uC694." : "\uC774\uBA54\uC77C\uC740 \uB85C\uADF8\uC778 \uACC4\uC815\uC774\uB77C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC5B4\uC694.")));
}
function TeacherInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/auth/me", { method: "GET" });
      const u2 = r.data || r;
      setMe(u2);
      setName(u2.name || "");
    } catch (e) {
      setMe({});
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  const startEdit = () => {
    if (me) setName(me.name || "");
    setEditing(true);
  };
  const save = async () => {
    if (!name.trim()) {
      showToast("\uC774\uB984\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694", "error");
      return;
    }
    setSaving(true);
    try {
      await window.__apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify({ name: name.trim() }) });
      await load();
      setEditing(false);
      showToast("\uB0B4 \uC815\uBCF4\uB97C \uC800\uC7A5\uD588\uC5B4\uC694", "success");
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694", "error");
    } finally {
      setSaving(false);
    }
  };
  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(" ") || "\uD559\uAE09 \uC815\uBCF4 \uC5C6\uC74C";
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      title: "\uB0B4 \uC815\uBCF4",
      leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }),
      trailing: editing ? /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", onClick: save, disabled: saving }, saving ? "\uC800\uC7A5 \uC911\u2026" : "\uC800\uC7A5") : /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSettings, { size: 13 }), onClick: startEdit }, "\uC218\uC815")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (u.name || "\uAD50")[0], size: 56 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, me === null ? "\u2026" : (u.name || "\uC774\uB984 \uBBF8\uC124\uC815") + " \uC120\uC0DD\uB2D8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, classLine))), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uC774\uB984", value: name, editing, onChange: setName }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uC774\uBA54\uC77C", value: u.email || "-", editing: false, onChange: () => {
  } }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uD559\uAD50", value: u.school || "\uBBF8\uC124\uC815", editing: false, onChange: () => {
  } }), /* @__PURE__ */ React.createElement(EditableInfoRow, { label: "\uB2F4\uB2F9 \uD559\uAE09", value: u.classroom || "\uBBF8\uBC30\uC815", editing: false, onChange: () => {
  }, last: true })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", textAlign: "center", lineHeight: 1.5 }, className: "kr-heading" }, editing ? "\uC774\uB984\uC744 \uBCC0\uACBD\uD560 \uC218 \uC788\uC5B4\uC694." : "\uC774\uBA54\uC77C\uC740 \uB85C\uADF8\uC778 \uACC4\uC815\uC774\uB77C \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC5B4\uC694.")));
}
function ClassInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch("/auth/me", { method: "GET" });
        setMe(r.data || r);
      } catch (e) {
        setMe({});
      }
    })();
  }, []);
  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(" ") || "\uD559\uAE09 \uC815\uBCF4 \uC5C6\uC74C";
  const enrolled = !!(u.school || u.classroom);
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uD559\uAE09 \uC815\uBCF4", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("profile") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { marginBottom: 12, background: "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (classLine || "\uD559")[0], size: 52 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: "var(--fg-strong)" } }, me === null ? "\u2026" : classLine), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, enrolled ? "\uAC00\uC785\uB41C \uD559\uAE09" : "\uC544\uC9C1 \uD559\uAE09\uC5D0 \uAC00\uC785\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694")), enrolled ? /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 11 }) }, "\uCC38\uC5EC \uC911") : null)), /* @__PURE__ */ React.createElement(Card, { padding: 0, style: { marginBottom: 12 } }, [
    ["\uD559\uAD50", u.school || "\uBBF8\uC124\uC815"],
    ["\uD559\uAE09", u.classroom || "\uBBF8\uBC30\uC815"]
  ].map(([k, v], i, arr) => /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)" } }, k), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 14, fontWeight: 600, color: "var(--fg-strong)" } }, me === null ? "\u2026" : v)))), /* @__PURE__ */ React.createElement(Card, { padding: 16 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 15 }), onClick: () => go("messages") }, "\uC120\uC0DD\uB2D8\uAED8 \uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 15 }), onClick: () => go("counseling-request") }, "\uC0C1\uB2F4 \uC694\uCCAD"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 14, background: "var(--bg-muted)", borderRadius: 12, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uD559\uAE09\uC744 \uC62E\uAE30\uAC70\uB098 \uB098\uAC00\uB824\uBA74 \uC120\uC0DD\uB2D8\uAED8 \uBB38\uC758\uD558\uAC70\uB098 \uACE0\uAC1D\uC13C\uD130\uB85C \uC5F0\uB77D\uD574\uC8FC\uC138\uC694.")));
}
