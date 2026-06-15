// onboarding-flow.jsx — first-login onboarding → first AI counseling session → dashboard.
// Philosophy: onboarding takes only "rough context" (학년/계열/관심/성적대, all with 모름).
// Precise grades are NOT collected here — they fall out of the session as a handoff.

const ONB_STEPS = [
  { id: 'grade', q: '지금 몇 학년이에요?', sub: '대략만 알려줘도 괜찮아요',
    opts: ['중3', '고1', '고2', '고3', 'N수', '아직 모르겠어요'] },
  { id: 'track', q: '계열은 정했어요?', sub: '안 정해도 전혀 문제 없어요',
    opts: ['문과', '이과', '통합', '예체능', '아직 모르겠어요'] },
  { id: 'field', q: '관심 가는 분야가 있어요?', sub: '1~2개만 골라도 되고, 몰라도 돼요', multi: true,
    opts: ['공학·IT', '의료·보건', '경영·경제', '인문·사회', '예술·디자인', '교육', '아직 모르겠어요'] },
  { id: 'grade_band', q: '요즘 성적대는 어느 정도예요?', sub: '정확한 점수는 나중에. 느낌만요',
    opts: ['상위권', '중상위권', '중위권', '중하위권', '아직 모르겠어요'] },
];

function OnboardingFlow({ role = 'student', onFinish }) {
  const [phase, setPhase] = React.useState('intro'); // intro | chips | session | done
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [other, setOther] = React.useState('');

  if (role === 'teacher') return <TeacherOnboarding onFinish={onFinish}/>;

  const cur = ONB_STEPS[step];
  const pick = (opt) => {
    if (cur.multi) {
      setAnswers(a => {
        const prev = a[cur.id] || [];
        if (opt === '아직 모르겠어요') return { ...a, [cur.id]: ['아직 모르겠어요'] };
        const cleaned = prev.filter(x => x !== '아직 모르겠어요');
        return { ...a, [cur.id]: cleaned.includes(opt) ? cleaned.filter(x => x !== opt) : [...cleaned, opt] };
      });
    } else {
      setAnswers(a => ({ ...a, [cur.id]: opt }));
    }
  };
  const isPicked = (opt) => cur.multi ? (answers[cur.id] || []).includes(opt) : answers[cur.id] === opt;
  const canNext = cur.multi ? ((answers[cur.id] || []).length > 0 || (cur.id === 'field' && other.trim())) : !!answers[cur.id];
  const next = () => { if (step < ONB_STEPS.length - 1) setStep(s => s + 1); else setPhase('explain'); };

  if (phase === 'intro') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          {typeof CompassMascot !== 'undefined' && <CompassMascot size={130}/>}
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.6px', marginTop: 20, lineHeight: 1.3 }} className="kr-heading">
            반가워요!<br/>딱 4가지만 물어볼게요
          </div>
          <div style={{ fontSize: 14.5, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.6 }} className="kr-heading">
            진로를 아직 못 정해도 괜찮아요.<br/>"모르겠어요"도 좋은 출발점이에요.
          </div>
          <div style={{ marginTop: 14, padding: '8px 14px', background: 'var(--brand-50)', borderRadius: 999, fontSize: 12.5, color: 'var(--brand-600)', fontWeight: 600 }}>
            성적 입력은 없어요 · 1분이면 끝나요
          </div>
        </div>
        <div style={{ padding: '0 20px 22px' }}>
          <Button variant="primary" size="xl" full onClick={() => setPhase('chips')}>시작하기</Button>
        </div>
      </div>
    );
  }

  if (phase === 'chips') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
        <div style={{ padding: '14px 20px 0' }}>
          {/* progress */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            {ONB_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--brand-500)' : 'var(--line)' }}/>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{step + 1} / {ONB_STEPS.length}</div>
        </div>
        <div style={{ flex: 1, padding: '24px 24px 0', overflow: 'auto' }} className="toss-scroll">
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px' }} className="kr-heading">{cur.q}</div>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8 }} className="kr-heading">{cur.sub}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
            {cur.opts.map(opt => {
              const on = isPicked(opt);
              const unknown = opt === '아직 모르겠어요';
              return (
                <button key={opt} onClick={() => pick(opt)} style={{
                  padding: '12px 18px', borderRadius: 14, cursor: 'pointer',
                  fontSize: 15, fontWeight: 600,
                  border: `1.5px solid ${on ? 'var(--brand-500)' : 'var(--line-strong)'}`,
                  background: on ? 'var(--brand-500)' : (unknown ? 'var(--bg-muted)' : 'var(--bg-surface)'),
                  color: on ? '#fff' : (unknown ? 'var(--fg-muted)' : 'var(--fg-strong)'),
                  transition: 'all 140ms var(--ease-std)',
                }} className="kr-heading">
                  {unknown && !on && <span style={{ marginRight: 4 }}>🤔</span>}{opt}
                </button>
              );
            })}
          </div>
          {cur.multi && <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 14 }}>여러 개 선택할 수 있어요</div>}
          {cur.id === 'field' && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-default)', marginBottom: 8 }}>기타 (직접 입력)</div>
              <TextInput value={other} onChange={(v) => { setOther(v); setAnswers(a => ({ ...a, field_other: v })); }} placeholder="예) 항공·우주, 요리, 스포츠 등"/>
            </div>
          )}
        </div>
        <div style={{ padding: '0 20px 22px', display: 'flex', gap: 10 }}>
          {step > 0 && <Button variant="secondary" size="xl" onClick={() => setStep(s => s - 1)} style={{ flex: '0 0 92px' }}>이전</Button>}
          <Button variant="primary" size="xl" full disabled={!canNext} onClick={next}>
            {step < ONB_STEPS.length - 1 ? '다음' : 'AI 상담 시작'}
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'explain') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
        <ScreenHeader leading={<BackButton onClick={() => setPhase('chips')}/>}/>
        <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '8px 28px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #7B61FF, #3182F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <IcMessage size={28}/>
          </div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px', lineHeight: 1.3 }} className="kr-heading">
            잠깐, AI 상담이<br/>왜 필요할까요?
          </div>
          <div style={{ fontSize: 14.5, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.65 }} className="kr-heading">
            진로는 점수로 정해지지 않아요. 무엇을 할 때 즐거운지, 어떤 걸 잘하는지 같은 <strong style={{ color: 'var(--fg-default)' }}>"단서"</strong>가 모여야 방향이 보여요.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {[
              { icon: <IcMessage/>, t: '편하게 대화해요', d: '정답이 없어요. 떠오르는 대로 답하면 돼요.' },
              { icon: <IcSparkles/>, t: 'AI가 단서를 모아요', d: '대화 속 흥미·강점·가치를 찾아 정리해줘요.' },
              { icon: <IcTarget/>, t: '방향을 함께 좁혀요', d: '단서가 쌓이면 어울리는 진로를 제안해요.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{React.cloneElement(s.icon, { size: 20 })}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{s.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.5 }} className="kr-heading">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
            대화 내용은 본인과 담당 선생님만 볼 수 있어요. 부담 갖지 말고 시작해보세요.
          </div>
        </div>
        <div style={{ padding: '12px 20px 22px' }}>
          <Button variant="primary" size="xl" full onClick={() => setPhase('session')} leading={<IcMessage size={17}/>}>대화 시작하기</Button>
        </div>
      </div>
    );
  }

  if (phase === 'session') {
    return <FirstCounselingSession answers={answers} onHandoff={() => setPhase('done')} onSkip={() => setPhase('done')}/>;
  }

  // done → enter dashboard
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <IcCheckCircle size={40}/>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px', lineHeight: 1.3 }} className="kr-heading">
          준비됐어요!<br/>이제 나만의 진로 여정을 시작해요
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.6 }} className="kr-heading">
          오늘 나눈 대화는 대시보드에 저장됐어요.<br/>언제든 이어서 상담할 수 있어요.
        </div>
      </div>
      <div style={{ padding: '0 20px 22px' }}>
        <Button variant="primary" size="xl" full onClick={onFinish}>대시보드로 가기</Button>
      </div>
    </div>
  );
}

