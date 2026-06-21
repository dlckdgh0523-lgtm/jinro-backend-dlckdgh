// admin-screens-v5.jsx — real admin operational screens.
// AdminStudents, AdminClassrooms, AdminSubscriptions, AdminAIUsage, AdminCounseling, AdminNotifEvents, AdminTeachers
// adminFetch / fmtDate / fmtDateTime are globals from admin-app.jsx.

const aStatus = (s) => ({
  active: <Chip tone="success" size="sm" leading={<IcDot size={6}/>}>활성</Chip>,
  disabled: <Chip tone="danger" size="sm" leading={<IcDot size={6}/>}>비활성</Chip>,
}[s] || <Chip tone="neutral" size="sm">{s || '—'}</Chip>);

// Reusable: filter bar + responsive table → card list under lg
function AdminListShell({ title, subtitle, action, filters, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title={title} subtitle={subtitle} action={action}/>
      {filters && (
        <div style={{ padding: '16px 24px 8px', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-canvas)', flexWrap: 'wrap' }}>{filters}</div>
      )}
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px', background: 'var(--bg-canvas)' }}>{children}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Students
// ────────────────────────────────────────────────────────
function AdminStudents() {
  const [q, setQ] = React.useState('');
  const [rows, setRows] = React.useState(null); // null=loading

  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      params.set('role', 'student');
      if (q.trim()) params.set('q', q.trim());
      params.set('limit', '100');
      const res = await adminFetch('/admin/users?' + params.toString());
      setRows((res && res.data) || []);
    } catch (e) { setRows([]); }
  }, [q]);
  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  const loading = rows === null;
  const list = rows || [];
  return (
    <AdminListShell
      title="학생 관리"
      subtitle={loading ? '불러오는 중…' : `${list.length}건 표시`}
      action={<><Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('학생 목록', ['이름','이메일','학교','학급','학년','상태','가입일'], list.map(s => [s.name, s.email, s.school || '', s.classroom || '', s.grade != null ? String(s.grade) : '', s.status, fmtDate(s.createdAt)]))}>PDF 내보내기</Button></>}
      filters={<TextInput value={q} onChange={setQ} placeholder="학생·이메일 검색" leading={<IcSearch size={16}/>} style={{ flex: 1, maxWidth: 320, height: 40 }}/>}
    >
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 1fr 0.8fr 1fr 1.2fr', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: 0.3, borderBottom: '1px solid var(--line-subtle)', minWidth: 760 }}>
          <span>학생</span><span>학교</span><span>학급</span><span>학년</span><span>상태</span><span>가입일</span>
        </div>
        {loading ? (
          [0,1,2,3].map(i => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width={32} height={32} radius={16}/><Skeleton width="40%" height={14}/></div>)
        ) : list.length === 0 ? (
          <div style={{ padding: 24 }}><EmptyState icon={<IcUser size={22}/>} title="표시할 학생이 없어요" body={q.trim() ? '검색 조건을 바꿔보세요.' : '아직 가입한 학생이 없어요.'}/></div>
        ) : list.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 1fr 0.8fr 1fr 1.2fr', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none', minWidth: 760 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={(s.name || '?')[0]} size={32}/>
              <div><div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{s.email}</div></div>
            </div>
            <div style={{ color: 'var(--fg-default)' }}>{s.school || '—'}</div>
            <div style={{ color: 'var(--fg-default)' }}>{s.classroom || '—'}</div>
            <div className="num" style={{ color: 'var(--fg-default)' }}>{s.grade != null ? s.grade : '—'}</div>
            <div>{aStatus(s.status)}</div>
            <div className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDate(s.createdAt)}</div>
          </div>
        ))}
      </Card>
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// Classrooms
// ────────────────────────────────────────────────────────
function AdminClassrooms() {
  const [q, setQ] = React.useState('');
  const [school, setSchool] = React.useState(null);
  const [students, setStudents] = React.useState(null); // null=loading

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch('/admin/users?role=student&limit=200');
        if (alive) setStudents((res && res.data) || []);
      } catch (e) { if (alive) setStudents([]); }
    })();
    return () => { alive = false; };
  }, []);

  // school+classroom 기준으로 그룹화하여 학급 목록 파생.
  const groups = React.useMemo(() => {
    const map = new Map();
    (students || []).forEach(s => {
      const sch = s.school || '미지정';
      const cls = s.classroom || '미지정';
      const key = sch + '__' + cls;
      if (!map.has(key)) map.set(key, { id: key, school: sch, classroom: cls, count: 0 });
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => (a.school + a.classroom).localeCompare(b.school + b.classroom));
  }, [students]);

  const rows = groups.filter(c => !q.trim() || c.school.includes(q) || c.classroom.includes(q));
  if (school) return <AdminSchoolDetail school={school} students={(students || []).filter(s => (s.school || '미지정') === school)} onBack={() => setSchool(null)}/>;

  const loading = students === null;
  return (
    <AdminListShell
      title="학급 관리"
      subtitle={loading ? '불러오는 중…' : `${rows.length}개 학급 · 학교명을 누르면 소속 학생을 볼 수 있어요`}
      filters={<TextInput value={q} onChange={setQ} placeholder="학교·학급 검색" leading={<IcSearch size={16}/>} style={{ flex: 1, maxWidth: 320, height: 40 }}/>}
    >
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>{[0,1,2].map(i => <Card key={i} padding={18}><Skeleton height={70}/></Card>)}</div>
      ) : rows.length === 0 ? (
        <Card padding={24}><EmptyState icon={<IcSchool size={22}/>} title="표시할 학급이 없어요" body="학생이 학교·학급 정보와 함께 가입하면 학급이 자동으로 묶여요."/></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {rows.map(c => (
            <Card key={c.id} padding={18}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <button onClick={() => setSchool(c.school)} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontSize: 15, fontWeight: 700, color: 'var(--brand-600)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>{c.school}<IcChevronRight size={14}/></button>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{c.classroom}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--bg-muted)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>소속 학생</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{c.count}명</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// Subscriptions
// ────────────────────────────────────────────────────────
function AdminSubscriptions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="구독" subtitle="구독 연동 준비 중"/>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', padding: 24 }}>
        <Card padding={32} style={{ width: 480, textAlign: 'center' }}>
          <EmptyState icon={<IcStar size={24}/>} title="구독 연동은 준비 중이에요" body="현재는 무료 체험 모드로 운영돼요. 구독 상태·결제 주기 데이터는 결제 연동 후 제공됩니다."/>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// AI usage
// ────────────────────────────────────────────────────────
function AdminAIUsage() {
  const [data, setData] = React.useState(null); // null=loading

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch('/admin/ai-usage');
        if (alive) setData((res && res.data) || {});
      } catch (e) { if (alive) setData({}); }
    })();
    return () => { alive = false; };
  }, []);

  const loading = data === null;
  const t = (data && data.totals) || {};
  const recent = data === null ? null : ((data.recent) || []);
  const n = (v) => (v == null ? 0 : v).toLocaleString();
  const sChip = (s) => ({
    active: <Chip tone="info" size="sm">진행</Chip>,
    completed: <Chip tone="success" size="sm">완료</Chip>,
    report_ready: <Chip tone="success" size="sm">리포트 완료</Chip>,
  }[s] || <Chip tone="neutral" size="sm">{s || '—'}</Chip>);

  return (
    <AdminListShell title="AI 사용량" subtitle="상담 세션·메시지·리포트 집계 + 최근 세션"
      action={recent && recent.length > 0 && <Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('AI 사용량 - 최근 세션', ['학생','상태','메시지','단서','시작'], recent.map(r => [r.student, r.status, r.messages, r.signals, fmtDateTime(r.startedAt)]))}>PDF 내보내기</Button>}
    >
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>{[0,1,2,3].map(i => <Card key={i} padding={18}><Skeleton width="60%" height={12}/><Skeleton width="40%" height={24} style={{ marginTop: 12 }}/></Card>)}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="총 AI 세션" value={n(t.sessions)} icon={<IcSparkles size={16}/>}/>
          <MetricCard label="진행 중 세션" value={n(t.active)} icon={<IcMessage size={16}/>}/>
          <MetricCard label="총 메시지" value={n(t.messages)} icon={<IcDoc size={16}/>}/>
          <MetricCard label="리포트 생성" value={n(t.reports)} icon={<IcStar size={16}/>}/>
        </div>
      )}
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.6fr', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--line-subtle)', minWidth: 680 }}>
          <span>학생</span><span>상태</span><span>메시지</span><span>단서</span><span>시작</span>
        </div>
        {recent === null ? (
          [0,1,2].map(i => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width="40%" height={14}/></div>)
        ) : recent.length === 0 ? (
          <div style={{ padding: 24 }}><EmptyState icon={<IcSparkles size={22}/>} title="최근 AI 세션이 없어요" body="학생이 AI 상담을 시작하면 여기에 표시돼요."/></div>
        ) : recent.map((r, i) => (
          <div key={r.id || i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.6fr', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < recent.length-1 ? '1px solid var(--line-subtle)' : 'none', minWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={(r.student || '?')[0]} size={28}/><span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student || '익명'}</span></div>
            <span>{sChip(r.status)}</span>
            <span className="num" style={{ color: 'var(--fg-default)' }}>{r.messages ?? 0}</span>
            <span className="num" style={{ color: 'var(--fg-default)' }}>{r.signals ?? 0}</span>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDateTime(r.startedAt)}</span>
          </div>
        ))}
      </Card>
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// Counseling sessions
// ────────────────────────────────────────────────────────
function AdminCounseling() {
  const [data, setData] = React.useState(null); // null=loading

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch('/admin/ai-usage');
        if (alive) setData((res && res.data) || {});
      } catch (e) { if (alive) setData({}); }
    })();
    return () => { alive = false; };
  }, []);

  const loading = data === null;
  const t = (data && data.totals) || {};
  const recent = data === null ? null : ((data.recent) || []);
  const n = (v) => (v == null ? 0 : v).toLocaleString();
  const sChip = (s) => ({
    active: <Chip tone="info" size="sm">진행</Chip>,
    completed: <Chip tone="success" size="sm">완료</Chip>,
    report_ready: <Chip tone="success" size="sm">리포트 완료</Chip>,
  }[s] || <Chip tone="neutral" size="sm">{s || '—'}</Chip>);

  return (
    <AdminListShell title="상담 세션" subtitle="AI 상담 세션 메타데이터 (내용은 비공개)">
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>{[0,1,2].map(i => <Card key={i} padding={18}><Skeleton width="60%" height={12}/><Skeleton width="40%" height={24} style={{ marginTop: 12 }}/></Card>)}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="총 상담 세션" value={n(t.sessions)} icon={<IcMessage size={16}/>}/>
          <MetricCard label="진행 중" value={n(t.active)} icon={<IcSparkles size={16}/>}/>
          <MetricCard label="총 메시지" value={n(t.messages)} icon={<IcDoc size={16}/>}/>
        </div>
      )}
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.6fr', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--line-subtle)', minWidth: 680 }}>
          <span>학생</span><span>상태</span><span>메시지</span><span>단서</span><span>시작</span>
        </div>
        {recent === null ? (
          [0,1,2].map(i => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width="40%" height={14}/></div>)
        ) : recent.length === 0 ? (
          <div style={{ padding: 24 }}><EmptyState icon={<IcMessage size={22}/>} title="최근 상담 세션이 없어요" body="학생이 상담을 시작하면 여기에 표시돼요."/></div>
        ) : recent.map((r, i) => (
          <div key={r.id || i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.6fr', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < recent.length-1 ? '1px solid var(--line-subtle)' : 'none', minWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={(r.student || '?')[0]} size={28}/><span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{r.student || '익명'}</span></div>
            <span>{sChip(r.status)}</span>
            <span className="num" style={{ color: 'var(--fg-default)' }}>{r.messages ?? 0}</span>
            <span className="num" style={{ color: 'var(--fg-default)' }}>{r.signals ?? 0}</span>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDateTime(r.startedAt)}</span>
          </div>
        ))}
      </Card>
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// Notification events (dedupeKey pipeline)
// ────────────────────────────────────────────────────────
function AdminNotifEvents() {
  const [rows, setRows] = React.useState(null); // null=loading
  const load = React.useCallback(async () => {
    setRows(null);
    try { const res = await adminFetch('/admin/notifications?limit=100'); setRows((res && res.data) || []); }
    catch (e) { setRows([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const loading = rows === null;
  const list = rows || [];
  return (
    <AdminListShell title="알림 이벤트" subtitle={loading ? '불러오는 중…' : `최근 ${list.length}건 · dedupeKey 기반 멱등 발송`}
      action={<Button variant="outline" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>새로고침</Button>}
    >
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1.1fr 1.6fr 1fr 80px', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--line-subtle)', minWidth: 820 }}>
          <span>시각</span><span>수신자</span><span>내용</span><span>유형</span><span>상태</span>
        </div>
        {loading ? (
          [0,1,2,3].map(i => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width="50%" height={14}/></div>)
        ) : list.length === 0 ? (
          <div style={{ padding: 24 }}><EmptyState icon={<IcBell size={22}/>} title="발송된 알림이 없어요" body="상담 단계 전환·캘린더 변경 등 이벤트가 발생하면 여기에 기록돼요."/></div>
        ) : list.map((nft, i) => (
          <div key={nft.id || i} style={{ display: 'grid', gridTemplateColumns: '150px 1.1fr 1.6fr 1fr 80px', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none', minWidth: 820 }}>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDateTime(nft.createdAt)}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nft.user || '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nft.email}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--fg-strong)' }} className="kr-heading">{nft.title}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{nft.body}</div>
            </div>
            <span><Chip tone="neutral" size="sm">{nft.type}</Chip></span>
            <span>{nft.read ? <Chip tone="neutral" size="sm">읽음</Chip> : <Chip tone="info" size="sm">미읽음</Chip>}</span>
          </div>
        ))}
      </Card>
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// Teachers (real)
// ────────────────────────────────────────────────────────
function AdminTeachers() {
  const [q, setQ] = React.useState('');
  const [rows, setRows] = React.useState(null); // null=loading

  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      params.set('role', 'teacher');
      if (q.trim()) params.set('q', q.trim());
      params.set('limit', '100');
      const res = await adminFetch('/admin/users?' + params.toString());
      setRows((res && res.data) || []);
    } catch (e) { setRows([]); }
  }, [q]);
  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  const loading = rows === null;
  const list = rows || [];
  return (
    <AdminListShell title="교사 관리" subtitle={loading ? '불러오는 중…' : `${list.length}건 표시`}
      action={list.length > 0 && <Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('교사 목록', ['이름','이메일','학교','학급','상태','가입일'], list.map(r => [r.name, r.email, r.school || '', r.classroom || '', r.status, fmtDate(r.createdAt)]))}>PDF 내보내기</Button>}
      filters={<TextInput value={q} onChange={setQ} placeholder="교사·이메일 검색" leading={<IcSearch size={16}/>} style={{ flex: 1, maxWidth: 320, height: 40 }}/>}
    >
      <Card padding={0}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 1fr 1fr 1.2fr', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--line-subtle)', minWidth: 640 }}>
          <span>교사</span><span>학교</span><span>학급</span><span>상태</span><span>가입일</span>
        </div>
        {loading ? (
          [0,1,2].map(i => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width={32} height={32} radius={16}/><Skeleton width="40%" height={14}/></div>)
        ) : list.length === 0 ? (
          <div style={{ padding: 24 }}><EmptyState icon={<IcGraduation size={22}/>} title="표시할 교사가 없어요" body={q.trim() ? '검색 조건을 바꿔보세요.' : '아직 가입한 교사가 없어요.'}/></div>
        ) : list.map((r, i) => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 1fr 1fr 1.2fr', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none', minWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={(r.name || '?')[0]} size={32}/><div><div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{r.name}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{r.email}</div></div></div>
            <span style={{ color: 'var(--fg-default)' }}>{r.school || '—'}</span>
            <span style={{ color: 'var(--fg-default)' }}>{r.classroom || '—'}</span>
            <span>{aStatus(r.status)}</span>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDate(r.createdAt)}</span>
          </div>
        ))}
      </Card>
    </AdminListShell>
  );
}

