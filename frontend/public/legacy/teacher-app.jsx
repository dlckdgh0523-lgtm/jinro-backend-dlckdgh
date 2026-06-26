// teacher-app.jsx — Teacher prototype (tablet/desktop)
// Sidebar layout. Screens: dashboard, classroom, students, student-detail, counseling-memo, billing, notifications.

const TEACHER_NAV = [
  { id: 'dashboard', label: '대시보드', icon: <IcHome/> },
  { section: '학급' },
  { id: 'classroom', label: '학급', icon: <IcSchool/> },
  { id: 'students', label: '학생 관리', icon: <IcUsers/> },
  { id: 'completion', label: '학습 완료', icon: <IcCheck/> },
  { id: 'counseling', label: '상담 · 기록', icon: <IcClipboard/> },
  { section: '진로 지도' },
  { id: 'ai-coach', label: 'AI 상담 코칭', icon: <IcSparkles/>, badge: 'AI' },
  { id: 'admissions-hub', label: '대학·입시', icon: <IcGraduation/> },
  { id: 'volunteers', label: '봉사활동', icon: <IcHeart/> },
  { id: 'scholarships', label: '장학금', icon: <IcCreditCard/> },
  { section: '소통·일정' },
  { id: 'messages', label: '메시지', icon: <IcMessage/> },
  { id: 'calendar', label: '캘린더', icon: <IcCalendar/> },
  { id: 'notifications', label: '알림', icon: <IcBell/> },
  { id: 'announcements', label: '공지사항', icon: <IcFlag/> },
  { section: '계정' },
  { id: 'consents', label: '동의 관리', icon: <IcShield/> },
  { id: 'billing', label: '구독 및 결제', icon: <IcCreditCard/> },
  { id: 'profile', label: '내정보', icon: <IcUser/> },
];

// Shared roster loader — fetches the teacher's real classroom once.
// Returns { rows, meta, loading, error, refetch }. Always falls back to []/null.
function useTeacherRoster() {
  const [rows, setRows] = React.useState(null);   // null = loading sentinel
  const [meta, setMeta] = React.useState(null);
  const [error, setError] = React.useState(null);
  const load = React.useCallback(async () => {
    setError(null);
    try {
      const r = await window.__apiFetch('/teacher/students', { method: 'GET' });
      setRows(Array.isArray(r.data) ? r.data : []);
      setMeta(r.meta || null);
    } catch (e) {
      setError(e);
      setRows([]);
      setMeta(null);
    }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  return { rows: rows || [], meta, loading: rows === null, error, refetch: load };
}

// 교사 학급 초대코드 — 백엔드 GET /teacher/invite-code 에서 실 코드를 불러온다(고정 묵값 금지).
// 반환: { code, display, loading }. code=null이면 아직 로딩 중.
function useInviteCode() {
  const [code, setCode] = React.useState(null); // null = loading
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/teacher/invite-code', { method: 'GET' });
        const c = (r && r.data && r.data.inviteCode) || (r && r.inviteCode) || '';
        if (alive) setCode(c || '');
      } catch (e) {
        if (alive) setCode('');
      }
    })();
    return () => { alive = false; };
  }, []);
  // 초대코드 재발급 — 백엔드에서 새 유니크 코드를 받아 상태 갱신.
  const regenerate = React.useCallback(async () => {
    try {
      const r = await window.__apiFetch('/teacher/invite-code/regenerate', { method: 'POST' });
      const c = (r && r.data && r.data.inviteCode) || (r && r.inviteCode) || '';
      if (c) { setCode(c); return c; }
      return null;
    } catch (e) { return null; }
  }, []);
  // 표시용: 3글자 단위 공백(예: H8K4 9P → 'H8K 49P'은 피하고 코드 그대로 + 간격은 letterSpacing로).
  return { code, display: code || '', loading: code === null, regenerate };
}

// AI progress (0-100) → status badge, honestly derived from real signal data.
const aiProgressBadge = (p) => {
  if (p >= 60) return <Chip tone="success" size="sm">진행 활발</Chip>;
  if (p > 0) return <Chip tone="info" size="sm">대화 진행 중</Chip>;
  return <Chip tone="neutral" size="sm">미시작</Chip>;
};

// "상담 필요" 사유 — 백엔드 needsCounseling 휴리스틱(진행도 낮음/단서 적음)을 사람이 읽는 문구로.
const counselReason = (s) => {
  if (s.gradeAverage == null) return '성적 미입력';
  if ((s.aiProgress || 0) < 24) return 'AI 진행도 낮음';
  return '관찰 권장';
};

