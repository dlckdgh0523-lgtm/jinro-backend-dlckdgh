const L3D_STEPS = [
  {
    key: "ai",
    tag: "01",
    accent: "#5B9DFF",
    icon: "IcSparkles",
    title: "AI \uC9C4\uB85C \uC0C1\uB2F4",
    desc: "AI\uC640 \uD3B8\uD558\uAC8C \uB300\uD654\uD558\uBA74 \uD765\uBBF8\xB7\uAC15\uC810\xB7\uC131\uC801 \uD750\uB984\uC5D0\uC11C \u201C\uC9C4\uB85C \uB2E8\uC11C\u201D\uB97C \uCC28\uACE1\uCC28\uACE1 \uBAA8\uC544\uC918\uC694. \uB9C9\uD790 \uB550 \uBC14\uB85C \uACE0\uB97C \uC218 \uC788\uB294 \uCD94\uCC9C \uB2F5\uBCC0\uB3C4 \uD568\uAED8.",
    how: "\u2018AI \uC9C4\uB85C \uC0C1\uB2F4\u2019 \uD0ED\uC5D0\uC11C \uB300\uD654 \uC2DC\uC791 \u2192 \uCD94\uCC9C \uB2F5\uBCC0\uC744 \uACE0\uB974\uAC70\uB098 \uC9C1\uC811 \uC785\uB825"
  },
  {
    key: "cal",
    tag: "02",
    accent: "#8B7CFF",
    icon: "IcCalendar",
    title: "\uCE98\uB9B0\uB354\uB85C \uC0C1\uB2F4 \uC694\uCCAD",
    desc: "\uB9C8\uC74C\uC774 \uAC00\uB294 \uC9C4\uB85C\uAC00 \uBCF4\uC774\uBA74 \uCE98\uB9B0\uB354\uC5D0\uC11C \uB2F4\uC784 \uC120\uC0DD\uB2D8\uAED8 \uC0C1\uB2F4\uC744 \uC2E0\uCCAD\uD574\uC694. \uD76C\uB9DD \uC77C\uC2DC\uC640 \uACE0\uBBFC\uC744 \uC801\uC5B4\uB450\uBA74 \uB05D.",
    how: "\uCE98\uB9B0\uB354 \u2192 \uC0C1\uB2F4 \uC694\uCCAD \u2192 \uD76C\uB9DD \uC77C\uC2DC\xB7\uC0AC\uC720 \uC791\uC131"
  },
  {
    key: "teacher",
    tag: "03",
    accent: "#22D3EE",
    icon: "IcUser",
    title: "\uC120\uC0DD\uB2D8\uC774 \uC0C1\uB2F4 \uB0B4\uC6A9 \uD655\uC778",
    desc: "\uC120\uC0DD\uB2D8\uC740 \uD559\uC0DD\uC758 AI \uC0C1\uB2F4 \uB2E8\uC11C\uC640 \uC131\uC801 \uCD94\uC774\uB97C \uD55C \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD574\uC694. (\uD559\uC0DD \uB3D9\uC758 \uBC94\uC704 \uC548\uC5D0\uC11C\uB9CC \uC5F4\uB78C)",
    how: "\uAD50\uC0AC \uD654\uBA74\uC5D0\uC11C \uD559\uC0DD \uC120\uD0DD \u2192 AI \uB2E8\uC11C\xB7\uB9AC\uD3EC\uD2B8 \uC5F4\uB78C"
  },
  {
    key: "rec",
    tag: "04",
    accent: "#34D399",
    icon: "IcGraduation",
    title: "\uB300\uD559\xB7\uD559\uACFC \uCD94\uCC9C",
    desc: "\uB300\uD654\uC5D0\uC11C \uB4DC\uB7EC\uB09C \uB2E8\uC11C\uB97C \uBC14\uD0D5\uC73C\uB85C \uC5B4\uC6B8\uB9AC\uB294 \uB300\uD559\xB7\uD559\uACFC\uB97C \uCD94\uCC9C\uBC1B\uACE0, \uC785\uC2DC \uC815\uBCF4\uAE4C\uC9C0 \uBC14\uB85C \uC774\uC5B4\uBD10\uC694.",
    how: "\uC9C4\uB85C \uB9AC\uD3EC\uD2B8 \u2192 \u2018\uCD94\uCC9C \uD559\uACFC \uC785\uC2DC\uC815\uBCF4 \uBCF4\uAE30\u2019"
  },
  {
    key: "path",
    tag: "05",
    accent: "#FBBF24",
    icon: "IcCompass",
    title: "\uC120\uC0DD\uB2D8\uACFC \uD568\uAED8 \uAE38\uC744 \uC7A1\uB2E4",
    desc: "\uCD94\uCC9C\uC744 \uBC14\uD0D5\uC73C\uB85C \uC120\uC0DD\uB2D8\uACFC \uB9C8\uC8FC \uC549\uC544 \uC0C1\uB2F4\uD558\uBA70, \uB9C9\uC5F0\uD55C \uACE0\uBBFC\uC744 \uC9C4\uC9DC \uC9C4\uB85C \uB85C\uB4DC\uB9F5\uC73C\uB85C \uC644\uC131\uD574\uC694.",
    how: "\uD655\uC815\uB41C \uC0C1\uB2F4 \uC77C\uC815\uC5D0\uC11C \uB9CC\uB098 \uBAA9\uD45C\uB97C \uD568\uAED8 \uC815\uB9AC"
  }
];
const L3D_JOBS = ["\u{1F4BB}", "\u{1FA7A}", "\u{1F3A8}", "\u2696\uFE0F", "\u{1F52C}", "\u{1F3EB}", "\u{1F373}", "\u2708\uFE0F", "\u{1F3B5}", "\u26BD"];
function L3DIcon({ name, size = 20, color = "#fff" }) {
  const C = typeof window !== "undefined" ? window[name] : null;
  if (typeof C === "function") return /* @__PURE__ */ React.createElement(C, { size, color });
  return /* @__PURE__ */ React.createElement("span", { style: { color } }, "\u2022");
}
function Landing3DCanvas({ scrollRef }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const THREE = typeof window !== "undefined" ? window.THREE : null;
    const canvas = canvasRef.current;
    const host = canvas && canvas.parentElement;
    if (!THREE || !canvas || !host) return;
    let w = host.clientWidth || 1, h = host.clientHeight || 1;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 100);
    camera.position.set(0, 0, 15);
    const group = new THREE.Group();
    scene.add(group);
    const STAR = 1300;
    const pos = new Float32Array(STAR * 3);
    for (let i = 0; i < STAR; i++) {
      const r = 20 * Math.cbrt(Math.random()), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: 10205416, size: 0.06, transparent: true, opacity: 0.4, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    group.add(stars);
    const compass = new THREE.Group();
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(3, 0.12, 18, 128), new THREE.MeshBasicMaterial({ color: 6004223, transparent: true, opacity: 0.9 }));
    const bezelInner = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.03, 10, 120), new THREE.MeshBasicMaterial({ color: 9141503, transparent: true, opacity: 0.55 }));
    const glow = new THREE.Mesh(new THREE.CircleGeometry(2.55, 48), new THREE.MeshBasicMaterial({ color: 15397375, transparent: true, opacity: 0.6 }));
    glow.position.z = -0.05;
    const ticks = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const big = i % 3 === 0;
      const tk = new THREE.Mesh(new THREE.BoxGeometry(big ? 0.08 : 0.04, big ? 0.34 : 0.18, 0.02), new THREE.MeshBasicMaterial({ color: big ? 1795290 : 9680104, transparent: true, opacity: big ? 0.95 : 0.6 }));
      tk.position.set(Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0);
      tk.rotation.z = a - Math.PI / 2;
      ticks.add(tk);
    }
    const needle = new THREE.Group();
    const north = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.1, 4), new THREE.MeshBasicMaterial({ color: 16734815 }));
    north.position.y = 1.05;
    const south = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.1, 4), new THREE.MeshBasicMaterial({ color: 6583435 }));
    south.position.y = -1.05;
    south.rotation.z = Math.PI;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), new THREE.MeshBasicMaterial({ color: 1795290 }));
    needle.add(north, south, hub);
    compass.add(glow, bezel, bezelInner, ticks, needle);
    group.add(compass);
    const makeEmojiSprite = (emoji) => {
      const cv = document.createElement("canvas");
      cv.width = 128;
      cv.height = 128;
      const cx = cv.getContext("2d");
      cx.font = '96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText(emoji, 64, 72);
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 2;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sp.scale.set(1.15, 1.15, 1.15);
      return sp;
    };
    const orbit = new THREE.Group();
    const ORB_R = 5.7;
    L3D_JOBS.forEach((e, i) => {
      const a = i / L3D_JOBS.length * Math.PI * 2;
      const sp = makeEmojiSprite(e);
      sp.position.set(Math.cos(a) * ORB_R, Math.sin(a) * ORB_R, (Math.random() - 0.5) * 1.5);
      orbit.add(sp);
    });
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(ORB_R, 0.012, 8, 180), new THREE.MeshBasicMaterial({ color: 6004223, transparent: true, opacity: 0.22 }));
    group.add(orbitRing, orbit);
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(() => {
      w = host.clientWidth || 1;
      h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(host);
    let raf = 0, tp = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - tp) / 1e3 || 0, 0.05);
      tp = t;
      const sc = scrollRef && scrollRef.current;
      let prog = 0;
      if (sc) {
        const max = sc.scrollHeight - sc.clientHeight;
        prog = max > 0 ? sc.scrollTop / max : 0;
      }
      stars.rotation.y += dt * 0.012;
      needle.rotation.z -= dt * 0.5;
      bezel.rotation.z += dt * 0.05;
      orbit.rotation.z += dt * 0.16;
      orbitRing.rotation.z += dt * 0.05;
      compass.rotation.x = Math.sin(t * 4e-4) * 0.12;
      group.rotation.y = prog * Math.PI * 0.6;
      camera.position.z = 15 - prog * 3;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      group.rotation.x = my * 0.2;
      group.position.x = mx * 1;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);
  return /* @__PURE__ */ React.createElement("canvas", { ref: canvasRef, "aria-hidden": "true", style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" } });
}
function L3DPipelineRow({ step, index, total }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /* @__PURE__ */ React.createElement("div", { ref, className: "l3d-row" + (seen ? " l3d-in" : "") }, /* @__PURE__ */ React.createElement("div", { className: "l3d-rail" }, /* @__PURE__ */ React.createElement("span", { className: "l3d-node", style: { background: step.accent, boxShadow: `0 0 0 6px ${step.accent}22, 0 0 22px ${step.accent}88` } }, /* @__PURE__ */ React.createElement(L3DIcon, { name: step.icon, size: 20, color: "#0B1020" })), index < total - 1 && /* @__PURE__ */ React.createElement("span", { className: "l3d-line" })), /* @__PURE__ */ React.createElement("div", { className: "l3d-pcard" }, /* @__PURE__ */ React.createElement("div", { className: "l3d-pcard-tag", style: { color: step.accent } }, "STEP ", step.tag), /* @__PURE__ */ React.createElement("h3", { className: "l3d-pcard-title" }, step.title), /* @__PURE__ */ React.createElement("p", { className: "l3d-pcard-desc" }, step.desc), /* @__PURE__ */ React.createElement("div", { className: "l3d-pcard-how" }, /* @__PURE__ */ React.createElement("span", { style: { color: step.accent } }, "HOW"), " ", step.how)));
}
function Landing3D({ onNav = () => {
} }) {
  const scrollRef = React.useRef(null);
  const has3D = typeof window !== "undefined" && !!window.THREE;
  const Btns = () => /* @__PURE__ */ React.createElement("div", { className: "l3d-cta" }, /* @__PURE__ */ React.createElement("button", { className: "l3d-btn l3d-btn-primary", onClick: () => onNav("auth", "student", "signup") }, "\uD559\uC0DD\uC73C\uB85C \uC2DC\uC791\uD558\uAE30"), /* @__PURE__ */ React.createElement("button", { className: "l3d-btn l3d-btn-ghost", onClick: () => onNav("auth", "teacher", "signup") }, "\uAD50\uC0AC\uB85C \uC2DC\uC791\uD558\uAE30"));
  return /* @__PURE__ */ React.createElement("div", { className: "l3d-root" }, has3D && /* @__PURE__ */ React.createElement(Landing3DCanvas, { scrollRef }), /* @__PURE__ */ React.createElement("header", { className: "l3d-nav" }, /* @__PURE__ */ React.createElement("div", { className: "l3d-brand" }, /* @__PURE__ */ React.createElement("span", { className: "l3d-brand-mark" }, /* @__PURE__ */ React.createElement(L3DIcon, { name: "IcCompass", size: 18, color: "#fff" })), "\uC9C4\uB85C\uB098\uCE68\uBC18"), /* @__PURE__ */ React.createElement("div", { className: "l3d-nav-actions" }, /* @__PURE__ */ React.createElement("button", { className: "l3d-nav-login", onClick: () => onNav("auth", "student", "login") }, "\uB85C\uADF8\uC778"), /* @__PURE__ */ React.createElement("button", { className: "l3d-nav-start", onClick: () => onNav("auth", "student", "signup") }, "\uC2DC\uC791\uD558\uAE30"))), /* @__PURE__ */ React.createElement("div", { ref: scrollRef, className: "l3d-scroll toss-scroll" }, /* @__PURE__ */ React.createElement("section", { className: "l3d-hero" }, /* @__PURE__ */ React.createElement("span", { className: "l3d-badge" }, "AI \uC9C4\uB85C \uC0C1\uB2F4 \xB7 \uD559\uC0DD/\uAD50\uC0AC \uD1B5\uD569 \uD50C\uB7AB\uD3FC"), /* @__PURE__ */ React.createElement("h1", { className: "l3d-hero-title" }, "\uC131\uC801\uACFC \uB300\uD654\uB85C,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "l3d-grad" }, "\uC9C4\uB85C\uC758 \uAE38"), "\uC744 \uCC3E\uB2E4"), /* @__PURE__ */ React.createElement("p", { className: "l3d-hero-sub" }, "\uC218\uB9CE\uC740 \uC9C1\uC5C5 \uC18D\uC5D0\uC11C \uB098\uC758 \uBC29\uD5A5\uC744 \uCC3E\uB3C4\uB85D.", /* @__PURE__ */ React.createElement("br", null), "AI\uC640 \uB300\uD654\uD558\uBA70 \uB098\uB97C \uC54C\uC544\uAC00\uACE0, \uC120\uC0DD\uB2D8\uACFC \uD568\uAED8 \uC9C4\uC9DC \uC9C4\uB85C\uB97C \uC815\uD574\uC694."), /* @__PURE__ */ React.createElement(Btns, null), /* @__PURE__ */ React.createElement("p", { className: "l3d-note" }, "\uC2E0\uC6A9\uCE74\uB4DC \uB4F1\uB85D \uC5C6\uC774 \xB7 \uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8"), /* @__PURE__ */ React.createElement("div", { className: "l3d-cue" }, "\uC544\uB798\uB85C \uC2A4\uD06C\uB864 \u2193")), /* @__PURE__ */ React.createElement("section", { className: "l3d-flow" }, /* @__PURE__ */ React.createElement("div", { className: "l3d-head" }, /* @__PURE__ */ React.createElement("span", { className: "l3d-eyebrow" }, "\uC5B4\uB5BB\uAC8C \uC4F0\uB098\uC694"), /* @__PURE__ */ React.createElement("h2", { className: "l3d-flow-title" }, "\uB300\uD654\uC5D0\uC11C \uC2DC\uC791\uD574, \uC9C4\uC9DC \uC9C4\uB85C\uB85C"), /* @__PURE__ */ React.createElement("p", { className: "l3d-flow-sub" }, "\uB2E4\uC12F \uB2E8\uACC4\uAC00 \uD558\uB098\uC758 \uD750\uB984\uC73C\uB85C \uC774\uC5B4\uC9D1\uB2C8\uB2E4.")), /* @__PURE__ */ React.createElement("div", { className: "l3d-pipeline" }, L3D_STEPS.map((s, i) => /* @__PURE__ */ React.createElement(L3DPipelineRow, { key: s.key, step: s, index: i, total: L3D_STEPS.length })))), /* @__PURE__ */ React.createElement("section", { className: "l3d-final" }, /* @__PURE__ */ React.createElement("h2", { className: "l3d-final-title" }, "\uC9C0\uAE08, \uC9C4\uB85C\uC758 \uCCAB \uAC78\uC74C\uC744"), /* @__PURE__ */ React.createElement("p", { className: "l3d-final-sub" }, "\uCCAB \uB2EC \uBB34\uB8CC \uCCB4\uD5D8\uC73C\uB85C AI \uC0C1\uB2F4\uBD80\uD130 \uC2DC\uC791\uD574\uBCF4\uC138\uC694."), /* @__PURE__ */ React.createElement(Btns, null), /* @__PURE__ */ React.createElement("footer", { className: "l3d-footer" }, /* @__PURE__ */ React.createElement("div", { className: "l3d-contact" }, /* @__PURE__ */ React.createElement("span", { className: "l3d-contact-label" }, "\uD611\uC5C5 \xB7 \uBB38\uC758"), /* @__PURE__ */ React.createElement("a", { href: "mailto:dlckdgh135@naver.com" }, "dlckdgh135@naver.com")), /* @__PURE__ */ React.createElement("div", { className: "l3d-copy" }, "\xA9 2026 \uC9C4\uB85C\uB098\uCE68\uBC18 \xB7 AI \uC9C4\uB85C \uC0C1\uB2F4 \uD50C\uB7AB\uD3FC \xB7 \uB9CC\uB4E0 \uC0AC\uB78C \uC774\uCC3D\uD638")))), /* @__PURE__ */ React.createElement("style", null, `
        .l3d-root { position: relative; flex: 1; min-height: 0; align-self: stretch; height: 100%; width: 100%; overflow: hidden;
          background: radial-gradient(120% 110% at 50% -5%, #EEF4FF 0%, #FFFFFF 55%);
          color: #333D4B; font-family: var(--font-sans, system-ui, sans-serif); }
        .l3d-nav { position: absolute; top: 0; left: 0; right: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; padding: clamp(14px,3vw,22px) clamp(16px,4vw,40px); }
        .l3d-brand { display: flex; align-items: center; gap: 9px; color: #191F28; font-weight: 800; font-size: 17px; }
        .l3d-brand-mark { width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#5B9DFF,#8B7CFF); box-shadow: 0 4px 12px rgba(49,130,246,0.3); }
        .l3d-nav-actions { display: flex; gap: 8px; }
        .l3d-nav-login { padding: 9px 16px; border-radius: 10px; background: rgba(255,255,255,0.7); color: #333D4B; border: 1px solid #E5E8EB; cursor: pointer; font-size: 14px; font-weight: 700; }
        .l3d-nav-start { padding: 9px 18px; border-radius: 10px; background: #3182F6; color: #fff; border: none; cursor: pointer; font-size: 14px; font-weight: 800; }

        .l3d-scroll { position: absolute; inset: 0; z-index: 2; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }

        .l3d-hero { min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: clamp(80px,12vw,120px) clamp(20px,6vw,40px) clamp(40px,8vw,80px); }
        .l3d-badge { display: inline-flex; padding: 7px 14px; border-radius: 999px; background: #EBF4FF; border: 1px solid #D6E6FF; color: #1B64DA; font-size: 13px; font-weight: 700; margin-bottom: 22px; }
        .l3d-hero-title { margin: 0 0 18px; font-size: clamp(34px,7vw,66px); font-weight: 900; color: #191F28; line-height: 1.13; letter-spacing: -0.03em; }
        .l3d-grad { background: linear-gradient(135deg,#3182F6,#7B61FF,#22A7C2); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .l3d-hero-sub { margin: 0 0 34px; font-size: clamp(16px,2.6vw,20px); line-height: 1.7; color: #2B3138; font-weight: 600; max-width: 620px; text-shadow: 0 1px 2px rgba(255,255,255,0.7); }
        .l3d-note { margin: 20px 0 0; font-size: 13px; color: #8B95A1; }
        .l3d-cue { margin-top: 40px; font-size: 13px; color: #8B95A1; animation: l3dbob 1.8s ease-in-out infinite; }

        .l3d-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .l3d-btn { padding: 16px 30px; border-radius: 14px; cursor: pointer; font-size: 17px; font-weight: 800; border: 1px solid transparent; transition: transform .12s ease, background .12s ease; }
        .l3d-btn-primary { background: linear-gradient(135deg,#3182F6,#1B64DA); color: #fff; box-shadow: 0 12px 30px rgba(49,130,246,0.32); }
        .l3d-btn-primary:active { transform: scale(0.98); }
        .l3d-btn-ghost { background: #fff; color: #191F28; border-color: #E5E8EB; }

        .l3d-flow { max-width: 760px; margin: 0 auto; padding: clamp(40px,8vw,90px) clamp(20px,5vw,40px); }
        .l3d-head { text-align: center; margin-bottom: clamp(32px,5vw,56px); }
        .l3d-eyebrow { display: inline-block; font-size: 13px; font-weight: 800; color: #3182F6; margin-bottom: 10px; }
        .l3d-flow-title { margin: 0 0 12px; font-size: clamp(26px,5vw,42px); font-weight: 900; color: #191F28; letter-spacing: -0.02em; }
        .l3d-flow-sub { margin: 0; font-size: clamp(14px,2.2vw,17px); color: #6B7684; }

        .l3d-pipeline { display: flex; flex-direction: column; }
        .l3d-row { display: flex; gap: 18px; opacity: 0; transform: translateY(26px); transition: opacity .55s ease, transform .55s ease; }
        .l3d-row.l3d-in { opacity: 1; transform: none; }
        .l3d-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .l3d-node { width: 46px; height: 46px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .l3d-line { flex: 1; width: 2px; min-height: 28px; margin: 8px 0; background: linear-gradient(180deg, #C9D6EA, #EAEEF3); }
        .l3d-pcard { flex: 1; margin-bottom: 22px; background: #fff; border: 1px solid #E5E8EB; border-radius: 18px; padding: clamp(18px,3vw,26px); box-shadow: 0 10px 28px rgba(17,24,39,0.06); }
        .l3d-pcard-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 8px; }
        .l3d-pcard-title { margin: 0 0 10px; font-size: clamp(19px,3.4vw,24px); font-weight: 800; color: #191F28; }
        .l3d-pcard-desc { margin: 0 0 14px; font-size: clamp(14px,2.2vw,16px); line-height: 1.7; color: #6B7684; }
        .l3d-pcard-how { font-size: 13px; line-height: 1.6; color: #4E5968; padding-top: 12px; border-top: 1px solid #EEF0F2; }
        .l3d-pcard-how span { font-weight: 800; margin-right: 6px; }

        .l3d-final { text-align: center; padding: clamp(40px,7vw,90px) clamp(20px,5vw,40px) clamp(40px,6vw,64px); }
        .l3d-final-title { margin: 0 0 14px; font-size: clamp(28px,5.5vw,46px); font-weight: 900; color: #191F28; letter-spacing: -0.02em; }
        .l3d-final-sub { margin: 0 auto 30px; max-width: 480px; font-size: clamp(15px,2.4vw,18px); color: #6B7684; }
        .l3d-footer { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .l3d-contact { display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px; border-radius: 999px; background: rgba(49,130,246,0.06); border: 1px solid rgba(49,130,246,0.18); font-size: 13px; }
        .l3d-contact-label { color: #4E5968; font-weight: 700; letter-spacing: -0.01em; }
        .l3d-contact a { color: #3182F6; font-weight: 800; text-decoration: none; }
        .l3d-contact a:hover { text-decoration: underline; }
        .l3d-copy { font-size: 12px; color: #8B95A1; }

        @keyframes l3dbob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @media (prefers-reduced-motion: reduce) { .l3d-row { opacity: 1; transform: none; transition: none; } .l3d-cue { animation: none; } .l3d-scroll { scroll-behavior: auto; } }
      `));
}
Object.assign(window, { Landing3D, Landing3DCanvas });
