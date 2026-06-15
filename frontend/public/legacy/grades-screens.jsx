// grades-screens.jsx — Comprehensive grade input supporting:
// 모의고사 / 중간고사 / 기말고사 / 수행평가

const GRADE_TYPES = [
  { id: 'mock', label: '모의고사', icon: <IcDoc/> },
  { id: 'midterm', label: '중간고사', icon: <IcClipboard/> },
  { id: 'final', label: '기말고사', icon: <IcClipboard/> },
  { id: 'performance', label: '수행평가', icon: <IcStar/> },
];

// ────────────────────────────────────────────────────────
// Main entry — chooses type and renders correct form
// ────────────────────────────────────────────────────────
// 실 CRUD — POST /v1/grades. 학기(term) + 과목 행들을 한 번에 저장.
function GradesInputV2({ go }) {
  const CATS = ['국어', '수학', '영어', '사회', '과학', '한국사', '제2외국어', '예체능', '기타'];
  const thisYear = new Date().getFullYear();
  const TERMS = [thisYear + '-1', thisYear + '-2', (thisYear - 1) + '-2', (thisYear - 1) + '-1'];
  const [term, setTerm] = React.useState(TERMS[0]);
  const [rows, setRows] = React.useState([{ subject: '', category: '', score: '', rank: '' }]);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');

  const upd = (i, k, v) => setRows(r => r.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const addRow = () => setRows(r => [...r, { subject: '', category: '', score: '', rank: '' }]);
  const delRow = (i) => setRows(r => r.length > 1 ? r.filter((_, j) => j !== i) : r);

  const save = async () => {
    setErr('');
    if (!term.trim()) { setErr('학기를 입력해주세요 (예: 2026-1).'); return; }
    const valid = rows.filter(r => r.subject.trim() && (r.score !== '' || r.rank !== ''));
    if (!valid.length) { setErr('과목명과 점수(또는 등급)를 최소 1개 입력해주세요.'); return; }
    setSaving(true);
    try {
      for (const r of valid) {
        await window.__apiFetch('/grades', { method: 'POST', body: JSON.stringify({
          term: term.trim(), subject: r.subject.trim(),
          ...(r.category ? { category: r.category } : {}),
          ...(r.score !== '' ? { score: Number(r.score) } : {}),
          ...(r.rank !== '' ? { rank: Number(r.rank) } : {}),
        }) });
      }
      go('grades-trend');
    } catch (e) {
      setErr((e && e.body && e.body.message) || '저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="성적 입력" leading={<BackButton onClick={() => go('grades-trend')}/>}/>
      <div style={{ padding: 16 }}>
        <SectionCard title="학기" style={{ marginBottom: 12 }}>
          <SelectChips value={term} onChange={setTerm} options={TERMS}/>
          <div style={{ marginTop: 10 }}>
            <TextInput value={term} onChange={setTerm} placeholder="직접 입력 (예: 2026-1)" leading={<IcCalendar size={14}/>}/>
          </div>
        </SectionCard>

        <SectionCard title="과목별 성적" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rows.map((r, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <TextInput value={r.subject} onChange={v => upd(i, 'subject', v)} placeholder="과목명 (예: 미적분)" style={{ flex: 1 }}/>
                  {rows.length > 1 && <IconButton icon={<IcTrash size={16}/>} ariaLabel="삭제" onClick={() => delRow(i)}/>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <TextInput value={r.score} onChange={v => upd(i, 'score', v.replace(/[^0-9.]/g, ''))} placeholder="점수 0~100" trailing={<span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>점</span>} style={{ flex: 1 }}/>
                  <TextInput value={r.rank} onChange={v => upd(i, 'rank', v.replace(/[^1-9]/g, '').slice(0, 1))} placeholder="등급 1~9" trailing={<span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>등급</span>} style={{ flex: 1 }}/>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CATS.map(c => (
                    <button key={c} onClick={() => upd(i, 'category', r.category === c ? '' : c)} style={{ border: 'none', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: r.category === c ? 'var(--brand-500)' : 'var(--bg-surface)', color: r.category === c ? '#fff' : 'var(--fg-muted)' }}>{c}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" leading={<IcPlus size={14}/>} onClick={addRow} style={{ marginTop: 10 }}>과목 추가</Button>
        </SectionCard>

        {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, padding: '0 4px' }}>{err}</div>}
        <Button variant="primary" size="lg" full disabled={saving} onClick={save}>{saving ? '저장 중…' : '저장하기'}</Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Mock exam form
// ────────────────────────────────────────────────────────
function MockExamForm({ go }) {
  const [date, setDate] = React.useState('');
  const [examName, setExamName] = React.useState('');
  const [year, setYear] = React.useState('고2');
  const [korean, setKorean] = React.useState({ raw: '', percent: '', grade: '' });
  const [math, setMath] = React.useState({ raw: '', percent: '', grade: '' });
  const [english, setEnglish] = React.useState({ grade: '' });
  const [history, setHistory] = React.useState({ grade: '' });
  const [insp1, setInsp1] = React.useState({ subject: '', raw: '', grade: '' });
  const [insp2, setInsp2] = React.useState({ subject: '', raw: '', grade: '' });
  const [notes, setNotes] = React.useState('');

  return (
    <>
      <SectionCard title="시험 정보" style={{ marginBottom: 12 }}>
        <FormField label="시험명" required style={{ marginBottom: 12 }}>
          <TextInput value={examName} onChange={setExamName} placeholder="예) 5월 전국연합학력평가" leading={<IcDoc size={16}/>}/>
        </FormField>
        <FormField label="시험일" style={{ marginBottom: 12 }}>
          <TextInput value={date} onChange={setDate} placeholder="YYYY-MM-DD" leading={<IcCalendar size={14}/>}/>
        </FormField>
        <FormField label="학년" required>
          <SelectChips value={year} onChange={setYear} options={['고1', '고2', '고3']}/>
        </FormField>
      </SectionCard>

      <SectionCard title="공통 과목" style={{ marginBottom: 12 }}>
        <ScoreTriplet label="국어" value={korean} onChange={setKorean}/>
        <ScoreTriplet label="수학" value={math} onChange={setMath}/>
        <FormField label="영어 (절대평가)" style={{ marginBottom: 12 }}>
          <SelectChips value={english.grade} onChange={v => setEnglish({ grade: v })} options={['1', '2', '3', '4', '5', '6', '7', '8', '9']} suffix="등급"/>
        </FormField>
        <FormField label="한국사 (절대평가)">
          <SelectChips value={history.grade} onChange={v => setHistory({ grade: v })} options={['1', '2', '3', '4', '5', '6', '7', '8', '9']} suffix="등급"/>
        </FormField>
      </SectionCard>

      <SectionCard title="탐구 영역" style={{ marginBottom: 12 }}>
        <SubjectScoreRow label="탐구 1" value={insp1} onChange={setInsp1}/>
        <div style={{ height: 12 }}/>
        <SubjectScoreRow label="탐구 2" value={insp2} onChange={setInsp2}/>
      </SectionCard>

      <SectionCard title="메모 (선택)" style={{ marginBottom: 12 }}>
        <Textarea value={notes} onChange={setNotes} placeholder="이번 시험에서 느낀 점, 약점이었던 단원 등" rows={3}/>
      </SectionCard>

      <InfoStrip text="입력한 성적은 선생님께도 공유돼요. AI 진로 분석에 자동 반영됩니다."/>
      <Button variant="primary" size="lg" full onClick={() => go('grades-trend')} style={{ marginTop: 16 }}>저장하기</Button>
    </>
  );
}

// ────────────────────────────────────────────────────────
// School exam form (midterm / final)
// ────────────────────────────────────────────────────────
function SchoolExamForm({ go, type }) {
  const [semester, setSemester] = React.useState('2-1');
  const [subjects, setSubjects] = React.useState([
    { subject: '국어', score: '', max: '100', weight: '1' },
    { subject: '수학', score: '', max: '100', weight: '1' },
    { subject: '영어', score: '', max: '100', weight: '1' },
  ]);
  const [notes, setNotes] = React.useState('');

  const addSubject = () => setSubjects(s => [...s, { subject: '', score: '', max: '100', weight: '1' }]);
  const updateSubject = (i, k, v) => setSubjects(s => s.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const removeSubject = (i) => setSubjects(s => s.filter((_, j) => j !== i));

  return (
    <>
      <SectionCard title="시험 정보" style={{ marginBottom: 12 }}>
        <FormField label="학기" required style={{ marginBottom: 12 }}>
          <SelectChips value={semester} onChange={setSemester} options={['1-1', '1-2', '2-1', '2-2', '3-1', '3-2']} suffix="학기"/>
        </FormField>
        <FormField label="시험 종류">
          <Chip tone={type === 'midterm' ? 'info' : 'purple'} size="lg">
            {type === 'midterm' ? '중간고사' : '기말고사'}
          </Chip>
        </FormField>
      </SectionCard>

      <SectionCard
        title="과목별 점수"
        action={<Button variant="brandSoft" size="sm" leading={<IcPlus size={12}/>} onClick={addSubject}>과목 추가</Button>}
        style={{ marginBottom: 12 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subjects.map((row, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <TextInput value={row.subject} onChange={v => updateSubject(i, 'subject', v)} placeholder="과목명 (예: 수학)" style={{ height: 40, flex: 1 }}/>
                {subjects.length > 1 && (
                  <button onClick={() => removeSubject(i)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 6 }}>
                    <IcX size={14}/>
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                <SmallNumInput value={row.score} onChange={v => updateSubject(i, 'score', v)} placeholder="점수" suffix="점"/>
                <SmallNumInput value={row.max} onChange={v => updateSubject(i, 'max', v)} placeholder="만점" suffix="점"/>
                <SmallNumInput value={row.weight} onChange={v => updateSubject(i, 'weight', v)} placeholder="비중" suffix="x"/>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="메모 (선택)" style={{ marginBottom: 12 }}>
        <Textarea value={notes} onChange={setNotes} placeholder="이번 시험에서 느낀 점, 다음에 보완할 부분" rows={3}/>
      </SectionCard>

      <InfoStrip text="원점수와 만점을 모두 입력하면 환산 점수가 자동으로 계산돼요."/>
      <Button variant="primary" size="lg" full onClick={() => go('grades-trend')} style={{ marginTop: 16 }}>저장하기</Button>
    </>
  );
}

// ────────────────────────────────────────────────────────
// Performance form
// ────────────────────────────────────────────────────────
function PerformanceForm({ go }) {
  const [subject, setSubject] = React.useState('');
  const [task, setTask] = React.useState('');
  const [score, setScore] = React.useState('');
  const [max, setMax] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [due, setDue] = React.useState('');
  const [feedback, setFeedback] = React.useState('');

  return (
    <>
      <SectionCard title="수행평가 정보" style={{ marginBottom: 12 }}>
        <FormField label="과목" required style={{ marginBottom: 12 }}>
          <TextInput value={subject} onChange={setSubject} placeholder="예) 사회"/>
        </FormField>
        <FormField label="과제명" required style={{ marginBottom: 12 }}>
          <TextInput value={task} onChange={setTask} placeholder="예) 단원평가 7단원 보고서"/>
        </FormField>
        <FormField label="제출일">
          <TextInput value={due} onChange={setDue} placeholder="YYYY-MM-DD" leading={<IcCalendar size={14}/>}/>
        </FormField>
      </SectionCard>

      <SectionCard title="점수" style={{ marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <FormField label="획득 점수">
            <SmallNumInput value={score} onChange={setScore} placeholder="0" suffix="점"/>
          </FormField>
          <FormField label="만점">
            <SmallNumInput value={max} onChange={setMax} placeholder="100" suffix="점"/>
          </FormField>
          <FormField label="반영 비중">
            <SmallNumInput value={weight} onChange={setWeight} placeholder="20" suffix="%"/>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="피드백 / 메모 (선택)" style={{ marginBottom: 12 }}>
        <Textarea value={feedback} onChange={setFeedback} placeholder="선생님 피드백, 다음에 보완할 부분 등" rows={4}/>
      </SectionCard>

      <InfoStrip text="수행평가는 내신 산출에 반영돼요. 누적 점수는 학기 종합 점수에 자동으로 합쳐져요."/>
      <Button variant="primary" size="lg" full onClick={() => go('grades-trend')} style={{ marginTop: 16 }}>저장하기</Button>
    </>
  );
}

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────
function ScoreTriplet({ label, value, onChange }) {
  return (
    <FormField label={label} style={{ marginBottom: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <SmallNumInput value={value.raw} onChange={v => onChange({ ...value, raw: v })} placeholder="원점수" suffix="점"/>
        <SmallNumInput value={value.percent} onChange={v => onChange({ ...value, percent: v })} placeholder="백분위" suffix="%"/>
        <SmallNumInput value={value.grade} onChange={v => onChange({ ...value, grade: v })} placeholder="등급" suffix="등급"/>
      </div>
    </FormField>
  );
}

function SubjectScoreRow({ label, value, onChange }) {
  const SUBJECTS = ['생활과윤리', '윤리와사상', '한국지리', '세계지리', '동아시아사', '세계사', '경제', '정치와법', '사회문화', '물리학I', '화학I', '생명과학I', '지구과학I'];
  return (
    <>
      <FormField label={label} style={{ marginBottom: 8 }}>
        <TextInput value={value.subject} onChange={v => onChange({ ...value, subject: v })} placeholder="과목 선택 (예: 사회문화)"/>
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <SmallNumInput value={value.raw} onChange={v => onChange({ ...value, raw: v })} placeholder="표준점수" suffix="점"/>
        <SmallNumInput value={value.grade} onChange={v => onChange({ ...value, grade: v })} placeholder="등급" suffix="등급"/>
      </div>
    </>
  );
}

function SmallNumInput({ value, onChange, placeholder, suffix }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: 42, padding: '0 10px',
      background: 'var(--bg-surface)', border: '1px solid var(--line-strong)', borderRadius: 10,
    }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        placeholder={placeholder}
        inputMode="decimal"
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontSize: 14, color: 'var(--fg-strong)', minWidth: 0,
          fontVariantNumeric: 'tabular-nums', width: '100%',
        }}
      />
      {suffix && <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{suffix}</span>}
    </div>
  );
}

function SelectChips({ value, onChange, options, suffix }) {
  return (
    <div style={{ display: 'flex', gap: 4, overflow: 'auto' }} className="toss-scroll">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          flex: 1, minWidth: 38, padding: '8px 4px',
          border: '1px solid', borderColor: value === o ? 'var(--brand-500)' : 'var(--line-strong)',
          background: value === o ? 'var(--brand-50)' : 'var(--bg-surface)',
          color: value === o ? 'var(--brand-600)' : 'var(--fg-default)',
          borderRadius: 8, fontSize: 13, fontWeight: value === o ? 700 : 500,
          cursor: 'pointer',
        }}>{o}{suffix && <span style={{ fontSize: 10, opacity: 0.7 }}>{suffix}</span>}</button>
      ))}
    </div>
  );
}

function InfoStrip({ text, tone = 'info' }) {
  const c = tone === 'info' ? { bg: 'var(--brand-50)', fg: 'var(--brand-600)' } : { bg: 'var(--warning-bg)', fg: 'var(--warning)' };
  return (
    <div style={{
      padding: 14, background: c.bg, borderRadius: 12,
      fontSize: 12, color: c.fg, display: 'flex', gap: 8, alignItems: 'flex-start', lineHeight: 1.5,
    }}>
      <IcInfo size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
      <span className="kr-heading">{text}</span>
    </div>
  );
}

Object.assign(window, { GradesInputV2 });
