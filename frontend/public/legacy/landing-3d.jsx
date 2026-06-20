// landing-3d.jsx — three.js 기반 스크롤 내러티브 랜딩 (로그인 전).
// 실제 서비스 흐름(AI상담 → 캘린더 상담요청 → 선생님 확인 → 대학·학과 추천 → 선생님과 길잡기)을
// 아래로 스크롤하며 소개. 3D 나침반 오브 + 별 파티클 배경이 스크롤/섹션에 반응.
// 버튼 동작은 기존 onNav('auth', role, mode) 를 그대로 재사용 (UI 동작 불변).

const L3D_STEPS = [
  {
    key: 'ai', tag: '01', accent: '#5B9DFF',
    title: 'AI 진로 상담',
    desc: 'AI와 편하게 대화하면, 흥미·강점·성적 흐름에서 “진로 단서”를 차곡차곡 모아줘요. 막힐 땐 바로 고를 수 있는 추천 답변도 함께.',
    how: '‘AI 진로 상담’ 탭에서 대화 시작 → 추천 답변을 고르거나 직접 입력',
  },
  {
    key: 'cal', tag: '02', accent: '#8B7CFF',
    title: '캘린더로 상담 요청',
    desc: '마음이 가는 진로가 보이면, 캘린더에서 담임 선생님께 상담을 신청해요. 희망 일시와 고민을 적어두면 끝.',
    how: '캘린더 → 상담 요청 → 희망 일시·사유 작성',
  },
  {
    key: 'teacher', tag: '03', accent: '#22D3EE',
    title: '선생님이 상담 내용 확인',
    desc: '선생님은 학생의 AI 상담 단서와 성적 추이를 한 화면에서 확인해요. (학생 동의 범위 안에서만 열람)',
    how: '교사 화면에서 학생 선택 → AI 단서·리포트 열람',
  },
  {
    key: 'rec', tag: '04', accent: '#34D399',
    title: '대학·학과 추천',
    desc: '대화에서 드러난 단서를 바탕으로 어울리는 대학·학과를 추천받고, 입시 정보까지 바로 이어봐요.',
    how: '진로 리포트 → ‘추천 학과 입시정보 보기’',
  },
  {
    key: 'path', tag: '05', accent: '#FBBF24',
    title: '선생님과 함께 길을 잡다',
    desc: '추천을 바탕으로 선생님과 마주 앉아 상담하며, 막연한 고민을 진짜 진로 로드맵으로 완성해요.',
    how: '확정된 상담 일정에서 만나 목표를 함께 정리',
  },
];

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }

// 3D 배경 — 나침반 오브 + 별 파티클. window.THREE 없으면 조용히 비활성(섹션만 표시).
function Landing3DCanvas({ scrollRef, activeRef }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const THREE = window.THREE;
    const canvas = canvasRef.current;
    const host = canvas && canvas.parentElement;
    if (!THREE || !canvas || !host) return;

    let w = host.clientWidth || window.innerWidth;
    let h = host.clientHeight || window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 100);
    camera.position.set(0, 0, 15);
    const group = new THREE.Group();
    scene.add(group);

    // 별 파티클
    const STAR = 1400;
    const pos = new Float32Array(STAR * 3);
    for (let i = 0; i < STAR; i++) {
      const r = 18 * Math.cbrt(Math.random());
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x9fc0ff, size: 0.07, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    group.add(stars);

    // 나침반 오브 — 와이어 이코사헤드론 + 빛나는 코어
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x5b9dff, wireframe: true, transparent: true, opacity: 0.55 });
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 1), orbMat);
    group.add(orb);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x5b9dff, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending });
    const core = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), coreMat);
    group.add(core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5, 0.02, 8, 120), new THREE.MeshBasicMaterial({ color: 0x8b7cff, transparent: true, opacity: 0.4 }));
    ring.rotation.x = Math.PI / 2.3;
    group.add(ring);

    // 5개 마일스톤 노드 (오브 주위 궤도)
    const nodes = L3D_STEPS.map((s, i) => {
      const a = (i / L3D_STEPS.length) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.accent), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
      m.position.set(Math.cos(a) * 6.2, Math.sin(a) * 2.2, Math.sin(a) * 6.2);
      group.add(m);
      return m;
    });

    const targetColor = new THREE.Color(0x5b9dff);
    const curColor = new THREE.Color(0x5b9dff);
    let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
    const onMouse = (e) => { tMouseX = (e.clientX / window.innerWidth - 0.5); tMouseY = (e.clientY / window.innerHeight - 0.5); };
    window.addEventListener('pointermove', onMouse);

    const ro = new ResizeObserver(() => {
      w = host.clientWidth || window.innerWidth; h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    });
    ro.observe(host);

    let raf = 0, tPrev = 0;
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - tPrev) / 1000 || 0, 0.05); tPrev = t;
      // 스크롤 진행도(0..1)
      const sc = scrollRef.current;
      let prog = 0;
      if (sc) { const max = sc.scrollHeight - sc.clientHeight; prog = max > 0 ? sc.scrollTop / max : 0; }
      // 활성 단계는 스크롤 진행도로 매 프레임 직접 계산 (scroll 이벤트 비의존).
      const stepF = prog * (L3D_STEPS.length + 1);
      const active = Math.max(0, Math.min(Math.round(stepF) - 1, L3D_STEPS.length - 1));

      orb.rotation.y += dt * 0.25; orb.rotation.x += dt * 0.08;
      core.rotation.y -= dt * 0.15;
      stars.rotation.y += dt * 0.012;
      ring.rotation.z += dt * 0.1;
      group.rotation.y = prog * Math.PI * 0.9;
      camera.position.z = 15 - prog * 3.5; // 스크롤할수록 살짝 다가감

      // 활성 단계 색으로 부드럽게 전환
      const acc = L3D_STEPS[Math.max(0, Math.min(active, L3D_STEPS.length - 1))].accent;
      targetColor.set(acc);
      curColor.lerp(targetColor, 0.05);
      orbMat.color.copy(curColor); coreMat.color.copy(curColor);

      // 노드 펄스 — 활성 노드 크게
      nodes.forEach((m, i) => { const on = i === active; const s = on ? 1.6 + Math.sin(t * 0.006) * 0.25 : 0.8; m.scale.setScalar(s); m.material.opacity = on ? 1 : 0.5; });

      mouseX += (tMouseX - mouseX) * 0.04; mouseY += (tMouseY - mouseY) * 0.04;
      group.rotation.x = mouseY * 0.25; group.position.x = mouseX * 1.2;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMouse);
      ro.disconnect();
      starGeo.dispose(); starMat.dispose(); orb.geometry.dispose(); orbMat.dispose();
      core.geometry.dispose(); coreMat.dispose(); ring.geometry.dispose(); ring.material.dispose();
      nodes.forEach(m => { m.geometry.dispose(); m.material.dispose(); });
      renderer.dispose();
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}/>;
}

function L3DStepSection({ step, index }) {
  const left = index % 2 === 0;
  return (
    <section data-l3d-step={index} style={{
      minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: left ? 'flex-start' : 'flex-end',
      padding: 'clamp(20px, 6vw, 80px)', position: 'relative',
    }}>
      <div className="l3d-reveal" style={{
        maxWidth: 540, width: '100%',
        background: 'rgba(13, 19, 38, 0.62)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.14)', borderRadius: 22, padding: 'clamp(22px, 4vw, 36px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: step.accent, color: '#0B1020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>{step.tag}</div>
          <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${step.accent}, transparent)` }}/>
        </div>
        <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{step.title}</h2>
        <p style={{ margin: '0 0 18px', fontSize: 'clamp(15px, 2.4vw, 18px)', lineHeight: 1.7, color: 'rgba(226,232,240,0.92)' }}>{step.desc}</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid ${step.accent}44` }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: step.accent, flexShrink: 0, marginTop: 1 }}>HOW</span>
          <span style={{ fontSize: 14, color: 'rgba(226,232,240,0.95)', lineHeight: 1.6 }}>{step.how}</span>
        </div>
      </div>
    </section>
  );
}

