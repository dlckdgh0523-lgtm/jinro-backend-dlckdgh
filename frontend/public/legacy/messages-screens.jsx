// messages-screens.jsx — Student & teacher messaging + memo flows

const messageKindChip = (k) => ({
  memo: <Chip tone="purple" size="sm">상담 메모</Chip>,
  appointment: <Chip tone="warning" size="sm">상담 예약</Chip>,
  normal: null,
  feedback: <Chip tone="info" size="sm">학습 피드백</Chip>,
  admissions: <Chip tone="brand" size="sm">입시 안내</Chip>,
}[k]);

// ────────────────────────────────────────────────────────
// STUDENT: Messages list + thread
// ────────────────────────────────────────────────────────
// 실 API — /v1/messages/threads · /contacts · ?with= · POST
function StudentMessages({ go }) {
  const [selected, setSelected] = React.useState(null); // { otherId, otherName }
  const [threads, setThreads] = React.useState(null);
  const [contacts, setContacts] = React.useState([]);
  const [showNew, setShowNew] = React.useState(false);
  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/messages/threads', { method: 'GET' }); setThreads(r.data || []); } catch (e) { setThreads([]); }
    try { const c = await window.__apiFetch('/messages/contacts', { method: 'GET' }); setContacts(c.data || []); } catch (e) { setContacts([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  if (selected) return <RealMessageThread go={() => { setSelected(null); load(); }} other={selected}/>;

  const fmt = (d) => { const dt = new Date(d); return dt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) + ' ' + dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); };
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="메시지" leading={<BackButton onClick={() => go('dashboard')}/>}
        trailing={<button onClick={() => setShowNew(s => !s)} style={{ border: 'none', background: 'transparent', color: 'var(--brand-600)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>새 대화</button>}/>
      {showNew && (
        <div style={{ padding: '0 16px 8px' }}>
          <Card padding={8}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', padding: '6px 8px' }}>대화 상대 선택</div>
            {contacts.length === 0 ? <div style={{ padding: 12, fontSize: 13, color: 'var(--fg-muted)' }}>연결된 선생님이 없어요. (같은 학교·반 교사와 대화할 수 있어요)</div>
              : contacts.map(c => (
                <div key={c.id} onClick={() => { setShowNew(false); setSelected({ otherId: c.id, otherName: c.name }); }} style={{ display: 'flex', gap: 10, padding: '10px 8px', cursor: 'pointer', alignItems: 'center' }}>
                  <Avatar name={c.name.slice(0,1)} size={36}/>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{c.name}</div><div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{[c.school, c.classroom].filter(Boolean).join(' ')}</div></div>
                </div>
              ))}
          </Card>
        </div>
      )}
      <div style={{ padding: '0 16px' }}>
        {threads === null ? <Card padding={14}><Skeleton height={48}/></Card>
          : threads.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcMessage size={24}/>} title="아직 주고받은 메시지가 없어요" body="‘새 대화’로 선생님에게 메시지를 보내보세요." action={<Button variant="primary" size="md" onClick={() => setShowNew(true)}>새 대화 시작</Button>}/></Card>
        ) : (
        <Card padding={0}>
          {threads.map((t, i, arr) => (
            <div key={t.otherId} onClick={() => setSelected({ otherId: t.otherId, otherName: t.otherName })} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', background: t.unread ? 'rgba(49,130,246,0.025)' : 'transparent',
            }}>
              <Avatar name={t.otherName.slice(0,1)} size={44}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.otherName}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{fmt(t.lastAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: t.unread ? 'var(--fg-strong)' : 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: t.unread ? 600 : 400 }} className="kr-heading">{t.lastBody}</span>
                  {t.unread > 0 && <span style={{ background: 'var(--brand-500)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '0 6px', height: 18, minWidth: 18, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </Card>
        )}
      </div>
    </div>
  );
}

function RealMessageThread({ go, other }) {
  const [input, setInput] = React.useState('');
  const [msgs, setMsgs] = React.useState(null);
  const scrollRef = React.useRef(null);
  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/messages?with=' + encodeURIComponent(other.otherId), { method: 'GET' }); setMsgs(r.data || []); }
    catch (e) { setMsgs([]); }
  }, [other.otherId]);
  React.useEffect(() => { load(); }, [load]);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs]);
  const send = async () => {
    if (!input.trim()) return;
    const body = input.trim(); setInput('');
    try { await window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: other.otherId, body }) }); load(); }
    catch (e) { alert((e && e.body && e.body.message) || '메시지 전송에 실패했어요.'); setInput(body); }
  };
  const fmtT = (d) => new Date(d).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#EAF0F6' }}>
      <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BackButton onClick={go}/>
          <Avatar name={other.otherName.slice(0,1)} size={32}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{other.otherName}</div>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs === null ? <Skeleton height={40}/> : msgs.length === 0 ? <DateDivider text="첫 메시지를 보내보세요"/> : msgs.map((m) => <MessageBubble key={m.id} side={m.mine ? 'me' : 'peer'} name={other.otherName} body={m.body} time={fmtT(m.createdAt)}/>)}
      </div>
      <div style={{ padding: '8px 12px 12px', background: 'var(--bg-surface)', borderTop: '1px solid var(--line-subtle)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--bg-muted)', borderRadius: 24, padding: '6px 6px 6px 16px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="메시지를 입력하세요" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, minWidth: 0 }}/>
          <button onClick={send} disabled={!input.trim()} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: input.trim() ? 'var(--brand-500)' : 'var(--line-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed' }}>
            <IcSend size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ side, name, body, time, kind, privateMemo, onBooking }) {
  const isMe = side === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 6, alignItems: 'flex-end' }}>
      {!isMe && <Avatar name={name?.slice(0,1) || '이'} size={28}/>}
      <div style={{ maxWidth: '76%' }}>
        {(kind || privateMemo) && <div style={{ marginBottom: 4, display: 'flex', gap: 4, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>{messageKindChip(kind)}{privateMemo && <Chip tone="neutral" size="sm" leading={<IcLock size={10}/>}>비공개</Chip>}</div>}
        <div style={{
          padding: '10px 14px',
          background: privateMemo ? 'var(--neutral-bg)' : (isMe ? 'var(--brand-500)' : 'var(--bg-surface)'),
          color: privateMemo ? 'var(--fg-default)' : (isMe ? '#fff' : 'var(--fg-strong)'),
          border: privateMemo ? '1px dashed var(--line-strong)' : 'none',
          borderRadius: isMe ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          fontSize: 14, lineHeight: 1.5,
          boxShadow: isMe && !privateMemo ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
        }} className="kr-heading">{body}</div>
        {onBooking && (
          <button onClick={onBooking} style={{ marginTop: 6, border: '1px solid var(--line-strong)', background: 'var(--bg-surface)', borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IcCalendar size={13}/> 상담 시간 보기·변경
          </button>
        )}
        <div style={{ fontSize: 10, color: 'var(--fg-subtle)', marginTop: 2, textAlign: isMe ? 'right' : 'left' }}>{privateMemo ? '나만 보임 · ' : ''}{time}</div>
      </div>
    </div>
  );
}

function DateDivider({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <span style={{ fontSize: 11, color: 'var(--fg-subtle)', padding: '4px 10px', background: 'rgba(0,0,0,0.04)', borderRadius: 999 }}>{text}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// TEACHER: Messages list + composer (real chat)
// ────────────────────────────────────────────────────────
function TeacherMessages({ openNotif, go }) {
  const isMobile = useViewportMobile();
  const [threads, setThreads] = React.useState(null); // null = loading
  const [selected, setSelectedRaw] = React.useState(null); // { otherId, otherName }
  const [msgs, setMsgs] = React.useState(null); // null = loading thread
  const [composing, setComposing] = React.useState(false);
  const [booking, setBooking] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [input, setInput] = React.useState('');
  const [cat, setCat] = React.useState('normal');
  const [memoPublic, setMemoPublic] = React.useState(true);
  const scrollRef = React.useRef(null);

  const loadThreads = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/messages/threads', { method: 'GET' }); setThreads(r.data || []); }
    catch (e) { setThreads([]); }
  }, []);
  React.useEffect(() => { loadThreads(); }, [loadThreads]);

  const loadMsgs = React.useCallback(async (otherId) => {
    if (!otherId) return;
    try { const r = await window.__apiFetch('/messages?with=' + encodeURIComponent(otherId), { method: 'GET' }); setMsgs(r.data || []); }
    catch (e) { setMsgs([]); }
  }, []);
  React.useEffect(() => { if (selected) loadMsgs(selected.otherId); }, [selected, loadMsgs]);

  const unreadTotal = (threads || []).reduce((s, t) => s + (t.unread || 0), 0);
  const setSelected = (t) => {
    setThreads(ts => (ts || []).map(x => x.otherId === t.otherId ? { ...x, unread: 0 } : x));
    setSelectedRaw({ otherId: t.otherId, otherName: t.otherName });
    setMsgs(null);
    setCat('normal'); setInput('');
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, selected]);
  const visible = (threads || [])
    .filter(t => filter === 'all' || t.unread > 0)
    .filter(t => (t.otherName || '').includes(search));

  const fmtTime = (d) => { if (!d) return ''; const dt = new Date(d); return dt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) + ' ' + dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); };

  const send = async () => {
    if (!input.trim() || !selected) return;
    const isPrivateMemo = cat === 'memo' && !memoPublic;
    const body = input.trim(); setInput('');
    try {
      await window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: selected.otherId, body }) });
      showToast(isPrivateMemo ? '비공개 메모로 저장했어요 (학생에게 전송 안 됨)' : (cat === 'memo' ? '상담 메모를 보냈어요' : '메시지를 보냈어요'), isPrivateMemo ? 'info' : 'success');
      setCat('normal');
      loadMsgs(selected.otherId); loadThreads();
    } catch (e) {
      alert((e && e.body && e.body.message) || '메시지 전송에 실패했어요.'); setInput(body);
    }
  };
  const TONE_BG = { info: 'var(--brand-500)', brand: 'var(--brand-600)', purple: 'var(--accent-purple)', mint: 'var(--accent-mint)', warning: 'var(--warning)' };
  const catChip = (id, label, tone) => {
    const on = cat === id;
    return (
      <button key={id} onClick={() => setCat(id)} style={{
        border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: on ? TONE_BG[tone] : 'var(--bg-muted)',
        color: on ? '#fff' : 'var(--fg-muted)',
        boxShadow: on ? '0 2px 6px rgba(17,24,39,0.12)' : 'none',
      }}>{on && <IcCheck size={12}/>}{label}</button>
    );
  };
  const book = async (date, time, place) => {
    if (!selected) return;
    const label = `${date.slice(5,7)}월 ${date.slice(8,10)}일 ${time}`;
    const body = `상담 예약: ${label}${place ? ` · ${place}` : ''}`;
    try {
      await window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: selected.otherId, body }) });
      showToast(`${selected.otherName} 학생과 ${label} 상담을 예약했어요 · 채팅에 반영됐어요`, 'success');
      loadMsgs(selected.otherId); loadThreads();
    } catch (e) {
      alert((e && e.body && e.body.message) || '상담 예약 메시지 전송에 실패했어요.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TeacherTopbar
        help="teacher-messages"
        title="메시지"
        subtitle="학생과 1:1 메시지·메모·상담 예약을 한 곳에서 관리해요"
        openNotif={openNotif}
        action={<Button variant="primary" size="sm" leading={<IcPlus size={14}/>} onClick={() => setComposing(true)}>새 메시지</Button>}
      />
      <div style={{ flex: 1, display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '320px 1fr', background: 'var(--bg-canvas)', minHeight: 0 }}>
        {/* Thread list — 모바일에선 대화 선택 전에만 표시 */}
        <div style={{
          display: isMobile && selected ? 'none' : 'block',
          borderRight: isMobile ? 'none' : '1px solid var(--line-subtle)',
          background: 'var(--bg-surface)', overflow: 'auto',
          flex: isMobile ? 1 : 'initial',
        }} className="toss-scroll">
          <div style={{ padding: '14px 16px 8px' }}>
            <TextInput value={search} onChange={setSearch} placeholder="학생 이름으로 검색" leading={<IcSearch size={16}/>} style={{ height: 40 }}/>
          </div>
          <div style={{ padding: '4px 8px 0', display: 'flex', gap: 4 }}>
            <Tabs items={[{id:'all',label:`전체 ${(threads || []).length}`},{id:'unread',label:`안 읽음 ${unreadTotal}`}]} activeId={filter} onChange={setFilter}/>
          </div>
          <div>
            {threads === null ? (
              <div style={{ padding: '16px' }}><Skeleton height={56}/></div>
            ) : threads.length === 0 ? (
              <div style={{ padding: '32px 16px' }}><EmptyState icon={<IcMessage size={22}/>} title="아직 메시지가 없어요" body="학생이 보낸 메시지가 여기에 표시돼요."/></div>
            ) : visible.length === 0 ? (
              <div style={{ padding: '32px 16px' }}><EmptyState icon={<IcMessage size={22}/>} title={filter === 'unread' ? '안 읽은 메시지가 없어요' : '검색 결과가 없어요'}/></div>
            ) : visible.map(t => {
              const active = selected && selected.otherId === t.otherId;
              return (
                <div key={t.otherId} onClick={() => setSelected(t)} style={{
                  display: 'flex', gap: 12, padding: '12px 16px',
                  background: active ? 'var(--brand-50)' : (t.unread ? 'rgba(49,130,246,0.025)' : 'transparent'),
                  borderLeft: active ? '3px solid var(--brand-500)' : '3px solid transparent',
                  cursor: 'pointer',
                }}>
                  <Avatar name={(t.otherName || '').slice(0,1)} size={40}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.otherName}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {t.unread > 0 && <span style={{ background: 'var(--brand-500)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '0 5px', height: 16, minWidth: 16, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>}
                        <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{fmtTime(t.lastAt)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: t.unread ? 'var(--fg-default)' : 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: t.unread ? 600 : 400 }} className="kr-heading">{t.lastBody}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Detail — 모바일에선 대화 선택했을 때만 표시 (목록은 위에서 숨김) */}
        {!selected ? (
          // 데스크톱에서만 안내 placeholder. 모바일에선 목록이 그 자리에 있으므로 표시 안 함.
          !isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, background: '#EAF0F6' }}>
              <EmptyState icon={<IcMessage size={24}/>} title="대화를 선택해주세요" body="왼쪽 목록에서 학생을 선택하면 대화가 열려요."/>
            </div>
          )
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: isMobile ? 1 : 'initial' }}>
          <div style={{ padding: isMobile ? '12px 14px' : '14px 24px', borderBottom: '1px solid var(--line-subtle)', background: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {isMobile && (
              <button onClick={() => setSelectedRaw(null)} aria-label="목록으로" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 6px 4px 0', display: 'flex', alignItems: 'center' }}>
                <IcChevronLeft size={20} color="var(--fg-strong)"/>
              </button>
            )}
            <button onClick={() => go && go('student-detail')} style={{ display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'transparent', cursor: go ? 'pointer' : 'default', padding: 0, textAlign: 'left', minWidth: 0, flex: 1 }}>
              <Avatar name={(selected.otherName || '').slice(0,1)} size={36}/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', display: 'flex', alignItems: 'center', gap: 4 }}>{selected.otherName}<IcChevronRight size={14} color="var(--fg-subtle)"/></div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>프로필 보기</div>
              </div>
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="outline" size="sm" leading={<IcDoc size={14}/>} onClick={() => go && go('student-detail')}>학생 페이지</Button>
              <Button variant="outline" size="sm" leading={<IcCalendar size={14}/>} onClick={() => setBooking(true)}>상담 예약</Button>
            </div>
          </div>
          <div ref={scrollRef} className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8, background: '#EAF0F6' }}>
            {msgs === null ? <Skeleton height={40}/>
              : msgs.length === 0 ? <DateDivider text="첫 메시지를 보내보세요"/>
              : msgs.map((m) => (
                <MessageBubble key={m.id} side={m.mine ? 'me' : 'peer'} name={(selected.otherName || '').slice(0,1)} body={m.body}
                  time={new Date(m.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}/>
              ))}
          </div>
          <div style={{ padding: 16, background: 'var(--bg-surface)', borderTop: '1px solid var(--line-subtle)' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', marginRight: 2 }}>유형</span>
              {catChip('normal', '일반 메시지', 'info')}
              {catChip('memo', '상담 메모', 'purple')}
              {catChip('feedback', '학습 피드백', 'brand')}
              {catChip('admissions', '입시 안내', 'mint')}
              <button onClick={() => setBooking(true)} style={{ border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'var(--warning-bg)', color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <IcCalendar size={12}/> 상담 예약하기
              </button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginBottom: 8 }}>
              지금 <strong style={{ color: ({ normal: 'var(--brand-600)', memo: 'var(--accent-purple)', feedback: 'var(--brand-600)', admissions: 'var(--accent-mint)' })[cat] }}>{({ normal: '일반 메시지', memo: '상담 메모', feedback: '학습 피드백', admissions: '입시 안내' })[cat]}</strong> 유형으로 보내요</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: 'var(--bg-muted)', borderRadius: 18, padding: '8px 8px 8px 16px' }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1} placeholder={`${selected.otherName} 학생에게 ${cat === 'memo' ? '메모를' : '메시지를'} 입력하세요`}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', resize: 'none', fontSize: 14, fontFamily: 'inherit', lineHeight: 1.5, color: 'var(--fg-strong)', maxHeight: 80, paddingTop: 7 }}/>
              <button onClick={send} disabled={!input.trim()} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: input.trim() ? 'var(--brand-500)' : 'var(--line-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', flexShrink: 0 }}><IcSend size={16}/></button>
            </div>
            {cat === 'memo' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12.5, color: 'var(--fg-default)', cursor: 'pointer' }}>
                <input type="checkbox" checked={memoPublic} onChange={(e) => setMemoPublic(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}/>
                <span style={{ fontWeight: 600 }}>학생에게 공개</span>
                <span style={{ color: memoPublic ? 'var(--success)' : 'var(--fg-muted)' }}>{memoPublic ? '· 학생에게 전송돼요' : '· 비공개, 학생에게 전송되지 않아요'}</span>
              </label>
            )}
          </div>
        </div>
        )}
      </div>
      {composing && <ComposeOverlay onClose={() => setComposing(false)} onSent={loadThreads}/>}
      {booking && <CounselingBookingDialog student={selected} onClose={() => setBooking(false)} onBook={book}/>}
    </div>
  );
}