// ────────────────────────────────────────────────────────
// School detail — teachers + students belonging to a school
// ────────────────────────────────────────────────────────
function AdminSchoolDetail({ school, students = [], onBack }) {
  const classCount = new Set(students.map(s => s.classroom || '미지정')).size;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title={`${school} 상세`} subtitle={`소속 학생 ${students.length}명 · 학급 ${classCount}개`}
        action={<>
          <Button variant="outline" size="sm" leading={<IcArrowLeft size={14}/>} onClick={onBack}>학급 목록</Button>
          <Button variant="primary" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF(`${school} 명단`, ['이름','이메일','학급','학년','상태'], students.map(s => [s.name, s.email, s.classroom || '', s.grade != null ? String(s.grade) : '', s.status]), { '학교': school })}>PDF 내보내기</Button>
        </>}
      />
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          <MetricCard label="소속 학생" value={`${students.length}명`} icon={<IcUser size={16}/>}/>
          <MetricCard label="학급 수" value={`${classCount}개`} icon={<IcSchool size={16}/>}/>
        </div>
        <SectionCard title="소속 학생">
          {students.length === 0 ? <EmptyState icon={<IcUser size={22}/>} title="표시할 학생이 없어요"/> : (
            <Card padding={0}>
              {students.map((s, i) => (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 0.8fr 1fr', padding: '12px 16px', alignItems: 'center', fontSize: 13, borderBottom: i < students.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={(s.name || '?')[0]} size={30}/><span style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</span></div>
                  <span style={{ color: 'var(--fg-muted)' }}>{s.classroom || '—'}</span>
                  <span className="num" style={{ color: 'var(--fg-default)' }}>{s.grade != null ? s.grade : '—'}</span>
                  <span>{aStatus(s.status)}</span>
                </div>
              ))}
            </Card>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

Object.assign(window, {
  AdminStudents, AdminClassrooms, AdminSubscriptions, AdminAIUsage, AdminCounseling, AdminNotifEvents, AdminTeachers, AdminSchoolDetail,
});
