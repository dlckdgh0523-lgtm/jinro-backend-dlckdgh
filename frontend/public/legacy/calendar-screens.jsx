// calendar-screens.jsx — Student & teacher calendar + appointment flows

// Event types: counseling-request | counseling-confirmed | teacher-proposal
// | mock-exam | admissions-update | study-due | performance-due
// 학생/교사 캘린더는 실 /calendar/events로 동작해요. 이 맵들은 mock 제거로 비워두며,
// teacher-mobile의 TMCalendar 등 아직 미연동 화면에서 참조해도 빈 상태로 안전하게 떨어져요.
const CAL_EVENTS = {};

// Per-student calendars for the teacher's read-only 조회 view. (fake per-student maps 제거)
const ROSTER_CALENDARS = {};

function WeekStudyPanel({ compact, go }) {
  const all = (typeof useStudyTasks === 'function') ? useStudyTasks() : [];
  const items = all.filter(t => t.focus);
  const done = items.filter(i => i.done).length;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>이번 주 학습 계획</span>
        <Chip tone="info" size="sm">{done}/{items.length}</Chip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((it, i, arr) => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{it.day || it.subject.slice(0,1)}</div>
            <span style={{ fontSize: 13, color: it.done ? 'var(--fg-muted)' : 'var(--fg-strong)', textDecoration: it.done ? 'line-through' : 'none', flex: 1 }} className="kr-heading">{it.title}</span>
            {it.done
              ? <IcCheckCircle size={16} color="var(--success)"/>
              : (go ? <button onClick={() => go('focus-timer')} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 9px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--brand-50)', color: 'var(--brand-600)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}><IcZap size={11}/>학습</button>
                    : <span style={{ width: 14, height: 14, borderRadius: 999, border: '1.5px dashed var(--fg-subtle)' }}/>)}
          </div>
        ))}
      </div>
      {go && (
        <Button variant="brandSoft" size="md" full leading={<IcZap size={15}/>} style={{ marginTop: 12 }} onClick={() => go('focus-timer')}>
          자습 타임어택으로 학습하러 가기
        </Button>
      )}
    </div>
  );
}

