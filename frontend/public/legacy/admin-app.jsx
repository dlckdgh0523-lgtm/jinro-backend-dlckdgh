// admin-app.jsx — Super admin prototype (desktop browser)
// Sidebar layout with: dashboard, users, payments, audit logs, system health

const ADMIN_NAV = [
  { section: '운영', items: [
    { id: 'dashboard', label: '대시보드', icon: <IcHome/> },
    { id: 'users', label: '사용자', icon: <IcUsers/> },
    { id: 'teachers', label: '교사', icon: <IcGraduation/> },
    { id: 'students', label: '학생', icon: <IcUser/> },
    { id: 'classrooms', label: '학급', icon: <IcSchool/> },
  ]},
  { section: '결제 · AI', items: [
    { id: 'subscriptions', label: '구독', icon: <IcStar/> },
    { id: 'payments', label: '결제', icon: <IcCreditCard/> },
    { id: 'ai-usage', label: 'AI 사용량', icon: <IcSparkles/> },
    { id: 'counseling', label: '상담 세션', icon: <IcMessage/> },
  ]},
  { section: '소통', items: [
    { id: 'announcements', label: '공지사항', icon: <IcBell/> },
    { id: 'suggestions', label: '건의사항', icon: <IcMessage/> },
  ]},
  { section: '시스템', items: [
    { id: 'notifications', label: '알림 이벤트', icon: <IcBell/> },
    { id: 'audit-logs', label: '감사 로그', icon: <IcDoc/> },
    { id: 'system', label: '시스템 상태', icon: <IcServer/> },
  ]},
];

// 전역 __apiFetch(토큰 자동 갱신) 사용. 미정의 시 안전 폴백.
function adminFetch(path) {
  if (typeof window !== 'undefined' && window.__apiFetch) return window.__apiFetch(path, { method: 'GET' });
  return Promise.reject(new Error('no api'));
}
// ISO/문자열 날짜를 YYYY-MM-DD 로 정리. 실패 시 원문.
function fmtDate(d) {
  if (!d) return '—';
  try { const t = new Date(d); if (!isNaN(t)) return t.toISOString().slice(0, 10); } catch (e) {}
  return String(d);
}
function fmtDateTime(d) {
  if (!d) return '—';
  try { const t = new Date(d); if (!isNaN(t)) return t.toISOString().slice(0, 16).replace('T', ' '); } catch (e) {}
  return String(d);
}

const planChip = (p) => ({
  trial: <Chip tone="info" size="sm">체험중</Chip>,
  active: <Chip tone="success" size="sm">결제중</Chip>,
  past_due: <Chip tone="warning" size="sm">연체</Chip>,
  canceled: <Chip tone="neutral" size="sm">해지</Chip>,
  expired: <Chip tone="danger" size="sm">만료</Chip>,
}[p]);

const statusChip = (s) => ({
  active: <Chip tone="success" size="sm" leading={<IcDot size={6}/>}>활성</Chip>,
  disabled: <Chip tone="danger" size="sm" leading={<IcDot size={6}/>}>비활성</Chip>,
}[s]);

const roleChip = (r) => ({
  student: <Chip tone="brand" size="sm">학생</Chip>,
  teacher: <Chip tone="purple" size="sm">교사</Chip>,
  admin: <Chip tone="warning" size="sm">관리자</Chip>,
}[r]);

// 감사 로그 action 코드 → 사람이 읽는 라벨/톤.
function auditActionMeta(action) {
  return ({
    'user.disable': { label: '계정 비활성화', tone: 'danger' },
    'user.enable': { label: '계정 활성화', tone: 'success' },
    'user.create': { label: '계정 생성', tone: 'brand' },
  }[action]) || { label: action || '—', tone: 'neutral' };
}

