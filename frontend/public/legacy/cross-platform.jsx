// cross-platform.jsx — Student WEB, Teacher MOBILE, Admin MOBILE dashboards
// + dashboards with live toast cycle demo

// ────────────────────────────────────────────────────────
// Hook: cycle through sample toasts
// ────────────────────────────────────────────────────────
function useToastCycle(samples, intervalMs = 3500) {
  const [active, setActive] = React.useState([]);
  const idxRef = React.useRef(0);
  React.useEffect(() => {
    let dismiss = [];
    const fire = () => {
      const s = samples[idxRef.current % samples.length];
      idxRef.current += 1;
      const uid = `${s.id}-${Date.now()}`;
      setActive(a => [{ ...s, id: uid }, ...a].slice(0, 3));
      const tid = setTimeout(() => {
        setActive(a => a.filter(x => x.id !== uid));
      }, s.duration || 6000);
      dismiss.push(tid);
    };
    fire();
    const iv = setInterval(fire, intervalMs);
    return () => { clearInterval(iv); dismiss.forEach(clearTimeout); };
  }, [samples, intervalMs]);
  const close = (id) => setActive(a => a.filter(x => x.id !== id));
  return { active, close };
}

// ────────────────────────────────────────────────────────
// STUDENT — WEB layout (responsive dashboard for desktop)
// ────────────────────────────────────────────────────────
// 섹션 그룹화 — 19개 평면 메뉴를 5개 그룹으로 정리. 해외대학은 대학·입시 탭으로 이동(제거).
const STUDENT_WEB_NAV = [
  { id: 'dashboard', label: '홈', icon: <IcHome/> },
  { section: '진로' },
  { id: 'ai-counseling', label: 'AI 진로 상담', icon: <IcSparkles/>, badge: '진행 중' },
  { id: 'ai-chat', label: 'AI 도움말', icon: <IcMessage/>, badge: 'RAG' },
  { id: 'career-report', label: '진로 리포트', icon: <IcCompass/> },
  { id: 'career-targets', label: '진로 목표', icon: <IcTarget/> },
  { section: '대학·입시' },
  { id: 'admissions-hub', label: '대학·입시 (국내·해외)', icon: <IcGraduation/> },
  { id: 'volunteers', label: '봉사활동', icon: <IcHeart/> },
  { id: 'scholarships', label: '장학금', icon: <IcCreditCard/> },
  { section: '학습' },
  { id: 'grades-trend', label: '성적', icon: <IcChart/> },
  { id: 'study-plan', label: '학습 계획', icon: <IcBook/> },
  { id: 'focus-timer', label: '자습 타임어택', icon: <IcZap/> },
  { section: '소통·일정' },
  { id: 'calendar', label: '캘린더', icon: <IcCalendar/> },
  { id: 'messages', label: '메시지', icon: <IcMessage/> },
  { id: 'counseling', label: '상담 · 기록', icon: <IcClipboard/> },
  { id: 'announcements', label: '공지사항', icon: <IcFlag/> },
  { section: '계정' },
  { id: 'consents', label: '동의 관리', icon: <IcShield/> },
  { id: 'billing', label: '구독 및 결제', icon: <IcCreditCard/> },
  { id: 'profile', label: '내정보', icon: <IcUser/> },
];

