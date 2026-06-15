// announcements.jsx — 공지사항 (관리자 소식) + 건의/버그 제보 등록.
// Shared by student & teacher, web & app. Mock/in-memory; backend later.

// 공지 전용 엔드포인트가 없어요 — 등록된 공지가 없는 빈 상태로 시작.
const ANNOUNCEMENTS = [];

const ANN_FEEDBACK_TYPES = [
  { id: 'bug', label: '버그 제보', tone: 'danger', icon: <IcAlert/> },
  { id: 'idea', label: '기능 건의', tone: 'brand', icon: <IcSparkles/> },
  { id: 'etc', label: '기타 의견', tone: 'neutral', icon: <IcMessage/> },
];

// 건의·제보 전용 엔드포인트가 없어요 — 빈 상태로 시작. 제출 폼은 이번 세션 내에서만 누적.
window.__FEEDBACKS = window.__FEEDBACKS || [];

const annTone = (t) => `var(--${t === 'brand' ? 'brand' : t}-bg)`;
const annFg = (t) => `var(--${t === 'brand' ? 'brand-600' : t === 'mint' ? 'accent-mint' : t})`;
const annFbStatus = (s) => ({
  received: <Chip tone="neutral" size="sm">접수됨</Chip>,
  reviewing: <Chip tone="info" size="sm">검토 중</Chip>,
  resolved: <Chip tone="success" size="sm">반영됨</Chip>,
}[s]);