// Dropdown select + date/time option sets for calendar sheets.
const TIME_OPTIONS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
const DATE_OPTIONS = Array.from({ length: 21 }, (_, i) => { const d = new Date(2026, 4, 17 + i); return `2026-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; });
function CalSelect({ value, onChange, options, render }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', height: 52, padding: '0 38px 0 16px', borderRadius: 12,
        border: '1px solid var(--line-strong)', background: 'var(--bg-surface)',
        fontSize: 15, color: 'var(--fg-strong)', fontFamily: 'var(--font-sans)',
        appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o} value={o}>{render ? render(o) : o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--fg-muted)' }}><IcChevronDown size={16}/></span>
    </div>
  );
}

// Student adds a personal event or study plan into their calendar.
function AddEventSheet({ open, onClose, date, onAdd, onPickDate = () => {} }) {
  const [kind, setKind] = React.useState('personal');
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('18:00');
  const [body, setBody] = React.useState('');
  const trapRef = useFocusTrap(open, onClose);
  React.useEffect(() => { if (open) { setTitle(''); setBody(''); setKind('personal'); } }, [open]);
  if (!open) return null;
  const KINDS = [
    { id: 'personal', label: '개인 일정', tone: 'purple', icon: <IcStar/> },
    { id: 'study-due', label: '학습 계획', tone: 'brand', icon: <IcBook/> },
    { id: 'exam-prep', label: '시험 준비', tone: 'warning', icon: <IcClipboard/> },
    { id: 'admission', label: '입시 준비', tone: 'danger', icon: <IcGraduation/> },
  ];
  const typeFor = (k) => k === 'study-due' ? 'study-due' : k === 'admission' ? 'admissions-update' : k === 'exam-prep' ? 'performance-due' : 'personal';
  const tb = (t) => `var(--${t === 'brand' ? 'brand-50' : t === 'purple' ? 'accent-purple-bg' : t === 'warning' ? 'warning-bg' : 'danger-bg'})`;
  const tf = (t) => `var(--${t === 'brand' ? 'brand-600' : t === 'purple' ? 'accent-purple' : t === 'warning' ? 'warning' : 'danger'})`;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="일정 추가" style={{
        position: 'relative', width: '100%', maxHeight: '92%', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: '24px 24px 0 0', boxShadow: 'var(--shadow-pop)',
        animation: 'sheetIn 320ms var(--ease-toss)',
      }} className="toss-scroll">
        <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 999, margin: '10px auto 4px' }}/>
        <div style={{ padding: '8px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>일정 추가</div>
            <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16 }}><span className="num">{date.slice(5,7)}월 {date.slice(8,10)}일</span>에 추가돼요</div>

          <FormField label="분류" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {KINDS.map(k => (
                <button key={k.id} onClick={() => setKind(k.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', borderRadius: 999,
                  border: '1px solid', borderColor: kind === k.id ? tf(k.tone) : 'var(--line-strong)',
                  background: kind === k.id ? tb(k.tone) : 'var(--bg-surface)',
                  color: kind === k.id ? tf(k.tone) : 'var(--fg-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>{React.cloneElement(k.icon, { size: 13 })}{k.label}</button>
              ))}
            </div>
          </FormField>

          <FormField label="제목" required style={{ marginBottom: 14 }}>
            <TextInput value={title} onChange={setTitle} placeholder={kind === 'study-due' ? '예) 수학 모의고사 오답 정리' : '예) 독서실 자습'} autoFocus/>
          </FormField>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <FormField label="날짜" style={{ flex: 1 }}>
              <CalSelect value={date} onChange={onPickDate} options={DATE_OPTIONS} render={(d) => `${d.slice(5,7)}월 ${d.slice(8,10)}일`}/>
            </FormField>
            <FormField label="시간" style={{ flex: 1 }}>
              <CalSelect value={time} onChange={setTime} options={TIME_OPTIONS}/>
            </FormField>
          </div>

          <FormField label="메모 (선택)" style={{ marginBottom: 18 }}>
            <Textarea value={body} onChange={setBody} rows={3} placeholder="범위·준비물 등을 적어두면 좋아요"/>
          </FormField>

          <Button variant="primary" size="lg" full disabled={!title.trim()} onClick={() => { onAdd({ type: typeFor(kind), title: title.trim(), time, body: body.trim() || undefined }); showToast('일정을 추가했어요', 'success'); onClose(); }}>추가하기</Button>
        </div>
      </div>
    </div>
  );
}

const eventColor = (t) => ({
  'counseling-request': { bg: 'var(--warning-bg)', fg: 'var(--warning)', dot: '#A16207' },
  'counseling-confirmed': { bg: 'var(--success-bg)', fg: 'var(--success)', dot: '#15803D' },
  'teacher-proposal': { bg: 'var(--info-bg)', fg: 'var(--brand-600)', dot: '#1B64DA' },
  'mock-exam': { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple)', dot: '#7B61FF' },
  'admissions-update': { bg: 'var(--bg-muted)', fg: 'var(--fg-default)', dot: '#6B7684' },
  'study-due': { bg: 'var(--accent-mint-bg)', fg: 'var(--accent-mint)', dot: '#00B894' },
  'performance-due': { bg: 'var(--danger-bg)', fg: 'var(--danger)', dot: '#DC2626' },
  'memo': { bg: 'var(--info-bg)', fg: 'var(--brand-600)', dot: '#3182F6' },
  'personal': { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple)', dot: '#7B61FF' },
}[t] || { bg: 'var(--bg-muted)', fg: 'var(--fg-default)', dot: '#6B7684' });

const eventChip = (t) => {
  const labels = {
    'counseling-request': '상담 요청',
    'counseling-confirmed': '상담 확정',
    'teacher-proposal': '시간 제안',
    'mock-exam': '모의고사',
    'admissions-update': '입시 업데이트',
    'study-due': '학습 마감',
    'performance-due': '수행 마감',
    'memo': '메모',
    'personal': '개인 일정',
  };
  const c = eventColor(t);
  return (
    <span style={{ background: c.bg, color: c.fg, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{labels[t]}</span>
  );
};

function buildMonth(year, month) {
  // 0-indexed month
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = [];
  // Leading blanks
  for (let i = 0; i < startWeekday; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push({ day: d, key: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  while (grid.length < 42) grid.push(null);
  return grid;
}

// ────────────────────────────────────────────────────────
// STUDENT calendar (mobile)
// ────────────────────────────────────────────────────────
// 로컬 YYYY-MM-DD 키
function dateKey(d) {
  const dt = new Date(d);
  return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
}
const CAT_COLOR = { volunteer: 'var(--accent-mint)', experience: 'var(--accent-purple)', exam: 'var(--danger)', counseling: 'var(--success)', study: 'var(--brand-500)', other: 'var(--fg-subtle)' };

// 실 API — /v1/calendar/events. 실제 오늘 기준, 월별 조회 + 일정 추가.
function StudentCalendar({ go }) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [events, setEvents] = React.useState([]); // 실 이벤트 배열
  const [addOpen, setAddOpen] = React.useState(false);
  const grid = buildMonth(month.y, month.m);
  const monthLabel = `${month.y}년 ${month.m + 1}월`;

  const load = React.useCallback(async () => {
    const from = new Date(month.y, month.m, 1).toISOString();
    const to = new Date(month.y, month.m + 1, 0, 23, 59, 59).toISOString();
    try {
      const r = await window.__apiFetch('/calendar/events?from=' + from + '&to=' + to, { method: 'GET' });
      setEvents(r.data || []);
    } catch (e) { setEvents([]); }
  }, [month.y, month.m]);
  React.useEffect(() => { load(); }, [load]);

  const byDate = {};
  events.forEach(e => { const k = dateKey(e.startsAt); (byDate[k] = byDate[k] || []).push(e); });
  const eventsFor = (key) => byDate[key] || [];
  const selectedEvents = eventsFor(selected);
  const upcoming = [...events].filter(e => new Date(e.startsAt) >= new Date(todayKey)).sort((a,b) => new Date(a.startsAt) - new Date(b.startsAt)).slice(0, 4);

  const addEvent = async (ev) => {
    // ev: { title, time?, category? } — selected 날짜와 결합해 POST
    const time = (ev && ev.time && /^\d{1,2}:\d{2}/.test(ev.time)) ? ev.time.slice(0,5) : '09:00';
    const startsAt = new Date(selected + 'T' + time + ':00').toISOString();
    try {
      await window.__apiFetch('/calendar/events', { method: 'POST', body: JSON.stringify({
        title: (ev && ev.title) || '새 일정', category: (ev && ev.category) || 'other', startsAt,
        ...(ev && ev.location ? { location: ev.location } : {}),
      }) });
      load();
    } catch (e) { alert((e && e.body && e.body.message) || '일정 추가에 실패했어요.'); }
  };

  const fmtTime = (d) => new Date(d).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="캘린더" leading={<BackButton onClick={() => go('dashboard')}/>} trailing={<IconButton icon={<IcPlus size={20}/>} onClick={() => setAddOpen(true)} ariaLabel="일정 추가"/>}/>

      {/* Month header */}
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<IcChevronLeft size={20}/>} onClick={() => setMonth(m => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 }))} ariaLabel="이전"/>
        <div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{monthLabel}</div>
        <IconButton icon={<IcChevronRight size={20}/>} onClick={() => setMonth(m => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 }))} ariaLabel="다음"/>
      </div>

      {/* Calendar grid */}
      <Card padding={12} style={{ margin: '0 16px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 6 }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--brand-600)' : 'var(--fg-muted)', padding: '6px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} style={{ aspectRatio: '1' }}/>;
            const evs = eventsFor(cell.key);
            const isSelected = selected === cell.key;
            const isToday = cell.key === todayKey;
            return (
              <button key={i} onClick={() => setSelected(cell.key)} style={{
                aspectRatio: '1', border: 'none', cursor: 'pointer', position: 'relative',
                background: isSelected ? 'var(--brand-500)' : (isToday ? 'var(--brand-50)' : 'transparent'),
                color: isSelected ? '#fff' : (isToday ? 'var(--brand-600)' : (i % 7 === 0 ? 'var(--danger)' : 'var(--fg-strong)')),
                borderRadius: 10, fontSize: 13, fontWeight: isSelected || isToday ? 700 : 500,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 2,
              }}>
                <span className="num">{cell.day}</span>
                {evs.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {evs.slice(0, 3).map((e, k) => (
                      <span key={k} style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? '#fff' : (CAT_COLOR[e.category] || 'var(--fg-subtle)') }}/>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected day events */}
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>
            <span className="num">{selected.slice(5, 7)}월 {selected.slice(8, 10)}일</span> 일정
          </span>
          <Button variant="brandSoft" size="sm" leading={<IcPlus size={12}/>} onClick={() => setAddOpen(true)}>일정 추가</Button>
        </div>
        {selectedEvents.length === 0 ? (
          <Card padding={20}>
            <EmptyState icon={<IcCalendar size={22}/>} title="이 날 일정이 없어요" body="봉사·입시 화면에서 ‘캘린더 추가’를 누르거나, 직접 일정을 추가할 수 있어요."/>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedEvents.map((e) => (
              <Card key={e.id} padding={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 36, background: CAT_COLOR[e.category] || 'var(--fg-subtle)', borderRadius: 999 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{fmtTime(e.startsAt)}{e.location ? ' · ' + e.location : ''}</div>
                  </div>
                  <IconButton icon={<IcTrash size={15}/>} ariaLabel="삭제" onClick={async () => { try { await window.__apiFetch('/calendar/events/' + e.id, { method: 'DELETE' }); load(); } catch (er) {} }}/>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming summary (실 데이터) */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 10 }}>다가오는 일정</div>
          {upcoming.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '4px 4px 12px' }}>예정된 일정이 없어요.</div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcoming.map((e) => (
              <Card key={e.id} padding={12} onClick={() => setSelected(dateKey(e.startsAt))} hoverable>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'center', minWidth: 38 }}>
                    <div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{dateKey(e.startsAt).slice(8,10)}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{dateKey(e.startsAt).slice(5,7)}월</div>
                  </div>
                  <div style={{ width: 3, height: 32, background: CAT_COLOR[e.category] || 'var(--fg-subtle)', borderRadius: 999 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{fmtTime(e.startsAt)}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>
      <AddEventSheet open={addOpen} onClose={() => setAddOpen(false)} date={selected} onAdd={addEvent} onPickDate={setSelected}/>
    </div>
  );
}

function EventCard({ ev, onReschedule, onAccept }) {
  const c = eventColor(ev.type);
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const isCounseling = ev.type === 'counseling-confirmed';
  return (
    <Card padding={14} style={{ borderLeft: `3px solid ${c.dot}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {eventChip(ev.type)}
          {ev.fromTeacher && <Chip tone="info" size="sm">선생님</Chip>}
        </div>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{ev.time}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{ev.title}</div>
      {ev.owner && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', background: 'var(--brand-50)', padding: '3px 8px', borderRadius: 6, marginTop: 6 }}><IcCalendar size={10}/>{ev.owner}</div>}
      {/* participants — always show WHO ↔ WHO for any counseling event */}
      {ev.who && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '7px 10px', background: 'var(--bg-muted)', borderRadius: 8 }}>
          <IcUsers size={13} color="var(--brand-600)"/>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{ev.who}</span>
        </div>
      )}
      {ev.topic && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 6 }}><IcMessage size={11}/>{ev.topic}</div>}
      {ev.location && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>📍 {ev.location}</div>}
      {ev.fromTeacher && ev.body && (
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} className="kr-heading">{ev.body}</div>
      )}
      {ev.fromTeacher && <div style={{ fontSize: 11, color: 'var(--brand-600)', fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 2 }}>자세히 보기 <IcChevronRight size={11}/></div>}
      {/* confirmed counseling — editable by both student & teacher */}
      {isCounseling && ev.editable && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <Button variant="outline" size="sm" leading={<IcCalendar size={13}/>} onClick={(e) => { e.stopPropagation(); setRescheduleOpen(true); }}>시간 변경</Button>
        </div>
      )}
      {ev.type === 'teacher-proposal' && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); if (window.showToast) showToast('15:00 상담으로 확정했어요 · 선생님께 알림이 갔어요', 'success'); }}>15:00 수락</Button>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); if (window.showToast) showToast('16:00 상담으로 확정했어요 · 선생님께 알림이 갔어요', 'success'); }}>16:00 수락</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRescheduleOpen(true); }}>다른 시간 제안</Button>
        </div>
      )}
      {ev.type === 'counseling-request' && (
        <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--fg-muted)' }}>상대가 수락하면 일정이 확정되고 알림을 받아요.</div>
      )}
      {rescheduleOpen && <RescheduleDialog ev={ev} onClose={() => setRescheduleOpen(false)}/>}
    </Card>
  );
}

