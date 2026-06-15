// phase3-screens.jsx — Jinro differentiation API integrations.
// All components here render real data shapes from new backend endpoints.
// Rules enforced:
//  - NEVER show fake "%적합도" probability. Use StrategyStatus instead.
//  - Always render SourceCard with confidence chip.
//  - Render DataUnavailableState (not 0 or "—") when data is missing.
//  - RiskSignal = academic/counseling attention (no mental-health language).

// ────────────────────────────────────────────────────────
// Strategy status — replaces fake adoption %
// ────────────────────────────────────────────────────────
const STRATEGY_STATUSES = {
  exploring:    { label: '탐색 중',        tone: 'info',     desc: '아직 단서가 쌓이고 있어요',         icon: <IcSearch/> },
  forming:      { label: '가설 형성 중',   tone: 'purple',   desc: '대화에서 패턴이 보이기 시작했어요', icon: <IcSparkles/> },
  validating:   { label: '검증 중',        tone: 'warning',  desc: '경험·데이터로 확인이 필요해요',     icon: <IcTarget/> },
  preparing:    { label: '준비 중',        tone: 'brand',    desc: '구체적 준비 단계에 들어왔어요',     icon: <IcCheckCircle/> },
  on_track:     { label: '경로 진행 중',   tone: 'success',  desc: '계획대로 잘 나아가고 있어요',       icon: <IcZap/> },
  needs_review: { label: '재점검 필요',    tone: 'danger',   desc: '데이터가 흔들리고 있어요',          icon: <IcAlert/> },
};

function StrategyStatusBadge({ status }) {
  const s = STRATEGY_STATUSES[status] || STRATEGY_STATUSES.exploring;
  return <Chip tone={s.tone} leading={React.cloneElement(s.icon, { size: 11 })}>{s.label}</Chip>;
}

