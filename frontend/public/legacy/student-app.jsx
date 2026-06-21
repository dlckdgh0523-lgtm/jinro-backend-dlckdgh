// student-app.jsx — Student prototype (mobile, iOS frame)
// Internal navigation between: dashboard, AI counseling, career report,
// grades input/trend, billing, profile, notifications drawer.

const STUDENT_NAV = [
  { id: 'dashboard', label: '홈', icon: <IcHome/> },
  { id: 'grades-trend', label: '성적', icon: <IcChart/> },
  { id: 'career-report', label: '진로', icon: <IcCompass/> },
  { id: 'calendar', label: '캘린더', icon: <IcCalendar/> },
  { id: 'profile', label: '더보기', icon: <IcMore/> },
];

// Demo data ───────────────────────────────────────────────
// 실 데이터 — GET /notifications (StudentApp에서 적재해 NotificationDrawer로 전달).
// 로드 전/없으면 빈 배열.
const STUDENT_NOTIFICATIONS = [];

const AI_CHAT_INITIAL = [
  { role: 'ai', text: '안녕 지훈아, 진로나침반이에요. 오늘은 가볍게 시작해볼게요. 요즘 학교에서 가장 몰입해서 한 일이 있다면 뭐였어요?' },
  { role: 'user', text: '동아리에서 영상 편집을 했어요. 축제 영상 만드는 게 재밌었어요.' },
  { role: 'ai', text: '영상 만들 때 어떤 부분이 제일 재밌었어요? 촬영, 편집, 기획 중에서요.' },
  { role: 'user', text: '편집할 때요. 컷 순서 바꾸면서 분위기 바뀌는 게 신기했어요.' },
  { role: 'ai', text: '그렇구나. 그럼 친구들이 그 영상을 보고 어떤 반응이었을 때 가장 기뻤어요?' },
];

const SIGNALS = [
  { tag: '흥미', text: '영상 편집, 컷 구성', tone: 'brand' },
  { tag: '강점', text: '시각적 흐름 감각', tone: 'mint' },
  { tag: '가치', text: '타인의 반응, 표현', tone: 'purple' },
  { tag: '맥락', text: '동아리 활동 몰입', tone: 'info' },
];

const QUICK_REPLIES = [
  '좀 더 생각해볼게요',
  '잘 모르겠어요',
  '예시를 들어줄 수 있어요?',
];

