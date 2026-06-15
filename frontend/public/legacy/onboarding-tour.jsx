// onboarding-tour.jsx — First-visit guided tour with arrow speech bubbles
// + Feedback/Bug report dialog.

// ────────────────────────────────────────────────────────
// Tooltip with arrow pointing at target element
// ────────────────────────────────────────────────────────
function TourTooltip({ target, title, body, step, total, onNext, onPrev, onSkip, position = 'right' }) {
  const [rect, setRect] = React.useState(null);
  const [containerRect, setContainerRect] = React.useState(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!target) return;
    const update = () => {
      // Find the closest scoped container (the wrapping div we render)
      const container = containerRef.current?.parentElement;
      if (!container) return;
      const el = typeof target === 'string' ? container.querySelector(target) : target;
      if (el) {
        const r = el.getBoundingClientRect();
        const cr = container.getBoundingClientRect();
        setContainerRect(cr);
        // Convert to container-local coordinates
        setRect({
          top: r.top - cr.top,
          left: r.left - cr.left,
          width: r.width,
          height: r.height,
        });
      }
    };
    update();
    const id = setInterval(update, 200); // Update positions if layout changes
    return () => clearInterval(id);
  }, [target]);

  if (!rect) return <div ref={containerRef} style={{ display: 'none' }}/>;

  const W = 280;
  let style = {};
  let arrowStyle = {};
  if (position === 'right') {
    style = { top: rect.top + rect.height/2 - 40, left: rect.left + rect.width + 16, width: W };
    arrowStyle = { position: 'absolute', top: 28, left: -8, width: 16, height: 16, background: 'var(--bg-elevated)', transform: 'rotate(45deg)', boxShadow: '-2px 2px 4px rgba(0,0,0,0.04)' };
  } else if (position === 'left') {
    style = { top: rect.top + rect.height/2 - 40, left: rect.left - W - 16, width: W };
    arrowStyle = { position: 'absolute', top: 28, right: -8, width: 16, height: 16, background: 'var(--bg-elevated)', transform: 'rotate(45deg)', boxShadow: '2px -2px 4px rgba(0,0,0,0.04)' };
  } else if (position === 'top') {
    style = { top: rect.top - 12 - 180, left: rect.left + rect.width/2 - W/2, width: W };
    arrowStyle = { position: 'absolute', bottom: -8, left: W/2 - 8, width: 16, height: 16, background: 'var(--bg-elevated)', transform: 'rotate(45deg)', boxShadow: '2px 2px 4px rgba(0,0,0,0.04)' };
  } else {
    style = { top: rect.top + rect.height + 16, left: rect.left + rect.width/2 - W/2, width: W };
    arrowStyle = { position: 'absolute', top: -8, left: W/2 - 8, width: 16, height: 16, background: 'var(--bg-elevated)', transform: 'rotate(45deg)', boxShadow: '-2px -2px 4px rgba(0,0,0,0.04)' };
  }

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 199 }}>
      {/* Dim overlay using container-bounded fixed pseudo via two layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(17,24,39,0.55)',
        pointerEvents: 'auto',
      }}/>
      {/* Highlight ring around target */}
      <div style={{
        position: 'absolute', top: rect.top - 6, left: rect.left - 6,
        width: rect.width + 12, height: rect.height + 12, borderRadius: 12,
        boxShadow: 'inset 0 0 0 3px rgba(49,130,246,0.6)',
        background: 'rgba(49,130,246,0.08)',
        pointerEvents: 'none',
        animation: 'tourPulse 1.6s ease-in-out infinite',
      }}/>
      <style>{`@keyframes tourPulse { 0%, 100% { box-shadow: inset 0 0 0 3px rgba(49,130,246,0.6); } 50% { box-shadow: inset 0 0 0 5px rgba(49,130,246,0.35); } }`}</style>
      {/* Bubble */}
      <div style={{
        position: 'absolute', ...style,
        background: 'var(--bg-elevated)', borderRadius: 16,
        padding: 18, boxShadow: 'var(--shadow-pop)',
        animation: 'fadeIn 220ms var(--ease-toss)',
        pointerEvents: 'auto',
      }}>
        <div style={arrowStyle}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Chip tone="brand" size="sm" leading={<IcSparkles size={11}/>}>가이드 {step}/{total}</Chip>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">{title}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">{body}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <button onClick={onSkip} style={{ background: 'transparent', border: 'none', color: 'var(--fg-subtle)', fontSize: 12, cursor: 'pointer' }}>건너뛰기</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {step > 1 && <Button variant="ghost" size="sm" onClick={onPrev}>이전</Button>}
            <Button variant="primary" size="sm" onClick={onNext} trailing={step === total ? <IcCheck size={14}/> : <IcArrowRight size={14}/>}>
              {step === total ? '시작하기' : '다음'}
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 10 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{
              width: i === step - 1 ? 18 : 6, height: 6, borderRadius: 999,
              background: i === step - 1 ? 'var(--brand-500)' : 'var(--line-strong)',
              transition: 'all 240ms var(--ease-toss)',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Welcome modal (step 0)
// ────────────────────────────────────────────────────────
function WelcomeModal({ onStart, onSkip, role = 'student' }) {
  const greeting = {
    student: { name: '지훈님', tag: '학생' },
    teacher: { name: '이지원 선생님', tag: '교사' },
    admin: { name: '관리자님', tag: 'Super Admin' },
  }[role];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)', animation: 'fadeIn 240ms var(--ease-std)' }}/>
      <div style={{
        position: 'relative', width: 'min(460px, 100%)',
        background: 'var(--bg-elevated)', borderRadius: 24, padding: 32,
        boxShadow: 'var(--shadow-pop)',
        animation: 'sheetIn 320ms var(--ease-toss)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 12px 28px rgba(49,130,246,0.32)',
        }}>
          <IcCompass size={36}/>
        </div>
        <Chip tone="brand" size="sm" style={{ marginBottom: 12 }}>{greeting.tag}</Chip>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, marginBottom: 8, letterSpacing: '-0.5px' }} className="kr-heading">
          환영해요, {greeting.name}!
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0, marginBottom: 24 }} className="kr-heading">
          진로나침반을 처음 사용하시는군요. 1분 안에 주요 기능을 한 바퀴 안내해드릴게요. 메뉴마다 어디서 무엇을 할 수 있는지 알려드려요.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="primary" size="lg" full leading={<IcSparkles size={16}/>} onClick={onStart}>1분 가이드 시작하기</Button>
          <Button variant="ghost" size="md" full onClick={onSkip}>다음에 할게요</Button>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--fg-subtle)' }} className="kr-heading">
          이 안내는 처음 한 번만 표시돼요. 나중에 내정보 → 도움말에서 다시 볼 수 있어요.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Hook: useTour — manages welcome modal + steps
