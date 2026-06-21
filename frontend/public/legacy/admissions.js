const REGIONS = ["\uC804\uCCB4", "\uC11C\uC6B8", "\uACBD\uAE30\xB7\uC778\uCC9C", "\uAC15\uC6D0", "\uCDA9\uCCAD", "\uACBD\uC0C1", "\uC804\uB77C", "\uC81C\uC8FC"];
const UNIV_TYPES = ["\uC804\uCCB4", "\uAD6D\uB9BD", "\uC0AC\uB9BD", "\uC2DC\uB9BD", "\uD2B9\uC218"];
const confidenceChip = (c) => ({
  confirmed: /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCheck, { size: 10 }) }, "\uD655\uC815 \uB370\uC774\uD130"),
  estimated: /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm", leading: /* @__PURE__ */ React.createElement(IcInfo, { size: 10 }) }, "\uCD94\uC815 \uB370\uC774\uD130"),
  unavailable: /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uB370\uC774\uD130 \uC900\uBE44 \uC911")
})[c];
function admFetch(path) {
  if (typeof window !== "undefined" && window.__apiFetch) return window.__apiFetch(path, { method: "GET" });
  return fetch((typeof window !== "undefined" && window.VITE_API_BASE_URL || "/v1") + path).then((r) => r.json());
}
function AdmissionsHub({ go }) {
  const [tab, setTab] = React.useState("domestic");
  const [q, setQ] = React.useState(() => {
    try {
      const seed = window.__admissionsQuery;
      if (seed) {
        delete window.__admissionsQuery;
        return String(seed);
      }
    } catch (e) {
    }
    return "";
  });
  const [region, setRegion] = React.useState("\uC804\uCCB4");
  const [type, setType] = React.useState("\uC804\uCCB4");
  const [page, setPage] = React.useState(1);
  const [unis, setUnis] = React.useState(null);
  const [meta, setMeta] = React.useState(null);
  const TYPE_MAP = { national: "\uAD6D\uB9BD", private: "\uC0AC\uB9BD", municipal: "\uACF5\uB9BD", special: "\uD2B9\uC218" };
  const PAGE_SIZE = 20;
  const load = React.useCallback(async (opts) => {
    setUnis(null);
    try {
      const p = new URLSearchParams();
      if (opts.q && opts.q.trim()) p.set("q", opts.q.trim());
      if (opts.region && opts.region !== "\uC804\uCCB4") p.set("region", opts.region);
      if (opts.type && opts.type !== "\uC804\uCCB4") p.set("type", opts.type);
      p.set("page", String(opts.page || 1));
      p.set("limit", String(PAGE_SIZE));
      const res = await admFetch("/admissions/universities?" + p.toString());
      setUnis((res.data || []).map((u) => ({
        id: u.id,
        name: u.name,
        short: u.short || u.name,
        region: u.region || "",
        type: TYPE_MAP[u.type] || u.type || "",
        deptCount: u.deptCount != null ? u.deptCount : "",
        confidence: u.confidence || "confirmed",
        logoColor: "var(--brand-500)"
      })));
      setMeta(res.meta || null);
    } catch (e) {
      setUnis([]);
      setMeta(null);
    }
  }, []);
  React.useEffect(() => {
    const id = setTimeout(() => {
      load({ q, region, type, page });
    }, 300);
    return () => clearTimeout(id);
  }, [q, region, type, page, load]);
  const onRegion = (r) => {
    setRegion(r);
    setPage(1);
  };
  const onType = (t) => {
    setType(t);
    setPage(1);
  };
  const onQ = (v) => {
    setQ(v);
    setPage(1);
  };
  const totalPages = meta && meta.totalPages || 1;
  const total = meta && meta.total != null ? meta.total : null;
  const pageWindow = (() => {
    const w = [];
    let s = Math.max(1, page - 2), e = Math.min(totalPages, s + 4);
    s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) w.push(i);
    return w;
  })();
  const TABS = [{ id: "domestic", label: "\uAD6D\uB0B4 \uB300\uD559" }, { id: "overseas", label: "\uD574\uC678\uB300\uD559" }];
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(
    ScreenHeader,
    {
      title: "\uB300\uD559 \xB7 \uC785\uC2DC",
      subtitle: "\uAD6D\uB0B4\xB7\uD574\uC678 \uB300\uD559, \uD559\uACFC\xB7\uACBD\uC7C1\uB960\xB7\uCDE8\uC5C5\uB960\uC744 \uACF5\uACF5\uB370\uC774\uD130\uB85C \uD655\uC778\uD558\uC138\uC694"
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 16px 0", display: "flex", gap: 6, borderBottom: "1px solid var(--line-subtle)" } }, TABS.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 4px",
    marginRight: 12,
    fontSize: 14,
    fontWeight: tab === t.id ? 700 : 500,
    color: tab === t.id ? "var(--brand-600)" : "var(--fg-muted)",
    borderBottom: tab === t.id ? "2px solid var(--brand-500)" : "2px solid transparent"
  } }, t.label))), tab === "overseas" ? /* @__PURE__ */ React.createElement(ForeignUnivScreen, { go, embedded: true }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 0" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: onQ, placeholder: "\uB300\uD559\uBA85 \uAC80\uC0C9 (\uC608: \uC11C\uC6B8\uB300)", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(FilterRow, { label: "\uC9C0\uC5ED", items: REGIONS, active: region, onChange: onRegion }), /* @__PURE__ */ React.createElement(FilterRow, { label: "\uC720\uD615", items: UNIV_TYPES, active: type, onChange: onType })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--fg-muted)" } }, unis === null ? "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" : total != null ? `\uCD1D ${total}\uAC1C \xB7 ${page}/${totalPages}\uD398\uC774\uC9C0` : `${(unis || []).length}\uAC1C`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, unis === null ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 14 }, /* @__PURE__ */ React.createElement(Skeleton, { height: 48 }))) : unis.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uB300\uD559\uC774 \uC5C6\uC5B4\uC694. \uC9C0\uC5ED\xB7\uC720\uD615\xB7\uAC80\uC0C9\uC5B4\uB97C \uBC14\uAFD4\uBCF4\uC138\uC694.") : unis.map((u) => /* @__PURE__ */ React.createElement(UnivCard, { key: u.id, u, onClick: () => {
    window.__selectedUnivId = u.id;
    window.__selectedUnivName = u.name;
    go("admissions-univ");
  } }))), unis !== null && totalPages > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(PageBtn, { disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)) }, "\uC774\uC804"), pageWindow[0] > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(1) }, "1"), pageWindow[0] > 2 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026")), pageWindow.map((n) => /* @__PURE__ */ React.createElement(PageBtn, { key: n, active: n === page, onClick: () => setPage(n) }, n)), pageWindow[pageWindow.length - 1] < totalPages && /* @__PURE__ */ React.createElement(React.Fragment, null, pageWindow[pageWindow.length - 1] < totalPages - 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026"), /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(totalPages) }, totalPages)), /* @__PURE__ */ React.createElement(PageBtn, { disabled: page >= totalPages, onClick: () => setPage((p) => Math.min(totalPages, p + 1)) }, "\uB2E4\uC74C")))));
}
function PageBtn({ children, active, disabled, onClick }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, disabled, style: {
    minWidth: 34,
    height: 34,
    padding: "0 10px",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid " + (active ? "var(--brand-500)" : "var(--line-subtle)"),
    background: active ? "var(--brand-500)" : "var(--bg-surface)",
    color: active ? "#fff" : disabled ? "var(--fg-subtle)" : "var(--fg-default)",
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    opacity: disabled ? 0.5 : 1
  } }, children);
}
function FilterRow({ label, items, active, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: "var(--fg-subtle)", minWidth: 28 } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflow: "auto", flex: 1 }, className: "toss-scroll" }, items.map((it) => /* @__PURE__ */ React.createElement("button", { key: it, onClick: () => onChange(it), style: {
    border: "none",
    background: it === active ? "var(--brand-500)" : "var(--bg-surface)",
    color: it === active ? "#fff" : "var(--fg-default)",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: it === active ? "none" : "0 1px 2px rgba(0,0,0,0.04)"
  } }, it))));
}
function UnivCard({ u, onClick }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 14, onClick, hoverable: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: u.logoColor,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
    flexShrink: 0,
    letterSpacing: "-0.3px"
  } }, u.short.slice(0, 3)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--fg-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, u.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, u.region, " \xB7 ", u.type, " \xB7 \uD559\uACFC ", u.deptCount)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 } }, confidenceChip(u.confidence), /* @__PURE__ */ React.createElement(IcChevronRight, { size: 14, color: "var(--fg-subtle)" }))));
}
function UniversityDetail({ go }) {
  const univId = typeof window !== "undefined" && window.__selectedUnivId || null;
  const univName = typeof window !== "undefined" && window.__selectedUnivName || "\uB300\uD559";
  const [detail, setDetail] = React.useState(null);
  const [depts, setDepts] = React.useState(null);
  const [deptMeta, setDeptMeta] = React.useState(null);
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    if (!univId) return;
    (async () => {
      try {
        const d = await admFetch("/admissions/universities/" + univId);
        setDetail(d.data);
      } catch (e) {
        setDetail({});
      }
      try {
        const dep = await admFetch("/admissions/universities/" + univId + "/departments?limit=300");
        setDepts(dep.data || []);
        setDeptMeta(dep.meta || null);
      } catch (e) {
        setDepts([]);
      }
    })();
  }, [univId]);
  const adm = detail && detail.admissions;
  const emp = detail && detail.employment;
  const exch = detail && detail.exchange;
  const filtered = (depts || []).filter((d) => !q || (d.name || "").includes(q));
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uB300\uD559", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("admissions-hub") }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 8px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 56, height: 56, borderRadius: 14, background: "var(--brand-500)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 } }, (detail && detail.name || univName).slice(0, 2)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, detail && detail.name || univName), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)" } }, detail && detail.region || ""))), adm && adm.confidence === "confirmed" ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid var(--line-subtle)" } }, adm.ratio && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uACBD\uC7C1\uB960 ", adm.ratio), adm.freshmanFillRate != null && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uCDA9\uC6D0\uC728 ", adm.freshmanFillRate, "%"), adm.finalRegistrationRate != null && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uB4F1\uB85D\uB960 ", adm.finalRegistrationRate, "%"), emp && emp.confidence === "confirmed" && emp.avgRate != null && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uCDE8\uC5C5\uB960 ", emp.avgRate, "%"), exch && exch.confidence === "confirmed" && exch.total > 0 && /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm" }, "\uAD50\uD658\uD559\uC0DD ", exch.total, "\uBA85"), adm.svyYr && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, adm.svyYr, " \uACF5\uC2DC")) : /* @__PURE__ */ React.createElement("div", { style: { paddingTop: 12, borderTop: "1px solid var(--line-subtle)", fontSize: 12, color: "var(--fg-muted)" } }, "\uC785\uC2DC \uACBD\uC7C1\uB960 \uB370\uC774\uD130\uB294 \uC900\uBE44 \uC911\uC774\uC5D0\uC694."))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 0" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uD559\uACFC\uBA85\uC73C\uB85C \uAC80\uC0C9", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 } }, "\uAC1C\uC124 \uD559\uACFC ", depts === null ? "" : filtered.length), deptMeta && deptMeta.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginBottom: 10 } }, deptMeta.note), depts === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 14, style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 32 }))) : depts.length === 0 ? /* @__PURE__ */ React.createElement(Card, { padding: 20 }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6 } }, "\uC774 \uB300\uD559\uC740 \uD559\uACFC \uB370\uC774\uD130\uAC00 \uC544\uC9C1 \uB9E4\uCE6D\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694. \uC2E0\uC0DD \uB300\uD559\xB7\uBD84\uAD50\xB7\uB300\uD559\uC6D0 \uC911\uC2EC \uB300\uD559\uC774\uAC70\uB098 \uACF5\uC2DC\uC5D0 \uB2E4\uB978 \uC774\uB984\uC73C\uB85C \uB4F1\uB85D\uB410\uC744 \uC218 \uC788\uC5B4\uC694. \uB300\uD559 \uC785\uD559\uCC98\uC5D0\uC11C \uCD5C\uC2E0 \uBAA8\uC9D1\uC694\uAC15\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.")) : filtered.length === 0 ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(IcSearch, { size: 20 }), title: "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694", body: "\uB2E4\uB978 \uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9\uD574\uBCF4\uC138\uC694." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, filtered.slice(0, 200).map((d) => /* @__PURE__ */ React.createElement(Card, { key: d.id, padding: 14 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 32, borderRadius: 10, background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IcGraduation, { size: 16, color: "var(--fg-muted)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, d.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)" } }, [d.college, d.track, d.degree].filter(Boolean).join(" \xB7 "))), d.track && /* @__PURE__ */ React.createElement(Chip, { tone: d.track === "\uC608\uCCB4\uB2A5" ? "warning" : d.track === "\uC790\uC5F0" ? "success" : "brand", size: "sm" }, d.track)))))));
}
function Stat({ label, value }) {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 17, fontWeight: 800, color: "var(--fg-strong)" } }, value), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--fg-muted)", marginTop: 2 } }, label));
}
function DepartmentDetail({ go }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uD559\uACFC \uC815\uBCF4", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("admissions-univ") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcHeart, { size: 20 }), ariaLabel: "\uAD00\uC2EC\uD559\uACFC" }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 8, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcGraduation, { size: 22 }),
      title: "\uD559\uACFC\uB97C \uBA3C\uC800 \uC120\uD0DD\uD574\uC8FC\uC138\uC694",
      body: "\uB300\uD559 \uD654\uBA74\uC5D0\uC11C \uD559\uACFC\uB97C \uACE0\uB974\uBA74 \uBAA8\uC9D1\xB7\uC804\uD615 \uC815\uBCF4\uB97C \uBCF4\uC5EC\uB4DC\uB824\uC694. \uC77C\uBD80 \uD559\uACFC\uB294 \uACF5\uC2DC \uB370\uC774\uD130\uAC00 \uC900\uBE44\uB418\uB294 \uB300\uB85C \uCD94\uAC00\uB3FC\uC694.",
      action: /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", onClick: () => go("admissions-univ") }, "\uB300\uD559\xB7\uD559\uACFC \uBCF4\uAE30")
    }
  )), /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "purple", size: "sm", leading: /* @__PURE__ */ React.createElement(IcSparkles, { size: 11 }), style: { marginBottom: 8 } }, "AI \uC785\uC2DC \uBD84\uC11D"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 6 }, className: "kr-heading" }, "\uB0B4 \uC131\uC801\uC73C\uB85C \uC774 \uD559\uACFC\uAE4C\uC9C0 \uC5BC\uB9C8\uB098 \uB354 \uCC44\uC6CC\uC57C \uD560\uAE4C\uC694?"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-muted)", marginBottom: 14, lineHeight: 1.5 }, className: "kr-heading" }, "\uCD5C\uADFC \uBAA8\uC758\uACE0\uC0AC 4\uD68C + \uB0B4\uC2E0 + AI \uC9C4\uB85C\uC0C1\uB2F4\uC744 \uC885\uD569\uD574 \uD604\uC2E4\uC801 \uC9C0\uC6D0\uAD8C\uC744 \uBD84\uC11D\uD574\uB4DC\uB824\uC694."), /* @__PURE__ */ React.createElement(Button, { variant: "primary", size: "md", full: true, trailing: /* @__PURE__ */ React.createElement(IcArrowRight, { size: 16 }), onClick: () => go("admissions-analysis") }, "\uBD84\uC11D \uACB0\uACFC \uBCF4\uAE30")), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 10, fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, '\uC785\uC2DC \uC815\uBCF4\uB294 \uB9E4\uB144 \uBCC0\uACBD\uB429\uB2C8\uB2E4. \uCD5C\uC885 \uC9C0\uC6D0 \uACB0\uC815 \uC804 \uBC18\uB4DC\uC2DC \uD574\uB2F9 \uB300\uD559 \uC785\uD559\uCC98 \uACF5\uC2DD \uC815\uBCF4\uB97C \uD655\uC778\uD558\uC138\uC694. \uB370\uC774\uD130 \uC2E0\uB8B0\uB3C4\uAC00 "\uCD94\uC815"\uC778 \uD56D\uBAA9\uC740 \uACF5\uC2DC\uB418\uC9C0 \uC54A\uC740 \uC218\uCE58\uB97C \uC778\uC811 \uD559\uACFC\xB7\uC804\uB144\uB3C4 \uD2B8\uB80C\uB4DC\uB85C \uCD94\uC815\uD55C \uAC12\uC774\uC5D0\uC694.')));
}
function AdmissionsAnalysis({ go }) {
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC785\uC2DC \uBD84\uC11D", leading: /* @__PURE__ */ React.createElement(BackButton, { onClick: () => go("admissions-dept") }), trailing: /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcDownload, { size: 20 }), ariaLabel: "\uC800\uC7A5" }) }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 24px" } }, /* @__PURE__ */ React.createElement(Card, { padding: 20, style: { background: "linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)", color: "#fff", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm", style: { background: "rgba(255,255,255,0.18)", color: "#fff", marginBottom: 8 } }, "\uB098\uC758 \uBAA9\uD45C"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px" }, className: "kr-heading" }, "\uD64D\uC775\uB300\uD559\uAD50 \uB514\uC9C0\uD138\uCF58\uD150\uCE20\uB514\uC790\uC778\uD559\uACFC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, marginTop: 2 } }, "\uC218\uC2DC \xB7 \uD559\uC0DD\uBD80\uC885\uD569\uC804\uD615 \uAE30\uC900"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    marginTop: 18,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85 } }, "\uD604\uC2E4 \uAC00\uB2A5\uC131"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 24, fontWeight: 800, marginTop: 2 } }, "\uC801\uC815\uAD8C")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 32, background: "rgba(255,255,255,0.2)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.85 } }, "\uBD84\uC11D \uC2E0\uB8B0\uB3C4"), /* @__PURE__ */ React.createElement("div", { className: "num", style: { fontSize: 18, fontWeight: 700, marginTop: 2 } }, "\uC911\uAC04 \xB7 \uB370\uC774\uD130 70%")))), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uD604\uC7AC \uC131\uC801 \uC694\uC57D",
      tone: "info",
      body: /* @__PURE__ */ React.createElement("div", null, "\uCD5C\uADFC \uBAA8\uC758\uACE0\uC0AC 4\uD68C \uD3C9\uADE0: ", /* @__PURE__ */ React.createElement("strong", null, "\uAD6D\uC5B4 91 \xB7 \uC218\uD559 82 \xB7 \uC601\uC5B4 1\uB4F1\uAE09 \xB7 \uD0D0\uAD6C 84/82"), /* @__PURE__ */ React.createElement("br", null), "\uB0B4\uC2E0 2\uD559\uB144 \uD3C9\uADE0: ", /* @__PURE__ */ React.createElement("strong", null, "2.4\uB4F1\uAE09"), ", \uBBF8\uC220 \uAD00\uB828 \uD65C\uB3D9 \uB204\uC801 8\uAC74.")
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uBAA9\uD45C \uD559\uACFC \uC785\uC2DC \uAE30\uC900",
      tone: "purple",
      body: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uC785\uD559\uC790 \uD3C9\uADE0 ", /* @__PURE__ */ React.createElement("strong", null, "\uB0B4\uC2E0 1.9\uB4F1\uAE09"), ", 70% \uCEF7 ", /* @__PURE__ */ React.createElement("strong", null, "2.3\uB4F1\uAE09"), ". \uC2E4\uAE30 \uC804\uD615 \uBE44\uC911\uC774 \uB192\uC544 \uBBF8\uC220 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uAC00\uC0B0\uC810\uC774 \uD070 \uD559\uACFC\uC608\uC694.")
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uBD80\uC871\uD55C \uC601\uC5ED",
      tone: "warning",
      body: /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\uB0B4\uC2E0 0.5\uB4F1\uAE09 \uCC28\uC774"), " \u2014 \uD559\uC0DD\uBD80\uC885\uD569 1.9 vs \uD604\uC7AC 2.4"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\uC218\uD559 \uD45C\uC900\uC810\uC218"), " \u2014 \uC785\uD559\uC790 \uD3C9\uADE0 \uB300\uBE44 -8\uC810"), /* @__PURE__ */ React.createElement("li", null, "\uC2E4\uAE30 \uD3EC\uD2B8\uD3F4\uB9AC\uC624 \uBBF8\uC815. \uBBF8\uC220\uD559\uC6D0\xB7\uB3D9\uC544\uB9AC \uC791\uD488 \uC815\uB9AC \uD544\uC694"))
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uD544\uC694 \uC810\uC218 / \uB4F1\uAE09 \uCD94\uC815",
      tone: "brand",
      body: /* @__PURE__ */ React.createElement(React.Fragment, null, "\uD559\uC0DD\uBD80\uC885\uD569 \uC9C4\uD559 \uAC00\uB2A5 \uB77C\uC778\uAE4C\uC9C0 ", /* @__PURE__ */ React.createElement("strong", null, "\uB0B4\uC2E0 0.5\uB4F1\uAE09 \uC0C1\uD5A5"), "\uC774 \uD544\uC694\uD574\uC694. 3\uD559\uB144 1\uD559\uAE30 \uD3C9\uADE0\uC774 2.0~2.1\uC744 \uC720\uC9C0\uD558\uBA74 \uCDA9\uBD84\uD788 \uB3C4\uC804 \uAC00\uB2A5\uAD8C\uC5D0 \uB4E4\uC5B4\uC694.")
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uD604\uC2E4\uC801\uC778 \uC9C0\uC6D0\uAD8C",
      tone: "success",
      body: /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\uC548\uC815\uAD8C"), ": \uC11C\uC6B8\uC5EC\uB300 \uC2DC\uB514\uACFC, \uBA85\uC9C0\uB300 \uC2DC\uB514\uACFC"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\uC801\uC815\uAD8C"), ": \uD64D\uC775\uB300 DCD(\uD604\uC7AC \uBAA9\uD45C), \uC11C\uC6B8\uACFC\uAE30\uB300 \uB514\uC790\uC778"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\uB3C4\uC804\uAD8C"), ": \uD55C\uC608\uC885 \uC601\uC0C1\uC774\uB860\uACFC, \uC774\uD654\uC5EC\uB300 \uC2DC\uB514\uACFC"))
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uB2E4\uC74C 4\uC8FC \uD559\uC2B5 \uC6B0\uC120\uC21C\uC704",
      tone: "mint",
      body: /* @__PURE__ */ React.createElement("ol", { style: { margin: 0, paddingLeft: 16, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("li", null, "\uC218\uD559 II \uBBF8\uC801\uBD84 \uAE30\uBCF8 \uAC1C\uB150 \uBCF5\uC2B5 (\uC8FC 3\uD68C 90\uBD84)"), /* @__PURE__ */ React.createElement("li", null, "\uD0D0\uAD6C 1\uACFC\uBAA9 \uC2E4\uB825\uC9C4\uB2E8 + \uC57D\uC810 \uB2E8\uC6D0 \uBCF4\uCDA9"), /* @__PURE__ */ React.createElement("li", null, "\uBBF8\uC220 \uD3EC\uD2B8\uD3F4\uB9AC\uC624: \uC791\uD488 3\uAC1C \uD68C\uACE0 + 1\uAC1C \uC2E0\uADDC"), /* @__PURE__ */ React.createElement("li", null, "5\uC6D4 \uBAA8\uC758\uACE0\uC0AC \uD6C4 \uBD84\uC11D \u2192 \uC785\uC2DC \uB77C\uC778 \uC7AC\uC870\uC815"))
    }
  ), /* @__PURE__ */ React.createElement(
    AnalysisCard,
    {
      title: "\uC120\uC0DD\uB2D8\uACFC \uC0C1\uB2F4\uD558\uBA74 \uC88B\uC740 \uC9C8\uBB38",
      tone: "neutral",
      body: /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 16, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("li", null, "\uD559\uC0DD\uBD80\uC885\uD569 \uC804\uD615 \uB300\uBE44 \uBE44\uAD50\uACFC \uD65C\uB3D9 \uC810\uAC80"), /* @__PURE__ */ React.createElement("li", null, "3\uD559\uB144 1\uD559\uAE30 \uB0B4\uC2E0 \uC2DC\uBBAC\uB808\uC774\uC158"), /* @__PURE__ */ React.createElement("li", null, "\uC2E4\uAE30 \uBE44\uC911\uC774 \uB192\uC740 \uB2E4\uB978 \uD559\uACFC\uC640\uC758 \uC9C4\uB85C \uBE44\uAD50"))
    }
  ), /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "md", full: true, leading: /* @__PURE__ */ React.createElement(IcMessage, { size: 16 }), style: { marginTop: 4, marginBottom: 12 }, onClick: () => go("ai-counseling") }, "AI \uC0C1\uB2F4\uC5D0\uC11C \uB354 \uAD6C\uCCB4\uC801\uC73C\uB85C \uC774\uC5B4\uAC00\uAE30"), /* @__PURE__ */ React.createElement("div", { style: { padding: 14, background: "var(--bg-muted)", borderRadius: 10, fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.55 }, className: "kr-heading" }, "\uC774 \uBD84\uC11D\uC740 \uD559\uC0DD\uC758 \uD604\uC7AC \uB370\uC774\uD130\uC640 \uACF5\uC2DD \uC785\uC2DC \uC815\uBCF4\uB97C \uC885\uD569\uD55C \uCC38\uACE0 \uC790\uB8CC\uC608\uC694. \uCD5C\uC885 \uC9C0\uC6D0 \uACB0\uC815\uC740 \uD559\uC0DD\xB7\uBCF4\uD638\uC790\xB7\uB2F4\uC784\uAD50\uC0AC \uC0C1\uB2F4\uC744 \uAC70\uCCD0 \uACB0\uC815\uD574\uC8FC\uC138\uC694. \uC0C8\uB85C\uC6B4 \uC131\uC801\uC774 \uC785\uB825\uB418\uBA74 \uC790\uB3D9\uC73C\uB85C \uC7AC\uBD84\uC11D\uB3FC\uC694.")));
}
function AnalysisCard({ title, body, tone = "neutral" }) {
  const colors = {
    info: { bg: "var(--info-bg)", border: "#D1E1FA", accent: "var(--brand-600)" },
    purple: { bg: "var(--accent-purple-bg)", border: "#E2D6FF", accent: "var(--accent-purple)" },
    warning: { bg: "var(--warning-bg)", border: "#FBE0A2", accent: "var(--warning)" },
    brand: { bg: "var(--brand-50)", border: "#C9DDFA", accent: "var(--brand-600)" },
    success: { bg: "var(--success-bg)", border: "#C8E5D2", accent: "var(--success)" },
    mint: { bg: "var(--accent-mint-bg)", border: "#A9E7D5", accent: "var(--accent-mint)" },
    neutral: { bg: "var(--bg-surface)", border: "var(--line)", accent: "var(--fg-muted)" }
  }[tone];
  return /* @__PURE__ */ React.createElement(Card, { padding: 16, style: { marginBottom: 8, background: colors.bg, border: `1px solid ${colors.border}`, boxShadow: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 4, height: 4, borderRadius: "50%", background: colors.accent } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: colors.accent, letterSpacing: "-0.1px" } }, title)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--fg-default)", lineHeight: 1.55 }, className: "kr-heading" }, body));
}
async function addToCalendar(ev) {
  if (!window.__isLoggedIn || !window.__isLoggedIn()) {
    alert("\uB85C\uADF8\uC778 \uD6C4 \uC774\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.");
    return;
  }
  try {
    const res = await window.__apiFetch("/calendar/events", { method: "POST", body: JSON.stringify(ev) });
    if (res && res.meta && res.meta.idempotent) alert("\uC774\uBBF8 \uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00\uB41C \uC77C\uC815\uC774\uC5D0\uC694.");
    else alert("\uCE98\uB9B0\uB354\uC5D0 \uCD94\uAC00\uD588\uC5B4\uC694! \uCE98\uB9B0\uB354 \uBA54\uB274\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.");
  } catch (e) {
    alert(e && e.body && e.body.message || "\uCE98\uB9B0\uB354 \uCD94\uAC00\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.");
  }
}
function VolunteersScreen({ go }) {
  const [q, setQ] = React.useState("");
  const [region, setRegion] = React.useState("\uC804\uCCB4");
  const [list, setList] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const V_PAGE_SIZE = 10;
  const REGIONS_V = ["\uC804\uCCB4", "\uC11C\uC6B8", "\uBD80\uC0B0", "\uB300\uAD6C", "\uC778\uCC9C", "\uAD11\uC8FC", "\uB300\uC804", "\uC6B8\uC0B0", "\uACBD\uAE30", "\uAC15\uC6D0", "\uCDA9\uBD81", "\uCDA9\uB0A8", "\uC804\uBD81", "\uC804\uB0A8", "\uACBD\uBD81", "\uACBD\uB0A8", "\uC81C\uC8FC"];
  const load = React.useCallback(async () => {
    setList(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (region !== "\uC804\uCCB4") params.set("region", region);
      params.set("limit", "50");
      const res = await window.__apiFetch("/volunteers?" + params.toString(), { method: "GET" });
      setList(res.data || []);
    } catch (e) {
      setList([]);
    }
  }, [q, region]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  React.useEffect(() => {
    setPage(1);
  }, [q, region]);
  const vTotal = list ? list.length : 0;
  const vTotalPages = Math.max(1, Math.ceil(vTotal / V_PAGE_SIZE));
  const vPageItems = list ? list.slice((page - 1) * V_PAGE_SIZE, page * V_PAGE_SIZE) : null;
  const vPageWindow = (() => {
    const w = [];
    let s = Math.max(1, page - 2), e = Math.min(vTotalPages, s + 4);
    s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) w.push(i);
    return w;
  })();
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uBD09\uC0AC\uD65C\uB3D9 \uCC3E\uAE30", subtitle: "\uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uBD09\uC0AC\uB97C \uCE98\uB9B0\uB354\uC5D0 \uB2F4\uC544\uB450\uC138\uC694. \uC5EC\uAE30\uC11C\uB294 \uBAA8\uC9D1 \uC815\uBCF4\uB97C \uBCF4\uC5EC\uB4DC\uB9AC\uB294 \uACF3\uC774\uB77C, \uC2E4\uC81C \uC2E0\uCCAD\uC740 \uD574\uB2F9 \uBD09\uC0AC\uCC98(\uC13C\uD130)\uC5D0 \uC9C1\uC811 \uC5F0\uB77D\uD574 \uC9C4\uD589\uD574 \uC8FC\uC138\uC694 \u{1F60A}" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 16px 0" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uBD09\uC0AC \uD0A4\uC6CC\uB4DC (\uC608: \uB3C4\uC11C\uAD00, \uB178\uC778\uBCF5\uC9C0)", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 0" } }, /* @__PURE__ */ React.createElement(FilterRow, { label: "\uC9C0\uC5ED", items: REGIONS_V, active: region, onChange: setRegion })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 16px 24px" } }, list !== null && vTotal > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 } }, "\uCD1D ", vTotal, "\uAC1C \xB7 ", page, "/", vTotalPages, "\uD398\uC774\uC9C0"), list === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 40 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uBD09\uC0AC\uAC00 \uC5C6\uC5B4\uC694. \uB2E4\uB978 \uC9C0\uC5ED\xB7\uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9\uD574\uBCF4\uC138\uC694.") : vPageItems.map((v) => /* @__PURE__ */ React.createElement(Card, { key: v.id, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 10, background: "var(--accent-mint-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IcHeart, { size: 18, color: "var(--accent-mint)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, v.title), v.youthEligible && /* @__PURE__ */ React.createElement(Chip, { tone: "mint", size: "sm" }, "\uCCAD\uC18C\uB144 \uAC00\uB2A5"), v.status === "\uBAA8\uC9D1\uC911" && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uBAA8\uC9D1\uC911")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 3 } }, [v.center, v.region].filter(Boolean).join(" \xB7 ")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 } }, v.activityType && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, v.activityType), v.termType && /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, v.termType), v.recruitCount != null && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uBAA8\uC9D1 ", v.recruitCount, "\uBA85")), v.place && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 6 } }, "\u{1F4CD} ", v.place), v.contact && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--brand-600)", marginTop: 2 } }, "\u260E ", v.contact), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "brandSoft", size: "sm", leading: /* @__PURE__ */ React.createElement(IcCalendar, { size: 13 }), onClick: () => addToCalendar({
    title: "[\uBD09\uC0AC] " + v.title,
    category: "volunteer",
    startsAt: new Date(Date.now() + 7 * 864e5).toISOString(),
    location: v.place || v.region || "",
    contact: v.contact || "",
    refType: "volunteer",
    refId: String(v.id)
  }) }, "\uCE98\uB9B0\uB354 \uCD94\uAC00")))))), list !== null && vTotalPages > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(PageBtn, { disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)) }, "\uC774\uC804"), vPageWindow[0] > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(1) }, "1"), vPageWindow[0] > 2 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026")), vPageWindow.map((n) => /* @__PURE__ */ React.createElement(PageBtn, { key: n, active: n === page, onClick: () => setPage(n) }, n)), vPageWindow[vPageWindow.length - 1] < vTotalPages && /* @__PURE__ */ React.createElement(React.Fragment, null, vPageWindow[vPageWindow.length - 1] < vTotalPages - 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026"), /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(vTotalPages) }, vTotalPages)), /* @__PURE__ */ React.createElement(PageBtn, { disabled: page >= vTotalPages, onClick: () => setPage((p) => Math.min(vTotalPages, p + 1)) }, "\uB2E4\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8, padding: "0 4px", lineHeight: 1.5 } }, "\u203B \uD65C\uB3D9 \uC7A5\uC18C\xB7\uC720\uD615\xB7\uBAA8\uC9D1\uC778\uC6D0\uC740 VMS \uBAA8\uC9D1\uACF5\uACE0 \uAE30\uC900\uC774\uC5D0\uC694. \uAD6C\uCCB4\uC801 \uD65C\uB3D9 \uC77C\uC790\xB7\uC2DC\uAC04\xB7\uBD09\uC0AC\uC2DC\uAC04\uC740 VMS(1365)\uC5D0\uC11C \uC2E0\uCCAD\uD560 \uB54C \uD655\uC778\uB3FC\uC694.")));
}
function ScholarshipsScreen({ go }) {
  const [q, setQ] = React.useState("");
  const [list, setList] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const S_PAGE_SIZE = 10;
  const load = React.useCallback(async () => {
    setList(null);
    try {
      const res = await window.__apiFetch("/scholarships?" + (q.trim() ? "q=" + encodeURIComponent(q.trim()) + "&" : "") + "limit=50", { method: "GET" });
      setList(res.data || []);
    } catch (e) {
      setList([]);
    }
  }, [q]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  React.useEffect(() => {
    setPage(1);
  }, [q]);
  const sTotal = list ? list.length : 0;
  const sTotalPages = Math.max(1, Math.ceil(sTotal / S_PAGE_SIZE));
  const sPageItems = list ? list.slice((page - 1) * S_PAGE_SIZE, page * S_PAGE_SIZE) : null;
  const sPageWindow = (() => {
    const w = [];
    let s = Math.max(1, page - 2), e = Math.min(sTotalPages, s + 4);
    s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) w.push(i);
    return w;
  })();
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uC7A5\uD559\uAE08 \uCC3E\uAE30", subtitle: "\uD55C\uAD6D\uC7A5\uD559\uC7AC\uB2E8\xB7\uC9C0\uC790\uCCB4\xB7\uAE30\uC5C5 \uC7A5\uD559\uAE08\uC744 \uBAA8\uC544 \uBCF4\uC5EC\uB4DC\uB824\uC694. \uC2E4\uC81C \uC2E0\uCCAD\xB7\uC774\uC6A9\uC740 \uD55C\uAD6D\uC7A5\uD559\uC7AC\uB2E8(kosaf.go.kr)\uC774\uB098 \uAC01 \uC6B4\uC601\uAE30\uAD00 \uC0AC\uC774\uD2B8\uC5D0\uC11C \uC9C4\uD589\uD574 \uC8FC\uC138\uC694 \u{1F60A}" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 16px 0" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uC7A5\uD559\uAE08 \uD0A4\uC6CC\uB4DC (\uC608: \uC800\uC18C\uB4DD, \uC774\uACF5\uACC4, \uC9C0\uC5ED)", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 16px 24px" } }, list !== null && sTotal > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 } }, "\uCD1D ", sTotal, "\uAC1C \xB7 ", page, "/", sTotalPages, "\uD398\uC774\uC9C0"), list === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 40 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694.") : sPageItems.map((s) => /* @__PURE__ */ React.createElement(Card, { key: s.id, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, s.productName), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 3 } }, [s.organization, s.productType, s.supportType].filter(Boolean).join(" \xB7 ")), s.amount && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--brand-600)", marginTop: 6, fontWeight: 600, lineHeight: 1.5 } }, String(s.amount).slice(0, 120)), s.target && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 4, lineHeight: 1.5 } }, "\uB300\uC0C1: ", s.target.slice(0, 80)), s.applyPeriod && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement(Chip, { tone: "neutral", size: "sm" }, "\uC2E0\uCCAD ", s.applyPeriod)))), list !== null && sTotalPages > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(PageBtn, { disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)) }, "\uC774\uC804"), sPageWindow[0] > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(1) }, "1"), sPageWindow[0] > 2 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026")), sPageWindow.map((n) => /* @__PURE__ */ React.createElement(PageBtn, { key: n, active: n === page, onClick: () => setPage(n) }, n)), sPageWindow[sPageWindow.length - 1] < sTotalPages && /* @__PURE__ */ React.createElement(React.Fragment, null, sPageWindow[sPageWindow.length - 1] < sTotalPages - 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026"), /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => setPage(sTotalPages) }, sTotalPages)), /* @__PURE__ */ React.createElement(PageBtn, { disabled: page >= sTotalPages, onClick: () => setPage((p) => Math.min(sTotalPages, p + 1)) }, "\uB2E4\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8, padding: "0 4px" } }, "\u203B \uAD6C\uCCB4 \uC2E0\uCCAD \uC870\uAC74\xB7\uC11C\uB958\uB294 \uC6B4\uC601\uAE30\uAD00 \uACF5\uC9C0\uB85C \uAF2D \uD655\uC778\uD558\uC138\uC694.")));
}
function ForeignUnivScreen({ go, embedded = false }) {
  const [country, setCountry] = React.useState("US");
  const [q, setQ] = React.useState("");
  const [list, setList] = React.useState(null);
  const [openId, setOpenId] = React.useState(null);
  const [detailCache, setDetailCache] = React.useState({});
  const [page, setPage] = React.useState(1);
  const FU_PAGE_SIZE = 15;
  const toggleDetail = React.useCallback(async (u) => {
    if (openId === u.id) {
      setOpenId(null);
      return;
    }
    setOpenId(u.id);
    if (detailCache[u.id] !== void 0) return;
    try {
      const res = await window.__apiFetch("/foreign-universities/" + encodeURIComponent(u.id), { method: "GET" });
      setDetailCache((prev) => ({ ...prev, [u.id]: res && res.data && res.data.detail || null }));
    } catch (e) {
      setDetailCache((prev) => ({ ...prev, [u.id]: null }));
    }
  }, [openId, detailCache]);
  const COUNTRIES = [{ c: "US", n: "\uBBF8\uAD6D" }, { c: "GB", n: "\uC601\uAD6D" }, { c: "JP", n: "\uC77C\uBCF8" }, { c: "DE", n: "\uB3C5\uC77C" }, { c: "FR", n: "\uD504\uB791\uC2A4" }, { c: "CN", n: "\uC911\uAD6D" }, { c: "AU", n: "\uD638\uC8FC" }, { c: "CA", n: "\uCE90\uB098\uB2E4" }];
  const load = React.useCallback(async () => {
    setList(null);
    setOpenId(null);
    try {
      const res = await window.__apiFetch("/foreign-universities?country=" + country + (q.trim() ? "&q=" + encodeURIComponent(q.trim()) : "") + "&limit=100", { method: "GET" });
      setList(res.data || []);
    } catch (e) {
      setList([]);
    }
  }, [country, q]);
  React.useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);
  React.useEffect(() => {
    setPage(1);
  }, [country, q]);
  const fmtUSD = (n) => n != null ? "$" + Number(n).toLocaleString() : null;
  const pct = (n) => n != null ? Math.round(n * 100) + "%" : null;
  const total = list ? list.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / FU_PAGE_SIZE));
  const pageItems = list ? list.slice((page - 1) * FU_PAGE_SIZE, page * FU_PAGE_SIZE) : null;
  const fuPageWindow = (() => {
    const w = [];
    let s = Math.max(1, page - 2), e = Math.min(totalPages, s + 4);
    s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) w.push(i);
    return w;
  })();
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-canvas)", minHeight: embedded ? 0 : "100%" } }, !embedded && /* @__PURE__ */ React.createElement(ScreenHeader, { title: "\uD574\uC678\uB300\uD559", subtitle: "\uD574\uC678 \uC9C4\uD559\uC744 \uC0DD\uAC01\uD55C\uB2E4\uBA74 \u2014 \uD559\uBE44\xB7\uC878\uC5C5\uB960\xB7\uC911\uC704\uC18C\uB4DD\uAE4C\uC9C0" }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 16px 0" } }, /* @__PURE__ */ React.createElement(TextInput, { value: q, onChange: setQ, placeholder: "\uB300\uD559\uBA85 \uAC80\uC0C9 (\uAD6D\uBB38/\uC601\uBB38)", leading: /* @__PURE__ */ React.createElement(IcSearch, { size: 16 }) })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px 0", display: "flex", gap: 6, flexWrap: "wrap" } }, COUNTRIES.map((x) => /* @__PURE__ */ React.createElement("button", { key: x.c, onClick: () => setCountry(x.c), style: { border: "none", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", background: country === x.c ? "var(--brand-500)" : "var(--bg-surface)", color: country === x.c ? "#fff" : "var(--fg-default)" } }, x.n))), country !== "US" && /* @__PURE__ */ React.createElement("div", { style: { margin: "12px 16px 0", padding: 12, background: "var(--info-bg)", borderRadius: 10, fontSize: 12, color: "var(--brand-600)", lineHeight: 1.5 }, className: "kr-heading" }, "\u2139\uFE0F \uC774 \uAD6D\uAC00\uB294 ", /* @__PURE__ */ React.createElement("b", null, "\uB300\uD559 \uC774\uB984(\uD45C\uC900 \uAD6D\uBB38\xB7\uC601\uBB38 \uBA85\uCE6D)"), "\uB9CC \uC81C\uACF5\uB3FC\uC694. \uD559\uBE44\xB7\uC785\uD559\uB960\xB7\uC878\uC5C5\uC18C\uB4DD \uAC19\uC740 \uC138\uBD80 \uD1B5\uACC4\uB294 \uC815\uBD80\uAC00 \uBB34\uB8CC\uB85C \uACF5\uAC1C\uD55C \uB370\uC774\uD130\uAC00 \uC788\uB294 ", /* @__PURE__ */ React.createElement("b", null, "\uBBF8\uAD6D"), "\uB9CC \uC81C\uACF5\uB429\uB2C8\uB2E4(\uBBF8 \uAD50\uC721\uBD80 College Scorecard). \uB2E4\uB978 \uAD6D\uAC00\uB294 \uACF5\uAC1C API\uAC00 \uB9C8\uB828\uB418\uBA74 \uCD94\uAC00\uD560\uAC8C\uC694."), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 16px 24px" } }, list !== null && total > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 } }, "\uCD1D ", total, "\uAC1C \xB7 ", page, "/", totalPages, "\uD398\uC774\uC9C0"), list === null ? [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Card, { key: i, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Skeleton, { height: 40 }))) : list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: 24, textAlign: "center", color: "var(--fg-muted)", fontSize: 13 } }, "\uD574\uB2F9 \uAD6D\uAC00 \uB300\uD559 \uC815\uBCF4\uAC00 \uC5C6\uC5B4\uC694.") : pageItems.map((u) => {
    const open = openId === u.id;
    const fetched = detailCache[u.id];
    const d = open && fetched ? fetched : u.detail || {};
    const detailLoading = open && fetched === void 0;
    return /* @__PURE__ */ React.createElement(Card, { key: u.id, padding: 14, style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--fg-strong)" } }, u.nameKo), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-muted)", marginTop: 2 } }, u.nameEn || "", u.country && u.country.ko ? " \xB7 " + u.country.ko : "", d.city ? " \xB7 " + [d.city, d.state].filter(Boolean).join(", ") : "")), u.hasDetail && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC0C1\uC138\uC815\uBCF4")), u.hasDetail ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 } }, d.admissionRate != null && /* @__PURE__ */ React.createElement(Chip, { tone: "brand", size: "sm" }, "\uC785\uD559\uB960 ", pct(d.admissionRate)), d.tuitionOutState != null && /* @__PURE__ */ React.createElement(Chip, { tone: "warning", size: "sm" }, "\uD559\uBE44 ", fmtUSD(d.tuitionOutState), "/\uB144"), d.medianEarnings != null && /* @__PURE__ */ React.createElement(Chip, { tone: "success", size: "sm" }, "\uC878\uC5C5\uD6C4 \uC911\uC704\uC18C\uB4DD ", fmtUSD(d.medianEarnings))), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleDetail(u), style: { border: "none", background: "none", color: "var(--brand-600)", fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10, padding: 0 } }, open ? "\uC811\uAE30 \u25B2" : "\uC790\uC138\uD788 \uBCF4\uAE30 \u25BC"), open && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line-subtle)" } }, detailLoading && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginBottom: 8 } }, "\uC0C1\uC138 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 } }, /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC785\uD559\uB960", value: pct(d.admissionRate) }), /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC878\uC5C5\uB960", value: pct(d.completionRate) }), /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC7AC\uD559\uC0DD \uC218", value: d.studentSize != null ? Number(d.studentSize).toLocaleString() + "\uBA85" : null }), /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC878\uC5C5\uD6C4 \uC911\uC704\uC18C\uB4DD", value: fmtUSD(d.medianEarnings) }), /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC8FC\uB0B4 \uD559\uBE44", value: fmtUSD(d.tuitionInState) }), /* @__PURE__ */ React.createElement(DetailRow, { label: "\uC8FC\uC678/\uC720\uD559\uC0DD \uD559\uBE44", value: fmtUSD(d.tuitionOutState) })), [d.admissionRate, d.studentSize, d.tuitionOutState, d.medianEarnings, d.completionRate].filter((v) => v != null).length <= 1 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8 } }, "\u203B \uC774 \uB300\uD559\uC740 \uBBF8 \uAD50\uC721\uBD80\uC5D0 \uACF5\uAC1C\uB41C \uC138\uBD80 \uD1B5\uACC4\uAC00 \uC801\uC5B4\uC694(\uC18C\uADDC\uBAA8\xB7\uC2E0\uC124 \uB300\uD559\uC77C \uC218 \uC788\uC5B4\uC694). \uD559\uAD50 \uACF5\uC2DD \uC0AC\uC774\uD2B8\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694."))) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8 } }, "\uD45C\uC900 \uBA85\uCE6D \uC815\uBCF4\uC608\uC694. \uD559\uBE44\xB7\uC785\uD559 \uC0C1\uC138\uB294 \uBBF8\uAD6D(College Scorecard) \uB300\uD559\uC5D0\uC11C \uC81C\uACF5\uB3FC\uC694."));
  }), list !== null && totalPages > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(PageBtn, { disabled: page <= 1, onClick: () => {
    setPage((p) => Math.max(1, p - 1));
    setOpenId(null);
  } }, "\uC774\uC804"), fuPageWindow[0] > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => {
    setPage(1);
    setOpenId(null);
  } }, "1"), fuPageWindow[0] > 2 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026")), fuPageWindow.map((n) => /* @__PURE__ */ React.createElement(PageBtn, { key: n, active: n === page, onClick: () => {
    setPage(n);
    setOpenId(null);
  } }, n)), fuPageWindow[fuPageWindow.length - 1] < totalPages && /* @__PURE__ */ React.createElement(React.Fragment, null, fuPageWindow[fuPageWindow.length - 1] < totalPages - 1 && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-subtle)", fontSize: 12 } }, "\u2026"), /* @__PURE__ */ React.createElement(PageBtn, { onClick: () => {
    setPage(totalPages);
    setOpenId(null);
  } }, totalPages)), /* @__PURE__ */ React.createElement(PageBtn, { disabled: page >= totalPages, onClick: () => {
    setPage((p) => Math.min(totalPages, p + 1));
    setOpenId(null);
  } }, "\uB2E4\uC74C")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--fg-subtle)", marginTop: 8, padding: "0 4px" } }, "\u203B \uBBF8\uAD6D \uB300\uD559\uC740 College Scorecard, \uADF8 \uC678\uB294 \uD55C\uAD6D\uAD6D\uC81C\uAD50\uB958\uC7AC\uB2E8 \uD45C\uC900 \uBA85\uCE6D \uAE30\uC900\uC774\uC5D0\uC694.")));
}
function DetailRow({ label, value }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--fg-subtle)", fontSize: 11 } }, label), /* @__PURE__ */ React.createElement("div", { style: { color: value ? "var(--fg-strong)" : "var(--fg-subtle)", fontWeight: 700, marginTop: 2 } }, value || "\u2014"));
}
Object.assign(window, {
  AdmissionsHub,
  UniversityDetail,
  DepartmentDetail,
  AdmissionsAnalysis,
  VolunteersScreen,
  ScholarshipsScreen,
  ForeignUnivScreen,
  confidenceChip
});