// Teacher books a counseling slot with a pre-selected student (mirrors reservation page).
function CounselingBookingDialog({ student, onClose, onBook }) {
  const [date, setDate] = React.useState(typeof DATE_OPTIONS !== 'undefined' ? DATE_OPTIONS[2] : '2026-05-19');
  const [time, setTime] = React.useState('15:00');
  const [place, setPlace] = React.useState('2-3 교실');
  const [memo, setMemo] = React.useState('');
  const trapRef = useFocusTrap(true, onClose);
  const Sel = typeof CalSelect !== 'undefined' ? CalSelect : null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="상담 예약" style={{ position: 'relative', width: 460, maxWidth: '94%', maxHeight: '92%', overflow: 'auto', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>상담 예약</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        {/* student is pre-selected */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--brand-50)', borderRadius: 12, marginBottom: 16 }}>
          <Avatar name={student.avatar || student.peer?.[0] || student.name?.[0] || student.otherName?.[0]} size={40}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{student.peer || student.name || student.otherName}</div>
            <div style={{ fontSize: 12, color: 'var(--brand-600)' }}>{student.grade ? `${student.grade}반 · ` : ''}상담 대상</div>
          </div>
          <Chip tone="brand" size="sm">선택됨</Chip>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <FormField label="날짜" style={{ flex: 1, minWidth: 0 }}>
            {Sel ? <Sel value={date} onChange={setDate} options={DATE_OPTIONS} render={(d) => `${d.slice(5,7)}월 ${d.slice(8,10)}일`}/> : <TextInput value={date} onChange={setDate}/>}
          </FormField>
          <FormField label="시간" style={{ flex: 1, minWidth: 0 }}>
            {Sel ? <Sel value={time} onChange={setTime} options={TIME_OPTIONS}/> : <TextInput value={time} onChange={setTime}/>}
          </FormField>
        </div>
        <FormField label="장소" style={{ marginBottom: 14 }}>
          <TextInput value={place} onChange={setPlace} placeholder="예) 2-3 교실 / 상담실"/>
        </FormField>
        <FormField label="안내 메모 (선택)" style={{ marginBottom: 18 }}>
          <Textarea value={memo} onChange={setMemo} rows={3} placeholder="상담 전 준비할 내용을 적어주세요"/>
        </FormField>
        <div style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 16 }} className="kr-heading">
          예약하면 <strong style={{ color: 'var(--fg-strong)' }}>{student.peer || student.name || student.otherName}</strong> 학생의 캘린더에 일정이 추가되고, 양측에 알림이 가요. 시간은 학생·교사 모두 나중에 변경할 수 있어요.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full onClick={() => { if (onBook) { onBook(date, time, place); } else { showToast(`${student.peer || student.name || student.otherName} 학생과 ${date.slice(5,7)}/${date.slice(8,10)} ${time} 상담을 예약했어요`, 'success'); } onClose(); }}>예약하고 알림 보내기</Button>
        </div>
      </div>
    </div>
  );
}