function StudentWebSidebar({ activeId, onChange }) {
  const [goal, setGoal] = React.useState(null); // { career, univ, dept, progress }
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) {}
      try {
        const [t, d] = await Promise.all([
          window.__apiFetch('/career/targets', { method: 'GET' }).catch(() => null),
          window.__apiFetch('/dashboard/student', { method: 'GET' }).catch(() => null),
        ]);
        const first = t && (t.data || [])[0];
        setGoal({
          career: first ? first.career : null,
          univ: first ? [first.univ, first.dept].filter(Boolean).join(' ') : null,
          progress: (d && d.data && d.data.aiProgress) || 0,
        });
      } catch (e) { setGoal({ career: null, univ: null, progress: 0 }); }
    })();
  }, []);
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--line-subtle)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 20px' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcCompass size={18}/>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>진로나침반</div>
          <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>학생용</div>
        </div>
      </div>
      <div onClick={() => onChange && onChange(goal && goal.career ? 'career-targets' : 'ai-counseling')} style={{ margin: '0 0 16px', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff', cursor: 'pointer' }}>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 4 }}>나의 목표</div>
        {goal && goal.career ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 700 }} className="kr-heading">{goal.career}</div>
            {goal.univ && <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>{goal.univ}</div>}
          </>
        ) : (
          <div style={{ fontSize: 13, fontWeight: 700 }} className="kr-heading">아직 목표가 없어요</div>
        )}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: ((goal && goal.progress) || 0) + '%', height: '100%', background: '#fff' }}/>
        </div>
        <div style={{ fontSize: 10, opacity: 0.85, marginTop: 6 }}>AI 상담 진행도 {(goal && goal.progress) || 0}%</div>
      </div>
      <nav className="toss-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {STUDENT_WEB_NAV.map((it, idx) => {
          if (it.section) {
            return (
              <div key={'sec-' + it.section} style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', letterSpacing: '0.4px', padding: '12px 12px 4px', textTransform: 'uppercase' }}>{it.section}</div>
            );
          }
          const active = activeId === it.id;
          const tourAttr = {
            'ai-counseling': 'student-nav-ai',
            'career-targets': 'student-nav-targets',
            'admissions-hub': 'student-nav-admissions',
            'grades-trend': 'student-nav-grades',
            'study-plan': 'student-nav-study',
            'ai-chat': 'student-nav-aichat',
            'counseling': 'student-nav-counseling',
            'messages': 'student-nav-messages',
            'calendar': 'student-nav-calendar',
            'announcements': 'student-nav-notice',
          }[it.id];
          return (
            <button key={it.id} data-tour={tourAttr} onClick={() => onChange(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', border: 'none', borderRadius: 10,
              background: active ? 'var(--brand-50)' : 'transparent',
              color: active ? 'var(--brand-600)' : 'var(--fg-default)',
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              {React.cloneElement(it.icon, { size: 17 })}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge != null && (
                <span style={{
                  background: typeof it.badge === 'number' ? 'var(--danger)' : 'var(--accent-purple)',
                  color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
                }}>{it.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: '12px 8px 0', borderTop: '1px solid var(--line-subtle)', flexShrink: 0 }}>
        <SidebarUserMenu name={(me && me.name) || '학생'} sub={(me && [me.school, me.classroom].filter(Boolean).join(' ')) || ''} avatar={((me && me.name) || '학')[0]} onProfile={() => onChange && onChange('profile')}/>
      </div>
    </aside>
  );
}

function StudentWebDashboard({ go }) {
  const isMobile = useViewportMobile();
  const [me, setMe] = React.useState(null);
  const [stats, setStats] = React.useState(null); // null=loading
  const [events, setEvents] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); }
      try { const r = await window.__apiFetch('/dashboard/student', { method: 'GET' }); setStats(r.data || {}); } catch (e) { setStats({}); }
      try {
        const now = new Date();
        const to = new Date(now.getTime() + 30 * 864e5);
        const r = await window.__apiFetch('/calendar/events?from=' + now.toISOString() + '&to=' + to.toISOString(), { method: 'GET' });
        setEvents((r.data || []).slice(0, 5));
      } catch (e) { setEvents([]); }
    })();
  }, []);

  const name = (me && me.name) || '';
  const s = stats || {};
  const gradeAvg = s.gradeAverage != null ? String(s.gradeAverage) : '—';
  const aiProgress = s.aiProgress != null ? s.aiProgress : 0;
  const trend = s.gradeTrend || [];
  const goTo = (id) => go && go(id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: isMobile ? '14px 16px' : '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line-subtle)', background: 'var(--bg-surface)',
      }}>
        <div data-tour="student-greeting">
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.4px' }} className="kr-heading">안녕하세요{name ? ', ' + name + '님' : ''}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>오늘도 진로를 한 걸음 정리해볼까요?</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NotifBell role="student"/>
        </div>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: isMobile ? 16 : 28, background: 'var(--bg-canvas)' }}>
        {/* Hero — AI 상담 진행도 */}
        <Card padding={28} style={{ background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'flex-start' }}>
            <div>
              <Chip tone="info" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginBottom: 10 }}>AI 진로 상담</Chip>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.6px', maxWidth: 560 }} className="kr-heading">
                {aiProgress > 0 ? '상담을 이어가며 진로를 좁혀가요' : '대화 한 번으로 진로 탐색을 시작해요'}
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 10 }}>{aiProgress > 0 ? '진행도 ' + aiProgress + '% · 단서 ' + (s.signalsCount || 0) + '개' : '아직 상담 기록이 없어요'}</div>
            </div>
            <Button variant="primary" size="lg" style={{ background: '#fff', color: 'var(--brand-600)' }} leading={<IcMessage size={16}/>} onClick={() => goTo('ai-counseling')}>
              {aiProgress > 0 ? 'AI 상담 이어가기' : 'AI 상담 시작하기'}
            </Button>
          </div>
        </Card>

        {/* KPI row — 신규 계정은 모두 0/빈값 (실배포 기준) */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="최근 평균" value={gradeAvg} delta={s.hasGrades ? '내 성적' : '미입력'} deltaTone={s.hasGrades ? 'success' : 'neutral'} icon={<IcChart size={16}/>}/>
          <MetricCard label="AI 상담 진행도" value={aiProgress + '%'} delta={'단서 ' + (s.signalsCount || 0) + '개'} deltaTone="info" icon={<IcSparkles size={16}/>}/>
          <MetricCard label="다가오는 일정" value={(s.upcomingCount || 0) + '건'} delta="7일 이내" deltaTone="neutral" icon={<IcCalendar size={16}/>}/>
          <MetricCard label="관심 진로·학과" value={(s.targetCount || 0) + '개'} delta="진로 목표" deltaTone="info" icon={<IcGraduation size={16}/>}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="성적 추이" subtitle="학기별 평균" action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => goTo('grades-trend')}>성적 관리</Button>}>
              {trend.length === 0 ? (
                <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
                  아직 입력된 성적이 없어요. <span style={{ color: 'var(--brand-600)', cursor: 'pointer', fontWeight: 600 }} onClick={() => goTo('grades-trend')}>성적 입력하기 →</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, padding: '8px 4px', height: 140 }}>
                  {trend.map((t, i) => {
                    const h = Math.max(8, Math.round((t.average / 100) * 110));
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.average}</div>
                        <div style={{ width: '70%', height: h, background: 'var(--brand-500)', borderRadius: '6px 6px 0 0' }}/>
                        <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{t.term}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            <SectionCard title="다가오는 일정" action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => goTo('calendar')}>캘린더 전체</Button>}>
              {events === null ? <Skeleton height={48}/> : events.length === 0 ? (
                <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>예정된 일정이 없어요. 봉사·입시 일정을 캘린더에 추가해보세요.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {events.map((e, i) => {
                    const dt = new Date(e.startsAt);
                    const mm = dt.getMonth() + 1, dd = dt.getDate();
                    return (
                      <div key={e.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-muted)', borderRadius: 12 }}>
                        <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                          <div className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{dd}</div>
                          <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{mm}월</div>
                        </div>
                        <div style={{ width: 3, height: 32, background: 'var(--brand-500)', borderRadius: 999 }}/>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{[e.location, dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })].filter(Boolean).join(' · ')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="바로가기" padding={18}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'ai-counseling', label: 'AI 진로 상담', icon: <IcSparkles size={16}/> },
                  { id: 'admissions-hub', label: '대학·입시 찾기', icon: <IcGraduation size={16}/> },
                  { id: 'volunteers', label: '봉사활동 찾기', icon: <IcHeart size={16}/> },
                  { id: 'scholarships', label: '장학금 찾기', icon: <IcCreditCard size={16}/> },
                  { id: 'grades-trend', label: '성적 관리', icon: <IcChart size={16}/> },
                ].map(it => (
                  <button key={it.id} onClick={() => goTo(it.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderRadius: 10, background: 'var(--bg-muted)', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--fg-default)' }}>
                    {it.icon}<span style={{ flex: 1 }}>{it.label}</span><IcChevronRight size={14} color="var(--fg-subtle)"/>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// 소셜(구글/카카오) 신규 가입자 온보딩 — 이름/학년/필수약관을 받아 PATCH /auth/profile.
// app-runtime ingestOAuthHash가 needsProfile일 때 localStorage['jinro:onboard']를 심는다.
const ONBOARD_GRADES = [
  ['E4', '초4'], ['E5', '초5'], ['E6', '초6'],
  ['M1', '중1'], ['M2', '중2'], ['M3', '중3'],
  ['H1', '고1'], ['H2', '고2'], ['H3', '고3'],
];
function OAuthOnboarding() {
  const [flag, setFlag] = React.useState(() => {
    try { const raw = localStorage.getItem('jinro:onboard'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  });
  const [name, setName] = React.useState(() => (flag && flag.name) || '');
  const [grade, setGrade] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [mkt, setMkt] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  if (!flag) return null;

  const submit = async () => {
    setErr('');
    if (!name.trim()) { setErr('이름을 입력해주세요.'); return; }
    if (!grade) { setErr('학년을 선택해주세요.'); return; }
    if (!agree) { setErr('필수 약관에 동의해주세요.'); return; }
    setBusy(true);
    try {
      // __apiFetch는 파싱된 body를 반환하고, 2xx가 아니면 {status, body}로 throw.
      await window.__apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          grade,
          consents: { tos: true, privacy: true, academic: true, ai: true, age: true, mkt },
        }),
      });
      // 온보딩 완료 → 신규 사용자는 첫 AI 상담으로 자동 안내.
      try {
        localStorage.removeItem('jinro:onboard');
        const role = (typeof window !== 'undefined' && window.__ACTIVE_ROLE) || 'student-web';
        localStorage.setItem('jinro:screen:' + role, 'ai-counseling');
        window.location.hash = role + '/ai-counseling';
      } catch (e) {}
      window.location.reload();
    } catch (e) {
      const msg = (e && e.body && (e.body.message || (e.body.error && e.body.error.message))) || '저장에 실패했어요. 잠시 후 다시 시도해주세요.';
      setErr(msg); setBusy(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border-default, #e2e8f0)', fontSize: 15, boxSizing: 'border-box', background: 'var(--bg-surface, #fff)', color: 'var(--text-strong, #0f172a)' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--bg-surface, #fff)', borderRadius: 20, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: 'var(--text-strong, #0f172a)' }}>회원가입 마무리</h2>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-muted, #64748b)' }}>진로나침반을 시작하기 전에 정보를 입력해주세요.</p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--text-strong, #0f172a)' }}>이름</label>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="실명을 입력해주세요" />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, margin: '16px 0 6px', color: 'var(--text-strong, #0f172a)' }}>학년</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {ONBOARD_GRADES.map(([v, label]) => (
            <button key={v} type="button" onClick={() => setGrade(v)}
              style={{ padding: '10px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                border: grade === v ? '2px solid var(--brand, #4f46e5)' : '1px solid var(--border-default, #e2e8f0)',
                background: grade === v ? 'var(--brand-soft, #eef2ff)' : 'var(--bg-surface, #fff)',
                color: grade === v ? 'var(--brand, #4f46e5)' : 'var(--text-strong, #0f172a)' }}>
              {label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, margin: '20px 0 10px', cursor: 'pointer' }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18 }} />
          <span style={{ fontSize: 13, color: 'var(--text-strong, #0f172a)' }}>
            <b>[필수]</b> 이용약관·개인정보 처리방침·학습정보 활용·AI 분석 이용 및 만 14세 이상에 동의합니다.
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18 }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted, #64748b)' }}>[선택] 마케팅 정보 수신에 동의합니다.</span>
        </label>

        {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{err}</div>}

        <button type="button" onClick={submit} disabled={busy}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: busy ? 'default' : 'pointer',
            background: busy ? 'var(--border-default, #cbd5e1)' : 'var(--brand, #4f46e5)', color: '#fff', fontSize: 16, fontWeight: 800 }}>
          {busy ? '저장 중…' : '시작하기'}
        </button>
        {/* 안전망 — "이미 입력했는데 또 나옴" 케이스 대응. flag 제거 + 이메일별 dismissed 마킹(다음 로그인에서도 안 나옴). */}
        <button type="button" onClick={() => {
          try {
            localStorage.removeItem('jinro:onboard');
            if (flag && flag.email) localStorage.setItem('jinro:onboard:dismissed:' + flag.email, '1');
          } catch (e) {}
          setFlag(null);
        }}
          style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--text-muted, #64748b)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          나중에 입력할게요 (마이페이지에서 입력 가능)
        </button>
      </div>
    </div>
  );
}

function StudentWebApp({ initialScreen = 'dashboard', withToasts = false }) {
  const [screen, setScreen] = usePersistentScreen('student-web', initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const cycle = useToastCycle(SAMPLE_TOASTS.student, 4200);
  const tour = useTour(STUDENT_TOUR_STEPS, 'student');
  React.useEffect(() => {
    try { if (window.__LIVE_MODE && localStorage.getItem('jinro:webtour:student')) tour.setPhase('done'); } catch (e) {}
  }, []);
  // 첫 온보딩 — tour가 시작되면 모바일에서 사이드바 자동 오픈(메뉴 항목 가리키는 안내가 빈 곳을 가리키던 문제 해소)
  React.useEffect(() => {
    if (isMobile && (tour.phase === 'welcome' || tour.phase === 'tour')) setNavOpen(true);
  }, [tour.phase, isMobile]);
  React.useEffect(() => { if (tour.phase === 'done') { try { localStorage.setItem('jinro:webtour:student', '1'); } catch (e) {} } }, [tour.phase]);
  // Map screen → sidebar nav id
  const navId = (() => {
    if (screen === 'dashboard') return 'dashboard';
    if (screen === 'ai-counseling') return 'ai-counseling';
    if (screen === 'ai-chat') return 'ai-chat';
    if (screen === 'career-report') return 'career-report';
    if (screen === 'career-targets' || screen === 'goal-setting') return 'career-targets';
    if (screen.startsWith('admissions')) return 'admissions-hub';
    if (screen === 'volunteers') return 'volunteers';
    if (screen === 'scholarships') return 'scholarships';
    if (screen === 'foreign-univ') return 'admissions-hub';
    if (screen.startsWith('grades')) return 'grades-trend';
    if (screen === 'counseling' || screen === 'counseling-request') return 'counseling';
    if (screen === 'study' || screen === 'study-plan') return 'study-plan';
    if (screen === 'focus-timer') return 'focus-timer';
    if (screen === 'messages') return 'messages';
    if (screen === 'calendar') return 'calendar';
    if (screen === 'consents') return 'consents';
    if (screen === 'announcements') return 'announcements';
    if (screen === 'billing') return 'billing';
    if (screen === 'profile') return 'profile';
    if (screen === 'student-info' || screen === 'class-info') return 'profile';
    if (screen.startsWith('settings-')) return 'profile';
    return 'dashboard';
  })();

  // For dashboard show our spacious web-layout view; for other screens, render
  // the mobile-optimized screen centered at max-width 760px inside the web shell.
  const renderContent = () => {
    if (screen === 'dashboard') return <StudentWebDashboard go={setScreen}/>;
    // Wrap mobile screen in centered container
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
          <div style={{ width: '100%', maxWidth: screen === 'ai-counseling' ? 880 : 760, padding: '24px 16px 24px' }}>
            {screen === 'ai-counseling' && <AICounseling go={setScreen} openSignals={() => {}}/>}
            {screen === 'career-report' && <CareerReport go={setScreen}/>}
            {screen === 'grades-trend' && <GradesTrend go={setScreen}/>}
            {screen === 'grades-input' && <GradesInputV2 go={setScreen}/>}
            {screen === 'billing' && <StudentBilling go={setScreen}/>}
            {screen === 'profile' && <StudentProfileV2 go={setScreen}/>}
            {screen === 'student-info' && <StudentInfoScreen go={setScreen}/>}
            {screen === 'class-info' && <ClassInfoScreen go={setScreen}/>}
            {screen === 'settings-password' && <SettingsPassword back={() => setScreen('profile')}/>}
            {screen === 'settings-notifications' && <SettingsNotifications back={() => setScreen('profile')} role="student"/>}
            {screen === 'settings-suggest' && <SettingsSuggestion back={() => setScreen('profile')}/>}
            {screen === 'settings-announcements' && <SettingsAnnouncements back={() => setScreen('profile')}/>}
            {screen === 'settings-terms' && <SettingsTerms back={() => setScreen('profile')}/>}
            {screen === 'study' && <StudentStudy go={setScreen}/>}
            {screen === 'focus-timer' && <FocusTimer go={setScreen}/>}
            {screen === 'counseling' && <StudentCounseling go={setScreen}/>}
            {screen === 'messages' && <StudentMessages go={setScreen}/>}
            {screen === 'calendar' && <StudentCalendar go={setScreen}/>}
            {screen === 'counseling-request' && <CounselingRequest go={setScreen}/>}
            {screen === 'admissions-hub' && <AdmissionsHub go={setScreen}/>}
            {screen === 'volunteers' && <VolunteersScreen go={setScreen}/>}
            {screen === 'scholarships' && <ScholarshipsScreen go={setScreen}/>}
            {screen === 'foreign-univ' && <ForeignUnivScreen go={setScreen}/>}
            {screen === 'admissions-univ' && <UniversityDetail go={setScreen}/>}
            {screen === 'admissions-dept' && <DepartmentDetail go={setScreen}/>}
            {screen === 'admissions-analysis' && <AdmissionsAnalysis go={setScreen}/>}
            {screen === 'consents' && <ConsentManagement go={setScreen} role="student"/>}
            {screen === 'announcements' && <AnnouncementsScreen role="student" variant="web"/>}
            {screen === 'study-plan' && <StudyPlanFull go={setScreen}/>}
            {screen === 'goal-setting' && <GoalSetting go={setScreen}/>}
            {screen === 'career-targets' && <CareerTargets go={setScreen}/>}
            {screen === 'ai-chat' && <AIChatRAG go={setScreen}/>}
          </div>
        </div>
      </div>
    );
  };

  const wrapNav = (s) => { setScreen(s); setNavOpen(false); };
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden' }}>
      {isMobile && <MobileTopBar title="진로나침반" onMenu={() => setNavOpen(true)}/>}
      {isMobile
        ? <SidebarDrawer open={navOpen} onClose={() => setNavOpen(false)}><StudentWebSidebar activeId={navId} onChange={wrapNav}/></SidebarDrawer>
        : <StudentWebSidebar activeId={navId} onChange={setScreen}/>}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflowY: 'auto' }}>
        {renderContent()}
      </main>
      {withToasts && <WebToastHost toasts={cycle.active} onClose={cycle.close}/>}
      <TourOverlay tour={tour}/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// TEACHER — MOBILE layout (compact phone view)
// ────────────────────────────────────────────────────────
const TEACHER_MOBILE_NAV = [
  { id: 'dashboard', label: '홈', icon: <IcHome/> },
  { id: 'students', label: '학생', icon: <IcUsers/> },
  { id: 'messages', label: '메시지', icon: <IcMessage/> },
  { id: 'calendar', label: '캘린더', icon: <IcCalendar/> },
  { id: 'profile', label: '내정보', icon: <IcUser/> },
];

function TeacherMobileDashboard() {
  const [me, setMe] = React.useState(null);
  const [roster, setRoster] = React.useState(null);
  const [requests, setRequests] = React.useState(null);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); } })();
    (async () => { try { const r = await window.__apiFetch('/teacher/students', { method: 'GET' }); setRoster(r.data || []); } catch (e) { setRoster([]); } })();
    (async () => { try { const r = await window.__apiFetch('/counseling-requests', { method: 'GET' }); setRequests(r.data || []); } catch (e) { setRequests([]); } })();
  }, []);
  const u = me || {};
  const list = roster || [];
  const reqs = requests || [];
  const classLine = [u.school, u.classroom].filter(Boolean).join(' ');
  const subline = [classLine, roster === null ? null : (list.length + '명')].filter(Boolean).join(' · ') || '학급 정보 없음';
  const active = list.filter(s => (s.studyDone || 0) > 0).length;
  const focus = list.filter(s => s.needsCounseling);
  return (
    <div style={{ padding: '12px 16px 24px', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me === null ? '안녕하세요' : ('안녕하세요, ' + (u.name || '선생님') + (u.name ? ' 선생님' : ''))}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{subline}</div>
        </div>
        <IconButton icon={<IcBell size={22}/>} ariaLabel="알림"/>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        <MetricCard label="활동 중" value={roster === null ? '…' : (active + '명')} delta="학습 시작" deltaTone="success" icon={<IcZap size={16}/>}/>
        <MetricCard label="상담 요청" value={requests === null ? '…' : (reqs.length + '건')} delta="대기" deltaTone="warning" icon={<IcMessage size={16}/>}/>
      </div>

      {/* Focus students */}
      <SectionCard title="오늘 주목할 학생" subtitle={roster === null ? '불러오는 중' : ('상담 필요 ' + focus.length + '명')} style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roster === null ? (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '8px 4px' }}>불러오는 중…</div>
          ) : focus.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '12px 4px', textAlign: 'center' }} className="kr-heading">상담이 필요한 학생이 없어요.</div>
          ) : focus.map((s, i) => {
            const nm = s.name || '학생';
            const why = [s.studyTotal ? ('학습 ' + (s.studyDone || 0) + '/' + s.studyTotal) : null].filter(Boolean).join(' · ') || '상담 필요';
            return (
              <div key={s.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--line-subtle)', borderRadius: 10 }}>
                <Avatar name={nm[0]} size={36}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{nm}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }} className="kr-heading">{why}</div>
                </div>
                <Chip tone="warning" size="sm">우선</Chip>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Pending requests */}
      <SectionCard title="상담 요청 대기" subtitle={requests === null ? '불러오는 중' : (reqs.length + '건')} style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {requests === null ? (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '8px 4px' }}>불러오는 중…</div>
          ) : reqs.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '12px 4px', textAlign: 'center' }} className="kr-heading">대기 중인 상담 요청이 없어요.</div>
          ) : reqs.map((r, i) => {
            const nm = r.studentName || r.name || '학생';
            const when = r.preferredAt || r.when || r.createdAt || '';
            return (
              <div key={r.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={nm[0]} size={32}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{nm}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{when}</div>
                </div>
                <Button variant="brandSoft" size="sm">처리</Button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Trial */}
      <Card padding={16}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Chip tone="info" size="sm">교사 플랜 · 무료 체험</Chip>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 6 }}>무료 체험 중</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>결제 연동 준비 중 (현재 전 기능 무료)</div>
          </div>
          <IcChevronRight size={20} color="var(--fg-subtle)"/>
        </div>
      </Card>
    </div>
  );
}

