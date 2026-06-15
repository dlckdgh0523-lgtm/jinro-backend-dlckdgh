// admissions.jsx — University search, university detail, department detail, gap analysis.
// Demonstrates the backend contract: every datum carries a "신뢰도" badge.
// Unavailable data shows a proper empty state — no invented numbers.

// ────────────────────────────────────────────────────────
// DEMO admissions data (would come from backend in production)
// Confidence levels: 'confirmed' | 'estimated' | 'unavailable'
// ────────────────────────────────────────────────────────
const REGIONS = ['전체', '서울', '경기·인천', '강원', '충청', '경상', '전라', '제주'];
const UNIV_TYPES = ['전체', '국립', '사립', '시립', '특수'];

const confidenceChip = (c) => ({
  confirmed: <Chip tone="success" size="sm" leading={<IcCheck size={10}/>}>확정 데이터</Chip>,
  estimated: <Chip tone="warning" size="sm" leading={<IcInfo size={10}/>}>추정 데이터</Chip>,
  unavailable: <Chip tone="neutral" size="sm">데이터 준비 중</Chip>,
}[c]);

// ────────────────────────────────────────────────────────
// SCREEN: Universities hub (search + filter + list)
// ────────────────────────────────────────────────────────
// 전역 __apiFetch(토큰 자동 갱신) 사용. 미정의 시 안전 폴백.
function admFetch(path) {
  if (typeof window !== 'undefined' && window.__apiFetch) return window.__apiFetch(path, { method: 'GET' });
  return fetch(((typeof window !== 'undefined' && window.VITE_API_BASE_URL) || '/v1') + path).then(r => r.json());
}