function Landing3D({ onNav = () => {} }) {
  const scrollRef = React.useRef(null);
  const activeRef = React.useRef(0);
  const has3D = typeof window !== 'undefined' && !!window.THREE;

  const startBtns = (size) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <button onClick={() => onNav('auth', 'student', 'signup')} style={{
        padding: size === 'xl' ? '16px 30px' : '13px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #5B9DFF, #3B6FE0)', color: '#fff', fontSize: size === 'xl' ? 17 : 15, fontWeight: 800,
        boxShadow: '0 12px 30px rgba(59,111,224,0.45)',
      }}>학생으로 시작하기</button>
      <button onClick={() => onNav('auth', 'teacher', 'signup')} style={{
        padding: size === 'xl' ? '16px 30px' : '13px 24px', borderRadius: 14, cursor: 'pointer',
        background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: size === 'xl' ? 17 : 15, fontWeight: 800,
        border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)',
      }}>교사로 시작하기</button>
    </div>
  );

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, alignSelf: 'stretch', height: '100%', width: '100%', overflow: 'hidden', background: 'radial-gradient(120% 120% at 50% 0%, #14224A 0%, #0B1020 55%, #070B16 100%)' }}>
      {has3D && <Landing3DCanvas scrollRef={scrollRef} activeRef={activeRef}/>}

      {/* 상단 네비 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(14px,3vw,22px) clamp(16px,4vw,40px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#fff', fontWeight: 800, fontSize: 17 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#5B9DFF,#8B7CFF)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {typeof IcCompass === 'function' ? <IcCompass size={18} color="#fff"/> : '◎'}
          </span>
          진로나침반
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onNav('auth', 'student', 'login')} style={{ padding: '9px 16px', borderRadius: 10, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>로그인</button>
          <button onClick={() => onNav('auth', 'student', 'signup')} style={{ padding: '9px 18px', borderRadius: 10, background: '#fff', color: '#16224A', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800 }}>시작하기</button>
        </div>
      </div>

      {/* 스크롤 컨테이너 */}
      <div ref={scrollRef} className="toss-scroll" style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
        {/* HERO */}
        <section data-l3d-idx="0" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(20px,6vw,40px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, background: 'rgba(91,157,255,0.15)', border: '1px solid rgba(91,157,255,0.4)', color: '#9fc0ff', fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
            AI 진로 상담 · 학생/교사 통합 플랫폼
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(34px, 7vw, 68px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, letterSpacing: '-0.03em', maxWidth: 900 }}>
            성적과 대화로,<br/><span style={{ background: 'linear-gradient(135deg,#5B9DFF,#8B7CFF,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>진로의 길</span>을 찾다
          </h1>
          <p style={{ margin: '0 0 34px', fontSize: 'clamp(16px,2.6vw,20px)', color: 'rgba(203,213,225,0.92)', lineHeight: 1.7, maxWidth: 620 }}>
            AI와 대화하며 나를 알아가고, 선생님과 함께 진짜 진로를 정해요.<br/>아래로 내리면서 어떻게 쓰는지 살펴보세요.
          </p>
          {startBtns('xl')}
          <div style={{ marginTop: 54, color: 'rgba(159,192,255,0.8)', fontSize: 13, animation: 'l3dbob 1.8s ease-in-out infinite' }}>↓ 스크롤</div>
        </section>

        {/* 파이프라인 5단계 */}
        {L3D_STEPS.map((s, i) => (
          <div key={s.key} data-l3d-idx={i + 1}>
            <L3DStepSection step={s} index={i}/>
          </div>
        ))}

        {/* FINAL CTA */}
        <section data-l3d-idx={L3D_STEPS.length + 1} style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(20px,6vw,40px)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px,5.5vw,48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>지금, 진로의 첫 걸음을</h2>
          <p style={{ margin: '0 0 32px', fontSize: 'clamp(15px,2.4vw,18px)', color: 'rgba(203,213,225,0.9)', lineHeight: 1.7, maxWidth: 540 }}>
            첫 달 무료 체험으로 AI 상담부터 시작해보세요. 신용카드 등록 없이 바로.
          </p>
          {startBtns('xl')}
          <div style={{ marginTop: 40, color: 'rgba(148,163,184,0.6)', fontSize: 12 }}>© 2026 진로나침반 · AI 진로 상담 플랫폼</div>
        </section>
      </div>

      <style>{`
        @keyframes l3dbob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        .l3d-reveal { opacity: 1; transition: transform .3s ease, box-shadow .3s ease; }
        .l3d-reveal:hover { transform: translateY(-4px); box-shadow: 0 40px 90px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
}

Object.assign(window, { Landing3D, Landing3DCanvas });
