// teacher-broadcast.jsx — shared store: teacher-pushed memos/events sync to
// selected students' calendars + messages + notifications.
// Mock/in-memory; backend later. Exposes a tiny pub/sub so screens re-render.

const _bcListeners = new Set();
function _bcEmit() { _bcListeners.forEach(fn => { try { fn(); } catch (e) {} }); }

// Each broadcast: { id, title, body, date(YYYY-MM-DD), time, category, targets:[studentId|'all'], createdAt }
window.__TEACHER_BROADCASTS = window.__TEACHER_BROADCASTS || [];

function teacherBroadcastStore() { return window.__TEACHER_BROADCASTS; }

function addTeacherBroadcast(bc) {
  const full = { id: 'bc_' + Date.now(), createdAt: '방금', ...bc };
  window.__TEACHER_BROADCASTS = [full, ...window.__TEACHER_BROADCASTS];
  _bcEmit();
  return full;
}

// Broadcasts visible to a given student (targets include 'all' or their id)
function broadcastsForStudent(studentId = 's1') {
  return teacherBroadcastStore().filter(b => b.targets.includes('all') || b.targets.includes(studentId));
}

function useBroadcasts() {
  const [, setN] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setN(n => n + 1);
    _bcListeners.add(fn);
    return () => _bcListeners.delete(fn);
  }, []);
  return teacherBroadcastStore();
}

const BC_CATEGORIES = [
  { id: 'mock-exam', label: '모의고사', tone: 'brand', icon: <IcChart/> },
  { id: 'exam', label: '중간/기말', tone: 'warning', icon: <IcClipboard/> },
  { id: 'performance', label: '수행평가', tone: 'purple', icon: <IcDoc/> },
  { id: 'admission', label: '입시·수시', tone: 'danger', icon: <IcGraduation/> },
  { id: 'certificate', label: '자격증 시험', tone: 'mint', icon: <IcStar/> },
  { id: 'counseling', label: '상담', tone: 'info', icon: <IcMessage/> },
  { id: 'admin', label: '행정·기타', tone: 'neutral', icon: <IcInfo/> },
];
const bcCat = (id) => BC_CATEGORIES.find(c => c.id === id) || BC_CATEGORIES[BC_CATEGORIES.length - 1];

function bcCatChip(id) {
  const c = bcCat(id);
  return <Chip tone={c.tone} size="sm">{c.label}</Chip>;
}

// Roster used by the compose dialog (falls back if TEACHER_STUDENTS missing)
function bcRoster() {
  if (typeof TEACHER_STUDENTS !== 'undefined') return TEACHER_STUDENTS;
  // 실 로스터는 비동기 — 동기 폴백은 빈 배열(가짜 학생 금지). 호출부가 /teacher/students로 채운다.
  return (typeof window !== 'undefined' && Array.isArray(window.__teacherRoster)) ? window.__teacherRoster : [];
}

// Merge teacher broadcasts (for a student) into a calendar events map.
function mergeBroadcasts(baseEvents, studentId) {
  const out = {};
  Object.keys(baseEvents || {}).forEach(k => { out[k] = [...baseEvents[k]]; });
  try {
    broadcastsForStudent(studentId).forEach(b => {
      if (!b.date) return;
      const ev = { type: b.category === 'counseling' ? 'counseling-confirmed' : b.category === 'mock-exam' ? 'mock-exam' : (b.category === 'exam' || b.category === 'performance') ? 'performance-due' : 'memo', title: b.title, time: b.time, fromTeacher: true, body: b.body, bcId: b.id };
      out[b.date] = [...(out[b.date] || []), ev];
    });
  } catch (e) {}
  return out;
}

Object.assign(window, {
  teacherBroadcastStore, addTeacherBroadcast, broadcastsForStudent, useBroadcasts, mergeBroadcasts,
  BC_CATEGORIES, bcCat, bcCatChip, bcRoster,
  toneBg, toneFg,
});

// Shared tone → soft bg / fg helpers (used by list-row icon chips everywhere)
function toneBg(t) { return `var(--${t === 'brand' ? 'brand-50' : t === 'purple' ? 'accent-purple-bg' : t === 'success' ? 'success-bg' : t === 'warning' ? 'warning-bg' : t === 'info' ? 'info-bg' : t === 'mint' ? 'accent-mint-bg' : t === 'danger' ? 'danger-bg' : 'neutral-bg'})`; }
function toneFg(t) { return `var(--${t === 'brand' ? 'brand-600' : t === 'purple' ? 'accent-purple' : t === 'success' ? 'success' : t === 'warning' ? 'warning' : t === 'info' ? 'info' : t === 'mint' ? 'accent-mint' : t === 'danger' ? 'danger' : 'neutral-fg'})`; }