function AdmissionsHub({ go }) {
  const [tab, setTab] = React.useState('domestic'); // domestic | overseas
  const [q, setQ] = React.useState('');
  const [region, setRegion] = React.useState('전체');
  const [type, setType] = React.useState('전체');
  const [page, setPage] = React.useState(1);
  const [unis, setUnis] = React.useState(null); // null=loading
  const [meta, setMeta] = React.useState(null);
  const TYPE_MAP = { national: '국립', private: '사립', municipal: '공립', special: '특수' };
  const PAGE_SIZE = 20;

  // 서버 필터(지역 그룹/유형) + 페이지네이션
  const load = React.useCallback(async (opts) => {
    setUnis(null);
    try {
      const p = new URLSearchParams();
      if (opts.q && opts.q.trim()) p.set('q', opts.q.trim());
      if (opts.region && opts.region !== '전체') p.set('region', opts.region);
      if (opts.type && opts.type !== '전체') p.set('type', opts.type);
      p.set('page', String(opts.page || 1));
      p.set('limit', String(PAGE_SIZE));
      const res = await admFetch('/admissions/universities?' + p.toString());
      setUnis((res.data || []).map(u => ({
        id: u.id, name: u.name, short: u.short || u.name, region: u.region || '',
        type: TYPE_MAP[u.type] || u.type || '', deptCount: u.deptCount != null ? u.deptCount : '',
        confidence: u.confidence || 'confirmed', logoColor: 'var(--brand-500)',
      })));
      setMeta(res.meta || null);
    } catch (e) { setUnis([]); setMeta(null); }
  }, []);

  // 필터/페이지 변경 → 재조회 (검색 디바운스)
  React.useEffect(() => {
    const id = setTimeout(() => { load({ q, region, type, page }); }, 300);
    return () => clearTimeout(id);
  }, [q, region, type, page, load]);

  const onRegion = (r) => { setRegion(r); setPage(1); };
  const onType = (t) => { setType(t); setPage(1); };
  const onQ = (v) => { setQ(v); setPage(1); };

  const totalPages = (meta && meta.totalPages) || 1;
  const total = (meta && meta.total != null) ? meta.total : null;
  // 페이지 번호 창 (현재 ±2, 최대 5개)
  const pageWindow = (() => {
    const w = []; let s = Math.max(1, page - 2), e = Math.min(totalPages, s + 4); s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) w.push(i);
    return w;
  })();

  const TABS = [{ id: 'domestic', label: '국내 대학' }, { id: 'overseas', label: '해외대학' }];
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader
        title="대학 · 입시"
        subtitle="국내·해외 대학, 학과·경쟁률·취업률을 공공데이터로 확인하세요"
      />
      <div style={{ padding: '4px 16px 0', display: 'flex', gap: 6, borderBottom: '1px solid var(--line-subtle)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: 'none', background: 'none', cursor: 'pointer',
            padding: '8px 4px', marginRight: 12, fontSize: 14,
            fontWeight: tab === t.id ? 700 : 500,
            color: tab === t.id ? 'var(--brand-600)' : 'var(--fg-muted)',
            borderBottom: tab === t.id ? '2px solid var(--brand-500)' : '2px solid transparent',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'overseas' ? (
        <ForeignUnivScreen go={go} embedded/>
      ) : (
      <>
      <div style={{ padding: '12px 16px 0' }}>
        <TextInput value={q} onChange={onQ} placeholder="대학명 검색 (예: 서울대)" leading={<IcSearch size={16}/>}/>
      </div>

      {/* Filter chips (서버 재조회) */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <FilterRow label="지역" items={REGIONS} active={region} onChange={onRegion}/>
        <FilterRow label="유형" items={UNIV_TYPES} active={type} onChange={onType}/>
      </div>

      {/* List */}
      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            {unis === null ? '불러오는 중…' : (total != null ? `총 ${total}개 · ${page}/${totalPages}페이지` : `${(unis||[]).length}개`)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {unis === null
            ? [0,1,2,3].map(i => <Card key={i} padding={14}><Skeleton height={48}/></Card>)
            : unis.length === 0
              ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>조건에 맞는 대학이 없어요. 지역·유형·검색어를 바꿔보세요.</div>
              : unis.map(u => (
                  <UnivCard key={u.id} u={u} onClick={() => { window.__selectedUnivId = u.id; window.__selectedUnivName = u.name; go('admissions-univ'); }}/>
                ))}
        </div>

        {/* 페이지네이션 */}
        {unis !== null && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
            <PageBtn disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>이전</PageBtn>
            {pageWindow[0] > 1 && <><PageBtn onClick={() => setPage(1)}>1</PageBtn>{pageWindow[0] > 2 && <span style={{ color: 'var(--fg-subtle)', fontSize: 12 }}>…</span>}</>}
            {pageWindow.map(n => <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>{n}</PageBtn>)}
            {pageWindow[pageWindow.length-1] < totalPages && <>{pageWindow[pageWindow.length-1] < totalPages-1 && <span style={{ color: 'var(--fg-subtle)', fontSize: 12 }}>…</span>}<PageBtn onClick={() => setPage(totalPages)}>{totalPages}</PageBtn></>}
            <PageBtn disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>다음</PageBtn>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 34, height: 34, padding: '0 10px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
      border: '1px solid ' + (active ? 'var(--brand-500)' : 'var(--line-subtle)'),
      background: active ? 'var(--brand-500)' : 'var(--bg-surface)',
      color: active ? '#fff' : (disabled ? 'var(--fg-subtle)' : 'var(--fg-default)'),
      fontSize: 13, fontWeight: active ? 700 : 500, opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  );
}

function FilterRow({ label, items, active, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', minWidth: 28 }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, overflow: 'auto', flex: 1 }} className="toss-scroll">
        {items.map(it => (
          <button key={it} onClick={() => onChange(it)} style={{
            border: 'none', background: it === active ? 'var(--brand-500)' : 'var(--bg-surface)',
            color: it === active ? '#fff' : 'var(--fg-default)',
            padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
            boxShadow: it === active ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
          }}>{it}</button>
        ))}
      </div>
    </div>
  );
}

function UnivCard({ u, onClick }) {
  return (
    <Card padding={14} onClick={onClick} hoverable>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: u.logoColor, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, flexShrink: 0, letterSpacing: '-0.3px',
        }}>{u.short.slice(0, 3)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{u.region} · {u.type} · 학과 {u.deptCount}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {confidenceChip(u.confidence)}
          <IcChevronRight size={14} color="var(--fg-subtle)"/>
        </div>
      </div>
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: University detail (depts list)
// ────────────────────────────────────────────────────────
function UniversityDetail({ go }) {
  const univId = (typeof window !== 'undefined' && window.__selectedUnivId) || null;
  const univName = (typeof window !== 'undefined' && window.__selectedUnivName) || '대학';
  const [detail, setDetail] = React.useState(null); // 대학 상세 (admissions/employment/exchange/publicInfo)
  const [depts, setDepts] = React.useState(null);    // null=loading
  const [deptMeta, setDeptMeta] = React.useState(null);
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    if (!univId) return;
    (async () => {
      try {
        const d = await admFetch('/admissions/universities/' + univId);
        setDetail(d.data);
      } catch (e) { setDetail({}); }
      try {
        const dep = await admFetch('/admissions/universities/' + univId + '/departments?limit=300');
        setDepts(dep.data || []); setDeptMeta(dep.meta || null);
      } catch (e) { setDepts([]); }
    })();
  }, [univId]);

  const adm = detail && detail.admissions;
  const emp = detail && detail.employment;
  const exch = detail && detail.exchange;
  const filtered = (depts || []).filter(d => !q || (d.name || '').includes(q));

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="대학" leading={<BackButton onClick={() => go('admissions-hub')}/>}/>

      {/* University header + 실 입시 지표 */}
      <div style={{ padding: '0 16px 8px' }}>
        <Card padding={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>{(detail && detail.name || univName).slice(0, 2)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{detail && detail.name || univName}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{detail && detail.region || ''}</div>
            </div>
          </div>
          {/* 실 입시통계 칩 */}
          {adm && adm.confidence === 'confirmed' ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--line-subtle)' }}>
              {adm.ratio && <Chip tone="brand" size="sm">경쟁률 {adm.ratio}</Chip>}
              {adm.freshmanFillRate != null && <Chip tone="success" size="sm">충원율 {adm.freshmanFillRate}%</Chip>}
              {adm.finalRegistrationRate != null && <Chip tone="neutral" size="sm">등록률 {adm.finalRegistrationRate}%</Chip>}
              {emp && emp.confidence === 'confirmed' && emp.avgRate != null && <Chip tone="warning" size="sm">취업률 {emp.avgRate}%</Chip>}
              {exch && exch.confidence === 'confirmed' && exch.total > 0 && <Chip tone="purple" size="sm">교환학생 {exch.total}명</Chip>}
              {adm.svyYr && <Chip tone="neutral" size="sm">{adm.svyYr} 공시</Chip>}
            </div>
          ) : (
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--line-subtle)', fontSize: 12, color: 'var(--fg-muted)' }}>입시 경쟁률 데이터는 준비 중이에요.</div>
          )}
        </Card>
      </div>

      {/* Search depts */}
      <div style={{ padding: '12px 16px 0' }}>
        <TextInput value={q} onChange={setQ} placeholder="학과명으로 검색" leading={<IcSearch size={16}/>}/>
      </div>

      {/* Dept list */}
      <div style={{ padding: '16px 16px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>
          개설 학과 {depts === null ? '' : filtered.length}
        </div>
        {deptMeta && deptMeta.note && <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 10 }}>{deptMeta.note}</div>}

        {depts === null ? (
          [0,1,2].map(i => <Card key={i} padding={14} style={{ marginBottom: 6 }}><Skeleton height={32}/></Card>)
        ) : depts.length === 0 ? (
          <Card padding={20}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              이 대학은 학과 데이터가 아직 매칭되지 않았어요. 신생 대학·분교·대학원 중심 대학이거나 공시에 다른 이름으로 등록됐을 수 있어요. 대학 입학처에서 최신 모집요강을 확인해 주세요.
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<IcSearch size={20}/>} title="검색 결과가 없어요" body="다른 키워드로 검색해보세요."/>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.slice(0, 200).map(d => (
              <Card key={d.id} padding={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcGraduation size={16} color="var(--fg-muted)"/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{[d.college, d.track, d.degree].filter(Boolean).join(' · ')}</div>
                  </div>
                  {d.track && <Chip tone={d.track === '예체능' ? 'warning' : d.track === '자연' ? 'success' : 'brand'} size="sm">{d.track}</Chip>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="num" style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Department detail (admissions stats + gap)
// ────────────────────────────────────────────────────────
function DepartmentDetail({ go }) {
  // 전용 학과 상세 엔드포인트로 들어오는 진입점(선택된 학과 id)이 아직 없어요.
  // 가짜 예시 대신, 대학 화면에서 학과를 고르도록 안내하는 정직한 빈 상태를 보여줘요.
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="학과 정보" leading={<BackButton onClick={() => go('admissions-univ')}/>} trailing={<IconButton icon={<IcHeart size={20}/>} ariaLabel="관심학과"/>}/>

      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={8} style={{ marginBottom: 12 }}>
          <EmptyState
            icon={<IcGraduation size={22}/>}
            title="학과를 먼저 선택해주세요"
            body="대학 화면에서 학과를 고르면 모집·전형 정보를 보여드려요. 일부 학과는 공시 데이터가 준비되는 대로 추가돼요."
            action={<Button variant="primary" size="md" onClick={() => go('admissions-univ')}>대학·학과 보기</Button>}
          />
        </Card>

        {/* Gap analysis CTA */}
        <Card padding={20} style={{ background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)', marginBottom: 12 }}>
          <Chip tone="purple" size="sm" leading={<IcSparkles size={11}/>} style={{ marginBottom: 8 }}>AI 입시 분석</Chip>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">
            내 성적으로 이 학과까지 얼마나 더 채워야 할까요?
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 14, lineHeight: 1.5 }} className="kr-heading">
            최근 모의고사 4회 + 내신 + AI 진로상담을 종합해 현실적 지원권을 분석해드려요.
          </div>
          <Button variant="primary" size="md" full trailing={<IcArrowRight size={16}/>} onClick={() => go('admissions-analysis')}>분석 결과 보기</Button>
        </Card>

        {/* Disclaimer */}
        <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 10, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
          입시 정보는 매년 변경됩니다. 최종 지원 결정 전 반드시 해당 대학 입학처 공식 정보를 확인하세요. 데이터 신뢰도가 "추정"인 항목은 공시되지 않은 수치를 인접 학과·전년도 트렌드로 추정한 값이에요.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// SCREEN: Admissions gap analysis (the connector to AI counseling)
// ────────────────────────────────────────────────────────
function AdmissionsAnalysis({ go }) {
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="입시 분석" leading={<BackButton onClick={() => go('admissions-dept')}/>} trailing={<IconButton icon={<IcDownload size={20}/>} ariaLabel="저장"/>}/>

      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ background: 'linear-gradient(135deg, #1E2A4B 0%, #1B64DA 100%)', color: '#fff', marginBottom: 12 }}>
          <Chip tone="brand" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginBottom: 8 }}>나의 목표</Chip>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.4px' }} className="kr-heading">홍익대학교 디지털콘텐츠디자인학과</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>수시 · 학생부종합전형 기준</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8,
            marginTop: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, opacity: 0.85 }}>현실 가능성</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>적정권</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, opacity: 0.85 }}>분석 신뢰도</div>
              <div className="num" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>중간 · 데이터 70%</div>
            </div>
          </div>
        </Card>

        {/* Analysis cards */}
        <AnalysisCard
          title="현재 성적 요약"
          tone="info"
          body={<div>최근 모의고사 4회 평균: <strong>국어 91 · 수학 82 · 영어 1등급 · 탐구 84/82</strong><br/>내신 2학년 평균: <strong>2.4등급</strong>, 미술 관련 활동 누적 8건.</div>}
        />
        <AnalysisCard
          title="목표 학과 입시 기준"
          tone="purple"
          body={<>입학자 평균 <strong>내신 1.9등급</strong>, 70% 컷 <strong>2.3등급</strong>. 실기 전형 비중이 높아 미술 포트폴리오 가산점이 큰 학과예요.</>}
        />
        <AnalysisCard
          title="부족한 영역"
          tone="warning"
          body={
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li><strong>내신 0.5등급 차이</strong> — 학생부종합 1.9 vs 현재 2.4</li>
              <li><strong>수학 표준점수</strong> — 입학자 평균 대비 -8점</li>
              <li>실기 포트폴리오 미정. 미술학원·동아리 작품 정리 필요</li>
            </ul>
          }
        />
        <AnalysisCard
          title="필요 점수 / 등급 추정"
          tone="brand"
          body={<>학생부종합 진학 가능 라인까지 <strong>내신 0.5등급 상향</strong>이 필요해요. 3학년 1학기 평균이 2.0~2.1을 유지하면 충분히 도전 가능권에 들어요.</>}
        />
        <AnalysisCard
          title="현실적인 지원권"
          tone="success"
          body={
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li><strong>안정권</strong>: 서울여대 시디과, 명지대 시디과</li>
              <li><strong>적정권</strong>: 홍익대 DCD(현재 목표), 서울과기대 디자인</li>
              <li><strong>도전권</strong>: 한예종 영상이론과, 이화여대 시디과</li>
            </ul>
          }
        />
        <AnalysisCard
          title="다음 4주 학습 우선순위"
          tone="mint"
          body={
            <ol style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li>수학 II 미적분 기본 개념 복습 (주 3회 90분)</li>
              <li>탐구 1과목 실력진단 + 약점 단원 보충</li>
              <li>미술 포트폴리오: 작품 3개 회고 + 1개 신규</li>
              <li>5월 모의고사 후 분석 → 입시 라인 재조정</li>
            </ol>
          }
        />
        <AnalysisCard
          title="선생님과 상담하면 좋은 질문"
          tone="neutral"
          body={
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
              <li>학생부종합 전형 대비 비교과 활동 점검</li>
              <li>3학년 1학기 내신 시뮬레이션</li>
              <li>실기 비중이 높은 다른 학과와의 진로 비교</li>
            </ul>
          }
        />

        <Button variant="brandSoft" size="md" full leading={<IcMessage size={16}/>} style={{ marginTop: 4, marginBottom: 12 }} onClick={() => go('ai-counseling')}>
          AI 상담에서 더 구체적으로 이어가기
        </Button>

        <div style={{ padding: 14, background: 'var(--bg-muted)', borderRadius: 10, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
          이 분석은 학생의 현재 데이터와 공식 입시 정보를 종합한 참고 자료예요. 최종 지원 결정은 학생·보호자·담임교사 상담을 거쳐 결정해주세요. 새로운 성적이 입력되면 자동으로 재분석돼요.
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ title, body, tone = 'neutral' }) {
  const colors = {
    info: { bg: 'var(--info-bg)', border: '#D1E1FA', accent: 'var(--brand-600)' },
    purple: { bg: 'var(--accent-purple-bg)', border: '#E2D6FF', accent: 'var(--accent-purple)' },
    warning: { bg: 'var(--warning-bg)', border: '#FBE0A2', accent: 'var(--warning)' },
    brand: { bg: 'var(--brand-50)', border: '#C9DDFA', accent: 'var(--brand-600)' },
    success: { bg: 'var(--success-bg)', border: '#C8E5D2', accent: 'var(--success)' },
    mint: { bg: 'var(--accent-mint-bg)', border: '#A9E7D5', accent: 'var(--accent-mint)' },
    neutral: { bg: 'var(--bg-surface)', border: 'var(--line)', accent: 'var(--fg-muted)' },
  }[tone];
  return (
    <Card padding={16} style={{ marginBottom: 8, background: colors.bg, border: `1px solid ${colors.border}`, boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: colors.accent }}/>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.accent, letterSpacing: '-0.1px' }}>{title}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--fg-default)', lineHeight: 1.55 }} className="kr-heading">{body}</div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════
