// landing-3d.jsx — three.js 우주 테마 스크롤 랜딩 (로그인 전).
// 가운데 3D 나침반 + 주변을 도는 직업 심볼(이모지) + 별 파티클 배경.
// 아래 5단계(AI상담→캘린더 상담요청→선생님 확인→대학·학과 추천→선생님과 길잡기)는
// 파이프라인(세로 스파인 + 노드)으로 순서대로 나타남.
// 버튼 동작은 기존 onNav('auth', role, mode) 그대로 (UI 동작 불변).
// public-screens.jsx WebAuthScreen이 typeof Landing3D==='function'면 렌더 → 함수명 유지.

const L3D_STEPS = [
  { key: 'ai', tag: '01', accent: '#5B9DFF', icon: 'IcSparkles', title: 'AI 진로 상담',
    desc: 'AI와 편하게 대화하면 흥미·강점·성적 흐름에서 “진로 단서”를 차곡차곡 모아줘요. 막힐 땐 바로 고를 수 있는 추천 답변도 함께.',
    how: '‘AI 진로 상담’ 탭에서 대화 시작 → 추천 답변을 고르거나 직접 입력' },
  { key: 'cal', tag: '02', accent: '#8B7CFF', icon: 'IcCalendar', title: '캘린더로 상담 요청',
    desc: '마음이 가는 진로가 보이면 캘린더에서 담임 선생님께 상담을 신청해요. 희망 일시와 고민을 적어두면 끝.',
    how: '캘린더 → 상담 요청 → 희망 일시·사유 작성' },
  { key: 'teacher', tag: '03', accent: '#22D3EE', icon: 'IcUser', title: '선생님이 상담 내용 확인',
    desc: '선생님은 학생의 AI 상담 단서와 성적 추이를 한 화면에서 확인해요. (학생 동의 범위 안에서만 열람)',
    how: '교사 화면에서 학생 선택 → AI 단서·리포트 열람' },
  { key: 'rec', tag: '04', accent: '#34D399', icon: 'IcGraduation', title: '대학·학과 추천',
    desc: '대화에서 드러난 단서를 바탕으로 어울리는 대학·학과를 추천받고, 입시 정보까지 바로 이어봐요.',
    how: '진로 리포트 → ‘추천 학과 입시정보 보기’' },
  { key: 'path', tag: '05', accent: '#FBBF24', icon: 'IcCompass', title: '선생님과 함께 길을 잡다',
    desc: '추천을 바탕으로 선생님과 마주 앉아 상담하며, 막연한 고민을 진짜 진로 로드맵으로 완성해요.',
    how: '확정된 상담 일정에서 만나 목표를 함께 정리' },
];

// 주변을 도는 직업 심볼 (누구나 아는 이모지 마크)
const L3D_JOBS = ['💻', '🩺', '🎨', '⚖️', '🔬', '🏫', '🍳', '✈️', '🎵', '⚽'];

function L3DIcon({ name, size = 20, color = '#fff' }) {
  const C = typeof window !== 'undefined' ? window[name] : null;
  if (typeof C === 'function') return <C size={size} color={color} />;
  return <span style={{ color }}>•</span>;
}