function StrategyStatusCard({ status, evidenceCount, lastUpdated, onWhy }) {
  const s = STRATEGY_STATUSES[status] || STRATEGY_STATUSES.exploring;
  return (
    <Card padding={18}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `var(--${s.tone === 'neutral' ? 'bg-muted' : s.tone + '-bg'})`,
          color: `var(--${s.tone === 'neutral' ? 'fg-muted' : s.tone})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {React.cloneElement(s.icon, { size: 20 })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.4 }}>전략 상태</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{s.label}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.6, marginBottom: 10 }} className="kr-heading">{s.desc}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>근거 단서</div>
        <span className="num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{evidenceCount}개</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginTop: 8, textAlign: 'right' }}>
        마지막 업데이트 <span className="num">{lastUpdated}</span>
        {onWhy && <> · <button onClick={onWhy} style={{ background: 'transparent', border: 'none', color: 'var(--brand-600)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>왜 이 상태인가요?</button></>}
      </div>
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// SourceCard + DataUnavailableState
// ────────────────────────────────────────────────────────
function SourceCard({ sources = [] }) {
  return (
    <Card padding={16}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <IcDoc size={14} color="var(--fg-muted)"/>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>데이터 출처</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sources.map((s, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
            padding: 10, background: 'var(--bg-muted)', borderRadius: 8,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{s.title}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'monospace' }}>{s.url || s.org}</span>
                {s.updatedAt && <><span>·</span><span className="num">갱신 {s.updatedAt}</span></>}
              </div>
              {s.notes && (
                <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.4 }} className="kr-heading">{s.notes}</div>
              )}
            </div>
            <Chip tone={s.confidence === 'confirmed' ? 'success' : s.confidence === 'estimated' ? 'warning' : 'neutral'} size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10, flexShrink: 0 }}>
              {s.confidence === 'confirmed' ? '확정' : s.confidence === 'estimated' ? '추정' : '준비 중'}
            </Chip>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DataUnavailableState({ what = '이 항목의 데이터', why = '백엔드에서 아직 데이터를 가져오지 못했어요', retryLabel, onRetry }) {
  return (
    <div style={{
      padding: '28px 20px', textAlign: 'center', background: 'var(--bg-muted)',
      borderRadius: 12, border: '1px dashed var(--line-strong)',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-surface)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
        <IcAlert size={20}/>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">DATA_UNAVAILABLE</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55, maxWidth: 280, margin: '0 auto' }} className="kr-heading">
        {what}을 표시할 수 없어요. {why}.<br/>잘못된 추정치 대신 비워두는 게 더 안전해요.
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" leading={<IcRefresh size={12}/>} onClick={onRetry} style={{ marginTop: 12 }}>
          {retryLabel || '다시 시도'}
        </Button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// CareerTimeline — career page
// ────────────────────────────────────────────────────────
const EVENT_ICON = {
  signal: <IcSparkles/>, goal_change: <IcTarget/>, grade: <IcChart/>,
  counseling: <IcMessage/>, hypothesis: <IcCompass/>, signup: <IcStar/>,
};

function CareerTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <SectionCard title="진로 타임라인" subtitle="목표 변경 · 단서 발견 · 성적 변화가 시간 순으로 기록돼요">
        <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">아직 기록된 진로 활동이 없어요.</div>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="진로 타임라인" subtitle="목표 변경 · 단서 발견 · 성적 변화가 시간 순으로 기록돼요">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {events.map((e, i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <div key={e.id} style={{ display: 'flex', gap: 14, position: 'relative' }}>
              <div style={{ position: 'relative', width: 32, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `var(--${e.tone === 'neutral' ? 'bg-muted' : e.tone + '-bg'})`,
                  color: `var(--${e.tone === 'neutral' ? 'fg-muted' : e.tone === 'brand' ? 'brand-600' : e.tone})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, flexShrink: 0,
                }}>
                  {React.cloneElement(EVENT_ICON[e.type] || <IcDot/>, { size: 14 })}
                </div>
                {!isLast && <div style={{ flex: 1, width: 2, background: 'var(--line)', minHeight: 28 }}/>}
              </div>
              <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{e.when.slice(5)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.5 }} className="kr-heading">{e.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ────────────────────────────────────────────────────────
// GoalHistory — career page (목표 변경 사유/기록)
// ────────────────────────────────────────────────────────
function GoalHistory({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <SectionCard title="목표 변경 기록" subtitle="흔들리는 건 자연스러워요. 어떻게·왜 바뀌었는지 보여드려요" style={{ marginTop: 12 }}>
        <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">아직 목표 변경 기록이 없어요.</div>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="목표 변경 기록" subtitle="흔들리는 건 자연스러워요. 어떻게·왜 바뀌었는지 보여드려요" style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} style={{
            padding: 14, borderRadius: 12,
            background: it.current ? 'var(--brand-50)' : 'var(--bg-muted)',
            border: it.current ? '1px solid var(--brand-200)' : '1px solid var(--line-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  {it.current && <Chip tone="brand" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>현재 목표</Chip>}
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{it.career}</span>
                </div>
                {it.univ !== '미정' && <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{it.univ} {it.dept}</div>}
              </div>
              <span className="num" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{it.since}~</span>
            </div>
            <div style={{
              fontSize: 12, color: 'var(--fg-default)', lineHeight: 1.55,
              padding: '8px 10px', background: it.current ? 'rgba(255,255,255,0.7)' : 'var(--bg-surface)',
              borderRadius: 8, borderLeft: `2px solid var(--${it.current ? 'brand-500' : 'fg-subtle'})`,
            }} className="kr-heading">{it.reason}</div>
            {it.changedTo && (
              <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginTop: 6 }}>
                → 이후 <strong style={{ color: 'var(--fg-muted)' }}>{it.changedTo}</strong>(으)로 전환
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ────────────────────────────────────────────────────────
// QuestionCard / QuestionCardsList — 진로 질문 카드
// ────────────────────────────────────────────────────────
const QUESTION_CARDS = [
  { id: 'q1', text: '내가 누군가에게 자랑하고 싶은 일은 어떤 종류인가요?', category: '동기', dueDays: 0, source: 'AI 상담 단서 기반' },
  { id: 'q2', text: '영상 편집할 때, 어떤 순간이 가장 힘들었어요?', category: '강점·약점', dueDays: 1, source: '약점 단서 부족' },
  { id: 'q3', text: '주위에서 본 직업 중, "저거 멋있다" 싶었던 게 있나요?', category: '롤모델', dueDays: 2, source: '관찰 단서 부족' },
];

function QuestionCard({ q, compact, onAnswer, forTeacher }) {
  return (
    <Card padding={compact ? 14 : 18} style={{ background: 'linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)', border: '1px solid rgba(123,97,255,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>}>오늘의 진로 질문</Chip>
          <Chip tone="neutral" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{q.category}</Chip>
        </div>
        <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>
          {q.dueDays === 0 ? '오늘' : `${q.dueDays}일째`}
        </span>
      </div>
      <div style={{ fontSize: compact ? 14 : 16, fontWeight: 700, color: 'var(--fg-strong)', lineHeight: 1.45, marginBottom: 8 }} className="kr-heading">"{q.text}"</div>
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 12 }}>
        <IcInfo size={10} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }}/>
        선정 이유: {q.source}
      </div>
      {forTeacher
        ? <div style={{ fontSize: 11, color: 'var(--accent-purple)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><IcSparkles size={12}/> AI가 학생에게 물어볼 예정인 질문</div>
        : <Button variant="primary" size="sm" full leading={<IcMessage size={14}/>} onClick={onAnswer}>AI 상담으로 답하기</Button>}
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// Teacher-facing AI counseling viewer (read-only transcript +
// counseling guidance) — so teacher knows student's thoughts before counseling
// ────────────────────────────────────────────────────────
// 교사가 학생의 AI 상담 대화를 열람(전용). 활성 세션 → 대화 기록을 실제로 불러와요.
// 전용 학생-지정 엔드포인트가 없어, 활성 세션의 transcript만 표시하고 없으면 빈 상태.
function StudentAICounselingView({ studentName = '학생', embedded = false }) {
  const [transcript, setTranscript] = React.useState(null); // null=loading, []=없음

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' });
        const sid = active && (active.data ? active.data.id : active.id);
        if (!sid) { if (alive) setTranscript([]); return; }
        const tr = await window.__apiFetch('/ai-counseling/sessions/' + sid + '/transcript', { method: 'GET' });
        const rows = (tr && (tr.data || tr)) || [];
        if (alive) setTranscript(Array.isArray(rows) ? rows : []);
      } catch (e) { if (alive) setTranscript([]); }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: 12, background: 'var(--warning-bg)', borderRadius: 10, fontSize: 12, color: 'var(--warning)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
        <IcShield size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
        <span className="kr-heading">학생 동의 범위 내 열람 · 상담 준비용이에요. 모든 열람은 기록됩니다.</span>
      </div>

      {/* Read-only transcript */}
      <SectionCard title="AI 상담 대화 (열람 전용)">
        {transcript === null ? (
          <Skeleton height={60}/>
        ) : transcript.length === 0 ? (
          <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">상담 내역이 없어요.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {transcript.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id || i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 6, alignItems: 'flex-end' }}>
                  {!isUser && <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #7B61FF, #3182F6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>AI</div>}
                  <div style={{
                    maxWidth: '78%', padding: '9px 13px', fontSize: 13, lineHeight: 1.5,
                    background: isUser ? 'var(--brand-500)' : 'var(--bg-muted)',
                    color: isUser ? '#fff' : 'var(--fg-strong)',
                    borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                  }} className="kr-heading">{m.text || m.content}</div>
                  {isUser && <Avatar name={(studentName || '학')[0]} size={24}/>}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function QuestionCardsList({ items = QUESTION_CARDS, onAnswer }) {
  return (
    <SectionCard title="진로 질문 카드" subtitle="대화 단서를 채우기 위한 다음 질문들이에요">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(q => <QuestionCard key={q.id} q={q} compact onAnswer={onAnswer}/>)}
      </div>
    </SectionCard>
  );
}

// ────────────────────────────────────────────────────────
// WeeklyActionsCard — dashboard
// ────────────────────────────────────────────────────────
// Standalone 1-column upcoming-dates card (placed right under the goal hero).
// 실 데이터 — GET /calendar/events 에서 다가오는 일정만 추려 보여줘요.
function UpcomingDatesCard({ go }) {
  const [dates, setDates] = React.useState(null); // null=loading
  const catTone = (c) => ({ exam: 'danger', counseling: 'brand', experience: 'purple', volunteer: 'mint', study: 'brand', admission: 'warning' }[c] || 'brand');

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const now = new Date();
        const to = new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59);
        const r = await window.__apiFetch('/calendar/events?from=' + now.toISOString() + '&to=' + to.toISOString(), { method: 'GET' });
        const rows = (r && (r.data || r)) || [];
        const mapped = (Array.isArray(rows) ? rows : [])
          .filter(e => e.startsAt && new Date(e.startsAt) >= new Date(now.toISOString().slice(0, 10)))
          .map(e => {
            const d = new Date(e.startsAt);
            const date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const time = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            return { date, title: e.title, tone: catTone(e.category), sub: e.location ? e.location + ' · ' + time : time };
          })
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 5);
        if (alive) setDates(mapped);
      } catch (e) { if (alive) setDates([]); }
    })();
    return () => { alive = false; };
  }, []);

  const toneVar = (t, kind) => `var(--${t === 'warning' ? (kind==='bg'?'warning-bg':'warning') : t === 'purple' ? (kind==='bg'?'accent-purple-bg':'accent-purple') : t === 'mint' ? (kind==='bg'?'accent-mint-bg':'accent-mint') : t === 'danger' ? (kind==='bg'?'danger-bg':'danger') : (kind==='bg'?'brand-50':'brand-600')})`;
  return (
    <SectionCard
      title="다가오는 진로 일정"
      subtitle="시험·상담·입시 일정을 한눈에"
      action={go && <button onClick={() => go('calendar')} style={{ border: 'none', background: 'transparent', color: 'var(--brand-600)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>캘린더<IcChevronRight size={13}/></button>}
    >
      {dates === null ? (
        <Skeleton height={48}/>
      ) : dates.length === 0 ? (
        <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">예정된 진로 일정이 없어요.</div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dates.map((d, i) => (
          <div key={i} onClick={() => go && go('calendar')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderRadius: 12, background: toneVar(d.tone, 'bg'), cursor: go ? 'pointer' : 'default',
          }}>
            <div style={{ textAlign: 'center', minWidth: 44, flexShrink: 0 }}>
              <div className="num" style={{ fontSize: 18, fontWeight: 800, color: toneVar(d.tone, 'fg'), lineHeight: 1 }}>{d.date.slice(8, 10)}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>{d.date.slice(5, 7)}월</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.06)' }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', gap: 6 }} className="kr-heading">
                {d.title}
                {d.fromTeacher && <Chip tone="info" size="sm" style={{ height: 16, padding: '0 5px', fontSize: 9 }}>선생님</Chip>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }} className="kr-heading">{d.sub}</div>
            </div>
            <IcChevronRight size={16} color="var(--fg-subtle)"/>
          </div>
        ))}
      </div>
      )}
    </SectionCard>
  );
}

