// phase2-screens.jsx — 7 backend-aligned screens (Phase 2)
// 1. ConsentManagement  /v1/consents
// 2. StudyPlanFull      /v1/study-plans/current/tasks
// 3. GoalSetting        /v1/goals/current
// 4. TeacherAIView      /v1/career-counseling/teacher/*
// 5. CareerTargets      /v1/career/targets, /v1/career/analysis
// 6. CompletionStatus   /v1/completion-status
// 7. AIChatRAG          /v1/ai/chat, /v1/rag/query

// ────────────────────────────────────────────────────────
// 1. CONSENT MANAGEMENT (student/teacher profile sub-screen)
// ────────────────────────────────────────────────────────
const CONSENT_DEFS = {
  student: [
    { id: 'tos', label: '서비스 이용약관', desc: '서비스 사용 전반에 적용되는 기본 약관', required: true, version: 'v1.2', linkPath: '/terms' },
    { id: 'privacy', label: '개인정보 수집·이용', desc: '이메일, 이름, 학교 등 식별 정보 처리', required: true, version: 'v1.4', linkPath: '/privacy' },
    { id: 'academic', label: '학업·성적 데이터 처리', desc: '모의고사·내신·수행평가 점수 분석 목적', required: true, version: 'v1.0' },
    { id: 'ai', label: 'AI 진로상담 대화 데이터 처리', desc: '대화 내용을 LLM에 전달 (개인정보 마스킹)', required: true, version: 'v1.1' },
    { id: 'age', label: '만 14세 이상 · 법정대리인 동의', desc: '미성년자 보호 필수 사항', required: true, version: 'v1.0' },
    { id: 'mkt', label: '마케팅 정보 수신', desc: '신기능·이벤트·할인 안내 (이메일/푸시)', required: false, version: 'v1.0' },
    { id: 'analytics', label: '서비스 개선 분석', desc: '익명화된 사용 패턴 분석 (Google Analytics 등)', required: false, version: 'v1.0' },
  ],
  teacher: [
    { id: 'tos', label: '서비스 이용약관', desc: '교사 전용 약관 포함', required: true, version: 'v1.2', linkPath: '/terms' },
    { id: 'privacy', label: '개인정보 수집·이용', desc: '이메일, 이름, 소속학교', required: true, version: 'v1.4', linkPath: '/privacy' },
    { id: 'class', label: '학급·학생 정보 처리', desc: '학생의 성적·상담 데이터 열람 및 관리', required: true, version: 'v1.0' },
    { id: 'billing', label: '결제·구독 안내 수신', desc: '결제 영수증, 갱신/실패 통지', required: true, version: 'v1.0' },
    { id: 'mkt', label: '마케팅 정보 수신', desc: '교사 대상 신기능/세미나 안내', required: false, version: 'v1.0' },
  ],
};

function ConsentManagement({ go, role = 'student' }) {
  const defs = CONSENT_DEFS[role];
  const [state, setState] = React.useState(() => {
    const s = {};
    defs.forEach(d => { s[d.id] = d.required || d.id !== 'mkt'; });
    return s;
  });
  // 변경 이력 — 전용 엔드포인트가 없어 비워둔 채 시작. 이번 세션의 변경만 누적해 보여줘요.
  const [history, setHistory] = React.useState([]);

  const toggle = (id, def) => {
    if (def.required) return; // cannot revoke required
    const next = !state[id];
    setState(s => ({ ...s, [id]: next }));
    setHistory(h => [{
      id: `h${Date.now()}`,
      when: new Date().toISOString().slice(0, 16).replace('T', ' '),
      who: '본인',
      what: `${def.label} ${next ? '동의' : '동의 해제'}`,
      items: [id],
      action: next ? 'grant' : 'revoke',
    }, ...h]);
  };

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="동의 항목 관리" subtitle="개인정보·서비스 동의 내역을 관리하세요" leading={<BackButton onClick={() => go('profile')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ padding: 14, background: 'var(--info-bg)', borderRadius: 12, fontSize: 12, color: 'var(--brand-600)', lineHeight: 1.55, marginBottom: 14, display: 'flex', gap: 10 }}>
          <IcInfo size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
          <span className="kr-heading">
            <strong>필수 항목</strong>은 서비스 이용을 위해 해제할 수 없어요. 해제하려면 회원 탈퇴를 진행해주세요.
          </span>
        </div>

        <SectionCard title="현재 동의 상태" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {defs.map((d, i) => {
              const on = state[d.id];
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 4px', borderTop: i === 0 ? 'none' : '1px solid var(--line-subtle)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Chip tone={d.required ? 'danger' : 'neutral'} size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{d.required ? '필수' : '선택'}</Chip>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{d.label}</span>
                      <span style={{ fontSize: 10, color: 'var(--fg-subtle)', fontFamily: 'monospace' }}>{d.version}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }} className="kr-heading">{d.desc}</div>
                    {d.linkPath && (
                      <a style={{ fontSize: 11, color: 'var(--brand-600)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', marginTop: 4, display: 'inline-block' }}>전문 보기</a>
                    )}
                  </div>
                  <ToggleSwitch checked={on} onChange={() => toggle(d.id, d)} disabled={d.required}/>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="변경 이력" subtitle="모든 동의 변경은 영구 기록돼요" style={{ marginBottom: 12 }}>
          {history.length === 0 ? (
            <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">변경 이력이 없어요.</div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {history.map((h, i, arr) => (
              <div key={h.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.action === 'revoke' ? 'var(--warning)' : 'var(--success)', marginTop: 6, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{h.what}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{h.who} · <span className="num">{h.when}</span></div>
                </div>
              </div>
            ))}
          </div>
          )}
        </SectionCard>

        <Card padding={16} style={{ background: 'var(--bg-muted)' }}>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
            동의 내역은 백엔드 <span style={{ fontFamily: 'monospace', background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 4 }}>POST /v1/consents</span>로 기록되며, 회원 탈퇴 시까지 보관됩니다.
          </div>
        </Card>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      style={{
        width: 44, height: 26, borderRadius: 999, border: 'none',
        background: disabled ? 'var(--line-strong)' : (checked ? 'var(--brand-500)' : 'var(--line-strong)'),
        position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 180ms var(--ease-toss)',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 180ms var(--ease-toss)',
      }}/>
    </button>
  );
}