// ────────────────────────────────────────────────────────
function useTour(steps, role = 'student') {
  const [phase, setPhase] = React.useState('welcome'); // welcome | tour | done
  const [step, setStep] = React.useState(1);
  const next = () => {
    if (step >= steps.length) setPhase('done');
    else setStep(s => s + 1);
  };
  const prev = () => setStep(s => Math.max(1, s - 1));
  const skip = () => setPhase('done');
  const restart = () => { setStep(1); setPhase('welcome'); };
  const current = steps[step - 1];
  return { phase, setPhase, step, next, prev, skip, restart, current, total: steps.length, role };
}

// ────────────────────────────────────────────────────────
// Tour overlay (renders welcome → tooltips)
// ────────────────────────────────────────────────────────
function TourOverlay({ tour }) {
  if (tour.phase === 'done') return null;
  if (tour.phase === 'welcome') {
    return <WelcomeModal role={tour.role} onStart={() => tour.setPhase('tour')} onSkip={() => tour.setPhase('done')}/>;
  }
  if (tour.phase === 'tour' && tour.current) {
    return (
      <TourTooltip
        key={tour.step}
        target={tour.current.target}
        title={tour.current.title}
        body={tour.current.body}
        position={tour.current.position}
        step={tour.step}
        total={tour.total}
        onNext={tour.next}
        onPrev={tour.prev}
        onSkip={tour.skip}
      />
    );
  }
  return null;
}

// Tour step presets ───────────────────────────────────────
const STUDENT_TOUR_STEPS = [
  { target: '[data-tour="student-nav-ai"]', position: 'right', title: 'AI 진로 상담', body: '진로 고민을 자연스러운 대화로 풀어가는 핵심 화면이에요. AI가 단서를 모아 가설을 세워줘요.' },
  { target: '[data-tour="student-nav-targets"]', position: 'right', title: '진로 목표', body: '목표 직업·학과를 최대 3개까지 등록하고 비교할 수 있어요. 목표가 바뀐 이유도 기록돼요.' },
  { target: '[data-tour="student-nav-admissions"]', position: 'right', title: '대학·입시', body: '서울 주요 대학과 학과 입시 정보를 살펴봐요. 관심 학과로 등록하면 AI 입시 분석도 받아요.' },
  { target: '[data-tour="student-nav-grades"]', position: 'right', title: '성적 입력 & 추이', body: '모의고사·내신·수행평가를 입력하면 자동으로 추이가 그려져요. 선생님께도 공유돼요.' },
  { target: '[data-tour="student-nav-study"]', position: 'right', title: '학습 계획', body: '주간 학습 계획과 자습 타임어택을 관리해요. 완료하면 진도에 자동 반영돼요.' },
  { target: '[data-tour="student-nav-counseling"]', position: 'right', title: '상담 · 기록', body: '담임 선생님께 상담을 요청하고, 받은 상담 메모를 확인할 수 있어요.' },
  { target: '[data-tour="student-nav-calendar"]', position: 'right', title: '캘린더', body: '상담·학습 마감·수행평가·모의고사 일정이 한 곳에. "+"로 일정을 추가해보세요.' },
];