// 감사 로그 미니 리스트 (대시보드용). rows: null=loading, []=empty.
function AuditMiniList({ rows }) {
  if (rows === null) return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2].map(i => <Skeleton key={i} height={32}/>)}</div>;
  if (!rows.length) return <EmptyState icon={<IcDoc size={22}/>} title="기록된 감사 로그가 없어요" body="관리자가 계정을 조치하면 여기에 표시돼요."/>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((a, i) => {
        const meta = auditActionMeta(a.action);
        return (
          <div key={a.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < rows.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
            <Chip tone={meta.tone} size="sm">{meta.label}</Chip>
            <span style={{ flex: 1, minWidth: 0, fontSize: 12, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{a.summary}</span>
            <span className="num" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{fmtDateTime(a.createdAt)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────
function AdminSidebar({ activeId, onChange }) {
  const [ok, setOk] = React.useState(null); // null=확인 중, true/false=실제 상태
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch('/admin/system/health');
        const svc = (res && res.data && res.data.services) || {};
        const allOk = ['api','db','redis','sse'].every(k => !svc[k] || svc[k].status === 'ok');
        if (alive) setOk(allOk);
      } catch (e) { if (alive) setOk(false); }
    })();
    return () => { alive = false; };
  }, []);
  const health = ok === null
    ? { bg: 'rgba(148,163,184,0.15)', fg: '#94A3B8', dot: '#94A3B8', label: '상태 확인 중…' }
    : ok
      ? { bg: 'rgba(34,197,94,0.12)', fg: '#86EFAC', dot: '#22C55E', label: '모든 시스템 정상' }
      : { bg: 'rgba(245,158,11,0.14)', fg: '#FCD34D', dot: '#F59E0B', label: '점검 필요' };
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: '#101727',
      color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcShield size={16} color="#fff"/>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>진로나침반</div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>Super Admin</div>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }} className="toss-scroll">
        {ADMIN_NAV.map(group => (
          <div key={group.section}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px 6px' }}>{group.section}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map(it => {
                const active = activeId === it.id;
                return (
                  <button key={it.id} onClick={() => onChange(it.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', border: 'none', borderRadius: 8,
                    background: active ? 'rgba(49,130,246,0.18)' : 'transparent',
                    color: active ? '#7AB4FF' : '#CBD5E1',
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}>
                    {React.cloneElement(it.icon, { size: 16 })}
                    <span>{it.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div style={{ flex: 1 }}/>
      <div style={{
        padding: 10, background: health.bg, borderRadius: 8,
        fontSize: 11, color: health.fg, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: health.dot }}/>
        {health.label}
      </div>
    </aside>
  );
}

function AdminTopbar({ title, subtitle, action }) {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => { try { const r = await adminFetch('/auth/me'); if (alive) setMe((r && r.data) || r || {}); } catch (e) { if (alive) setMe({}); } })();
    return () => { alive = false; };
  }, []);
  const adminName = (me && me.name) || '관리자';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px',
      borderBottom: '1px solid var(--line-subtle)',
      background: 'var(--bg-surface)',
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {action}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', background: 'var(--bg-muted)', borderRadius: 10,
          fontSize: 12, color: 'var(--fg-muted)',
        }}>
          <Avatar name={adminName[0]} size={22}/>
          <span style={{ fontWeight: 600, color: 'var(--fg-strong)' }}>{adminName}</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Admin dashboard
// ────────────────────────────────────────────────────────
function AdminDashboard({ go }) {
  const isMobile = useViewportMobile();
  const [stats, setStats] = React.useState(null); // null=loading
  const [recent, setRecent] = React.useState(null); // null=loading
  const [audit, setAudit] = React.useState(null); // null=loading
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await adminFetch('/admin/stats');
        if (alive) setStats((res && res.data) || {});
      } catch (e) { if (alive) { setStats({}); setErr(true); } }
    })();
    (async () => {
      try {
        const res = await adminFetch('/admin/ai-usage');
        if (alive) setRecent(((res && res.data && res.data.recent) || []));
      } catch (e) { if (alive) setRecent([]); }
    })();
    (async () => {
      try {
        const res = await adminFetch('/admin/audit-logs?limit=6');
        if (alive) setAudit((res && res.data) || []);
      } catch (e) { if (alive) setAudit([]); }
    })();
    return () => { alive = false; };
  }, []);

  const loading = stats === null;
  const u = (stats && stats.users) || {};
  const ai = (stats && stats.ai) || {};
  const c = (stats && stats.content) || {};
  const n = (v) => (v == null ? 0 : v).toLocaleString();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="운영 대시보드" subtitle="실시간 집계 기준"/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-canvas)' }}>
        {/* KPI grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: 12, marginBottom: 16 }}>
            {[0,1,2,3,4,5].map(i => <Card key={i} padding={18}><Skeleton width="60%" height={12}/><Skeleton width="40%" height={24} style={{ marginTop: 12 }}/></Card>)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: 12, marginBottom: 16 }}>
            <MetricCard label="총 사용자" value={n(u.total)} icon={<IcUsers size={16}/>}/>
            <MetricCard label="학생" value={n(u.students)} icon={<IcUser size={16}/>}/>
            <MetricCard label="교사" value={n(u.teachers)} icon={<IcGraduation size={16}/>}/>
            <MetricCard label="AI 세션" value={n(ai.sessions)} icon={<IcSparkles size={16}/>}/>
            <MetricCard label="리포트" value={n(ai.reports)} icon={<IcStar size={16}/>}/>
            <MetricCard label="학과 데이터" value={n(c.departments)} icon={<IcServer size={16}/>}/>
          </div>
        )}

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <MetricCard label="활성 사용자" value={n(u.active)} icon={<IcUsers size={16}/>}/>
            <MetricCard label="봉사 데이터" value={n(c.volunteers)} icon={<IcMessage size={16}/>}/>
            <MetricCard label="장학금 데이터" value={n(c.scholarships)} icon={<IcCreditCard size={16}/>}/>
            <MetricCard label="해외대학 데이터" value={n(c.foreignUniv)} icon={<IcGraduation size={16}/>}/>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="최근 AI 상담 세션" subtitle="세션 메타데이터 (내용 비공개)"
              action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => go && go('ai-usage')}>전체</Button>}
            >
              <RecentSessions recent={recent} mini/>
            </SectionCard>
            <SectionCard title="감사 로그" subtitle="최근 관리자 조치"
              action={<Button variant="ghost" size="sm" trailing={<IcChevronRight size={14}/>} onClick={() => go && go('audit-logs')}>전체</Button>}
            >
              <AuditMiniList rows={audit}/>
            </SectionCard>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionCard title="콘텐츠 데이터" padding={18}>
              {loading ? <Skeleton height={120}/> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '학과', value: c.departments, icon: <IcServer size={14}/> },
                    { label: '성적 레코드', value: c.grades, icon: <IcStar size={14}/> },
                    { label: '봉사활동', value: c.volunteers, icon: <IcMessage size={14}/> },
                    { label: '장학금', value: c.scholarships, icon: <IcCreditCard size={14}/> },
                    { label: '해외대학', value: c.foreignUniv, icon: <IcGraduation size={14}/> },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--fg-strong)' }}>{s.label}</div>
                      <span className="num" style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{n(s.value)}건</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="AI 상담 집계" padding={18}>
              {loading ? <Skeleton height={80}/> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: '총 세션', value: ai.sessions },
                    { label: '총 메시지', value: ai.messages },
                    { label: '생성된 리포트', value: ai.reports },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                      <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{s.label}</span>
                      <span className="num" style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{n(s.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// 최근 AI 상담 세션 목록 (대시보드/상담 화면 공용). recent: null=loading, []=empty.
function RecentSessions({ recent, mini }) {
  if (recent === null) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0,1,2].map(i => <Skeleton key={i} height={40}/>)}</div>;
  }
  if (!recent.length) {
    return <EmptyState icon={<IcMessage size={22}/>} title="최근 상담 세션이 없어요" body="학생이 AI 상담을 시작하면 여기에 표시돼요."/>;
  }
  const items = mini ? recent.slice(0, 5) : recent;
  const sChip = (s) => ({
    active: <Chip tone="info" size="sm">진행</Chip>,
    completed: <Chip tone="success" size="sm">완료</Chip>,
    report_ready: <Chip tone="success" size="sm">리포트 완료</Chip>,
  }[s] || <Chip tone="neutral" size="sm">{s || '—'}</Chip>);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => (
        <div key={it.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < items.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
          <Avatar name={(it.student || '?').slice(0,1)} size={32}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }}>{it.student || '익명'}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>메시지 {it.messages ?? 0} · 단서 {it.signals ?? 0}</div>
          </div>
          {sChip(it.status)}
          <span className="num" style={{ fontSize: 11, color: 'var(--fg-subtle)', minWidth: 92, textAlign: 'right' }}>{fmtDateTime(it.startedAt)}</span>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Users
// ────────────────────────────────────────────────────────
function AdminUsers() {
  const isMobile = useViewportMobile();
  const [q, setQ] = React.useState('');
  const [role, setRole] = React.useState('all');
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [rows, setRows] = React.useState(null); // null=loading
  const [total, setTotal] = React.useState(null);

  const load = React.useCallback(async () => {
    setRows(null);
    try {
      const params = new URLSearchParams();
      if (role !== 'all') params.set('role', role);
      if (q.trim()) params.set('q', q.trim());
      params.set('limit', '50');
      const res = await adminFetch('/admin/users?' + params.toString());
      const list = (res && res.data) || [];
      setRows(list);
      setTotal((res && res.meta && res.meta.count != null) ? res.meta.count : list.length);
    } catch (e) { setRows([]); setTotal(0); }
  }, [q, role]);

  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  const loading = rows === null;
  const list = rows || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar
        title="사용자"
        subtitle={loading ? '불러오는 중…' : `현재 ${total != null ? total : list.length}건 표시`}
        action={<>
          <Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('사용자 목록', ['이름','이메일','역할','학교','학급','가입일','상태'], list.map(u => [u.name, u.email, u.role, u.school || '', u.classroom || '', fmtDate(u.createdAt), u.status]), { '역할': role === 'all' ? '전체' : role })}>PDF 내보내기</Button>
          <Button variant="primary" size="sm" leading={<IcPlus size={14}/>} onClick={() => setAddOpen(true)}>사용자 추가</Button>
        </>}
      />
      <div style={{ padding: isMobile ? '14px 16px 8px' : '16px 24px 12px', display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-canvas)', flexWrap: 'wrap' }}>
        <TextInput value={q} onChange={setQ} placeholder="이름, 이메일 검색" leading={<IcSearch size={16}/>} style={{ flex: 1, minWidth: isMobile ? 140 : 0, maxWidth: isMobile ? '100%' : 320, height: 40 }}/>
        <Tabs items={[
          { id: 'all', label: '전체' },
          { id: 'student', label: '학생' },
          { id: 'teacher', label: '교사' },
          { id: 'admin', label: '관리자' },
        ]} activeId={role} onChange={setRole}/>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: isMobile ? '0 12px 20px' : '0 24px 24px', background: 'var(--bg-canvas)' }}>
        <Card padding={0} style={{ minWidth: isMobile ? 0 : 880 }}>
          <div style={{
            display: isMobile ? 'none' : 'grid', gridTemplateColumns: '2.2fr 1fr 1.4fr 1.2fr 1.2fr 1fr 36px',
            padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)',
            textTransform: 'uppercase', letterSpacing: 0.3,
            borderBottom: '1px solid var(--line-subtle)',
          }}>
            <span>사용자</span>
            <span>역할</span>
            <span>학교</span>
            <span>학급</span>
            <span>가입일</span>
            <span>상태</span>
            <span/>
          </div>
          {loading ? (
            [0,1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}>
                <Skeleton width={32} height={32} radius={16}/>
                <Skeleton width="40%" height={14}/>
              </div>
            ))
          ) : list.length === 0 ? (
            <div style={{ padding: 24 }}><EmptyState icon={<IcUsers size={22}/>} title="표시할 사용자가 없어요" body={q.trim() ? '검색 조건을 바꿔보세요.' : '아직 가입한 사용자가 없어요.'}/></div>
          ) : list.map((u, i) => isMobile ? (
            <div key={u.id} onClick={() => setSelectedUser(u)} style={{
              padding: '12px 14px', borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={(u.name || '?').slice(0,1)} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                {roleChip(u.role)}
                <IcChevronRight size={16} color="var(--fg-subtle)"/>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
                {statusChip(u.status)}
                <span>{[u.school, u.classroom].filter(Boolean).join(' · ') || '학교 미정'}</span>
                <span className="num">· {fmtDate(u.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div key={u.id} onClick={() => setSelectedUser(u)} style={{
              display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.4fr 1.2fr 1.2fr 1fr 36px',
              padding: '14px 20px', alignItems: 'center', fontSize: 13,
              borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none',
              cursor: 'pointer', transition: 'background 120ms',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={(u.name || '?').slice(0,1)} size={32}/>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{u.email}</div>
                </div>
              </div>
              <div>{roleChip(u.role)}</div>
              <div style={{ color: 'var(--fg-default)' }}>{u.school || '—'}</div>
              <div style={{ color: 'var(--fg-default)' }}>{u.classroom || '—'}</div>
              <div className="num" style={{ color: 'var(--fg-muted)', fontSize: 12 }}>{fmtDate(u.createdAt)}</div>
              <div>{statusChip(u.status)}</div>
              <IcChevronRight size={16} color="var(--fg-subtle)"/>
            </div>
          ))}
        </Card>
      </div>
      {selectedUser && <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} onChanged={load}/>}
      {addOpen && <AddUserDialog onClose={() => setAddOpen(false)} onChanged={load}/>}
    </div>
  );
}

function AddUserDialog({ onClose, onChanged }) {
  const [f, setF] = React.useState({ name: '', email: '', role: 'student' });
  const [busy, setBusy] = React.useState(false);
  const [created, setCreated] = React.useState(null); // 생성 성공 시 { email, tempPassword, ... }
  const trapRef = useFocusTrap(true, onClose);
  const can = f.name.trim() && f.email.includes('@');

  const submit = async () => {
    if (!can || busy) return;
    setBusy(true);
    try {
      const res = await window.__apiFetch('/admin/users', { method: 'POST', body: JSON.stringify({ name: f.name.trim(), email: f.email.trim(), role: f.role }) });
      setCreated((res && res.data) || {});
      showToast('사용자를 생성했어요', 'success');
      onChanged && onChanged();
    } catch (e) {
      showToast((e && e.body && e.body.message) || '생성하지 못했어요', 'error');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="사용자 추가" style={{ position: 'relative', width: 420, maxWidth: '94%', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>사용자 추가</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        {created ? (
          <div>
            <div style={{ padding: 14, background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 10, fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
              ✓ <b>{created.name}</b> ({created.email}) 계정을 생성했어요.<br/>
              아래 <b>임시 비밀번호</b>를 본인에게 전달하세요. 첫 로그인 후 변경을 안내해주세요.
            </div>
            <FormField label="임시 비밀번호" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <TextInput value={created.tempPassword || ''} onChange={() => {}} readOnly style={{ flex: 1, fontFamily: 'monospace' }}/>
                <Button variant="outline" onClick={() => { try { navigator.clipboard.writeText(created.tempPassword || ''); showToast('복사했어요', 'success'); } catch (e) {} }}>복사</Button>
              </div>
            </FormField>
            <Button variant="primary" full onClick={onClose}>완료</Button>
          </div>
        ) : (
          <>
            <FormField label="이름" required style={{ marginBottom: 14 }}><TextInput value={f.name} onChange={(v) => setF(s => ({ ...s, name: v }))} placeholder="예) 김민지"/></FormField>
            <FormField label="이메일" required style={{ marginBottom: 14 }}><TextInput value={f.email} onChange={(v) => setF(s => ({ ...s, email: v }))} placeholder="email@example.com" type="email"/></FormField>
            <FormField label="역할" style={{ marginBottom: 20 }}>
              <Tabs items={[{id:'student',label:'학생'},{id:'teacher',label:'교사'},{id:'admin',label:'관리자'}]} activeId={f.role} onChange={(v) => setF(s => ({ ...s, role: v }))}/>
            </FormField>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={onClose}>취소</Button>
              <Button variant="primary" full disabled={!can || busy} onClick={submit}>{busy ? '생성 중…' : '생성하기'}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UserDetailDrawer({ user, onClose, onChanged }) {
  const [confirmDisable, setConfirmDisable] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const trapRef = useFocusTrap(true, onClose);
  const doAction = async (action) => {
    if (busy) return;
    setBusy(true);
    try {
      await window.__apiFetch(`/admin/users/${user.id}/${action}`, { method: 'POST', body: JSON.stringify({ reason: reason.trim() || undefined }) });
      showToast(action === 'disable' ? '계정을 비활성화했어요' : '계정을 활성화했어요', 'success');
      onChanged && onChanged();
      onClose();
    } catch (e) {
      showToast((e && e.body && e.body.message) || '처리하지 못했어요', 'error');
    } finally { setBusy(false); setConfirmDisable(false); }
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.4)', animation: 'fadeIn 200ms' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label={`${user.name} 상세`} style={{
        position: 'relative', width: 'min(480px, 100vw)',
        background: 'var(--bg-elevated)', height: '100%',
        boxShadow: 'var(--shadow-pop)', overflow: 'auto',
        animation: 'slideRight 280ms var(--ease-toss)',
      }} className="toss-scroll">
        <style>{`@keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        {/* Header */}
        <div style={{ padding: 24, borderBottom: '1px solid var(--line-subtle)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={(user.name || '?').slice(0,1)} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'monospace' }}>{user.id}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {roleChip(user.role)}{statusChip(user.status)}
            </div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose}/>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard title="기본 정보" padding={18}>
            <KVRow k="이메일" v={user.email}/>
            <KVRow k="가입일" v={fmtDate(user.createdAt)}/>
            <KVRow k="학교" v={user.school || '—'}/>
            <KVRow k="학급" v={user.classroom || '—'}/>
            {user.grade != null && <KVRow k="학년" v={String(user.grade)}/>}
          </SectionCard>
          <SectionCard title="계정 상태 관리" padding={18}>
            <FormField label="사유 (선택 · 감사 로그에 기록)" style={{ marginBottom: 12 }}>
              <TextInput value={reason} onChange={setReason} placeholder="예) 약관 위반 신고 접수"/>
            </FormField>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user.status === 'disabled'
                ? <Button variant="primary" size="md" full disabled={busy} onClick={() => doAction('enable')} leading={<IcRefresh size={14}/>}>{busy ? '처리 중…' : '계정 활성화'}</Button>
                : <Button variant="danger" size="md" full disabled={busy} onClick={() => setConfirmDisable(true)} leading={<IcLock size={14}/>}>계정 비활성화</Button>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.5 }} className="kr-heading">
              조치는 즉시 적용되며 감사 로그에 기록돼요. 본인 계정은 비활성화할 수 없어요.
            </div>
          </SectionCard>
        </div>
      </div>
      <ConfirmDialog
        open={confirmDisable}
        title={`${user.name}님을 비활성화할까요?`}
        body="비활성화하면 해당 사용자는 로그인할 수 없어요. 사유는 감사 로그에 기록됩니다."
        confirmLabel={busy ? '처리 중…' : '비활성화'}
        cancelLabel="취소"
        danger
        onConfirm={() => doAction('disable')}
        onCancel={() => setConfirmDisable(false)}
      />
    </div>
  );
}

