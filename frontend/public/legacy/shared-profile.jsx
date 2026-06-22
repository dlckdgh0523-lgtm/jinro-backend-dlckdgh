// shared-profile.jsx — Teacher profile (desktop + mobile) + account deletion flow.
// Also provides DeleteAccountDialog used by both student & teacher.

// ────────────────────────────────────────────────────────
// DeleteAccountDialog — 2-step confirmation
// ────────────────────────────────────────────────────────
function DeleteAccountDialog({ open, onClose, onConfirm, role = 'student' }) {
  const [step, setStep] = React.useState('confirm'); // confirm | typed | done
  const [reason, setReason] = React.useState('');
  const trapRef = useFocusTrap(open, onClose);
  const [typed, setTyped] = React.useState('');

  React.useEffect(() => {
    if (open) { setStep('confirm'); setReason(''); setTyped(''); }
  }, [open]);

  if (!open) return null;

  const requiredText = '회원 탈퇴';
  const canDelete = typed.trim() === requiredText;

  const REASONS = role === 'teacher'
    ? ['더 이상 학급을 운영하지 않아요', '기능이 부족해요', '가격이 부담돼요', '다른 서비스로 옮겨요', '기타']
    : ['목표를 이미 정했어요', 'AI 상담이 도움이 안 돼요', '시간이 없어요', '가격이 부담돼요', '기타'];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)', animation: 'fadeIn 240ms' }}/>
      <div ref={trapRef} role="alertdialog" aria-modal="true" aria-label="회원 탈퇴" style={{
        position: 'relative', width: 'min(440px, 100%)', maxHeight: '92%', overflow: 'auto',
        background: 'var(--bg-elevated)', borderRadius: 20, padding: 28,
        boxShadow: 'var(--shadow-pop)', animation: 'sheetIn 320ms var(--ease-toss)',
      }} className="toss-scroll">

        {step === 'confirm' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <IcAlert size={28}/>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 8 }} className="kr-heading">
              정말 탈퇴하시겠어요?
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
              회원 탈퇴 시 다음 데이터가 영구히 삭제돼요:
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {(role === 'teacher' ? [
                '관리 중인 학급 및 초대코드',
                '학생 상담 메모 (학생에게는 보존)',
                '결제 정보 및 구독 이력',
                '계정 정보 및 로그인 기록',
              ] : [
                'AI 진로 상담 대화 기록',
                '입력한 성적 데이터',
                '진로 목표 및 학습 계획',
                '결제 정보 및 구독 이력',
              ]).map(it => (
                <li key={it} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcX size={14} color="var(--danger)" style={{ flexShrink: 0 }}/>
                  {it}
                </li>
              ))}
            </ul>

            <div style={{
              padding: 14, background: 'var(--warning-bg)', borderRadius: 10,
              fontSize: 12, color: 'var(--warning)', lineHeight: 1.55, marginBottom: 18,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <IcInfo size={14} style={{ marginTop: 1, flexShrink: 0 }}/>
              <span className="kr-heading">
                {role === 'teacher'
                  ? '학급에 속한 학생은 다른 교사가 가입하기 전까지 "교사 없음" 상태로 전환돼요.'
                  : '학생 데이터를 30일간 복구할 수 있어요. 30일 후 영구 삭제돼요.'}
              </span>
            </div>

            <FormField label="탈퇴 사유 (선택)" hint="서비스 개선에 큰 도움이 돼요" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {REASONS.map(r => (
                  <label key={r} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', border: '1px solid',
                    borderColor: reason === r ? 'var(--brand-500)' : 'var(--line)',
                    background: reason === r ? 'var(--brand-50)' : 'var(--bg-surface)',
                    borderRadius: 10, cursor: 'pointer',
                  }}>
                    <input type="radio" checked={reason === r} onChange={() => setReason(r)} style={{ accentColor: 'var(--brand-500)' }}/>
                    <span style={{ fontSize: 13, color: reason === r ? 'var(--brand-600)' : 'var(--fg-default)', fontWeight: reason === r ? 600 : 500 }}>{r}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={onClose}>취소</Button>
              <Button variant="danger" full onClick={() => setStep('typed')}>계속</Button>
            </div>
          </>
        )}

        {step === 'typed' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', marginBottom: 8 }} className="kr-heading">
              마지막 확인이에요
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
              아래에 <strong style={{ color: 'var(--danger)' }}>"{requiredText}"</strong>을(를) 정확히 입력해주세요.
            </div>
            <FormField label="확인 문구" required style={{ marginBottom: 20 }}>
              <TextInput value={typed} onChange={setTyped} placeholder={requiredText} autoFocus/>
            </FormField>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={() => setStep('confirm')}>이전</Button>
              <Button variant="danger" full disabled={!canDelete} onClick={() => { setStep('done'); }}>
                탈퇴하기
              </Button>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IcCheckCircle size={32}/>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-strong)', textAlign: 'center', marginBottom: 8 }} className="kr-heading">
              탈퇴 처리가 완료됐어요
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, textAlign: 'center', marginBottom: 20 }} className="kr-heading">
              그동안 진로나침반을 이용해주셔서 감사했어요.
              {role !== 'teacher' && '\n30일 이내라면 동일 이메일로 재가입 시 복구할 수 있어요.'}
            </div>
            <Button variant="primary" size="lg" full onClick={() => { onConfirm && onConfirm(); onClose(); }}>처음으로</Button>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// TeacherProfile (desktop)