// First AI counseling session — AI speaks first, uses onboarding context.
function FirstCounselingSession({ answers, onHandoff, onSkip }) {
  const grade = answers.grade && answers.grade !== '아직 모르겠어요' ? answers.grade : null;
  const track = answers.track && answers.track !== '아직 모르겠어요' ? answers.track : null;
  const ctx = [grade, track].filter(Boolean).join(' ');
  const opening = ctx
    ? `${ctx}구나. 분야는 아직 정하는 중이지? 그거 같이 찾으려고 온 거니까 천천히 보자.`
    : '아직 진로가 막막하구나. 괜찮아, 그거 같이 찾으려고 온 거니까 천천히 보자.';

  const SCRIPT = [
    { role: 'ai', text: opening },
    { role: 'ai', text: '먼저 가볍게 — 요즘 뭐 할 때 시간 가는 줄 모르겠어?' },
  ];
  const FOLLOWUPS = [
    '오 그거 재밌었겠다. 그때 어떤 점이 제일 좋았어?',
    '좋아. 그럼 학교 과목 중에 그나마 덜 싫은 건 뭐야?',
  ];
  const DIRECTION = '얘기 들어보니 무언가를 만들거나 표현하는 쪽에 흥미가 있어 보여. 콘텐츠·디자인 같은 분야도 한 번 볼 만하고, 관련해서 어떤 길이 있는지 천천히 같이 살펴보자.';

  const [msgs, setMsgs] = React.useState(SCRIPT);
  const [input, setInput] = React.useState('');
  const [turn, setTurn] = React.useState(0);
  const [thinking, setThinking] = React.useState(false);
  const [handoff, setHandoff] = React.useState(false);
  const scRef = React.useRef(null);
  React.useEffect(() => { if (scRef.current) scRef.current.scrollTop = scRef.current.scrollHeight; }, [msgs, thinking, handoff]);

  const send = (text) => {
    if (!text.trim() || handoff) return;
    setMsgs(m => [...m, { role: 'user', text }]); setInput(''); setThinking(true);
    setTimeout(() => {
      setThinking(false);
      if (turn < FOLLOWUPS.length) {
        setMsgs(m => [...m, { role: 'ai', text: FOLLOWUPS[turn] }]);
        setTurn(t => t + 1);
      } else {
        setMsgs(m => [...m, { role: 'ai', text: DIRECTION }]);
        setTimeout(() => setHandoff(true), 600);
      }
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, #7B61FF, #3182F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>AI</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>첫 진로 상담</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>편하게 답해도 괜찮아요</div>
        </div>
      </div>

      <div ref={scRef} className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 6, alignItems: 'flex-end' }}>
              {!isUser && <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #7B61FF, #3182F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>AI</div>}
              <div style={{ maxWidth: '80%', padding: '10px 14px', fontSize: 14, lineHeight: 1.5, background: isUser ? 'var(--brand-500)' : 'var(--bg-surface)', color: isUser ? '#fff' : 'var(--fg-strong)', borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px', boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }} className="kr-heading">{m.text}</div>
            </div>
          );
        })}
        {thinking && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #7B61FF, #3182F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>AI</div>
            <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-subtle)', animation: `bounce 1.2s ${i*0.16}s infinite ease-in-out` }}/>)}
              <style>{`@keyframes bounce{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}`}</style>
            </div>
          </div>
        )}
        {handoff && (
          <div style={{ marginTop: 8, padding: 16, borderRadius: 16, background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)', border: '1px solid rgba(49,130,246,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <IcTarget size={15} color="var(--brand-600)"/>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-600)' }}>다음 단계</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-default)', lineHeight: 1.55, marginBottom: 14 }} className="kr-heading">
              더 구체적인 학과·대학을 추천받으려면 성적이 필요해. 입력해주면 너한테 맞는 걸 추려줄게.
            </div>
            <Button variant="primary" size="lg" full leading={<IcChart size={16}/>} onClick={onHandoff} style={{ marginBottom: 8 }}>성적 입력하고 추천받기</Button>
            <Button variant="ghost" size="md" full onClick={onSkip}>조금 더 얘기할래</Button>
          </div>
        )}
      </div>

      {!handoff && (
        <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderTop: '1px solid var(--line-subtle)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-muted)', borderRadius: 24, padding: '6px 6px 6px 16px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(input); }} placeholder="편하게 답해보세요" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--fg-strong)', minWidth: 0 }}/>
            <button onClick={() => send(input)} disabled={!input.trim()} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: input.trim() ? 'var(--brand-500)' : 'var(--line-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default' }}><IcSend size={16}/></button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, overflow: 'auto' }} className="toss-scroll">
            {['잘 모르겠어요', '음... 게임이요', '영상 보는 거요'].map(q => (
              <button key={q} onClick={() => send(q)} style={{ flexShrink: 0, border: '1px solid var(--line)', background: 'var(--bg-surface)', borderRadius: 999, padding: '7px 12px', fontSize: 12.5, color: 'var(--fg-default)', cursor: 'pointer', whiteSpace: 'nowrap' }}>{q}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherOnboarding({ onFinish }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    { icon: <IcSchool/>, title: '학급을 만들었어요', body: '한빛고 2-3 학급이 생성됐어요. 학교·학급 정보는 언제든 바꿀 수 있어요.' },
    { icon: <IcCopy/>, title: '초대코드로 학생을 초대해요', body: '학생이 회원가입 때 코드를 입력하면 자동으로 학급에 참여해요. 무료 체험 중에도 사용할 수 있어요.' },
    { icon: <IcUsers/>, title: '학생 한 명씩 살펴봐요', body: '성적 추이, AI 진로 단서, 학습 진도, 상담 요청을 한 화면에서 확인할 수 있어요.' },
  ];
  const cur = steps[step];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 5 }}>
        {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--accent-purple)' : 'var(--line)' }}/>)}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          {React.cloneElement(cur.icon, { size: 40 })}
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px' }} className="kr-heading">{cur.title}</div>
        <div style={{ fontSize: 14.5, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.6 }} className="kr-heading">{cur.body}</div>
      </div>
      <div style={{ padding: '0 20px 22px' }}>
        <Button variant="primary" size="xl" full style={{ background: 'var(--accent-purple)' }}
          onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else onFinish(); }}>
          {step < steps.length - 1 ? '다음' : '대시보드로 가기'}
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingFlow, FirstCounselingSession, TeacherOnboarding, ONB_STEPS, MobileCoachTour });