// Dashboard loading skeleton — mirrors the real layout's rhythm
function StudentDashboardSkeleton() {
  return (
    <div style={{ padding: '12px 16px 24px', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Skeleton width={160} height={24}/>
          <Skeleton width={120} height={14} style={{ marginTop: 8 }}/>
        </div>
        <Skeleton width={40} height={40} radius={10}/>
      </div>
      <Skeleton height={150} radius={16} style={{ marginBottom: 16 }}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {[0,1,2,3].map(i => <Skeleton key={i} height={72} radius={14}/>)}
      </div>
      <Skeleton height={130} radius={16} style={{ marginBottom: 12 }}/>
      <Skeleton height={200} radius={16}/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Dashboard
// ────────────────────────────────────────────────────────
function StudentDashboard({ go, openNotif, variant = 'A' }) {
  // Connect to the (mock/real) API layer so the dev API-state toggle drives
  // real loading / error states on the student home, not just the teacher list.
  const dash = (typeof useApi === 'function')
    ? useApi(() => (typeof dataApi !== 'undefined' ? dataApi.studentDashboard() : mockApi.studentDashboard()), [])
    : { loading: false, error: null, data: {} };

  // 실 사용자 이름 — GET /auth/me. 로드 전까지는 이름 없이 인사.
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); } })();
  }, []);

  // 알림 배지 — 미읽음 개수 실데이터 (GET /notifications?unreadOnly=true). 실패/0이면 배지 숨김.
  const [unread, setUnread] = React.useState(0);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch('/notifications?unreadOnly=true&limit=50', { method: 'GET' });
        const items = Array.isArray(r.data) ? r.data : (r.data || []);
        setUnread(items.filter(n => !n.read).length);
      } catch (e) { setUnread(0); }
    })();
  }, []);

  if (dash.loading) return <StudentDashboardSkeleton/>;
  if (dash.error) return (
    <div style={{ padding: '24px 16px', background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ErrorState title="대시보드를 불러오지 못했어요" body={dash.error.message} onRetry={dash.refetch}/>
    </div>
  );

  // 진로나침반 기능 소개 카드 (배포 마케팅) — 학생이 모르고 안 쓰는 일 방지
  const FEATURES = [
    { id: 'volunteer', emoji: '🤝', title: '봉사활동 검색', desc: '청소년 가능 봉사 1,000+건 · 학종 인성평가 반영', goTo: 'volunteer' },
    { id: 'experience', emoji: '🎯', title: '진로·직업체험', desc: '커리어넷 자료 455+건 · 학생부 전공적합성 핵심', goTo: 'materials' },
    { id: 'foreign', emoji: '🌏', title: '해외대학', desc: '미국·일본·영국 등 학비·졸업률·취업률', goTo: 'foreign' },
    { id: 'scholarship', emoji: '💰', title: '장학금', desc: '한국장학재단 1,850+건 · 지자체·기업 장학금', goTo: 'scholarship' },
    { id: 'employment', emoji: '📊', title: '대학 취업률', desc: '학과별 취업률·유지율 데이터', goTo: 'admissions-hub' },
    { id: 'ai', emoji: '🤖', title: 'AI 진로 상담', desc: '단계별 맞춤 상담 · 데이터 근거 추천', goTo: 'ai-chat' },
  ];

  return (
    <div style={{ padding: '12px 16px 24px', background: 'var(--bg-canvas)' }}>
      {/* greeting row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)',
            letterSpacing: '-0.4px', lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {me && me.name ? `안녕하세요, ${me.name}님` : '안녕하세요'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>오늘도 한 걸음씩 나아가볼까요?</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <IconButton icon={<IcBell size={22}/>} onClick={openNotif} badge={unread} ariaLabel="알림"/>
        </div>
      </div>

      {variant === 'A' ? <DashboardHeroA go={go}/> : <DashboardHeroB go={go}/>}

      {/* 진로나침반 기능 소개 — 마케팅 카드 */}
      <div style={{ marginTop: 16, marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8, padding: '0 2px' }}>
          진로나침반에서 할 수 있는 것
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
          {FEATURES.map((f) => (
            <div
              key={f.id}
              onClick={() => go(f.goTo)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'transform .1s, box-shadow .1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{f.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming career dates — 1-column, right under goal hero */}
      <div style={{ marginTop: 12 }}>
        <UpcomingDatesCard go={go}/>
      </div>

      {/* NEW: Next question card */}
      <div style={{ marginTop: 12 }}>
        <QuestionCard q={QUESTION_CARDS[0]} compact onAnswer={() => go('ai-counseling')}/>
      </div>

      {/* NEW: Strategy status */}
      <div style={{ marginTop: 12 }}>
        <StrategyStatusCard status="forming" evidenceCount={9} lastUpdated="2026-05-16"/>
      </div>

      {/* NEW: Weekly actions */}
      <div style={{ marginTop: 12 }}>
        <WeeklyActionsCard go={go}/>
      </div>

      {/* Quick actions row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '16px 0' }}>
        {[
          { id: 'ai', label: 'AI 상담', icon: <IcSparkles/>, color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)', go: 'ai-counseling' },
          { id: 'admissions', label: '대학·입시', icon: <IcGraduation/>, color: 'var(--brand-600)', bg: 'var(--brand-50)', go: 'admissions-hub' },
          { id: 'messages', label: '메시지', icon: <IcMessage/>, color: 'var(--success)', bg: 'var(--success-bg)', go: 'messages' },
          { id: 'calendar', label: '캘린더', icon: <IcCalendar/>, color: 'var(--accent-mint)', bg: 'var(--accent-mint-bg)', go: 'calendar' },
        ].map(q => (
          <button key={q.id} onClick={() => go(q.go)} style={{
            border: 'none', background: 'var(--bg-surface)', borderRadius: 14, padding: '12px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: q.bg, color: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {React.cloneElement(q.icon, { size: 18 })}
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--fg-default)' }}>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Today's career question — removed (duplicate of QuestionCard above) */}

      {/* Recent grade trend */}
      <SectionCard
        title="최근 성적 변화"
        action={<button onClick={() => go('grades-trend')} style={{ border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
          자세히<IcChevronRight size={14}/>
        </button>}
        style={{ marginBottom: 12 }}
      >
        <MiniTrendChart/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>평균</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)' }}>84.8<span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>점</span></div>
          </div>
          <Chip tone="success" leading={<IcArrowUp size={11}/>}>+2.4 지난 모의고사 대비</Chip>
        </div>
        {/* Per-subject mini bars */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, alignItems: 'flex-end', height: 64 }}>
          {[{s:'국',v:93,t:'success'},{s:'수',v:82,t:'success'},{s:'영',v:88,t:'success'},{s:'사',v:91,t:'neutral'},{s:'과',v:70,t:'danger'}].map(b => (
            <div key={b.s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span className="num" style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)' }}>{b.v}</span>
              <div style={{ width: '100%', height: (b.v/100)*40, borderRadius: 6, background: `var(--${b.t === 'neutral' ? 'line-strong' : b.t})`, opacity: b.t==='neutral'?0.6:1 }}/>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{b.s}</span>
            </div>
          ))}
        </div>
        <Button variant="brandSoft" size="md" full leading={<IcPlus size={16}/>} onClick={() => go('grades-input')} style={{ marginTop: 14 }}>
          이번 시험 성적 입력하기
        </Button>
      </SectionCard>

      {/* Study + Messages sections removed: study folded into WeeklyActionsCard, messages live in 메시지 tab */}

      {/* 다가오는 상담: 실제 상담 일정은 캘린더(/calendar)에서 관리 — 대시보드 가짜 카드 제거 */}

      {/* Trial status */}
      <Card padding={16} onClick={() => go('billing')} hoverable>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Chip tone="info" size="sm">학생 플랜 · 무료 체험</Chip>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 6 }}>무료 체험 18일 남음</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>5월 31일까지 모든 기능 사용 가능</div>
          </div>
          <IcChevronRight size={20} color="var(--fg-subtle)"/>
        </div>
      </Card>
    </div>
  );
}

function DashboardHeroA({ go }) {
  return (
    <Card padding={20} style={{
      background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)',
      color: '#fff', marginBottom: 0, boxShadow: '0 12px 28px rgba(49,130,246,0.32)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>나의 목표</div>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 4, wordBreak: 'keep-all' }} className="kr-heading">미디어 콘텐츠 디자이너</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>한국예술종합학교 · 영상이론과</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(20px)',
        }}>
          <IcTarget size={22} color="#fff"/>
        </div>
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '16px 0' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 2 }}>AI 상담 진행도</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>62%</div>
            <div style={{ width: 80, height: 5, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: '#fff' }}/>
            </div>
          </div>
        </div>
        <button onClick={() => go('career-report')} style={{
          border: 'none', background: '#fff', color: 'var(--brand-600)',
          padding: '8px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        }}>리포트 보기</button>
      </div>
    </Card>
  );
}

function DashboardHeroB({ go }) {
  return (
    <Card padding={20} style={{ marginBottom: 0, border: '1px solid var(--line-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Chip tone="brand" size="sm">나의 목표</Chip>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>수정</button>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.5px' }} className="kr-heading">
        미디어 콘텐츠 디자이너
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>한국예술종합학교 · 영상이론과</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <div style={{ flex: 1, padding: 12, background: 'var(--brand-50)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--brand-600)', fontWeight: 600 }}>AI 상담 진행도</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-600)', marginTop: 4 }}>62%</div>
        </div>
        <div style={{ flex: 1, padding: 12, background: 'var(--success-bg)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>달성률</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)', marginTop: 4 }}>74%</div>
        </div>
      </div>
    </Card>
  );
}

function MiniTrendChart() {
  // 5 months of mock data, simple SVG line + area
  const pts = [78, 80, 82.5, 83.2, 84.8];
  const w = 320, h = 80, pad = 8;
  const max = 90, min = 70;
  const xs = pts.map((_, i) => pad + (i * (w - pad * 2)) / (pts.length - 1));
  const ys = pts.map(p => h - pad - ((p - min) / (max - min)) * (h - pad * 2));
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaPath = linePath + ` L${xs[xs.length-1]},${h} L${xs[0]},${h} Z`;
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3182F6" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#3182F6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#ga)"/>
        <path d={linePath} fill="none" stroke="#3182F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r={i === xs.length-1 ? 4 : 3}
            fill={i === xs.length-1 ? '#3182F6' : '#fff'}
            stroke="#3182F6" strokeWidth="2"/>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--fg-subtle)', padding: '4px 4px 0' }}>
        <span>1월</span><span>2월</span><span>3월</span><span>4월</span><span>5월</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: AI Counseling Chat (core)
// ────────────────────────────────────────────────────────
function AICounseling({ go, openSignals }) {
  // 실 백엔드 AI 상담 (SSE). 전역 __apiFetch/__apiStream이 토큰 자동 갱신(401→refresh) 처리.
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const [signals, setSignals] = React.useState([]);
  const [stage, setStage] = React.useState('explore');
  const [evidenceCount, setEvidenceCount] = React.useState(0);
  const [progress, setProgress] = React.useState(10);
  const [initErr, setInitErr] = React.useState(false);
  const [showSig, setShowSig] = React.useState(false);
  const scrollRef = React.useRef(null);
  const SIG_TONE = { '흥미': 'brand', '강점': 'mint', '가치': 'purple', '맥락': 'info' };

  const initSession = React.useCallback(async () => {
    if (!window.__isLoggedIn || !window.__isLoggedIn()) { setMsgs([{ role: 'ai', text: '로그인하면 AI 진로 상담을 시작할 수 있어요.' }]); return; }
    setInitErr(false);
    try {
      const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' });
      let sid = active && active.data && active.data.id;
      if (sid) {
        const t = await window.__apiFetch('/ai-counseling/sessions/' + sid + '/transcript', { method: 'GET' });
        const loaded = (t.data.messages || []).map(m => ({ role: m.role, text: m.text }));
        setMsgs(loaded.length ? loaded : [{ role: 'ai', text: '안녕하세요, 진로나침반이에요. 요즘 학교에서 가장 몰입해서 한 일이 있다면 뭐였어요?' }]);
      } else {
        const created = await window.__apiFetch('/ai-counseling/sessions', { method: 'POST' });
        sid = created.data.id;
        setMsgs([{ role: 'ai', text: '안녕하세요, 진로나침반이에요. 오늘은 가볍게 시작해볼게요. 요즘 학교에서 가장 몰입해서 한 일이 있다면 뭐였어요?' }]);
      }
      setSessionId(sid);
      refreshProgress(sid);
    } catch (e) {
      setInitErr(true);
      setMsgs([{ role: 'ai', text: (e && e.body && e.body.message) || '상담을 불러오지 못했어요. 다시 시도 버튼을 눌러주세요.' }]);
    }
  }, []);

  React.useEffect(() => { initSession(); }, [initSession]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  const refreshProgress = async (sid) => {
    try {
      const p = await window.__apiFetch('/ai-counseling/sessions/' + sid + '/progress', { method: 'GET' });
      setSignals(p.data.signals || []);
      setEvidenceCount(p.data.evidenceCount || 0);
      setStage(p.data.stage || 'explore');
      setProgress(p.data.completeness || 10);
    } catch (e) {}
  };

  const send = async (text) => {
    if (!text.trim() || thinking) return;
    // 세션이 없으면(초기화 실패) 먼저 복구 시도
    let sid = sessionId;
    if (!sid) {
      try {
        const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' });
        sid = (active && active.data && active.data.id) || (await window.__apiFetch('/ai-counseling/sessions', { method: 'POST' })).data.id;
        setSessionId(sid);
      } catch (e) { setInitErr(true); return; }
    }
    setMsgs(m => [...m, { role: 'user', text }, { role: 'ai', text: '' }]);
    setInput('');
    setThinking(true);
    await window.__apiStream('/ai-counseling/sessions/' + sid + '/messages', { text }, {
      onToken: (delta) => {
        setThinking(false);
        setMsgs(m => { const c = [...m]; c[c.length - 1] = { role: 'ai', text: (c[c.length - 1].text || '') + delta }; return c; });
      },
      onDone: () => { setThinking(false); refreshProgress(sid); },
      onError: (code, message) => {
        setThinking(false);
        setMsgs(m => { const c = [...m]; c[c.length - 1] = { role: 'ai', text: message || '오류가 발생했어요.' }; return c; });
      },
    });
    setThinking(false);
  };

  const STAGE_LABEL = { explore: '① 탐색', profile: '② 파악', recommend: '③ 추천', prepare: '④ 준비' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px 12px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--line-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton onClick={() => go('dashboard')}/>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>AI 진로 상담</div>
          <IconButton icon={<IcMore size={20}/>} ariaLabel="더보기"/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <ProgressBar value={progress} height={4}/>
          <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', minWidth: 36, textAlign: 'right' }}>{progress}%</span>
        </div>
        {/* 단계 스테퍼 — 대화로 단서가 쌓이면 자동으로 다음 단계로 넘어가요 */}
        {(() => {
          const STEPS = [['explore','탐색'],['profile','파악'],['recommend','추천'],['prepare','준비']];
          const cur = STEPS.findIndex(s => s[0] === stage);
          const hint = stage === 'explore' ? `단서를 ${Math.max(1, 2 - signals.length)}개 더 모으면 ‘파악’ 단계로 넘어가요`
            : stage === 'profile' ? `단서를 ${Math.max(1, 4 - signals.length)}개 더 모으면 ‘추천’ 단계로 넘어가요`
            : stage === 'recommend' ? `마음에 드는 진로를 ‘진로 목표’로 저장하면 ‘준비’ 단계로 넘어가요`
            : `입시·성적과 연결해 상담을 마무리해요`;
          return (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {STEPS.map(([id, label], i) => (
                  <React.Fragment key={id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: i <= cur ? 'var(--brand-500)' : 'var(--bg-muted)', color: i <= cur ? '#fff' : 'var(--fg-subtle)' }}>{i + 1}</span>
                      <span style={{ fontSize: 11, fontWeight: i === cur ? 700 : 500, color: i === cur ? 'var(--brand-600)' : 'var(--fg-subtle)' }}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <span style={{ flex: 1, height: 1, background: i < cur ? 'var(--brand-500)' : 'var(--line-subtle)' }}/>}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>💡 {hint}</div>
            </div>
          );
        })()}
        <button onClick={() => setShowSig(s => !s)} style={{
          marginTop: 8, padding: '6px 10px', borderRadius: 8,
          border: '1px solid var(--line)', background: 'var(--bg-muted)',
          fontSize: 11, color: 'var(--fg-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'space-between',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IcSparkles size={12} color="var(--accent-purple)"/>
            <span>지금까지 파악한 단서 <strong className="num" style={{ color: 'var(--fg-strong)' }}>{signals.length}</strong>개 · {STAGE_LABEL[stage] || stage}</span>
          </span>
          {showSig ? <IcChevronUp size={12}/> : <IcChevronDown size={12}/>}
        </button>
        {showSig && (
          <div style={{ marginTop: 8, padding: 12, borderRadius: 10, background: 'var(--bg-muted)' }}>
            {signals.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>아직 모은 단서가 없어요. 대화를 이어가면 흥미·강점·가치·맥락 단서가 자동으로 쌓이고, 추천·리포트에 반영돼요.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {signals.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Chip tone={SIG_TONE[s.tag] || 'neutral'} size="sm">{s.tag}</Chip>
                    <span style={{ fontSize: 12, color: 'var(--fg-default)', flex: 1, lineHeight: 1.5 }} className="kr-heading">{s.text}</span>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginTop: 2 }}>이 단서들이 단계 진행(탐색→파악→추천→준비)과 진로 리포트에 반영돼요.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="toss-scroll" style={{
        flex: 1, padding: '12px 14px 8px', overflow: 'auto',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {(() => {
          // 가장 최근 AI 메시지 인덱스 — quick-reply 칩은 이 메시지에만, 스트리밍/로딩 중이 아닐 때만 노출.
          let lastAiIdx = -1;
          for (let i = msgs.length - 1; i >= 0; i--) { if (msgs[i].role === 'ai') { lastAiIdx = i; break; } }
          return msgs.map((m, i) => {
            const isLastAi = i === lastAiIdx && m.role === 'ai';
            const options = isLastAi && !thinking ? parseQuickReplies(m.text).options : [];
            return (
              <React.Fragment key={i}>
                <ChatBubble msg={m}/>
                {options.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 32, marginTop: 2 }}>
                    {options.map((opt, j) => (
                      <button key={j} onClick={() => send(opt)} disabled={thinking} style={{
                        border: '1px solid var(--brand-200, var(--line))', background: 'var(--brand-50, var(--bg-surface))',
                        borderRadius: 999, padding: '8px 14px', fontSize: 13, color: 'var(--brand-600)', fontWeight: 600,
                        cursor: thinking ? 'not-allowed' : 'pointer', whiteSpace: 'normal', textAlign: 'left', lineHeight: 1.4,
                      }} className="kr-heading">{opt}</button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          });
        })()}
        {thinking && <ChatThinking/>}
        {initErr && (
          <div style={{ alignSelf: 'center', marginTop: 8 }}>
            <Button variant="brandSoft" size="sm" onClick={initSession} leading={<IcRefresh size={14}/>}>다시 시도</Button>
          </div>
        )}

        {/* progress hint when enough evidence — 실제 추출된 단서를 태그별로 요약 (하드코딩 금지) */}
        {evidenceCount >= 3 && signals.length > 0 && (
          <div style={{
            marginTop: 8, padding: 14, borderRadius: 14,
            background: 'linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)',
            border: '1px solid rgba(123,97,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <IcSparkles size={14} color="var(--accent-purple)"/>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-purple)' }}>지금까지 보인 진로 단서</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {signals.slice(0, 6).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Chip tone={SIG_TONE[s.tag] || 'neutral'} size="sm">{s.tag}</Chip>
                  <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1, lineHeight: 1.5 }} className="kr-heading">{s.text}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 8 }}>
              ※ 아직 확정이 아니에요. 대화를 더 이어가며 함께 확인해볼게요.
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div style={{ padding: '4px 12px 8px', display: 'flex', gap: 6, overflow: 'auto' }} className="toss-scroll">
        {QUICK_REPLIES.map(q => (
          <button key={q} onClick={() => send(q)} style={{
            border: '1px solid var(--line)', background: 'var(--bg-surface)',
            borderRadius: 999, padding: '8px 12px', fontSize: 12, color: 'var(--fg-default)',
            whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
          }}>{q}</button>
        ))}
      </div>

      {/* Composer */}
      <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderTop: '1px solid var(--line-subtle)' }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          background: 'var(--bg-muted)', borderRadius: 24, padding: '6px 6px 6px 16px',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
            placeholder="자유롭게 답해보세요"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: 15, color: 'var(--fg-strong)', minWidth: 0,
            }}
          />
          <button onClick={() => send(input)} disabled={!input.trim()} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: input.trim() ? 'var(--brand-500)' : 'var(--line-strong)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}>
            <IcSend size={16}/>
          </button>
        </div>
        <Button
          variant={evidenceCount >= 5 ? 'brandSoft' : 'ghost'}
          size="sm" full
          disabled={evidenceCount < 5}
          onClick={() => go('career-report')}
          leading={<IcDoc size={14}/>}
          style={{ marginTop: 8 }}
        >
          {evidenceCount >= 5 ? 'AI 진로 리포트 보기' : `대화를 ${5 - evidenceCount}회 더 이어가면 리포트가 준비돼요`}
        </Button>
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end', gap: 6,
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>AI</div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? 'var(--brand-500)' : 'var(--bg-surface)',
        color: isUser ? '#fff' : 'var(--fg-strong)',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        fontSize: 14, lineHeight: 1.6,
        boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
      }} className="kr-heading">{isUser ? msg.text : <FormattedText text={parseQuickReplies(msg.text).clean}/>}</div>
    </div>
  );
}

// AI 응답 끝에 붙는 "[보기] a | b | c" 줄을 파싱. { options, clean } 반환.
// options: 트림된 보기 배열(빈 항목 제거), clean: [보기] 줄을 제거한 본문.
// 모델이 [보기]를 생략하면 options는 빈 배열, clean은 원문 그대로.
function parseQuickReplies(text) {
  const raw = text || '';
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let optionLineIdx = -1;
  let options = [];
  // 맨 끝에서부터 [보기] 줄을 찾는다 (보통 마지막 줄).
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^\s*\[보기\]\s*(.*)$/);
    if (m) {
      options = m[1].split('|').map(s => s.trim()).filter(Boolean);
      optionLineIdx = i;
      break;
    }
    // 비어있지 않은 줄을 먼저 만나면 [보기]가 맨 끝 줄이 아니므로 중단(안전)
    if (lines[i].trim() !== '') break;
  }
  if (optionLineIdx < 0) return { options: [], clean: raw };
  const clean = lines.slice(0, optionLineIdx).join('\n').replace(/\s+$/, '');
  return { options, clean };
}

// 인라인 마크다운(굵게/기울임/인라인코드)을 React 노드 배열로 변환.
// 번들러 없는 browser-babel 환경 → 의존성 없이 직접 파싱. **bold**, *italic*/_italic_, `code`.
function renderInline(text, keyPrefix) {
  const src = text == null ? '' : String(text);
  const nodes = [];
  let buf = '';
  let k = 0;
  const flush = () => { if (buf) { nodes.push(buf); buf = ''; } };
  // 토큰: **...** | *...* | _..._ | `...`  (가장 앞의 매치를 우선 소비)
  const re = /(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)|(_([^_]+?)_)|(`([^`]+?)`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) buf += src.slice(last, m.index);
    flush();
    if (m[1] != null) {
      nodes.push(<strong key={keyPrefix + '-b' + k++} style={{ fontWeight: 700 }}>{m[2]}</strong>);
    } else if (m[3] != null) {
      nodes.push(<em key={keyPrefix + '-i' + k++} style={{ fontStyle: 'italic' }}>{m[4]}</em>);
    } else if (m[5] != null) {
      nodes.push(<em key={keyPrefix + '-u' + k++} style={{ fontStyle: 'italic' }}>{m[6]}</em>);
    } else if (m[7] != null) {
      nodes.push(
        <code key={keyPrefix + '-c' + k++} style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.06))', borderRadius: 4, padding: '1px 5px', fontSize: '0.92em' }}>{m[8]}</code>,
      );
    }
    last = re.lastIndex;
  }
  if (last < src.length) buf += src.slice(last);
  flush();
  return nodes.length ? nodes : [src];
}

// "| a | b |" 한 줄을 셀 배열로. 양 끝 파이프는 무시.
function splitTableRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}
function isTableSeparator(line) {
  // |---|:--:|---| 형태 — 셀이 전부 -, :, 공백으로만 구성
  if (!/\|/.test(line)) return false;
  return splitTableRow(line).every((c) => /^:?-{1,}:?$/.test(c));
}

// AI 답변을 읽기 좋게 렌더 — 줄바꿈 보존 + 경량 마크다운(제목/목록/굵게·기울임/표).
// 번들러가 없어 npm 마크다운 모듈을 못 쓰므로 의존성 없이 직접 구현. [보기] 칩은 parseQuickReplies가 이미 분리.
function FormattedText({ text }) {
  const raw = text || '';
  if (!raw) return null;
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 마크다운 표 — 헤더 줄 + 구분(|---|) 줄 + 데이터 줄들
    if (/\|/.test(trimmed) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(trimmed);
      const rows = [];
      let j = i + 2;
      while (j < lines.length && /\|/.test(lines[j]) && lines[j].trim() !== '') {
        rows.push(splitTableRow(lines[j]));
        j++;
      }
      out.push(
        <div key={key++} style={{ overflowX: 'auto', margin: '6px 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
            <thead>
              <tr>
                {header.map((h, ci) => (
                  <th key={ci} style={{ border: '1px solid var(--border, rgba(0,0,0,0.12))', padding: '6px 10px', textAlign: 'left', fontWeight: 700, background: 'var(--bg-subtle, rgba(0,0,0,0.04))' }}>
                    {renderInline(h, 'th' + ci)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {header.map((_, ci) => (
                    <td key={ci} style={{ border: '1px solid var(--border, rgba(0,0,0,0.12))', padding: '6px 10px', verticalAlign: 'top' }}>
                      {renderInline(r[ci] == null ? '' : r[ci], 'td' + ri + '-' + ci)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      i = j - 1;
      continue;
    }

    if (trimmed === '') { out.push(<div key={key++} style={{ height: 6 }}/>); continue; }

    // 제목 (# / ## / ### …)
    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
    const numbered = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const size = level <= 1 ? 17 : level === 2 ? 15.5 : 14.5;
      out.push(
        <div key={key++} style={{ fontWeight: 700, fontSize: size, margin: '6px 0 2px', lineHeight: 1.4 }}>
          {renderInline(heading[2], 'h' + key)}
        </div>,
      );
    } else if (bullet) {
      out.push(
        <div key={key++} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', margin: '1px 0' }}>
          <span style={{ color: 'var(--brand-500)', lineHeight: 1.6 }}>•</span>
          <span style={{ flex: 1 }}>{renderInline(bullet[1], 'bl' + key)}</span>
        </div>,
      );
    } else if (numbered) {
      out.push(
        <div key={key++} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', margin: '1px 0' }}>
          <span style={{ color: 'var(--brand-500)', fontWeight: 700, minWidth: 16 }}>{numbered[1]}.</span>
          <span style={{ flex: 1 }}>{renderInline(numbered[2], 'nm' + key)}</span>
        </div>,
      );
    } else {
      out.push(<div key={key++}>{renderInline(line, 'p' + key)}</div>);
    }
  }
  return <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{out}</div>;
}

function ChatThinking() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
      }}>AI</div>
      <div style={{
        padding: '12px 16px', background: 'var(--bg-surface)',
        borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 4,
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-subtle)',
            animation: `bounce 1.2s ${i * 0.16}s infinite ease-in-out`,
          }}/>
        ))}
        <style>{`@keyframes bounce { 0%, 80%, 100% { opacity: 0.3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }`}</style>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Career Report (now with timeline + goal history + source cards)
// ────────────────────────────────────────────────────────
// 실 데이터 — 활성 상담 세션의 단서·진행도 + 진로 목표 기반. 상담 전이면 빈 상태.
function CareerReport({ go }) {
  const [loading, setLoading] = React.useState(true);
  const [signals, setSignals] = React.useState([]);
  const [progress, setProgress] = React.useState(0);
  const [stage, setStage] = React.useState(null);
  const [targets, setTargets] = React.useState([]);
  const SIGNAL_TONE = { '흥미': 'brand', '강점': 'mint', '가치': 'purple', '맥락': 'info' };
  const STAGE_LABEL = { explore: '탐색', profile: '파악', recommend: '추천', prepare: '준비' };

  React.useEffect(() => {
    (async () => {
      try {
        const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' }).catch(() => null);
        const sid = active && active.data && active.data.id;
        if (sid) {
          const prog = await window.__apiFetch('/ai-counseling/sessions/' + sid + '/progress', { method: 'GET' }).catch(() => null);
          if (prog && prog.data) { setSignals(prog.data.signals || []); setProgress(prog.data.completeness || 0); setStage(prog.data.stage || null); }
        }
        const t = await window.__apiFetch('/career/targets', { method: 'GET' }).catch(() => null);
        setTargets((t && t.data) || []);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const hasData = signals.length > 0 || targets.length > 0;

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader
        help="career-report"
        title="AI 진로 리포트"
        leading={<BackButton onClick={() => go('dashboard')}/>}
      />
      <div style={{ padding: '0 16px 24px' }}>
        {loading ? (
          <Card padding={20}><Skeleton height={80}/></Card>
        ) : !hasData ? (
          <EmptyState
            icon={<IcSparkles size={22}/>}
            title="아직 리포트를 만들 데이터가 없어요"
            body="AI 진로 상담을 몇 번 이어가면, 대화에서 흥미·강점·가치 단서를 모아 리포트를 만들어드려요."
            action={<Button variant="primary" size="md" leading={<IcMessage size={16}/>} onClick={() => go('ai-counseling')}>AI 상담 시작하기</Button>}
          />
        ) : (
          <>
            {/* 진행 요약 */}
            <Card padding={20} style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)', marginBottom: 12, border: '1px solid rgba(49,130,246,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>}>진행 중인 리포트</Chip>
                {stage && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>현재 단계: {STAGE_LABEL[stage] || stage}</span>}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', lineHeight: 1.35 }} className="kr-heading">
                지금까지 대화에서 <span style={{ color: 'var(--brand-600)' }}>단서 {signals.length}개</span>를 모았어요
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}>
                <div style={{ width: progress + '%', height: '100%', background: 'var(--brand-500)' }}/>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>리포트 완성도 {progress}%</div>
            </Card>

            {/* 진로 목표 (실 데이터) */}
            {targets.length > 0 && (
              <SectionCard title="나의 진로 목표" subtitle="진로 목표 화면에서 관리해요" style={{ marginBottom: 12 }} action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => go('career-targets')}>관리</Button>}>
                {targets.map((t, i) => (
                  <div key={t.id} style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line-subtle)' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{t.career}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">{[t.univ, t.dept].filter(Boolean).join(' ')}</div>
                    {t.reason && <div style={{ fontSize: 12, color: 'var(--fg-default)', marginTop: 4, lineHeight: 1.5 }} className="kr-heading">{t.reason}</div>}
                  </div>
                ))}
              </SectionCard>
            )}

            {/* 대화에서 보인 단서 (실 데이터) */}
            {signals.length > 0 && (
              <SectionCard title="대화에서 보인 단서" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {signals.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <Chip tone={SIGNAL_TONE[s.tag] || 'neutral'} size="sm">{s.tag}</Chip>
                      <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1 }} className="kr-heading">{s.text}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
              이 결과는 대화를 바탕으로 한 진로 탐색 참고자료예요. 최종 선택은 학생·보호자·교사 상담과 함께 결정하는 게 좋아요.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button variant="primary" size="lg" full leading={<IcGraduation size={18}/>} onClick={() => {
                // 대화/목표에 근거한 검색어로 대학·입시 화면을 연다 (지어내지 않음).
                // 우선순위: 진로목표의 대학명 → 학과명 → 직업명. 없으면 검색어 없이 진입.
                const t = targets[0];
                const seed = t && (t.univ || t.dept || t.career);
                try { if (seed) window.__admissionsQuery = String(seed).trim(); else delete window.__admissionsQuery; } catch (e) {}
                go('admissions-hub');
              }}>추천 학과 입시 정보 보기</Button>
              <Button variant="outline" size="md" full leading={<IcMessage size={16}/>} onClick={() => go('ai-counseling')}>AI 상담 이어가기</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Grades Trend
// ────────────────────────────────────────────────────────
// 실 데이터 — GET/DELETE /v1/grades. 학기별 그룹 + 평균. 비어 있으면 빈 상태.
function GradesTrend({ go }) {
  const [grades, setGrades] = React.useState(null); // null=loading
  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/grades', { method: 'GET' }); setGrades(r.data || []); }
    catch (e) { setGrades([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    try { await window.__apiFetch('/grades/' + id, { method: 'DELETE' }); load(); }
    catch (e) { alert('삭제에 실패했어요.'); }
  };

  // 학기별 그룹
  const byTerm = {};
  (grades || []).forEach(g => { (byTerm[g.term] = byTerm[g.term] || []).push(g); });
  const terms = Object.keys(byTerm).sort();
  const termAvg = (rows) => {
    const sc = rows.filter(r => r.score != null).map(r => r.score);
    return sc.length ? Math.round((sc.reduce((a, b) => a + b, 0) / sc.length) * 10) / 10 : null;
  };

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader
        help="grades"
        title="성적"
        leading={<BackButton onClick={() => go('dashboard')}/>}
        trailing={<Button variant="primary" size="md" leading={<IcPlus size={16}/>} onClick={() => go('grades-input')}>성적 입력</Button>}
      />
      <div style={{ padding: 16 }}>
        {grades === null ? (
          [0, 1].map(i => <Card key={i} padding={16} style={{ marginBottom: 12 }}><Skeleton height={60}/></Card>)
        ) : terms.length === 0 ? (
          <EmptyState
            icon={<IcChart size={22}/>}
            title="아직 입력한 성적이 없어요"
            body="성적을 입력하면 학기별 평균과 추이를 볼 수 있어요. 입력한 성적은 AI 진로 분석에도 반영됩니다."
            action={<Button variant="primary" size="md" leading={<IcPlus size={16}/>} onClick={() => go('grades-input')}>첫 성적 입력하기</Button>}
          />
        ) : (
          <>
            {/* 학기별 평균 막대 */}
            <SectionCard title="학기별 평균" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, padding: '8px 4px' }}>
                {terms.map(t => {
                  const avg = termAvg(byTerm[t]);
                  const h = avg != null ? Math.max(8, Math.round((avg / 100) * 110)) : 8;
                  return (
                    <div key={t} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{avg != null ? avg : '—'}</div>
                      <div style={{ width: '60%', height: h, background: 'var(--brand-500)', borderRadius: '6px 6px 0 0' }}/>
                      <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{t}</div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* 학기별 과목 리스트 */}
            {terms.slice().reverse().map(t => (
              <SectionCard key={t} title={t} subtitle={'평균 ' + (termAvg(byTerm[t]) ?? '—')} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {byTerm[t].map(g => (
                    <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{g.subject}{g.category ? <span style={{ fontSize: 11, color: 'var(--fg-subtle)', fontWeight: 500 }}> · {g.category}</span> : null}</div>
                      </div>
                      {g.score != null && <Chip tone="brand" size="sm">{g.score}점</Chip>}
                      {g.rank != null && <Chip tone="neutral" size="sm">{g.rank}등급</Chip>}
                      <IconButton icon={<IcTrash size={15}/>} ariaLabel="삭제" onClick={() => del(g.id)}/>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Grades Input
// ────────────────────────────────────────────────────────
function GradesInput({ go }) {
  const [g, setG] = React.useState({ 국어: '', 수학: '', 영어: '', 사회: '', 과학: '' });
  const [exam, setExam] = React.useState('5월 모의고사');
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="성적 입력" leading={<BackButton onClick={() => go('grades-trend')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <SectionCard style={{ marginBottom: 12 }}>
          <FormField label="시험" required style={{ marginBottom: 16 }}>
            <TextInput value={exam} onChange={setExam} leading={<IcCalendar size={16}/>}/>
          </FormField>
          {Object.keys(g).map(sub => (
            <FormField key={sub} label={sub} style={{ marginBottom: 12 }}>
              <TextInput value={g[sub]} onChange={v => setG(s => ({ ...s, [sub]: v }))} placeholder="0~100" trailing={<span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>점</span>}/>
            </FormField>
          ))}
        </SectionCard>
        <div style={{
          padding: 14, background: 'var(--brand-50)', borderRadius: 12,
          fontSize: 12, color: 'var(--brand-600)', display: 'flex', gap: 8, alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          <IcInfo size={14} style={{ marginTop: 2, flexShrink: 0 }}/>
          <span className="kr-heading">입력한 성적은 선생님께도 공유돼요. 잘못 입력하면 언제든 수정할 수 있어요.</span>
        </div>
        <Button variant="primary" size="lg" full onClick={() => go('grades-trend')}>저장하기</Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Billing (student)
// ────────────────────────────────────────────────────────
function StudentBilling({ go }) {
  return <BillingScreen go={go} role="student"/>;
}

// Service-wide flag: when true, the whole product runs free (PG not yet wired).
// Flip to false once payment integration goes live.
window.SERVICE_FREE_MODE = window.SERVICE_FREE_MODE ?? true;

function BillingScreen({ go, role = 'student' }) {
  const isStudent = role === 'student';
  if (window.SERVICE_FREE_MODE) {
    return <FreeLaunchBilling go={go} role={role}/>;
  }
  return <PaidBillingScreen go={go} role={role}/>;
}

// ────────────────────────────────────────────────────────
// FREE LAUNCH billing — shown while the service runs entirely free
// ────────────────────────────────────────────────────────
function FreeLaunchBilling({ go, role = 'student' }) {
  const isStudent = role === 'student';
  const planPrice = isStudent ? '3,000' : '30,000';
  const futureFeatures = isStudent
    ? ['AI 진로 상담 무제한', '진로 리포트 + 입시 분석', '맞춤 AI 학습 계획', '관심 학과 입시 추적']
    : ['학급 최대 30명 관리', '학생별 AI 리포트 열람', '상담 일정 · 메모 관리', '실시간 SSE 알림'];
  const usage = isStudent
    ? [
        { label: 'AI 진로 상담', value: '12회', sub: '이번 달', icon: <IcSparkles size={15}/>, tone: 'purple' },
        { label: '진로 리포트', value: '1개', sub: '생성됨', icon: <IcCompass size={15}/>, tone: 'brand' },
        { label: '자습 누적', value: '14h', sub: '이번 달', icon: <IcZap size={15}/>, tone: 'mint' },
      ]
    : [
        { label: '관리 중 학생', value: '18명', sub: '제한 없음', icon: <IcUsers size={15}/>, tone: 'brand' },
        { label: 'AI 리포트 열람', value: '11건', sub: '이번 달', icon: <IcSparkles size={15}/>, tone: 'purple' },
        { label: '상담 진행', value: '9건', sub: '이번 달', icon: <IcMessage size={15}/>, tone: 'mint' },
      ];

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader help="billing" title="구독 및 결제" leading={<BackButton onClick={() => go('profile')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>

        {/* Hero: everything free now */}
        <Card padding={24} style={{
          marginBottom: 12,
          background: 'linear-gradient(135deg, #15803D 0%, #0E5C2C 100%)',
          color: '#fff', boxShadow: '0 12px 28px rgba(21,128,61,0.28)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Chip tone="success" size="sm" leading={<IcSparkles size={11}/>} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 12 }}>
                정식 출시 기념 전체 무료
              </Chip>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.25 }} className="kr-heading">
                지금은 모든 기능이<br/>무료예요
              </div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8, lineHeight: 1.55 }} className="kr-heading">
                결제 정보 없이 {isStudent ? '진로 상담·리포트·학습 계획' : '학급 관리·학생 리포트·상담'}을 제한 없이 사용할 수 있어요.
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IcHeart size={26} color="#fff"/>
            </div>
          </div>
          <div style={{
            marginTop: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.14)',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <IcInfo size={16} color="#fff" style={{ flexShrink: 0 }}/>
            <span style={{ fontSize: 12, lineHeight: 1.5 }} className="kr-heading">
              유료 전환은 <strong>최소 30일 전</strong>에 미리 알려드릴게요. 갑자기 결제되는 일은 없어요.
            </span>
          </div>
        </Card>

        {/* Current usage */}
        <SectionCard title="이번 달 사용 현황" subtitle="무료로 이만큼 활용하고 있어요" style={{ marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {usage.map((u, i) => (
              <div key={i} style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 12, textAlign: 'center' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9, margin: '0 auto 8px',
                  background: `var(--${u.tone === 'mint' ? 'accent-mint-bg' : u.tone === 'purple' ? 'accent-purple-bg' : 'brand-50'})`,
                  color: `var(--${u.tone === 'mint' ? 'accent-mint' : u.tone === 'purple' ? 'accent-purple' : 'brand-600'})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{u.icon}</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{u.value}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-strong)', fontWeight: 600, marginTop: 2 }} className="kr-heading">{u.label}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{u.sub}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Upcoming pricing preview */}
        <SectionCard title="앞으로의 요금 안내" subtitle="유료 전환 시 적용될 예정 가격이에요" style={{ marginBottom: 12 }}>
          <div style={{
            padding: 16, borderRadius: 12,
            background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)',
            border: '1px solid var(--brand-200)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <Chip tone="brand" size="sm">{isStudent ? '학생' : '교사'} 정식 플랜 (예정)</Chip>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }} className="kr-heading">유료 전환 시 첫 달 무료 체험 제공</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'flex-end' }}>
                  <span className="num" style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)' }}>{planPrice}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>원/월</span>
                </div>
                <Chip tone="success" size="sm" style={{ marginTop: 4 }}>지금은 ₩0</Chip>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {futureFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={15} color="var(--brand-500)"/>{f}
                  <Chip tone="success" size="sm" style={{ marginLeft: 'auto', height: 18, padding: '0 6px', fontSize: 10 }}>무료 제공 중</Chip>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => showToast('유료 전환 시 미리 알려드릴게요', 'success')} style={{
            width: '100%', marginTop: 12, padding: 12, border: '1px solid var(--line-strong)',
            background: 'var(--bg-surface)', borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: 'var(--fg-default)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
              <IcBell size={14}/> 유료 전환 시 미리 알림 받기
            </button>
        </SectionCard>

        {/* Payment method — disabled in free mode */}
        <SectionCard title="결제 수단" style={{ marginBottom: 12 }}>
          <div style={{
            padding: '20px 16px', textAlign: 'center',
            background: 'var(--bg-muted)', borderRadius: 12,
            border: '1px dashed var(--line-strong)',
          }}>
            <IcCreditCard size={24} color="var(--fg-subtle)" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 10 }} className="kr-heading">
              무료 운영 중에는 결제 수단을 등록할 필요가 없어요
            </div>
            <Chip tone="success" size="sm">등록 불필요</Chip>
          </div>
        </SectionCard>

        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.6, textAlign: 'center' }} className="kr-heading">
          전체 무료 운영 기간 동안에는 어떤 비용도 청구되지 않아요.<br/>
          정식 결제는 토스페이먼츠/포트원 연동 완료 후 시작되며, 사전 고지 후 진행돼요.
        </div>
      </div>
    </div>
  );
}