// ────────────────────────────────────────────────────────
function TeacherProfile({ go, openNotif }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  const [roster, setRoster] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) {}
      try { const r = await window.__apiFetch('/teacher/students', { method: 'GET' }); setRoster(r.data || []); } catch (e) { setRoster([]); }
    })();
  }, []);
  const list = roster || [];
  const active = list.filter(s => (s.studyDone || 0) > 0 || (s.aiProgress || 0) > 0).length;
  const need = list.filter(s => s.needsCounseling).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <TeacherTopbar title="내정보" subtitle="프로필, 동의 항목, 보안 설정을 관리하세요" openNotif={openNotif}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: 28, background: 'var(--bg-canvas)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Card padding={24} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar name={((me && me.name) || '교')[0]} size={72}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg-strong)' }}>{(me && me.name) || '선생님'}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 8 }}>{(me && [me.school, me.classroom].filter(Boolean).join(' · ')) || '학급 정보 없음'}</div>
              <Chip tone="info" size="sm" leading={<IcSparkles size={11}/>}>교사 플랜 · 무료</Chip>
            </div>
          </Card>
          <Card padding={24}>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 12, fontWeight: 600 }}>학급 요약</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <Stat label="학생" value={roster === null ? '…' : String(list.length)}/>
              <Stat label="활동 중" value={roster === null ? '…' : active + '명'}/>
              <Stat label="상담 필요" value={roster === null ? '…' : need + '명'}/>
            </div>
          </Card>
        </div>

        <SectionCard title="계정 관리" style={{ marginBottom: 16 }}>
          <Card padding={0} style={{ boxShadow: 'none', border: '1px solid var(--line-subtle)' }}>
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-mint-bg)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcFlag size={16}/></div>}
              title="공지사항"
              subtitle="업데이트 소식 · 건의·버그 제보"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('announcements')}
            />
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcShield size={16}/></div>}
              title="동의 항목 관리"
              subtitle="개인정보·결제 등 동의 내역 관리"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('consents')}
            />
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCreditCard size={16}/></div>}
              title="구독 및 결제"
              subtitle="무료 체험 18일 남음"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('billing')}
            />
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcLock size={16}/></div>}
              title="비밀번호 변경"
              subtitle="2026-04-12 마지막 변경"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('settings-password')}
            />
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>}
              title="알림 설정"
              subtitle="SSE · 이메일 · 푸시 채널"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('settings-notifications')}
            />
            <ListRow
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcDoc size={16}/></div>}
              title="이용약관 · 개인정보 처리방침"
              trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>}
              onClick={() => go('settings-terms')}
              divider={false}
            />
          </Card>
        </SectionCard>

        <SectionCard title="위험 작업" style={{ marginBottom: 16 }}>
          <Card padding={20} style={{ background: 'var(--danger-bg)', boxShadow: 'none', border: '1px solid #F5C2C7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>회원 탈퇴</div>
                <div style={{ fontSize: 12, color: 'var(--danger)', opacity: 0.85, lineHeight: 1.55 }} className="kr-heading">
                  학급, 학생 메모, 결제 내역이 영구 삭제돼요. 신중히 결정해주세요.
                </div>
              </div>
              <Button variant="danger" size="md" onClick={() => setDeleteOpen(true)} leading={<IcLogout size={14}/>}>탈퇴 진행</Button>
            </div>
          </Card>
        </SectionCard>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button style={{ padding: '14px 28px', border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer' }}>로그아웃</button>
        </div>
      </div>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} role="teacher"/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// TeacherProfileMobile
// ────────────────────────────────────────────────────────
function TeacherProfileMobile({ go }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); } })();
  }, []);
  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(' ') || '학급 정보 없음';
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', position: 'relative' }}>
      <ScreenHeader title="더보기"/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} hoverable onClick={() => go('teacher-info')} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
          <Avatar name={((u.name) || '교')[0]} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{me === null ? '…' : ((u.name || '이름 미설정') + ' 선생님')}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{classLine}</div>
            <Chip tone="info" size="sm" style={{ marginTop: 6 }}>교사 플랜 · 무료 체험</Chip>
          </div>
          <IcChevronRight size={20} color="var(--fg-subtle)"/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>학급</div>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--neutral-bg)', color: 'var(--neutral-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcUser size={16}/></div>} title="내 정보" subtitle="이름 · 이메일 · 담당 학급" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('teacher-info')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcSchool size={16}/></div>} title="학급 관리" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('classroom')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcUsers size={16}/></div>} title="학생 관리" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('students')} divider={false}/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>계정 관리</div>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-mint-bg)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcFlag size={16}/></div>} title="공지사항" subtitle="업데이트 소식 · 건의·버그 제보" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('announcements')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcShield size={16}/></div>} title="동의 항목 관리" subtitle="개인정보 · 결제 동의 내역" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('consents')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCreditCard size={16}/></div>} title="구독 및 결제" subtitle="무료 체험 중 (결제 미연동)" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('billing')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcLock size={16}/></div>} title="비밀번호 변경" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-password')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>} title="알림 설정" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-notifications')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>} title="공지사항" subtitle="운영팀 공지를 확인해요" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-announcements')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcMessage size={16}/></div>} title="건의하기" subtitle="개선 의견·버그를 운영팀에 보내요" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-suggest')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcDoc size={16}/></div>} title="이용약관 · 개인정보 처리방침" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-terms')} divider={false}/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>위험 작업</div>
        <Card padding={16} style={{ marginBottom: 16, background: 'var(--danger-bg)', boxShadow: 'none', border: '1px solid #F5C2C7' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>회원 탈퇴</div>
          <div style={{ fontSize: 12, color: 'var(--danger)', opacity: 0.85, lineHeight: 1.55, marginBottom: 12 }} className="kr-heading">
            학급, 학생 메모, 결제 내역이 영구 삭제돼요.
          </div>
          <Button variant="danger" size="md" full leading={<IcLogout size={14}/>} onClick={() => setDeleteOpen(true)}>탈퇴 진행</Button>
        </Card>

        <button style={{ width: '100%', padding: 14, border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer' }}>로그아웃</button>
      </div>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} role="teacher"/>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// StudentProfileV2 — adds account deletion (replaces basic version)
// ────────────────────────────────────────────────────────
function StudentProfileV2({ go }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); } })();
  }, []);
  const u = me || {};
  const schoolLine = [u.school, u.classroom].filter(Boolean).join(' · ') || (typeof gradeLabel === 'function' ? gradeLabel(u.grade) : (u.grade || ''));
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%', position: 'relative' }}>
      <ScreenHeader title="더보기"/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} hoverable onClick={() => go('student-info')} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
          <Avatar name={(u.name || '학')[0]} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{me === null ? '…' : (u.name || '이름 미설정')}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{schoolLine || '학교 정보 미설정'}</div>
            {u.classroom ? <Chip tone="brand" size="sm" style={{ marginTop: 6 }}>{u.classroom}</Chip> : null}
          </div>
          <IcChevronRight size={20} color="var(--fg-subtle)"/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>진로 · 학습</div>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--neutral-bg)', color: 'var(--neutral-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcUser size={16}/></div>} title="내 정보" subtitle="이름 · 이메일 · 학교 정보" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('student-info')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcTarget size={16}/></div>} title="진로 목표 관리" subtitle="3개 목표 · 미디어 콘텐츠 디자이너" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('career-targets')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--info-bg)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcSchool size={16}/></div>} title="학급 정보" subtitle={u.classroom || '미배정'} trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('class-info')} divider={false}/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>계정 관리</div>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-mint-bg)', color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcFlag size={16}/></div>} title="공지사항" subtitle="업데이트 소식 · 건의·버그 제보" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('announcements')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcShield size={16}/></div>} title="동의 항목 관리" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('consents')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCreditCard size={16}/></div>} title="구독 및 결제" subtitle="무료 체험 중 (결제 미연동)" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('billing')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcLock size={16}/></div>} title="비밀번호 변경" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-password')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>} title="알림 설정" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-notifications')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcBell size={16}/></div>} title="공지사항" subtitle="운영팀 공지를 확인해요" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-announcements')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-muted)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcMessage size={16}/></div>} title="건의하기" subtitle="개선 의견·버그를 운영팀에 보내요" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-suggest')}/>
          <ListRow leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcDoc size={16}/></div>} title="이용약관 · 개인정보 처리방침" trailing={<IcChevronRight size={18} color="var(--fg-subtle)"/>} onClick={() => go('settings-terms')} divider={false}/>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 4px 8px' }}>위험 작업</div>
        <Card padding={16} style={{ marginBottom: 16, background: 'var(--danger-bg)', boxShadow: 'none', border: '1px solid #F5C2C7' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>회원 탈퇴</div>
          <div style={{ fontSize: 12, color: 'var(--danger)', opacity: 0.85, lineHeight: 1.55, marginBottom: 12 }} className="kr-heading">
            AI 상담·성적·진로 데이터가 영구 삭제돼요. 30일 이내라면 복구할 수 있어요.
          </div>
          <Button variant="danger" size="md" full leading={<IcLogout size={14}/>} onClick={() => setDeleteOpen(true)}>탈퇴 진행</Button>
        </Card>

        <button style={{ width: '100%', padding: 14, border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 14, cursor: 'pointer' }}>로그아웃</button>
      </div>
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} role="student"/>
    </div>
  );
}