// ── 3D 배경: 별 + 가운데 나침반 + 직업 심볼 궤도 ──
function Landing3DCanvas({ scrollRef }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const THREE = typeof window !== 'undefined' ? window.THREE : null;
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
    const group = new THREE.Group(); scene.add(group);

    // 별 파티클
    const STAR = 1300;
    const pos = new Float32Array(STAR * 3);
    for (let i = 0; i < STAR; i++) {
      const r = 20 * Math.cbrt(Math.random()), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t); pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t); pos[i * 3 + 2] = r * Math.cos(p);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x9fc0ff, size: 0.07, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    group.add(stars);

    // ── 가운데 나침반 ──
    const compass = new THREE.Group();
    const bezel = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.12, 18, 128), new THREE.MeshBasicMaterial({ color: 0x5B9DFF, transparent: true, opacity: 0.9 }));
    const bezelInner = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.03, 10, 120), new THREE.MeshBasicMaterial({ color: 0x8B7CFF, transparent: true, opacity: 0.55 }));
    const glow = new THREE.Mesh(new THREE.CircleGeometry(2.45, 48), new THREE.MeshBasicMaterial({ color: 0x10204a, transparent: true, opacity: 0.45 }));
    glow.position.z = -0.05;
    // 방위 눈금(4개 작은 박스)
    const ticks = new THREE.Group();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const big = i % 3 === 0; const tk = new THREE.Mesh(new THREE.BoxGeometry(big ? 0.08 : 0.04, big ? 0.34 : 0.18, 0.02), new THREE.MeshBasicMaterial({ color: big ? 0xCFE2FF : 0x5B9DFF, transparent: true, opacity: big ? 0.9 : 0.5 })); tk.position.set(Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0); tk.rotation.z = a - Math.PI / 2; ticks.add(tk); }
    // 바늘 (N=코랄, S=화이트)
    const needle = new THREE.Group();
    const north = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.1, 4), new THREE.MeshBasicMaterial({ color: 0xFF6B6B })); north.position.y = 1.05;
    const south = new THREE.Mesh(new THREE.ConeGeometry(0.34, 2.1, 4), new THREE.MeshBasicMaterial({ color: 0xE9EEF8 })); south.position.y = -1.05; south.rotation.z = Math.PI;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    needle.add(north, south, hub);
    compass.add(glow, bezel, bezelInner, ticks, needle);
    group.add(compass);

    // ── 직업 심볼(이모지) 궤도 ──
    const makeEmojiSprite = (emoji) => {
      const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
      const cx = cv.getContext('2d');
      cx.font = '96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(emoji, 64, 72);
      const tex = new THREE.CanvasTexture(cv); tex.anisotropy = 2;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      sp.scale.set(1.15, 1.15, 1.15); return sp;
    };
    const orbit = new THREE.Group();
    const ORB_R = 5.7;
    L3D_JOBS.forEach((e, i) => { const a = (i / L3D_JOBS.length) * Math.PI * 2; const sp = makeEmojiSprite(e); sp.position.set(Math.cos(a) * ORB_R, Math.sin(a) * ORB_R, (Math.random() - 0.5) * 1.5); orbit.add(sp); });
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(ORB_R, 0.012, 8, 180), new THREE.MeshBasicMaterial({ color: 0x5B9DFF, transparent: true, opacity: 0.22 }));
    group.add(orbitRing, orbit);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('pointermove', onMove);
    const ro = new ResizeObserver(() => { w = host.clientWidth || 1; h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); });
    ro.observe(host);

    let raf = 0, tp = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - tp) / 1000 || 0, 0.05); tp = t;
      const sc = scrollRef && scrollRef.current;
      let prog = 0; if (sc) { const max = sc.scrollHeight - sc.clientHeight; prog = max > 0 ? sc.scrollTop / max : 0; }
      stars.rotation.y += dt * 0.012;
      needle.rotation.z -= dt * 0.5;            // 나침반 바늘 회전
      bezel.rotation.z += dt * 0.05;
      orbit.rotation.z += dt * 0.16;            // 직업 심볼 궤도 회전
      orbitRing.rotation.z += dt * 0.05;
      compass.rotation.x = Math.sin(t * 0.0004) * 0.12;
      group.rotation.y = prog * Math.PI * 0.6;  // 스크롤 시 살짝 돌기
      camera.position.z = 15 - prog * 3;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      group.rotation.x = my * 0.2; group.position.x = mx * 1.0;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); ro.disconnect();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
      renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}/>;
}

function L3DPipelineRow({ step, index, total }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.unobserve(e.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={'l3d-row' + (seen ? ' l3d-in' : '')}>
      <div className="l3d-rail">
        <span className="l3d-node" style={{ background: step.accent, boxShadow: `0 0 0 6px ${step.accent}22, 0 0 22px ${step.accent}88` }}>
          <L3DIcon name={step.icon} size={20} color="#0B1020" />
        </span>
        {index < total - 1 && <span className="l3d-line"/>}
      </div>
      <div className="l3d-pcard">
        <div className="l3d-pcard-tag" style={{ color: step.accent }}>STEP {step.tag}</div>
        <h3 className="l3d-pcard-title">{step.title}</h3>
        <p className="l3d-pcard-desc">{step.desc}</p>
        <div className="l3d-pcard-how"><span style={{ color: step.accent }}>HOW</span> {step.how}</div>
      </div>
    </div>
  );
}