// 봉사활동 / 장학금 / 해외대학 화면 — 실 백엔드 연결 + 캘린더 추가
// ════════════════════════════════════════════════════════

// 캘린더에 추가 (멱등 — refType+refId 중복 방지). 성공/중복 시 alert.
async function addToCalendar(ev) {
  if (!window.__isLoggedIn || !window.__isLoggedIn()) { alert('로그인 후 이용할 수 있어요.'); return; }
  try {
    const res = await window.__apiFetch('/calendar/events', { method: 'POST', body: JSON.stringify(ev) });
    if (res && res.meta && res.meta.idempotent) alert('이미 캘린더에 추가된 일정이에요.');
    else alert('캘린더에 추가했어요! 캘린더 메뉴에서 확인하세요.');
  } catch (e) {
    alert((e && e.body && e.body.message) || '캘린더 추가에 실패했어요.');
  }
}

function VolunteersScreen({ go }) {
  const [q, setQ] = React.useState('');
  const [region, setRegion] = React.useState('전체');
  const [list, setList] = React.useState(null);
  const REGIONS_V = ['전체', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  const load = React.useCallback(async () => {
    setList(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (region !== '전체') params.set('region', region);
      params.set('limit', '30');
      const res = await window.__apiFetch('/volunteers?' + params.toString(), { method: 'GET' });
      setList(res.data || []);
    } catch (e) { setList([]); }
  }, [q, region]);
  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="봉사활동 찾기" subtitle="마음에 드는 봉사를 캘린더에 담아두세요. 여기서는 모집 정보를 보여드리는 곳이라, 실제 신청은 해당 봉사처(센터)에 직접 연락해 진행해 주세요 😊"/>
      <div style={{ padding: '4px 16px 0' }}>
        <TextInput value={q} onChange={setQ} placeholder="봉사 키워드 (예: 도서관, 노인복지)" leading={<IcSearch size={16}/>}/>
      </div>
      <div style={{ padding: '12px 16px 0' }}>
        <FilterRow label="지역" items={REGIONS_V} active={region} onChange={setRegion}/>
      </div>
      <div style={{ padding: '16px 16px 24px' }}>
        {list === null ? [0,1,2].map(i => <Card key={i} padding={14} style={{ marginBottom: 8 }}><Skeleton height={40}/></Card>)
          : list.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>조건에 맞는 봉사가 없어요. 다른 지역·키워드로 검색해보세요.</div>
          : list.map(v => (
            <Card key={v.id} padding={14} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-mint-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcHeart size={18} color="var(--accent-mint)"/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{v.title}</div>
                    {v.youthEligible && <Chip tone="mint" size="sm">청소년 가능</Chip>}
                    {v.status === '모집중' && <Chip tone="success" size="sm">모집중</Chip>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>{[v.center, v.region].filter(Boolean).join(' · ')}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {v.activityType && <Chip tone="brand" size="sm">{v.activityType}</Chip>}
                    {v.termType && <Chip tone="neutral" size="sm">{v.termType}</Chip>}
                    {v.recruitCount != null && <Chip tone="warning" size="sm">모집 {v.recruitCount}명</Chip>}
                  </div>
                  {v.place && <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>📍 {v.place}</div>}
                  {v.contact && <div style={{ fontSize: 11, color: 'var(--brand-600)', marginTop: 2 }}>☎ {v.contact}</div>}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <Button variant="brandSoft" size="sm" leading={<IcCalendar size={13}/>} onClick={() => addToCalendar({
                      title: '[봉사] ' + v.title, category: 'volunteer',
                      startsAt: new Date(Date.now()+7*864e5).toISOString(),
                      location: v.place || v.region || '', contact: v.contact || '', refType: 'volunteer', refId: String(v.id),
                    })}>캘린더 추가</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8, padding: '0 4px', lineHeight: 1.5 }}>※ 활동 장소·유형·모집인원은 VMS 모집공고 기준이에요. 구체적 활동 일자·시간·봉사시간은 VMS(1365)에서 신청할 때 확인돼요.</div>
      </div>
    </div>
  );
}

function ScholarshipsScreen({ go }) {
  const [q, setQ] = React.useState('');
  const [list, setList] = React.useState(null);
  const load = React.useCallback(async () => {
    setList(null);
    try {
      const res = await window.__apiFetch('/scholarships?' + (q.trim() ? 'q=' + encodeURIComponent(q.trim()) + '&' : '') + 'limit=30', { method: 'GET' });
      setList(res.data || []);
    } catch (e) { setList([]); }
  }, [q]);
  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="장학금 찾기" subtitle="한국장학재단·지자체·기업 장학금을 모아 보여드려요. 실제 신청·이용은 한국장학재단(kosaf.go.kr)이나 각 운영기관 사이트에서 진행해 주세요 😊"/>
      <div style={{ padding: '4px 16px 0' }}>
        <TextInput value={q} onChange={setQ} placeholder="장학금 키워드 (예: 저소득, 이공계, 지역)" leading={<IcSearch size={16}/>}/>
      </div>
      <div style={{ padding: '16px 16px 24px' }}>
        {list === null ? [0,1,2].map(i => <Card key={i} padding={14} style={{ marginBottom: 8 }}><Skeleton height={40}/></Card>)
          : list.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>검색 결과가 없어요.</div>
          : list.map(s => (
            <Card key={s.id} padding={14} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.productName}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>{[s.organization, s.productType, s.supportType].filter(Boolean).join(' · ')}</div>
              {s.amount && <div style={{ fontSize: 12, color: 'var(--brand-600)', marginTop: 6, fontWeight: 600 }}>{s.amount}</div>}
              {s.target && <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 4, lineHeight: 1.5 }}>대상: {s.target.slice(0, 80)}</div>}
              {s.applyPeriod && <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                <Chip tone="neutral" size="sm">신청 {s.applyPeriod}</Chip>
              </div>}
            </Card>
          ))}
        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8, padding: '0 4px' }}>※ 구체 신청 조건·서류는 운영기관 공지로 꼭 확인하세요.</div>
      </div>
    </div>
  );
}

