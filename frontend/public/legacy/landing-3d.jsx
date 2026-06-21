// landing-3d.jsx — 토스(toss)풍 밝은 히어로 + 스크롤 소개 랜딩 (로그인 전).
// 이전 three.js 우주 테마(나침반 오브+별 파티클)를 걷어내고, 진로/입시 서비스 톤에 맞는
// 깔끔하고 정돈된 밝은 화면으로 교체. 실제 서비스 흐름을 카드형으로 소개.
//   ① AI 진로 상담 ② 캘린더로 상담 요청 ③ 선생님이 상담 내용 확인
//   ④ 대학·학과 추천 ⑤ 선생님과 함께 길 잡기
// 버튼 동작은 기존 onNav('auth', role, mode) 를 그대로 재사용 (UI 동작 불변).
// public-screens.jsx의 WebAuthScreen이 typeof Landing3D==='function' 일 때 렌더하므로 함수명 유지.

const L3D_BRAND = '#3182F6';   // toss-theme --brand-500
const L3D_BRAND_600 = '#1B64DA';

// 아이콘 안전 참조 — 미정의 시 점(•)으로 폴백.
function L3DIcon({ name, size = 22, color = '#fff' }) {
  const C = typeof window !== 'undefined' ? window[name] : null;
  if (typeof C === 'function') return <C size={size} color={color} />;
  return <span style={{ color }}>•</span>;
}

const L3D_STEPS = [
  {
    key: 'ai', num: '01', icon: 'IcSparkles', accent: '#3182F6', accentBg: '#EBF4FF',
    title: 'AI 진로 상담',
    desc: 'AI와 편하게 대화하면 흥미·강점·성적 흐름에서 “진로 단서”를 차곡차곡 모아줘요. 막힐 땐 바로 고를 수 있는 추천 답변도 함께.',
    how: '‘AI 진로 상담’ 탭에서 대화 시작 → 추천 답변을 고르거나 직접 입력',
  },
  {
    key: 'cal', num: '02', icon: 'IcCalendar', accent: '#1B64DA', accentBg: '#EBF4FF',
    title: '캘린더로 상담 요청',
    desc: '마음이 가는 진로가 보이면 캘린더에서 담임 선생님께 상담을 신청해요. 희망 일시와 고민을 적어두면 끝.',
    how: '캘린더 → 상담 요청 → 희망 일시·사유 작성',
  },
  {
    key: 'teacher', num: '03', icon: 'IcUser', accent: '#00B894', accentBg: '#DDF7F0',
    title: '선생님이 상담 내용 확인',
    desc: '선생님은 학생의 AI 상담 단서와 성적 추이를 한 화면에서 확인해요. (학생 동의 범위 안에서만 열람)',
    how: '교사 화면에서 학생 선택 → AI 단서·리포트 열람',
  },
  {
    key: 'rec', num: '04', icon: 'IcGraduation', accent: '#7B61FF', accentBg: '#F1ECFF',
    title: '대학·학과 추천',
    desc: '대화에서 드러난 단서를 바탕으로 어울리는 대학·학과를 추천받고, 입시 정보까지 바로 이어봐요.',
    how: '진로 리포트 → ‘추천 학과 입시정보 보기’',
  },
  {
    key: 'path', num: '05', icon: 'IcCompass', accent: '#1B64DA', accentBg: '#EBF4FF',
    title: '선생님과 함께 길을 잡다',
    desc: '추천을 바탕으로 선생님과 마주 앉아 상담하며, 막연한 고민을 진짜 진로 로드맵으로 완성해요.',
    how: '확정된 상담 일정에서 만나 목표를 함께 정리',
  },
];

// 스크롤 진입 시 한 번 페이드/슬라이드업 (절제된 모션).
function useL3DReveal() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('l3d-in'); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('l3d-in'); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function L3DStepCard({ step, index }) {
  const ref = useL3DReveal();
  return (
    <div ref={ref} className="l3d-reveal l3d-card" style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
      <div className="l3d-card-top">
        <span className="l3d-card-icon" style={{ background: step.accentBg, color: step.accent }}>
          <L3DIcon name={step.icon} size={24} color={step.accent} />
        </span>
        <span className="l3d-card-num" style={{ color: step.accent }}>{step.num}</span>
      </div>
      <h3 className="l3d-card-title">{step.title}</h3>
      <p className="l3d-card-desc">{step.desc}</p>
      <div className="l3d-card-how">
        <span className="l3d-card-how-tag" style={{ color: step.accent, background: step.accentBg }}>사용법</span>
        <span className="l3d-card-how-text">{step.how}</span>
      </div>
    </div>
  );
}