// ────────────────────────────────────────────────────────
// 2. STUDY PLAN — full screen
// ────────────────────────────────────────────────────────
const DAYS_KR = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };

// ISO 주 키 — "2026-W24"
function isoWeekKey(d) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((dt - yearStart) / 86400000) + 1) / 7);
  return dt.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

// 실 API — /v1/study-tasks. 이번 주 체크리스트 + 추가/토글/삭제.
function StudyPlanFull({ go }) {
  const weekKey = isoWeekKey(new Date());
  const [tasks, setTasks] = React.useState(null); // null=loading
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '한국사', '기타'];

  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/study-tasks?weekKey=' + weekKey, { method: 'GET' }); setTasks(r.data || []); }
    catch (e) { setTasks([]); }
  }, [weekKey]);
  React.useEffect(() => { load(); }, [load]);

  const total = (tasks || []).length;
  const done = (tasks || []).filter(t => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = async (t) => {
    setTasks(ts => ts.map(x => x.id === t.id ? { ...x, done: !x.done } : x));
    try { await window.__apiFetch('/study-tasks/' + t.id, { method: 'PATCH', body: JSON.stringify({ done: !t.done }) }); } catch (e) { load(); }
  };
  const del = async (id) => { try { await window.__apiFetch('/study-tasks/' + id, { method: 'DELETE' }); load(); } catch (e) {} };
  const add = async () => {
    if (!title.trim()) return;
    const body = { title: title.trim(), weekKey, ...(subject ? { subject } : {}) };
    setTitle('');
    try { await window.__apiFetch('/study-tasks', { method: 'POST', body: JSON.stringify(body) }); load(); }
    catch (e) { alert('추가에 실패했어요.'); }
  };
  const subjectColor = (s) => ({ '국어': '#FFE2D6', '수학': '#D6E6FF', '영어': '#E6F5E0', '사회': '#EDD9FF', '과학': '#FFE9D6', '한국사': '#D9F2EC' }[s] || 'var(--bg-muted)');

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="학습 계획" subtitle={'이번 주(' + weekKey + ') 진도를 한눈에'}/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>이번 주 학습 완료</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span className="num" style={{ fontSize: 32, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1px' }}>{done}</span>
                <span style={{ fontSize: 16, color: 'var(--fg-muted)' }} className="num">/ {total}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="num" style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-600)' }}>{pct}%</div>
            </div>
          </div>
          <ProgressBar value={done} max={total || 1} height={8}/>
        </Card>

        {/* 추가 입력 */}
        <Card padding={12} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <TextInput value={title} onChange={setTitle} placeholder="할 일 추가 (예: 수학 II 5단원 문제풀이)" style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter') add(); }}/>
            <Button variant="primary" size="md" onClick={add}>추가</Button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(subject === s ? '' : s)} style={{ border: 'none', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: subject === s ? 'var(--brand-500)' : 'var(--bg-muted)', color: subject === s ? '#fff' : 'var(--fg-muted)' }}>{s}</button>
            ))}
          </div>
        </Card>

        {tasks === null ? <Card padding={14}><Skeleton height={40}/></Card>
          : tasks.length === 0 ? (
            <EmptyState icon={<IcBook size={22}/>} title="이번 주 학습 계획이 비어 있어요" body="위에서 할 일을 추가해보세요. 완료하면 체크해서 진행률을 관리할 수 있어요."/>
          ) : (
          <SectionCard title="이번 주 할 일">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: t.done ? 'var(--bg-muted)' : 'var(--bg-surface)', border: '1px solid var(--line-subtle)' }}>
                  <button onClick={() => toggle(t)} style={{ width: 22, height: 22, borderRadius: '50%', border: t.done ? 'none' : '2px solid var(--line-strong)', background: t.done ? 'var(--success)' : 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {t.done && <IcCheck size={14}/>}
                  </button>
                  {t.subject && <div style={{ width: 26, height: 26, borderRadius: 7, background: subjectColor(t.subject), fontSize: 11, fontWeight: 700, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{t.subject.slice(0,1)}</div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? 'var(--fg-muted)' : 'var(--fg-strong)', textDecoration: t.done ? 'line-through' : 'none' }} className="kr-heading">{t.title}</div>
                  </div>
                  <IconButton icon={<IcTrash size={15}/>} ariaLabel="삭제" onClick={() => del(t.id)}/>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

function AddTaskSheet({ onClose }) {
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('수학');
  const [day, setDay] = React.useState('mon');
  const [est, setEst] = React.useState('60');
  return (
    <BottomSheet open onClose={onClose} title="과제 추가" maxHeight="80%">
      <div style={{ padding: '0 20px' }}>
        <FormField label="과제 제목" required style={{ marginBottom: 14 }}>
          <TextInput value={title} onChange={setTitle} placeholder="예) 수학 II 5단원 문제풀이"/>
        </FormField>
        <FormField label="과목" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6, overflow: 'auto' }} className="toss-scroll">
            {['국어', '수학', '영어', '사회', '과학', '한국사'].map(s => (
              <button key={s} onClick={() => setSubject(s)} style={{
                padding: '8px 14px', border: '1px solid',
                borderColor: subject === s ? 'var(--brand-500)' : 'var(--line-strong)',
                background: subject === s ? 'var(--brand-50)' : 'var(--bg-surface)',
                color: subject === s ? 'var(--brand-600)' : 'var(--fg-default)',
                borderRadius: 999, fontSize: 13, fontWeight: subject === s ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>{s}</button>
            ))}
          </div>
        </FormField>
        <FormField label="요일" style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {Object.entries(DAYS_KR).map(([d, label]) => (
              <button key={d} onClick={() => setDay(d)} style={{
                padding: '10px 4px', border: '1px solid',
                borderColor: day === d ? 'var(--brand-500)' : 'var(--line-strong)',
                background: day === d ? 'var(--brand-50)' : 'var(--bg-surface)',
                color: day === d ? 'var(--brand-600)' : 'var(--fg-default)',
                borderRadius: 8, fontSize: 13, fontWeight: day === d ? 700 : 500, cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>
        </FormField>
        <FormField label="예상 소요 시간 (분)" style={{ marginBottom: 20 }}>
          <TextInput value={est} onChange={setEst} placeholder="60" trailing={<span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>분</span>}/>
        </FormField>
        <Button variant="primary" size="lg" full disabled={!title.trim()} onClick={onClose}>추가하기</Button>
      </div>
    </BottomSheet>
  );
}

// ────────────────────────────────────────────────────────
// 3. GOAL SETTING
// ────────────────────────────────────────────────────────
// 직업 예시 선택지(고정 UI). 학생의 실제 저장 목표가 아니라 입력을 돕는 예시예요.
const GOAL_PRESETS = [
  { career: '미디어 콘텐츠 디자이너', univ: '홍익대학교', dept: '디지털콘텐츠디자인학과', track: '예체능' },
  { career: '소프트웨어 개발자', univ: '서울대학교', dept: '컴퓨터공학부', track: '자연' },
  { career: '의사', univ: '연세대학교', dept: '의예과', track: '자연' },
  { career: '교사', univ: '서울교육대학교', dept: '초등교육과', track: '인문' },
];

function GoalSetting({ go }) {
  const [career, setCareer] = React.useState('');
  const [univ, setUniv] = React.useState('');
  const [dept, setDept] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [step, setStep] = React.useState(1);

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="목표 설정" subtitle={`${step}/3 단계`} leading={<BackButton onClick={() => step > 1 ? setStep(s => s-1) : go('profile')}/>}/>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--brand-500)' : 'var(--line-strong)' }}/>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        {step === 1 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">희망 직업을 정해볼까요?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }} className="kr-heading">아래 예시에서 골라도 되고, 마음에 드는 게 없으면 직접 입력해도 돼요.</div>
            <SectionCard title="직업 예시" subtitle="입력을 돕는 예시예요" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {GOAL_PRESETS.map(p => {
                  const active = career === p.career;
                  return (
                    <button key={p.career} onClick={() => { setCareer(p.career); setUniv(p.univ); setDept(p.dept); }} style={{
                      textAlign: 'left', padding: '12px 14px', border: '1px solid',
                      borderColor: active ? 'var(--brand-500)' : 'var(--line-subtle)',
                      background: active ? 'var(--brand-50)' : 'var(--bg-surface)',
                      borderRadius: 12, cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: active ? 'var(--brand-600)' : 'var(--fg-strong)' }}>{p.career}</span>
                        <Chip tone="purple" size="sm">{p.track}</Chip>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{p.univ} {p.dept}</div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
            <FormField label="또는 직접 입력" style={{ marginBottom: 20 }}>
              <TextInput value={career} onChange={setCareer} placeholder="원하는 직업을 입력하세요"/>
            </FormField>
            <Button variant="primary" size="lg" full disabled={!career.trim()} onClick={() => setStep(2)} trailing={<IcArrowRight size={16}/>}>다음</Button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">목표 대학·학과는 어디인가요?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }} className="kr-heading">{career}와(과) 가까운 학과를 추천드려요.</div>
            <FormField label="대학" required style={{ marginBottom: 14 }}>
              <TextInput value={univ} onChange={setUniv} placeholder="예) 홍익대학교" leading={<IcSchool size={16}/>}/>
            </FormField>
            <FormField label="학과" required style={{ marginBottom: 20 }}>
              <TextInput value={dept} onChange={setDept} placeholder="예) 디지털콘텐츠디자인학과" leading={<IcGraduation size={16}/>}/>
            </FormField>
            <Button variant="brandSoft" size="md" full leading={<IcSearch size={14}/>} style={{ marginBottom: 16 }}>대학·학과 검색</Button>
            <Button variant="primary" size="lg" full disabled={!univ.trim() || !dept.trim()} onClick={() => setStep(3)} trailing={<IcArrowRight size={16}/>}>다음</Button>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">왜 이 목표를 정했나요?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 16 }} className="kr-heading">선택. 본인만 볼 수 있어요. 나중에 흔들릴 때 다시 읽으면 도움이 돼요.</div>
            <SectionCard style={{ marginBottom: 16 }}>
              <Textarea value={reason} onChange={setReason} rows={5} placeholder="예) 영상 편집할 때 가장 몰입했고, 친구들이 본 반응이 재밌었다. 이 흐름을 더 키워가고 싶다."/>
            </SectionCard>
            <Card padding={16} style={{ marginBottom: 16, background: 'linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', marginBottom: 6 }}>저장 후 자동으로 진행돼요</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--fg-default)', lineHeight: 1.7 }} className="kr-heading">
                <li>해당 학과 입시 정보 추적</li>
                <li>AI가 격차 분석 리포트 생성</li>
                <li>다음 학습 계획에 우선순위 반영</li>
              </ul>
            </Card>
            <Button variant="primary" size="lg" full onClick={() => go('profile')}>목표 저장하기</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 4. TEACHER AI VIEW (read-only student transcript + report)
// ────────────────────────────────────────────────────────
function TeacherAIView() {
  const [tab, setTab] = React.useState('summary');
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
  const name = student.name || '학생';
  const signals = detail?.signals || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar
        title={!id ? 'AI 진로 상담' : `${loading ? '학생' : name} 학생 · AI 진로 상담`}
        subtitle="학생 동의 하에 열람 중 · 모든 조회는 감사 로그에 기록됩니다"
      />
      <div style={{ padding: '12px 28px 0', background: 'var(--bg-canvas)' }}>
        <Tabs variant="underline" items={[
          { id: 'summary', label: '요약' },
          { id: 'signals', label: '추출된 단서' },
          { id: 'hypothesis', label: '잠정 가설' },
          { id: 'transcript', label: '대화 기록' },
          { id: 'recommendations', label: '추천' },
        ]} activeId={tab} onChange={setTab}/>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        {!id ? (
          <Card padding={8}><EmptyState icon={<IcUser size={24}/>} title="학생을 먼저 선택해주세요" body="학생 목록에서 학생을 선택하면 AI 진로 상담 내용을 열람할 수 있어요."/></Card>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{[0,1,2].map(i => <Skeleton key={i} height={120} radius={16}/>)}</div>
        ) : error ? (
          <Card padding={8}><EmptyState icon={<IcUser size={24}/>} title="학생 정보를 불러오지 못했어요" body="담당 학급 학생만 조회할 수 있어요."/></Card>
        ) : (
          <>
            <div style={{
              padding: 14, background: 'var(--warning-bg)', borderRadius: 12,
              fontSize: 12, color: 'var(--warning)', display: 'flex', gap: 10, marginBottom: 16, lineHeight: 1.5,
            }}>
              <IcShield size={16} style={{ marginTop: 1, flexShrink: 0 }}/>
              <span className="kr-heading">
                이 데이터는 {name} 학생의 사전 동의에 따라 담임 교사에게만 공개됩니다. 외부 공유·다운로드 시 학생에게 자동 알림이 발송돼요.
              </span>
            </div>
            {tab === 'summary' && <TAVSummary/>}
            {tab === 'signals' && <TAVSignals signals={signals}/>}
            {tab === 'hypothesis' && <TAVHypothesis/>}
            {tab === 'transcript' && <TAVTranscript/>}
            {tab === 'recommendations' && <TAVRecommendations/>}
          </>
        )}
      </div>
    </div>
  );
}

function TAVSummary() {
  return (
    <Card padding={8}>
      <EmptyState
        icon={<IcSparkles size={24}/>}
        title="AI 상담 요약이 아직 없어요"
        body="학생의 AI 진로 상담 요약 리포트는 아직 제공되지 않아요. 추출된 단서는 ‘추출된 단서’ 탭에서 확인할 수 있어요."
      />
    </Card>
  );
}

function TAVSignals({ signals }) {
  const list = signals || [];
  return (
    <SectionCard title="추출된 단서" subtitle="학생의 AI 상담 대화에서 추출된 진로 단서">
      {list.length === 0 ? (
        <EmptyState icon={<IcSparkles size={24}/>} title="아직 추출된 단서가 없어요" body="학생이 AI 상담을 진행하면 단서가 쌓여요."/>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((s, i) => (
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

function TAVHypothesis() {
  return (
    <Card padding={8}>
      <EmptyState
        icon={<IcSparkles size={24}/>}
        title="잠정 가설이 아직 없어요"
        body="충분한 상담 단서가 쌓이면 AI가 잠정적인 진로 가설을 제시해요. 가설은 적성검사·학업 성취도와 교차 검증이 필요해요."
      />
    </Card>
  );
}

function TAVTranscript() {
  return (
    <Card padding={8}>
      <EmptyState
        icon={<IcMessage size={24}/>}
        title="대화 전문이 아직 없어요"
        body="상담 전문은 학생 동의 후 제공돼요. 현재는 추출된 단서만 열람할 수 있어요."
      />
    </Card>
  );
}

function TAVRecommendations() {
  return (
    <Card padding={8}>
      <EmptyState
        icon={<IcClipboard size={24}/>}
        title="추천이 아직 없어요"
        body="AI 상담이 충분히 진행되면 추천 학과·활동이 여기에 표시돼요."
      />
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// 5. CAREER TARGETS (manage targets + summary of analysis)
// Strategy status REPLACES fake "% 적합도" probability.
// ────────────────────────────────────────────────────────
function CareerTargets({ go }) {
  const [targets, setTargets] = React.useState(null); // null=loading
  React.useEffect(() => {
    (async () => {
      try { const r = await window.__apiFetch('/career/targets', { method: 'GET' }); setTargets(r.data || []); }
      catch (e) { setTargets([]); }
    })();
  }, []);
  const current = (targets && targets[0]) || null;
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="진로 목표 관리" subtitle="최대 3개의 목표를 비교하며 준비할 수 있어요" leading={<BackButton onClick={() => go('dashboard')}/>} trailing={<IconButton icon={<IcPlus size={20}/>} onClick={() => go('goal-setting')} ariaLabel="목표 추가"/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        {targets === null ? (
          <Card padding={20}><Skeleton height={80}/></Card>
        ) : targets.length === 0 ? (
          <EmptyState
            icon={<IcTarget size={22}/>}
            title="아직 설정한 진로 목표가 없어요"
            body="AI 상담으로 관심 진로를 찾거나, 직접 목표를 추가해보세요. 목표는 최대 3개까지 비교할 수 있어요."
            action={<Button variant="primary" size="md" leading={<IcPlus size={16}/>} onClick={() => go('goal-setting')}>목표 추가하기</Button>}
          />
        ) : (
        <>
        <Card padding={20} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff' }}>
          <Chip tone="info" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginBottom: 10 }}>주 목표</Chip>
          <div style={{ fontSize: 20, fontWeight: 800 }} className="kr-heading">{current.career}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{[current.univ, current.dept].filter(Boolean).join(' ')}</div>
          {current.reason && <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.18)', fontSize: 13, opacity: 0.92, lineHeight: 1.5 }} className="kr-heading">{current.reason}</div>}
        </Card>

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 10 }}>모든 목표 ({targets.length}/3)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {targets.map((t, i) => (
            <Card key={t.id} padding={16} style={{ border: i === 0 ? '2px solid var(--brand-500)' : '1px solid var(--line-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    {i === 0 && <Chip tone="brand" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>주 목표</Chip>}
                    {t.track && <Chip tone="purple" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{t.track}</Chip>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{t.career}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">{[t.univ, t.dept].filter(Boolean).join(' ')}</div>
                </div>
              </div>
              {t.reason && <div style={{ padding: 10, background: 'var(--bg-muted)', borderRadius: 8, fontSize: 12, color: 'var(--fg-default)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <IcSparkles size={12} color="var(--accent-purple)"/>
                <span className="kr-heading">{t.reason}</span>
              </div>}
              {t.univ && <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Button variant="brandSoft" size="sm" full onClick={() => go('admissions-hub')}>대학·입시 보기</Button>
              </div>}
            </Card>
          ))}
        </div>
        </>
        )}

        <Card padding={14} style={{ background: 'var(--info-bg)', boxShadow: 'none' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--brand-600)', lineHeight: 1.55 }} className="kr-heading">
            <IcInfo size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span>
              "합격 확률 %"는 보여드리지 않아요. 진학은 변수가 너무 많고, 잘못된 숫자는 잘못된 선택으로 이어져요. 대신 <strong>전략 상태</strong>와 <strong>채워야 할 격차</strong>를 정직하게 안내드려요.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 6. COMPLETION STATUS (teacher view)
// ────────────────────────────────────────────────────────
function CompletionStatus({ go }) {
  // 실 데이터 — /v1/teacher/students 의 이번 주 학습(studyDone/studyTotal).
  const [roster, setRoster] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const r = await window.__apiFetch('/teacher/students', { method: 'GET' });
        const rows = (r.data || []).map(s => ({
          id: s.id, name: s.name, avatar: (s.name || '?').slice(0, 1),
          done: s.studyDone || 0, total: s.studyTotal || 0,
          needsCounseling: s.needsCounseling,
          lastActive: s.lastActivityAt ? new Date(s.lastActivityAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '없음',
        })).sort((a, b) => (b.total ? b.done / b.total : 0) - (a.total ? a.done / a.total : 0));
        setRoster(rows);
      } catch (e) { setRoster([]); }
    })();
  }, []);
  const students = roster || [];
  const withTasks = students.filter(s => s.total > 0);
  const classAvg = withTasks.length ? Math.round(withTasks.reduce((a, s) => a + s.done / s.total, 0) / withTasks.length * 100) : 0;
  const completed = withTasks.filter(s => s.done === s.total).length;
  const risk = students.filter(s => s.total === 0 || s.done / s.total < 0.4).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar title="학생 학습 완료 현황" subtitle="이번 주 학습 계획 진행률 · 실시간 업데이트"
        action={<><Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => downloadCSV('학습완료현황', ['이름','완료','전체','완료율','마지막활동'], students.map(s => [s.name, s.done, s.total, `${s.total?Math.round(s.done/s.total*100):0}%`, s.lastActive]))}>CSV 내보내기</Button><Button variant="outline" size="sm" leading={<IcDoc size={14}/>} onClick={() => exportReportPDF('학습 완료 현황', ['이름','완료','완료율','마지막 활동'], students.map(s => [s.name, `${s.done}/${s.total}`, `${s.total?Math.round(s.done/s.total*100):0}%`, s.lastActive]), { '학급': '2-3' })}>PDF 내보내기</Button></>}
      />
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="학급 평균 완료율" value={`${classAvg}%`} delta="+8 지난주" deltaTone="success" icon={<IcCheck size={16}/>}/>
          <MetricCard label="100% 완료" value={`${completed}명`} delta="잘하는 학생" deltaTone="success" icon={<IcStar size={16}/>}/>
          <MetricCard label="진행 중" value={`${students.length - completed - risk}명`} delta="정상 페이스" deltaTone="info" icon={<IcZap size={16}/>}/>
          <MetricCard label="주의 필요" value={`${risk}명`} delta="40% 미만" deltaTone="danger" icon={<IcAlert size={16}/>}/>
        </div>

        <SectionCard title="학생별 진행률" subtitle="완료율 높은 순">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {students.map((s, i, arr) => {
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              const tone = s.total === 0 ? 'neutral' : pct >= 80 ? 'success' : pct >= 40 ? 'info' : 'danger';
              return (
                <div key={s.id} onClick={() => { window.__selectedStudentId = s.id; go && go('student-detail'); }} style={{
                  display: 'grid', gridTemplateColumns: '180px 1fr 100px 100px 32px',
                  alignItems: 'center', gap: 16,
                  padding: '14px 4px',
                  borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none',
                  cursor: 'pointer', transition: 'background 120ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={s.avatar} size={32}/>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>마지막 활동 {s.lastActive}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={s.done} max={s.total} height={6} color={`var(--${tone === 'info' ? 'brand-500' : tone})`}/></div>
                    <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', minWidth: 36, textAlign: 'right' }}>{s.done}/{s.total}</span>
                  </div>
                  <Chip tone={tone} size="sm">{pct}%</Chip>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    {s.needsCounseling ? <Chip tone="warning" size="sm">상담 필요</Chip> : <span style={{ color: 'var(--fg-subtle)' }}>—</span>}
                  </div>
                  <IcChevronRight size={16} color="var(--fg-subtle)"/>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="학급 요약" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13, color: 'var(--fg-default)' }}>
            <div><span style={{ color: 'var(--fg-muted)' }}>학습 계획 등록 학생</span> <b className="num">{withTasks.length}</b>명</div>
            <div><span style={{ color: 'var(--fg-muted)' }}>아직 미등록</span> <b className="num">{students.length - withTasks.length}</b>명</div>
            <div><span style={{ color: 'var(--fg-muted)' }}>상담 필요</span> <b className="num">{students.filter(s => s.needsCounseling).length}</b>명</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 10, lineHeight: 1.5 }} className="kr-heading">
            요일별·과목별 상세 패턴은 학생들이 학습 계획을 더 입력하면 자동으로 집계돼요. 현재는 학생이 직접 입력한 주간 학습 항목의 완료율을 기준으로 보여드립니다.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 7. AI CHAT / RAG (general purpose chat with sources)
// ────────────────────────────────────────────────────────
const AI_CHAT_RAG_INITIAL = [
  { role: 'ai', text: '안녕하세요! 진로나침반 AI예요. 진로, 학습, 입시, 학과 정보 등 무엇이든 물어봐주세요. 공공데이터(커리어넷·대학알리미)를 근거로 답해드릴게요. 다만 큰 결정은 꼭 선생님과 함께 정하세요.' },
];

const RAG_SUGGEST = [
  '영상 편집에 관심이 있는데 어떤 직업이 있을까?',
  '국어 비문학 점수 올리는 방법은?',
  '컴퓨터공학과는 어떤 대학에 있어?',
  '봉사활동은 입시에 어떻게 반영돼?',
];

// 교사 코칭 모드 — 백엔드가 교사 세션이면 코치 프롬프트로 응답(학과·진로 공공데이터 근거).
const COACH_INITIAL = [
  { role: 'ai', text: '안녕하세요 선생님! 학생 진로·진학 상담을 돕는 AI 코치예요. 어떤 학생을 어떻게 상담할지, 어떤 학과·직업·대학을 안내할지 물어봐주세요. 커리어넷·대학알리미 등 공공데이터를 근거로 알려드릴게요.' },
];
const COACH_SUGGEST = [
  '생명과학에 관심있는 학생, 어떤 질문으로 상담을 시작할까요?',
  '내신 3등급대 학생에게 추천할 만한 공학 계열 학과는?',
  '진로를 못 정한 고2 학생 상담은 어떤 순서로 진행하면 좋을까요?',
  '봉사활동을 학생부에 잘 녹이려면 어떻게 안내할까요?',
];

function AIChatRAG({ go, coach = false }) {
  // 실 상담 API(SSE)로 연결 — AI 진로 상담과 같은 세션 엔진 사용 (홍익대 mock 제거).
  const [msgs, setMsgs] = React.useState(coach ? COACH_INITIAL : AI_CHAT_RAG_INITIAL);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  // 세션 확보 (기존 active 재사용)
  React.useEffect(() => {
    if (!window.__isLoggedIn || !window.__isLoggedIn()) return;
    (async () => {
      try {
        const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' });
        const sid = (active && active.data && active.data.id) || (await window.__apiFetch('/ai-counseling/sessions', { method: 'POST' })).data.id;
        setSessionId(sid);
      } catch (e) {}
    })();
  }, []);

  const send = async (text) => {
    if (!text.trim() || thinking) return;
    if (!window.__isLoggedIn || !window.__isLoggedIn()) {
      setMsgs(m => [...m, { role: 'user', text }, { role: 'ai', text: '로그인하면 AI에게 물어볼 수 있어요.' }]);
      setInput(''); return;
    }
    let sid = sessionId;
    if (!sid) {
      try {
        const active = await window.__apiFetch('/ai-counseling/sessions/active', { method: 'GET' });
        sid = (active && active.data && active.data.id) || (await window.__apiFetch('/ai-counseling/sessions', { method: 'POST' })).data.id;
        setSessionId(sid);
      } catch (e) { setMsgs(m => [...m, { role: 'user', text }, { role: 'ai', text: '상담을 시작하지 못했어요. 잠시 후 다시 시도해주세요.' }]); setInput(''); return; }
    }
    setMsgs(m => [...m, { role: 'user', text }, { role: 'ai', text: '' }]);
    setInput('');
    setThinking(true);
    await window.__apiStream('/ai-counseling/sessions/' + sid + '/messages', { text }, {
      onToken: (delta) => { setThinking(false); setMsgs(m => { const c = [...m]; c[c.length - 1] = { role: 'ai', text: (c[c.length - 1].text || '') + delta }; return c; }); },
      onDone: () => { setThinking(false); },
      onError: (code, message) => { setThinking(false); setMsgs(m => { const c = [...m]; c[c.length - 1] = { role: 'ai', text: message || '오류가 발생했어요.' }; return c; }); },
    });
    setThinking(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton onClick={() => go && go('dashboard')}/>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{coach ? 'AI 상담 코칭' : 'AI 도움말'}</div>
            <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{coach ? '교사용 · 공공데이터 근거' : 'RAG · 공식 자료 기반'}</div>
          </div>
          <IconButton icon={<IcDownload size={20}/>} ariaLabel="대화 PDF 저장" onClick={() => exportReportPDF('AI 도움말 대화', ['구분','내용'], msgs.map(m => [m.role === 'user' ? '학생' : 'AI', m.text + (m.sources ? '\n[출처] ' + m.sources.map(s => s.title).join(', ') : '')]), { '유형': 'RAG 도움말' })}/>
        </div>
      </div>

      <div ref={scrollRef} className="toss-scroll" style={{ flex: 1, padding: '12px 14px 8px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => <RagBubble key={i} msg={m}/>)}
        {thinking && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>AI</div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: '4px 14px 14px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcSearch size={14} color="var(--accent-purple)"/>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">관련 자료를 찾고 있어요...</span>
            </div>
          </div>
        )}

        {msgs.length === 1 && (
          <div style={{ padding: '16px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>이런 걸 물어보세요</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(coach ? COACH_SUGGEST : RAG_SUGGEST).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  textAlign: 'left', padding: '12px 14px',
                  background: 'var(--bg-surface)', border: '1px solid var(--line)',
                  borderRadius: 12, fontSize: 13, color: 'var(--fg-default)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }} className="kr-heading">
                  <IcSparkles size={14} color="var(--accent-purple)"/>
                  <span style={{ flex: 1 }}>{s}</span>
                  <IcArrowRight size={14} color="var(--fg-subtle)"/>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderTop: '1px solid var(--line-subtle)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-muted)', borderRadius: 24, padding: '6px 6px 6px 16px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(input); }} placeholder="무엇이든 물어보세요" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, minWidth: 0 }}/>
          <button onClick={() => send(input)} disabled={!input.trim()} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: input.trim() ? 'var(--brand-500)' : 'var(--line-strong)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}><IcSend size={16}/></button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 6 }} className="kr-heading">
          AI 응답은 참고용이에요. 입시 결정은 학교·입학처 공식 자료를 확인해주세요.
        </div>
      </div>
    </div>
  );
}

function RagBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 6 }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>AI</div>
      )}
      <div style={{ maxWidth: '88%' }}>
        <div style={{
          padding: '12px 14px',
          background: isUser ? 'var(--brand-500)' : 'var(--bg-surface)',
          color: isUser ? '#fff' : 'var(--fg-strong)',
          borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          fontSize: 14, lineHeight: 1.55,
          boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
          whiteSpace: 'pre-line',
        }} className="kr-heading">{msg.text}</div>
        {msg.sources && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <IcDoc size={10}/> 출처 {msg.sources.length}건
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {msg.sources.map((s, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-muted)', borderRadius: 10, border: '1px solid var(--line-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', flex: 1 }} className="kr-heading">{s.title}</span>
                    <Chip tone={s.confidence === 'confirmed' ? 'success' : 'warning'} size="sm" style={{ height: 16, padding: '0 5px', fontSize: 9 }}>
                      {s.confidence === 'confirmed' ? '확정' : '추정'}
                    </Chip>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace' }}>{s.url}</span>
                    <span className="num">갱신 {s.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  ConsentManagement, StudyPlanFull, GoalSetting, TeacherAIView,
  CareerTargets, CompletionStatus, AIChatRAG,
});
