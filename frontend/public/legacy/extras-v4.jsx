// extras-v4.jsx — shared, reused across student/teacher & web/app for parity:
//   ReportViewer        full AI career report overlay (+ download placeholder)
//   EncouragementBanner rotating study-cheer message
//   GradeYearTabs       전체/1·2·3학년 selector
//   GradeHistoryView    year-aware grade view (mock 제거 → 빈 상태)

// ════════════════════════════════════════════════════════
// Report viewer (used by 리포트 보기 everywhere)
// ════════════════════════════════════════════════════════
function ReportViewer({ open, onClose, report = null, forTeacher = false }) {
  const trapRef = useFocusTrap(open, onClose);
  if (!open) return null;
  if (!report) {
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)', animation: 'fadeIn 200ms' }}/>
        <div ref={trapRef} role="dialog" aria-modal="true" aria-label="AI 진로 리포트" style={{
          position: 'relative', width: 'min(640px, 100%)', background: 'var(--bg-canvas)',
          boxShadow: 'var(--shadow-pop)', overflow: 'auto', display: 'flex', flexDirection: 'column',
        }} className="toss-scroll">
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-subtle)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <BackButton onClick={onClose}/>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }}>AI 진로 리포트</div>
          </div>
          <div style={{ padding: 20 }}>
            <EmptyState icon={<IcCompass size={22}/>} title="아직 생성된 리포트가 없어요" body="AI 상담을 충분히 진행하면 진로 리포트를 만들 수 있어요. 상담을 이어가 보세요."/>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)', animation: 'fadeIn 200ms' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="AI 진로 리포트" style={{
        position: 'relative', width: 'min(640px, 100%)', background: 'var(--bg-canvas)',
        boxShadow: 'var(--shadow-pop)', overflow: 'auto', animation: 'slideRight 300ms var(--ease-toss)',
        display: 'flex', flexDirection: 'column',
      }} className="toss-scroll">
        <style>{`@keyframes slideRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        {/* sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-surface)', borderBottom: '1px solid var(--line-subtle)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BackButton onClick={onClose}/>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }}>AI 진로 리포트</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{forTeacher ? report.student + ' · ' : ''}{report.generated} · 대화 {report.turns}회 기반</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" leading={<IcDownload size={14}/>} onClick={() => exportReportPDF('AI 진로 리포트', ['항목','내용'], [
              ['학생', report.student], ['생성일', report.generated], ['대화 횟수', report.turns + '회'],
              ['핵심 요약', report.headline], ['상세', report.summary],
              ...report.careers.map((c, i) => [`추천 직업 ${i+1}`, `${c.title} (${c.score}점) — ${c.why}`]),
              ['추천 학과', report.majors.join(' / ')],
              ['강점', report.strengths.join(', ')],
              ['유의점', report.risks.join(', ')],
              ['다음 활동', report.nextActions.join(' / ')],
            ], { '학생': report.student || '' })}>PDF 다운로드</Button>
            {!forTeacher && <Button variant="ghost" size="sm" leading={<IcShield size={14}/>} onClick={() => showToast('선생님께 공유했어요', 'success')}>공유</Button>}
          </div>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {forTeacher && (
            <div style={{ padding: 12, background: 'var(--warning-bg)', borderRadius: 10, fontSize: 12, color: 'var(--warning)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
              <IcShield size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
              <span className="kr-heading">학생 사전 동의 범위 내에서 열람 중이에요. 모든 열람은 기록됩니다.</span>
            </div>
          )}
          <Card padding={20} style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)' }}>
            <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>} style={{ marginBottom: 10 }}>1차 리포트</Chip>
            <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--fg-strong)', lineHeight: 1.3 }} className="kr-heading">{report.headline}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-default)', marginTop: 10, lineHeight: 1.6 }} className="kr-heading">{report.summary}</div>
          </Card>

          <SectionCard title="추천 직업">
            {report.careers.map((c, i) => (
              <div key={i} style={{ padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line-subtle)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5 }} className="kr-heading">{c.why}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 56 }}>
                  <div className="num" style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-600)' }}>{c.score}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-muted)' }}>%</span></div>
                  <div style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>적합도</div>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="대화에서 보인 단서">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.signals.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Chip tone={s.tone} size="sm">{s.tag}</Chip>
                  <span style={{ fontSize: 13, color: 'var(--fg-default)', flex: 1 }} className="kr-heading">{s.text}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SectionCard title="강점" padding={18}>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {report.strengths.map((s, i) => <li key={i} style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{s}</li>)}
              </ul>
            </SectionCard>
            <SectionCard title="유의할 점" padding={18}>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {report.risks.map((s, i) => <li key={i} style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{s}</li>)}
              </ul>
            </SectionCard>
          </div>

          <SectionCard title="추천 학과 · 대학">
            {report.majors.map((m, i) => (
              <div key={i} style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line-subtle)', fontSize: 14, color: 'var(--fg-strong)' }} className="kr-heading">{m}</div>
            ))}
          </SectionCard>

          <SectionCard title={forTeacher ? '상담 시 권장 액션' : '다음에 해보면 좋은 일'}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.nextActions.map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{t}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
            이 결과는 대화를 바탕으로 한 진로 탐색 참고자료예요. 최종 선택은 학생·보호자·교사 상담과 함께 결정하는 게 좋아요.
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// Encouragement banner (rotating)
// ════════════════════════════════════════════════════════
const STUDY_CHEERS = [
  '오늘 한 걸음이 내일의 점수예요 💪',
  '집중한 25분이 흘려보낸 2시간보다 강해요',
  '어제의 나보다 1문제만 더 풀어봐요',
  '꾸준함이 결국 재능을 이겨요',
  '지금 이 순간도 성장 중이에요',
  '작은 완료가 모여 큰 변화를 만들어요',
  '오늘 못한 건 괜찮아요. 내일 또 하면 돼요',
  '목표까지 한 칸씩, 잘 가고 있어요',
];

function EncouragementBanner({ compact = false }) {
  const [idx, setIdx] = React.useState(() => Math.floor(Math.random() * STUDY_CHEERS.length));
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % STUDY_CHEERS.length); setFade(true); }, 280);
    }, 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: compact ? '8px 12px' : '10px 14px',
      background: 'linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)',
      borderRadius: 10, marginBottom: 12,
    }}>
      <IcSparkles size={compact ? 13 : 15} color="var(--accent-purple)" style={{ flexShrink: 0 }}/>
      <span style={{
        fontSize: compact ? 12 : 13, fontWeight: 600, color: 'var(--brand-700)',
        opacity: fade ? 1 : 0, transition: 'opacity 280ms var(--ease-std)',
      }} className="kr-heading">{STUDY_CHEERS[idx]}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 3-year grade data + year-aware view
// ════════════════════════════════════════════════════════
const GRADE_SUBJECTS = ['국어', '수학', '영어', '사회', '과학'];
const gradeAvg = (r) => Math.round(GRADE_SUBJECTS.reduce((s, k) => s + (r[k] || 0), 0) / GRADE_SUBJECTS.length * 10) / 10;

function GradeYearTabs({ value, onChange }) {
  return (
    <Tabs
      items={[
        { id: 'all', label: '전 학년' },
        { id: '1', label: '1학년' },
        { id: '2', label: '2학년' },
        { id: '3', label: '3학년' },
      ]}
      activeId={value}
      onChange={onChange}
    />
  );
}

// Simple line chart for a series of {label, value}
function YearLineChart({ points, height = 150 }) {
  const w = 600, pad = 28;
  const vals = points.map(p => p.value);
  const max = Math.max(...vals) + 4, min = Math.min(...vals) - 6;
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1));
  const ys = points.map(p => height - 24 - ((p.value - min) / (max - min)) * (height - 50));
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height }}>
        <defs>
          <linearGradient id="yg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3182F6" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#3182F6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`${line} L${xs[xs.length-1]},${height-24} L${xs[0]},${height-24} Z`} fill="url(#yg)"/>
        <path d={line} fill="none" stroke="#3182F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r="4" fill="#fff" stroke="#3182F6" strokeWidth="2.5"/>
            <text x={x} y={ys[i] - 11} textAnchor="middle" fontSize="12" fontWeight="700" fill="#3182F6">{points[i].value}</text>
            <text x={x} y={height - 6} textAnchor="middle" fontSize="11" fill="#8B95A1">{points[i].label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Year-aware grade view. 전용 학생-지정 성적 엔드포인트가 없어, 가짜 3년 데이터 대신
// 정직한 빈 상태를 보여줘요. (학생 본인 성적은 학생 화면의 GradesTrend가 GET /grades로 처리)
function GradeHistoryView({ year, onYearChange, editable = false, onAddGrade }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionCard
        title="성적"
        action={editable ? <Button variant="primary" size="sm" leading={<IcPlus size={14}/>} onClick={onAddGrade}>성적 입력</Button> : null}
      >
        <div style={{ padding: '18px 4px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">아직 입력된 성적이 없어요.</div>
      </SectionCard>
    </div>
  );
}

Object.assign(window, {
  ReportViewer, EncouragementBanner, STUDY_CHEERS,
  GRADE_SUBJECTS, gradeAvg, GradeYearTabs, GradeHistoryView, YearLineChart,
  NotificationsScreen, WebNotifPopover, NotifBell,
});

// Web notification dropdown — anchored top-right; matches the unified style.
function WebNotifPopover({ open, onClose, role = 'student' }) {
  const [items, setItems] = React.useState(null); // null = loading
  React.useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/notifications', { method: 'GET' });
        if (alive) setItems((Array.isArray(r.data) ? r.data : []).map(mapNotif));
      } catch (e) {
        if (alive) setItems([]);
      }
    })();
    return () => { alive = false; };
  }, [open]);
  if (!open) return null;
  const loading = items === null;
  const list = items || [];
  const unread = list.filter(i => i.unread).length;
  const markAll = async () => {
    try { await window.__apiFetch('/notifications/read-all', { method: 'POST' }); } catch (e) {}
    setItems(its => (its || []).map(i => ({ ...i, unread: false })));
  };
  const openOne = async (id) => {
    try { await window.__apiFetch('/notifications/' + id + '/read', { method: 'PATCH' }); } catch (e) {}
    setItems(its => (its || []).map(i => i.id === id ? { ...i, unread: false } : i));
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40 }}/>
      <div style={{
        position: 'absolute', top: 60, right: 24, zIndex: 41, width: 380, maxHeight: '70%', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: 16, boxShadow: 'var(--shadow-pop)',
        animation: 'sheetIn 220ms var(--ease-toss)',
      }} className="toss-scroll">
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg-elevated)', padding: '14px 18px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)' }}>알림</span>
            <Chip tone="brand" size="sm">{unread}</Chip>
          </div>
          {unread > 0 && <button onClick={markAll} style={{ background: 'transparent', border: 'none', color: 'var(--brand-600)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>모두 읽음</button>}
        </div>
        {loading && <div style={{ padding: '24px 18px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>…</div>}
        {!loading && list.length === 0 && <div style={{ padding: '28px 18px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>아직 알림이 없어요</div>}
        {list.map((n, i) => (
          <div key={n.id} onClick={() => openOne(n.id)} style={{
            display: 'flex', gap: 10, padding: '13px 18px', cursor: 'pointer',
            borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none',
            background: n.unread ? 'rgba(49,130,246,0.025)' : 'transparent',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: notifToneBg(n.tone), color: notifToneFg(n.tone), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {React.cloneElement(n.icon, { size: 16 })}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{n.title}</span>
                <span style={{ fontSize: 10, color: 'var(--fg-subtle)', flexShrink: 0 }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.4 }} className="kr-heading">{n.body}</div>
            </div>
            {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 6, flexShrink: 0 }}/>}
          </div>
        ))}
      </div>
    </>
  );
}

// Bell button that owns its own popover state (for web topbars).
function NotifBell({ role = 'student', badge }) {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(badge != null ? badge : 0);
  React.useEffect(() => {
    if (badge != null) return;
    let alive = true;
    (async () => {
      try {
        const r = await window.__apiFetch('/notifications', { method: 'GET' });
        const list = Array.isArray(r.data) ? r.data : [];
        if (alive) setCount(list.filter(n => !n.read).length);
      } catch (e) {}
    })();
    return () => { alive = false; };
  }, [badge]);
  return (
    <>
      <IconButton icon={<IcBell size={20}/>} badge={count} ariaLabel="알림" onClick={() => setOpen(o => !o)}/>
      <WebNotifPopover open={open} onClose={() => setOpen(false)} role={role}/>
    </>
  );
}

// ════════════════════════════════════════════════════════
// Shared full-page notifications (student + teacher unified style)
// ════════════════════════════════════════════════════════
const notifToneBg = (t) => `var(--${t === 'brand' ? 'brand-50' : t === 'purple' ? 'accent-purple-bg' : t === 'success' ? 'success-bg' : t === 'warning' ? 'warning-bg' : t === 'info' ? 'info-bg' : 'neutral-bg'})`;
const notifToneFg = (t) => `var(--${t === 'brand' ? 'brand-500' : t === 'purple' ? 'accent-purple' : t === 'success' ? 'success' : t === 'warning' ? 'warning' : t === 'info' ? 'info' : 'neutral-fg'})`;

// createdAt(ISO) → 짧은 한국어 상대 시간.
const notifTimeAgo = (iso) => {
  if (!iso) return '방금';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return typeof iso === 'string' ? iso : '방금';
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return '방금';
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  return `${Math.floor(hr / 24)}일 전`;
};

// 알림 type → 아이콘/톤 매핑 (기본: 종 + brand).
const notifTypeMap = (type) => {
  const t = String(type || '');
  if (t.includes('message') || t.includes('counsel') || t.includes('memo')) return { icon: <IcMessage/>, tone: 'brand' };
  if (t.includes('report') || t.includes('ai')) return { icon: <IcSparkles/>, tone: 'purple' };
  if (t.includes('grade') || t.includes('chart') || t.includes('score')) return { icon: <IcChart/>, tone: 'info' };
  if (t.includes('join') || t.includes('accept') || t.includes('complete')) return { icon: <IcCheckCircle/>, tone: 'success' };
  if (t.includes('bill') || t.includes('pay') || t.includes('trial')) return { icon: <IcCreditCard/>, tone: 'neutral' };
  return { icon: <IcBell/>, tone: 'brand' };
};

// API 알림(raw) → UI 형태 { id, icon, tone, title, body, time, unread, targetUrl }.
const mapNotif = (n) => {
  const m = notifTypeMap(n.type);
  return {
    id: n.id, icon: m.icon, tone: m.tone,
    title: n.title || n.type || '알림', body: n.body || '',
    time: notifTimeAgo(n.createdAt), unread: !n.read, targetUrl: n.targetUrl,
  };
};

// `variant`: 'mobile' (header w/ back) | 'web' (embedded, no back)
function NotificationsScreen({ role = 'student', onBack, variant = 'mobile' }) {
  const [items, setItems] = React.useState(null); // null = loading
  React.useEffect(() => {
    let alive = true;
    (async () => {
      let list = [];
      try {
        const r = await window.__apiFetch('/notifications', { method: 'GET' });
        list = (Array.isArray(r.data) ? r.data : []).map(mapNotif);
      } catch (e) {}
      // student: surface teacher broadcasts as notifications
      if (role === 'student') {
        try {
          const bc = broadcastsForStudent('s1').map(b => ({
            id: 'bcn_' + b.id, icon: <IcCalendar/>, tone: 'info',
            title: `[선생님] ${b.title}`, body: b.body, time: b.createdAt ? notifTimeAgo(b.createdAt) : '방금', unread: true,
          }));
          list = [...bc, ...list];
        } catch (e) {}
      }
      if (alive) setItems(list);
    })();
    return () => { alive = false; };
  }, [role]);
  const loading = items === null;
  const list = items || [];
  const unread = list.filter(i => i.unread).length;
  const markAll = async () => {
    try { await window.__apiFetch('/notifications/read-all', { method: 'POST' }); } catch (e) {}
    setItems(its => (its || []).map(i => ({ ...i, unread: false })));
  };
  const open = async (id) => {
    if (typeof id === 'string' && id.indexOf('bcn_') === 0) {
      setItems(its => (its || []).map(i => i.id === id ? { ...i, unread: false } : i));
      return;
    }
    try { await window.__apiFetch('/notifications/' + id + '/read', { method: 'PATCH' }); } catch (e) {}
    setItems(its => (its || []).map(i => i.id === id ? { ...i, unread: false } : i));
  };
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      {variant === 'mobile' ? (
        <ScreenHeader title="알림" leading={onBack ? <BackButton onClick={onBack}/> : null}
          trailing={unread > 0 ? <button onClick={markAll} style={{ background: 'transparent', border: 'none', color: 'var(--brand-600)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>모두 읽음</button> : null}/>
      ) : (
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)' }}>알림</div>
          {unread > 0 && <button onClick={markAll} style={{ background: 'transparent', border: 'none', color: 'var(--brand-600)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>모두 읽음</button>}
        </div>
      )}
      <div style={{ padding: variant === 'web' ? '12px 24px 8px' : '0 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Chip tone="brand" size="sm">{unread}개 안 읽음</Chip>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--fg-subtle)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>실시간 연결됨 (SSE)
        </span>
      </div>
      <div style={{ padding: variant === 'web' ? '0 24px 24px' : '0 16px 24px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>…</div>
        ) : list.length === 0 ? (
          <Card padding={0}><div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }} className="kr-heading">아직 알림이 없어요</div></Card>
        ) : (
        <Card padding={0}>
          {list.map((n, i) => (
            <div key={n.id} onClick={() => open(n.id)} style={{
              display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer',
              borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none',
              background: n.unread ? 'rgba(49,130,246,0.025)' : 'transparent',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: notifToneBg(n.tone), color: notifToneFg(n.tone), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {React.cloneElement(n.icon, { size: 18 })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{n.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.45 }} className="kr-heading">{n.body}</div>
              </div>
              {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-500)', marginTop: 12, flexShrink: 0 }}/>}
            </div>
          ))}
        </Card>
        )}
      </div>
    </div>
  );
}
