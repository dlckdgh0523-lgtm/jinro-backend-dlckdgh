function useFocusTrap(active, onEscape) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!active || !ref.current) return void 0;
    const node = ref.current;
    const prevFocused = document.activeElement;
    const sel = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusables = () => Array.from(node.querySelectorAll(sel)).filter((el) => el.offsetParent !== null);
    const first = focusables()[0];
    if (first) {
      try {
        first.focus();
      } catch (e) {
      }
    }
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEscape && onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0], lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      if (prevFocused && prevFocused.focus) {
        try {
          prevFocused.focus();
        } catch (e) {
        }
      }
    };
  }, [active]);
  return ref;
}
function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  full,
  leading,
  trailing,
  style,
  type = "button",
  loading = false
}) {
  const sizes = {
    sm: { h: 36, px: 14, fs: 13, fw: 600, r: 10 },
    md: { h: 44, px: 16, fs: 15, fw: 600, r: 12 },
    lg: { h: 52, px: 20, fs: 16, fw: 700, r: 14 },
    xl: { h: 56, px: 24, fs: 17, fw: 700, r: 14 }
  }[size];
  const variants = {
    primary: {
      bg: "var(--brand-500)",
      color: "#fff",
      hover: "var(--brand-600)",
      border: "transparent"
    },
    secondary: {
      bg: "var(--neutral-bg)",
      color: "var(--fg-strong)",
      hover: "#E8ECEF",
      border: "transparent"
    },
    ghost: {
      bg: "transparent",
      color: "var(--fg-default)",
      hover: "var(--bg-muted)",
      border: "transparent"
    },
    outline: {
      bg: "#fff",
      color: "var(--fg-strong)",
      hover: "var(--bg-muted)",
      border: "var(--line-strong)"
    },
    danger: {
      bg: "var(--danger)",
      color: "#fff",
      hover: "#B91C1C",
      border: "transparent"
    },
    brandSoft: {
      bg: "var(--brand-50)",
      color: "var(--brand-600)",
      hover: "var(--brand-100)",
      border: "transparent"
    }
  }[variant] || {};
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type,
      disabled: disabled || loading,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        height: sizes.h,
        padding: `0 ${sizes.px}px`,
        background: disabled ? "#E5E8EB" : hover ? variants.hover : variants.bg,
        color: disabled ? "var(--fg-disabled)" : variants.color,
        border: `1px solid ${disabled ? "#E5E8EB" : variants.border}`,
        borderRadius: sizes.r,
        fontSize: sizes.fs,
        fontWeight: sizes.fw,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: full ? "100%" : void 0,
        transition: `background ${"var(--t-fast)"} var(--ease-std), transform ${"var(--t-fast)"} var(--ease-std)`,
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        whiteSpace: "nowrap",
        ...style
      }
    },
    loading ? /* @__PURE__ */ React.createElement("span", { style: {
      width: 16,
      height: 16,
      borderRadius: "50%",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      animation: "spin 0.7s linear infinite",
      opacity: 0.7
    } }) : leading,
    children,
    trailing
  );
}
function Chip({ tone = "neutral", size = "md", children, leading, style }) {
  const tones = {
    neutral: { bg: "var(--neutral-bg)", fg: "var(--neutral-fg)" },
    info: { bg: "var(--info-bg)", fg: "var(--brand-600)" },
    success: { bg: "var(--success-bg)", fg: "var(--success)" },
    warning: { bg: "var(--warning-bg)", fg: "var(--warning)" },
    danger: { bg: "var(--danger-bg)", fg: "var(--danger)" },
    purple: { bg: "var(--accent-purple-bg)", fg: "var(--accent-purple)" },
    mint: { bg: "var(--accent-mint-bg)", fg: "var(--accent-mint)" },
    brand: { bg: "var(--brand-50)", fg: "var(--brand-600)" }
  }[tone] || {};
  const sizes = {
    sm: { h: 22, px: 8, fs: 11, fw: 600 },
    md: { h: 26, px: 10, fs: 12, fw: 600 },
    lg: { h: 30, px: 12, fs: 13, fw: 600 }
  }[size];
  return /* @__PURE__ */ React.createElement("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    height: sizes.h,
    padding: `0 ${sizes.px}px`,
    background: tones.bg,
    color: tones.fg,
    fontSize: sizes.fs,
    fontWeight: sizes.fw,
    borderRadius: 6,
    letterSpacing: "-0.1px",
    whiteSpace: "nowrap",
    ...style
  } }, leading, children);
}
function Card({ children, padding = 20, radius = 16, style, onClick, hoverable }) {
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick,
      onMouseEnter: () => hoverable && setHover(true),
      onMouseLeave: () => hoverable && setHover(false),
      style: {
        background: "var(--bg-surface)",
        borderRadius: radius,
        padding,
        boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-card)",
        cursor: onClick ? "pointer" : void 0,
        transition: "box-shadow var(--t-fast) var(--ease-std), transform var(--t-fast) var(--ease-std)",
        transform: hover ? "translateY(-2px)" : "none",
        ...style
      }
    },
    children
  );
}
function SectionCard({ title, subtitle, action, children, padding = 20, style }) {
  return /* @__PURE__ */ React.createElement(Card, { padding, style }, (title || action) && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: subtitle ? 4 : 16 } }, /* @__PURE__ */ React.createElement("div", null, title && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: "var(--fg-strong)" }, className: "kr-heading" }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 4 } }, subtitle)), action), subtitle && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16 } }, children), !subtitle && children);
}
function EmptyState({ icon, title, body, action }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "48px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12
  } }, icon && /* @__PURE__ */ React.createElement("div", { style: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--bg-muted)",
    color: "var(--fg-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  } }, icon), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--fg-strong)" } }, title), body && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", maxWidth: 280, lineHeight: 1.5 }, className: "kr-heading" }, body), action && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, action));
}
function Skeleton({ width = "100%", height = 16, radius = 8, style }) {
  return /* @__PURE__ */ React.createElement("div", { className: "skeleton", style: { width, height, borderRadius: radius, ...style } });
}
function ErrorState({ title = "\uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694", body, onRetry }) {
  return /* @__PURE__ */ React.createElement(
    EmptyState,
    {
      icon: /* @__PURE__ */ React.createElement(IcAlert, { size: 24 }),
      title,
      body: body || "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.",
      action: onRetry && /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "sm", leading: /* @__PURE__ */ React.createElement(IcRefresh, { size: 14 }), onClick: onRetry }, "\uB2E4\uC2DC \uC2DC\uB3C4")
    }
  );
}
function TextInput({ value, onChange, placeholder, type = "text", leading, trailing, error, style, autoFocus, onKeyDown, readOnly }) {
  const [focus, setFocus] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: 52,
    padding: "0 16px",
    background: "var(--bg-surface)",
    border: `1px solid ${error ? "var(--danger)" : focus ? "var(--brand-500)" : "var(--line-strong)"}`,
    borderRadius: 12,
    transition: "border-color var(--t-fast)",
    boxShadow: focus && !error ? "0 0 0 3px rgba(49,130,246,0.12)" : "none",
    ...style
  } }, leading && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-muted)" } }, leading), /* @__PURE__ */ React.createElement(
    "input",
    {
      type,
      value,
      autoFocus,
      readOnly,
      onChange: (e) => onChange && onChange(e.target.value),
      onKeyDown,
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      placeholder,
      style: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: 15,
        color: "var(--fg-strong)",
        minWidth: 0
      }
    }
  ), trailing);
}
function Textarea({ value, onChange, placeholder, rows = 3, error, style }) {
  const [focus, setFocus] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px 16px",
    background: "var(--bg-surface)",
    border: `1px solid ${error ? "var(--danger)" : focus ? "var(--brand-500)" : "var(--line-strong)"}`,
    borderRadius: 12,
    boxShadow: focus && !error ? "0 0 0 3px rgba(49,130,246,0.12)" : "none",
    ...style
  } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value,
      onChange: (e) => onChange && onChange(e.target.value),
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      placeholder,
      rows,
      style: {
        width: "100%",
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: 15,
        color: "var(--fg-strong)",
        fontFamily: "inherit",
        lineHeight: 1.5,
        background: "transparent"
      }
    }
  ));
}
function FormField({ label, hint, error, required, children, style }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, ...style } }, label && /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 600, color: "var(--fg-default)" } }, label, required && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--danger)", marginLeft: 4 } }, "*")), children, error && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--danger)" } }, error), hint && !error && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)" } }, hint));
}
function ScreenHeader({ title, leading, trailing, subtitle, large = false, help }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: large ? "8px 20px 16px" : "8px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 44 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, leading), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, trailing, help && typeof HelpButton !== "undefined" && /* @__PURE__ */ React.createElement(HelpButton, { pageId: help }))), title && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: large ? 28 : 20,
    fontWeight: 700,
    color: "var(--fg-strong)",
    marginTop: large ? 8 : 0,
    letterSpacing: "-0.4px"
  }, className: "kr-heading" }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)" }, className: "kr-heading" }, subtitle));
}
function BackButton({ onClick }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, "aria-label": "\uB4A4\uB85C", style: {
    width: 40,
    height: 40,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "var(--fg-strong)",
    marginLeft: -8
  } }, /* @__PURE__ */ React.createElement(IcChevronLeft, { size: 24 }));
}
function IconButton({ icon, onClick, badge, ariaLabel, size = 40, ...rest }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, "aria-label": ariaLabel, ...rest, style: {
    width: size,
    height: size,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "var(--fg-strong)",
    position: "relative"
  } }, icon, badge != null && badge > 0 && /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    padding: "0 4px",
    borderRadius: 999,
    background: "var(--danger)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--bg-surface)"
  } }, badge > 99 ? "99+" : badge));
}
function MobileBottomNav({ items, activeId, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "stretch",
    padding: "6px 4px 24px",
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid var(--line-subtle)"
  } }, items.map((it) => {
    const active = it.id === activeId;
    return /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => onChange(it.id), style: {
      flex: 1,
      border: "none",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      padding: "6px 0 4px",
      cursor: "pointer",
      color: active ? "var(--brand-500)" : "var(--fg-subtle)"
    } }, React.cloneElement(it.icon, { size: 22, strokeWidth: active ? 2.25 : 1.75 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: "-0.2px" } }, it.label));
  }));
}
function MetricCard({ label, value, delta, deltaTone = "success", icon, hint, style }) {
  return /* @__PURE__ */ React.createElement(Card, { padding: 18, style }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)" } }, label), icon && /* @__PURE__ */ React.createElement("div", { style: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "var(--brand-50)",
    color: "var(--brand-600)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  } }, icon)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "num", style: { fontSize: 24, fontWeight: 700, color: "var(--fg-strong)", letterSpacing: "-0.5px" } }, value), delta && /* @__PURE__ */ React.createElement(Chip, { tone: deltaTone, size: "sm", style: { height: 20 } }, delta)), hint && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--fg-subtle)", marginTop: 6 } }, hint));
}
function Avatar({ name, size = 36, color, src }) {
  const colors = ["#FFE2D6", "#D6F0FF", "#E6F5E0", "#FFE9D6", "#EDD9FF", "#FFE0E6", "#D9F2EC"];
  const fgColors = ["#A4441C", "#1957C2", "#256029", "#A1571A", "#5B2BAB", "#A02540", "#0F6651"];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;
  const bg = color || colors[idx];
  const fg = fgColors[idx];
  return /* @__PURE__ */ React.createElement("div", { style: {
    width: size,
    height: size,
    borderRadius: "50%",
    background: src ? `url(${src})` : bg,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: fg,
    fontSize: size * 0.4,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  } }, !src && name && name.slice(0, 1));
}
function BottomSheet({ open, onClose, title, children, maxHeight = "85%" }) {
  const trapRef = useFocusTrap(open, onClose);
  if (!open) return null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: {
    position: "absolute",
    inset: 0,
    background: "rgba(17,24,39,0.4)",
    animation: "fadeIn 200ms var(--ease-std)"
  } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "dialog", "aria-modal": "true", "aria-label": title || "\uC2DC\uD2B8", style: {
    position: "relative",
    background: "var(--bg-elevated)",
    borderRadius: "28px 28px 0 0",
    maxHeight,
    overflow: "auto",
    animation: "sheetIn 320ms var(--ease-toss)",
    boxShadow: "var(--shadow-pop)",
    paddingBottom: 24
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 4,
    background: "var(--line-strong)",
    borderRadius: 999,
    margin: "10px auto 8px"
  } }), title && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "8px 20px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)" } }, title), /* @__PURE__ */ React.createElement(IconButton, { icon: /* @__PURE__ */ React.createElement(IcX, { size: 20 }), onClick: onClose, ariaLabel: "\uB2EB\uAE30" })), children));
}
function ListRow({ leading, title, subtitle, trailing, onClick, divider = true, style }) {
  return /* @__PURE__ */ React.createElement("div", { onClick, style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    cursor: onClick ? "pointer" : void 0,
    borderBottom: divider ? "1px solid var(--line-subtle)" : "none",
    ...style
  } }, leading, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 600, color: "var(--fg-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--fg-muted)", marginTop: 2 } }, subtitle)), trailing);
}
function ProgressBar({ value, max = 100, height = 6, color = "var(--brand-500)" }) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /* @__PURE__ */ React.createElement("div", { style: {
    height,
    background: "var(--neutral-bg)",
    borderRadius: 999,
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: `${pct}%`,
    height: "100%",
    background: color,
    borderRadius: 999,
    transition: "width 360ms var(--ease-toss)"
  } }));
}
function Tabs({ items, activeId, onChange, variant = "pills" }) {
  if (variant === "underline") {
    return /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--line)"
    } }, items.map((it) => {
      const active = it.id === activeId;
      return /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => onChange(it.id), style: {
        border: "none",
        background: "transparent",
        padding: "12px 14px",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: active ? "var(--fg-strong)" : "var(--fg-muted)",
        borderBottom: `2px solid ${active ? "var(--brand-500)" : "transparent"}`,
        marginBottom: -1
      } }, it.label);
    }));
  }
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    padding: 4,
    gap: 2,
    background: "var(--neutral-bg)",
    borderRadius: 12
  } }, items.map((it) => {
    const active = it.id === activeId;
    return /* @__PURE__ */ React.createElement("button", { key: it.id, onClick: () => onChange(it.id), style: {
      border: "none",
      cursor: "pointer",
      background: active ? "var(--bg-surface)" : "transparent",
      color: active ? "var(--fg-strong)" : "var(--fg-muted)",
      padding: "8px 14px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
      transition: "all var(--t-fast) var(--ease-std)"
    } }, it.label);
  }));
}
function ConfirmDialog({ open, title, body, confirmLabel = "\uD655\uC778", cancelLabel = "\uCDE8\uC18C", onConfirm, onCancel, danger, reasonRequired }) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => {
    if (!open) setReason("");
  }, [open]);
  const trapRef = useFocusTrap(open, onCancel);
  if (!open) return null;
  const canConfirm = !reasonRequired || reason.trim().length >= 4;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  } }, /* @__PURE__ */ React.createElement("div", { onClick: onCancel, style: {
    position: "absolute",
    inset: 0,
    background: "rgba(17,24,39,0.5)",
    animation: "fadeIn 200ms var(--ease-std)"
  } }), /* @__PURE__ */ React.createElement("div", { ref: trapRef, role: "alertdialog", "aria-modal": "true", "aria-label": title, style: {
    position: "relative",
    width: "100%",
    maxWidth: 360,
    background: "var(--bg-elevated)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 280ms var(--ease-toss)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: "var(--fg-strong)", marginBottom: 8 }, className: "kr-heading" }, title), body && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.5, marginBottom: reasonRequired ? 12 : 20 }, className: "kr-heading" }, body), reasonRequired && /* @__PURE__ */ React.createElement(FormField, { label: "\uC0AC\uC720 (\uAC10\uC0AC \uB85C\uADF8\uC5D0 \uAE30\uB85D\uB429\uB2C8\uB2E4)", required: true, style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement(Textarea, { value: reason, onChange: setReason, placeholder: "\uC870\uCE58 \uC0AC\uC720\uB97C 4\uC790 \uC774\uC0C1 \uC785\uB825\uD574\uC8FC\uC138\uC694", rows: 3 })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Button, { variant: "secondary", size: "md", full: true, onClick: onCancel }, cancelLabel), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: danger ? "danger" : "primary",
      size: "md",
      full: true,
      disabled: !canConfirm,
      onClick: () => onConfirm(reason)
    },
    confirmLabel
  ))));
}
function Toast({ message, tone = "info", visible }) {
  if (!visible) return null;
  const tones = {
    info: { bg: "#191F28", fg: "#fff" },
    success: { bg: "#15803D", fg: "#fff" },
    danger: { bg: "#DC2626", fg: "#fff" }
  }[tone];
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: "50%",
    bottom: 80,
    transform: "translateX(-50%)",
    zIndex: 70,
    background: tones.bg,
    color: tones.fg,
    padding: "12px 18px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "var(--shadow-pop)",
    animation: "sheetIn 240ms var(--ease-toss)"
  } }, message);
}
Object.assign(window, {
  useFocusTrap,
  Button,
  Chip,
  Card,
  SectionCard,
  EmptyState,
  Skeleton,
  ErrorState,
  TextInput,
  Textarea,
  FormField,
  ScreenHeader,
  BackButton,
  IconButton,
  MobileBottomNav,
  MetricCard,
  Avatar,
  BottomSheet,
  ListRow,
  ProgressBar,
  Tabs,
  ConfirmDialog,
  Toast
});