function TeacherMobileApp({ withToasts = false }) {
  const [screen, setScreen] = React.useState('dashboard');
  const cycle = useToastCycle(SAMPLE_TOASTS.teacher, 4200);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 54 }} className="toss-scroll">
        <TeacherMobileDashboard/>
      </div>
      <MobileBottomNav items={TEACHER_MOBILE_NAV} activeId={screen} onChange={setScreen}/>
      {withToasts && <MobileToastHost toasts={cycle.active} onClose={cycle.close}/>}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// ADMIN — MOBILE layout (alerts-first ops view)
// ────────────────────────────────────────────────────────
const ADMIN_MOBILE_NAV = [
  { id: 'dashboard', label: '대시보드', icon: <IcHome/> },
  { id: 'alerts', label: '경보', icon: <IcAlert/> },
  { id: 'users', label: '사용자', icon: <IcUsers/> },
  { id: 'system', label: '시스템', icon: <IcServer/> },
  { id: 'audit', label: '감사', icon: <IcDoc/> },
];

function AdminMobileDashboard() {
  return (
    <div style={{ padding: '12px 16px 24px', background: 'var(--bg-canvas)' }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 1 }}>Super Admin</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>운영 대시보드</div>
        </div>
        <Chip tone="success" size="sm" leading={<IcDot size={6}/>}>정상</Chip>
      </div>

      {/* alert banner if any */}
      <Card padding={14} style={{ marginBottom: 12, background: 'var(--danger-bg)', border: '1px solid #F5C2C7', boxShadow: 'none' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--danger)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IcAlert size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>결제 실패율 임계치 초과</div>
            <div style={{ fontSize: 11, color: 'var(--danger)', opacity: 0.85, marginTop: 2 }}>최근 10분 8.4% (임계 5%)</div>
          </div>
          <button style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>처리</button>
        </div>
      </Card>

      {/* KPIs 2x3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        <MetricCard label="총 사용자" value="1,284" delta="+42" deltaTone="success" icon={<IcUsers size={16}/>}/>
        <MetricCard label="활성 구독" value="312" delta="+9" deltaTone="success" icon={<IcStar size={16}/>}/>
        <MetricCard label="MRR (예상)" value="₩3.4M" delta="+₩240K" deltaTone="success" icon={<IcCreditCard size={16}/>}/>
        <MetricCard label="결제 실패" value="6건" delta="처리 필요" deltaTone="warning" icon={<IcAlert size={16}/>}/>
      </div>

      {/* system bullets */}
      <SectionCard title="시스템 한눈에" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'API', value: 'OK', detail: 'p95 124ms', tone: 'success', icon: <IcServer size={12}/> },
            { label: 'DB', value: 'OK', detail: 'conn 18/100', tone: 'success', icon: <IcDb size={12}/> },
            { label: 'SSE', value: '24명 연결', detail: '평균 7s lag', tone: 'success', icon: <IcWifi size={12}/> },
            { label: 'AI Provider', value: '정상', detail: 'Anthropic + OpenAI 듀얼', tone: 'success', icon: <IcSparkles size={12}/> },
            { label: 'Redis', value: '계획됨', detail: '도입 예정', tone: 'neutral', icon: <IcZap size={12}/> },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 6, borderBottom: i < 4 ? '1px solid var(--line-subtle)' : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.label}</div>
                <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{s.detail}</div>
              </div>
              <Chip tone={s.tone} size="sm" leading={<IcDot size={5}/>}>{s.value}</Chip>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recent activity */}
      <SectionCard title="최근 운영 로그">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { t: '환불 처리', target: 'pay_77140', reason: '중복 결제 확인', time: '12분 전' },
            { t: '사용자 비활성화', target: 'u_a1b22c', reason: '콘텐츠 정책 검토 중', time: '1시간 전' },
            { t: '배포 완료', target: 'v0.42.2', reason: 'CI 자동 배포', time: '2시간 전' },
          ].map((a, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{a.t}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>
                <span style={{ fontFamily: 'monospace', background: 'var(--bg-muted)', padding: '1px 4px', borderRadius: 3 }}>{a.target}</span> · {a.time}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function AdminMobileApp({ withToasts = false }) {
  const [screen, setScreen] = React.useState('dashboard');
  const cycle = useToastCycle(SAMPLE_TOASTS.admin, 4500);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 54 }} className="toss-scroll">
        <AdminMobileDashboard/>
      </div>
      <MobileBottomNav items={ADMIN_MOBILE_NAV} activeId={screen} onChange={setScreen}/>
      {withToasts && <MobileToastHost toasts={cycle.active} onClose={cycle.close}/>}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Student WEB with toasts + Teacher desktop with toasts (re-uses TeacherApp)
// We wrap existing TeacherApp with a WebToastHost.
// ────────────────────────────────────────────────────────
function TeacherWebWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.teacher, 4200);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <TeacherApp initialScreen="dashboard"/>
      <WebToastHost toasts={cycle.active} onClose={cycle.close}/>
    </div>
  );
}

function AdminWebWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.admin, 4500);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <AdminApp initialScreen="dashboard"/>
      <WebToastHost toasts={cycle.active} onClose={cycle.close}/>
    </div>
  );
}

function StudentMobileWithToasts() {
  const cycle = useToastCycle(SAMPLE_TOASTS.student, 4200);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <StudentApp initialScreen="dashboard" heroVariant="A"/>
      <MobileToastHost toasts={cycle.active} onClose={cycle.close}/>
    </div>
  );
}

Object.assign(window, {
  StudentWebApp, TeacherMobileApp, AdminMobileApp,
  TeacherWebWithToasts, AdminWebWithToasts, StudentMobileWithToasts,
  useToastCycle, OAuthOnboarding,
});