const TEACHER_TOUR_STEPS = [
  { target: '[data-tour="teacher-nav-classroom"]', position: 'right', title: '학급 + 초대코드', body: '6자리 초대코드를 학생에게 알려주면 학급에 자동으로 합류해요. 최대 30명까지 관리할 수 있어요.' },
  { target: '[data-tour="teacher-nav-students"]', position: 'right', title: '학생 관리', body: '학급 학생들의 성적·AI 리포트·학습 진도를 한눈에 봐요. 검색·필터로 빠르게 찾을 수 있어요.' },
  { target: '[data-tour="teacher-nav-completion"]', position: 'right', title: '학습 완료 현황', body: '학급 전체의 주간 학습 완료율을 보고, 뒤처지는 학생을 빠르게 찾아 상담할 수 있어요.' },
  { target: '[data-tour="teacher-nav-counseling"]', position: 'right', title: '상담 · 기록', body: '상담 요청을 수락·처리하고, 학급 전체 상담 기록을 검색·관리해요.' },
  { target: '[data-tour="teacher-nav-messages"]', position: 'right', title: '메시지 & 메모', body: '학생과 1:1 메시지, 상담 메모, 상담 예약을 한 화면에서 관리해요.' },
  { target: '[data-tour="teacher-nav-calendar"]', position: 'right', title: '캘린더', body: '상담 일정·학사 일정을 관리하고, 학생들에게 일정·메모를 일괄 발송할 수 있어요.' },
];

// ────────────────────────────────────────────────────────
// Feedback / Bug report dialog
// ────────────────────────────────────────────────────────
const FEEDBACK_TYPES = [
  { id: 'bug', label: '🐛 버그 제보', desc: '오류, 깨진 화면, 안 되는 기능' },
  { id: 'suggestion', label: '💡 기능 건의', desc: '있으면 좋을 기능이 있어요' },
  { id: 'question', label: '❓ 사용법 문의', desc: '사용 중 막힌 부분이 있어요' },
  { id: 'praise', label: '💌 칭찬/감사', desc: '좋은 점을 알려주세요' },
];

const SEVERITY = [
  { id: 'low', label: '낮음', desc: '약간 불편한 정도', tone: 'success' },
  { id: 'mid', label: '보통', desc: '사용하기 어려워요', tone: 'warning' },
  { id: 'high', label: '높음', desc: '서비스를 못 쓰겠어요', tone: 'danger' },
];