// ── Announcements list (variant: 'mobile' | 'web') ──
function AnnouncementsScreen({ role = 'student', variant = 'mobile', onBack }) {
  const [tab, setTab] = React.useState('notice');
  const [detail, setDetail] = React.useState(null);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [, force] = React.useState(0);
  const sorted = [...ANNOUNCEMENTS].sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date));

  const Header = variant === 'mobile'
    ? <ScreenHeader title="공지사항" leading={onBack ? <BackButton onClick={onBack}/> : null}/>
    : <div style={{ padding: '20px 24px 0' }}><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)' }}>공지사항</div></div>;

  const pad = variant === 'web' ? '16px 24px 24px' : '0 16px 24px';

  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      {Header}
      <div style={{ padding: variant === 'web' ? '12px 24px 0' : '0 16px 12px' }}>
        <Tabs items={[{ id: 'notice', label: '공지' }, { id: 'feedback', label: '내 건의·제보' }]} activeId={tab} onChange={setTab}/>
      </div>

      {tab === 'notice' ? (
        <div style={{ padding: pad }}>
          {sorted.length === 0 ? (
            <Card padding={8}><EmptyState icon={<IcFlag size={22}/>} title="등록된 공지가 없어요" body="새로운 소식이 올라오면 여기에서 알려드릴게요."/></Card>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map(a => (
              <Card key={a.id} padding={16} hoverable onClick={() => setDetail(a)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  {a.pinned && <IcFlag size={13} color="var(--brand-600)"/>}
                  <Chip tone={a.tone === 'mint' ? 'mint' : a.tone} size="sm">{a.tag}</Chip>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', marginLeft: 'auto' }} className="num">{a.date}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} className="kr-heading">{a.body}</div>
              </Card>
            ))}
          </div>
          )}
        </div>
      ) : (
        <div style={{ padding: pad }}>
          <Card padding={18} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #EFF4FF 0%, #F4ECFF 100%)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 4 }} className="kr-heading">의견을 들려주세요</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 12 }} className="kr-heading">버그 제보나 기능 건의는 큰 도움이 돼요. 검토 후 반영 여부를 알려드릴게요.</div>
            <Button variant="primary" size="md" full leading={<IcSparkles size={15}/>} onClick={() => setFeedbackOpen(true)}>건의·버그 제보하기</Button>
          </Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', margin: '4px 4px 8px' }}>내가 보낸 의견</div>
          {window.__FEEDBACKS.length === 0 ? (
            <Card padding={8}><EmptyState icon={<IcMessage size={22}/>} title="아직 보낸 의견이 없어요" body="첫 의견을 남겨보세요."/></Card>
          ) : (
            <Card padding={0}>
              {window.__FEEDBACKS.map((f, i, arr) => {
                const ft = ANN_FEEDBACK_TYPES.find(t => t.id === f.type) || ANN_FEEDBACK_TYPES[2];
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `var(--${ft.tone === 'brand' ? 'brand-50' : ft.tone === 'danger' ? 'danger-bg' : 'neutral-bg'})`, color: `var(--${ft.tone === 'brand' ? 'brand-600' : ft.tone === 'danger' ? 'danger' : 'neutral-fg'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{React.cloneElement(ft.icon, { size: 16 })}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }} className="kr-heading">{f.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{ft.label} · <span className="num">{f.date}</span></div>
                    </div>
                    {annFbStatus(f.status)}
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      )}

      {detail && <AnnouncementDetail a={detail} onClose={() => setDetail(null)}/>}
      {feedbackOpen && <AnnFeedbackDialog onClose={() => setFeedbackOpen(false)} onSubmit={() => { force(n => n + 1); }}/>}
    </div>
  );
}

function AnnouncementDetail({ a, onClose }) {
  return (
    <BottomSheet open onClose={onClose} title="공지 상세" maxHeight="80%">
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Chip tone={a.tone === 'mint' ? 'mint' : a.tone} size="sm">{a.tag}</Chip>
          <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }} className="num">{a.date}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', wordBreak: 'keep-all' }} className="kr-heading">{a.title}</div>
        <div style={{ marginTop: 14, fontSize: 15, color: 'var(--fg-default)', lineHeight: 1.7, wordBreak: 'keep-all' }} className="kr-heading">{a.body}</div>
        <Button variant="secondary" size="lg" full style={{ marginTop: 20 }} onClick={onClose}>닫기</Button>
      </div>
    </BottomSheet>
  );
}

function AnnFeedbackDialog({ onClose, onSubmit }) {
  const [type, setType] = React.useState('bug');
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const trapRef = useFocusTrap(true, onClose);
  const submit = () => {
    window.__FEEDBACKS = [{ id: 'f' + Date.now(), type, title: title.trim(), status: 'received', date: '2026-06-07' }, ...window.__FEEDBACKS];
    showToast('소중한 의견 감사해요. 검토 후 알려드릴게요', 'success');
    onSubmit && onSubmit();
    onClose();
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.5)' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label="건의·버그 제보" style={{ position: 'relative', width: 'min(480px, 100%)', maxHeight: '92%', overflow: 'auto', background: 'var(--bg-elevated)', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-pop)' }} className="toss-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>건의·버그 제보</div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <FormField label="유형" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {ANN_FEEDBACK_TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                border: '1px solid', borderColor: type === t.id ? `var(--${t.tone === 'brand' ? 'brand-500' : t.tone === 'danger' ? 'danger' : 'line-strong'})` : 'var(--line-strong)',
                background: type === t.id ? `var(--${t.tone === 'brand' ? 'brand-50' : t.tone === 'danger' ? 'danger-bg' : 'neutral-bg'})` : 'var(--bg-surface)',
                color: type === t.id ? `var(--${t.tone === 'brand' ? 'brand-600' : t.tone === 'danger' ? 'danger' : 'fg-default'})` : 'var(--fg-muted)',
              }}>{React.cloneElement(t.icon, { size: 18 })}<span style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</span></button>
            ))}
          </div>
        </FormField>
        <FormField label="제목" required style={{ marginBottom: 14 }}>
          <TextInput value={title} onChange={setTitle} placeholder={type === 'bug' ? '예) 알림이 두 번 와요' : '예) 주간 리포트를 PDF로 받고 싶어요'} autoFocus/>
        </FormField>
        <FormField label="상세 내용" required style={{ marginBottom: 14 }}>
          <Textarea value={body} onChange={setBody} rows={4} placeholder={type === 'bug' ? '어떤 화면에서, 어떤 동작을 했을 때 발생하나요?' : '어떤 점이 불편하거나 필요한지 적어주세요.'}/>
        </FormField>
        <div style={{ padding: 10, background: 'var(--bg-muted)', borderRadius: 8, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 16 }} className="kr-heading">
          제보 시 기기·화면 정보가 함께 전송돼 문제 해결에 활용돼요.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" full onClick={onClose}>취소</Button>
          <Button variant="primary" full disabled={!title.trim() || !body.trim()} trailing={<IcSend size={14}/>} onClick={submit}>보내기</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AnnouncementsScreen, AnnouncementDetail, AnnFeedbackDialog, ANNOUNCEMENTS });