// lastActivityAt(ISO|null) → 짧은 한국어 표기.
const fmtActivity = (iso) => {
  if (!iso) return '활동 없음';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '활동 없음';
  const diff = Date.now() - d.getTime();
  const day = 86400000;
  if (diff < day && d.getDate() === new Date().getDate()) return '오늘';
  if (diff < 2 * day) return '어제';
  if (diff < 7 * day) return `${Math.floor(diff / day)}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
};

// 학생 상세로 이동 — admissions.jsx의 __selectedUnivId 패턴과 동일.
const openStudentDetail = (go, id) => { window.__selectedStudentId = id; go('student-detail'); };

// ────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────
function TeacherSidebar({ activeId, onChange }) {
  const [tMe, setTMe] = React.useState(null);
  const [capacity, setCapacity] = React.useState(null); // null = loading
  React.useEffect(() => { (async () => {
    try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setTMe(r.data || r); } catch (e) {}
    try { const r = await window.__apiFetch('/teacher/students', { method: 'GET' }); const list = r.data || r || []; setCapacity(Array.isArray(list) ? list.length : 0); } catch (e) { setCapacity(0); }
  })(); }, []);
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--line-subtle)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px 16px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 20px' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcCompass size={18}/>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.3px' }}>진로나침반</div>
          <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>교사용</div>
        </div>
      </div>

      {/* Capacity card */}
      <div style={{
        margin: '0 0 16px',
        padding: 14, borderRadius: 12,
        background: 'linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)',
        border: '1px solid rgba(49,130,246,0.08)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-600)', marginBottom: 4 }}>학급 정원</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
          <span className="num" style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)' }}>{capacity === null ? '–' : capacity}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>/30명</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${((capacity || 0) / 30) * 100}%`, height: '100%', background: 'var(--brand-500)' }}/>
        </div>
      </div>

      {/* Nav */}
      <nav className="toss-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {TEACHER_NAV.map((it, idx) => {
          if (it.section) {
            return <div key={'sec-' + it.section} style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', letterSpacing: '0.4px', padding: '12px 12px 4px', textTransform: 'uppercase' }}>{it.section}</div>;
          }
          const active = activeId === it.id;
          const tourAttr = {
            'classroom': 'teacher-nav-classroom',
            'students': 'teacher-nav-students',
            'completion': 'teacher-nav-completion',
            'counseling': 'teacher-nav-counseling',
            'messages': 'teacher-nav-messages',
            'calendar': 'teacher-nav-calendar',
          }[it.id];
          return (
            <button key={it.id} data-tour={tourAttr} onClick={() => onChange(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', borderRadius: 10,
              background: active ? 'var(--brand-50)' : 'transparent',
              color: active ? 'var(--brand-600)' : 'var(--fg-default)',
              fontSize: 14, fontWeight: active ? 700 : 500,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all var(--t-fast) var(--ease-std)',
            }}>
              {React.cloneElement(it.icon, { size: 18 })}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge && <span style={{ background: 'var(--accent-purple)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999 }}>{it.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Trial chip + profile */}
      <div style={{ padding: '12px 8px 0', borderTop: '1px solid var(--line-subtle)', flexShrink: 0 }}>
        <SidebarUserMenu name={(tMe && tMe.name) || '선생님'} sub={(tMe && [tMe.school, tMe.classroom].filter(Boolean).join(' · ')) || ''} avatar={((tMe && tMe.name) || '교')[0]} onProfile={() => onChange && onChange('profile')}/>
      </div>
    </aside>
  );
}

function TeacherTopbar({ title, subtitle, openNotif, action, help }) {
  const isMobile = useViewportMobile();
  // 알림 미읽음 — 실 데이터(GET /notifications?unreadOnly=true). 60s 폴링. 학생 NotifBell과 동일 패턴.
  const [unread, setUnread] = React.useState(0);
  React.useEffect(() => {
    let cancel = false;
    const fetchUnread = async () => {
      try {
        const r = await window.__apiFetch('/notifications?unreadOnly=true&limit=50', { method: 'GET' });
        if (cancel) return;
        const list = (r && (Array.isArray(r.data) ? r.data : (r.data || []))) || [];
        setUnread(list.length || 0);
      } catch (e) { /* 무시 — badge만 0 */ }
    };
    fetchUnread();
    const t = setInterval(fetchUnread, 60_000);
    return () => { cancel = true; clearInterval(t); };
  }, []);
  return (
    <div style={{
      display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between',
      flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0,
      padding: isMobile ? '14px 16px' : '16px 28px',
      borderBottom: '1px solid var(--line-subtle)',
      background: 'var(--bg-surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.4px' }} className="kr-heading">{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">{subtitle}</div>}
        </div>
        {/* 모바일에선 알림 벨만 제목과 같은 줄에 (오른쪽) */}
        {isMobile && <IconButton data-tour="teacher-bell" icon={<IcBell size={20}/>} onClick={openNotif} badge={unread || null} ariaLabel="알림"/>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
        {action}
        {help && typeof HelpButton !== 'undefined' && <HelpButton pageId={help}/>}
        {!isMobile && <Chip tone="info" size="md" leading={<IcSparkles size={11}/>}>무료 체험 18일 남음</Chip>}
        {!isMobile && <IconButton data-tour="teacher-bell" icon={<IcBell size={20}/>} onClick={openNotif} badge={unread || null} ariaLabel="알림"/>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Teacher Dashboard
// ────────────────────────────────────────────────────────
function TeacherDashboard({ go, openNotif }) {
  const isMobile = useViewportMobile();
  const [trendMode, setTrendMode] = React.useState('avg');
  const { rows, meta, loading } = useTeacherRoster();
  const invite = useInviteCode();

  const total = meta?.count ?? rows.length;
  const activeCount = rows.filter(s => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const needsList = rows.filter(s => s.needsCounseling);
  const needsCount = needsList.length;
  const avgProgress = rows.length ? Math.round(rows.reduce((a, s) => a + (s.aiProgress || 0), 0) / rows.length) : 0;
  // "최근 활동" — 실제 lastActivityAt 상위 학생에서 정직하게 파생.
  const recent = rows
    .filter(s => s.lastActivityAt)
    .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt))
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar help="teacher-dashboard" title="좋은 아침이에요, 선생님" subtitle="오늘 학급에서 주목할 학생을 정리했어요." openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="총 학생" value={loading ? '–' : String(total)} hint={meta?.classroom || undefined} icon={<IcUsers size={16}/>}/>
          <MetricCard label="이번 주 활동" value={loading ? '–' : `${activeCount}명`} delta={activeCount > 0 ? '활성' : undefined} deltaTone="success" icon={<IcZap size={16}/>}/>
          <MetricCard label="상담 필요" value={loading ? '–' : `${needsCount}명`} delta={needsCount > 0 ? '확인 필요' : undefined} deltaTone="warning" icon={<IcMessage size={16}/>}/>
          <MetricCard label="평균 진행도" value={loading ? '–' : `${avgProgress}%`} delta="AI 상담 기준" deltaTone="success" icon={<IcChart size={16}/>}/>
        </div>

        {/* Two-column main */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
          {/* Left: focus students */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard
              title="오늘 주목할 학생"
              subtitle="AI 진행도·성적 입력 여부를 종합한 우선순위"
              action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => go('students')}>전체 보기</Button>}
            >
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[0,1,2].map(i => <Skeleton key={i} height={68} radius={12}/>)}</div>
              ) : needsList.length === 0 ? (
                <EmptyState icon={<IcCheck size={22}/>} title="주목할 학생이 없어요" body="현재 모든 학생이 잘 따라오고 있어요."/>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {needsList.slice(0, 5).map((s) => (
                  <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: 14, borderRadius: 12, cursor: 'pointer',
                    border: '1px solid var(--line-subtle)',
                    background: 'var(--bg-surface)',
                  }}>
                    <Avatar name={(s.name || '?').slice(0,1)} size={40}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">{counselReason(s)} · {s.grade || '학년 미정'}</div>
                    </div>
                    <Chip tone="warning" size="sm">상담 필요</Chip>
                    <IcChevronRight size={16} color="var(--fg-subtle)"/>
                  </div>
                ))}
              </div>
              )}
            </SectionCard>

            <SectionCard
              title="학급 성적 추이"
              action={<Tabs items={[{id:'avg',label:'평균'},{id:'sub',label:'과목별'}]} activeId={trendMode} onChange={setTrendMode}/>}
            >
              <ClassTrendChart mode={trendMode}/>
            </SectionCard>
          </div>

          {/* Right: invite code + risk signals + recent activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card padding={18} style={{ background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff' }}>
              <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>학급 초대코드</div>
              <div className="num" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '4px' }}>{invite.loading ? '······' : (invite.display || '코드 없음')}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button disabled={!invite.display} onClick={() => invite.display && copyToast(invite.display, '초대코드를 복사했어요')} style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: invite.display ? 'pointer' : 'default', opacity: invite.display ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <IcCopy size={13}/> 복사
                </button>
                <button onClick={() => go('classroom')} style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#fff', color: 'var(--brand-600)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>학급 보기</button>
              </div>
            </Card>

            <TeacherRiskSignals rows={rows} loading={loading} go={go}/>

            <SectionCard title="최근 활동" padding={18}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2].map(i => <Skeleton key={i} height={20}/>)}</div>
              ) : recent.length === 0 ? (
                <EmptyState icon={<IcZap size={22}/>} title="최근 활동이 없어요" body="학생이 학습·AI 상담을 시작하면 여기에 표시돼요."/>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recent.map((s) => (
                  <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 6 }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--fg-strong)', fontWeight: 500 }} className="kr-heading">{s.name} · 학습 {s.studyDone}/{s.studyTotal}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2 }}>{fmtActivity(s.lastActivityAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// 주의 신호 카드 — needsCounseling 학생을 이름+사유로 표시. 없으면 정직한 빈 상태.
function TeacherRiskSignals({ rows, loading, go }) {
  const risk = (rows || []).filter(s => s.needsCounseling);
  return (
    <SectionCard
      title="주의 신호"
      subtitle="AI 진행도·성적 입력 관점에서 살펴볼 학생들 (정신건강 진단 아님)"
      action={<Chip tone="warning" size="sm">{loading ? '…' : `${risk.length}건`}</Chip>}
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[0,1].map(i => <Skeleton key={i} height={48} radius={12}/>)}</div>
      ) : risk.length === 0 ? (
        <EmptyState icon={<IcCheck size={22}/>} title="주의가 필요한 학생이 없어요" body="현재 특별히 살펴볼 신호가 없어요."/>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {risk.map((s) => (
            <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              border: '1px solid var(--line-subtle)', borderRadius: 12, cursor: 'pointer', background: 'var(--bg-surface)',
            }}>
              <Avatar name={(s.name || '?').slice(0,1)} size={36}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">{counselReason(s)}</div>
              </div>
              <IcChevronRight size={16} color="var(--fg-subtle)"/>
            </div>
          ))}
          <div style={{ padding: 10, background: 'var(--info-bg)', borderRadius: 8, fontSize: 11, color: 'var(--brand-600)', lineHeight: 1.5, marginTop: 4 }} className="kr-heading">
            <IcShield size={12} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }}/>
            주의 신호는 <strong>학업·상담 관점</strong>의 참고 정보예요. 정신건강 관련 우려는 전문 상담사·보건교사에게 연결해주세요.
          </div>
        </div>
      )}
    </SectionCard>
  );
}

// 실 데이터 — /v1/teacher/grade-trend (학급 학생 성적의 학기별 평균).
function ClassTrendChart({ mode = 'avg' }) {
  const [trend, setTrend] = React.useState(null); // null=loading
  React.useEffect(() => {
    (async () => {
      try { const r = await window.__apiFetch('/teacher/grade-trend', { method: 'GET' }); setTrend(r.data || []); }
      catch (e) { setTrend([]); }
    })();
  }, []);

  if (trend === null) return <Skeleton height={220}/>;
  if (trend.length === 0) {
    return <EmptyState icon={<IcChart size={22}/>} title="아직 집계할 성적이 없어요" body="학생들이 성적을 입력하면 학급의 학기별 평균 추이가 여기에 표시돼요."/>;
  }

  const w = 720, h = 280, pad = 30;
  const vals = trend.map(t => t.average);
  const max = Math.min(100, Math.max(...vals) + 5), min = Math.max(0, Math.min(...vals) - 5);
  const span = Math.max(1, max - min);
  const xFor = (i) => trend.length === 1 ? w / 2 : pad + (i * (w - pad * 2)) / (trend.length - 1);
  const yFor = (v) => h - pad - ((v - min) / span) * (h - pad * 2 - 18);
  const xs = trend.map((_, i) => xFor(i)), ys = trend.map(t => yFor(t.average));
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 280 }}>
        <defs><linearGradient id="cls" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3182F6" stopOpacity="0.2"/><stop offset="100%" stopColor="#3182F6" stopOpacity="0"/></linearGradient></defs>
        {[0,1,2,3,4].map(i => { const y = pad + ((h-pad*2-22)/4)*i; return <line key={i} x1={pad} x2={w-pad} y1={y} y2={y} stroke="#E5E8EB" strokeDasharray="2 4"/>; })}
        {trend.length > 1 && <path d={`${line} L${xs[xs.length-1]},${h-pad} L${xs[0]},${h-pad} Z`} fill="url(#cls)"/>}
        {trend.length > 1 && <path d={line} fill="none" stroke="#3182F6" strokeWidth="3" strokeLinecap="round"/>}
        {xs.map((x, i) => <g key={i}><circle cx={x} cy={ys[i]} r="5.5" fill="#fff" stroke="#3182F6" strokeWidth="3"/><text x={x} y={ys[i]-16} textAnchor="middle" fontSize="15" fontWeight="700" fill="#3182F6">{trend[i].average}</text></g>)}
        {trend.map((t, i) => <text key={t.term} x={xFor(i)} y={h-6} textAnchor="middle" fontSize="13" fill="#6B7684">{t.term}</text>)}
      </svg>
      <div style={{ fontSize: 11, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 4 }}>학급 학생이 입력한 성적의 학기별 평균이에요{mode === 'sub' ? ' (과목별 분리는 데이터가 더 모이면 제공돼요)' : ''}.</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Classroom + Invite Code
// ────────────────────────────────────────────────────────
function TeacherClassroom({ go, openNotif }) {
  const isMobile = useViewportMobile();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { rows, meta, loading } = useTeacherRoster();
  const invite = useInviteCode();
  const count = meta?.count ?? rows.length;
  const avgProgress = rows.length ? Math.round(rows.reduce((a, s) => a + (s.aiProgress || 0), 0) / rows.length) : 0;
  const graded = rows.filter(s => s.gradeAverage != null);
  const avgGrade = graded.length ? Math.round((graded.reduce((a, s) => a + s.gradeAverage, 0) / graded.length) * 10) / 10 : null;
  const classroomLabel = [meta?.school, meta?.classroom].filter(Boolean).join(' ') || '우리 학급';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar help="teacher-classroom" title="우리 학급" subtitle={`${classroomLabel} · ${loading ? '…' : count}명`} openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Invite code panel */}
          <Card padding={28} style={{
            background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff',
          }}>
            <Chip tone="brand" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>학급 초대코드</Chip>
            <div className="num" style={{ fontSize: 56, fontWeight: 800, letterSpacing: '8px', marginTop: 16, fontFamily: 'var(--font-num)' }}>
              {invite.loading ? '······' : (invite.display || '코드 없음')}
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }} className="kr-heading">
              학생이 회원가입 시 이 코드를 입력하면 자동으로 학급에 참여돼요.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button variant="primary" size="md" leading={<IcCopy size={14}/>} disabled={!invite.display} style={{ background: '#fff', color: 'var(--brand-600)' }} onClick={() => invite.display && copyToast(invite.display, '초대코드를 복사했어요')}>
                코드 복사
              </Button>
              <Button variant="ghost" size="md" leading={<IcRefresh size={14}/>} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }} onClick={() => setConfirmOpen(true)}>
                코드 재발급
              </Button>
            </div>
            <div style={{ marginTop: 20, padding: 14, background: 'rgba(255,255,255,0.12)', borderRadius: 12, fontSize: 12, lineHeight: 1.55 }} className="kr-heading">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontWeight: 700 }}><IcInfo size={13}/> 무료 체험 중에는 초대코드를 사용할 수 있어요.</span>
              체험이 끝나면 교사 플랜 결제가 필요해요. 결제 후 코드는 자동으로 다시 활성화돼요.
            </div>
          </Card>

          {/* Capacity card */}
          <Card padding={24}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 12 }}>학급 정원</div>
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#E5E8EB" strokeWidth="12"/>
                <circle cx="80" cy="80" r="68" fill="none" stroke="#3182F6" strokeWidth="12"
                  strokeDasharray={`${(Math.min(count, 30)/30) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="num" style={{ fontSize: 38, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1px' }}>{loading ? '–' : count}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>/30명</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>평균 진행도</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-600)' }}>{loading ? '–' : `${avgProgress}%`}</div>
              </div>
              <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>평균 성적</div>
                <div className="num" style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)' }}>{loading ? '–' : (avgGrade == null ? '미입력' : avgGrade)}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Roster */}
        <SectionCard title="학급 학생" action={<Button variant="ghost" size="sm" onClick={() => go('students')} trailing={<IcChevronRight size={14}/>}>전체 학생 보기</Button>}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>{[0,1,2,3,4,5].map(i => <Skeleton key={i} height={64} radius={12}/>)}</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={<IcUsers size={24}/>} title="아직 등록된 학급 학생이 없어요" body="학급 초대코드를 공유해 첫 학생을 초대해보세요."/>
          ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
            {rows.map(s => (
              <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
                padding: 14, border: '1px solid var(--line-subtle)', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              }}>
                <Avatar name={(s.name || '?').slice(0,1)} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{fmtActivity(s.lastActivityAt)} · AI {s.aiProgress || 0}%</div>
                </div>
                {s.needsCounseling && <Chip tone="warning" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>상담</Chip>}
              </div>
            ))}
          </div>
          )}
        </SectionCard>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="초대코드를 재발급할까요?"
        body="기존 코드는 즉시 비활성화돼요. 이미 가입한 학생은 영향이 없어요."
        confirmLabel="재발급"
        onConfirm={async () => { const c = await invite.regenerate(); setConfirmOpen(false); showToast(c ? '초대코드를 재발급했어요' : '재발급하지 못했어요', c ? 'success' : 'error'); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Students list
// ────────────────────────────────────────────────────────
function TeacherStudents({ go, openNotif }) {
  const isMobile = useViewportMobile();
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const { rows, meta, loading, error, refetch } = useTeacherRoster();
  const allStudents = rows;
  const filtered = allStudents.filter(s => {
    if (q && !(s.name || '').includes(q)) return false;
    if (filter === 'all') return true;
    if (filter === 'needs-counseling') return s.needsCounseling;
    if (filter === 'ai') return (s.aiProgress || 0) > 0;
    if (filter === 'ungraded') return s.gradeAverage == null;
    return true;
  });
  const needsCounselingCount = allStudents.filter(s => s.needsCounseling).length;
  const aiCount = allStudents.filter(s => (s.aiProgress || 0) > 0).length;
  const ungradedCount = allStudents.filter(s => s.gradeAverage == null).length;
  const classroomLabel = [meta?.school, meta?.classroom].filter(Boolean).join(' ') || '우리 학급';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar
        help="teacher-students" title="학생 관리"
        subtitle={`${classroomLabel} ${loading ? '' : (meta?.count ?? allStudents.length) + '명 · '}검색으로 빠르게 찾으세요`}
        openNotif={openNotif}
        action={<>
          <Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('학급 학생 리포트', ['이름','학년','최근 평균','AI 진행도','학습 진도','마지막 활동'], filtered.map(s => [s.name, s.grade || '-', s.gradeAverage == null ? '미입력' : s.gradeAverage, `${s.aiProgress || 0}%`, `${s.studyDone}/${s.studyTotal}`, fmtActivity(s.lastActivityAt)]), { '학급': classroomLabel })}>리포트 내보내기</Button>
          <Button variant="primary" size="sm" leading={<IcPlus size={14}/>} onClick={() => setRegisterOpen(true)}>학생 등록</Button>
        </>}
      />
      <div style={{ padding: isMobile ? '14px 16px 8px' : '20px 28px 12px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-canvas)', flexWrap: 'wrap' }}>
        <TextInput value={q} onChange={setQ} placeholder="학생 이름으로 검색" leading={<IcSearch size={16}/>} style={{ flex: 1, minWidth: isMobile ? 140 : 240, height: 44 }}/>
        <Tabs items={[
          { id: 'all', label: `전체 ${allStudents.length}` },
          { id: 'needs-counseling', label: `상담 필요 ${needsCounselingCount}` },
          { id: 'ai', label: `AI 진행 ${aiCount}` },
          { id: 'ungraded', label: `성적 미입력 ${ungradedCount}` },
        ]} activeId={filter} onChange={setFilter}/>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: isMobile ? '0 12px 20px' : '0 28px 28px', background: 'var(--bg-canvas)' }}>
        {loading ? (
          <Card padding={16}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2,3,4].map(i => <Skeleton key={i} height={56} radius={12}/>)}</div></Card>
        ) : error ? (
          <Card padding={8}><EmptyState icon={<IcUsers size={24}/>} title="학생 목록을 불러오지 못했어요" body="잠시 후 다시 시도해주세요." action={<Button variant="primary" size="sm" onClick={refetch}>다시 시도</Button>}/></Card>
        ) : allStudents.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcUsers size={24}/>} title="아직 등록된 학급 학생이 없어요" body="학급 초대코드를 공유해 첫 학생을 초대해보세요." action={<Button variant="primary" size="sm" leading={<IcCopy size={14}/>}>초대코드 복사</Button>}/></Card>
        ) : filtered.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcSearch size={24}/>} title="검색 결과가 없어요" body="다른 이름이나 필터를 시도해보세요."/></Card>
        ) : (
        <Card padding={0} style={{ minWidth: isMobile ? 0 : 720 }}>
          {/* Header */}
          <div style={{
            display: isMobile ? 'none' : 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 1.2fr 1.4fr 36px',
            padding: '12px 20px', fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)',
            borderBottom: '1px solid var(--line-subtle)',
          }}>
            <span>학생</span>
            <span>최근 평균</span>
            <span>AI 진행도</span>
            <span>학습 진도</span>
            <span>마지막 활동</span>
            <span/>
          </div>
          {filtered.map((s, i) => isMobile ? (
            <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
              padding: '12px 14px', borderBottom: i < filtered.length - 1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={(s.name || '?').slice(0,1)} size={36}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {s.name}
                    {s.needsCounseling && <Chip tone="warning" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>상담 필요</Chip>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.grade || '학년 미정'}</div>
                </div>
                <IcChevronRight size={16} color="var(--fg-subtle)"/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 3 }}>최근 평균</div>
                  {s.gradeAverage == null ? <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>미입력</span> : <span className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.gradeAverage}</span>}
                </div>
                <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 3 }}>AI 진행도</div>
                  {aiProgressBadge(s.aiProgress || 0)}
                </div>
                <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 3 }}>학습 진도</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ProgressBar value={s.studyDone} max={Math.max(s.studyTotal, 1)} height={5}/>
                    <span className="num" style={{ fontSize: 11, color: 'var(--fg-muted)', minWidth: 28, textAlign: 'right' }}>{s.studyDone}/{s.studyTotal}</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 3 }}>마지막 활동</div>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{fmtActivity(s.lastActivityAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.4fr 1.2fr 1.4fr 36px',
              padding: '14px 20px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', transition: 'background 120ms',
              gap: 8,
            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={(s.name || '?').slice(0,1)} size={36}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {s.name}
                    {s.needsCounseling && <Chip tone="warning" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>상담 필요</Chip>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.grade || '학년 미정'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {s.gradeAverage == null ? (
                  <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>미입력</span>
                ) : (
                  <span className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.gradeAverage}</span>
                )}
              </div>
              <div>{aiProgressBadge(s.aiProgress || 0)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ProgressBar value={s.studyDone} max={Math.max(s.studyTotal, 1)} height={5}/>
                <span className="num" style={{ fontSize: 11, color: 'var(--fg-muted)', minWidth: 28, textAlign: 'right' }}>{s.studyDone}/{s.studyTotal}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{fmtActivity(s.lastActivityAt)}</span>
              </div>
              <IcChevronRight size={16} color="var(--fg-subtle)"/>
            </div>
          ))}
        </Card>
        )}
      </div>
      {registerOpen && <StudentRegisterDialog onSave={() => setRegisterOpen(false)} onClose={() => setRegisterOpen(false)}/>}
    </div>
  );
}

// Teacher manually registers a student into the classroom.
function StudentRegisterDialog({ onSave, onClose }) {
  const trapRef = useFocusTrap(true, onClose);
  const invite = useInviteCode();
  const [name, setName] = React.useState('');
  const [grade, setGrade] = React.useState('2-3');
  const [method, setMethod] = React.useState('invite'); // invite | direct
  const [err, setErr] = React.useState('');
  const save = () => {
    if (!name.trim()) { setErr('학생 이름을 입력해주세요'); return; }
    onSave({ name: name.trim(), grade });
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="학생 등록" style={{
        position: 'relative', width: 'min(440px, 100%)', background: 'var(--bg-elevated)',
        borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 320ms var(--ease-toss)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>학생 등록</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>초대 코드로 우리 학급에 학생을 초대하세요</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>

        {/* method toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'invite', label: '초대코드 공유', sub: '학생이 직접 가입' },
            { id: 'direct', label: '직접 등록', sub: '교사가 임의 추가' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              flex: 1, padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              border: '1px solid', borderColor: method === m.id ? 'var(--brand-500)' : 'var(--line-strong)',
              background: method === m.id ? 'var(--brand-50)' : 'var(--bg-surface)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: method === m.id ? 'var(--brand-600)' : 'var(--fg-strong)' }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{m.sub}</div>
            </button>
          ))}
        </div>

        {method === 'invite' ? (
          <div style={{ padding: 18, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', borderRadius: 14, color: '#fff', textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>이 코드를 학생에게 공유하세요</div>
            <div className="num" style={{ fontSize: 32, fontWeight: 800, letterSpacing: '6px' }}>{invite.loading ? '······' : (invite.display || '코드 없음')}</div>
            <Button variant="primary" size="sm" leading={<IcCopy size={13}/>} disabled={!invite.display} style={{ background: '#fff', color: 'var(--brand-600)', marginTop: 12 }} onClick={() => invite.display && copyToast(invite.display, '초대코드를 복사했어요')}>코드 복사</Button>
          </div>
        ) : (
          <>
            <FormField label="학생 이름" required style={{ marginBottom: 12 }}>
              <TextInput value={name} onChange={setName} placeholder="예) 김하늘" autoFocus/>
            </FormField>
            <FormField label="학년 / 반" style={{ marginBottom: 12 }}>
              <TextInput value={grade} onChange={setGrade} placeholder="예) 2-3"/>
            </FormField>
            {err && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 8 }}>{err}</div>}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              <IcInfo size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
              <span className="kr-heading">직접 등록한 학생은 추후 본인 계정과 연결할 수 있어요. 등록 후 성적은 학생 상세 → 성적 탭에서 입력하세요.</span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>닫기</Button>
          {method === 'direct' && <Button variant="primary" full onClick={save}>등록하기</Button>}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Student detail
// ────────────────────────────────────────────────────────
function TeacherStudentDetail({ go, openNotif }) {
  const [tab, setTab] = React.useState('overview');
  const id = (typeof window !== 'undefined' && window.__selectedStudentId) || null;
  const [detail, setDetail] = React.useState(null); // null = loading
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    setDetail(null); setError(null);
    if (!id) { setError(new Error('학생이 선택되지 않았어요.')); setDetail({}); return; }
    (async () => {
      try {
        const r = await window.__apiFetch('/teacher/students/' + encodeURIComponent(id), { method: 'GET' });
        if (alive) setDetail(r.data || {});
      } catch (e) {
        if (alive) { setError(e); setDetail({}); }
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const loading = detail === null;
  const student = detail?.student || {};
  const subtitle = [student.school, student.classroom].filter(Boolean).join(' ') || (loading ? '불러오는 중…' : '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar
        help="teacher-detail"
        title={loading ? '학생 상세' : (student.name || '학생')}
        subtitle={subtitle}
        openNotif={openNotif}
        action={<Button variant="outline" size="sm" leading={<IcChevronRight size={14} style={{ transform: 'rotate(180deg)' }}/>} onClick={() => go('students')}>목록으로</Button>}
      />
      <div style={{ padding: '0 28px', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--line-subtle)' }}>
        <Tabs variant="underline" items={[
          { id: 'overview', label: '종합' },
          { id: 'grades', label: '성적' },
          { id: 'signals', label: 'AI 진로 단서' },
          { id: 'targets', label: '진로 목표' },
        ]} activeId={tab} onChange={setTab}/>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{[0,1,2].map(i => <Skeleton key={i} height={120} radius={16}/>)}</div>
        ) : error ? (
          <Card padding={8}><EmptyState icon={<IcUser size={24}/>} title="학생 정보를 불러오지 못했어요" body={!id ? '학생 목록에서 학생을 선택해주세요.' : '담당 학급 학생만 조회할 수 있어요.'} action={<Button variant="primary" size="sm" onClick={() => go('students')}>학생 목록</Button>}/></Card>
        ) : (
          <>
            {tab === 'overview' && <TeacherStudentOverview detail={detail} onTab={setTab}/>}
            {tab === 'grades' && <TeacherStudentGrades grades={detail.grades || []}/>}
            {tab === 'signals' && <TeacherStudentSignals signals={detail.signals || []} aiProgress={detail.aiProgress || 0}/>}
            {tab === 'targets' && <TeacherStudentTargets targets={detail.targets || []}/>}
          </>
        )}
      </div>
    </div>
  );
}

// Group grade rows by term and compute a per-term average. Real data only.
function groupGradesByTerm(grades) {
  const byTerm = new Map();
  (grades || []).forEach(g => {
    const a = byTerm.get(g.term) || [];
    a.push(g);
    byTerm.set(g.term, a);
  });
  return [...byTerm.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([term, items]) => {
    const scored = items.filter(i => i.score != null);
    const avg = scored.length ? Math.round((scored.reduce((s, i) => s + i.score, 0) / scored.length) * 10) / 10 : null;
    return { term, items, avg };
  });
}

function TeacherStudentOverview({ detail, onTab }) {
  const isMobile = useViewportMobile();
  const grades = detail.grades || [];
  const signals = detail.signals || [];
  const targets = detail.targets || [];
  const terms = groupGradesByTerm(grades);
  const lastAvg = terms.length ? terms[terms.length - 1].avg : null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padding={20}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>최근 평균</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--fg-strong)' }}>{lastAvg == null ? '미입력' : lastAvg}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>AI 진행도</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--fg-strong)' }}>{detail.aiProgress || 0}<span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>%</span></div>
              {aiProgressBadge(detail.aiProgress || 0)}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>진로 단서</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--fg-strong)' }}>{signals.length}<span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 500 }}>개</span></div>
            </div>
          </div>
        </Card>
        <SectionCard title="AI 진로 단서" subtitle="대화에서 반복적으로 보인 패턴" action={signals.length > 0 && <Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => onTab('signals')}>전체</Button>}>
          {signals.length === 0 ? (
            <EmptyState icon={<IcSparkles size={22}/>} title="아직 진로 단서가 없어요" body="학생이 AI 상담을 진행하면 단서가 쌓여요."/>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {signals.slice(0, 4).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <Chip tone="info" size="sm">{s.tag}</Chip>
                <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1 }} className="kr-heading">{s.text}</span>
              </div>
            ))}
          </div>
          )}
        </SectionCard>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionCard title="진로 목표" action={targets.length > 0 && <Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => onTab('targets')}>전체</Button>}>
          {targets.length === 0 ? (
            <EmptyState icon={<IcClipboard size={22}/>} title="설정된 진로 목표가 없어요" body="학생이 목표를 설정하면 여기에 표시돼요."/>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {targets.map((t) => (
              <div key={t.id} style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{t.career || t.dept || '진로 목표'}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }} className="kr-heading">{[t.univ, t.dept].filter(Boolean).join(' · ') || t.track || ''}</div>
              </div>
            ))}
          </div>
          )}
        </SectionCard>
        <SectionCard title="성적" action={grades.length > 0 && <Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => onTab('grades')}>전체</Button>}>
          {terms.length === 0 ? (
            <EmptyState icon={<IcChart size={22}/>} title="입력된 성적이 없어요" body="아직 등록된 성적 기록이 없어요."/>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {terms.map((t) => (
              <div key={t.term} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-default)' }}>{t.term}</span>
                <span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.avg == null ? '–' : t.avg}</span>
              </div>
            ))}
          </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function TeacherStudentGrades({ grades }) {
  const isMobile = useViewportMobile();
  const terms = groupGradesByTerm(grades);
  if (terms.length === 0) {
    return <Card padding={8}><EmptyState icon={<IcChart size={24}/>} title="입력된 성적이 없어요" body="아직 등록된 성적 기록이 없어요."/></Card>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {terms.map((t) => (
        <SectionCard key={t.term} title={t.term} action={t.avg != null && <Chip tone="info" size="sm">평균 {t.avg}</Chip>}>
          <Card padding={0}>
            <div style={{ display: isMobile ? 'none' : 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', borderBottom: '1px solid var(--line-subtle)' }}>
              <span>과목</span><span>분류</span><span>점수</span><span>등급</span>
            </div>
            {t.items.map((g, i) => isMobile ? (
              <div key={g.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: i < t.items.length - 1 ? '1px solid var(--line-subtle)' : 'none' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{g.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{g.category || '-'}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{g.score == null ? '-' : g.score + '점'}</div>
                  <div className="num" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{g.rank == null ? '-' : g.rank + '등급'}</div>
                </div>
              </div>
            ) : (
              <div key={g.id || i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', padding: '12px 16px', alignItems: 'center', fontSize: 13, borderBottom: i < t.items.length - 1 ? '1px solid var(--line-subtle)' : 'none' }}>
                <span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{g.subject}</span>
                <span style={{ color: 'var(--fg-muted)' }}>{g.category || '-'}</span>
                <span className="num" style={{ color: 'var(--fg-strong)' }}>{g.score == null ? '-' : g.score}</span>
                <span className="num" style={{ color: 'var(--fg-muted)' }}>{g.rank == null ? '-' : g.rank}</span>
              </div>
            ))}
          </Card>
        </SectionCard>
      ))}
    </div>
  );
}

function TeacherStudentSignals({ signals, aiProgress }) {
  return (
    <SectionCard title="AI 진로 단서" subtitle={`대화에서 추출된 단서 · AI 진행도 ${aiProgress}%`}>
      {signals.length === 0 ? (
        <EmptyState icon={<IcSparkles size={24}/>} title="아직 진로 단서가 없어요" body="학생이 AI 상담을 진행하면 단서가 쌓여요."/>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {signals.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10 }}>
            <Chip tone="info" size="sm">{s.tag}</Chip>
            <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1, lineHeight: 1.5 }} className="kr-heading">{s.text}</span>
          </div>
        ))}
      </div>
      )}
    </SectionCard>
  );
}

function TeacherStudentTargets({ targets }) {
  return (
    <SectionCard title="진로 목표" subtitle="학생이 설정한 진로 목표">
      {targets.length === 0 ? (
        <EmptyState icon={<IcClipboard size={24}/>} title="설정된 진로 목표가 없어요" body="학생이 목표를 설정하면 여기에 표시돼요."/>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {targets.map((t) => (
          <div key={t.id} style={{ padding: 16, border: '1px solid var(--line-subtle)', borderRadius: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{t.career || t.dept || '진로 목표'}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }} className="kr-heading">{[t.univ, t.dept, t.track].filter(Boolean).join(' · ')}</div>
            {t.reason && <div style={{ fontSize: 13, color: 'var(--fg-default)', marginTop: 8, lineHeight: 1.5, padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 8 }} className="kr-heading">{t.reason}</div>}
          </div>
        ))}
      </div>
      )}
    </SectionCard>
  );
}

function GradeInputDialog({ studentName, onSave, onClose }) {
  const trapRef = useFocusTrap(true, onClose);
  const baseSubjects = ['국어', '수학', '영어', '사회', '과학'];
  const [exam, setExam] = React.useState('6월 모의고사');
  const [date, setDate] = React.useState('2026-06-05');
  const [scores, setScores] = React.useState({ 국어: '', 수학: '', 영어: '', 사회: '', 과학: '' });
  const [extras, setExtras] = React.useState([]); // { name, score }
  const [err, setErr] = React.useState('');

  const setScore = (s, v) => {
    if (v !== '' && (isNaN(+v) || +v < 0 || +v > 100)) return;
    setScores(p => ({ ...p, [s]: v }));
  };
  const addExtra = () => setExtras(e => [...e, { name: '', score: '' }]);
  const setExtra = (i, k, v) => { if (k === 'score' && v !== '' && (isNaN(+v) || +v < 0 || +v > 100)) return; setExtras(e => e.map((x, j) => j === i ? { ...x, [k]: v } : x)); };
  const removeExtra = (i) => setExtras(e => e.filter((_, j) => j !== i));
  const filled = baseSubjects.filter(s => scores[s] !== '').length + extras.filter(e => e.name.trim() && e.score !== '').length;
  const save = () => {
    if (!exam.trim()) { setErr('시험 이름을 입력해주세요'); return; }
    if (filled === 0) { setErr('한 과목 이상 점수를 입력해주세요'); return; }
    const rec = { exam: exam.trim(), date };
    baseSubjects.forEach(s => { if (scores[s] !== '') rec[s] = +scores[s]; });
    extras.forEach(e => { if (e.name.trim() && e.score !== '') rec[e.name.trim()] = +e.score; });
    onSave(rec);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="성적 입력" style={{
        position: 'relative', width: 'min(460px, 100%)', maxHeight: '90%', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)',
        animation: 'sheetIn 320ms var(--ease-toss)',
      }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>성적 입력</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{studentName} 학생 · 교사 직접 입력</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <FormField label="시험" required style={{ flex: 1.4 }}>
            <TextInput value={exam} onChange={setExam} placeholder="예) 6월 모의고사"/>
          </FormField>
          <FormField label="응시일" style={{ flex: 1 }}>
            <TextInput value={date} onChange={setDate} placeholder="2026-06-05"/>
          </FormField>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
          {baseSubjects.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', width: 48 }}>{s}</span>
              <div style={{ flex: 1 }}>
                <TextInput value={scores[s]} onChange={v => setScore(s, v)} placeholder="0 ~ 100" trailing={<span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>점</span>}/>
              </div>
            </div>
          ))}
          {extras.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 96 }}><TextInput value={e.name} onChange={v => setExtra(i, 'name', v)} placeholder="과목명" style={{ height: 52 }}/></div>
              <div style={{ flex: 1 }}><TextInput value={e.score} onChange={v => setExtra(i, 'score', v)} placeholder="0 ~ 100" trailing={<span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>점</span>}/></div>
              <button onClick={() => removeExtra(i)} style={{ background: 'transparent', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 6 }}><IcX size={16}/></button>
            </div>
          ))}
        </div>
        <Button variant="brandSoft" size="sm" leading={<IcPlus size={13}/>} onClick={addExtra} style={{ marginBottom: 8 }}>기타 과목 추가</Button>
        {err && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 8 }}>{err}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--brand-50)', borderRadius: 10, fontSize: 12, color: 'var(--brand-600)', margin: '8px 0 16px' }}>
          <IcInfo size={14}/><span className="kr-heading">입력한 성적은 학생에게도 공유돼요. 언제든 다시 수정할 수 있어요.</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full onClick={save}>저장 ({filled}/5)</Button>
        </div>
      </div>
    </div>
  );
}
function StudentDetailReport({ onOpenReport }) {
  return <SectionCard title="AI 진로 리포트" subtitle="학생이 공유한 1차 리포트"
    action={<Button variant="primary" size="sm" leading={<IcDoc size={14}/>} onClick={onOpenReport}>전체 리포트 보기</Button>}>
    <div style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.6 }} className="kr-heading">
      영상 편집·시각적 흐름·타인의 반응에서 동기를 얻는 모습이 보여요. 콘텐츠 디자인, 영상 연출 쪽이 잠정 가설이에요.
    </div>
  </SectionCard>;
}
function StudentDetailStudy() {
  const items = [
    { t: '수학 II 미적분 5단원', sub: '수학', done: true },
    { t: '영어 단어 Day 14 (100개)', sub: '영어', done: true },
    { t: '국어 비문학 3지문', sub: '국어', done: true },
    { t: '사회 단원평가 7단원', sub: '사회', done: true },
    { t: '과학 화학 4단원 문제', sub: '과학', done: true },
    { t: '수학 모의고사 오답 정리', sub: '수학', done: false },
    { t: '영어 듣기 2회', sub: '영어', done: false },
    { t: '국어 문학 작품 정리', sub: '국어', done: false },
  ];
  const done = items.filter(i => i.done).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>이번 주 학습 진도</span>
          <Chip tone="info" size="sm">{done}/{items.length}</Chip>
        </div>
        <ProgressBar value={done} max={items.length} height={8}/>
        <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
          <div><div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>완료</div><div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--success)' }}>{done}</div></div>
          <div><div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>남음</div><div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{items.length - done}</div></div>
          <div><div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>자습 누적</div><div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-600)' }}>8.4h</div></div>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SectionCard title="완료한 학습" subtitle={`${done}개`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.filter(i => i.done).map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--success-bg)', borderRadius: 10 }}>
                <IcCheckCircle size={16} color="var(--success)"/>
                <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1, textDecoration: 'line-through' }} className="kr-heading">{it.t}</span>
                <Chip tone="neutral" size="sm">{it.sub}</Chip>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="남은 학습" subtitle={`${items.length - done}개`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.filter(i => !i.done).map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--bg-muted)', borderRadius: 10 }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, border: '1.5px dashed var(--fg-subtle)', flexShrink: 0 }}/>
                <span style={{ fontSize: 13, color: 'var(--fg-strong)', flex: 1 }} className="kr-heading">{it.t}</span>
                <Chip tone="warning" size="sm">{it.sub}</Chip>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
function StudentDetailMemo() {
  return (
    <Card padding={0}>
      {[
        { d: '5월 13일', t: '이번 주 영어 단어 진도가 좋아요. 모의고사 어법 부분도 다음 주에 같이 정리해봅시다.', visible: true },
        { d: '5월 6일', t: '수학 내신 점수가 흔들렸어요. 부족한 단원 같이 보면 좋겠습니다.', visible: true },
        { d: '4월 28일', t: '학부모 상담 메모: 가정 학습 시간 부족함. 6월 모의고사 전까지 모니터링.', visible: false },
      ].map((m, i, arr) => (
        <div key={i} style={{ padding: 20, borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{m.d}</span>
            <Chip tone={m.visible ? 'success' : 'neutral'} size="sm">{m.visible ? '학생 공개' : '비공개'}</Chip>
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{m.t}</div>
        </div>
      ))}
    </Card>
  );
}

function MemoOverlay({ onClose, pickStudent }) {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = React.useState(true);
  const [student, setStudent] = React.useState('');
  const [q, setQ] = React.useState('');
  const trapRef = useFocusTrap(true, onClose);
  const roster = (typeof TEACHER_STUDENTS !== 'undefined' ? TEACHER_STUDENTS : []).filter(s => s.name.includes(q));
  const canSave = student && text.trim();
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.45)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="상담 메모" style={{
        position: 'relative', width: 480, maxWidth: '94%', maxHeight: '90%', overflow: 'auto', background: 'var(--bg-elevated)',
        borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)',
      }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{pickStudent ? '상담 기록 추가' : `${student} 상담 메모`}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>2학년 3반 · {new Date().toLocaleDateString('ko-KR')}</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        {pickStudent && (
          <FormField label="학생 선택" required style={{ marginBottom: 14 }}>
            <TextInput value={q} onChange={setQ} placeholder="학생 이름 검색" leading={<IcSearch size={16}/>} style={{ marginBottom: 8 }}/>
            <div style={{ maxHeight: 168, overflow: 'auto', border: '1px solid var(--line-subtle)', borderRadius: 12 }} className="toss-scroll">
              {roster.length === 0 ? <div style={{ padding: 18, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>학생을 찾을 수 없어요</div>
              : roster.map((s, i) => (
                <button key={s.id} onClick={() => setStudent(s.name)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  borderBottom: i < roster.length-1 ? '1px solid var(--line-subtle)' : 'none',
                  background: student === s.name ? 'var(--brand-50)' : 'transparent',
                }}>
                  <Avatar name={s.name[0]} size={30}/>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.grade}</div></div>
                  {student === s.name && <IcCheckCircle size={18} color="var(--brand-500)"/>}
                </button>
              ))}
            </div>
          </FormField>
        )}
        <Textarea value={text} onChange={setText} rows={6} placeholder={student ? `${student} 학생 상담 내용을 입력하세요` : '먼저 학생을 선택하세요'}/>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 14,
          padding: 12, borderRadius: 10, background: 'var(--bg-muted)',
          cursor: 'pointer',
        }}>
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>학생에게 공개</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>꺼두면 본인에게만 보여요</div>
          </div>
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!canSave} onClick={() => { showToast(`${student} 상담 기록을 저장했어요`, 'success'); onClose(); }}>저장</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Counseling (requests + memos)
// ────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────
// SCREEN: Counseling — 교사용 상담 기록 백엔드가 없으므로,
// roster의 needsCounseling 학생을 "상담이 필요한 학생"으로 정직하게 노출.
// ────────────────────────────────────────────────────────
function TeacherCounseling({ go, openNotif }) {
  const { rows, loading, error, refetch } = useTeacherRoster();
  const needs = rows.filter(s => s.needsCounseling);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar help="teacher-counseling" title="상담 · 기록" subtitle="상담이 필요한 학생을 확인하고 메시지로 연락하세요" openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        <div style={{ marginBottom: 14, padding: 12, background: 'var(--info-bg)', borderRadius: 10, fontSize: 12, color: 'var(--brand-600)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
          <IcShield size={14} style={{ flexShrink: 0, marginTop: 1 }}/>
          <span className="kr-heading">AI 진행도·성적 입력 현황을 바탕으로 살펴볼 학생을 모았어요. (학업·상담 관점 참고 정보)</span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[0,1,2].map(i => <Skeleton key={i} height={88} radius={14}/>)}</div>
        ) : error ? (
          <Card padding={8}><EmptyState icon={<IcClipboard size={24}/>} title="목록을 불러오지 못했어요" body="잠시 후 다시 시도해주세요." action={<Button variant="primary" size="sm" onClick={refetch}>다시 시도</Button>}/></Card>
        ) : needs.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcCheck size={24}/>} title="상담이 필요한 학생이 없어요" body="현재 모든 학생이 잘 따라오고 있어요."/></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {needs.map((s) => (
              <Card key={s.id} padding={20}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Avatar name={(s.name || '?').slice(0,1)} size={48}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</span>
                      <Chip tone="warning" size="sm">{counselReason(s)}</Chip>
                      <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>· {s.grade || '학년 미정'}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg-muted)' }} className="kr-heading">AI 진행도 {s.aiProgress || 0}% · 학습 {s.studyDone}/{s.studyTotal} · 마지막 활동 {fmtActivity(s.lastActivityAt)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Button variant="outline" size="sm" onClick={() => openStudentDetail(go, s.id)} leading={<IcUser size={12}/>}>상세 보기</Button>
                    <Button variant="primary" size="sm" onClick={() => go('messages')} leading={<IcMessage size={12}/>}>메시지 보내기</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickMessageDialog({ student, onClose }) {
  const [text, setText] = React.useState('');
  const trapRef = useFocusTrap(true, onClose);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label={`${student.name}님에게 메시지`} style={{ position: 'relative', width: 'min(440px, 100%)', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 320ms var(--ease-toss)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar name={student.name.slice(0,1)} size={40}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{student.name}님에게 메시지</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>상담 요청에 대한 답변</div>
          </div>
          <IconButton icon={<IcX size={18}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 6 }}>빠른 답변</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              '확인했어요. 다음 주 화요일 어떨까요?',
              '내일 점심시간에 잠깐 만날까요?',
              '먼저 메시지로 자세히 들려주세요',
            ].map(q => (
              <button key={q} onClick={() => setText(q)} style={{ padding: '6px 10px', border: '1px solid var(--line)', background: 'var(--bg-surface)', borderRadius: 8, fontSize: 11, color: 'var(--fg-default)', cursor: 'pointer' }} className="kr-heading">{q}</button>
            ))}
          </div>
        </div>
        <Textarea value={text} onChange={setText} rows={5} placeholder={`${student.name}님에게 보낼 메시지를 입력하세요`}/>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!text.trim()} leading={<IcSend size={14}/>} onClick={onClose}>보내기</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Notifications (teacher)
// ────────────────────────────────────────────────────────
function TeacherNotifications({ openNotif }) {
  const [items, setItems] = React.useState(null); // null = loading
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/notifications', { method: 'GET' });
        if (alive) setItems(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, []);
  const loading = items === null;
  const fmt = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return fmtActivity(iso) === '활동 없음' ? d.toLocaleDateString('ko-KR') : fmtActivity(iso);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar title="알림" subtitle="학급 활동 알림을 확인하세요" openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '20px 28px', background: 'var(--bg-canvas)' }}>
        {loading ? (
          <Card padding={16}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2,3].map(i => <Skeleton key={i} height={48} radius={10}/>)}</div></Card>
        ) : items.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcBell size={24}/>} title="새 알림이 없어요" body="학급에 새로운 활동이 생기면 여기에 표시돼요."/></Card>
        ) : (
        <Card padding={0}>
          {items.map((n, i) => {
            const unread = !(n.read || n.readAt);
            return (
            <div key={n.id || i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 20px',
              borderBottom: i < items.length-1 ? '1px solid var(--line-subtle)' : 'none',
              background: unread ? 'rgba(49,130,246,0.025)' : 'transparent',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--brand-50)', color: 'var(--brand-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}><IcBell size={18}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{n.title || n.type || '알림'}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{fmt(n.createdAt || n.at)}</span>
                </div>
                {(n.body || n.message) && <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }} className="kr-heading">{n.body || n.message}</div>}
              </div>
              {unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 14 }}/>}
            </div>
            );
          })}
        </Card>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Billing (teacher) — uses shared BillingScreen
// ────────────────────────────────────────────────────────
function TeacherBilling({ openNotif }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar title="구독 및 결제" subtitle="무료 플랜으로 끊김 없이 운영하세요" openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', background: 'var(--bg-canvas)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px 28px' }}>
          <BillingScreen go={() => {}} role="teacher"/>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main TeacherApp
// ────────────────────────────────────────────────────────
function TeacherApp({ initialScreen = 'dashboard' }) {
  const [screen, setScreen] = usePersistentScreen('teacher-web', initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifItems, setNotifItems] = React.useState(null); // null = loading
  const openNotif = () => setNotifOpen(true);
  React.useEffect(() => {
    if (!notifOpen) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/notifications', { method: 'GET' });
        if (alive) setNotifItems(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        if (alive) setNotifItems([]);
      }
    })();
    return () => { alive = false; };
  }, [notifOpen]);
  const tour = useTour(TEACHER_TOUR_STEPS, 'teacher');
  React.useEffect(() => { try { if (window.__LIVE_MODE && localStorage.getItem('jinro:webtour:teacher')) tour.setPhase('done'); } catch (e) {} }, []);
  React.useEffect(() => { if (tour.phase === 'done') { try { localStorage.setItem('jinro:webtour:teacher', '1'); } catch (e) {} } }, [tour.phase]);
  // 첫 온보딩 시 모바일 사이드바 자동 오픈 — tour가 "이 메뉴 클릭" 안내할 때 빈 곳 안 가리키게
  React.useEffect(() => {
    if (isMobile && (tour.phase === 'welcome' || tour.phase === 'tour')) setNavOpen(true);
  }, [tour.phase, isMobile]);
  const teacherNavId = screen === 'student-detail' ? 'students' : (screen.startsWith('admissions') ? 'admissions-hub' : screen);
  const wrapNav = (s) => { setScreen(s); setNavOpen(false); };
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden' }}>
      {isMobile && <MobileTopBar title="진로나침반 · 교사" onMenu={() => setNavOpen(true)}/>}
      {isMobile
        ? <SidebarDrawer open={navOpen} onClose={() => setNavOpen(false)}><TeacherSidebar activeId={teacherNavId} onChange={wrapNav}/></SidebarDrawer>
        : <TeacherSidebar activeId={teacherNavId} onChange={setScreen}/>}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%', minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {screen === 'dashboard' && <TeacherDashboard go={setScreen} openNotif={openNotif}/>}
        {screen === 'classroom' && <TeacherClassroom go={setScreen} openNotif={openNotif}/>}
        {screen === 'students' && <TeacherStudents go={setScreen} openNotif={openNotif}/>}
        {screen === 'student-detail' && <TeacherStudentDetail go={setScreen} openNotif={openNotif}/>}
        {screen === 'counseling' && <TeacherCounseling go={setScreen} openNotif={openNotif}/>}
        {screen === 'messages' && <TeacherMessages openNotif={openNotif} go={setScreen}/>}
        {screen === 'calendar' && <TeacherCalendar openNotif={openNotif} go={setScreen}/>}
        {screen === 'notifications' && <TeacherNotifications openNotif={openNotif}/>}
        {screen === 'billing' && <TeacherBilling openNotif={openNotif}/>}
        {screen === 'ai-view' && <TeacherAIView/>}
        {screen === 'completion' && <CompletionStatus go={setScreen}/>}
        {screen === 'ai-coach' && <AIChatRAG go={setScreen} coach/>}
        {screen === 'admissions-hub' && <AdmissionsHub go={setScreen}/>}
        {screen === 'volunteers' && <VolunteersScreen go={setScreen}/>}
        {screen === 'scholarships' && <ScholarshipsScreen go={setScreen}/>}
        {screen === 'admissions-univ' && <UniversityDetail go={setScreen}/>}
        {screen === 'admissions-dept' && <DepartmentDetail go={setScreen}/>}
        {screen === 'consents' && <ConsentManagement go={setScreen} role="teacher"/>}
        {screen === 'announcements' && <AnnouncementsScreen role="teacher" variant="web"/>}
        {screen === 'profile' && <TeacherProfile go={setScreen} openNotif={openNotif}/>}
        {screen === 'teacher-info' && <TeacherInfoScreen go={setScreen}/>}
        {screen === 'settings-password' && <SettingsPassword back={() => setScreen('profile')}/>}
        {screen === 'settings-notifications' && <SettingsNotifications back={() => setScreen('profile')} role="teacher"/>}
        {screen === 'settings-suggest' && <SettingsSuggestion back={() => setScreen('profile')}/>}
        {screen === 'settings-announcements' && <SettingsAnnouncements back={() => setScreen('profile')}/>}
        {screen === 'settings-terms' && <SettingsTerms back={() => setScreen('profile')}/>}
      </main>
      {notifOpen && <TeacherNotifPopover items={notifItems} onClose={() => setNotifOpen(false)} onAll={() => { setNotifOpen(false); setScreen('notifications'); }}/>}
      <TourOverlay tour={tour}/>
    </div>
  );
}

function TeacherNotifPopover({ items, onClose, onAll }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40 }}/>
      <div style={{
        position: 'absolute', top: 64, right: 28, zIndex: 41,
        width: 'min(360px, calc(100vw - 40px))', background: 'var(--bg-elevated)',
        borderRadius: 16, boxShadow: 'var(--shadow-pop)',
        overflow: 'hidden',
        animation: 'sheetIn 220ms var(--ease-toss)',
      }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }}>알림</div>
          <button onClick={onAll} style={{ background: 'transparent', border: 'none', color: 'var(--brand-600)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>전체 보기</button>
        </div>
        {items === null ? (
          <div style={{ padding: '24px 18px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '28px 18px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>아직 알림이 없어요</div>
        ) : items.map(n => {
          const unread = !(n.read || n.readAt);
          return (
          <div key={n.id} style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: unread ? 'var(--brand-500)' : 'transparent', marginTop: 6 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{n.title || n.type || '알림'}</span>
                <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{fmtActivity(n.createdAt)}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{n.body || n.message}</div>
            </div>
          </div>
          );
        })}
      </div>
    </>
  );
}

Object.assign(window, { TeacherApp, TeacherTopbar, TeacherSidebar });
