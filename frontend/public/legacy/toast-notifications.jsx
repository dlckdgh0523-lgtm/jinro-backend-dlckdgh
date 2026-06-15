// toast-notifications.jsx — Live notification toast designs (web + mobile)
// Web: bottom-right stack with auto-dismiss
// Mobile: top banner that slides down

// ────────────────────────────────────────────────────────
// Reusable WebToast — bottom-right stacked card
// ────────────────────────────────────────────────────────
function WebToast({ toast, onClose, onAction, exiting }) {
  const tones = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand-600)', border: '#D6E6FF' },
    purple: { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple)', border: '#E2D6FF' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success)', border: '#C8E5D2' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning)', border: '#FBE0A2' },
    danger: { bg: 'var(--danger-bg)', fg: 'var(--danger)', border: '#F8C5C5' },
    info: { bg: 'var(--info-bg)', fg: 'var(--brand-600)', border: '#D1E1FA' },
    mint: { bg: 'var(--accent-mint-bg)', fg: 'var(--accent-mint)', border: '#A9E7D5' },
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--fg-default)', border: 'var(--line)' },
  };
  const t = tones[toast.tone] || tones.neutral;
  return (
    <div style={{
      width: 360, background: 'var(--bg-elevated)',
      borderRadius: 14, boxShadow: 'var(--shadow-pop)',
      border: '1px solid var(--line-subtle)',
      overflow: 'hidden',
      animation: exiting ? 'toastExit 200ms var(--ease-toss) forwards' : 'toastEnter 320ms var(--ease-toss)',
    }}>
      <style>{`
        @keyframes toastEnter { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastExit { to { transform: translateX(100%); opacity: 0; } }
        @keyframes toastProgress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
      `}</style>
      <div style={{ display: 'flex', gap: 12, padding: '14px 14px 12px', position: 'relative' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: t.bg, color: t.fg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{React.cloneElement(toast.icon || <IcBell/>, { size: 18 })}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              {toast.chip && <Chip tone={toast.tone} size="sm" style={{ height: 18, padding: '0 6px', fontSize: 10 }}>{toast.chip}</Chip>}
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{toast.title}</span>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-subtle)', padding: 2, marginRight: -4, marginTop: -2 }}>
              <IcX size={14}/>
            </button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.45, marginBottom: toast.actions ? 8 : 0 }} className="kr-heading">
            {toast.body}
          </div>
          {toast.from && (
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar name={toast.from.slice(0, 1)} size={14}/>{toast.from} · {toast.time || '방금'}
            </div>
          )}
          {toast.actions && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {toast.actions.map((a, i) => (
                <button key={i} onClick={() => onAction && onAction(a.id)} style={{
                  border: 'none', cursor: 'pointer', padding: '6px 12px',
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: a.primary ? t.fg : 'transparent',
                  color: a.primary ? '#fff' : t.fg,
                }}>{a.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--bg-muted)' }}>
        <div style={{
          height: '100%', background: t.fg, transformOrigin: 'left',
          animation: `toastProgress ${toast.duration || 6000}ms linear forwards`,
        }}/>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Reusable MobileToast — top banner
// ────────────────────────────────────────────────────────
function MobileToast({ toast, onClose, onTap, exiting }) {
  const tones = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand-600)' },
    purple: { bg: 'var(--accent-purple-bg)', fg: 'var(--accent-purple)' },
    success: { bg: 'var(--success-bg)', fg: 'var(--success)' },
    warning: { bg: 'var(--warning-bg)', fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-bg)', fg: 'var(--danger)' },
    info: { bg: 'var(--info-bg)', fg: 'var(--brand-600)' },
    mint: { bg: 'var(--accent-mint-bg)', fg: 'var(--accent-mint)' },
    neutral: { bg: 'var(--bg-muted)', fg: 'var(--fg-default)' },
  };
  const t = tones[toast.tone] || tones.neutral;
  return (
    <div onClick={onTap} style={{
      background: 'var(--bg-elevated)',
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(17,24,39,0.18), 0 2px 6px rgba(17,24,39,0.06)',
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer',
      animation: exiting ? 'mtoastExit 240ms var(--ease-toss) forwards' : 'mtoastEnter 360ms var(--ease-toss)',
    }}>
      <style>{`
        @keyframes mtoastEnter { from { transform: translateY(-120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes mtoastExit { to { transform: translateY(-120%); opacity: 0; } }
      `}</style>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: t.bg, color: t.fg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{React.cloneElement(toast.icon || <IcBell/>, { size: 18 })}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{toast.title}</span>
          <span style={{ fontSize: 10, color: 'var(--fg-subtle)', flexShrink: 0 }}>지금</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="kr-heading">{toast.body}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// WebToastHost — bottom-right container
// ────────────────────────────────────────────────────────
function WebToastHost({ toasts, onClose, onAction }) {
  return (
    <div style={{
      position: 'absolute', right: 24, bottom: 24, zIndex: 100,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <WebToast toast={t} onClose={() => onClose(t.id)} onAction={(a) => onAction && onAction(t.id, a)}/>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MobileToastHost — top banner stack
// ────────────────────────────────────────────────────────
function MobileToastHost({ toasts, onClose, onTap }) {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 10, right: 10, zIndex: 100,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <MobileToast toast={t} onClose={() => onClose(t.id)} onTap={() => onTap && onTap(t.id)}/>
        </div>
      ))}
    </div>
  );
}

// Sample toasts used across role demos
const SAMPLE_TOASTS = {
  student: [
    { id: 'st-msg', tone: 'brand', chip: '메시지', icon: <IcMessage/>, title: '이지원 선생님', body: '내일 상담 시간 15:00으로 잡아도 괜찮을까요?', from: '이지원', time: '방금', duration: 6000 },
    { id: 'st-memo', tone: 'purple', chip: '메모', icon: <IcMessage/>, title: '새 상담 메모가 도착했어요', body: '이번 주 영어 단어 진도가 좋아요. 모의고사 어법 부분도...', from: '이지원 선생님', duration: 6000 },
    { id: 'st-report', tone: 'purple', icon: <IcSparkles/>, title: 'AI 진로 리포트가 준비됐어요', body: '대화 12회를 바탕으로 1차 리포트를 확인해보세요.', duration: 7000, actions: [{ id: 'view', label: '리포트 보기', primary: true }, { id: 'later', label: '나중에' }] },
    { id: 'st-confirm', tone: 'success', icon: <IcCheckCircle/>, title: '상담이 확정됐어요', body: '5/19 (월) 15:00, 2학년 3반 교실에서 만나요.', duration: 6000 },
    { id: 'st-due', tone: 'mint', icon: <IcBook/>, title: '학습 마감 임박', body: '국어 비문학 3지문 · 오늘 23:59까지', duration: 5000 },
    { id: 'st-pay', tone: 'warning', icon: <IcCreditCard/>, title: '결제가 곧 시작돼요', body: '무료 체험이 5월 31일에 종료돼요. 결제 수단을 등록해주세요.', duration: 8000 },
  ],
  teacher: [
    { id: 't-req', tone: 'warning', chip: '상담 요청', icon: <IcMessage/>, title: '박민호 학생이 상담을 요청했어요', body: '"성적이 떨어지고 있어서 걱정돼요..." · 5/27 14:00 희망', from: '박민호', duration: 8000, actions: [{ id: 'accept', label: '수락', primary: true }, { id: 'propose', label: '다른 시간' }] },
    { id: 't-join', tone: 'success', icon: <IcUsers/>, title: '새 학생이 학급에 합류했어요', body: '윤다은 (한빛고 2-3) · 초대코드 H8K49P', duration: 6000 },
    { id: 't-grade', tone: 'info', icon: <IcChart/>, title: '김지훈 학생이 성적을 입력했어요', body: '5월 모의고사 평균 84.8 (+2.4)', duration: 5000 },
    { id: 't-msg', tone: 'brand', chip: '메시지', icon: <IcMessage/>, title: '이서연', body: '진로 방향 점검하고 싶어요. 5월 모의고사 결과 보고...', from: '이서연 학생', duration: 6000 },
    { id: 't-trial', tone: 'warning', icon: <IcCreditCard/>, title: '무료 체험 종료까지 D-7', body: '교사 플랜 결제 후에도 학급은 그대로 유지돼요.', duration: 7000 },
  ],
  admin: [
    { id: 'a-fail', tone: 'danger', icon: <IcAlert/>, title: '결제 실패율 임계치 초과', body: '최근 10분간 실패율 8.4% (임계 5%). 처리 필요.', duration: 10000, actions: [{ id: 'view', label: '결제 보기', primary: true }, { id: 'dismiss', label: '확인' }] },
    { id: 'a-webhook', tone: 'warning', icon: <IcRefresh/>, title: 'Webhook 재시도 한도 도달', body: 'pay_98121 · 3회 모두 실패 · 수동 처리 필요', duration: 10000 },
    { id: 'a-deploy', tone: 'success', icon: <IcServer/>, title: '새 배포가 완료됐어요', body: 'v0.42.2 → main · 1m 24s · 인스턴스 6/6 정상', duration: 6000 },
    { id: 'a-spike', tone: 'info', icon: <IcZap/>, title: 'AI 사용량 급증 감지', body: '최근 5분 API 호출 +180% (전 5분 대비)', duration: 8000 },
    { id: 'a-mod', tone: 'purple', icon: <IcShield/>, title: '신고된 콘텐츠 1건', body: '학생-학생 메시지 신고 · 검토 필요', duration: 8000 },
  ],
};

Object.assign(window, {
  WebToast, MobileToast, WebToastHost, MobileToastHost, SAMPLE_TOASTS,
});