function PaidBillingScreen({ go, role = 'student' }) {
  const [activePlan, setActivePlan] = React.useState('trial'); // free | trial | paid
  const [downgradeOpen, setDowngradeOpen] = React.useState(false);

  const planPrice = isStudent ? '3,000' : '30,000';
  const annualPrice = isStudent ? '30,000' : '300,000';
  const featureList = isStudent ? {
    free: ['AI 진로 상담 (월 5회)', '성적 입력 · 추이 확인', '학습 계획 (수동만)'],
    paid: ['AI 진로 상담 무제한', '진로 리포트 + 입시 분석', '맞춤 AI 학습 계획', '관심 학과 입시 추적'],
  } : {
    free: ['학급 최대 3명 (베타)', '학생 성적 열람', '메시지 · 메모'],
    paid: ['학급 최대 30명', '학생별 AI 리포트 열람', '상담 일정 관리', '실시간 SSE 알림'],
  };

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader help="billing" title="구독 및 결제" leading={<BackButton onClick={() => go('profile')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>

        {/* Current plan card */}
        <Card padding={20} style={{
          marginBottom: 12,
          background: activePlan === 'paid'
            ? 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)'
            : activePlan === 'trial'
              ? 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)'
              : 'var(--bg-surface)',
          color: activePlan === 'paid' ? '#fff' : 'var(--fg-strong)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              {activePlan === 'paid' && <Chip tone="info" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>정기 결제 중</Chip>}
              {activePlan === 'trial' && <Chip tone="info" size="sm" leading={<IcSparkles size={11}/>}>무료 체험 중</Chip>}
              {activePlan === 'free' && <Chip tone="neutral" size="sm">무료 플랜</Chip>}
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8, color: activePlan === 'paid' ? '#fff' : 'var(--fg-strong)' }}>
                {isStudent ? '학생' : '교사'} {activePlan === 'free' ? '무료 플랜' : activePlan === 'trial' ? '플랜 체험' : '플랜'}
              </div>
              <div style={{ fontSize: 12, color: activePlan === 'paid' ? 'rgba(255,255,255,0.85)' : 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">
                {activePlan === 'free' && '핵심 기능을 무료로 사용 중이에요'}
                {activePlan === 'trial' && '첫 달 모든 기능 무료 체험'}
                {activePlan === 'paid' && '모든 기능 사용 가능 · 매월 자동결제'}
              </div>
            </div>
          </div>

          {activePlan === 'trial' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>체험 종료일</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>2026. 05. 31</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>이후 결제 금액</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>월 {planPrice}원</span>
              </div>
            </>
          )}
          {activePlan === 'paid' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.18)', borderRadius: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.85 }}>다음 결제일</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>2026. 07. 01</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.18)', borderRadius: 10 }}>
                <span style={{ fontSize: 12, opacity: 0.85 }}>금액</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>월 {planPrice}원</span>
              </div>
            </>
          )}
          {activePlan === 'free' && (
            <div style={{ padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10, fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }} className="kr-heading">
              유료 플랜 결제 연동이 완료되면 자동 안내드릴게요. 안내까지는 무료 플랜으로 계속 사용할 수 있어요.
            </div>
          )}
        </Card>

        {/* IMPORTANT: payment readiness banner */}
        <div style={{
          padding: 14, background: 'var(--warning-bg)', borderRadius: 12,
          marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <IcAlert size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--warning)', lineHeight: 1.55 }} className="kr-heading">
            <strong>결제 연동 준비 중이에요.</strong> 그 동안에는 <strong>무료 플랜</strong>으로 핵심 기능을 끊김 없이 사용할 수 있어요. 결제 연동이 완료되면 알림으로 안내드릴게요.
          </div>
        </div>

        {/* Plan comparison */}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', margin: '4px 4px 10px' }}>플랜 비교</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>

          {/* FREE plan */}
          <Card padding={18} style={{
            border: activePlan === 'free' ? '2px solid var(--brand-500)' : '1px solid var(--line-subtle)',
            boxShadow: activePlan === 'free' ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <Chip tone="neutral" size="sm" style={{ marginBottom: 8 }}>무료 플랜</Chip>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>핵심 기능 무료 사용</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">결제 정보 없이 바로 시작해요</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>₩0</div>
                <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>영구 무료</div>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {featureList.free.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={14} color="var(--success)"/>{f}
                </li>
              ))}
            </ul>
            {activePlan === 'free' ? (
              <Button variant="secondary" size="md" full disabled>현재 사용 중</Button>
            ) : (
              <Button variant="outline" size="md" full onClick={() => setDowngradeOpen(true)}>
                {activePlan === 'trial' ? '체험 종료 후 무료 플랜으로 전환' : '무료 플랜으로 전환'}
              </Button>
            )}
          </Card>

          {/* PAID plan */}
          <Card padding={18} style={{
            border: activePlan === 'paid' ? '2px solid var(--brand-500)' : '1px solid var(--brand-200)',
            background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <Chip tone="brand" size="sm" style={{ marginBottom: 8 }}>{isStudent ? '학생' : '교사'} 정식 플랜</Chip>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>모든 기능 사용</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">첫 달 무료 체험 후 자동 결제</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{planPrice}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>원 / 월</div>
                <div className="num" style={{ fontSize: 10, color: 'var(--success)', fontWeight: 700, marginTop: 2 }}>연간 {annualPrice}원</div>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {featureList.paid.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={14} color="var(--brand-500)"/>{f}
                </li>
              ))}
            </ul>
            {activePlan === 'trial' || activePlan === 'paid' ? (
              <Button variant="primary" size="md" full disabled>{activePlan === 'trial' ? '체험 사용 중' : '결제 중'}</Button>
            ) : (
              <Button variant="primary" size="md" full disabled leading={<IcLock size={14}/>}>
                결제 연동 후 시작 가능
              </Button>
            )}
          </Card>
        </div>

        {/* Payment method */}
        <SectionCard title="결제 수단" style={{ marginBottom: 12 }}>
          <div style={{
            padding: '20px 16px', textAlign: 'center',
            background: 'var(--bg-muted)', borderRadius: 12,
            border: '1px dashed var(--line-strong)',
          }}>
            <IcCreditCard size={24} color="var(--fg-subtle)" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 10 }} className="kr-heading">
              아직 결제 수단이 없어요
            </div>
            <Chip tone="warning" size="sm">결제 연동 준비 중</Chip>
          </div>
        </SectionCard>

        <SectionCard title="결제 내역">
          <EmptyState icon={<IcDoc size={22}/>} title="아직 결제 내역이 없어요" body="첫 결제 후 영수증을 여기서 확인할 수 있어요."/>
        </SectionCard>

        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.55, textAlign: 'center' }} className="kr-heading">
          무료 플랜은 결제 연동 여부와 무관하게 영구 제공돼요.<br/>
          정식 플랜은 토스페이먼츠/포트원 연동 완료 후 결제할 수 있어요.
        </div>
      </div>

      {downgradeOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => setDowngradeOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)' }}/>
          <div style={{ position: 'relative', width: 'min(380px, 100%)', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 280ms var(--ease-toss)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <IcInfo size={24}/>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">무료 플랜으로 전환할까요?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 14 }} className="kr-heading">
              {isStudent
                ? 'AI 상담은 월 5회로 제한되며, 진로 리포트와 입시 분석은 사용할 수 없게 돼요. 데이터는 유지돼요.'
                : '학급 최대 3명까지만 관리할 수 있어요. 현재 학생 수가 많으면 일부는 "교사 없음" 상태가 돼요.'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={() => setDowngradeOpen(false)}>취소</Button>
              <Button variant="primary" full onClick={() => { setActivePlan('free'); setDowngradeOpen(false); }}>전환하기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Profile (placeholder)
// ────────────────────────────────────────────────────────
function StudentProfile({ go, onLogout }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="내정보"/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name="지" size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>김지훈</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>한빛고등학교 2학년 3반</div>
            <Chip tone="brand" size="sm" style={{ marginTop: 6 }}>이지원 선생님 학급</Chip>
          </div>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCreditCard size={16}/></div>} title="구독 및 결제" subtitle="무료 체험 18일 남음" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('billing')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcTarget size={16}/></div>} title="목표 대학·학과" subtitle="한국예술종합학교 영상이론과" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcSchool size={16}/></div>} title="학급 정보" subtitle="이지원 선생님" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} divider={false}/>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-mint-bg)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcFlag size={16}/></div>} title="공지사항" subtitle="업데이트 소식 · 건의·버그 제보" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('announcements')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcShield size={16}/></div>} title="개인정보 및 보안" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => notReady('개인정보 및 보안')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcInfo size={16}/></div>} title="이용약관" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => notReady('이용약관')} divider={false}/>
        </Card>
        <button onClick={onLogout} style={{
          width: '100%', padding: 14, border: 'none', background: 'transparent',
          color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer',
        }}>로그아웃</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Study (placeholder)