function WeeklyActionsCard({ onToggle, go }) {
  const items = useStudyTasks();
  const done = items.filter(it => it.done).length;
  return (
    <SectionCard
      title="이번 주 진로·학습 액션"
      subtitle="AI가 추천한 이번 주 핵심 행동"
      action={<Chip tone={items.length && done >= items.length * 0.7 ? 'success' : 'info'} size="sm">{done}/{items.length}</Chip>}
    >
      {items.length === 0 ? (
        <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">이번 주 액션이 아직 없어요. 학습 계획에서 할 일을 추가해보세요.</div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => !it.done && go && it.target && go(it.target)} style={{
            display: 'flex', gap: 10, alignItems: 'center',
            padding: '10px 12px', borderRadius: 10,
            background: it.done ? 'var(--bg-muted)' : 'var(--bg-surface)',
            border: '1px solid var(--line-subtle)',
            cursor: !it.done && go && it.target ? 'pointer' : 'default',
          }}>
            <button onClick={(e) => { e.stopPropagation(); setTaskDone(it.id, !it.done); onToggle && onToggle(it.id); }} aria-label="완료 토글" style={{
              width: 20, height: 20, borderRadius: '50%',
              border: it.done ? 'none' : '2px solid var(--line-strong)',
              background: it.done ? 'var(--success)' : 'transparent',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {it.done && <IcCheck size={12}/>}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: it.done ? 'var(--fg-muted)' : 'var(--fg-strong)',
                textDecoration: it.done ? 'line-through' : 'none',
              }} className="kr-heading">{it.title}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginTop: 1 }}>
                {it.source}
              </div>
            </div>
            {!it.done && go && it.target && (
              <button onClick={(e) => { e.stopPropagation(); go(it.target); }} aria-label={it.cta} style={{
                display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
                padding: '5px 9px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: it.focus ? 'var(--brand-50)' : 'var(--neutral-bg)',
                color: it.focus ? 'var(--brand-600)' : 'var(--fg-default)', fontSize: 11, fontWeight: 700,
              }}>
                {it.focus && <IcZap size={12}/>}{it.cta}<IcChevronRight size={11}/>
              </button>
            )}
            {it.done && <Chip tone="success" size="sm" style={{ height: 16, padding: '0 5px', fontSize: 9, flexShrink: 0 }}>완료</Chip>}
          </div>
        ))}
      </div>
      )}
    </SectionCard>
  );
}