Object.assign(window, { DeleteAccountDialog, TeacherProfile, TeacherProfileMobile, StudentProfileV2, StudentInfoScreen, ClassInfoScreen, TeacherInfoScreen });

// ────────────────────────────────────────────────────────
// Editable info field row
// ────────────────────────────────────────────────────────
function EditableInfoRow({ label, value, editing, onChange, last, type = 'text' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: last ? 'none' : '1px solid var(--line-subtle)' }}>
      <span style={{ fontSize: 13, color: 'var(--fg-muted)', flexShrink: 0 }}>{label}</span>
      {editing ? (
        <input value={value} onChange={(e) => onChange(e.target.value)} type={type} style={{
          flex: 1, textAlign: 'right', border: 'none', outline: 'none', background: 'transparent',
          fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', minWidth: 0,
          borderBottom: '1.5px solid var(--brand-500)', paddingBottom: 2,
        }}/>
      ) : (
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', textAlign: 'right' }} className="kr-heading">{value}</span>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 내 정보 — STUDENT (editable: 휴대폰/이메일/학급 등)
// ────────────────────────────────────────────────────────
const STUDENT_GRADE_LABELS = { E4: '초4', E5: '초5', E6: '초6', M1: '중1', M2: '중2', M3: '중3', H1: '고1', H2: '고2', H3: '고3' };
const STUDENT_GRADE_OPTIONS = Object.keys(STUDENT_GRADE_LABELS);
function gradeLabel(code) { return STUDENT_GRADE_LABELS[code] || (code ? String(code) : '미설정'); }

function StudentInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); const u = r.data || r; setMe(u); setName(u.name || ''); setGrade(u.grade || ''); } catch (e) { setMe({}); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const startEdit = () => { if (me) { setName(me.name || ''); setGrade(me.grade || ''); } setEditing(true); };
  const save = async () => {
    if (!name.trim()) { showToast('이름을 입력해주세요', 'error'); return; }
    setSaving(true);
    try {
      const body = { name: name.trim() };
      if (grade) body.grade = grade;
      await window.__apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) });
      await load();
      setEditing(false);
      showToast('내 정보를 저장했어요', 'success');
    } catch (e) {
      showToast((e && e.body && e.body.message) || '저장에 실패했어요', 'error');
    } finally { setSaving(false); }
  };

  const u = me || {};
  const schoolLine = [u.school, u.classroom].filter(Boolean).join(' · ') || gradeLabel(u.grade);
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="내 정보" leading={<BackButton onClick={() => go('profile')}/>}
        trailing={editing
          ? <Button variant="primary" size="sm" onClick={save} disabled={saving}>{saving ? '저장 중…' : '저장'}</Button>
          : <Button variant="brandSoft" size="sm" leading={<IcSettings size={13}/>} onClick={startEdit}>수정</Button>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={(u.name || '학')[0]} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{me === null ? '…' : (u.name || '이름 미설정')}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{schoolLine}</div>
          </div>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <EditableInfoRow label="이름" value={name} editing={editing} onChange={setName}/>
          {editing ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--line-subtle)' }}>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)', flexShrink: 0 }}>학년</span>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ border: '1.5px solid var(--brand-500)', borderRadius: 8, padding: '6px 10px', fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)', background: '#fff' }}>
                <option value="">미설정</option>
                {STUDENT_GRADE_OPTIONS.map((g) => <option key={g} value={g}>{STUDENT_GRADE_LABELS[g]}</option>)}
              </select>
            </div>
          ) : (
            <EditableInfoRow label="학년" value={gradeLabel(u.grade)} editing={false} onChange={() => {}}/>
          )}
          <EditableInfoRow label="이메일" value={u.email || '-'} editing={false} onChange={() => {}}/>
          <EditableInfoRow label="학교" value={u.school || '미설정'} editing={false} onChange={() => {}}/>
          <EditableInfoRow label="반" value={u.classroom || '미배정'} editing={false} onChange={() => {}} last/>
        </Card>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', textAlign: 'center', lineHeight: 1.5 }} className="kr-heading">
          {editing ? '이름과 학년을 변경할 수 있어요. 학교·반은 담당 선생님 학급에 가입하면 자동 반영돼요.' : '이메일은 로그인 계정이라 변경할 수 없어요.'}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 내 정보 — TEACHER (editable)