// ── Mobile coachmark tour — translucent overlay + bubble above bottom-nav targets ──
const MOBILE_TOUR = {
  student: [
    { sel: '[data-tour="mnav-dashboard"]', title: '홈', body: '오늘의 진로 질문·성적·이번 주 액션을 한눈에 봐요.' },
    { sel: '[data-tour="mnav-grades-trend"]', title: '성적', body: '모의고사·내신 추이와 과목별 분석을 확인해요.' },
    { sel: '[data-tour="mnav-career-report"]', title: '진로', body: 'AI 상담과 진로 리포트가 모이는 핵심 메뉴예요.' },
    { sel: '[data-tour="mnav-calendar"]', title: '캘린더', body: '상담·수행평가·모의고사 일정이 모두 모여요.' },
    { sel: '[data-tour="mnav-profile"]', title: '더보기', body: '내 정보·구독·공지사항·건의를 여기서 찾아요.' },
  ],
  teacher: [
    { sel: '[data-tour="mnav-dashboard"]', title: '홈', body: '학급 요약과 오늘 주목할 학생을 봐요.' },
    { sel: '[data-tour="mnav-students"]', title: '학생', body: '학생별 성적·AI 리포트·학습을 관리해요.' },
    { sel: '[data-tour="mnav-completion"]', title: '학습', body: '학급 전체 학습 완료 현황을 확인해요.' },
    { sel: '[data-tour="mnav-messages"]', title: '메시지', body: '학생과 1:1 메시지·상담 메모를 주고받아요.' },
    { sel: '[data-tour="mnav-more"]', title: '더보기', body: '학급·캘린더·알림·결제·내 정보가 모여 있어요.' },
  ],
};

