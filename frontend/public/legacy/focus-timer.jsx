// focus-timer.jsx — Time-attack 자습 timer (student) + self-study live state (teacher)

const FOCUS_PRESETS = [
  { id: 'short',  label: '25분', minutes: 25 },
  { id: 'mid',    label: '50분', minutes: 50 },
  { id: 'long',   label: '90분', minutes: 90 },
  { id: 'custom', label: '직접', minutes: 0 },
];

const FOCUS_SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '한국사', '기타'];

// Self-study session store — module-scoped singleton (no window pollution).
// In real code this becomes a small Zustand/Context store synced to the
// backend self-study endpoint so teachers see live status.
const focusSessionStore = {
  active: false,
  subject: null,
  startedAt: null,
  endsAt: null,
  totalSeconds: 0,
  elapsedSeconds: 0,
  pomodoros: 0,        // 이번 세션 동안 완료한 자습 횟수 (로컬 상태 — 집계 엔드포인트 없음)
  todaySeconds: 0,     // 이번 세션 동안 누적된 자습 시간(초). 서버 집계 없음 → 로컬만.
};

// ────────────────────────────────────────────────────────
// STUDENT: Focus Timer screen (Time-attack)
// ────────────────────────────────────────────────────────
function FocusTimer({ go }) {
  const [phase, setPhase] = React.useState(focusSessionStore.active ? 'running' : 'setup');
  const [preset, setPreset] = React.useState('mid');
  const [customMin, setCustomMin] = React.useState('30');
  const [subject, setSubject] = React.useState(focusSessionStore.subject || '수학');
  const [task, setTask] = React.useState('');
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const [, forceTick] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(focusSessionStore.elapsedSeconds || 0);
  const [total, setTotal] = React.useState(focusSessionStore.totalSeconds || 50 * 60);

  // Shared weekly study tasks (single source of truth, focus-type only).
  const weekly = useStudyTasks().filter(t => t.focus);
  const doneCount = weekly.filter(t => t.done).length;
  // 오늘 누적 자습 — 집계 엔드포인트가 없어 이번 세션 로컬 값만 사용(앱 새로고침 시 0).
  const todayMin = Math.floor((focusSessionStore.todaySeconds || 0) / 60);
  const sessionDone = focusSessionStore.pomodoros || 0;
  const pickTask = (t) => {
    if (t.done) return;
    setSelectedTaskId(t.id);
    setSubject(t.subject);
    setTask(t.title);
  };

  React.useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        focusSessionStore.elapsedSeconds = next;
        if (next >= total) {
          setPhase('done');
          focusSessionStore.active = false;
          return total;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, total]);

  const start = () => {
    const m = preset === 'custom' ? Math.max(5, Math.min(240, parseInt(customMin, 10) || 30)) : FOCUS_PRESETS.find(p => p.id === preset).minutes;
    const totalSec = m * 60;
    Object.assign(focusSessionStore, {
      active: true, subject, task,
      startedAt: Date.now(), endsAt: Date.now() + totalSec * 1000,
      totalSeconds: totalSec, elapsedSeconds: 0,
      pomodoros: (focusSessionStore.pomodoros || 0),
    });
    setTotal(totalSec);
    setElapsed(0);
    setPhase('running');
  };
  const stop = () => {
    focusSessionStore.active = false;
    setPhase('setup');
  };
  const finish = () => {
    focusSessionStore.pomodoros = (focusSessionStore.pomodoros || 0) + 1;
    focusSessionStore.todaySeconds = (focusSessionStore.todaySeconds || 0) + elapsed;
    focusSessionStore.active = false;
    // mark the linked study task as completed (syncs to actions + calendar)
    if (selectedTaskId) {
      setTaskDone(selectedTaskId, true);
      forceTick(n => n + 1);
    }
    setPhase('done');
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const remaining = total - elapsed;
  const pct = (elapsed / total) * 100;

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="자습 타임어택" subtitle="앱을 나가면 자동 종료돼요" leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        {phase === 'setup' && (
          <>
            <Card padding={20} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <IcZap size={16} color="var(--brand-600)"/>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-600)' }}>오늘 누적 자습</span>
              </div>
              <div className="num" style={{ fontSize: 32, fontWeight: 800, color: 'var(--fg-strong)' }}>
                {Math.floor(todayMin / 60)}<span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 500 }}>시간 </span>{todayMin % 60}<span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 500 }}>분</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>{sessionDone > 0 ? `완료 ${sessionDone}회` : '아직 완료한 자습이 없어요'}</div>
            </Card>

            <SectionCard title="과목 선택" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {FOCUS_SUBJECTS.map(s => (
                  <button key={s} onClick={() => setSubject(s)} style={{
                    padding: '8px 14px', border: '1px solid',
                    borderColor: subject === s ? 'var(--brand-500)' : 'var(--line-strong)',
                    background: subject === s ? 'var(--brand-50)' : 'var(--bg-surface)',
                    color: subject === s ? 'var(--brand-600)' : 'var(--fg-default)',
                    borderRadius: 999, fontSize: 13, fontWeight: subject === s ? 700 : 500, cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="시간 설정" style={{ marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: preset === 'custom' ? 12 : 0 }}>
                {FOCUS_PRESETS.map(p => (
                  <button key={p.id} onClick={() => setPreset(p.id)} style={{
                    padding: '14px 4px', border: '1px solid',
                    borderColor: preset === p.id ? 'var(--brand-500)' : 'var(--line-strong)',
                    background: preset === p.id ? 'var(--brand-50)' : 'var(--bg-surface)',
                    color: preset === p.id ? 'var(--brand-600)' : 'var(--fg-default)',
                    borderRadius: 10, fontSize: 13, fontWeight: preset === p.id ? 700 : 500, cursor: 'pointer',
                  }}>{p.label}</button>
                ))}
              </div>
              {preset === 'custom' && (
                <TextInput value={customMin} onChange={setCustomMin} placeholder="분 단위 입력" trailing={<span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>분</span>}/>
              )}
            </SectionCard>

            <SectionCard title="이번 주 진도에서 선택" subtitle={`완료 ${doneCount}/${weekly.length} · 선택하면 자습 완료 시 자동 체크돼요`} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {weekly.map(t => {
                  const active = selectedTaskId === t.id;
                  return (
                    <button key={t.id} onClick={() => pickTask(t)} disabled={t.done} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                      padding: '12px 14px', borderRadius: 12, cursor: t.done ? 'default' : 'pointer',
                      border: '1px solid', borderColor: active ? 'var(--brand-500)' : 'var(--line-subtle)',
                      background: t.done ? 'var(--success-bg)' : active ? 'var(--brand-50)' : 'var(--bg-surface)',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        border: t.done ? 'none' : active ? '2px solid var(--brand-500)' : '2px solid var(--line-strong)',
                        background: t.done ? 'var(--success)' : 'transparent',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{t.done ? <IcCheck size={13}/> : active ? <IcDot size={8} color="var(--brand-500)"/> : null}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? 'var(--success)' : 'var(--fg-strong)', textDecoration: t.done ? 'line-through' : 'none' }} className="kr-heading">{t.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>{t.subject}{t.done ? ' · 완료됨' : active ? ' · 선택됨' : ''}</div>
                      </div>
                      {!t.done && <Chip tone="neutral" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{t.subject}</Chip>}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="직접 입력 (선택)" style={{ marginBottom: 12 }}>
              <TextInput value={task} onChange={(v) => { setTask(v); setSelectedTaskId(null); }} placeholder="예) 수학 II 5단원 문제풀이 30개"/>
            </SectionCard>

            <div style={{ padding: 14, background: 'var(--warning-bg)', borderRadius: 10, fontSize: 12, color: 'var(--warning)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
              <IcAlert size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }}/>
              <strong>주의:</strong> 앱을 끄거나 다른 화면으로 이동하면 자동으로 자습이 종료됩니다. 누적 시간은 종료 시점까지만 기록돼요.
            </div>

            <Button variant="primary" size="lg" full leading={<IcZap size={18}/>} onClick={start}>자습 시작하기</Button>
          </>
        )}

        {phase === 'running' && (
          <>
            <Card padding={28} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)', color: '#fff', textAlign: 'center' }}>
              <Chip tone="info" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginBottom: 12 }}>{subject} 자습 중</Chip>
              <FocusRing pct={pct} timeText={fmt(remaining)}/>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 14 }}>
                <span className="num">{fmt(elapsed)}</span> 경과 · 총 <span className="num">{Math.floor(total / 60)}</span>분
              </div>
              {task && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 12 }} className="kr-heading">
                  <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 4 }}>이번 자습 목표</div>
                  {task}
                </div>
              )}
            </Card>

            <Card padding={14} style={{ marginBottom: 12, background: 'var(--warning-bg)', boxShadow: 'none' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <IcAlert size={14} color="var(--warning)" style={{ marginTop: 1, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: 'var(--warning)', lineHeight: 1.5 }} className="kr-heading">
                  앱을 끄거나 잠금화면으로 가면 자습이 종료돼요. 선생님께도 종료 시점까지만 기록돼요.
                </span>
              </div>
            </Card>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={stop}>중도 종료</Button>
              <Button variant="primary" full leading={<IcCheckCircle size={14}/>} onClick={finish}>완료로 기록</Button>
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <Card padding={28} style={{ marginBottom: 12, background: 'var(--success-bg)', textAlign: 'center', border: '1px solid #C8E5D2' }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <IcCheckCircle size={32}/>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)', marginBottom: 6 }} className="kr-heading">자습 완료!</div>
              <div style={{ fontSize: 13, color: 'var(--success)' }}>{subject} <span className="num">{Math.floor(elapsed / 60)}</span>분 · 오늘 누적 <span className="num">{Math.floor((focusSessionStore.todaySeconds || 0) / 60)}</span>분</div>
            </Card>
            <SectionCard title="이번 자습 기록" style={{ marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>과목</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 4 }}>{subject}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>실제 시간</div>
                  <div className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 4 }}>{Math.floor(elapsed / 60)}분</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>오늘 완료</div>
                  <div className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)', marginTop: 4 }}>{focusSessionStore.pomodoros || 0}회</div>
                </div>
              </div>
            </SectionCard>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={() => { setPhase('setup'); setElapsed(0); }}>한 번 더</Button>
              <Button variant="primary" full onClick={() => go('dashboard')}>대시보드로</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FocusRing({ pct, timeText }) {
  const r = 90, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10"/>
        <circle cx="110" cy="110" r={r} fill="none" stroke="#fff" strokeWidth="10"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round" transform="rotate(-90 110 110)"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="num" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1px' }}>{timeText}</div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>남은 시간</div>
      </div>
    </div>
  );
}

Object.assign(window, { FocusTimer, FOCUS_PRESETS, FOCUS_SUBJECTS });