// ────────────────────────────────────────────────────────
function TeacherInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); const u = r.data || r; setMe(u); setName(u.name || ''); } catch (e) { setMe({}); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const startEdit = () => { if (me) setName(me.name || ''); setEditing(true); };
  const save = async () => {
    if (!name.trim()) { showToast('이름을 입력해주세요', 'error'); return; }
    setSaving(true);
    try {
      await window.__apiFetch('/auth/profile', { method: 'PATCH', body: JSON.stringify({ name: name.trim() }) });
      await load();
      setEditing(false);
      showToast('내 정보를 저장했어요', 'success');
    } catch (e) {
      showToast((e && e.body && e.body.message) || '저장에 실패했어요', 'error');
    } finally { setSaving(false); }
  };

  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(' ') || '학급 정보 없음';
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="내 정보" leading={<BackButton onClick={() => go('profile')}/>}
        trailing={editing
          ? <Button variant="primary" size="sm" onClick={save} disabled={saving}>{saving ? '저장 중…' : '저장'}</Button>
          : <Button variant="brandSoft" size="sm" leading={<IcSettings size={13}/>} onClick={startEdit}>수정</Button>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={((u.name) || '교')[0]} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)' }}>{me === null ? '…' : ((u.name || '이름 미설정') + ' 선생님')}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{classLine}</div>
          </div>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          <EditableInfoRow label="이름" value={name} editing={editing} onChange={setName}/>
          <EditableInfoRow label="이메일" value={u.email || '-'} editing={false} onChange={() => {}}/>
          <EditableInfoRow label="학교" value={u.school || '미설정'} editing={false} onChange={() => {}}/>
          <EditableInfoRow label="담당 학급" value={u.classroom || '미배정'} editing={false} onChange={() => {}} last/>
        </Card>
        <div style={{ fontSize: 12, color: 'var(--fg-subtle)', textAlign: 'center', lineHeight: 1.5 }} className="kr-heading">
          {editing ? '이름을 변경할 수 있어요.' : '이메일은 로그인 계정이라 변경할 수 없어요.'}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 학급 정보 — classroom detail (student side)
// ────────────────────────────────────────────────────────
function ClassInfoScreen({ go }) {
  const [me, setMe] = React.useState(null);
  React.useEffect(() => {
    (async () => { try { const r = await window.__apiFetch('/auth/me', { method: 'GET' }); setMe(r.data || r); } catch (e) { setMe({}); } })();
  }, []);
  const u = me || {};
  const classLine = [u.school, u.classroom].filter(Boolean).join(' ') || '학급 정보 없음';
  const enrolled = !!(u.school || u.classroom);
  return (
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100%' }}>
      <ScreenHeader title="학급 정보" leading={<BackButton onClick={() => go('profile')}/>}/>
      <div style={{ padding: '0 16px 24px' }}>
        <Card padding={20} style={{ marginBottom: 12, background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={(classLine || '학')[0]} size={52}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg-strong)' }}>{me === null ? '…' : classLine}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{enrolled ? '가입된 학급' : '아직 학급에 가입되지 않았어요'}</div>
            </div>
            {enrolled ? <Chip tone="success" size="sm" leading={<IcCheckCircle size={11}/>}>참여 중</Chip> : null}
          </div>
        </Card>
        <Card padding={0} style={{ marginBottom: 12 }}>
          {[
            ['학교', u.school || '미설정'], ['학급', u.classroom || '미배정'],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{k}</span>
              <span className="num" style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-strong)' }}>{me === null ? '…' : v}</span>
            </div>
          ))}
        </Card>
        <Card padding={16}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" size="md" full leading={<IcMessage size={15}/>} onClick={() => go('messages')}>선생님께 메시지</Button>
            <Button variant="outline" size="md" full leading={<IcCalendar size={15}/>} onClick={() => go('counseling-request')}>상담 요청</Button>
          </div>
        </Card>
        <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
          학급을 옮기거나 나가려면 선생님께 문의하거나 고객센터로 연락해주세요.
        </div>
      </div>
    </div>
  );
}