// embedded=true이면 대학·입시 허브의 "해외대학" 탭 안에 렌더 (자체 헤더 생략)
function ForeignUnivScreen({ go, embedded = false }) {
  const [country, setCountry] = React.useState('US');
  const [q, setQ] = React.useState('');
  const [list, setList] = React.useState(null);
  const [openId, setOpenId] = React.useState(null); // 상세 펼친 대학
  const COUNTRIES = [{c:'US',n:'미국'},{c:'GB',n:'영국'},{c:'JP',n:'일본'},{c:'DE',n:'독일'},{c:'FR',n:'프랑스'},{c:'CN',n:'중국'},{c:'AU',n:'호주'},{c:'CA',n:'캐나다'}];
  const load = React.useCallback(async () => {
    setList(null); setOpenId(null);
    try {
      const res = await window.__apiFetch('/foreign-universities?country=' + country + (q.trim() ? '&q=' + encodeURIComponent(q.trim()) : '') + '&limit=40', { method: 'GET' });
      setList(res.data || []);
    } catch (e) { setList([]); }
  }, [country, q]);
  React.useEffect(() => { const id = setTimeout(load, 300); return () => clearTimeout(id); }, [load]);

  const fmtUSD = (n) => n != null ? '$' + Number(n).toLocaleString() : null;
  const pct = (n) => n != null ? Math.round(n * 100) + '%' : null;
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: embedded ? 0 : '100%' }}>
      {!embedded && <ScreenHeader title="해외대학" subtitle="해외 진학을 생각한다면 — 학비·졸업률·중위소득까지"/>}
      <div style={{ padding: '4px 16px 0' }}>
        <TextInput value={q} onChange={setQ} placeholder="대학명 검색 (국문/영문)" leading={<IcSearch size={16}/>}/>
      </div>
      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {COUNTRIES.map(x => (
          <button key={x.c} onClick={() => setCountry(x.c)} style={{ border:'none', padding:'6px 12px', borderRadius:999, fontSize:12, fontWeight:600, cursor:'pointer', background: country===x.c?'var(--brand-500)':'var(--bg-surface)', color: country===x.c?'#fff':'var(--fg-default)' }}>{x.n}</button>
        ))}
      </div>
      {country !== 'US' && (
        <div style={{ margin: '12px 16px 0', padding: 12, background: 'var(--info-bg)', borderRadius: 10, fontSize: 12, color: 'var(--brand-600)', lineHeight: 1.5 }} className="kr-heading">
          ℹ️ 이 국가는 <b>대학 이름(표준 국문·영문 명칭)</b>만 제공돼요. 학비·입학률·졸업소득 같은 세부 통계는 정부가 무료로 공개한 데이터가 있는 <b>미국</b>만 제공됩니다(미 교육부 College Scorecard). 다른 국가는 공개 API가 마련되면 추가할게요.
        </div>
      )}
      <div style={{ padding: '16px 16px 24px' }}>
        {list === null ? [0,1,2].map(i => <Card key={i} padding={14} style={{ marginBottom: 8 }}><Skeleton height={40}/></Card>)
          : list.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>해당 국가 대학 정보가 없어요.</div>
          : list.map(u => {
            const d = u.detail || {};
            const open = openId === u.id;
            return (
            <Card key={u.id} padding={14} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{u.nameKo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{u.nameEn || ''}{u.country && u.country.ko ? ' · ' + u.country.ko : ''}{d.city ? ' · ' + [d.city, d.state].filter(Boolean).join(', ') : ''}</div>
                </div>
                {u.hasDetail && <Chip tone="success" size="sm">상세정보</Chip>}
              </div>
              {u.hasDetail ? (
                <>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {d.admissionRate != null && <Chip tone="brand" size="sm">입학률 {pct(d.admissionRate)}</Chip>}
                    {d.tuitionOutState != null && <Chip tone="warning" size="sm">학비 {fmtUSD(d.tuitionOutState)}/년</Chip>}
                    {d.medianEarnings != null && <Chip tone="success" size="sm">졸업후 중위소득 {fmtUSD(d.medianEarnings)}</Chip>}
                  </div>
                  <button onClick={() => setOpenId(open ? null : u.id)} style={{ border:'none', background:'none', color:'var(--brand-600)', fontSize:12, fontWeight:600, cursor:'pointer', marginTop:10, padding:0 }}>
                    {open ? '접기 ▲' : '자세히 보기 ▼'}
                  </button>
                  {open && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-subtle)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                        <DetailRow label="입학률" value={pct(d.admissionRate)}/>
                        <DetailRow label="졸업률" value={pct(d.completionRate)}/>
                        <DetailRow label="재학생 수" value={d.studentSize != null ? Number(d.studentSize).toLocaleString() + '명' : null}/>
                        <DetailRow label="졸업후 중위소득" value={fmtUSD(d.medianEarnings)}/>
                        <DetailRow label="주내 학비" value={fmtUSD(d.tuitionInState)}/>
                        <DetailRow label="주외/유학생 학비" value={fmtUSD(d.tuitionOutState)}/>
                      </div>
                      {[d.admissionRate, d.studentSize, d.tuitionOutState, d.medianEarnings, d.completionRate].filter(v => v != null).length <= 1 && (
                        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8 }}>※ 이 대학은 미 교육부에 공개된 세부 통계가 적어요(소규모·신설 대학일 수 있어요). 학교 공식 사이트에서 확인하세요.</div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8 }}>표준 명칭 정보예요. 학비·입학 상세는 미국(College Scorecard) 대학에서 제공돼요.</div>
              )}
            </Card>
            );
          })}
        <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8, padding: '0 4px' }}>※ 미국 대학은 College Scorecard, 그 외는 한국국제교류재단 표준 명칭 기준이에요.</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div style={{ color: 'var(--fg-subtle)', fontSize: 11 }}>{label}</div>
      <div style={{ color: value ? 'var(--fg-strong)' : 'var(--fg-subtle)', fontWeight: 700, marginTop: 2 }}>{value || '—'}</div>
    </div>
  );
}

Object.assign(window, {
  AdmissionsHub, UniversityDetail, DepartmentDetail, AdmissionsAnalysis,
  VolunteersScreen, ScholarshipsScreen, ForeignUnivScreen,
  confidenceChip,
});