function FeedbackButton({ position = 'bottom-right' }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        data-tour="feedback"
        onClick={() => setOpen(true)}
        style={{
          position: 'absolute', zIndex: 90,
          right: 20, bottom: 20,
          padding: '12px 18px', borderRadius: 999,
          border: 'none', cursor: 'pointer',
          background: 'var(--fg-strong)', color: '#fff',
          fontSize: 13, fontWeight: 700,
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'transform 120ms',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <IcMessage size={14}/>
        건의 / 버그 제보
      </button>
      {open && <FeedbackDialog onClose={() => setOpen(false)}/>}
    </>
  );
}

function FeedbackDialog({ onClose }) {
  const [type, setType] = React.useState('bug');
  const [severity, setSeverity] = React.useState('mid');
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [where, setWhere] = React.useState('');
  const [attach, setAttach] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const canSubmit = title.trim() && body.trim();
  if (submitted) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)' }}/>
        <div style={{ position: 'relative', width: 'min(440px,100%)', background: 'var(--bg-elevated)', borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 280ms var(--ease-toss)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <IcCheckCircle size={32}/>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 8 }} className="kr-heading">잘 받았어요!</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 20 }} className="kr-heading">
            소중한 의견 감사합니다. 가입한 이메일로 처리 결과를 알려드릴게요. 평균 24시간 내에 답변드려요.
          </div>
          <div style={{ padding: 10, background: 'var(--bg-muted)', borderRadius: 10, fontSize: 11, color: 'var(--fg-muted)', marginBottom: 20 }} className="num">
            티켓 번호 · <strong style={{ color: 'var(--fg-strong)' }}>FB-2026-0517-3814</strong>
          </div>
          <Button variant="primary" size="md" full onClick={onClose}>확인</Button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)', animation: 'fadeIn 240ms' }}/>
      <div style={{
        position: 'relative', width: 'min(540px, 100%)', maxHeight: '90vh', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: 20, padding: 28,
        boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 320ms var(--ease-toss)',
      }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)' }} className="kr-heading">건의 / 버그 제보</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }} className="kr-heading">진로나침반을 더 좋은 서비스로 만들어주세요.</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>

        {/* Type picker */}
        <FormField label="어떤 내용인가요?" required style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {FEEDBACK_TYPES.map(t => {
              const active = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)} style={{
                  textAlign: 'left', padding: '12px 14px', border: '1px solid',
                  borderColor: active ? 'var(--brand-500)' : 'var(--line)',
                  background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
                  borderRadius: 12, cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--brand-600)' : 'var(--fg-strong)', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }} className="kr-heading">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Severity (only for bug) */}
        {type === 'bug' && (
          <FormField label="심각도" required style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {SEVERITY.map(s => {
                const active = severity === s.id;
                return (
                  <button key={s.id} onClick={() => setSeverity(s.id)} style={{
                    textAlign: 'left', padding: '10px 12px', border: '1px solid',
                    borderColor: active ? `var(--${s.tone})` : 'var(--line)',
                    background: active ? `var(--${s.tone}-bg)` : 'var(--bg-surface)',
                    borderRadius: 10, cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: active ? `var(--${s.tone})` : 'var(--fg-strong)' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </FormField>
        )}

        <FormField label="제목" required style={{ marginBottom: 14 }}>
          <TextInput value={title} onChange={setTitle} placeholder={type === 'bug' ? '예) AI 상담 화면이 멈춰요' : '예) 학습 알림을 카카오톡으로 받고 싶어요'}/>
        </FormField>

        <FormField label="발생 위치" hint="선택 · 어느 화면에서 일어났나요?" style={{ marginBottom: 14 }}>
          <TextInput value={where} onChange={setWhere} placeholder="예) 학생 대시보드 / AI 상담 화면"/>
        </FormField>

        <FormField label="자세한 내용" required hint="버그 제보의 경우 재현 단계를 함께 적어주세요" style={{ marginBottom: 16 }}>
          <Textarea value={body} onChange={setBody} rows={5} placeholder={type === 'bug' ? '1. 어떤 행동을 했고\n2. 어떤 결과를 기대했고\n3. 실제로는 어떤 일이 일어났는지' : '자유롭게 적어주세요'}/>
        </FormField>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--bg-muted)', borderRadius: 10, cursor: 'pointer', marginBottom: 14 }}>
          <input type="checkbox" checked={attach} onChange={() => setAttach(a => !a)} style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>진단 정보 함께 보내기</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">현재 화면 URL, 브라우저 정보, 로그인 ID. 문제 해결에 도움이 돼요.</div>
          </div>
        </label>

        <div style={{ padding: 12, background: 'var(--info-bg)', borderRadius: 10, fontSize: 11, color: 'var(--brand-600)', lineHeight: 1.5, marginBottom: 20 }} className="kr-heading">
          답변은 가입한 이메일로 보내드려요. 긴급한 경우 고객센터 1599-0000 (평일 09~18시)으로 문의해주세요.
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!canSubmit} onClick={() => setSubmitted(true)}>제출하기</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Help center page (linked from profile)
// ────────────────────────────────────────────────────────
function HelpCenterCard({ onTour, onFeedback }) {
  return (
    <Card padding={20} style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 12 }}>도움말</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ListRow
          leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcSparkles size={16}/></div>}
          title="가이드 투어 다시 보기"
          subtitle="처음 들어왔을 때 본 안내를 다시 봐요"
          trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
          onClick={onTour}
        />
        <ListRow
          leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcMessage size={16}/></div>}
          title="건의 / 버그 제보"
          subtitle="불편한 점이나 의견을 알려주세요"
          trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
          onClick={onFeedback}
          divider={false}
        />
      </div>
    </Card>
  );
}

Object.assign(window, {
  TourTooltip, WelcomeModal, TourOverlay, useTour,
  STUDENT_TOUR_STEPS, TEACHER_TOUR_STEPS,
  FeedbackButton, FeedbackDialog, HelpCenterCard,
});