// ────────────────────────────────────────────────────────
// CounselingRequestDraft — AI-generated draft
// ────────────────────────────────────────────────────────
function CounselingRequestDraft({ onUse }) {
  const [generating, setGenerating] = React.useState(false);
  const [draft, setDraft] = React.useState(null);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraft({
        title: '진로 방향 점검 + 5월 모의고사 결과 함께 보고 싶어요',
        body: '안녕하세요 선생님,\n\n최근 AI 상담을 진행하면서 미디어 콘텐츠 디자이너로 목표를 정했는데, 5월 모의고사 결과(평균 84.8점)와 비교했을 때 홍익대 DCD 진학에 내신 0.5등급 부족이 보였어요.\n\n선생님과 함께 점검하고 싶은 것:\n1. 현재 내신 흐름이 3-1까지 0.5등급 끌어올리기 현실적인지\n2. 수학 II 미적분 보강이 우선인지, 다른 과목인지\n3. 실기 포트폴리오 준비를 언제부터 시작하는 게 좋을지\n\n시간 되실 때 짧게 상담 부탁드립니다.',
        evidence: [
          'AI 상담 12회 누적, 시각적 표현 단서 6개',
          '5월 모의고사 평균 84.8 (+2.4)',
          '홍익대 DCD 입학자 평균 내신 1.9 (현재 2.4)',
        ],
        confidence: 'estimated',
      });
      setGenerating(false);
    }, 1200);
  };

  if (!draft && !generating) {
    return (
      <Card padding={18} style={{ background: 'linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)', border: '1px solid rgba(123,97,255,0.15)', marginBottom: 12 }}>
        <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>} style={{ marginBottom: 10 }}>AI 초안 도움</Chip>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">
          무슨 말부터 시작할지 막막하다면?
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12, lineHeight: 1.55 }} className="kr-heading">
          최근 상담·성적·관심 학과 데이터를 종합해 상담 요청 초안을 만들어드려요. 그대로 보내도 좋고, 수정해서 보내도 좋아요.
        </div>
        <Button variant="primary" size="md" full leading={<IcSparkles size={14}/>} onClick={generate}>초안 만들기</Button>
      </Card>
    );
  }
  if (generating) {
    return (
      <Card padding={20} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid var(--brand-500)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', flexShrink: 0 }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>초안을 만들고 있어요</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>대화·성적·목표 학과 데이터 종합 중...</div>
        </div>
      </Card>
    );
  }
  return (
    <Card padding={18} style={{ marginBottom: 12, border: '1px solid var(--brand-200)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>}>AI 초안</Chip>
        <button onClick={generate} style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IcRefresh size={11}/>다시 생성
        </button>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8 }} className="kr-heading">{draft.title}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-default)', lineHeight: 1.65, whiteSpace: 'pre-line', padding: 12, background: 'var(--bg-muted)', borderRadius: 10, marginBottom: 10 }} className="kr-heading">
        {draft.body}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>참고 근거</div>
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.6 }} className="kr-heading">
        {draft.evidence.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="secondary" full onClick={generate}>다시</Button>
        <Button variant="primary" full onClick={() => onUse && onUse(draft)}>이대로 사용</Button>
      </div>
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// RiskSignalsCard — teacher dashboard (academic only, no medical)
// ────────────────────────────────────────────────────────
// 실 데이터 — GET /teacher/students 중 상담 필요(needsCounseling) 학생만 추려요.
// items prop을 주면 그대로 쓰고, 없으면 직접 조회. 없으면 빈 상태.
function RiskSignalsCard({ items, onOpenStudent }) {
  const [rows, setRows] = React.useState(items || null); // null=loading
  React.useEffect(() => {
    if (items) { setRows(items); return; }
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/teacher/students', { method: 'GET' });
        const list = (r && (r.data || r)) || [];
        const mapped = (Array.isArray(list) ? list : [])
          .filter(s => s.needsCounseling)
          .map(s => ({
            id: s.id, studentName: s.name, studentAvatar: (s.name || '?').slice(0, 1),
            severity: 'mid', signal: 'needs_counseling',
            title: '상담이 필요해요', detail: '', evidence: [], suggested: '진로·학습 점검 상담',
          }));
        if (alive) setRows(mapped);
      } catch (e) { if (alive) setRows([]); }
    })();
    return () => { alive = false; };
  }, [items]);

  const list = rows || [];
  return (
    <SectionCard
      title="주의 신호"
      subtitle="학업·상담 관점에서 살펴볼 학생들 (정신건강 진단 아님)"
      action={<Chip tone="warning" size="sm">{list.length}건</Chip>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows === null ? (
          <Skeleton height={48}/>
        ) : list.length === 0 ? (
          <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">지금은 주의가 필요한 학생이 없어요.</div>
        ) : list.map(r => (
          <RiskSignalRow key={r.id} signal={r} onOpen={() => onOpenStudent && onOpenStudent(r.studentName)}/>
        ))}
        <div style={{ padding: 10, background: 'var(--info-bg)', borderRadius: 8, fontSize: 11, color: 'var(--brand-600)', lineHeight: 1.5, marginTop: 4 }} className="kr-heading">
          <IcShield size={12} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }}/>
          주의 신호는 <strong>학업·상담 관점</strong>의 참고 정보예요. 정신건강 관련 우려는 전문 상담사·보건교사에게 연결해주세요.
        </div>
      </div>
    </SectionCard>
  );
}