// Reschedule a counseling time — usable by both student & teacher.
function RescheduleDialog({ ev, onClose }) {
  const [date, setDate] = React.useState(typeof DATE_OPTIONS !== 'undefined' ? DATE_OPTIONS[2] : '2026-05-19');
  const [time, setTime] = React.useState((ev.time || '15:00').slice(0, 5));
  const trapRef = (typeof useFocusTrap !== 'undefined') ? useFocusTrap(true, onClose) : null;
  const Sel = typeof CalSelect !== 'undefined' ? CalSelect : null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="상담 시간 변경" style={{ position: 'relative', width: 400, maxWidth: '94%', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>상담 시간 변경</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 16 }} className="kr-heading">{ev.who ? `${ev.who}와의 ` : ''}상담 시간을 바꿔요. 변경하면 상대에게 알림이 가고, 상대가 확인하면 확정돼요.</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <FormField label="날짜" style={{ flex: 1, minWidth: 0 }}>
            {Sel ? <Sel value={date} onChange={setDate} options={DATE_OPTIONS} render={(d) => `${d.slice(5,7)}월 ${d.slice(8,10)}일`}/> : <TextInput value={date} onChange={setDate}/>}
          </FormField>
          <FormField label="시간" style={{ flex: 1, minWidth: 0 }}>
            {Sel ? <Sel value={time} onChange={setTime} options={TIME_OPTIONS}/> : <TextInput value={time} onChange={setTime}/>}
          </FormField>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full onClick={() => { if (window.showToast) showToast(`${date.slice(5,7)}/${date.slice(8,10)} ${time}로 변경 요청을 보냈어요`, 'success'); onClose(); }}>변경 요청 보내기</Button>
        </div>
      </div>
    </div>
  );
}