// ────────────────────────────────────────────────────────
function StudentStudy({ go }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader help="study" title="이번 주 학습"/>
      <div style={{ padding: '0 16px 24px' }}>
        <EncouragementBanner/>
        <Card padding={18} onClick={() => go('focus-timer')} hoverable style={{ marginBottom: 12, background: 'linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)', color: '#fff', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IcZap size={22} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>자습 타임어택</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }} className="kr-heading">집중 시간을 정하고 자습 누적 시간을 기록해요</div>
            </div>
            <IcChevronRight size={20} color="#fff"/>
          </div>
        </Card>
        <Card padding={20} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>이번 주 진도</div>
            <Chip tone="info" size="sm">5/8</Chip>
          </div>
          <div className="num" style={{ fontSize: 32, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-1px', marginBottom: 12 }}>62.5<span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 500 }}>%</span></div>
          <ProgressBar value={5} max={8} height={8}/>
        </Card>

        {/* Weekly self-study summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <MetricCard label="이번 주 자습" value="8.4h" delta="+1.2h" deltaTone="success"/>
          <MetricCard label="평균/일" value="1.2h" hint="목표 1.5h"/>
          <MetricCard label="연속 일수" value="5일" delta="🔥" deltaTone="warning"/>
        </div>

        {/* 7-day self-study bar chart */}
        <SectionCard title="요일별 자습 시간" subtitle="이번 주 · 시간 단위" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 110, padding: '4px 0' }}>
            {[{d:'월',h:1.5},{d:'화',h:2.1},{d:'수',h:0.8},{d:'목',h:1.7},{d:'금',h:1.2},{d:'토',h:0,today:true},{d:'일',h:0}].map(b => {
              const max = 2.4;
              return (
                <div key={b.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="num" style={{ fontSize: 10, fontWeight: 700, color: b.h ? 'var(--fg-muted)' : 'var(--fg-disabled)' }}>{b.h ? b.h : '–'}</span>
                  <div style={{ width: '100%', height: 70, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: `${Math.max(4, (b.h/max)*70)}px`, borderRadius: 6,
                      background: b.today ? 'var(--brand-200)' : b.h ? 'var(--brand-500)' : 'var(--line)',
                    }}/>
                  </div>
                  <span style={{ fontSize: 11, color: b.today ? 'var(--brand-600)' : 'var(--fg-muted)', fontWeight: b.today ? 700 : 500 }}>{b.d}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">화요일에 가장 집중했어요</span>
            <Button variant="brandSoft" size="sm" leading={<IcZap size={13}/>} onClick={() => go('focus-timer')}>자습 시작</Button>
          </div>
        </SectionCard>

        {/* Subject distribution */}
        <SectionCard title="과목별 학습 비중" subtitle="이번 주 자습 시간 기준" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{s:'수학',pct:38,t:'brand-500'},{s:'영어',pct:24,t:'accent-purple'},{s:'국어',pct:20,t:'accent-mint'},{s:'과학',pct:18,t:'warning'}].map(r => (
              <div key={r.s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-default)', width: 36 }}>{r.s}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--neutral-bg)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: `var(--${r.t})`, borderRadius: 999 }}/>
                </div>
                <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', width: 32, textAlign: 'right' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', margin: '4px 4px 8px' }}>이번 주 학습 계획</div>
        <Card padding={0}>
          {[
            { t: '수학 II 미적분 기본 개념', d: '5월 12일 완료', done: true },
            { t: '영어 단어 100개 (Day 14)', d: '5월 13일 완료', done: true },
            { t: '국어 비문학 3지문', d: '오늘까지', done: false },
            { t: '사회 단원평가 7단원', d: '내일까지', done: false },
            { t: '과학 화학 4단원 문제', d: '주말까지', done: false },
          ].map((row, i, arr) => (
            <ListRow
              key={i}
              leading={
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: row.done ? 'var(--success-bg)' : 'var(--bg-muted)',
                  color: row.done ? 'var(--success)' : 'var(--fg-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{row.done ? <IcCheck size={14}/> : <IcDot size={6}/>}</div>
              }
              title={row.t}
              subtitle={row.d}
              divider={i < arr.length - 1}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Notification Drawer (used by all roles, but exposed via student here)
// ────────────────────────────────────────────────────────
function NotificationDrawer({ open, onClose, items, role = 'student' }) {
  if (!open) return null;
  const accentMap = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand-600)' },
    purple: { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple)' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success)' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning)' },
    info: { bg: 'var(--info-bg)', fg: 'var(--brand-600)' },
    mint: { bg: 'var(--accent-mint-bg)', fg: 'var(--accent-mint)' },
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--fg-muted)' },
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="알림" maxHeight="86%">
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip tone="brand" size="sm">{items.filter(i => i.unread != null ? i.unread : !i.read).length}개 안 읽음</Chip>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>모두 읽음</button>
      </div>
      <div>
        {items.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>아직 알림이 없어요</div>
        )}
        {items.map((n, i) => {
          const a = accentMap[n.accent] || accentMap.neutral;
          const unread = n.unread != null ? n.unread : !n.read;
          return (
            <div key={n.id} style={{
              display: 'flex', gap: 12, padding: '14px 20px',
              borderTop: i === 0 ? 'none' : '1px solid var(--line-subtle)',
              background: unread ? 'rgba(49,130,246,0.025)' : 'transparent',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: a.bg, color: a.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{n.icon ? React.cloneElement(n.icon, { size: 18 }) : <IcBell size={18}/>}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{n.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{n.time || n.createdAt}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.45 }} className="kr-heading">{n.body}</div>
              </div>
              {unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 14 }}/>}
            </div>
          );
        })}
      </div>
      <div style={{ padding: '16px 20px 0', borderTop: '1px solid var(--line-subtle)', marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--fg-subtle)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>
            실시간 연결됨 (SSE)
          </span>
          <span>최근 동기화 방금 전</span>
        </div>
      </div>
    </BottomSheet>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Counseling request
// ────────────────────────────────────────────────────────
function StudentCounseling({ go }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="상담 · 기록" leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <SectionCard title="AI 진로 상담" subtitle="언제든 대화하며 진로를 정리해요" style={{ marginBottom: 12 }}>
          <Button variant="primary" size="md" full leading={<IcSparkles size={16}/>} onClick={() => go('ai-counseling')}>AI 상담 이어가기</Button>
        </SectionCard>
        <SectionCard title="선생님과 상담" subtitle="담당 선생님께 메시지로 상담을 요청하세요">
          <Button variant="brandSoft" size="md" full leading={<IcMessage size={16}/>} onClick={() => go('messages')}>선생님께 메시지 보내기</Button>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.5 }} className="kr-heading">
            상담 일정은 캘린더에서 잡고, 봉사·입시 일정도 함께 관리할 수 있어요.
          </div>
          <Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} style={{ marginTop: 6 }} onClick={() => go('calendar')}>캘린더 열기</Button>
        </SectionCard>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main StudentApp
// ────────────────────────────────────────────────────────
function StudentApp({ initialScreen = 'dashboard', heroVariant = 'A' }) {
  const [screen, setScreen] = usePersistentScreen('student-mobile', initialScreen);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifItems, setNotifItems] = React.useState([]);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/notifications', { method: 'GET' }); setNotifItems(Array.isArray(r.data) ? r.data : (r.data || [])); } catch (e) {} })();
  }, []);
  const [coach, setCoach] = React.useState(() => {
    try { return window.__LIVE_MODE && !localStorage.getItem('jinro:mtour:student'); } catch (e) { return false; }
  });
  const endCoach = () => { try { localStorage.setItem('jinro:mtour:student', '1'); } catch (e) {} setCoach(false); };
  const showBottomNav = ['dashboard', 'grades-trend', 'career-report', 'calendar', 'profile'].includes(screen);

  // Map screen to nav id
  const navId = (() => {
    if (screen === 'dashboard') return 'dashboard';
    if (screen.startsWith('grades')) return 'grades-trend';
    if (screen.startsWith('career') || screen === 'ai-counseling') return 'career-report';
    if (screen === 'calendar') return 'calendar';
    if (screen === 'profile' || screen === 'billing') return 'profile';
    if (screen === 'student-info' || screen === 'class-info' || screen === 'announcements' || screen === 'career-targets' || screen === 'consents') return 'profile';
    if (screen.startsWith('settings-')) return 'profile';
    if (screen === 'study' || screen === 'focus-timer') return 'dashboard';
    return 'dashboard';
  })();

  return (
    <div data-app-root style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 54 }} className="toss-scroll">
        {screen === 'dashboard' && <StudentDashboard go={setScreen} openNotif={() => setScreen('notifications')} variant={heroVariant}/>}
        {screen === 'notifications' && <NotificationsScreen role="student" variant="mobile" onBack={() => setScreen('dashboard')}/>}
        {screen === 'ai-counseling' && <AICounseling go={setScreen} openSignals={() => {}}/>}
        {screen === 'career-report' && <CareerReport go={setScreen}/>}
        {screen === 'grades-trend' && <GradesTrend go={setScreen}/>}
        {screen === 'grades-input' && <GradesInputV2 go={setScreen}/>}
        {screen === 'billing' && <StudentBilling go={setScreen}/>}
        {screen === 'profile' && <StudentProfileV2 go={setScreen}/>}
        {screen === 'study' && <StudentStudy go={setScreen}/>}
        {screen === 'focus-timer' && <FocusTimer go={setScreen}/>}
        {screen === 'counseling' && <StudentCounseling go={setScreen}/>}
        {screen === 'messages' && <StudentMessages go={setScreen}/>}
        {screen === 'calendar' && <StudentCalendar go={setScreen}/>}
        {screen === 'settings-password' && <SettingsPassword back={() => setScreen('profile')}/>}
        {screen === 'settings-notifications' && <SettingsNotifications back={() => setScreen('profile')} role="student"/>}
        {screen === 'settings-terms' && <SettingsTerms back={() => setScreen('profile')}/>}
        {screen === 'counseling-request' && <CounselingRequest go={setScreen}/>}
        {screen === 'admissions-hub' && <AdmissionsHub go={setScreen}/>}
        {(screen === 'volunteer' || screen === 'volunteers') && <VolunteersScreen go={setScreen}/>}
        {(screen === 'scholarship' || screen === 'scholarships') && <ScholarshipsScreen go={setScreen}/>}
        {(screen === 'foreign' || screen === 'foreign-univ') && <ForeignUnivScreen go={setScreen}/>}
        {screen === 'admissions-univ' && <UniversityDetail go={setScreen}/>}
        {screen === 'admissions-dept' && <DepartmentDetail go={setScreen}/>}
        {screen === 'admissions-analysis' && <AdmissionsAnalysis go={setScreen}/>}
        {screen === 'consents' && <ConsentManagement go={setScreen} role="student"/>}
        {screen === 'study-plan' && <StudyPlanFull go={setScreen}/>}
        {screen === 'goal-setting' && <GoalSetting go={setScreen}/>}
        {screen === 'career-targets' && <CareerTargets go={setScreen}/>}
        {screen === 'ai-chat' && <AIChatRAG go={setScreen}/>}
        {screen === 'announcements' && <AnnouncementsScreen role="student" variant="mobile" onBack={() => setScreen('profile')}/>}
        {screen === 'student-info' && <StudentInfoScreen go={setScreen}/>}
        {screen === 'class-info' && <ClassInfoScreen go={setScreen}/>}
      </div>
      {showBottomNav && (
        <MobileBottomNav items={STUDENT_NAV} activeId={navId} onChange={(id) => {
          // Map nav id to screen
          if (id === 'career-report') setScreen('career-report');
          else setScreen(id);
        }}/>
      )}
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} items={notifItems}/>
      {coach && screen === 'dashboard' && <MobileCoachTour role="student" onDone={endCoach}/>}
    </div>
  );
}

Object.assign(window, { StudentApp, NotificationDrawer, STUDENT_NOTIFICATIONS });
