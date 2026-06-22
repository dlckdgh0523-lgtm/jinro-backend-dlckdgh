// teacher-mobile.jsx — Mobile versions of every teacher screen.
// Same content/data as desktop but condensed into phone-width layouts.

const TEACHER_MOBILE_NAV_FULL = [
  { id: 'dashboard', label: '홈', icon: <IcHome/> },
  { id: 'students', label: '학생', icon: <IcUsers/> },
  { id: 'completion', label: '학습', icon: <IcCheck/> },
  { id: 'messages', label: '메시지', icon: <IcMessage/> },
  { id: 'more', label: '더보기', icon: <IcMore/> },
];

// ────────────────────────────────────────────────────────
// Mobile teacher header
// ────────────────────────────────────────────────────────
function TMHeader({ title, leading, trailing, subtitle, help }) {
  return (
    <ScreenHeader title={title} subtitle={subtitle} leading={leading} trailing={trailing} help={help}/>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Classroom (invite code + capacity)
// ────────────────────────────────────────────────────────
function TMClassroom({ go }) {
  const { rows, meta, loading } = useTeacherRoster();
  const count = meta?.count ?? rows.length;
  const classroomLabel = [meta?.school, meta?.classroom].filter(Boolean).join(' ') || '우리 학급';
  const recent = rows
    .filter(s => s.lastActivityAt)
    .sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt))
    .slice(0, 5);
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader help="teacher-classroom" title="우리 학급" subtitle={`${classroomLabel} · ${loading ? '…' : count}/30명`} leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        {/* Invite code */}
        <Card padding={24} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff' }}>
          <Chip tone="info" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginBottom: 12 }}>학급 초대코드</Chip>
          <div className="num" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '5px' }}>H8K4 9P</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 8 }} className="kr-heading">
            학생이 회원가입 시 이 코드를 입력하면 자동으로 학급에 참여돼요.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button variant="primary" size="md" leading={<IcCopy size={14}/>} style={{ flex: 1, background: '#fff', color: 'var(--brand-600)' }} onClick={() => copyToast('H8K49P', '초대코드를 복사했어요')}>
              코드 복사
            </Button>
            <Button variant="ghost" size="md" leading={<IcRefresh size={14}/>} style={{ flex: 1, background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
              재발급
            </Button>
          </div>
        </Card>

        {/* Capacity ring */}
        <Card padding={20} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10, fontWeight: 600 }}>학급 정원</div>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 12px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#E5E8EB" strokeWidth="10"/>
              <circle cx="70" cy="70" r="60" fill="none" stroke="#3182F6" strokeWidth="10"
                strokeDasharray={`${(Math.min(count, 30)/30) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                strokeLinecap="round" transform="rotate(-90 70 70)"/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="num" style={{ fontSize: 32, fontWeight: 800, color: 'var(--fg-strong)' }}>{loading ? '–' : count}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>/30명</div>
            </div>
          </div>
          <div style={{ padding: 12, background: 'var(--brand-50)', borderRadius: 10, fontSize: 11, color: 'var(--brand-600)', textAlign: 'center' }} className="kr-heading">
            {loading ? '…' : `${Math.max(0, 30 - count)}자리 남았어요.`} 무료 체험 중에는 초대코드를 사용할 수 있어요.
          </div>
        </Card>

        {/* Recent joins */}
        <SectionCard title="최근 참여" action={<Button variant="ghost" size="sm" onClick={() => go('students')} trailing={<IcChevronRight size={14}/>}>전체</Button>}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[0,1,2].map(i => <Skeleton key={i} height={48} radius={10}/>)}</div>
          ) : recent.length === 0 ? (
            <EmptyState icon={<IcUsers size={22}/>} title="아직 참여한 학생이 없어요" body="학급 초대코드를 공유해 첫 학생을 초대해보세요."/>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(s => (
              <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
                <Avatar name={(s.name || '?').slice(0,1)} size={36}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{fmtActivity(s.lastActivityAt)} 활동</div>
                </div>
                <IcChevronRight size={14} color="var(--fg-subtle)"/>
              </div>
            ))}
          </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Students list
// ────────────────────────────────────────────────────────
function TMStudents({ go }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const { rows, meta, loading, error, refetch } = useTeacherRoster();
  const classroomLabel = [meta?.school, meta?.classroom].filter(Boolean).join(' ') || '우리 학급';
  const needsCount = rows.filter(s => s.needsCounseling).length;
  const aiCount = rows.filter(s => (s.aiProgress || 0) > 0).length;
  const ungradedCount = rows.filter(s => s.gradeAverage == null).length;
  const filtered = rows.filter(s => {
    if (q && !(s.name || '').includes(q)) return false;
    if (filter === 'all') return true;
    if (filter === 'needs-counseling') return s.needsCounseling;
    if (filter === 'ai') return (s.aiProgress || 0) > 0;
    if (filter === 'ungraded') return s.gradeAverage == null;
    return true;
  });
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader help="teacher-students" title="학생 관리" subtitle={`${classroomLabel} ${loading ? '' : (meta?.count ?? rows.length) + '명'}`} leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 12px' }}>
        <TextInput value={q} onChange={setQ} placeholder="학생 이름 검색" leading={<IcSearch size={16}/>}/>
      </div>
      <div style={{ padding: '0 16px 12px', overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, overflow: 'auto' }} className="toss-scroll">
          {[
            { id: 'all', label: `전체 ${rows.length}` },
            { id: 'needs-counseling', label: `상담 필요 ${needsCount}` },
            { id: 'ai', label: `AI 진행 ${aiCount}` },
            { id: 'ungraded', label: `성적 미입력 ${ungradedCount}` },
          ].map(t => {
            const active = filter === t.id;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)} style={{
                border: 'none', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap',
                background: active ? 'var(--brand-500)' : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--fg-default)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                boxShadow: active ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          [0,1,2,3].map(i => <Skeleton key={i} height={86} radius={12}/>)
        ) : error ? (
          <Card padding={8}><EmptyState icon={<IcUsers size={24}/>} title="학생 목록을 불러오지 못했어요" body="잠시 후 다시 시도해주세요." action={<Button variant="primary" size="sm" onClick={refetch}>다시 시도</Button>}/></Card>
        ) : rows.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcUsers size={24}/>} title="아직 등록된 학급 학생이 없어요" body="학급 초대코드를 공유해 첫 학생을 초대해보세요."/></Card>
        ) : filtered.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcSearch size={24}/>} title="검색 결과가 없어요" body="다른 이름이나 필터를 시도해보세요."/></Card>
        ) : filtered.map(s => (
          <Card key={s.id} padding={14} onClick={() => openStudentDetail(go, s.id)} hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={(s.name || '?').slice(0,1)} size={40}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</span>
                  {s.needsCounseling && <Chip tone="warning" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>상담 필요</Chip>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.gradeAverage == null ? (
                    <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>성적 미입력</span>
                  ) : (
                    <span className="num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.gradeAverage}</span>
                  )}
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>· {fmtActivity(s.lastActivityAt)}</span>
                </div>
              </div>
              <IcChevronRight size={16} color="var(--fg-subtle)"/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line-subtle)' }}>
              <ProgressBar value={s.studyDone || 0} max={Math.max(s.studyTotal || 0, 1)} height={4}/>
              <span className="num" style={{ fontSize: 10, color: 'var(--fg-muted)', minWidth: 40, textAlign: 'right', flexShrink: 0 }}>학습 {s.studyDone || 0}/{s.studyTotal || 0}</span>
              {aiProgressBadge(s.aiProgress || 0)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Student detail
// ────────────────────────────────────────────────────────
function TMStudentDetail({ go }) {
  const [tab, setTab] = React.useState('overview');
  const [year, setYear] = React.useState('all');
  const [gradeOpen, setGradeOpen] = React.useState(false);
  const [memoOpen, setMemoOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
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
  const studentName = loading ? '학생' : (student.name || '학생');
  const subtitle = [student.school, student.classroom].filter(Boolean).join(' ') || (loading ? '불러오는 중…' : '');
  const grades = detail?.grades || [];
  const signals = detail?.signals || [];
  const targets = detail?.targets || [];
  const aiProgress = detail?.aiProgress || 0;
  const terms = loading ? [] : groupGradesByTerm(grades);
  const lastAvg = terms.length ? terms[terms.length - 1].avg : null;
  const topTarget = targets[0];
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title={studentName} subtitle={subtitle} leading={<BackButton onClick={() => go('students')}/>} trailing={<IconButton icon={<IcMessage size={18}/>} ariaLabel="메시지" onClick={() => go('messages')}/>}/>
      {error && !loading ? (
        <div style={{ padding: '0 16px 24px' }}>
          <Card padding={8}><EmptyState icon={<IcUser size={24}/>} title="학생 정보를 불러오지 못했어요" body={!id ? '학생 목록에서 학생을 선택해주세요.' : '담당 학급 학생만 조회할 수 있어요.'} action={<Button variant="primary" size="sm" onClick={() => go('students')}>학생 목록</Button>}/></Card>
        </div>
      ) : (
      <>
      <div style={{ padding: '0 16px 12px', overflow: 'auto' }}>
        <div style={{ display: 'flex', gap: 6, overflow: 'auto', paddingBottom: 4 }} className="toss-scroll">
          {[
            { id: 'overview', label: '종합' },
            { id: 'ai-talk', label: 'AI 상담' },
            { id: 'grades', label: '성적' },
            { id: 'report', label: 'AI 리포트' },
            { id: 'study', label: '학습' },
            { id: 'memo', label: '상담 메모' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                border: 'none', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap',
                background: active ? 'var(--brand-500)' : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--fg-default)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[0,1,2].map(i => <Skeleton key={i} height={96} radius={12}/>)}</div>
        )}
        {!loading && tab === 'overview' && (
          <>
            <Card padding={16} style={{ marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>최근 평균</div><div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{lastAvg == null ? '미입력' : lastAvg}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>AI 진행도</div><div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{aiProgress}<span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>%</span></div>{aiProgressBadge(aiProgress)}</div>
                <div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>진로 단서</div><div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }}>{signals.length}<span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>개</span></div></div>
              </div>
            </Card>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Button variant="outline" size="md" style={{ flex: 1 }} leading={<IcMessage size={14}/>} onClick={() => setMemoOpen(true)}>메모 남기기</Button>
              <Button variant="primary" size="md" style={{ flex: 1 }} leading={<IcDoc size={14}/>} onClick={() => setReportOpen(true)}>리포트 보기</Button>
            </div>
            <SectionCard title="진로 목표" style={{ marginBottom: 12 }}>
              {targets.length === 0 ? (
                <EmptyState icon={<IcClipboard size={22}/>} title="설정된 진로 목표가 없어요" body="학생이 목표를 설정하면 여기에 표시돼요."/>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{topTarget.career || topTarget.dept || '진로 목표'}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }} className="kr-heading">{[topTarget.univ, topTarget.dept].filter(Boolean).join(' · ') || topTarget.track || ''}</div>
                </>
              )}
            </SectionCard>
            <SectionCard title="AI 진로 단서" subtitle="대화에서 보인 패턴">
              {signals.length === 0 ? (
                <EmptyState icon={<IcSparkles size={22}/>} title="아직 진로 단서가 없어요" body="학생이 AI 상담을 진행하면 단서가 쌓여요."/>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {signals.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Chip tone="info" size="sm">{s.tag}</Chip>
                    <span style={{ fontSize: 12, color: 'var(--fg-default)', flex: 1 }} className="kr-heading">{s.text}</span>
                  </div>
                ))}
              </div>
              )}
            </SectionCard>
          </>
        )}
        {!loading && tab === 'ai-talk' && <StudentAICounselingView studentName={studentName}/>}
        {!loading && tab === 'grades' && (
          <>
            <div style={{ marginBottom: 12 }}><GradeYearTabs value={year} onChange={setYear}/></div>
            <GradeHistoryView year={year} onYearChange={setYear} editable onAddGrade={() => setGradeOpen(true)}/>
          </>
        )}
        {!loading && tab === 'report' && (
          <SectionCard title="AI 진로 리포트" subtitle="학생이 공유한 리포트"
            action={signals.length > 0 && <Button variant="primary" size="sm" leading={<IcDoc size={14}/>} onClick={() => setReportOpen(true)}>전체 보기</Button>}>
            {signals.length === 0 ? (
              <EmptyState icon={<IcDoc size={22}/>} title="아직 공유된 리포트가 없어요" body="학생이 AI 상담을 진행해 리포트를 공유하면 여기에 표시돼요."/>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.6 }} className="kr-heading">대화에서 반복적으로 관찰된 진로 단서 {signals.length}개를 바탕으로 리포트가 준비돼 있어요. 전체 보기에서 확인하세요.</div>
            )}
          </SectionCard>
        )}
        {!loading && tab === 'study' && (
          <SectionCard title="이번 주 학습 항목">
            <EmptyState icon={<IcCheck size={22}/>} title="학습 기록이 아직 없어요" body="학생이 학습 계획을 진행하면 여기에 표시돼요."/>
          </SectionCard>
        )}
        {!loading && tab === 'memo' && (
          <>
            <Button variant="primary" size="md" full leading={<IcPlus size={15}/>} style={{ marginBottom: 12 }} onClick={() => setMemoOpen(true)}>상담 메모 추가</Button>
            <Card padding={8}>
              <EmptyState icon={<IcClipboard size={22}/>} title="상담 기록이 아직 없어요" body="이 학생과의 상담 메모를 추가하면 여기에 쌓여요."/>
            </Card>
          </>
        )}
      </div>
      </>
      )}
      {gradeOpen && <GradeInputDialog studentName={studentName} onSave={() => { setGradeOpen(false); showToast('성적을 저장했어요', 'success'); }} onClose={() => setGradeOpen(false)}/>}
      {memoOpen && <MemoOverlay onClose={() => setMemoOpen(false)}/>}
      <ReportViewer open={reportOpen} onClose={() => setReportOpen(false)} forTeacher/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Counseling (requests + memos)
// ────────────────────────────────────────────────────────
function TMCounseling({ go }) {
  const [tab, setTab] = React.useState('requests');
  const [requests, setRequests] = React.useState(null); // null = loading
  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/counseling-requests', { method: 'GET' }); setRequests(r.data || []); }
    catch (e) { setRequests([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  const pending = (requests || []).filter(r => r.status === 'pending');
  const act = async (req, action) => {
    try {
      await window.__apiFetch('/counseling-requests/' + req.id + '/' + action, { method: 'POST', body: JSON.stringify(action === 'accept' ? { at: new Date().toISOString() } : { note: '' }) });
      showToast(action === 'accept' ? `${req.student?.name || '학생'} 상담을 수락했어요` : '상담 요청을 보류했어요', 'success');
      load();
    } catch (e) { alert((e && e.body && e.body.message) || '처리에 실패했어요.'); }
  };
  const fmt = (d) => { if (!d) return ''; const dt = new Date(d); return dt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) + ' ' + dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); };
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader help="teacher-counseling" title="상담 · 기록" leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px' }}>
        <Tabs items={[{id:'requests',label:`요청 ${requests === null ? '…' : pending.length}`},{id:'memos',label:'상담 기록'}]} activeId={tab} onChange={setTab}/>
      </div>
      <div style={{ padding: '16px' }}>
        {tab === 'requests' && (
          requests === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1].map(i => <Skeleton key={i} height={120} radius={12}/>)}</div>
          ) : pending.length === 0 ? (
            <Card padding={8}><EmptyState icon={<IcMessage size={24}/>} title="대기 중인 상담 요청이 없어요" body="새 상담 요청이 오면 여기에 표시돼요."/></Card>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map((r) => (
              <Card key={r.id} padding={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Avatar name={(r.student?.name || '?')[0]} size={36}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student?.name || '학생'}</span>
                      {r.topic && <Chip tone="info" size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{r.topic}</Chip>}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{fmt(r.createdAt || r.preferredAt)}</div>
                  </div>
                </div>
                {r.note && <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.5, marginBottom: 10 }} className="kr-heading">{r.note}</div>}
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => act(r, 'accept')}>수락</Button>
                  <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => act(r, 'decline')}>보류</Button>
                </div>
              </Card>
            ))}
          </div>
          )
        )}
        {tab === 'memos' && (
          <div>
            <Card padding={8}>
              <EmptyState icon={<IcClipboard size={24}/>} title="상담 기록이 아직 없어요" body="상담을 진행하고 메모를 남기면 여기에 쌓여요."/>
            </Card>
            <div style={{ marginTop: 12, padding: 12, background: 'var(--info-bg)', borderRadius: 10, fontSize: 11, color: 'var(--brand-600)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
              <IcShield size={13} style={{ flexShrink: 0, marginTop: 1 }}/>
              <span className="kr-heading">상담 기록은 담당 학생·교사만 열람할 수 있어요. 모든 열람·수정은 감사 로그에 남아요.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Messages (uses TeacherMessages thread list mobile-optimized)
// ────────────────────────────────────────────────────────
function TMMessages({ go }) {
  const [selected, setSelected] = React.useState(null); // { otherId, otherName }
  const [search, setSearch] = React.useState('');
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [threads, setThreads] = React.useState(null); // null = loading
  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/messages/threads', { method: 'GET' }); setThreads(r.data || []); }
    catch (e) { setThreads([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  if (selected) {
    return <RealMessageThread go={() => { setSelected(null); load(); }} other={selected}/>;
  }
  const fmt = (d) => { if (!d) return ''; const dt = new Date(d); return dt.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) + ' ' + dt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }); };
  const filtered = (threads || []).filter(t => (t.otherName || '').includes(search));
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="메시지" leading={<BackButton onClick={() => go('dashboard')}/>} trailing={<IconButton icon={<IcPlus size={20}/>} ariaLabel="새 메시지" onClick={() => setComposeOpen(true)}/>}/>
      <div style={{ padding: '0 16px 12px' }}>
        <TextInput value={search} onChange={setSearch} placeholder="학생 이름 검색" leading={<IcSearch size={16}/>}/>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        {threads === null ? (
          <Card padding={14}><Skeleton height={48}/></Card>
        ) : threads.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcMessage size={24}/>} title="아직 주고받은 메시지가 없어요" body="새 메시지로 학생에게 먼저 보내보세요." action={<Button variant="primary" size="md" onClick={() => setComposeOpen(true)}>새 메시지</Button>}/></Card>
        ) : filtered.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcSearch size={24}/>} title="검색 결과가 없어요" body="다른 이름을 시도해보세요."/></Card>
        ) : (
        <Card padding={0}>
          {filtered.map((t, i, arr) => (
            <div key={t.otherId} onClick={() => setSelected({ otherId: t.otherId, otherName: t.otherName })} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', background: t.unread ? 'rgba(49,130,246,0.025)' : 'transparent',
            }}>
              <Avatar name={(t.otherName || '?').slice(0,1)} size={40}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{t.otherName}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{fmt(t.lastAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: t.unread ? 'var(--fg-default)' : 'var(--fg-muted)', fontWeight: t.unread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{t.lastBody}</span>
                  {t.unread > 0 && <span style={{ background: 'var(--brand-500)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '0 5px', minWidth: 16, height: 16, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </Card>
        )}
      </div>
      {composeOpen && <TMComposeSheet onClose={() => setComposeOpen(false)} onOpenThread={(t) => { setComposeOpen(false); setSelected(t); }}/>}
    </div>
  );
}

// Mobile compose sheet — pick a student (or whole class) then write. Real roster + POST /messages.
function TMComposeSheet({ onClose, onOpenThread }) {
  const [target, setTarget] = React.useState('individual');
  const [picked, setPicked] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [body, setBody] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const { rows, loading } = useTeacherRoster();
  const roster = rows.filter(s => (s.name || '').includes(q));
  const canSend = body.trim() && (target === 'all' || picked) && !busy;
  const send = async () => {
    if (!canSend) return;
    setBusy(true);
    const text = body.trim();
    try {
      if (target === 'all') {
        if (rows.length === 0) { setBusy(false); return; }
        await Promise.all(rows.map(s => window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: s.id, body: text }) })));
        showToast(`학급 전체(${rows.length}명)에게 메시지를 보냈어요`, 'success');
        onClose();
      } else {
        await window.__apiFetch('/messages', { method: 'POST', body: JSON.stringify({ recipientId: picked.id, body: text }) });
        showToast(`${picked.name} 학생에게 메시지를 보냈어요`, 'success');
        onOpenThread({ otherId: picked.id, otherName: picked.name });
      }
    } catch (e) {
      alert((e && e.body && e.body.message) || '메시지 전송에 실패했어요.');
      setBusy(false);
    }
  };
  return (
    <BottomSheet open onClose={onClose} title="새 메시지" maxHeight="88%">
      <div style={{ padding: '0 16px 16px' }}>
        <FormField label="받는 사람" style={{ marginBottom: 12 }}>
          <Tabs items={[{ id: 'individual', label: '학생 1명' }, { id: 'all', label: `학급 전체 (${loading ? '…' : rows.length}명)` }]} activeId={target} onChange={(v) => { setTarget(v); setPicked(null); }}/>
        </FormField>
        {target === 'individual' && (
          <>
            <TextInput value={q} onChange={setQ} placeholder="학생 이름 검색" leading={<IcSearch size={16}/>} style={{ marginBottom: 8 }}/>
            <div style={{ maxHeight: 220, overflow: 'auto', marginBottom: 12, border: '1px solid var(--line-subtle)', borderRadius: 12 }} className="toss-scroll">
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>불러오는 중…</div>
              ) : roster.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>{rows.length === 0 ? '아직 등록된 학생이 없어요' : '학생을 찾을 수 없어요'}</div>
              ) : roster.map((s, i) => (
                <button key={s.id} onClick={() => setPicked(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  padding: '12px 14px', border: 'none', cursor: 'pointer',
                  borderBottom: i < roster.length-1 ? '1px solid var(--line-subtle)' : 'none',
                  background: picked && picked.id === s.id ? 'var(--brand-50)' : 'transparent',
                }}>
                  <Avatar name={(s.name || '?').slice(0,1)} size={34}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.grade || ''}</div>
                  </div>
                  {picked && picked.id === s.id && <IcCheckCircle size={18} color="var(--brand-500)"/>}
                </button>
              ))}
            </div>
          </>
        )}
        <FormField label="내용" required style={{ marginBottom: 16 }}>
          <Textarea value={body} onChange={setBody} rows={4} placeholder={target === 'all' ? '학급 전체에게 보낼 메시지' : (picked ? `${picked.name} 학생에게 보낼 메시지` : '먼저 학생을 선택하세요')}/>
        </FormField>
        <Button variant="primary" size="lg" full disabled={!canSend} trailing={<IcSend size={15}/>} onClick={send}>
          {target === 'all' ? '학급 전체에게 보내기' : '보내기'}
        </Button>
      </div>
    </BottomSheet>
  );
}
function TMCalendar({ go }) {
  const today = new Date();
  const todayKey = dateKey(today);
  const [month, setMonth] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = React.useState(todayKey);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  useBroadcasts();
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

  const accept = async (req) => {
    try {
      await window.__apiFetch('/counseling-requests/' + req.id + '/accept', { method: 'POST', body: JSON.stringify({ at: new Date(selected + 'T15:00:00').toISOString() }) });
      showToast(`${req.student?.name || '학생'} 상담을 ${selected.slice(5,7)}/${selected.slice(8,10)}에 확정했어요`, 'success');
      loadEvents(); loadRequests();
    } catch (e) { alert((e && e.body && e.body.message) || '처리에 실패했어요.'); }
  };

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="캘린더" leading={<BackButton onClick={() => go('dashboard')}/>} trailing={<IconButton icon={<IcPlus size={20}/>} ariaLabel="일정·메모 보내기" onClick={() => setComposeOpen(true)}/>}/>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton icon={<IcChevronLeft size={20}/>} onClick={() => setMonth(m => ({ y: m.m === 0 ? m.y - 1 : m.y, m: m.m === 0 ? 11 : m.m - 1 }))} ariaLabel="이전"/>
        <div className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{monthLabel}</div>
        <IconButton icon={<IcChevronRight size={20}/>} onClick={() => setMonth(m => ({ y: m.m === 11 ? m.y + 1 : m.y, m: m.m === 11 ? 0 : m.m + 1 }))} ariaLabel="다음"/>
      </div>
      <Card padding={10} style={{ margin: '0 16px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
          {['일','월','화','수','목','금','토'].map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--brand-600)' : 'var(--fg-muted)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} style={{ aspectRatio: '1' }}/>;
            const evs = byDate[cell.key] || [];
            const isSelected = selected === cell.key;
            const isToday = cell.key === todayKey;
            return (
              <button key={i} onClick={() => setSelected(cell.key)} style={{
                aspectRatio: '1', border: 'none', cursor: 'pointer', position: 'relative',
                background: isSelected ? 'var(--brand-500)' : (isToday ? 'var(--brand-50)' : 'transparent'),
                color: isSelected ? '#fff' : (isToday ? 'var(--brand-600)' : (i % 7 === 0 ? 'var(--danger)' : 'var(--fg-strong)')),
                borderRadius: 8, fontSize: 12, fontWeight: isSelected || isToday ? 700 : 500,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="num">{cell.day}</span>
                {evs.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
                    {evs.slice(0, 3).map((e, k) => (
                      <span key={k} style={{ width: 3, height: 3, borderRadius: '50%', background: isSelected ? '#fff' : (CAT_COLOR[e.category] || 'var(--fg-subtle)') }}/>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8 }}>
          <span className="num">{selected.slice(5, 7)}월 {selected.slice(8, 10)}일</span> 일정
        </div>
        {selectedEvents.length === 0 ? (
          <Card padding={20}>
            <EmptyState icon={<IcCalendar size={20}/>} title="일정 없음" body="이 날 등록된 일정이 없어요."/>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {selectedEvents.map((e) => (
              <Card key={e.id} padding={12} style={{ borderLeft: `3px solid ${CAT_COLOR[e.category] || 'var(--fg-subtle)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{e.title}</div>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>{fmtTime(e.startsAt)}</span>
                </div>
                {e.notes && <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }} className="kr-heading">{e.notes}</div>}
              </Card>
            ))}
          </div>
        )}

        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', margin: '16px 0 4px' }}>대기 중인 상담 요청 {pending.length}</div>
        {pending.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 8 }}>새 상담 요청이 오면 여기에 표시돼요.</div>
        ) : (
        <>
        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 8 }}>수락하면 <strong>{selected.slice(5,7)}/{selected.slice(8,10)}</strong>에 확정 · 학생에게 알림</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map((r) => (
            <Card key={r.id} padding={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={(r.student?.name || '?')[0]} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student?.name || '학생'} {r.topic && <span style={{ fontWeight: 500, color: 'var(--fg-muted)' }}>· {r.topic}</span>}</div>
                  {r.note && <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.note}</div>}
                </div>
                <Button variant="primary" size="sm" onClick={() => accept(r)}>수락</Button>
              </div>
            </Card>
          ))}
        </div>
        </>
        )}
      </div>
      <BroadcastComposeDialog open={composeOpen} onClose={() => setComposeOpen(false)}/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Notifications
