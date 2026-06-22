const messageKindChip = (k) => ({
  memo: /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm" }, "\uC0C1\uB2F4 \uBA54\uBAA8"),
  appointment: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uC0C1\uB2F4 \uC608\uC57D"),
  normal: null,
  feedback: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uD559\uC2B5 \uD53C\uB4DC\uBC31"),
  admissions: /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uC785\uC2DC \uC548\uB0B4")
})[k];
function StudentMessages({ go }) {
  const [selected, setSelected] = React.useState(null);
  const [threads, setThreads] = React.useState(null);
  const [contacts, setContacts] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/messages/threads", { method: "GET" });
      setThreads(r.data || []);
    } catch (e) {
      setThreads([]);
    }
    try {
      const c = await window.__apiFetch("/messages/contacts", { method: "GET" });
      setContacts(c.data || []);
    } catch (e) {
      setContacts([]);
    }
  }, []);
  React.useEffect(() => {
    load();
  }, [load]);
  if (selected) return /* @__PURE__ */ React.createElement(RealMessageThread, { go: () => {
    setSelected(null);
    load();
  }, other: selected });
  const fmt = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + " " + dt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      title: "\uBA54\uC2DC\uC9C0",
      leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("dashboard") }),
      trailing: /* @__PURE__ */ React.createElement("button", { onClick: () => setShowNew((s) => !s), style: { border: "none", background: "transparent", color: "var(--brand-600)", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "\uC0C8 \uB300\uD654")
    }
  ), showNew && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 8px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "var(--fg-muted)", padding: "6px 8px" } }, "\uB300\uD654 \uC0C1\uB300 \uC120\uD0DD"), contacts.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 12, fontSize: 13, color: "var(--fg-muted)" } }, "\uC5F0\uACB0\uB41C \uC120\uC0DD\uB2D8\uC774 \uC5C6\uC5B4\uC694. (\uAC19\uC740 \uD559\uAD50\xB7\uBC18 \uAD50\uC0AC\uC640 \uB300\uD654\uD560 \uC218 \uC788\uC5B4\uC694)") : contacts.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, onClick: () => {
    setShowNew(false);
    setSelected({ otherId: c.id, otherName: c.name });
  }, style: { display: "flex", gap: 10, padding: "10px 8px", cursor: "pointer", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Avatar, { name: c.name.slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, c.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)" } }, [c.school, c.classroom].filter(Boolean).join(" "))))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px" } }, threads === null ? /* @__PURE__ */ React.createElement(Card, { padding: 14 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 48 })) : threads.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 8 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 24 }), title: "\uC544\uC9C1 \uC8FC\uACE0\uBC1B\uC740 \uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC5B4\uC694", body: "\u2018\uC0C8 \uB300\uD654\u2019\uB85C \uC120\uC0DD\uB2D8\uC5D0\uAC8C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uBCF4\uC138\uC694.", action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", onClick: () => setShowNew(true) }, "\uC0C8 \uB300\uD654 \uC2DC\uC791") })) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, threads.map((t, i, arr) => /* @__PURE__ */ React.createElement("div", { key: t.otherId, onClick: () => setSelected({ otherId: t.otherId, otherName: t.otherName }), style: {
    display: "flex",
    gap: 12,
    padding: "14px 16px",
    borderBottom: i < arr.length - 1 ? "1px solid var(--line-subtle)" : "none",
    cursor: "pointer",
    background: t.unread ? "rgba(49,130,246,0.025)" : "transparent"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: t.otherName.slice(0, 1), size: 44 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, t.otherName), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", flexShrink: 0 } }, fmt(t.lastAt))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: t.unread ? "var(--fg-strong)" : "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: t.unread ? 600 : 400 }, className: "kr-heading" }, t.lastBody), t.unread > 0 && /* @__PURE__ */ React.createElement("span", { style: { background: "var(--brand-500)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "0 6px", height: 18, minWidth: 18, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" } }, t.unread))))))));
}
function RealMessageThread({ go, other }) {
  const [input, setInput] = React.useState("");
  const [msgs, setMsgs] = React.useState(null);
  const scrollRef = React.useRef(null);
  const load = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/messages?with=" + encodeURIComponent(other.otherId), { method: "GET" });
      setMsgs(r.data || []);
    } catch (e) {
      setMsgs([]);
    }
  }, [other.otherId]);
  React.useEffect(() => {
    load();
  }, [load]);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);
  const send = async () => {
    if (!input.trim()) return;
    const body = input.trim();
    setInput("");
    try {
      await window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: other.otherId, body }) });
      load();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uBA54\uC2DC\uC9C0 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
      setInput(body);
    }
  };
  const fmtT = (d) => new Date(d).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%", background: "#EAF0F6" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(BackButton, { onClick: go }), /* @__PURE__ */ React.createElement(Avatar, { name: other.otherName.slice(0, 1), size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, other.otherName)))), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 } }, msgs === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 40 }) : msgs.length === 0 ? /* @__PURE__ */ React.createElement(DateDivider, { text: "\uCCAB \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uBCF4\uC138\uC694" }) : msgs.map((m) => /* @__PURE__ */ React.createElement(MessageBubble, { key: m.id, side: m.mine ? "me" : "peer", name: other.otherName, body: m.body, time: fmtT(m.createdAt) }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px 12px", background: "var(--bg-surface)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", background: "var(--bg-muted)", borderRadius: 24, padding: "6px 6px 6px 16px" } }, /* @__PURE__ */ React.createElement("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter") send();
  }, placeholder: "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694", style: { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, minWidth: 0 } }), /* @__PURE__ */ React.createElement("button", { onClick: send, disabled: !input.trim(), style: { width: 36, height: 36, borderRadius: "50%", border: "none", background: input.trim() ? "var(--brand-500)" : "var(--line-strong)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed" } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 })))));
}
function MessageBubble({ side, name, body, time, kind, privateMemo, onBooking }) {
  const isMe = side === "me";
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", gap: 6, alignItems: "flex-end" } }, !isMe && /* @__PURE__ */ React.createElement(Avatar, { name: (name == null ? void 0 : name.slice(0, 1)) || "\uC774", size: 28 }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "76%" } }, (kind || privateMemo) && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 4, display: "flex", gap: 4, justifyContent: isMe ? "flex-end" : "flex-start" } }, messageKindChip(kind), privateMemo && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm", leading: /* @__PURE__ */ React.createElement(IcLock, { size: 10 }) }, "\uBE44\uACF5\uAC1C")), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    background: privateMemo ? "var(--neutral-bg)" : isMe ? "var(--brand-500)" : "var(--bg-surface)",
    color: privateMemo ? "var(--fg-default)" : isMe ? "#fff" : "var(--fg-strong)",
    border: privateMemo ? "1px dashed var(--line-strong)" : "none",
    borderRadius: isMe ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
    fontSize: 14,
    lineHeight: 1.5,
    boxShadow: isMe && !privateMemo ? "none" : "0 1px 2px rgba(0,0,0,0.04)"
  }, className: "kr-heading" }, body), onBooking && /* @__PURE__ */ React.createElement("button", { onClick: onBooking, style: { marginTop: 6, border: "1px solid var(--line-strong)", background: "var(--bg-surface)", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "var(--brand-600)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(IcCalendar, { size: 13 }), " \uC0C1\uB2F4 \uC2DC\uAC04 \uBCF4\uAE30\xB7\uBCC0\uACBD"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-subtle)", marginTop: 2, textAlign: isMe ? "right" : "left" } }, privateMemo ? "\uB098\uB9CC \uBCF4\uC784 \xB7 " : "", time)));
}
function DateDivider({ text }) {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "8px 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-subtle)", padding: "4px 10px", background: "rgba(0,0,0,0.04)", borderRadius: 999 } }, text));
}
function TeacherMessages({ openNotif, go }) {
  const [threads, setThreads] = React.useState(null);
  const [selected, setSelectedRaw] = React.useState(null);
  const [msgs, setMsgs] = React.useState(null);
  const [composing, setComposing] = React.useState(false);
  const [booking, setBooking] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [input, setInput] = React.useState("");
  const [cat, setCat] = React.useState("normal");
  const [memoPublic, setMemoPublic] = React.useState(true);
  const scrollRef = React.useRef(null);
  const loadThreads = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch("/messages/threads", { method: "GET" });
      setThreads(r.data || []);
    } catch (e) {
      setThreads([]);
    }
  }, []);
  React.useEffect(() => {
    loadThreads();
  }, [loadThreads]);
  const loadMsgs = React.useCallback(async (otherId) => {
    if (!otherId) return;
    try {
      const r = await window.__apiFetch("/messages?with=" + encodeURIComponent(otherId), { method: "GET" });
      setMsgs(r.data || []);
    } catch (e) {
      setMsgs([]);
    }
  }, []);
  React.useEffect(() => {
    if (selected) loadMsgs(selected.otherId);
  }, [selected, loadMsgs]);
  const unreadTotal = (threads || []).reduce((s, t) => s + (t.unread || 0), 0);
  const setSelected = (t) => {
    setThreads((ts) => (ts || []).map((x) => x.otherId === t.otherId ? { ...x, unread: 0 } : x));
    setSelectedRaw({ otherId: t.otherId, otherName: t.otherName });
    setMsgs(null);
    setCat("normal");
    setInput("");
  };
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, selected]);
  const visible = (threads || []).filter((t) => filter === "all" || t.unread > 0).filter((t) => (t.otherName || "").includes(search));
  const fmtTime = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + " " + dt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };
  const send = async () => {
    if (!input.trim() || !selected) return;
    const isPrivateMemo = cat === "memo" && !memoPublic;
    const body = input.trim();
    setInput("");
    try {
      await window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: selected.otherId, body }) });
      showToast(isPrivateMemo ? "\uBE44\uACF5\uAC1C \uBA54\uBAA8\uB85C \uC800\uC7A5\uD588\uC5B4\uC694 (\uD559\uC0DD\uC5D0\uAC8C \uC804\uC1A1 \uC548 \uB428)" : cat === "memo" ? "\uC0C1\uB2F4 \uBA54\uBAA8\uB97C \uBCF4\uB0C8\uC5B4\uC694" : "\uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C8\uC5B4\uC694", isPrivateMemo ? "info" : "success");
      setCat("normal");
      loadMsgs(selected.otherId);
      loadThreads();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uBA54\uC2DC\uC9C0 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
      setInput(body);
    }
  };
  const TONE_BG = { info: "var(--brand-500)", brand: "var(--brand-600)", purple: "var(--accent-purple)", mint: "var(--accent-mint)", warning: "var(--warning)" };
  const catChip = (id, label, tone) => {
    const on = cat === id;
    return /* @__PURE__ */ React.createElement("button", { key: id, onClick: () => setCat(id), style: {
      border: "none",
      cursor: "pointer",
      padding: "6px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: on ? TONE_BG[tone] : "var(--bg-muted)",
      color: on ? "#fff" : "var(--fg-muted)",
      boxShadow: on ? "0 2px 6px rgba(17,24,39,0.12)" : "none"
    } }, on && /* @__PURE__ */ React.createElement(IcCheck, { size: 12 }), label);
  };
  const book = async (date, time, place) => {
    if (!selected) return;
    const label = `${date.slice(5, 7)}\uC6D4 ${date.slice(8, 10)}\uC77C ${time}`;
    const body = `\uC0C1\uB2F4 \uC608\uC57D: ${label}${place ? ` \xB7 ${place}` : ""}`;
    try {
      await window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: selected.otherId, body }) });
      showToast(`${selected.otherName} \uD559\uC0DD\uACFC ${label} \uC0C1\uB2F4\uC744 \uC608\uC57D\uD588\uC5B4\uC694 \xB7 \uCC44\uD305\uC5D0 \uBC18\uC601\uB410\uC5B4\uC694`, "success");
      loadMsgs(selected.otherId);
      loadThreads();
    } catch (e) {
      alert(e && e.body && e.body.message || "\uC0C1\uB2F4 \uC608\uC57D \uBA54\uC2DC\uC9C0 \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    TeacherTopbar,
    {
      help: "teacher-messages",
      title: "\uBA54\uC2DC\uC9C0",
      subtitle: "\uD559\uC0DD\uACFC 1:1 \uBA54\uC2DC\uC9C0\xB7\uBA54\uBAA8\xB7\uC0C1\uB2F4 \uC608\uC57D\uC744 \uD55C \uACF3\uC5D0\uC11C \uAD00\uB9AC\uD574\uC694",
      openNotif,
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcPlus, { size: 14 }), onClick: () => setComposing(true) }, "\uC0C8 \uBA54\uC2DC\uC9C0")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "grid", gridTemplateColumns: "320px 1fr", background: "var(--bg-canvas)", minHeight: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { borderRight: "1px solid var(--line-subtle)", background: "var(--bg-surface)", overflow: "auto" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 16px 8px" } }, /* @__PURE__ */ React.createElement(TextInput, { value: search, onChange: setSearch, placeholder: "\uD559\uC0DD \uC774\uB984\uC73C\uB85C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { height: 40 } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 8px 0", display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "all", label: `\uC804\uCCB4 ${(threads || []).length}` }, { id: "unread", label: `\uC548 \uC77D\uC74C ${unreadTotal}` }], activeId: filter, onChange: setFilter })), /* @__PURE__ */ React.createElement("div", null, threads === null ? /* @__PURE__ */ React.createElement("div", { style: { padding: "16px" } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 56 })) : threads.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 16px" } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: "\uC544\uC9C1 \uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uBCF4\uB0B8 \uBA54\uC2DC\uC9C0\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })) : visible.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 16px" } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: filter === "unread" ? "\uC548 \uC77D\uC740 \uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC5B4\uC694" : "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694" })) : visible.map((t) => {
    const active = selected && selected.otherId === t.otherId;
    return /* @__PURE__ */ React.createElement("div", { key: t.otherId, onClick: () => setSelected(t), style: {
      display: "flex",
      gap: 12,
      padding: "12px 16px",
      background: active ? "var(--brand-50)" : t.unread ? "rgba(49,130,246,0.025)" : "transparent",
      borderLeft: active ? "3px solid var(--brand-500)" : "3px solid transparent",
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement(Avatar, { name: (t.otherName || "").slice(0, 1), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)" } }, t.otherName), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, t.unread > 0 && /* @__PURE__ */ React.createElement("span", { style: { background: "var(--brand-500)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "0 5px", height: 16, minWidth: 16, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" } }, t.unread), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-subtle)" } }, fmtTime(t.lastAt)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: t.unread ? "var(--fg-default)" : "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: t.unread ? 600 : 400 }, className: "kr-heading" }, t.lastBody)));
  }))), !selected ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, background: "#EAF0F6" } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 24 }), title: "\uB300\uD654\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694", body: "\uC67C\uCABD \uBAA9\uB85D\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uBA74 \uB300\uD654\uAC00 \uC5F4\uB824\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", minHeight: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 24px", borderBottom: "1px solid var(--line-subtle)", background: "var(--bg-surface)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go && go("student-detail"), style: { display: "flex", alignItems: "center", gap: 12, border: "none", background: "transparent", cursor: go ? "pointer" : "default", padding: 0, textAlign: "left" } }, /* @__PURE__ */ React.createElement(Avatar, { name: (selected.otherName || "").slice(0, 1), size: 36 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)", display: "flex", alignItems: "center", gap: 4 } }, selected.otherName, /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uD504\uB85C\uD544 \uBCF4\uAE30"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDoc, { size: 14 }), onClick: () => go && go("student-detail") }, "\uD559\uC0DD \uD398\uC774\uC9C0"), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 14 }), onClick: () => setBooking(true) }, "\uC0C1\uB2F4 \uC608\uC57D"))), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8, background: "#EAF0F6" } }, msgs === null ? /* @__PURE__ */ React.createElement(Skeleton, { height: 40 }) : msgs.length === 0 ? /* @__PURE__ */ React.createElement(DateDivider, { text: "\uCCAB \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0B4\uBCF4\uC138\uC694" }) : msgs.map((m) => /* @__PURE__ */ React.createElement(
    MessageBubble,
    {
      key: m.id,
      side: m.mine ? "me" : "peer",
      name: (selected.otherName || "").slice(0, 1),
      body: m.body,
      time: new Date(m.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg-surface)", borderTop: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", marginRight: 2 } }, "\uC720\uD615"), catChip("normal", "\uC77C\uBC18 \uBA54\uC2DC\uC9C0", "info"), catChip("memo", "\uC0C1\uB2F4 \uBA54\uBAA8", "purple"), catChip("feedback", "\uD559\uC2B5 \uD53C\uB4DC\uBC31", "brand"), catChip("admissions", "\uC785\uC2DC \uC548\uB0B4", "mint"), /* @__PURE__ */ React.createElement("button", { onClick: () => setBooking(true), style: { border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "var(--warning-bg)", color: "var(--warning)", display: "inline-flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement(IcCalendar, { size: 12 }), " \uC0C1\uB2F4 \uC608\uC57D\uD558\uAE30")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--fg-muted)", marginBottom: 8 } }, "\uC9C0\uAE08 ", /* @__PURE__ */ React.createElement("strong", { style: { color: { normal: "var(--brand-600)", memo: "var(--accent-purple)", feedback: "var(--brand-600)", admissions: "var(--accent-mint)" }[cat] } }, { normal: "\uC77C\uBC18 \uBA54\uC2DC\uC9C0", memo: "\uC0C1\uB2F4 \uBA54\uBAA8", feedback: "\uD559\uC2B5 \uD53C\uB4DC\uBC31", admissions: "\uC785\uC2DC \uC548\uB0B4" }[cat]), " \uC720\uD615\uC73C\uB85C \uBCF4\uB0B4\uC694"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-end", background: "var(--bg-muted)", borderRadius: 18, padding: "8px 8px 8px 16px" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      },
      rows: 1,
      placeholder: `${selected.otherName} \uD559\uC0DD\uC5D0\uAC8C ${cat === "memo" ? "\uBA54\uBAA8\uB97C" : "\uBA54\uC2DC\uC9C0\uB97C"} \uC785\uB825\uD558\uC138\uC694`,
      style: { flex: 1, border: "none", background: "transparent", outline: "none", resize: "none", fontSize: 14, fontFamily: "inherit", lineHeight: 1.5, color: "var(--fg-strong)", maxHeight: 80, paddingTop: 7 }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: send, disabled: !input.trim(), style: { width: 36, height: 36, borderRadius: "50%", border: "none", background: input.trim() ? "var(--brand-500)" : "var(--line-strong)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcSend, { size: 16 }))), cat === "memo" && /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12.5, color: "var(--fg-default)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: memoPublic, onChange: (e) => setMemoPublic(e.target.checked), style: { width: 16, height: 16, accentColor: "var(--brand-500)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, "\uD559\uC0DD\uC5D0\uAC8C \uACF5\uAC1C"), /* @__PURE__ */ React.createElement("span", { style: { color: memoPublic ? "var(--success)" : "var(--fg-muted)" } }, memoPublic ? "\xB7 \uD559\uC0DD\uC5D0\uAC8C \uC804\uC1A1\uB3FC\uC694" : "\xB7 \uBE44\uACF5\uAC1C, \uD559\uC0DD\uC5D0\uAC8C \uC804\uC1A1\uB418\uC9C0 \uC54A\uC544\uC694"))))), composing && /* @__PURE__ */ React.createElement(ComposeOverlay, { onClose: () => setComposing(false), onSent: loadThreads }), booking && /* @__PURE__ */ React.createElement(CounselingBookingDialog, { student: selected, onClose: () => setBooking(false), onBook: book }));
}
function CounselingBookingDialog({ student, onClose, onBook }) {
  var _a, _b, _c;
  const [date, setDate] = React.useState(typeof DATE_OPTIONS !== "undefined" ? DATE_OPTIONS[2] : "2026-05-19");
  const [time, setTime] = React.useState("15:00");
  const [place, setPlace] = React.useState("2-3 \uAD50\uC2E4");
  const [memo, setMemo] = React.useState("");
  const trapRef = useFocusTrap(true, onClose);
  const Sel = typeof CalSelect !== "undefined" ? CalSelect : null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.5)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0C1\uB2F4 \uC608\uC57D", style: { position: "relative", width: 460, maxWidth: "94%", maxHeight: "92%", overflow: "auto", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "\uC0C1\uB2F4 \uC608\uC57D"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--brand-50)", borderRadius: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Avatar, { name: student.avatar || ((_a = student.peer) == null ? void 0 : _a[0]) || ((_b = student.name) == null ? void 0 : _b[0]) || ((_c = student.otherName) == null ? void 0 : _c[0]), size: 40 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, student.peer || student.name || student.otherName), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--brand-600)" } }, student.grade ? `${student.grade}\uBC18 \xB7 ` : "", "\uC0C1\uB2F4 \uB300\uC0C1")), /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uC120\uD0DD\uB428")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(FormField, { label: "\uB0A0\uC9DC", style: { flex: 1, minWidth: 0 } }, Sel ? /* @__PURE__ */ React.createElement(Sel, { value: date, onChange: setDate, options: DATE_OPTIONS, render: (d) => `${d.slice(5, 7)}\uC6D4 ${d.slice(8, 10)}\uC77C` }) : /* @__PURE__ */ React.createElement(TextInput, { value: date, onChange: setDate })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC2DC\uAC04", style: { flex: 1, minWidth: 0 } }, Sel ? /* @__PURE__ */ React.createElement(Sel, { value: time, onChange: setTime, options: TIME_OPTIONS }) : /* @__PURE__ */ React.createElement(TextInput, { value: time, onChange: setTime }))), /* @__PURE__ */ React.createElement(FormField, { label: "\uC7A5\uC18C", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: place, onChange: setPlace, placeholder: "\uC608) 2-3 \uAD50\uC2E4 / \uC0C1\uB2F4\uC2E4" })), /* @__PURE__ */ React.createElement(FormField, { label: "\uC548\uB0B4 \uBA54\uBAA8 (\uC120\uD0DD)", style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Textarea, { value: memo, onChange: setMemo, rows: 3, placeholder: "\uC0C1\uB2F4 \uC804 \uC900\uBE44\uD560 \uB0B4\uC6A9\uC744 \uC801\uC5B4\uC8FC\uC138\uC694" })), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--bg-muted)", borderRadius: 10, fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.5, marginBottom: 16 }, className: "kr-heading" }, "\uC608\uC57D\uD558\uBA74 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-strong)" } }, student.peer || student.name || student.otherName), " \uD559\uC0DD\uC758 \uCE98\uB9B0\uB354\uC5D0 \uC77C\uC815\uC774 \uCD94\uAC00\uB418\uACE0, \uC591\uCE21\uC5D0 \uC54C\uB9BC\uC774 \uAC00\uC694. \uC2DC\uAC04\uC740 \uD559\uC0DD\xB7\uAD50\uC0AC \uBAA8\uB450 \uB098\uC911\uC5D0 \uBCC0\uACBD\uD560 \uC218 \uC788\uC5B4\uC694."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, onClick: () => {
    if (onBook) {
      onBook(date, time, place);
    } else {
      showToast(`${student.peer || student.name || student.otherName} \uD559\uC0DD\uACFC ${date.slice(5, 7)}/${date.slice(8, 10)} ${time} \uC0C1\uB2F4\uC744 \uC608\uC57D\uD588\uC5B4\uC694`, "success");
    }
    onClose();
  } }, "\uC608\uC57D\uD558\uACE0 \uC54C\uB9BC \uBCF4\uB0B4\uAE30"))));
}
function ComposeOverlay({ onClose, onSent }) {
  const [target, setTarget] = React.useState("individual");
  const [picked, setPicked] = React.useState(null);
  const [q, setQ] = React.useState("");
  const [body, setBody] = React.useState("");
  const [contacts, setContacts] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const trapRef = useFocusTrap(true, onClose);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch("/messages/contacts", { method: "GET" });
        if (alive) setContacts(r && r.data || []);
      } catch (e) {
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const students = contacts.filter((c) => c.role === "student");
  const roster = students.filter((s) => (s.name || "").includes(q));
  const canSend = body.trim() && (target === "all" ? students.length > 0 : !!picked) && !busy;
  const doSend = async () => {
    if (!canSend) return;
    setBusy(true);
    try {
      const targets = target === "all" ? students : [picked];
      for (const t of targets) {
        await window.__apiFetch("/messages", { method: "POST", body: JSON.stringify({ recipientId: t.id, body: body.trim() }) });
      }
      showToast(target === "all" ? `\uD559\uAE09 \uC804\uCCB4(${students.length}\uBA85)\uC5D0\uAC8C \uBCF4\uB0C8\uC5B4\uC694` : `${picked.name} \uD559\uC0DD\uC5D0\uAC8C \uBCF4\uB0C8\uC5B4\uC694`, "success");
      onSent && onSent();
      onClose();
    } catch (e) {
      showToast(e && e.body && e.body.message || "\uC804\uC1A1\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694", "error");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(17,24,39,0.45)" } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": "\uC0C8 \uBA54\uC2DC\uC9C0", style: { position: "relative", width: 560, maxWidth: "94%", maxHeight: "90%", overflow: "auto", background: "var(--bg-elevated)", borderRadius: 20, padding: 24, boxShadow: "var(--shadow-pop)" }, className: "toss-scroll" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700 } }, "\uC0C8 \uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose })), /* @__PURE__ */ React.createElement(FormField, { label: "\uBC1B\uB294 \uC0AC\uB78C", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Tabs, { items: [{ id: "all", label: `\uD559\uAE09 \uC804\uCCB4 (${students.length}\uBA85)` }, { id: "individual", label: "\uD559\uC0DD 1\uBA85" }], activeId: target, onChange: (v) => {
    setTarget(v);
    setPicked(null);
  } })), target === "individual" && /* @__PURE__ */ React.createElement(FormField, { label: "\uD559\uC0DD \uC120\uD0DD", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD \uC774\uB984 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 200, overflow: "auto", border: "1px solid var(--line-subtle)", borderRadius: 12 }, className: "toss-scroll" }, roster.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 20, textAlign: "center", fontSize: 13, color: "var(--fg-muted)" } }, "\uD559\uC0DD\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694") : roster.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s.id, onClick: () => setPicked(s), style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    border: "none",
    cursor: "pointer",
    borderBottom: i < roster.length - 1 ? "1px solid var(--line-subtle)" : "none",
    background: picked && picked.id === s.id ? "var(--brand-50)" : "transparent"
  } }, /* @__PURE__ */ React.createElement(Avatar, { name: s.name[0], size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.classroom || s.school || "\uD559\uC0DD")), picked && picked.id === s.id && /* @__PURE__ */ React.createElement(IcCheckCircle, { size: 18, color: "var(--brand-500)" }))))), /* @__PURE__ */ React.createElement(FormField, { label: "\uCE74\uD14C\uACE0\uB9AC", style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "info" }, "\uC77C\uBC18 \uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement(Chip, { tone: "purple" }, "\uC0C1\uB2F4 \uBA54\uBAA8"), /* @__PURE__ */ React.createElement(Chip, { tone: "warning" }, "\uC0C1\uB2F4 \uC608\uC57D"), /* @__PURE__ */ React.createElement(Chip, { tone: "brand" }, "\uD559\uC2B5 \uD53C\uB4DC\uBC31"), /* @__PURE__ */ React.createElement(Chip, { tone: "mint" }, "\uC785\uC2DC \uC548\uB0B4"))), /* @__PURE__ */ React.createElement(FormField, { label: "\uB0B4\uC6A9", required: true }, /* @__PURE__ */ React.createElement(Textarea, { value: body, onChange: setBody, rows: 5, placeholder: target === "all" ? "\uD559\uAE09 \uC804\uCCB4\uC5D0\uAC8C \uBCF4\uB0BC \uB0B4\uC6A9" : picked ? `${picked.name} \uD559\uC0DD\uC5D0\uAC8C \uC804\uD560 \uB0B4\uC6A9` : "\uBA3C\uC800 \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uC138\uC694" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", full: true, onClick: onClose }, "\uCDE8\uC18C"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", full: true, trailing: /* @__PURE__ */ React.createElement(IcSend, { size: 14 }), disabled: !canSend, onClick: doSend }, busy ? "\uBCF4\uB0B4\uB294 \uC911\u2026" : "\uBCF4\uB0B4\uAE30"))));
}
Object.assign(window, {
  StudentMessages,
  TeacherMessages,
  ComposeOverlay,
  CounselingBookingDialog,
  MessageBubble,
  DateDivider
});
