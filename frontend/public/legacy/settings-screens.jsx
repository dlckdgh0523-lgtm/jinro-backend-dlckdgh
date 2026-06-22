// settings-screens.jsx — Real account settings pages (password, notifications, terms)
// Used by both student & teacher, web & mobile. Each takes `back` (a function).

// ────────────────────────────────────────────────────────
// Password change
// ────────────────────────────────────────────────────────
function SettingsPassword({ back }) {
  const [cur, setCur] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const rules = [
    { id: 'len', label: '8자 이상', ok: next.length >= 8 },
    { id: 'mix', label: '영문 + 숫자 포함', ok: /[a-zA-Z]/.test(next) && /[0-9]/.test(next) },
    { id: 'special', label: '특수문자 1개 이상', ok: /[^a-zA-Z0-9]/.test(next) },
  ];
  const allOk = rules.every(r => r.ok);
  const match = next.length > 0 && next === confirm;
  const canSubmit = cur.length > 0 && allOk && match;

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="비밀번호 변경" leading={<BackButton onClick={back}/>}/>
      <div style={{ padding: '0 16px 24px', maxWidth: 520, margin: '0 auto' }}>
        <SectionCard style={{ marginBottom: 12 }}>
          <FormField label="현재 비밀번호" required style={{ marginBottom: 16 }}>
            <TextInput value={cur} onChange={setCur} type={show ? 'text' : 'password'} placeholder="현재 비밀번호"
              trailing={<button onClick={() => setShow(s => !s)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-subtle)', display: 'flex' }}>{show ? <IcEyeOff size={16}/> : <IcEye size={16}/>}</button>}/>
          </FormField>
          <FormField label="새 비밀번호" required style={{ marginBottom: 12 }}>
            <TextInput value={next} onChange={(v) => { setNext(v); setTouched(true); }} type={show ? 'text' : 'password'} placeholder="새 비밀번호"/>
          </FormField>
          {/* rule checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {rules.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: r.ok ? 'var(--success)' : 'var(--fg-subtle)' }}>
                {r.ok ? <IcCheckCircle size={14}/> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--line-strong)' }}/>}
                {r.label}
              </div>
            ))}
          </div>
          <FormField label="새 비밀번호 확인" required error={confirm.length > 0 && !match ? '비밀번호가 일치하지 않아요' : null}>
            <TextInput value={confirm} onChange={setConfirm} type={show ? 'text' : 'password'} placeholder="새 비밀번호 다시 입력"/>
          </FormField>
        </SectionCard>
        <Button variant="primary" size="lg" full disabled={!canSubmit} onClick={() => { showToast('비밀번호를 변경했어요', 'success'); back(); }}>
          비밀번호 변경
        </Button>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }} className="kr-heading">
          변경 후 다른 기기에서는 다시 로그인이 필요해요.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Notification settings
// ────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on} style={{
      width: 46, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
      background: on ? 'var(--brand-500)' : 'var(--line-strong)', position: 'relative',
      transition: 'background 180ms var(--ease-std)',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 180ms var(--ease-toss)',
      }}/>
    </button>
  );
}

function SettingsNotifications({ back, role = 'student' }) {
  const [channels, setChannels] = React.useState({ push: true, email: true, sse: true });
  const studentTypes = [
    { id: 'memo', label: '선생님 메모 도착', desc: '교사가 새 상담 메모를 남기면 알려줘요', on: true },
    { id: 'report', label: 'AI 리포트 준비됨', desc: '진로 리포트가 생성되면 알려줘요', on: true },
    { id: 'counsel', label: '상담 요청 응답', desc: '상담 요청이 수락/변경되면 알려줘요', on: true },
    { id: 'study', label: '학습 리마인더', desc: '미완료 학습 항목을 정해진 시각에 알려줘요', on: false },
    { id: 'billing', label: '구독·결제 안내', desc: '체험 종료, 결제 예정 알림', on: true },
  ];
  const teacherTypes = [
    { id: 'req', label: '학생 상담 요청', desc: '학생이 상담을 요청하면 즉시 알려줘요', on: true },
    { id: 'report', label: '학생 AI 리포트 준비됨', desc: '담당 학생 리포트가 생성되면 알려줘요', on: true },
    { id: 'risk', label: '주의 신호 감지', desc: '성적 급락·학습 정체 등 신호를 알려줘요', on: true },
    { id: 'join', label: '학급 신규 가입', desc: '초대코드로 학생이 합류하면 알려줘요', on: true },
    { id: 'billing', label: '구독·결제 안내', desc: '체험 종료, 결제 예정 알림', on: true },
  ];
  const [types, setTypes] = React.useState(
    Object.fromEntries((role === 'teacher' ? teacherTypes : studentTypes).map(t => [t.id, t.on]))
  );
  const list = role === 'teacher' ? teacherTypes : studentTypes;

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="알림 설정" leading={<BackButton onClick={back}/>}/>
      <div style={{ padding: '0 16px 24px', maxWidth: 520, margin: '0 auto' }}>
        <SectionCard title="알림 채널" subtitle="알림을 받을 방법을 선택하세요" style={{ marginBottom: 12 }}>
          {[
            { id: 'push', label: '푸시 알림', desc: '앱/브라우저 푸시' },
            { id: 'email', label: '이메일', desc: '주요 알림을 메일로도 받기' },
            { id: 'sse', label: '실시간 알림', desc: '앱 사용 중 실시간 표시 (SSE)' },
          ].map((c, i, arr) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{c.label}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>{c.desc}</div>
              </div>
              <Toggle on={channels[c.id]} onChange={(v) => setChannels(s => ({ ...s, [c.id]: v }))}/>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="알림 종류" subtitle="받고 싶은 알림만 켜두세요">
          {list.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < list.length-1 ? '1px solid var(--line-subtle)' : 'none', opacity: channels.push || channels.email || channels.sse ? 1 : 0.5 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1, lineHeight: 1.4 }} className="kr-heading">{t.desc}</div>
              </div>
              <Toggle on={types[t.id]} onChange={(v) => setTypes(s => ({ ...s, [t.id]: v }))}/>
            </div>
          ))}
        </SectionCard>

        <Button variant="primary" size="lg" full style={{ marginTop: 16 }} onClick={() => { showToast('알림 설정을 저장했어요', 'success'); back(); }}>저장하기</Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Terms & privacy
// ────────────────────────────────────────────────────────
function SettingsTerms({ back }) {
  const [tab, setTab] = React.useState('terms');
  const docs = {
    terms: {
      title: '이용약관',
      updated: '2026. 05. 01 시행',
      sections: [
        ['제1조 (목적)', '본 약관은 진로나침반(이하 "회사")이 제공하는 AI 진로 상담 및 학습 관리 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'],
        ['제2조 (정의)', '"학생 회원"은 진로 탐색·학습 관리를 위해 서비스를 이용하는 자를, "교사 회원"은 학급을 운영하며 학생을 관리하는 자를 의미합니다. "초대코드"는 교사 회원이 학생을 학급에 연결하기 위해 발급하는 코드를 말합니다.'],
        ['제3조 (서비스의 제공)', '회사는 AI 진로 상담, 성적 분석, 학습 계획, 교사용 학급 관리 기능을 제공합니다. 무료 운영 기간 동안에는 별도의 이용료가 청구되지 않으며, 유료 전환 시 최소 30일 전에 고지합니다.'],
        ['제4조 (회원의 의무)', '회원은 타인의 정보를 도용하거나, 서비스를 부정한 목적으로 이용해서는 안 됩니다. 만 14세 미만 아동은 법정대리인의 동의를 받아야 합니다.'],
        ['제5조 (AI 결과의 한계)', 'AI가 제공하는 진로 탐색 결과는 참고 자료이며, 절대적 진단이나 확정적 예측이 아닙니다. 최종 진로 선택은 학생·보호자·교사 상담과 함께 결정하는 것을 권장합니다.'],
      ],
    },
    privacy: {
      title: '개인정보 처리방침',
      updated: '2026. 05. 01 시행',
      sections: [
        ['1. 수집하는 항목', '필수: 이메일, 이름, 비밀번호(암호화 저장), 학교/학급 정보. 서비스 이용 중 생성: 성적 기록, AI 상담 대화, 학습 진도. 회사는 주민등록번호 등 고유식별정보를 수집하지 않습니다.'],
        ['2. 이용 목적', '진로 상담 제공, 성적·학습 분석, 교사-학생 연결, 구독·결제 처리, 서비스 개선을 위해서만 사용합니다.'],
        ['3. 보유 및 파기', '회원 탈퇴 시 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 결제 기록은 5년간 보관합니다.'],
        ['4. 제3자 제공', '회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 결제 처리를 위해 결제대행사(토스페이먼츠/포트원)에 최소한의 정보만 전달합니다.'],
        ['5. 상담 기록 열람', '교사는 담당 학생의 AI 리포트를 학생 동의 범위 내에서만 열람할 수 있으며, 모든 열람은 기록됩니다.'],
        ['6. 이용자의 권리', '이용자는 언제든 본인의 개인정보 열람·정정·삭제를 요청할 수 있습니다. 문의: privacy@jinronavi.kr'],
      ],
    },
  };
  const d = docs[tab];
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="약관 및 정책" leading={<BackButton onClick={back}/>}/>
      <div style={{ padding: '0 16px 24px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Tabs items={[{ id: 'terms', label: '이용약관' }, { id: 'privacy', label: '개인정보 처리방침' }]} activeId={tab} onChange={setTab}/>
        </div>
        <Card padding={24}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)' }}>{d.title}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 4, marginBottom: 20 }}>{d.updated}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {d.sections.map(([h, body], i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">{h}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7 }} className="kr-heading">{body}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }} className="kr-heading">
          (주) 진로나침반 · 고객센터 1599-0000 · help@jinronavi.kr
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 건의하기 (사용자 → 운영팀, 실 API POST /suggestions)
// ────────────────────────────────────────────────────────
function SettingsSuggestion({ back }) {
  const [category, setCategory] = React.useState('기타');
  const [body, setBody] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const submit = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      await window.__apiFetch('/suggestions', { method: 'POST', body: JSON.stringify({ category, body: body.trim() }) });
      showToast('소중한 의견 감사해요! 잘 전달했어요', 'success');
      back();
    } catch (e) {
      showToast((e && e.body && e.body.message) || '전송하지 못했어요', 'error');
      setBusy(false);
    }
  };
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="건의하기" leading={<BackButton onClick={back}/>}/>
      <div style={{ padding: '0 16px 24px', maxWidth: 520, margin: '0 auto' }}>
        <SectionCard style={{ marginBottom: 12 }}>
          <FormField label="분류" style={{ marginBottom: 14 }}>
            <Tabs items={[{id:'기능',label:'기능 제안'},{id:'버그',label:'버그 신고'},{id:'기타',label:'기타'}]} activeId={category} onChange={setCategory}/>
          </FormField>
          <FormField label="내용" required>
            <Textarea value={body} onChange={setBody} rows={6} placeholder="개선했으면 하는 점, 불편한 점, 새 기능 제안 등을 자유롭게 적어주세요."/>
          </FormField>
        </SectionCard>
        <Button variant="primary" size="lg" full disabled={!body.trim() || busy} onClick={submit}>{busy ? '보내는 중…' : '의견 보내기'}</Button>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }} className="kr-heading">
          보내주신 의견은 운영팀이 확인해요. 답변이 필요하면 메시지로 연락드릴 수 있어요.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 공지사항 보기 (관리자 작성분 → 학생/교사 열람, 실 API GET /announcements)
// ────────────────────────────────────────────────────────
function SettingsAnnouncements({ back }) {
  const [rows, setRows] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try { const r = await window.__apiFetch('/announcements?limit=50', { method: 'GET' }); if (alive) setRows((r && r.data) || []); }
      catch (e) { if (alive) setRows([]); }
    })();
    return () => { alive = false; };
  }, []);
  const loading = rows === null;
  const list = rows || [];
  const fmt = (d) => { try { const t = new Date(d); return isNaN(t) ? '' : t.toISOString().slice(0, 10); } catch (e) { return ''; } };
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="공지사항" leading={<BackButton onClick={back}/>}/>
      <div style={{ padding: '0 16px 24px', maxWidth: 560, margin: '0 auto' }}>
        {loading ? (
          <SectionCard><div style={{ fontSize: 13, color: 'var(--fg-muted)', padding: 8 }}>불러오는 중…</div></SectionCard>
        ) : list.length === 0 ? (
          <SectionCard><div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }} className="kr-heading">등록된 공지가 없어요.</div></SectionCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(a => (
              <SectionCard key={a.id} style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {a.pinned && <Chip tone="warning" size="sm">고정</Chip>}
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{a.title}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-default)', whiteSpace: 'pre-line', lineHeight: 1.6 }} className="kr-heading">{a.body}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8 }}>{a.author || '운영팀'} · {fmt(a.createdAt)}</div>
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SettingsPassword, SettingsNotifications, SettingsTerms, SettingsSuggestion, SettingsAnnouncements, Toggle });