function ComposeOverlay({ onClose, onSent }) {
  const [target, setTarget] = React.useState('individual');
  const [picked, setPicked] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [body, setBody] = React.useState('');
  const [contacts, setContacts] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const trapRef = useFocusTrap(true, onClose);
  React.useEffect(() => {
    let alive = true;
    (async () => { try { const r = await window.__apiFetch('/messages/contacts', { method: 'GET' }); if (alive) setContacts((r && r.data) || []); } catch (e) {} })();
    return () => { alive = false; };
  }, []);
  const students = contacts.filter(c => c.role === 'student');
  const roster = students.filter(s => (s.name || '').includes(q));
  const canSend = body.trim() && (target === 'all' ? students.length > 0 : !!picked) && !busy;
  const doSend = async () => {
    if (!canSend) return; setBusy(true);
    try {
      const targets = target === 'all' ? students : [picked];
      for (const t of targets) {
        await window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: t.id, body: body.trim() }) });
      }
      showToast(target === 'all' ? `학급 전체(${students.length}명)에게 보냈어요` : `${picked.name} 학생에게 보냈어요`, 'success');
      onSent && onSent(); onClose();
    } catch (e) { showToast((e && e.body && e.body.message) || '전송하지 못했어요', 'error'); }
    finally { setBusy(false); }
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.45)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="새 메시지" style={{ position: 'relative', width: 560, maxWidth: '94%', maxHeight: '90%', overflow: 'auto', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>새 메시지</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose}/>
        </div>
        <FormField label="받는 사람" style={{ marginBottom: 14 }}>
          <Tabs items={[{id:'all',label:`학급 전체 (${students.length}명)`},{id:'individual',label:'학생 1명'}]} activeId={target} onChange={(v) => { setTarget(v); setPicked(null); }}/>
        </FormField>
        {target === 'individual' && (
          <FormField label="학생 선택" style={{ marginBottom: 14 }}>
            <TextInput value={q} onChange={setQ} placeholder="학생 이름 검색" leading={<IcSearch size={16}/>} style={{ marginBottom: 8 }}/>
            <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid var(--line-subtle)', borderRadius: 12 }} className="toss-scroll">
              {roster.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>학생을 찾을 수 없어요</div>
              ) : roster.map((s, i) => (
                <button key={s.id} onClick={() => setPicked(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  borderBottom: i < roster.length-1 ? '1px solid var(--line-subtle)' : 'none',
                  background: picked && picked.id === s.id ? 'var(--brand-50)' : 'transparent',
                }}>
                  <Avatar name={s.name[0]} size={32}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.classroom || s.school || '학생'}</div>
                  </div>
                  {picked && picked.id === s.id && <IcCheckCircle size={18} color="var(--brand-500)"/>}
                </button>
              ))}
            </div>
          </FormField>
        )}
        <FormField label="카테고리" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Chip tone="info">일반 메시지</Chip>
            <Chip tone="purple">상담 메모</Chip>
            <Chip tone="warning">상담 예약</Chip>
            <Chip tone="brand">학습 피드백</Chip>
            <Chip tone="mint">입시 안내</Chip>
          </div>
        </FormField>
        <FormField label="내용" required>
          <Textarea value={body} onChange={setBody} rows={5} placeholder={target === 'all' ? '학급 전체에게 보낼 내용' : (picked ? `${picked.name} 학생에게 전할 내용` : '먼저 학생을 선택하세요')}/>
        </FormField>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full trailing={<IcSend size={14}/>} disabled={!canSend} onClick={doSend}>{busy ? '보내는 중…' : '보내기'}</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  StudentMessages, TeacherMessages, ComposeOverlay, CounselingBookingDialog,
  MessageBubble, DateDivider,
});