function RiskSignalRow({ signal: r, onOpen }) {
  const sev = { high: 'danger', mid: 'warning', low: 'neutral' }[r.severity];
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ border: '1px solid var(--line-subtle)', borderRadius: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12,
        background: 'var(--bg-surface)', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ position: 'relative' }}>
          <Avatar name={r.studentAvatar} size={36}/>
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: `var(--${sev === 'neutral' ? 'fg-subtle' : sev})`, border: '2px solid var(--bg-surface)' }}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{r.studentName}</span>
            <Chip tone={sev} size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>
              {r.severity === 'high' ? '주의 높음' : r.severity === 'mid' ? '주의 보통' : '관찰 권장'}
            </Chip>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-default)' }} className="kr-heading">{r.title}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">{r.detail}</div>
        </div>
        <IcChevronDown size={16} color="var(--fg-subtle)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms', flexShrink: 0 }}/>
      </button>
      {open && (
        <div style={{ padding: '12px 16px 16px', background: 'var(--bg-muted)', borderTop: '1px solid var(--line-subtle)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>관찰된 근거</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--fg-default)', lineHeight: 1.6, marginBottom: 12 }} className="kr-heading">
            {r.evidence.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
          <div style={{ padding: 10, background: 'var(--bg-surface)', borderRadius: 8, fontSize: 12, color: 'var(--fg-default)', marginBottom: 10 }} className="kr-heading">
            <strong style={{ color: 'var(--brand-600)' }}>제안:</strong> {r.suggested}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button variant="primary" size="sm" full leading={<IcMessage size={12}/>} onClick={onOpen}>학생 페이지로</Button>
            <Button variant="outline" size="sm" full leading={<IcCalendar size={12}/>}>상담 잡기</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// CounselingBrief30s — 30-second brief for teacher
// ────────────────────────────────────────────────────────
function CounselingBrief30s({ studentName = '김지훈' }) {
  return (
    <Card padding={20} style={{ marginBottom: 16, background: 'linear-gradient(135deg, #FFFBE6 0%, #FFFFFF 100%)', border: '1px solid #FBE0A2' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Chip tone="warning" size="sm" leading={<IcZap size={11}/>}>30초 브리프</Chip>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>상담 직전에 빠르게 확인</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        <BriefStat label="전략 상태" value={<StrategyStatusBadge status="forming"/>}/>
        <BriefStat label="최근 성적" value={<span><span className="num" style={{ fontSize: 16, fontWeight: 800 }}>84.8</span> <Chip tone="success" size="sm" style={{ height: 16, padding: '0 5px', fontSize: 9 }}>+2.4</Chip></span>}/>
        <BriefStat label="이번 주 학습" value={<span className="num" style={{ fontSize: 16, fontWeight: 800 }}>5<span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>/8</span></span>}/>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>요약</div>
      <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.6, padding: 12, background: 'var(--bg-surface)', borderRadius: 10 }} className="kr-heading">
        AI 상담 12회 기반, 영상 편집·시각적 표현 단서가 반복 관찰돼요. 미디어 콘텐츠 디자이너로 목표를 명확히 했지만 <strong>내신 0.5등급 격차</strong>가 발생했어요. 수학 II 미적분 학습 진도가 흔들리는 게 확인됩니다.
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', margin: '14px 0 6px' }}>이번 상담에서 다루면 좋을 것</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--fg-default)', lineHeight: 1.7 }} className="kr-heading">
        <li>3-1까지 내신 0.5등급 회복 시뮬레이션</li>
        <li>수학 학습법 점검 (개념 vs 문제풀이 비중)</li>
        <li>실기 포트폴리오 시작 시점</li>
      </ul>
    </Card>
  );
}

function BriefStat({ label, value }) {
  return (
    <div style={{ padding: 10, background: 'var(--bg-surface)', borderRadius: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{value}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SuggestedTeacherQuestions — for teacher counseling page
// ────────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  { id: 'sq1', text: '영상 작업이 끝나고 어떤 기분이 들었어?', goal: '동기 구조 확인', tone: 'purple' },
  { id: 'sq2', text: '수학 단원 중 의외로 재밌었던 게 있었어?', goal: '약점 영역의 긍정 단서 발굴', tone: 'brand' },
  { id: 'sq3', text: '3년 뒤 가장 큰 두려움은 뭐야?', goal: '내적 동기 점검', tone: 'warning' },
  { id: 'sq4', text: '주변에서 너랑 비슷한 길 간 사람 있어?', goal: '롤모델 유무', tone: 'info' },
  { id: 'sq5', text: '실기 포트폴리오 만들어본 적 있어? 어떻게 시작했어?', goal: '실행 단계 점검', tone: 'success' },
];

function SuggestedTeacherQuestions({ studentName = '김지훈', items = SUGGESTED_QUESTIONS }) {
  return (
    <SectionCard
      title={`${studentName}님 상담에서 던지면 좋을 질문`}
      subtitle="학생의 AI 상담 단서·진로 흐름 기반"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(q => (
          <div key={q.id} style={{
            padding: 14, borderRadius: 10,
            background: 'var(--bg-muted)',
            borderLeft: `3px solid var(--${q.tone === 'neutral' ? 'fg-subtle' : q.tone})`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">"{q.text}"</div>
            <div style={{ fontSize: 10, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <IcTarget size={10}/>이 질문의 목적: <span style={{ color: 'var(--fg-default)', fontWeight: 600 }}>{q.goal}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

Object.assign(window, {
  STRATEGY_STATUSES, StrategyStatusBadge, StrategyStatusCard,
  SourceCard, DataUnavailableState,
  CareerTimeline,
  GoalHistory,
  QUESTION_CARDS, QuestionCard, QuestionCardsList,
  WeeklyActionsCard, UpcomingDatesCard,
  CounselingRequestDraft,
  RiskSignalsCard, RiskSignalRow,
  CounselingBrief30s, BriefStat,
  StudentAICounselingView,
  SUGGESTED_QUESTIONS, SuggestedTeacherQuestions,
});