// ────────────────────────────────────────────────────────
// 알림 type → 아이콘/톤 매핑 (기본: 종 + brand).
const tmNotifIcon = (type) => {
  const t = String(type || '');
  if (t.includes('message') || t.includes('counsel')) return { icon: <IcMessage/>, tone: 'warning' };
  if (t.includes('report') || t.includes('ai')) return { icon: <IcSparkles/>, tone: 'purple' };
  if (t.includes('grade') || t.includes('chart') || t.includes('score')) return { icon: <IcChart/>, tone: 'info' };
  if (t.includes('join') || t.includes('accept') || t.includes('complete')) return { icon: <IcCheckCircle/>, tone: 'success' };
  if (t.includes('bill') || t.includes('pay') || t.includes('trial')) return { icon: <IcCreditCard/>, tone: 'neutral' };
  return { icon: <IcBell/>, tone: 'brand' };
};

function TMNotifications({ go }) {
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
  const markAll = async () => {
    try { await window.__apiFetch('/notifications/read-all', { method: 'POST' }); } catch (e) {}
    setItems(its => (its || []).map(i => ({ ...i, read: true })));
  };
  const loading = items === null;
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="알림" leading={<BackButton onClick={() => go('dashboard')}/>} trailing={(!loading && items.length > 0) ? <button onClick={markAll} style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>모두 읽음</button> : null}/>
      <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>실시간 연결됨 (SSE)
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>…</div>
        ) : items.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcBell size={22}/>} title="아직 알림이 없어요"/></Card>
        ) : (
        <Card padding={0}>
          {items.map((n, i) => {
            const unread = !(n.read || n.readAt);
            const m = tmNotifIcon(n.type);
            return (
            <div key={n.id || i} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderBottom: i < items.length-1 ? '1px solid var(--line-subtle)' : 'none',
              background: unread ? 'rgba(49,130,246,0.025)' : 'transparent',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `var(--${m.tone === 'brand' ? 'brand-50' : m.tone === 'purple' ? 'accent-purple-bg' : m.tone === 'success' ? 'success-bg' : m.tone === 'warning' ? 'warning-bg' : m.tone === 'info' ? 'info-bg' : 'neutral-bg'})`,
                color: `var(--${m.tone === 'brand' ? 'brand-500' : m.tone === 'purple' ? 'accent-purple' : m.tone === 'success' ? 'success' : m.tone === 'warning' ? 'warning' : m.tone === 'info' ? 'info' : 'neutral-fg'})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{React.cloneElement(m.icon, { size: 16 })}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{n.title || n.type || '알림'}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-subtle)', flexShrink: 0 }}>{fmtActivity(n.createdAt)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.45 }} className="kr-heading">{n.body || n.message}</div>
              </div>
              {unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 12 }}/>}
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
// MOBILE: Billing
// ────────────────────────────────────────────────────────
function TMBilling({ go }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="구독 및 결제" leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)' }}>
          <Chip tone="info" leading={<IcSparkles size={11}/>}>무료 체험 중</Chip>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>교사 플랜</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>학급 관리 · 초대코드 · 학생 리포트</div>
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>월 결제 금액</span>
            <span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>30,000원</span>
          </div>
          <div style={{ padding: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>체험 종료일</span>
            <span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>2026. 05. 31</span>
          </div>
          <Button variant="primary" size="lg" full style={{ marginTop: 16 }}>지금 결제 시작</Button>
        </Card>
        <SectionCard title="결제 수단" style={{ marginBottom: 12 }}>
          <div style={{ padding: 16, background: 'var(--bg-muted)', borderRadius: 12, textAlign: 'center', border: '1px dashed var(--line-strong)' }}>
            <IcCreditCard size={22} color="var(--fg-subtle)" style={{ margin: '0 auto 8px' }}/>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">결제 연동 준비 중</div>
          </div>
        </SectionCard>
        <SectionCard title="결제 내역">
          <EmptyState icon={<IcDoc size={22}/>} title="아직 결제 내역이 없어요"/>
        </SectionCard>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Profile
// ────────────────────────────────────────────────────────
function TMProfile({ go }) {
  const [me, setMe] = React.useState(null);
  const { rows, meta, loading } = useTeacherRoster();
  React.useEffect(() => { (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) {} })(); }, []);
  const name = (me && me.name) || '선생님';
  const classroomLabel = me ? [me.school, me.classroom].filter(Boolean).join(' ') : '';
  const count = meta?.count ?? rows.length;
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="내정보"/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={name[0]} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{classroomLabel || ' '}</div>
            <Chip tone="info" size="sm" style={{ marginTop: 6 }}>교사 플랜 · 무료 체험</Chip>
          </div>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcSchool size={16}/></div>} title="학급 관리" subtitle={loading ? '…' : `${count}/30명`} trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('classroom')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcUsers size={16}/></div>} title="학생 관리" subtitle={loading ? '…' : `${count}명`} trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('students')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCreditCard size={16}/></div>} title="구독 및 결제" subtitle="무료 체험 18일 남음" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('billing')} divider={false}/>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>} title="알림 설정" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => notReady('알림 설정')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcShield size={16}/></div>} title="개인정보 및 보안" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => notReady('개인정보 및 보안')} divider={false}/>
        </Card>
        <button style={{ width: '100%', padding: 14, border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer' }}>로그아웃</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Dashboard (already defined in cross-platform.jsx as TeacherMobileDashboard)
// But we'll redefine here with `go` prop wiring
// ────────────────────────────────────────────────────────
function TMDashboard({ go }) {
  const { rows, meta, loading } = useTeacherRoster();
  const [me, setMe] = React.useState(null);
  const [requests, setRequests] = React.useState(null); // null = loading
  React.useEffect(() => { (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) {} })(); }, []);
  React.useEffect(() => { (async () => { try { const r = await window.__apiFetch('/counseling-requests', { method: 'GET' }); setRequests(r.data || []); } catch (e) { setRequests([]); } })(); }, []);
  const count = meta?.count ?? rows.length;
  const classroomLabel = [me?.school, me?.classroom].filter(Boolean).join(' ') || (meta ? [meta.school, meta.classroom].filter(Boolean).join(' ') : '');
  const activeCount = rows.filter(s => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const focus = rows.filter(s => s.needsCounseling).slice(0, 3);
  const pending = (requests || []).filter(r => r.status === 'pending');
  return (
    <div style={{ padding: '12px 16px 24px', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: '-0.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>안녕하세요, {(me && me.name) || '선생님'}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{classroomLabel}{classroomLabel ? ' · ' : ''}{loading ? '…' : count}/30명</div>
        </div>
        <IconButton icon={<IcBell size={22}/>} onClick={() => go('notifications')} ariaLabel="알림"/>
      </div>

      <Card padding={18} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff' }} onClick={() => go('classroom')} hoverable>
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6 }}>학급 초대코드</div>
        <div className="num" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '5px' }}>H8K4 9P</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>복사</button>
          <button style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#fff', color: 'var(--brand-600)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>학급 보기</button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
        <div onClick={() => go('completion')} style={{ cursor: 'pointer' }}>
          <MetricCard label="이번 주 활동" value={loading ? '–' : `${activeCount}명`} delta={activeCount > 0 ? '활성' : undefined} deltaTone="success" icon={<IcZap size={16}/>}/>
        </div>
        <div onClick={() => go('counseling')} style={{ cursor: 'pointer' }}>
          <MetricCard label="상담 요청" value={requests === null ? '–' : `${pending.length}건`} delta={pending.length > 0 ? '확인 필요' : undefined} deltaTone="warning" icon={<IcMessage size={16}/>}/>
        </div>
      </div>

      <SectionCard title="오늘 주목할 학생" subtitle="상담이 필요한 학생" style={{ marginBottom: 12 }} action={<button onClick={() => go('students')} style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>전체</button>}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[0,1].map(i => <Skeleton key={i} height={56} radius={10}/>)}</div>
        ) : focus.length === 0 ? (
          <EmptyState icon={<IcCheck size={22}/>} title="주목할 학생이 없어요" body="현재 모든 학생이 잘 따라오고 있어요."/>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {focus.map((s) => (
            <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--line-subtle)', borderRadius: 10, cursor: 'pointer' }}>
              <Avatar name={(s.name || '?')[0]} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }} className="kr-heading">{counselReason(s)} · {s.grade || '학년 미정'}</div>
              </div>
              <Chip tone="warning" size="sm">상담 필요</Chip>
            </div>
          ))}
        </div>
        )}
      </SectionCard>

      <SectionCard title="상담 요청 대기" subtitle={requests === null ? '…' : `${pending.length}건`} style={{ marginBottom: 12 }} action={<button onClick={() => go('counseling')} style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>전체</button>}>
        {requests === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[0,1].map(i => <Skeleton key={i} height={36}/>)}</div>
        ) : pending.length === 0 ? (
          <EmptyState icon={<IcMessage size={22}/>} title="대기 중인 요청이 없어요" body="새 상담 요청이 오면 여기에 표시돼요."/>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.slice(0, 3).map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={(r.student?.name || '?')[0]} size={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student?.name || '학생'}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }} className="kr-heading">{r.topic || '상담 요청'}</div>
              </div>
              <Button variant="brandSoft" size="sm" onClick={() => go('counseling')}>처리</Button>
            </div>
          ))}
        </div>
        )}
      </SectionCard>

      <Card padding={16} onClick={() => go('billing')} hoverable>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Chip tone="info" size="sm">교사 플랜 · 무료 체험</Chip>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 6 }}>무료 체험 18일 남음</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>5월 31일까지</div>
          </div>
          <IcChevronRight size={20} color="var(--fg-subtle)"/>
        </div>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main TeacherMobileFullApp — all teacher screens in mobile
// ────────────────────────────────────────────────────────
function TeacherMobileFullApp({ initialScreen = 'dashboard', withToasts = false }) {
  const [screen, setScreen] = usePersistentScreen('teacher-mobile', initialScreen);
  const showBottomNav = ['dashboard', 'students', 'completion', 'messages', 'calendar', 'more', 'profile', 'announcements', 'teacher-info'].includes(screen);
  const [coach, setCoach] = React.useState(() => { try { return window.__LIVE_MODE && !localStorage.getItem('jinro:mtour:teacher'); } catch (e) { return false; } });
  const endCoach = () => { try { localStorage.setItem('jinro:mtour:teacher', '1'); } catch (e) {} setCoach(false); };
  const navId = screen === 'student-detail' ? 'students' : (screen === 'profile' || screen === 'billing' || screen === 'classroom' || screen === 'counseling' || screen === 'notifications' || screen === 'ai-view' || screen === 'calendar' || screen === 'consents' || screen === 'announcements' || screen === 'teacher-info') ? 'more' : screen;
  const cycle = withToasts ? useToastCycle(SAMPLE_TOASTS.teacher, 4200) : { active: [], close: () => {} };

  return (
    <div data-app-root style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 54 }} className="toss-scroll">
        {screen === 'dashboard' && <TMDashboard go={setScreen}/>}
        {screen === 'classroom' && <TMClassroom go={setScreen}/>}
        {screen === 'students' && <TMStudents go={setScreen}/>}
        {screen === 'student-detail' && <TMStudentDetail go={setScreen}/>}
        {screen === 'counseling' && <TMCounseling go={setScreen}/>}
        {screen === 'messages' && <TMMessages go={setScreen}/>}
        {screen === 'calendar' && <TMCalendar go={setScreen}/>}
        {screen === 'notifications' && <TMNotifications go={setScreen}/>}
        {screen === 'billing' && <TMBilling go={setScreen}/>}
        {screen === 'profile' && <TeacherProfileMobile go={setScreen}/>}
        {screen === 'settings-password' && <SettingsPassword back={() => setScreen('profile')}/>}
        {screen === 'settings-notifications' && <SettingsNotifications back={() => setScreen('profile')} role="teacher"/>}
        {screen === 'settings-suggest' && <SettingsSuggestion back={() => setScreen('profile')}/>}
        {screen === 'settings-terms' && <SettingsTerms back={() => setScreen('profile')}/>}
        {screen === 'more' && <TMMore go={setScreen}/>}
        {screen === 'completion' && <TMCompletion go={setScreen}/>}
        {screen === 'ai-view' && <TMAIView go={setScreen}/>}
        {screen === 'consents' && <ConsentManagement go={setScreen} role="teacher"/>}
        {screen === 'announcements' && <AnnouncementsScreen role="teacher" variant="mobile" onBack={() => setScreen('more')}/>}
        {screen === 'teacher-info' && <TeacherInfoScreen go={setScreen}/>}
      </div>
      {showBottomNav && (
        <MobileBottomNav items={TEACHER_MOBILE_NAV_FULL} activeId={navId} onChange={(id) => {
          if (id === 'more') setScreen('more');
          else setScreen(id);
        }}/>
      )}
      {withToasts && <MobileToastHost toasts={cycle.active} onClose={cycle.close}/>}
      {coach && screen === 'dashboard' && <MobileCoachTour role="teacher" onDone={endCoach}/>}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE: Completion status (teacher)
// ────────────────────────────────────────────────────────
function TMCompletion({ go }) {
  const { rows, loading } = useTeacherRoster();
  const withTotal = rows.filter(s => (s.studyTotal || 0) > 0);
  const sorted = [...rows].sort((a, b) => {
    const pa = (a.studyTotal || 0) > 0 ? (a.studyDone || 0) / a.studyTotal : 0;
    const pb = (b.studyTotal || 0) > 0 ? (b.studyDone || 0) / b.studyTotal : 0;
    return pb - pa;
  });
  const avgPct = withTotal.length
    ? Math.round(withTotal.reduce((acc, s) => acc + (s.studyDone || 0) / s.studyTotal, 0) / withTotal.length * 100)
    : 0;
  const attention = withTotal.filter(s => (s.studyDone || 0) / s.studyTotal < 0.4).length;
  const toneFor = (pct) => pct >= 75 ? 'success' : pct >= 40 ? 'info' : 'danger';
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader help="teacher-completion" title="학습 완료 현황" subtitle="이번 주 진행률" leading={<BackButton onClick={() => go('dashboard')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
          <MetricCard label="학급 평균" value={loading ? '–' : `${avgPct}%`} icon={<IcCheck size={16}/>}/>
          <MetricCard label="주의 필요" value={loading ? '–' : `${attention}명`} delta={attention > 0 ? '40% 미만' : undefined} deltaTone="danger" icon={<IcAlert size={16}/>}/>
        </div>
        {loading ? (
          <Card padding={16}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2,3].map(i => <Skeleton key={i} height={36}/>)}</div></Card>
        ) : rows.length === 0 ? (
          <Card padding={8}><EmptyState icon={<IcUsers size={24}/>} title="아직 등록된 학생이 없어요" body="학급 초대코드를 공유해 첫 학생을 초대해보세요."/></Card>
        ) : (
        <Card padding={0}>
          {sorted.map((s, i, arr) => {
            const total = s.studyTotal || 0;
            const done = s.studyDone || 0;
            const pct = total > 0 ? Math.round(done / total * 100) : 0;
            const tone = toneFor(pct);
            return (
              <div key={s.id} onClick={() => openStudentDetail(go, s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px',
                borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none',
                cursor: 'pointer',
              }}>
                <Avatar name={(s.name || '?')[0]} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</span>
                    <span className="num" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{done}/{total}</span>
                  </div>
                  <ProgressBar value={done} max={Math.max(total, 1)} height={4} color={`var(--${tone === 'info' ? 'brand-500' : tone})`}/>
                </div>
                <Chip tone={tone} size="sm">{pct}%</Chip>
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
// MOBILE: Teacher AI view (read-only)
// ────────────────────────────────────────────────────────
function TMAIView({ go }) {
  const [tab, setTab] = React.useState('signals');
  const id = (typeof window !== 'undefined' && window.__selectedStudentId) || null;
  const [detail, setDetail] = React.useState(null); // null = loading
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    setDetail(null); setError(null);
    if (!id) { setError(new Error('학생 미선택')); setDetail({}); return; }
    (async () => {
      try { const r = await window.__apiFetch('/teacher/students/' + encodeURIComponent(id), { method: 'GET' }); if (alive) setDetail(r.data || {}); }
      catch (e) { if (alive) { setError(e); setDetail({}); } }
    })();
    return () => { alive = false; };
  }, [id]);
  const loading = detail === null;
  const student = detail?.student || {};
  const signals = detail?.signals || [];
  const aiProgress = detail?.aiProgress || 0;
  const studentName = student.name || '학생';
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title={loading ? 'AI 리포트' : `${studentName} · AI 리포트`} subtitle={loading ? '불러오는 중…' : `진로 단서 ${signals.length}개 · 진행도 ${aiProgress}%`} leading={<BackButton onClick={() => go('students')}/>}/>
      {!id || (error && !loading) ? (
        <div style={{ padding: '0 16px 24px' }}>
          <Card padding={8}><EmptyState icon={<IcSparkles size={24}/>} title="학생을 먼저 선택해주세요" body="학생 목록에서 학생을 선택하면 AI 진로 단서를 볼 수 있어요." action={<Button variant="primary" size="sm" onClick={() => go('students')}>학생 목록</Button>}/></Card>
        </div>
      ) : (
      <>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 6, overflow: 'auto' }} className="toss-scroll">
          {[
            { id: 'signals', label: '단서' },
            { id: 'summary', label: '요약' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                border: 'none', padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap',
                background: active ? 'var(--brand-500)' : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--fg-default)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        <div style={{ padding: 12, background: 'var(--warning-bg)', borderRadius: 10, fontSize: 11, color: 'var(--warning)', display: 'flex', gap: 8, marginBottom: 12, lineHeight: 1.5 }}>
          <IcShield size={13} style={{ marginTop: 1, flexShrink: 0 }}/>
          <span className="kr-heading">학생 사전 동의에 따라 열람 중. 외부 공유 시 학생에게 알림이 가요.</span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2].map(i => <Skeleton key={i} height={64} radius={12}/>)}</div>
        ) : tab === 'signals' ? (
          signals.length === 0 ? (
            <Card padding={8}><EmptyState icon={<IcSparkles size={24}/>} title="아직 진로 단서가 없어요" body="학생이 AI 상담을 진행하면 단서가 쌓여요."/></Card>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {signals.map((s, i) => (
              <Card key={i} padding={12}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Chip tone="info" size="sm">{s.tag}</Chip>
                  <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1 }} className="kr-heading">{s.text}</span>
                </div>
              </Card>
            ))}
          </div>
          )
        ) : (
          signals.length === 0 ? (
            <Card padding={8}><EmptyState icon={<IcDoc size={24}/>} title="아직 요약할 내용이 없어요" body="진로 단서가 쌓이면 요약이 만들어져요."/></Card>
          ) : (
          <Card padding={20} style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)' }}>
            <Chip tone="purple" size="sm" style={{ marginBottom: 10 }}>진로 단서 요약</Chip>
            <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.6 }} className="kr-heading">
              {studentName} 학생의 대화에서 진로 단서 {signals.length}개가 관찰됐어요. AI 진행도는 {aiProgress}%예요. 자세한 내용은 단서 탭에서 확인하세요.
            </div>
          </Card>
          )
        )}
      </div>
      </>
      )}
    </div>
  );
}

function TMMore({ go }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <TMHeader title="더보기"/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={0}>
          {[
            { id: 'classroom', label: '학급 관리', icon: <IcSchool/>, sub: '초대코드 · 정원', tone: 'brand' },
            { id: 'calendar', label: '캘린더', icon: <IcCalendar/>, sub: '일정 · 상담 요청', tone: 'purple' },
            { id: 'counseling', label: '상담 · 기록', icon: <IcClipboard/>, sub: '상담 요청 · 기록 관리', tone: 'warning' },
            { id: 'ai-view', label: '학생 AI 리포트', icon: <IcSparkles/>, sub: '학생별 진로 단서', tone: 'purple' },
            { id: 'notifications', label: '알림', icon: <IcBell/>, sub: '실시간 알림', tone: 'info' },
            { id: 'consents', label: '동의 관리', icon: <IcShield/>, sub: '개인정보 · 결제 동의', tone: 'success' },
            { id: 'announcements', label: '공지사항', icon: <IcFlag/>, sub: '업데이트 소식 · 건의·버그 제보', tone: 'mint' },
            { id: 'billing', label: '구독 및 결제', icon: <IcCreditCard/>, sub: '무료 체험', tone: 'mint' },
            { id: 'profile', label: '내정보', icon: <IcUser/>, sub: '계정 · 설정', tone: 'neutral' },
          ].map((it, i, arr) => (
            <ListRow
              key={it.id}
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: toneBg(it.tone), color: toneFg(it.tone), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{React.cloneElement(it.icon, { size: 16 })}</div>}
              title={it.label}
              subtitle={it.sub}
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go(it.id)}
              divider={i < arr.length-1}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { TeacherMobileFullApp });
