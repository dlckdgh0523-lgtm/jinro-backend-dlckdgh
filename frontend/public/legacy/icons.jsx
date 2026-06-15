// Icons — small, consistent SVG icon set (Lucide-derived, 1.75 stroke)
// All icons take size + color; default 20/currentColor.

const Icon = ({ children, size = 20, color = 'currentColor', strokeWidth = 1.75, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const IcHome = (p) => <Icon {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></Icon>;
const IcChart = (p) => <Icon {...p}><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></Icon>;
const IcCompass = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></Icon>;
const IcBook = (p) => <Icon {...p}><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v16H5.5a1.5 1.5 0 0 1 0-3H20"/><path d="M9 7h7M9 11h7"/></Icon>;
const IcUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></Icon>;
const IcBell = (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 8H4c0-2 2-3 2-8Z"/><path d="M10 20a2 2 0 0 0 4 0"/></Icon>;
const IcSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>;
const IcChevronRight = (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>;
const IcChevronLeft = (p) => <Icon {...p}><path d="m15 6-6 6 6 6"/></Icon>;
const IcChevronDown = (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
const IcChevronUp = (p) => <Icon {...p}><path d="m6 15 6-6 6 6"/></Icon>;
const IcArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IcArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></Icon>;
const IcArrowUp = (p) => <Icon {...p}><path d="M12 19V5M6 11l6-6 6 6"/></Icon>;
const IcArrowDown = (p) => <Icon {...p}><path d="M12 5v14M6 13l6 6 6-6"/></Icon>;
const IcPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IcCheck = (p) => <Icon {...p}><path d="m5 12 5 5 9-9"/></Icon>;
const IcCheckCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></Icon>;
const IcX = (p) => <Icon {...p}><path d="M6 6l12 12M6 18 18 6"/></Icon>;
const IcXCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M9 15l6-6"/></Icon>;
const IcInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></Icon>;
const IcAlert = (p) => <Icon {...p}><path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v4M12 18h.01"/></Icon>;
const IcSparkles = (p) => <Icon {...p}><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l3 3M18 18l-3-3M6 18l3-3M18 6l-3 3"/></Icon>;
const IcMessage = (p) => <Icon {...p}><path d="M21 12a8 8 0 0 1-12.5 6.6L4 20l1.4-4.5A8 8 0 1 1 21 12Z"/></Icon>;
const IcSend = (p) => <Icon {...p}><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7Z"/></Icon>;
const IcSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></Icon>;
const IcGraduation = (p) => <Icon {...p}><path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Icon>;
const IcTarget = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></Icon>;
const IcCalendar = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></Icon>;
const IcClipboard = (p) => <Icon {...p}><rect x="6" y="4" width="12" height="18" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></Icon>;
const IcCopy = (p) => <Icon {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></Icon>;
const IcLogout = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></Icon>;
const IcCreditCard = (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h3"/></Icon>;
const IcShield = (p) => <Icon {...p}><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z"/></Icon>;
const IcUsers = (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><circle cx="17" cy="6" r="3"/><path d="M22 18c0-2.5-2-4-5-4"/></Icon>;
const IcDoc = (p) => <Icon {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></Icon>;
const IcMore = (p) => <Icon {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></Icon>;
const IcMoreV = (p) => <Icon {...p}><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></Icon>;
const IcFilter = (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></Icon>;
const IcMenu = (p) => <Icon {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Icon>;
const IcGoogle = (p) => (
  <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, ...p.style }}>
    <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/>
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.5A10 10 0 0 0 12 22Z"/>
    <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.8V7.7H3.1a10 10 0 0 0 0 8.6L6.4 14Z"/>
    <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A10 10 0 0 0 3.1 7.7L6.4 10.2C7.2 7.7 9.4 5.9 12 5.9Z"/>
  </svg>
);
const IcKakao = (p) => (
  <svg width={p.size || 20} height={p.size || 20} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, ...p.style }}>
    <path fill="#191919" d="M12 4C6.5 4 2 7.5 2 11.8c0 2.8 1.9 5.2 4.7 6.6l-1 3.6 4.2-2.5c.7.1 1.4.1 2.1.1 5.5 0 10-3.5 10-7.8C22 7.5 17.5 4 12 4Z"/>
  </svg>
);
const IcDownload = (p) => <Icon {...p}><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></Icon>;
const IcRefresh = (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></Icon>;
const IcPause = (p) => <Icon {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></Icon>;
const IcDot = (p) => <svg width={p.size || 8} height={p.size || 8} viewBox="0 0 8 8" style={p.style}><circle cx="4" cy="4" r="3" fill={p.color || 'currentColor'}/></svg>;
const IcLock = (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Icon>;
const IcStar = (p) => <Icon {...p}><path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6L12 17l-5.4 2.8 1-6L3.4 9.4l6-.9L12 3Z"/></Icon>;
const IcHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></Icon>;
const IcServer = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="7" rx="1"/><rect x="3" y="13" width="18" height="7" rx="1"/><path d="M7 8h.01M7 17h.01"/></Icon>;
const IcZap = (p) => <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></Icon>;
const IcWifi = (p) => <Icon {...p}><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/></Icon>;
const IcDb = (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></Icon>;
const IcEye = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IcEyeOff = (p) => <Icon {...p}><path d="M3 3l18 18M10.6 6.3A10.6 10.6 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3 3.7M6.2 6.6A16 16 0 0 0 2 12s3.5 6 10 6c1.6 0 3-.4 4.2-1"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/></Icon>;
const IcMic = (p) => <Icon {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></Icon>;
const IcSchool = (p) => <Icon {...p}><path d="M3 8 12 3l9 5v3l-9 5-9-5V8Z"/><path d="M7 11v5c2.5 2 7.5 2 10 0v-5"/></Icon>;
const IcFlag = (p) => <Icon {...p}><path d="M4 21V3M4 15h14l-2-4 2-4H4"/></Icon>;
const IcPaperclip = (p) => <Icon {...p}><path d="M21 11.5 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5L10 17a1.5 1.5 0 0 1-2.1-2.1L16 7"/></Icon>;
const IcTrash = (p) => <Icon {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></Icon>;

Object.assign(window, {
  Icon, IcHome, IcChart, IcCompass, IcBook, IcUser, IcBell, IcSearch,
  IcTrash,
  IcChevronRight, IcChevronLeft, IcChevronDown, IcChevronUp,
  IcArrowRight, IcArrowLeft, IcArrowUp, IcArrowDown,
  IcPlus, IcCheck, IcCheckCircle, IcX, IcXCircle, IcInfo, IcAlert,
  IcSparkles, IcMessage, IcSend, IcSettings, IcGraduation, IcTarget,
  IcCalendar, IcClipboard, IcCopy, IcLogout, IcCreditCard, IcShield,
  IcUsers, IcDoc, IcMore, IcMoreV, IcFilter, IcMenu, IcGoogle, IcKakao,
  IcDownload, IcRefresh, IcPause, IcDot, IcLock, IcStar, IcHeart,
  IcServer, IcZap, IcWifi, IcDb, IcEye, IcEyeOff, IcMic,
  IcSchool, IcFlag, IcPaperclip,
});