function MobileCoachTour({ role = 'student', onDone }) {
  const steps = MOBILE_TOUR[role] || MOBILE_TOUR.student;
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const last = i === steps.length - 1;
  React.useEffect(() => {
    const el = document.querySelector(steps[i].sel);
    if (el) {
      const r = el.getBoundingClientRect();
      const host = el.closest('[data-app-root]') || document.body;
      const hr = host.getBoundingClientRect();
      setRect({ left: r.left - hr.left, top: r.top - hr.top, width: r.width, height: r.height, bottom: r.bottom - hr.top });
    } else setRect(null);
  }, [i, role]);
  const s = steps[i];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90 }}>
      <div onClick={() => last ? onDone() : setI(i + 1)} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.6)', animation: 'fadeIn .2s ease' }}/>
      {rect && (
        <div style={{ position: 'absolute', left: rect.left - 4, top: rect.top - 4, width: rect.width + 8, height: rect.height + 8, borderRadius: 12, boxShadow: '0 0 0 3px var(--brand-500), 0 0 0 9999px rgba(17,24,39,0.6)', pointerEvents: 'none', transition: 'all .25s var(--ease-toss)' }}/>
      )}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: rect ? `calc(100% - ${rect.top}px + 18px)` : 120, animation: 'sheetIn .3s var(--ease-toss)' }}>
        <div style={{ position: 'relative', background: 'var(--bg-elevated)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-pop)' }}>
          {/* downward arrow pointing at the highlighted target */}
          {rect && (
            <div style={{
              position: 'absolute', top: '100%',
              left: Math.max(16, Math.min(rect.left + rect.width / 2 - 16, (typeof window !== 'undefined' ? 360 : 360))),
              width: 0, height: 0,
              borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
              borderTop: '12px solid var(--bg-elevated)',
              filter: 'drop-shadow(0 3px 2px rgba(17,24,39,0.12))',
            }}/>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg-strong)' }} className="kr-heading">{s.title}</span>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{i + 1}/{steps.length}</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">{s.body}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={onDone} style={{ border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 4px' }}>건너뛰기</button>
            <div style={{ flex: 1 }}/>
            {i > 0 && <Button variant="secondary" size="sm" onClick={() => setI(i - 1)}>이전</Button>}
            <Button variant="primary" size="sm" onClick={() => last ? onDone() : setI(i + 1)}>{last ? '시작하기' : '다음'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