// Shared detail sheet for a teacher-sent memo/event.
// `forTeacher`: header reflects "내가 보낸 안내 · N명" vs "선생님이 보낸 안내".
function BroadcastDetailSheet({ open, ev, onClose, forTeacher }) {
  if (!open || !ev) return null;
  let recipientLabel = null;
  if (forTeacher && ev.bcId) {
    try {
      const bc = teacherBroadcastStore().find(b => b.id === ev.bcId);
      if (bc) recipientLabel = bc.targets.includes('all') ? '우리 반 전체' : `${bc.targets.length}명`;
    } catch (e) {}
  }
  return (
    <BottomSheet open={open} onClose={onClose} title={forTeacher ? '내가 보낸 안내' : '선생님이 보낸 안내'} maxHeight="70%">
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {eventChip(ev.type)}
          {forTeacher
            ? <Chip tone="brand" size="sm" leading={<IcUsers size={11}/>}>{recipientLabel || '전송됨'}</Chip>
            : <Chip tone="info" size="sm">담임 선생님</Chip>}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', wordBreak: 'keep-all' }} className="kr-heading">{ev.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'var(--fg-muted)', fontSize: 13 }}>
          <IcCalendar size={14}/> <span className="num">{ev.time}</span>
        </div>
        {ev.body && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.6, wordBreak: 'keep-all' }} className="kr-heading">{ev.body}</div>
        )}
        {forTeacher ? (
          <Button variant="secondary" size="lg" full style={{ marginTop: 16 }} onClick={onClose}>닫기</Button>
        ) : (
          <Button variant="primary" size="lg" full style={{ marginTop: 16 }} onClick={onClose}>확인했어요</Button>
        )}
      </div>
    </BottomSheet>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Counseling request (student)
