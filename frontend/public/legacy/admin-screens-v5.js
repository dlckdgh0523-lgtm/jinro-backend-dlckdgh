const aStatus = (s) => ({
  active: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, "\uD65C\uC131"),
  disabled: /* @__PURE__ */ React.createElement(Chip, { tone: "danger", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDot, { size: 6 }) }, "\uBE44\uD65C\uC131")
})[s] || /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s || "\u2014");
function AdminListShell({ title, subtitle, action, filters, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title, subtitle, action }), filters && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 24px 8px", display: "flex", gap: 12, alignItems: "center", background: "var(--bg-canvas)", flexWrap: "wrap" } }, filters), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: "8px 24px 24px", background: "var(--bg-canvas)" } }, children));
}
function AdminStudents() {
  const [q, setQ] = React.useState("");
  const [rows, setRows] = React.useState(null);
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      params.set("role", "student");
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "100");
      const res = await adminFetch("/admin/users?" + params.toString());
      setRows(res && res.data || []);
    } catch (e) {
      setRows([]);
    }
  }, [q]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  const loading = rows === null;
  const list = rows || [];
  return /* @__PURE__ */ React.createElement(
    AdminListShell,
    {
      title: "\uD559\uC0DD \uAD00\uB9AC",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `${list.length}\uAC74 \uD45C\uC2DC`,
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("\uD559\uC0DD \uBAA9\uB85D", ["\uC774\uB984", "\uC774\uBA54\uC77C", "\uD559\uAD50", "\uD559\uAE09", "\uD559\uB144", "\uC0C1\uD0DC", "\uAC00\uC785\uC77C"], list.map((s) => [s.name, s.email, s.school || "", s.classroom || "", s.grade != null ? String(s.grade) : "", s.status, fmtDate(s.createdAt)])) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30")),
      filters: /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uC0DD\xB7\uC774\uBA54\uC77C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { flex: 1, maxWidth: 320, height: 40 } })
    },
    /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.8fr 1.4fr 1fr 0.8fr 1fr 1.2fr", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid var(--line-subtle)", minWidth: 760 } }, /* @__PURE__ */ React.createElement("span", null, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAD50"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAE09"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uB144"), /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("span", null, "\uAC00\uC785\uC77C")), loading ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: 32, height: 32, radius: 16 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 14 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 22 }), title: "\uD45C\uC2DC\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694", body: q.trim() ? "\uAC80\uC0C9 \uC870\uAC74\uC744 \uBC14\uAFD4\uBCF4\uC138\uC694." : "\uC544\uC9C1 \uAC00\uC785\uD55C \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694." })) : list.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.id, style: { display: "grid", gridTemplateColumns: "1.8fr 1.4fr 1fr 0.8fr 1fr 1.2fr", padding: "14px 20px", alignItems: "center", fontSize: 13, borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none", minWidth: 760 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?")[0], size: 32 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, s.email))), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--fg-default)" } }, s.school || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--fg-default)" } }, s.classroom || "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { color: "var(--fg-default)" } }, s.grade != null ? s.grade : "\u2014"), /* @__PURE__ */ React.createElement("div", null, aStatus(s.status)), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 12, color: "var(--fg-muted)" } }, fmtDate(s.createdAt)))))
  );
}
function AdminClassrooms() {
  const [q, setQ] = React.useState("");
  const [school, setSchool] = React.useState(null);
  const [students, setStudents] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch("/admin/users?role=student&limit=200");
        if (alive) setStudents(res && res.data || []);
      } catch (e) {
        if (alive) setStudents([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const groups = React.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    (students || []).forEach((s) => {
      const sch = s.school || "\uBBF8\uC9C0\uC815";
      const cls = s.classroom || "\uBBF8\uC9C0\uC815";
      const key = sch + "__" + cls;
      if (!map.has(key)) map.set(key, { id: key, school: sch, classroom: cls, count: 0 });
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => (a.school + a.classroom).localeCompare(b.school + b.classroom));
  }, [students]);
  const rows = groups.filter((c) => !q.trim() || c.school.includes(q) || c.classroom.includes(q));
  if (school) return /* @__PURE__ */ React.createElement(AdminSchoolDetail, { school, students: (students || []).filter((s) => (s.school || "\uBBF8\uC9C0\uC815") === school), onBack: () => setSchool(null) });
  const loading = students === null;
  return /* @__PURE__ */ React.createElement(
    AdminListShell,
    {
      title: "\uD559\uAE09 \uAD00\uB9AC",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `${rows.length}\uAC1C \uD559\uAE09 \xB7 \uD559\uAD50\uBA85\uC744 \uB204\uB974\uBA74 \uC18C\uC18D \uD559\uC0DD\uC744 \uBCFC \uC218 \uC788\uC5B4\uC694`,
      filters: /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uAD50\xB7\uD559\uAE09 \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { flex: 1, maxWidth: 320, height: 40 } })
    },
    loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 18 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 70 })))) : rows.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 24 }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSchool, { size: 22 }), title: "\uD45C\uC2DC\uD560 \uD559\uAE09\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uD559\uAD50\xB7\uD559\uAE09 \uC815\uBCF4\uC640 \uD568\uAED8 \uAC00\uC785\uD558\uBA74 \uD559\uAE09\uC774 \uC790\uB3D9\uC73C\uB85C \uBB36\uC5EC\uC694." })) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 } }, rows.map((c) => /* @__PURE__ */ React.createElement(Card, { key: c.id, padding: 18 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setSchool(c.school), style: { border: "none", background: "transparent", padding: 0, cursor: "pointer", fontSize: 15, fontWeight: 700, color: "var(--brand-600)", display: "inline-flex", alignItems: "center", gap: 3 } }, c.school, /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, c.classroom))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--bg-muted)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--fg-muted)" } }, "\uC18C\uC18D \uD559\uC0DD"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontWeight: 700, color: "var(--fg-strong)" } }, c.count, "\uBA85")))))
  );
}
function AdminSubscriptions() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title: "\uAD6C\uB3C5", subtitle: "\uAD6C\uB3C5 \uC5F0\uB3D9 \uC900\uBE44 \uC911" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", padding: 24 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { width: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcStar, { size: 24 }), title: "\uAD6C\uB3C5 \uC5F0\uB3D9\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694", body: "\uD604\uC7AC\uB294 \uBB34\uB8CC \uCCB4\uD5D8 \uBAA8\uB4DC\uB85C \uC6B4\uC601\uB3FC\uC694. \uAD6C\uB3C5 \uC0C1\uD0DC\xB7\uACB0\uC81C \uC8FC\uAE30 \uB370\uC774\uD130\uB294 \uACB0\uC81C \uC5F0\uB3D9 \uD6C4 \uC81C\uACF5\uB429\uB2C8\uB2E4." }))));
}
function AdminAIUsage() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch("/admin/ai-usage");
        if (alive) setData(res && res.data || {});
      } catch (e) {
        if (alive) setData({});
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const loading = data === null;
  const t = data && data.totals || {};
  const recent = data === null ? null : data.recent || [];
  const n = (v) => (v == null ? 0 : v).toLocaleString();
  const sChip = (s) => ({
    active: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uC9C4\uD589"),
    completed: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC644\uB8CC"),
    report_ready: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uB9AC\uD3EC\uD2B8 \uC644\uB8CC")
  })[s] || /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s || "\u2014");
  return /* @__PURE__ */ React.createElement(
    AdminListShell,
    {
      title: "AI \uC0AC\uC6A9\uB7C9",
      subtitle: "\uC0C1\uB2F4 \uC138\uC158\xB7\uBA54\uC2DC\uC9C0\xB7\uB9AC\uD3EC\uD2B8 \uC9D1\uACC4 + \uCD5C\uADFC \uC138\uC158",
      action: recent && recent.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("AI \uC0AC\uC6A9\uB7C9 - \uCD5C\uADFC \uC138\uC158", ["\uD559\uC0DD", "\uC0C1\uD0DC", "\uBA54\uC2DC\uC9C0", "\uB2E8\uC11C", "\uC2DC\uC791"], recent.map((r) => [r.student, r.status, r.messages, r.signals, fmtDateTime(r.startedAt)])) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30")
    },
    loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 18 }, /* @__PURE__ */ React.createElement(Skeleton, { width: "60%", height: 12 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 24, style: { marginTop: 12 } })))) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D AI \uC138\uC158", value: n(t.sessions), icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC9C4\uD589 \uC911 \uC138\uC158", value: n(t.active), icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uBA54\uC2DC\uC9C0", value: n(t.messages), icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uB9AC\uD3EC\uD2B8 \uC0DD\uC131", value: n(t.reports), icon: /* @__PURE__ */ React.createElement(IcStar, { size: 16 }) })),
    /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.6fr", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--line-subtle)", minWidth: 680 } }, /* @__PURE__ */ React.createElement("span", null, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("span", null, "\uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement("span", null, "\uB2E8\uC11C"), /* @__PURE__ */ React.createElement("span", null, "\uC2DC\uC791")), recent === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 14 }))) : recent.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 22 }), title: "\uCD5C\uADFC AI \uC138\uC158\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 AI \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })) : recent.map((r, i) => {
      var _a, _b;
      return /* @__PURE__ */ React.createElement("div", { key: r.id || i, style: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.6fr", padding: "14px 20px", alignItems: "center", fontSize: 13, borderBottom: i < recent.length - 1 ? "1px solid var(--line-subtle)" : "none", minWidth: 680 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (r.student || "?")[0], size: 28 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, r.student || "\uC775\uBA85")), /* @__PURE__ */ React.createElement("span", null, sChip(r.status)), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-default)" } }, (_a = r.messages) != null ? _a : 0), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-default)" } }, (_b = r.signals) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, color: "var(--fg-muted)" } }, fmtDateTime(r.startedAt)));
    }))
  );
}
function AdminCounseling() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch("/admin/ai-usage");
        if (alive) setData(res && res.data || {});
      } catch (e) {
        if (alive) setData({});
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const loading = data === null;
  const t = data && data.totals || {};
  const recent = data === null ? null : data.recent || [];
  const n = (v) => (v == null ? 0 : v).toLocaleString();
  const sChip = (s) => ({
    active: /* @__PURE__ */ React.createElement(Chip, { tone: "info", size: "sm" }, "\uC9C4\uD589"),
    completed: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC644\uB8CC"),
    report_ready: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uB9AC\uD3EC\uD2B8 \uC644\uB8CC")
  })[s] || /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, s || "\u2014");
  return /* @__PURE__ */ React.createElement(AdminListShell, { title: "\uC0C1\uB2F4 \uC138\uC158", subtitle: "AI \uC0C1\uB2F4 \uC138\uC158 \uBA54\uD0C0\uB370\uC774\uD130 (\uB0B4\uC6A9\uC740 \uBE44\uACF5\uAC1C)" }, loading ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 18 }, /* @__PURE__ */ React.createElement(Skeleton, { width: "60%", height: 12 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 24, style: { marginTop: 12 } })))) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uC0C1\uB2F4 \uC138\uC158", value: n(t.sessions), icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC9C4\uD589 \uC911", value: n(t.active), icon: /* @__PURE__ */ React.createElement(IcSparkles, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uCD1D \uBA54\uC2DC\uC9C0", value: n(t.messages), icon: /* @__PURE__ */ React.createElement(IcDoc, { size: 16 }) })), /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.6fr", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--line-subtle)", minWidth: 680 } }, /* @__PURE__ */ React.createElement("span", null, "\uD559\uC0DD"), /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("span", null, "\uBA54\uC2DC\uC9C0"), /* @__PURE__ */ React.createElement("span", null, "\uB2E8\uC11C"), /* @__PURE__ */ React.createElement("span", null, "\uC2DC\uC791")), recent === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 14 }))) : recent.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcMessage, { size: 22 }), title: "\uCD5C\uADFC \uC0C1\uB2F4 \uC138\uC158\uC774 \uC5C6\uC5B4\uC694", body: "\uD559\uC0DD\uC774 \uC0C1\uB2F4\uC744 \uC2DC\uC791\uD558\uBA74 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB3FC\uC694." })) : recent.map((r, i) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement("div", { key: r.id || i, style: { display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1.6fr", padding: "14px 20px", alignItems: "center", fontSize: 13, borderBottom: i < recent.length - 1 ? "1px solid var(--line-subtle)" : "none", minWidth: 680 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (r.student || "?")[0], size: 28 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, r.student || "\uC775\uBA85")), /* @__PURE__ */ React.createElement("span", null, sChip(r.status)), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-default)" } }, (_a = r.messages) != null ? _a : 0), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-default)" } }, (_b = r.signals) != null ? _b : 0), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, color: "var(--fg-muted)" } }, fmtDateTime(r.startedAt)));
  })));
}
function AdminNotifEvents() {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminTopbar, { title: "\uC54C\uB9BC \uC774\uBCA4\uD2B8", subtitle: "\uC54C\uB9BC \uC774\uBCA4\uD2B8 \uB85C\uADF8 \uC900\uBE44 \uC911" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-canvas)", padding: 24 } }, /* @__PURE__ */ React.createElement(Card, { padding: 32, style: { width: 480, textAlign: "center" } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcBell, { size: 24 }), title: "\uC54C\uB9BC \uC774\uBCA4\uD2B8 \uB85C\uADF8\uB294 \uC900\uBE44 \uC911\uC774\uC5D0\uC694", body: "dedupeKey \uAE30\uBC18 \uC1A1\uC218\uC2E0 \uB85C\uADF8\uB97C \uB178\uCD9C\uD558\uB294 \uAD00\uB9AC\uC790 API\uB294 \uC544\uC9C1 \uC5F0\uB3D9\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694." }))));
}
function AdminTeachers() {
  const [q, setQ] = React.useState("");
  const [rows, setRows] = React.useState(null);
  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      params.set("role", "teacher");
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "100");
      const res = await adminFetch("/admin/users?" + params.toString());
      setRows(res && res.data || []);
    } catch (e) {
      setRows([]);
    }
  }, [q]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  const loading = rows === null;
  const list = rows || [];
  return /* @__PURE__ */ React.createElement(
    AdminListShell,
    {
      title: "\uAD50\uC0AC \uAD00\uB9AC",
      subtitle: loading ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : `${list.length}\uAC74 \uD45C\uC2DC`,
      action: list.length > 0 && /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF("\uAD50\uC0AC \uBAA9\uB85D", ["\uC774\uB984", "\uC774\uBA54\uC77C", "\uD559\uAD50", "\uD559\uAE09", "\uC0C1\uD0DC", "\uAC00\uC785\uC77C"], list.map((r) => [r.name, r.email, r.school || "", r.classroom || "", r.status, fmtDate(r.createdAt)])) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30"),
      filters: /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uAD50\uC0AC\xB7\uC774\uBA54\uC77C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }), style: { flex: 1, maxWidth: 320, height: 40 } })
    },
    /* @__PURE__ */ React.createElement(Card, { padding: 0 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.8fr 1.4fr 1fr 1fr 1.2fr", padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--fg-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--line-subtle)", minWidth: 640 } }, /* @__PURE__ */ React.createElement("span", null, "\uAD50\uC0AC"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAD50"), /* @__PURE__ */ React.createElement("span", null, "\uD559\uAE09"), /* @__PURE__ */ React.createElement("span", null, "\uC0C1\uD0DC"), /* @__PURE__ */ React.createElement("span", null, "\uAC00\uC785\uC77C")), loading ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid var(--line-subtle)" } }, /* @__PURE__ */ React.createElement(Skeleton, { width: 32, height: 32, radius: 16 }), /* @__PURE__ */ React.createElement(Skeleton, { width: "40%", height: 14 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24 } }, /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 22 }), title: "\uD45C\uC2DC\uD560 \uAD50\uC0AC\uAC00 \uC5C6\uC5B4\uC694", body: q.trim() ? "\uAC80\uC0C9 \uC870\uAC74\uC744 \uBC14\uAFD4\uBCF4\uC138\uC694." : "\uC544\uC9C1 \uAC00\uC785\uD55C \uAD50\uC0AC\uAC00 \uC5C6\uC5B4\uC694." })) : list.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: r.id, style: { display: "grid", gridTemplateColumns: "1.8fr 1.4fr 1fr 1fr 1.2fr", padding: "14px 20px", alignItems: "center", fontSize: 13, borderBottom: i < list.length - 1 ? "1px solid var(--line-subtle)" : "none", minWidth: 640 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (r.name || "?")[0], size: 32 }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, r.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, r.email))), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-default)" } }, r.school || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-default)" } }, r.classroom || "\u2014"), /* @__PURE__ */ React.createElement("span", null, aStatus(r.status)), /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 12, color: "var(--fg-muted)" } }, fmtDate(r.createdAt)))))
  );
}
function AdminSchoolDetail({ school, students = [], onBack }) {
  const classCount = new Set(students.map((s) => s.classroom || "\uBBF8\uC9C0\uC815")).size;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } }, /* @__PURE__ */ React.createElement(
    AdminTopbar,
    {
      title: `${school} \uC0C1\uC138`,
      subtitle: `\uC18C\uC18D \uD559\uC0DD ${students.length}\uBA85 \xB7 \uD559\uAE09 ${classCount}\uAC1C`,
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "sm", leading: /* @__PURE__ */ React.createElement(IcArrowLeft, { size: 14 }), onClick: onBack }, "\uD559\uAE09 \uBAA9\uB85D"), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcDownload, { size: 14 }), onClick: () => exportReportPDF(`${school} \uBA85\uB2E8`, ["\uC774\uB984", "\uC774\uBA54\uC77C", "\uD559\uAE09", "\uD559\uB144", "\uC0C1\uD0DC"], students.map((s) => [s.name, s.email, s.classroom || "", s.grade != null ? String(s.grade) : "", s.status]), { "\uD559\uAD50": school }) }, "PDF \uB0B4\uBCF4\uB0B4\uAE30"))
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "toss-scroll", style: { flex: 1, overflow: "auto", padding: 24, background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MetricCard, { label: "\uC18C\uC18D \uD559\uC0DD", value: `${students.length}\uBA85`, icon: /* @__PURE__ */ React.createElement(IcUser, { size: 16 }) }), /* @__PURE__ */ React.createElement(MetricCard, { label: "\uD559\uAE09 \uC218", value: `${classCount}\uAC1C`, icon: /* @__PURE__ */ React.createElement(IcSchool, { size: 16 }) })), /* @__PURE__ */ React.createElement(SectionCard, { title: "\uC18C\uC18D \uD559\uC0DD" }, students.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcUser, { size: 22 }), title: "\uD45C\uC2DC\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694" }) : /* @__PURE__ */ React.createElement(Card, { padding: 0 }, students.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: s.id, style: { display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr 1fr", padding: "12px 16px", alignItems: "center", fontSize: 13, borderBottom: i < students.length - 1 ? "1px solid var(--line-subtle)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(Avatar, { name: (s.name || "?")[0], size: 30 }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: "var(--fg-strong)" } }, s.name)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, s.classroom || "\u2014"), /* @__PURE__ */ React.createElement("span", { className: "num", style: { color: "var(--fg-default)" } }, s.grade != null ? s.grade : "\u2014"), /* @__PURE__ */ React.createElement("span", null, aStatus(s.status))))))));
}
Object.assign(window, {
  AdminStudents,
  AdminClassrooms,
  AdminSubscriptions,
  AdminAIUsage,
  AdminCounseling,
  AdminNotifEvents,
  AdminTeachers,
  AdminSchoolDetail
});