function KVRow({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13, borderBottom: '1px solid var(--line-subtle)' }}>
      <span style={{ color: 'var(--fg-muted)' }}>{k}</span>
      <span style={{ color: 'var(--fg-strong)', fontWeight: 600 }}>{v}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Payments
// ────────────────────────────────────────────────────────
function AdminPayments() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="결제 이벤트" subtitle="결제 연동 준비 중"/>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', padding: 24 }}>
        <Card padding={32} style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <EmptyState
            icon={<IcCreditCard size={24}/>}
            title="결제 연동은 준비 중이에요"
            body="현재는 무료 체험 모드로 운영돼요. 결제·환불·Webhook 데이터는 결제 PG 연동 후 제공됩니다."
          />
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Audit logs
// ────────────────────────────────────────────────────────
function AdminAuditLogs() {
  const isMobile = useViewportMobile();
  const [rows, setRows] = React.useState(null); // null=loading
  const load = React.useCallback(async () => {
    setRows(null);
    try { const res = await adminFetch('/admin/audit-logs?limit=100'); setRows((res && res.data) || []); }
    catch (e) { setRows([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const loading = rows === null;
  const list = rows || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="감사 로그" subtitle={loading ? '불러오는 중…' : `최근 ${list.length}건의 관리자 조치`}
        action={<Button variant="outline" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>새로고침</Button>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: isMobile ? '12px' : 24, background: 'var(--bg-canvas)' }}>
        <Card padding={0} style={{ minWidth: isMobile ? 0 : 820 }}>
          <div style={{ display: isMobile ? 'none' : 'grid', gridTemplateColumns: '170px 120px 1.6fr 1.4fr', padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: 0.3, borderBottom: '1px solid var(--line-subtle)' }}>
            <span>시각</span><span>조치</span><span>내용</span><span>수행자 · 사유</span>
          </div>
          {loading ? (
            [0,1,2,3,4].map(i => <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-subtle)' }}><Skeleton width="55%" height={14}/></div>)
          ) : list.length === 0 ? (
            <div style={{ padding: 24 }}><EmptyState icon={<IcDoc size={22}/>} title="기록된 감사 로그가 없어요" body="관리자가 계정을 비활성화·활성화·생성하면 사유와 함께 여기에 기록돼요."/></div>
          ) : list.map((a, i) => {
            const meta = auditActionMeta(a.action);
            return isMobile ? (
              <div key={a.id || i} style={{ padding: '12px 16px', borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Chip tone={meta.tone} size="sm">{meta.label}</Chip>
                  <span className="num" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{fmtDateTime(a.createdAt)}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-strong)' }} className="kr-heading">{a.summary}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{a.actor}{a.reason ? ` · ${a.reason}` : ''}</div>
              </div>
            ) : (
              <div key={a.id || i} style={{ display: 'grid', gridTemplateColumns: '170px 120px 1.6fr 1.4fr', padding: '14px 20px', alignItems: 'center', fontSize: 13, borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                <span className="num" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{fmtDateTime(a.createdAt)}</span>
                <span><Chip tone={meta.tone} size="sm">{meta.label}</Chip></span>
                <span style={{ color: 'var(--fg-strong)' }} className="kr-heading">{a.summary}</span>
                <span style={{ color: 'var(--fg-muted)', fontSize: 12 }}>{a.actor}{a.reason ? ` · ${a.reason}` : ''}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: System health (expanded)
// ────────────────────────────────────────────────────────
function AdminSystem() {
  const isMobile = useViewportMobile();
  const [data, setData] = React.useState(null); // null=loading
  const [err, setErr] = React.useState(false);

  const load = React.useCallback(async () => {
    setErr(false); setData(null);
    try {
      const res = await adminFetch('/admin/system/health');
      setData((res && res.data) || {});
    } catch (e) { setErr(true); setData({}); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const statusTone = (s) => s === 'ok' ? 'success' : s === 'down' ? 'danger' : (s === 'preparing' || s === 'planned') ? 'neutral' : 'warning';
  const statusLabel = (s) => s === 'ok' ? 'OK' : s === 'down' ? '다운' : s === 'preparing' ? '준비 중' : (s || '—');

  if (data === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AdminTopbar title="시스템 상태" subtitle="불러오는 중…"/>
        <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-canvas)' }}>
          <Skeleton height={100} style={{ marginBottom: 16 }}/>
          <Skeleton height={140} style={{ marginBottom: 16 }}/>
          <Skeleton height={120}/>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AdminTopbar title="시스템 상태" subtitle="확인 불가"
          action={<Button variant="outline" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>새로고침</Button>}/>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', padding: 24 }}>
          <Card padding={32} style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
            <EmptyState icon={<IcServer size={24}/>} title="시스템 상태를 확인할 수 없어요" body="헬스 엔드포인트에 연결하지 못했어요. 잠시 후 다시 시도해주세요."
              action={<Button variant="secondary" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>다시 시도</Button>}/>
          </Card>
        </div>
      </div>
    );
  }

  const build = data.build || {};
  const svc = data.services || {};
  const res = data.resources || {};
  const ai = svc.aiProvider || {};
  const recentErrors = data.recentErrors || [];
  const recentDeploys = data.recentDeploys || [];
  const allOk = ['api','db','redis','sse'].every(k => !svc[k] || svc[k].status === 'ok');

  const serviceCards = [
    svc.api && { name: 'API 서버', status: statusLabel(svc.api.status), detail: '애플리케이션 서버', icon: <IcServer/>, tone: statusTone(svc.api.status) },
    svc.db && { name: 'DB (PostgreSQL)', status: statusLabel(svc.db.status), detail: 'Prisma · SELECT 1 헬스체크', icon: <IcDb/>, tone: statusTone(svc.db.status) },
    svc.redis && { name: 'Redis', status: statusLabel(svc.redis.status), detail: 'PING 헬스체크', icon: <IcZap/>, tone: statusTone(svc.redis.status) },
    svc.queue && { name: 'BullMQ Queue', status: statusLabel(svc.queue.status), detail: `대기 ${svc.queue.pendingJobs ?? 0} · 실패 ${svc.queue.failedJobs ?? 0}`, icon: <IcRefresh/>, tone: statusTone(svc.queue.status) },
    svc.sse && { name: 'SSE', status: statusLabel(svc.sse.status), detail: '스트리밍 연결', icon: <IcWifi/>, tone: statusTone(svc.sse.status) },
  ].filter(Boolean);

  const providerCards = [
    ai.primary && { name: 'AI Provider', status: statusLabel(ai.primary.status), detail: `${ai.primary.name || '—'}${ai.fallback ? ' · fallback ' + (ai.fallback.name || '') : ''}`, icon: <IcSparkles/>, tone: statusTone(ai.primary.status) },
    svc.paymentProvider && { name: '결제 Provider', status: svc.paymentProvider.mode === 'preparing' ? '준비 중' : statusLabel(svc.paymentProvider.status), detail: `${svc.paymentProvider.name || 'none'}${svc.paymentProvider.mode ? ' · ' + svc.paymentProvider.mode : ''}`, icon: <IcCreditCard/>, tone: svc.paymentProvider.mode === 'preparing' ? 'warning' : statusTone(svc.paymentProvider.status) },
    svc.oauth && { name: 'OAuth', status: '—', detail: `Google ${statusLabel((svc.oauth.google||{}).status)} · 카카오 ${statusLabel((svc.oauth.kakao||{}).status)}`, icon: <IcGoogle/>, tone: 'neutral' },
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="시스템 상태" subtitle="배포 환경 · 서비스 · 외부 의존성 · 리소스"
        action={<><Button variant="outline" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>새로고침</Button><Chip tone={allOk ? 'success' : 'warning'} size="md" leading={<IcDot size={6}/>}>{allOk ? '모든 시스템 정상' : '점검 필요'}</Chip></>}
      />
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-canvas)' }}>
        <SectionCard title="배포 / 런타임" subtitle="현재 라이브 환경" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: 10 }}>
            <InfoTile label="배포 버전" value={build.version || '—'} tone="success"/>
            <InfoTile label="Git SHA" value={build.gitSha || '—'} mono/>
            <InfoTile label="환경" value={build.env || '—'}/>
            <InfoTile label="Node 버전" value={build.nodeVersion || '—'} mono/>
            <InfoTile label="Uptime" value={build.uptimeSec != null ? `${Math.floor(build.uptimeSec/3600)}h ${Math.floor((build.uptimeSec%3600)/60)}m` : '—'} sub={build.region ? `region ${build.region}` : ''}/>
          </div>
        </SectionCard>

        {serviceCards.length > 0 && (
          <SectionCard title="서비스 상태" subtitle="API · DB · Redis · Queue · SSE" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
              {serviceCards.map((s, i) => <ServiceCard key={i} {...s}/>)}
            </div>
          </SectionCard>
        )}

        {providerCards.length > 0 && (
          <SectionCard title="외부 Provider" subtitle="AI · 결제 · OAuth" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
              {providerCards.map((s, i) => <ServiceCard key={i} {...s}/>)}
            </div>
          </SectionCard>
        )}

        {res.memory && (
          <SectionCard title="리소스 사용량" subtitle="프로세스" style={{ marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 10 }}>
              <InfoTile label="RSS 메모리" value={`${res.memory.usedMB ?? 0} MB`}/>
              <InfoTile label="Heap 사용량" value={`${res.memory.heapMB ?? 0} MB`}/>
              <InfoTile label="CPU 코어" value={String((res.cpu && res.cpu.cores) ?? '—')}/>
            </div>
          </SectionCard>
        )}

        <SectionCard title="최근 오류" subtitle="최근 24시간" style={{ marginBottom: 16 }}>
          {recentErrors.length === 0 ? (
            <EmptyState icon={<IcServer size={22}/>} title="기록된 오류가 없어요" body="최근 오류 집계 데이터가 비어 있어요."/>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentErrors.map((e, i, arr) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 160px 1fr 80px', padding: '12px 0', alignItems: 'center', fontSize: 12, borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none', gap: 12 }}>
                  <Chip tone={e.level === 'error' ? 'danger' : 'warning'} size="sm">{e.level || '—'}</Chip>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--fg-strong)' }}>{e.code || '—'}</span>
                  <span style={{ color: 'var(--fg-default)' }} className="kr-heading">{e.msg || ''}</span>
                  <span className="num" style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>{e.count != null ? `${e.count}회` : ''}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="최근 배포 기록" style={{ marginBottom: 16 }}>
          {recentDeploys.length === 0 ? (
            <EmptyState icon={<IcServer size={22}/>} title="배포 기록이 없어요" body="배포 이력 집계 데이터가 비어 있어요."/>
          ) : recentDeploys.map((d, i, arr) => (
            <div key={i} style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 16, borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
              <span className="num" style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-600)', fontSize: 13, minWidth: 70 }}>{d.v || d.version || '—'}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--fg-muted)', background: 'var(--bg-muted)', padding: '2px 6px', borderRadius: 4, minWidth: 70 }}>{d.sha || d.gitSha || ''}</span>
              <span style={{ fontSize: 13, color: 'var(--fg-strong)', flex: 1 }} className="kr-heading">{d.what || d.message || ''}</span>
              <span className="num" style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{fmtDateTime(d.when || d.at)}</span>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

function InfoTile({ label, value, sub, mono, tone }) {
  return (
    <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div className="num" style={{
        fontSize: 17, fontWeight: 800, color: tone === 'success' ? 'var(--success)' : 'var(--fg-strong)',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function ServiceCard({ name, status, detail, icon, tone }) {
  return (
    <Card padding={16}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `var(--${tone}-bg)`, color: `var(--${tone === 'neutral' ? 'fg-muted' : tone})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <Chip tone={tone} size="sm" leading={<IcDot size={6}/>}>{status}</Chip>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5 }} className="kr-heading">{detail}</div>
    </Card>
  );
}

function ResourceGauge({ label, value, max = 100, unit, detail }) {
  const pct = Math.min(100, (value / max) * 100);
  const tone = pct > 80 ? 'danger' : pct > 60 ? 'warning' : 'success';
  return (
    <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-default)' }}>{label}</span>
        <Chip tone={tone} size="sm">{tone === 'danger' ? '높음' : tone === 'warning' ? '주의' : '정상'}</Chip>
      </div>
      <div className="num" style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)' }}>{value}<span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>{unit || ''}</span></div>
      <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `var(--${tone})`, borderRadius: 999 }}/>
      </div>
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 6 }}>{detail}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Generic placeholder for less-priority admin routes
// ────────────────────────────────────────────────────────
function AdminPlaceholder({ title, subtitle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title={title} subtitle={subtitle}/>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <Card padding={32} style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <IcSparkles size={26}/>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">{title}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
            이 화면의 본격적 디자인은 백엔드 컨트랙트 확정 후 우선순위에 맞춰 진행됩니다.<br/>
            구조와 권한 가드는 이미 라우트에 반영돼 있어요.
          </div>
        </Card>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Main AdminApp
// ────────────────────────────────────────────────────────
function AdminApp({ initialScreen = 'dashboard' }) {
  const [screen, setScreen] = usePersistentScreen('admin', initialScreen);
  const isMobile = useViewportMobile();
  const [navOpen, setNavOpen] = React.useState(false);
  const wrapNav = (s) => { setScreen(s); setNavOpen(false); };
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {isMobile && <MobileTopBar title="진로나침반 · 관리자" onMenu={() => setNavOpen(true)}/>}
      {isMobile
        ? <SidebarDrawer open={navOpen} onClose={() => setNavOpen(false)}><AdminSidebar activeId={screen} onChange={wrapNav}/></SidebarDrawer>
        : <AdminSidebar activeId={screen} onChange={setScreen}/>}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, position: 'relative', overflowY: 'auto' }}>
        {screen === 'dashboard' && <AdminDashboard go={setScreen}/>}
        {screen === 'users' && <AdminUsers/>}
        {screen === 'payments' && <AdminPayments/>}
        {screen === 'audit-logs' && <AdminAuditLogs/>}
        {screen === 'system' && <AdminSystem/>}
        {screen === 'teachers' && <AdminTeachers/>}
        {screen === 'students' && <AdminStudents/>}
        {screen === 'classrooms' && <AdminClassrooms/>}
        {screen === 'subscriptions' && <AdminSubscriptions/>}
        {screen === 'ai-usage' && <AdminAIUsage/>}
        {screen === 'counseling' && <AdminCounseling/>}
        {screen === 'notifications' && <AdminNotifEvents/>}
        {screen === 'announcements' && <AdminAnnouncements/>}
        {screen === 'suggestions' && <AdminSuggestions/>}
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: 공지사항 (관리자 작성/삭제)
// ────────────────────────────────────────────────────────
function AdminAnnouncements() {
  const [rows, setRows] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const load = React.useCallback(async () => {
    setRows(null);
    try { const res = await adminFetch('/announcements?limit=100'); setRows((res && res.data) || []); }
    catch (e) { setRows([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  const del = async (id) => {
    try { await window.__apiFetch('/admin/announcements/' + id, { method: 'DELETE' }); showToast('공지를 삭제했어요', 'success'); load(); }
    catch (e) { showToast('삭제하지 못했어요', 'error'); }
  };
  const loading = rows === null; const list = rows || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="공지사항" subtitle={loading ? '불러오는 중…' : `${list.length}건 · 학생·교사에게 노출`}
        action={<Button variant="primary" size="sm" leading={<IcPlus size={14}/>} onClick={() => setAddOpen(true)}>새 공지</Button>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--bg-canvas)' }}>
        {loading ? <Skeleton height={100}/> : list.length === 0 ? (
          <Card padding={24}><EmptyState icon={<IcBell size={22}/>} title="등록된 공지가 없어요" body="새 공지를 작성하면 학생·교사 화면에 노출돼요."/></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map(a => (
              <Card key={a.id} padding={18}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      {a.pinned && <Chip tone="warning" size="sm">고정</Chip>}
                      <Chip tone="neutral" size="sm">{a.audience === 'all' ? '전체' : a.audience === 'student' ? '학생' : '교사'}</Chip>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{a.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg-default)', whiteSpace: 'pre-line', lineHeight: 1.6 }} className="kr-heading">{a.body}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8 }}>{a.author} · {fmtDateTime(a.createdAt)}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => del(a.id)}>삭제</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {addOpen && <AnnouncementDialog onClose={() => setAddOpen(false)} onSaved={() => { setAddOpen(false); load(); }}/>}
    </div>
  );
}

function AnnouncementDialog({ onClose, onSaved }) {
  const [f, setF] = React.useState({ title: '', body: '', audience: 'all', pinned: false });
  const [busy, setBusy] = React.useState(false);
  const trapRef = useFocusTrap(true, onClose);
  const can = f.title.trim() && f.body.trim();
  const submit = async () => {
    if (!can || busy) return; setBusy(true);
    try {
      await window.__apiFetch('/admin/announcements', { method: 'POST', body: JSON.stringify({ title: f.title.trim(), body: f.body.trim(), audience: f.audience, pinned: f.pinned }) });
      showToast('공지를 등록했어요', 'success'); onSaved && onSaved();
    } catch (e) { showToast((e && e.body && e.body.message) || '등록하지 못했어요', 'error'); }
    finally { setBusy(false); }
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="새 공지" style={{ position: 'relative', width: 520, maxWidth: '94%', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>새 공지 작성</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <FormField label="제목" required style={{ marginBottom: 14 }}><TextInput value={f.title} onChange={(v) => setF(s => ({ ...s, title: v }))} placeholder="공지 제목"/></FormField>
        <FormField label="내용" required style={{ marginBottom: 14 }}><Textarea value={f.body} onChange={(v) => setF(s => ({ ...s, body: v }))} rows={6} placeholder="공지 내용을 입력하세요"/></FormField>
        <FormField label="대상" style={{ marginBottom: 14 }}>
          <Tabs items={[{id:'all',label:'전체'},{id:'student',label:'학생'},{id:'teacher',label:'교사'}]} activeId={f.audience} onChange={(v) => setF(s => ({ ...s, audience: v }))}/>
        </FormField>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={f.pinned} onChange={(e) => setF(s => ({ ...s, pinned: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--brand-500)' }}/>
          상단 고정
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!can || busy} onClick={submit}>{busy ? '등록 중…' : '등록'}</Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: 건의사항 (사용자 제출 → 관리자 열람/상태변경)
// ────────────────────────────────────────────────────────
function AdminSuggestions() {
  const [rows, setRows] = React.useState(null);
  const [filter, setFilter] = React.useState('all');
  const load = React.useCallback(async () => {
    setRows(null);
    try { const res = await adminFetch('/admin/suggestions?limit=200'); setRows((res && res.data) || []); }
    catch (e) { setRows([]); }
  }, []);
  React.useEffect(() => { load(); }, [load]);
  const setStatus = async (id, status) => {
    try { await window.__apiFetch('/admin/suggestions/' + id, { method: 'PATCH', body: JSON.stringify({ status }) }); load(); }
    catch (e) { showToast('변경하지 못했어요', 'error'); }
  };
  const loading = rows === null;
  const list = (rows || []).filter(s => filter === 'all' || s.status === filter);
  const sChip = (s) => ({ open: <Chip tone="info" size="sm">접수</Chip>, reviewed: <Chip tone="warning" size="sm">검토중</Chip>, resolved: <Chip tone="success" size="sm">완료</Chip> }[s] || <Chip tone="neutral" size="sm">{s}</Chip>);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AdminTopbar title="건의사항" subtitle={loading ? '불러오는 중…' : `${list.length}건`}
        action={<Button variant="outline" size="sm" leading={<IcRefresh size={14}/>} onClick={load}>새로고침</Button>}/>
      <div style={{ padding: '16px 24px 8px', display: 'flex', gap: 8, background: 'var(--bg-canvas)' }}>
        <Tabs items={[{id:'all',label:'전체'},{id:'open',label:'접수'},{id:'reviewed',label:'검토중'},{id:'resolved',label:'완료'}]} activeId={filter} onChange={setFilter}/>
      </div>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px', background: 'var(--bg-canvas)' }}>
        {loading ? <Skeleton height={100}/> : list.length === 0 ? (
          <Card padding={24}><EmptyState icon={<IcMessage size={22}/>} title="건의사항이 없어요" body="학생·교사가 '건의하기'로 보내면 여기에 모여요."/></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(s => (
              <Card key={s.id} padding={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <Chip tone="neutral" size="sm">{s.category}</Chip>{sChip(s.status)}
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.author} ({s.role === 'teacher' ? '교사' : s.role === 'admin' ? '관리자' : '학생'}) · {fmtDateTime(s.createdAt)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg-strong)', whiteSpace: 'pre-line', lineHeight: 1.6 }} className="kr-heading">{s.body}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                    {s.status !== 'reviewed' && <Button variant="ghost" size="sm" onClick={() => setStatus(s.id, 'reviewed')}>검토중</Button>}
                    {s.status !== 'resolved' && <Button variant="ghost" size="sm" onClick={() => setStatus(s.id, 'resolved')}>완료</Button>}
                    {s.status !== 'open' && <Button variant="ghost" size="sm" onClick={() => setStatus(s.id, 'open')}>접수로</Button>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AdminApp });