// Shared compose dialog: teacher creates a memo/event, multi-selects students
// (or 전체), and it syncs to their calendar + messages + notifications.
function BroadcastComposeDialog({ open, onClose, presetCategory }) {
  const roster = bcRoster();
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [date, setDate] = React.useState('2026-06-15');
  const [time, setTime] = React.useState('09:00');
  const [category, setCategory] = React.useState(presetCategory || 'mock-exam');
  const [targets, setTargets] = React.useState(['all']);
  const trapRef = useFocusTrap(open, onClose);
  React.useEffect(() => { if (open) { setTitle(''); setBody(''); setTargets(['all']); setCategory(presetCategory || 'mock-exam'); } }, [open, presetCategory]);
  if (!open) return null;

  const allSelected = targets.includes('all');
  const toggleAll = () => setTargets(allSelected ? [] : ['all']);
  const toggleOne = (id) => {
    setTargets(prev => {
      const base = prev.filter(t => t !== 'all');
      return base.includes(id) ? base.filter(t => t !== id) : [...base, id];
    });
  };
  const selectedCount = allSelected ? roster.length : targets.length;
  const canSend = title.trim() && body.trim() && selectedCount > 0;

  const submit = () => {
    addTeacherBroadcast({ title: title.trim(), body: body.trim(), date, time, category, targets: allSelected ? ['all'] : [...targets] });
    showToast(`${selectedCount}명에게 "${title.trim()}"을(를) 보냈어요`, 'success');
    onClose();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="학생에게 일정·메모 보내기" style={{
        position: 'relative', width: 'min(540px, 100%)', maxHeight: '92%', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)',
      }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>학생에게 일정·메모 보내기</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">선택한 학생의 캘린더·메시지에 동기화돼요</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>

        <FormField label="분류" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {BC_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 999,
                border: '1px solid', borderColor: category === c.id ? toneFg(c.tone) : 'var(--line-strong)',
                background: category === c.id ? toneBg(c.tone) : 'var(--bg-surface)',
                color: category === c.id ? toneFg(c.tone) : 'var(--fg-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{React.cloneElement(c.icon, { size: 12 })}{c.label}</button>
            ))}
          </div>
        </FormField>

        <FormField label="제목" required style={{ marginBottom: 14 }}>
          <TextInput value={title} onChange={setTitle} placeholder="예) 6월 모의고사, 정보처리기능사 필기" autoFocus/>
        </FormField>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <FormField label="날짜" style={{ flex: 1, minWidth: 0 }}>
            <CalSelect value={date} onChange={setDate} options={DATE_OPTIONS} render={(d) => `${d.slice(5,7)}월 ${d.slice(8,10)}일`}/>
          </FormField>
          <FormField label="시간" style={{ flex: 1, minWidth: 0 }}>
            <CalSelect value={time} onChange={setTime} options={TIME_OPTIONS}/>
          </FormField>
        </div>

        <FormField label="내용" required style={{ marginBottom: 14 }}>
          <Textarea value={body} onChange={setBody} rows={4} placeholder="학생이 받아볼 안내 내용을 적어주세요. 준비물·범위·장소 등."/>
        </FormField>

        <FormField label={`받는 학생 (${selectedCount}명)`} required style={{ marginBottom: 16 }}>
          <button onClick={toggleAll} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
            padding: '12px 14px', borderRadius: 12, cursor: 'pointer', marginBottom: 8,
            border: '1px solid', borderColor: allSelected ? 'var(--brand-500)' : 'var(--line-strong)',
            background: allSelected ? 'var(--brand-50)' : 'var(--bg-surface)',
          }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: allSelected ? 'none' : '2px solid var(--line-strong)', background: allSelected ? 'var(--brand-500)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{allSelected && <IcCheck size={13}/>}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>우리 반 전체</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{roster.length}명 모두에게 보내기</div>
            </div>
            <IcUsers size={18} color={allSelected ? 'var(--brand-600)' : 'var(--fg-subtle)'}/>
          </button>
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid var(--line-subtle)', borderRadius: 12, opacity: allSelected ? 0.5 : 1, pointerEvents: allSelected ? 'none' : 'auto' }} className="toss-scroll">
            {roster.map((s, i) => {
              const on = targets.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleOne(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  borderBottom: i < roster.length-1 ? '1px solid var(--line-subtle)' : 'none',
                  background: on ? 'var(--brand-50)' : 'transparent',
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: on ? 'none' : '2px solid var(--line-strong)', background: on ? 'var(--brand-500)' : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <IcCheck size={12}/>}</div>
                  <Avatar name={s.name[0]} size={30}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.grade}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </FormField>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!canSend} trailing={<IcSend size={14}/>} onClick={submit}>
            {selectedCount}명에게 보내기
          </Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BroadcastComposeDialog });