function Landing3D({ onNav = () => {} }) {
  const scrollRef = React.useRef(null);
  const has3D = typeof window !== 'undefined' && !!window.THREE;

  const Btns = () => (
    <div className="l3d-cta">
      <button className="l3d-btn l3d-btn-primary" onClick={() => onNav('auth', 'student', 'signup')}>학생으로 시작하기</button>
      <button className="l3d-btn l3d-btn-ghost" onClick={() => onNav('auth', 'teacher', 'signup')}>교사로 시작하기</button>
    </div>
  );

  return (
    <div className="l3d-root">
      {has3D && <Landing3DCanvas scrollRef={scrollRef}/>}

      <header className="l3d-nav">
        <div className="l3d-brand"><span className="l3d-brand-mark"><L3DIcon name="IcCompass" size={18} color="#fff"/></span>진로나침반</div>
        <div className="l3d-nav-actions">
          <button className="l3d-nav-login" onClick={() => onNav('auth', 'student', 'login')}>로그인</button>
          <button className="l3d-nav-start" onClick={() => onNav('auth', 'student', 'signup')}>시작하기</button>
        </div>
      </header>

      <div ref={scrollRef} className="l3d-scroll toss-scroll">
        {/* HERO */}
        <section className="l3d-hero">
          <span className="l3d-badge">AI 진로 상담 · 학생/교사 통합 플랫폼</span>
          <h1 className="l3d-hero-title">성적과 대화로,<br/><span className="l3d-grad">진로의 길</span>을 찾다</h1>
          <p className="l3d-hero-sub">수많은 직업 속에서 나의 방향을 찾도록.<br/>AI와 대화하며 나를 알아가고, 선생님과 함께 진짜 진로를 정해요.</p>
          <Btns/>
          <p className="l3d-note">신용카드 등록 없이 · 첫 달 무료 체험</p>
          <div className="l3d-cue">아래로 스크롤 ↓</div>
        </section>

        {/* 파이프라인 */}
        <section className="l3d-flow">
          <div className="l3d-head">
            <span className="l3d-eyebrow">어떻게 쓰나요</span>
            <h2 className="l3d-flow-title">대화에서 시작해, 진짜 진로로</h2>
            <p className="l3d-flow-sub">다섯 단계가 하나의 흐름으로 이어집니다.</p>
          </div>
          <div className="l3d-pipeline">
            {L3D_STEPS.map((s, i) => <L3DPipelineRow key={s.key} step={s} index={i} total={L3D_STEPS.length}/>)}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="l3d-final">
          <h2 className="l3d-final-title">지금, 진로의 첫 걸음을</h2>
          <p className="l3d-final-sub">첫 달 무료 체험으로 AI 상담부터 시작해보세요.</p>
          <Btns/>
          <footer className="l3d-footer">© 2026 진로나침반 · AI 진로 상담 플랫폼</footer>
        </section>
      </div>

      <style>{`
        .l3d-root { position: relative; flex: 1; min-height: 0; align-self: stretch; height: 100%; width: 100%; overflow: hidden;
          background: radial-gradient(120% 120% at 50% 0%, #14224A 0%, #0B1020 55%, #070B16 100%);
          color: #E2E8F0; font-family: var(--font-sans, system-ui, sans-serif); }
        .l3d-nav { position: absolute; top: 0; left: 0; right: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; padding: clamp(14px,3vw,22px) clamp(16px,4vw,40px); }
        .l3d-brand { display: flex; align-items: center; gap: 9px; color: #fff; font-weight: 800; font-size: 17px; }
        .l3d-brand-mark { width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#5B9DFF,#8B7CFF); }
        .l3d-nav-actions { display: flex; gap: 8px; }
        .l3d-nav-login { padding: 9px 16px; border-radius: 10px; background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.25); cursor: pointer; font-size: 14px; font-weight: 700; }
        .l3d-nav-start { padding: 9px 18px; border-radius: 10px; background: #fff; color: #16224A; border: none; cursor: pointer; font-size: 14px; font-weight: 800; }

        .l3d-scroll { position: absolute; inset: 0; z-index: 2; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }

        .l3d-hero { min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: clamp(80px,12vw,120px) clamp(20px,6vw,40px) clamp(40px,8vw,80px); }
        .l3d-badge { display: inline-flex; padding: 7px 14px; border-radius: 999px; background: rgba(91,157,255,0.15); border: 1px solid rgba(91,157,255,0.4); color: #9fc0ff; font-size: 13px; font-weight: 700; margin-bottom: 22px; }
        .l3d-hero-title { margin: 0 0 18px; font-size: clamp(34px,7vw,66px); font-weight: 900; color: #fff; line-height: 1.13; letter-spacing: -0.03em; }
        .l3d-grad { background: linear-gradient(135deg,#5B9DFF,#8B7CFF,#22D3EE); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .l3d-hero-sub { margin: 0 0 34px; font-size: clamp(16px,2.6vw,20px); line-height: 1.7; color: rgba(203,213,225,0.92); max-width: 620px; }
        .l3d-note { margin: 20px 0 0; font-size: 13px; color: rgba(159,192,255,0.8); }
        .l3d-cue { margin-top: 40px; font-size: 13px; color: rgba(159,192,255,0.8); animation: l3dbob 1.8s ease-in-out infinite; }

        .l3d-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .l3d-btn { padding: 16px 30px; border-radius: 14px; cursor: pointer; font-size: 17px; font-weight: 800; border: 1px solid transparent; transition: transform .12s ease, background .12s ease; }
        .l3d-btn-primary { background: linear-gradient(135deg,#5B9DFF,#3B6FE0); color: #fff; box-shadow: 0 12px 30px rgba(59,111,224,0.45); }
        .l3d-btn-primary:active { transform: scale(0.98); }
        .l3d-btn-ghost { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.25); backdrop-filter: blur(10px); }

        .l3d-flow { max-width: 760px; margin: 0 auto; padding: clamp(40px,8vw,90px) clamp(20px,5vw,40px); }
        .l3d-head { text-align: center; margin-bottom: clamp(32px,5vw,56px); }
        .l3d-eyebrow { display: inline-block; font-size: 13px; font-weight: 800; color: #5B9DFF; margin-bottom: 10px; }
        .l3d-flow-title { margin: 0 0 12px; font-size: clamp(26px,5vw,42px); font-weight: 900; color: #fff; letter-spacing: -0.02em; }
        .l3d-flow-sub { margin: 0; font-size: clamp(14px,2.2vw,17px); color: rgba(203,213,225,0.8); }

        .l3d-pipeline { display: flex; flex-direction: column; }
        .l3d-row { display: flex; gap: 18px; opacity: 0; transform: translateY(26px); transition: opacity .55s ease, transform .55s ease; }
        .l3d-row.l3d-in { opacity: 1; transform: none; }
        .l3d-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .l3d-node { width: 46px; height: 46px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .l3d-line { flex: 1; width: 2px; min-height: 28px; margin: 8px 0; background: linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08)); }
        .l3d-pcard { flex: 1; margin-bottom: 22px; background: rgba(13,19,38,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: clamp(18px,3vw,26px); box-shadow: 0 24px 60px rgba(0,0,0,0.35); }
        .l3d-pcard-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 8px; }
        .l3d-pcard-title { margin: 0 0 10px; font-size: clamp(19px,3.4vw,24px); font-weight: 800; color: #fff; }
        .l3d-pcard-desc { margin: 0 0 14px; font-size: clamp(14px,2.2vw,16px); line-height: 1.7; color: rgba(226,232,240,0.9); }
        .l3d-pcard-how { font-size: 13px; line-height: 1.6; color: rgba(203,213,225,0.85); padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
        .l3d-pcard-how span { font-weight: 800; margin-right: 6px; }

        .l3d-final { text-align: center; padding: clamp(40px,7vw,90px) clamp(20px,5vw,40px) clamp(40px,6vw,64px); }
        .l3d-final-title { margin: 0 0 14px; font-size: clamp(28px,5.5vw,46px); font-weight: 900; color: #fff; letter-spacing: -0.02em; }
        .l3d-final-sub { margin: 0 auto 30px; max-width: 480px; font-size: clamp(15px,2.4vw,18px); color: rgba(203,213,225,0.9); }
        .l3d-footer { margin-top: 40px; font-size: 12px; color: rgba(148,163,184,0.6); }

        @keyframes l3dbob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @media (prefers-reduced-motion: reduce) { .l3d-row { opacity: 1; transform: none; transition: none; } .l3d-cue { animation: none; } .l3d-scroll { scroll-behavior: auto; } }
      `}</style>
    </div>
  );
}

Object.assign(window, { Landing3D, Landing3DCanvas });