// ────────────────────────────────────────────────────────
function CounselingRequest({ go }) {
  const [date, setDate] = React.useState('2026-05-22');
  const [time, setTime] = React.useState('15:00');
  const [why, setWhy] = React.useState('');
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="상담 요청" leading={<BackButton onClick={() => go('calendar')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        {/* AI draft generator */}
        <CounselingRequestDraft onUse={(draft) => setWhy(draft.body)}/>

        <SectionCard title="상담 대상" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name="담" size={44}/>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>담임 선생님</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>학급 담임 선생님께 상담을 요청해요</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="희망 일시" style={{ marginBottom: 12 }}>
          <FormField label="날짜" style={{ marginBottom: 12 }}>
            <TextInput value={date} onChange={setDate} placeholder="YYYY-MM-DD" leading={<IcCalendar size={14}/>}/>
          </FormField>
          <FormField label="시간대">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {['13:00', '14:00', '15:00', '16:00'].map(t => (
                <button key={t} onClick={() => setTime(t)} style={{
                  padding: '10px 4px', border: '1px solid',
                  borderColor: time === t ? 'var(--brand-500)' : 'var(--line-strong)',
                  background: time === t ? 'var(--brand-50)' : 'var(--bg-surface)',
                  color: time === t ? 'var(--brand-600)' : 'var(--fg-default)',
                  borderRadius: 10, fontSize: 13, fontWeight: time === t ? 700 : 500, cursor: 'pointer',
                }}>{t}</button>
              ))}
            </div>
          </FormField>
        </SectionCard>

        <SectionCard title="상담하고 싶은 내용" style={{ marginBottom: 12 }}>
          <Textarea value={why} onChange={setWhy} rows={why ? 12 : 5} placeholder="진로 방향, 성적 고민, 학습 어려움 등 자유롭게 적어주세요"/>
        </SectionCard>

        <div style={{ padding: 14, background: 'var(--brand-50)', borderRadius: 12, fontSize: 12, color: 'var(--brand-600)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
          선생님이 요청을 확인하면 알림으로 알려드려요. 시간이 안 맞으면 다른 시간을 제안할 수 있어요.
        </div>
        <Button variant="primary" size="lg" full disabled={!why.trim()} onClick={() => go('calendar')}>상담 요청 보내기</Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// TEACHER calendar (desktop)
// ────────────────────────────────────────────────────────
// 실연동 — /calendar/events (월별) + /counseling-requests (대기 요청). 수락/취소(사유)/시간변경(사유).
function TeacherCalendar({ openNotif }) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [events, setEvents] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [dialog, setDialog] = React.useState(null); // {kind, ...}
  const grid = buildMonth(month.y, month.m);
  const monthLabel = `${month.y}년 ${month.m + 1}월`;

  const loadEvents = React.useCallback(async () => {
    const from = new Date(month.y, month.m, 1).toISOString();
    const to = new Date(month.y, month.m + 1, 0, 23, 59, 59).toISOString();
    try { const r = await window.__apiFetch('/calendar/events?from=' + from + '&to=' + to, { method: 'GET' }); setEvents(r.data || []); }
    catch (e) { setEvents([]); }
  }, [month.y, month.m]);
  const loadRequests = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/counseling-requests', { method: 'GET' }); setRequests(r.data || []); }
    catch (e) { setRequests([]); }
  }, []);
  React.useEffect(() => { loadEvents(); }, [loadEvents]);
  React.useEffect(() => { loadRequests(); }, [loadRequests]);

  const byDate = {};
  events.forEach(e => { const k = dateKey(e.startsAt); (byDate[k] = byDate[k] || []).push(e); });
  const selectedEvents = byDate[selected] || [];
  const pending = requests.filter(r => r.status === 'pending');
  const fmtTime = (d) => new Date(d).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  const reload = () => { loadEvents(); loadRequests(); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar title="캘린더" subtitle="학생 상담 요청을 수락하고, 일정 변경·취소 시 학생에게 사유와 함께 알림이 가요" openNotif={openNotif}/>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', background: 'var(--bg-canvas)', minHeight: 0, padding: 24, gap: 16 }}>
        {/* Big calendar */}
        <Card padding={20} style={{ overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{monthLabel}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button variant="outline" size="sm" onClick={() => { setMonth({ y: today.getFullYear(), m: today.getMonth() }); setSelected(todayKey); }}>오늘</Button>
              <IconButton icon={<IcChevronLeft size={16}/>} onClick={() => setMonth(m => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 }))} ariaLabel="이전"/>
              <IconButton icon={<IcChevronRight size={16}/>} onClick={() => setMonth(m => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 }))} ariaLabel="다음"/>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 4 }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--brand-600)' : 'var(--fg-muted)', padding: '8px 6px' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '90px', gap: 4 }}>
            {grid.map((cell, i) => {
              if (!cell) return <div key={i}/>;
              const evs = byDate[cell.key] || [];
              const isSelected = selected === cell.key;
              const isToday = cell.key === todayKey;
              return (
                <button key={i} onClick={() => setSelected(cell.key)} style={{
                  border: 'none', cursor: 'pointer', textAlign: 'left', padding: 6,
                  background: isSelected ? 'var(--brand-50)' : 'var(--bg-muted)', borderRadius: 8,
                  display: 'flex', flexDirection: 'column', gap: 3,
                  outline: isSelected ? '2px solid var(--brand-500)' : 'none', outlineOffset: -2,
                }}>
                  <span className="num" style={{ fontSize: 13, fontWeight: 700, color: isToday ? 'var(--brand-600)' : (i % 7 === 0 ? 'var(--danger)' : 'var(--fg-strong)') }}>{cell.day}{isToday && <span style={{ marginLeft: 4, fontSize: 9, color: 'var(--brand-600)' }}>오늘</span>}</span>
                  {evs.slice(0, 2).map((e, k) => (
                    <div key={k} style={{ background: 'var(--bg-surface)', color: 'var(--fg-default)', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, borderLeft: `2px solid ${CAT_COLOR[e.category] || 'var(--fg-subtle)'}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{e.title}</div>
                  ))}
                  {evs.length > 2 && <div style={{ fontSize: 9, color: 'var(--fg-muted)', paddingLeft: 4 }}>+{evs.length - 2}</div>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Sidebar */}
        <Card padding={20} style={{ overflow: 'auto' }}>
          <div className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{selected.slice(5, 7)}월 {selected.slice(8, 10)}일</div>
          <div style={{ height: 1, background: 'var(--line-subtle)', margin: '14px 0' }}/>
          {selectedEvents.length === 0 ? (
            <EmptyState icon={<IcCalendar size={20}/>} title="일정 없음" body="이 날 등록된 일정이 없어요."/>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedEvents.map((e) => {
                const isCounsel = e.category === 'counseling';
                return (
                  <div key={e.id} style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, borderLeft: `3px solid ${CAT_COLOR[e.category] || 'var(--fg-subtle)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</div>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>{fmtTime(e.startsAt)}</span>
                    </div>
                    {e.notes && <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>{e.notes}</div>}
                    {isCounsel && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                        <Button variant="outline" size="sm" leading={<IcCalendar size={13}/>} onClick={() => setDialog({ kind: 'reschedule', ev: e })}>시간 변경</Button>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} leading={<IcTrash size={13}/>} onClick={() => setDialog({ kind: 'cancel', ev: e })}>취소</Button>
                      </div>
                    )}
                    {!isCounsel && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--fg-muted)' }} leading={<IcTrash size={13}/>} onClick={() => setDialog({ kind: 'cancel', ev: e })}>삭제</Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 대기 중인 상담 요청 (실데이터) */}
          <div style={{ marginTop: 24, paddingTop: 14, borderTop: '1px solid var(--line-subtle)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 10 }}>대기 중인 상담 요청 {pending.length}</div>
            {pending.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>새 상담 요청이 오면 여기에 표시돼요.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pending.map((r) => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: '1px solid var(--line-subtle)', borderRadius: 8 }}>
                    <Avatar name={(r.student?.name || '?')[0]} size={28}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student?.name} <span style={{ fontWeight: 500, color: 'var(--fg-muted)' }}>· {r.topic}</span></div>
                      {r.note && <div style={{ fontSize: 10, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.note}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <Button variant="primary" size="sm" onClick={() => setDialog({ kind: 'accept', req: r })}>수락</Button>
                      <Button variant="ghost" size="sm" style={{ color: 'var(--fg-muted)' }} onClick={() => setDialog({ kind: 'decline', req: r })}>거절</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
      {dialog && <CounselActionDialog dialog={dialog} selectedDate={selected} onClose={() => setDialog(null)} onDone={() => { setDialog(null); reload(); }}/>}
    </div>
  );
}

// 상담 수락(시각 선택)/거절(사유)/취소(사유)/시간변경(사유) 통합 다이얼로그
function CounselActionDialog({ dialog, selectedDate, onClose, onDone }) {
  const { kind, req, ev } = dialog;
  const defaultDT = (() => {
    const base = ev ? new Date(ev.startsAt) : new Date(selectedDate + 'T15:00:00');
    const p = (n) => String(n).padStart(2, '0');
    return `${base.getFullYear()}-${p(base.getMonth()+1)}-${p(base.getDate())}T${p(base.getHours())}:${p(base.getMinutes())}`;
  })();
  const [dt, setDt] = React.useState(defaultDT);
  const [reason, setReason] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const titles = { accept: '상담 수락 · 시간 확정', decline: '상담 요청 거절', cancel: '일정 취소', reschedule: '상담 시간 변경' };
  const needsTime = kind === 'accept' || kind === 'reschedule';
  const needsReason = kind === 'decline' || kind === 'cancel' || kind === 'reschedule';
  const reasonRequired = kind === 'cancel' || kind === 'decline';

  const submit = async () => {
    setErr('');
    if (needsReason && reasonRequired && !reason.trim()) { setErr('학생에게 전달할 사유를 적어주세요.'); return; }
    setBusy(true);
    try {
      if (kind === 'accept') {
        await window.__apiFetch('/counseling-requests/' + req.id + '/accept', { method: 'POST', body: JSON.stringify({ at: new Date(dt).toISOString(), note: reason.trim() || undefined }) });
      } else if (kind === 'decline') {
        await window.__apiFetch('/counseling-requests/' + req.id + '/decline', { method: 'POST', body: JSON.stringify({ note: reason.trim() }) });
      } else if (kind === 'cancel') {
        await window.__apiFetch('/calendar/events/' + ev.id, { method: 'DELETE', body: JSON.stringify({ reason: reason.trim() }) });
      } else if (kind === 'reschedule') {
        await window.__apiFetch('/calendar/events/' + ev.id, { method: 'PATCH', body: JSON.stringify({ startsAt: new Date(dt).toISOString(), reason: reason.trim() || undefined }) });
      }
      onDone();
    } catch (e) {
      setErr((e && e.body && e.body.message) || '처리에 실패했어요. 잠시 후 다시 시도해주세요.');
      setBusy(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-elevated)', borderRadius: 16, padding: 22, width: 'min(440px, 100%)', boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 6 }}>{titles[kind]}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16 }}>
          {kind === 'accept' && `${req.student?.name} 학생 · ${req.topic} — 시간을 확정하면 학생 캘린더에도 추가되고 알림이 가요.`}
          {kind === 'decline' && `${req.student?.name} 학생의 요청을 보류해요. 사유는 학생에게 전달돼요.`}
          {kind === 'cancel' && `이 일정을 취소해요.${ev.category === 'counseling' ? ' 학생 캘린더에서도 삭제되고 사유 알림이 가요.' : ''}`}
          {kind === 'reschedule' && '바뀐 시간이 학생 캘린더에 반영되고 사유와 함께 알림이 가요.'}
        </div>
        {needsTime && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 6 }}>{kind === 'accept' ? '확정 시간' : '변경할 시간'}</div>
            <input type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line-strong)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }}/>
          </div>
        )}
        {needsReason && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 6 }}>학생에게 전달할 사유 {reasonRequired ? '' : '(선택)'}</div>
            <Textarea value={reason} onChange={setReason} rows={3} placeholder={kind === 'cancel' ? '예) 학생 조퇴로 상담을 취소합니다.' : kind === 'reschedule' ? '예) 회의 일정이 겹쳐 시간을 옮겼어요.' : '예) 이번 주는 일정이 어려워요. 다음 주에 다시 잡아요.'}/>
          </div>
        )}
        {err && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="md" onClick={onClose}>닫기</Button>
          <Button variant={kind === 'cancel' || kind === 'decline' ? 'danger' : 'primary'} size="md" disabled={busy} onClick={submit}>
            {busy ? '처리 중…' : (kind === 'accept' ? '확정' : kind === 'decline' ? '거절' : kind === 'cancel' ? '취소하기' : '변경')}
          </Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  StudentCalendar, TeacherCalendar, CounselingRequest, CAL_EVENTS, eventColor, eventChip,
  buildMonth, EventCard, WeekStudyPanel, AddEventSheet, ROSTER_CALENDARS, BroadcastDetailSheet,
  CalSelect, DATE_OPTIONS, TIME_OPTIONS,
});