function Landing3D({ onNav = () => {} }) {
  const heroRef = useL3DReveal();

  const PrimaryBtns = ({ size }) => (
    <div className="l3d-cta-row">
      <button className={`l3d-btn l3d-btn-primary${size === 'xl' ? ' l3d-btn-xl' : ''}`}
        onClick={() => onNav('auth', 'student', 'signup')}>학생으로 시작하기</button>
      <button className={`l3d-btn l3d-btn-ghost${size === 'xl' ? ' l3d-btn-xl' : ''}`}
        onClick={() => onNav('auth', 'teacher', 'signup')}>교사로 시작하기</button>
    </div>
  );

  return (
    <div className="l3d-root toss-scroll">
      {/* 상단 네비 */}
      <header className="l3d-nav">
        <div className="l3d-brand">
          <span className="l3d-brand-mark"><L3DIcon name="IcCompass" size={18} color="#fff" /></span>
          진로나침반
        </div>
        <div className="l3d-nav-actions">
          <button className="l3d-nav-login" onClick={() => onNav('auth', 'student', 'login')}>로그인</button>
          <button className="l3d-nav-start" onClick={() => onNav('auth', 'student', 'signup')}>시작하기</button>
        </div>
      </header>

      {/* HERO */}
      <section className="l3d-hero">
        <div ref={heroRef} className="l3d-reveal l3d-hero-inner">
          <span className="l3d-badge">AI 진로 상담 · 학생/교사 통합 플랫폼</span>
          <h1 className="l3d-hero-title">
            성적과 대화로,<br /><span className="l3d-hero-accent">진로의 길</span>을 찾다
          </h1>
          <p className="l3d-hero-sub">
            AI와 대화하며 나를 알아가고, 선생님과 함께 진짜 진로를 정해요.<br />
            아래로 내리면서 어떻게 쓰는지 살펴보세요.
          </p>
          <PrimaryBtns size="xl" />
          <p className="l3d-hero-note">신용카드 등록 없이 · 첫 달 무료 체험</p>
        </div>
        <div className="l3d-scrollcue">아래로 스크롤 ↓</div>
      </section>

      {/* 흐름 소개 */}
      <section className="l3d-flow">
        <div className="l3d-section-head">
          <span className="l3d-section-eyebrow">어떻게 쓰나요</span>
          <h2 className="l3d-section-title">대화에서 시작해, 진짜 진로로</h2>
          <p className="l3d-section-sub">AI 상담부터 선생님과의 마무리까지, 다섯 단계로 이어집니다.</p>
        </div>
        <div className="l3d-grid">
          {L3D_STEPS.map((s, i) => <L3DStepCard key={s.key} step={s} index={i} />)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="l3d-final">
        <div className="l3d-final-card">
          <h2 className="l3d-final-title">지금, 진로의 첫 걸음을</h2>
          <p className="l3d-final-sub">첫 달 무료 체험으로 AI 상담부터 시작해보세요. 신용카드 등록 없이 바로.</p>
          <PrimaryBtns size="xl" />
        </div>
        <footer className="l3d-footer">© 2026 진로나침반 · AI 진로 상담 플랫폼</footer>
      </section>

      <style>{`
        .l3d-root {
          position: relative; flex: 1; min-height: 0; align-self: stretch;
          height: 100%; width: 100%; overflow-y: auto; overflow-x: hidden;
          background: var(--bg-canvas, #F2F4F6);
          color: var(--fg-default, #333D4B);
          font-family: var(--font-sans, system-ui, sans-serif);
          scroll-behavior: smooth;
        }

        /* NAV */
        .l3d-nav {
          position: sticky; top: 0; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px clamp(16px, 4vw, 48px);
          background: rgba(255,255,255,0.82);
          backdrop-filter: saturate(180%) blur(12px);
          -webkit-backdrop-filter: saturate(180%) blur(12px);
          border-bottom: 1px solid var(--line-subtle, #EEF0F2);
        }
        .l3d-brand { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 17px; color: var(--fg-strong, #191F28); }
        .l3d-brand-mark {
          width: 30px; height: 30px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, ${L3D_BRAND}, ${L3D_BRAND_600});
          box-shadow: 0 4px 12px rgba(49,130,246,0.30);
        }
        .l3d-nav-actions { display: flex; gap: 8px; }
        .l3d-nav-login {
          padding: 9px 16px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700;
          background: transparent; color: var(--fg-default, #333D4B); border: 1px solid var(--line, #E5E8EB);
          transition: background var(--t-fast, 120ms) ease, border-color var(--t-fast, 120ms) ease;
        }
        .l3d-nav-login:hover { background: var(--bg-muted, #F9FAFB); border-color: var(--line-strong, #D1D6DB); }
        .l3d-nav-start {
          padding: 9px 18px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 800;
          background: ${L3D_BRAND}; color: #fff; border: none;
          transition: background var(--t-fast, 120ms) ease, transform var(--t-fast, 120ms) ease;
        }
        .l3d-nav-start:hover { background: ${L3D_BRAND_600}; }
        .l3d-nav-start:active { transform: scale(0.97); }

        /* HERO */
        .l3d-hero {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: clamp(56px, 10vw, 120px) clamp(20px, 6vw, 40px) clamp(40px, 8vw, 88px);
          background:
            radial-gradient(70% 60% at 50% -10%, #EBF4FF 0%, rgba(235,244,255,0) 60%),
            var(--bg-canvas, #F2F4F6);
        }
        .l3d-hero-inner { max-width: 860px; }
        .l3d-badge {
          display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 999px;
          background: var(--brand-50, #EBF4FF); color: var(--brand-600, #1B64DA);
          font-size: 13px; font-weight: 700; margin-bottom: 22px;
          border: 1px solid var(--brand-100, #D6E6FF);
        }
        .l3d-hero-title {
          margin: 0 0 18px; font-size: clamp(32px, 6.5vw, 60px); font-weight: 800;
          color: var(--fg-strong, #191F28); line-height: 1.18; letter-spacing: -0.03em;
        }
        .l3d-hero-accent {
          background: linear-gradient(135deg, ${L3D_BRAND}, #7B61FF);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .l3d-hero-sub {
          margin: 0 auto 32px; max-width: 600px;
          font-size: clamp(15px, 2.4vw, 19px); line-height: 1.7; color: var(--fg-muted, #6B7684);
        }
        .l3d-hero-note { margin: 22px 0 0; font-size: 13px; color: var(--fg-subtle, #8B95A1); }
        .l3d-scrollcue { margin-top: 44px; font-size: 13px; color: var(--fg-subtle, #8B95A1); animation: l3dbob 1.8s ease-in-out infinite; }

        /* CTA buttons */
        .l3d-cta-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .l3d-btn {
          padding: 13px 24px; border-radius: 14px; cursor: pointer; font-size: 15px; font-weight: 800;
          border: 1px solid transparent; transition: transform var(--t-fast,120ms) ease, background var(--t-fast,120ms) ease, box-shadow var(--t-fast,120ms) ease;
        }
        .l3d-btn-xl { padding: 16px 30px; font-size: 17px; }
        .l3d-btn-primary { background: ${L3D_BRAND}; color: #fff; box-shadow: 0 8px 24px rgba(49,130,246,0.30); }
        .l3d-btn-primary:hover { background: ${L3D_BRAND_600}; box-shadow: 0 10px 28px rgba(27,100,218,0.34); }
        .l3d-btn-primary:active { transform: scale(0.98); }
        .l3d-btn-ghost { background: #fff; color: var(--fg-strong, #191F28); border-color: var(--line, #E5E8EB); }
        .l3d-btn-ghost:hover { background: var(--bg-muted, #F9FAFB); border-color: var(--line-strong, #D1D6DB); }
        .l3d-btn-ghost:active { transform: scale(0.98); }

        /* FLOW */
        .l3d-flow { padding: clamp(40px, 8vw, 96px) clamp(20px, 5vw, 48px); max-width: 1120px; margin: 0 auto; width: 100%; }
        .l3d-section-head { text-align: center; max-width: 640px; margin: 0 auto clamp(32px, 5vw, 56px); }
        .l3d-section-eyebrow { display: inline-block; font-size: 13px; font-weight: 800; color: var(--brand-500, #3182F6); margin-bottom: 10px; letter-spacing: 0.02em; }
        .l3d-section-title { margin: 0 0 12px; font-size: clamp(24px, 4.2vw, 38px); font-weight: 800; color: var(--fg-strong, #191F28); letter-spacing: -0.02em; line-height: 1.25; }
        .l3d-section-sub { margin: 0; font-size: clamp(14px, 2.2vw, 17px); line-height: 1.65; color: var(--fg-muted, #6B7684); }

        .l3d-grid {
          display: grid; gap: clamp(14px, 2vw, 20px);
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .l3d-card {
          background: var(--bg-surface, #fff); border: 1px solid var(--line, #E5E8EB);
          border-radius: var(--r-xl, 20px); padding: clamp(22px, 3vw, 30px);
          box-shadow: var(--shadow-card, 0 8px 24px rgba(17,24,39,0.04));
          transition: transform var(--t-base,220ms) var(--ease-toss, ease), box-shadow var(--t-base,220ms) ease;
        }
        .l3d-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover, 0 12px 32px rgba(17,24,39,0.08)); }
        .l3d-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .l3d-card-icon { width: 48px; height: 48px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .l3d-card-num { font-size: 22px; font-weight: 800; letter-spacing: 0.02em; opacity: 0.55; }
        .l3d-card-title { margin: 0 0 10px; font-size: clamp(18px, 2.6vw, 21px); font-weight: 800; color: var(--fg-strong, #191F28); letter-spacing: -0.01em; }
        .l3d-card-desc { margin: 0 0 18px; font-size: clamp(14px, 2vw, 15px); line-height: 1.65; color: var(--fg-muted, #6B7684); }
        .l3d-card-how { display: flex; align-items: flex-start; gap: 9px; padding-top: 16px; border-top: 1px solid var(--line-subtle, #EEF0F2); }
        .l3d-card-how-tag { flex-shrink: 0; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 7px; }
        .l3d-card-how-text { font-size: 13px; line-height: 1.55; color: var(--fg-default, #333D4B); }

        /* FINAL */
        .l3d-final { padding: clamp(32px, 6vw, 72px) clamp(20px, 5vw, 48px) clamp(32px, 5vw, 56px); }
        .l3d-final-card {
          max-width: 720px; margin: 0 auto; text-align: center;
          background: linear-gradient(135deg, ${L3D_BRAND} 0%, ${L3D_BRAND_600} 100%);
          border-radius: var(--r-2xl, 28px); padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px);
          box-shadow: 0 24px 60px rgba(27,100,218,0.28);
        }
        .l3d-final-title { margin: 0 0 14px; font-size: clamp(24px, 4.5vw, 40px); font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .l3d-final-sub { margin: 0 auto 30px; max-width: 480px; font-size: clamp(14px, 2.2vw, 17px); line-height: 1.65; color: rgba(255,255,255,0.92); }
        .l3d-final .l3d-btn-ghost { background: rgba(255,255,255,0.16); color: #fff; border-color: rgba(255,255,255,0.42); }
        .l3d-final .l3d-btn-ghost:hover { background: rgba(255,255,255,0.26); }
        .l3d-final .l3d-btn-primary { background: #fff; color: ${L3D_BRAND_600}; box-shadow: 0 8px 24px rgba(0,0,0,0.16); }
        .l3d-final .l3d-btn-primary:hover { background: #F2F4F6; }
        .l3d-footer { margin: clamp(28px, 5vw, 44px) 0 8px; text-align: center; font-size: 12px; color: var(--fg-subtle, #8B95A1); }

        /* Motion (절제된 페이드/슬라이드업) */
        .l3d-reveal { opacity: 0; transform: translateY(18px); transition: opacity var(--t-slow,360ms) var(--ease-toss, ease), transform var(--t-slow,360ms) var(--ease-toss, ease); }
        .l3d-reveal.l3d-in { opacity: 1; transform: none; }
        @keyframes l3dbob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @media (prefers-reduced-motion: reduce) {
          .l3d-reveal { opacity: 1; transform: none; transition: none; }
          .l3d-scrollcue { animation: none; }
          .l3d-root { scroll-behavior: auto; }
        }

        /* Responsive */
        @media (max-width: 920px) { .l3d-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 600px) { .l3d-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

Object.assign(window, { Landing3D });
