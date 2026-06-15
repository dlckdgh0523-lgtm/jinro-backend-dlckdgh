// mobile-auth.jsx — mobile app authentication flow (role-split).
// Screens: welcome (role select) → login / signup / find-id / find-password.
// Self-contained <MobileAuthApp/> with internal navigation; on "complete"
// it would hand off to the role's main app (here: calls onEnter(role)).

// Flat geometric compass mascot — inline SVG, CSS-variable driven (light/dark safe).
// Main blue + white + single point color (amber needle). No gradients/shadows.
function CompassMascot({ size = 200 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true"
      style={{ display: 'block' }}>
      {/* soft round backdrop */}
      <circle cx="100" cy="100" r="100" fill="var(--brand-50)"/>
      {/* compass body */}
      <circle cx="100" cy="100" r="66" fill="#FFFFFF" stroke="var(--brand-500)" strokeWidth="6"/>
      {/* tick marks (N E S W) */}
      <g stroke="var(--brand-200)" strokeWidth="4" strokeLinecap="round">
        <line x1="100" y1="42" x2="100" y2="50"/>
        <line x1="100" y1="150" x2="100" y2="158"/>
        <line x1="42" y1="100" x2="50" y2="100"/>
        <line x1="150" y1="100" x2="158" y2="100"/>
      </g>
      {/* UPPER HALF — needle, pivot above the eyes */}
      <path d="M100 56 L110 80 L100 74 L90 80 Z" fill="var(--brand-500)"/>
      <path d="M100 92 L110 80 L100 86 L90 80 Z" fill="#FF9F45"/>
      <circle cx="100" cy="80" r="5.5" fill="#FFFFFF" stroke="var(--brand-500)" strokeWidth="3.5"/>
      {/* LOWER HALF — face, clearly below the needle */}
      <circle cx="86" cy="116" r="4.5" fill="var(--brand-500)"/>
      <circle cx="114" cy="116" r="4.5" fill="var(--brand-500)"/>
      <path d="M89 127 Q100 136 111 127" stroke="var(--brand-500)" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function AuthLogo({ size = 'lg' }) {
  const big = size === 'lg';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: big ? 12 : 8 }}>
      <div style={{ width: big ? 64 : 40, height: big ? 64 : 40, borderRadius: big ? 18 : 12, background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(49,130,246,0.3)' }}>
        <IcCompass size={big ? 36 : 22} color="#fff"/>
      </div>
      <div style={{ fontSize: big ? 22 : 16, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px' }}>진로나침반</div>
    </div>
  );
}

// Role pill toggle reused across auth screens
function RoleToggle({ role, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 4, background: 'var(--neutral-bg)', borderRadius: 14 }}>
      {[{ id: 'student', label: '학생', icon: <IcUser/> }, { id: 'teacher', label: '교사', icon: <IcGraduation/> }].map(r => {
        const active = role === r.id;
        return (
          <button key={r.id} onClick={() => onChange(r.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 0', borderRadius: 11, border: 'none', cursor: 'pointer',
            background: active ? 'var(--bg-surface)' : 'transparent',
            color: active ? (r.id === 'teacher' ? 'var(--accent-purple)' : 'var(--brand-600)') : 'var(--fg-muted)',
            fontSize: 14, fontWeight: 700,
            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>{React.cloneElement(r.icon, { size: 16 })}{r.label}</button>
        );
      })}
    </div>
  );
}

function AuthField({ label, value, onChange, placeholder, type = 'text', trailing, error }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-default)', display: 'block', marginBottom: 6 }}>{label}</label>
      <TextInput value={value} onChange={onChange} placeholder={placeholder} type={type} trailing={trailing} error={error}/>
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ── WELCOME (premium, role-locked entry) ──
function AuthWelcome({ role, setRole, go, onEnter }) {
  const isT = role === 'teacher';
  const feats = isT
    ? ['초대코드 학급 관리', '학생별 진로 리포트', '상담 일정·메모']
    : ['대화형 AI 상담', '성적 추이 분석', '맞춤 학습 계획'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      {/* (1) Hero mascot */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '24px 28px 0' }}>
        <CompassMascot size={170}/>
      </div>

      {/* (2) Headline + sub */}
      <div style={{ padding: '24px 28px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.8px', lineHeight: 1.3 }} className="kr-heading">
          성적과 대화로 찾는<br/>나만의 진로 방향
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }} className="kr-heading">
          {isT ? '학생 한 명 한 명의 진로와 학습을\n한 곳에서 살펴보세요.' : 'AI와 편하게 대화하며\n진로를 천천히 좁혀가요.'}
        </div>
      </div>

      {/* (3) Features */}
      <div style={{ padding: '20px 40px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {feats.map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-50)', color: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><IcCheck size={14} strokeWidth={2.5}/></span>
            <span style={{ fontSize: 14.5, color: 'var(--fg-default)', fontWeight: 600 }} className="kr-heading">{t}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 0.5 }}/>

      {/* (4) Role toggle + (5) CTA */}
      <div style={{ padding: '0 20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <RoleToggle role={role} onChange={setRole}/>
        <Button variant="primary" size="xl" full onClick={() => go('login')}>
          {isT ? '교사로 시작하기' : '학생으로 시작하기'}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13.5, color: 'var(--fg-muted)' }}>
          이미 계정이 있나요?
          <button onClick={() => go('login')} style={{ border: 'none', background: 'transparent', color: 'var(--brand-500)', fontWeight: 700, cursor: 'pointer' }}>로그인</button>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN (role-locked: shows only the active role) ──
function AuthLogin({ role, setRole, go, onEnter }) {
  const isT = role === 'teacher';
  const [id, setId] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const brand = isT ? 'var(--accent-purple)' : 'var(--brand-500)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <ScreenHeader leading={<BackButton onClick={() => go('welcome')}/>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
        {/* role badge — locked to current role, not a switcher */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: isT ? 'var(--accent-purple-bg)' : 'var(--brand-50)', color: brand, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
          {isT ? <IcGraduation size={14}/> : <IcUser size={14}/>}{isT ? '교사 로그인' : '학생 로그인'}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.6px', marginBottom: 6 }} className="kr-heading">
          {isT ? '선생님, 다시 오셨네요' : '다시 만나서 반가워요'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 24 }}>로그인하고 이어서 진행해요</div>

        <AuthField label="아이디 (이메일)" value={id} onChange={setId} placeholder="email@example.com" type="email"/>
        <AuthField label="비밀번호" value={pw} onChange={setPw} placeholder="비밀번호" type={showPw ? 'text' : 'password'}
          trailing={<button onClick={() => setShowPw(s => !s)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-subtle)', display: 'flex' }}>{showPw ? <IcEyeOff size={18}/> : <IcEye size={18}/>}</button>}/>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, margin: '4px 2px 22px', fontSize: 13 }}>
          <button onClick={() => go('find-id')} style={{ border: 'none', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', fontWeight: 600 }}>아이디 찾기</button>
          <span style={{ color: 'var(--line-strong)' }}>|</span>
          <button onClick={() => go('find-pw')} style={{ border: 'none', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', fontWeight: 600 }}>비밀번호 찾기</button>
        </div>
        <Button variant="primary" size="xl" full onClick={() => onEnter(role)} style={{ background: brand }}>로그인</Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>또는 간편하게</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button variant="outline" size="lg" full leading={<IcGoogle size={18}/>} onClick={() => onEnter(role)}>Google로 계속하기</Button>
          <Button variant="outline" size="lg" full leading={<IcKakao size={18}/>} style={{ background: '#FEE500', borderColor: '#FEE500' }} onClick={() => onEnter(role)}>카카오로 계속하기</Button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 24 }}>
          {isT ? '교사' : '학생'} 계정이 없나요? <button onClick={() => go('signup')} style={{ border: 'none', background: 'transparent', color: brand, fontWeight: 700, cursor: 'pointer' }}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

// ── SIGNUP (role-locked + structured consent) ──
function AuthSignup({ role, setRole, go, onEnter }) {
  const isT = role === 'teacher';
  const [f, setF] = React.useState({ name: '', email: '', pw: '', pw2: '', code: '', school: '' });
  const set = (k) => (v) => setF(s => ({ ...s, [k]: v }));
  const [showPw, setShowPw] = React.useState(false);
  const [consent, setConsent] = React.useState({});
  const [legalDoc, setLegalDoc] = React.useState(null); // 'terms' | 'privacy'
  const brand = isT ? 'var(--accent-purple)' : 'var(--brand-500)';
  const pwMismatch = f.pw2 && f.pw !== f.pw2;

  const allChecked = CONSENT_ITEMS.every(c => consent[c.id]);
  const toggleAll = () => {
    const v = !allChecked;
    const next = {}; CONSENT_ITEMS.forEach(c => next[c.id] = v); setConsent(next);
  };
  const requiredOk = CONSENT_ITEMS.filter(c => c.required).every(c => consent[c.id]);
  const canSubmit = f.name && f.email && f.pw && !pwMismatch && requiredOk;

  if (legalDoc) return <LegalDocScreen doc={legalDoc} onBack={() => setLegalDoc(null)}/>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <ScreenHeader leading={<BackButton onClick={() => go('welcome')}/>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: isT ? 'var(--accent-purple-bg)' : 'var(--brand-50)', color: brand, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
          {isT ? <IcGraduation size={14}/> : <IcUser size={14}/>}{isT ? '교사 회원가입' : '학생 회원가입'}
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.5px', lineHeight: 1.3, marginBottom: 22, whiteSpace: 'pre-line' }} className="kr-heading">
          {isT ? '학급을 만들고\n학생을 초대해보세요' : '진로 고민, 대화로\n시작해볼까요?'}
        </div>

        <AuthField label="이름" value={f.name} onChange={set('name')} placeholder={isT ? '예) 이지원' : '예) 김지훈'}/>
        <AuthField label="아이디 (이메일)" value={f.email} onChange={set('email')} placeholder="email@example.com" type="email"/>
        <AuthField label="비밀번호" value={f.pw} onChange={set('pw')} placeholder="영문·숫자 포함 8자 이상" type={showPw ? 'text' : 'password'}
          trailing={<button onClick={() => setShowPw(s => !s)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-subtle)', display: 'flex' }}>{showPw ? <IcEyeOff size={18}/> : <IcEye size={18}/>}</button>}/>
        <AuthField label="비밀번호 확인" value={f.pw2} onChange={set('pw2')} placeholder="비밀번호 재입력" type="password" error={pwMismatch ? '비밀번호가 일치하지 않아요' : null}/>

        {isT ? (
          <AuthField label="학교 / 학급" value={f.school} onChange={set('school')} placeholder="예) 한빛고 2-3 (가입 후 변경 가능)"/>
        ) : (
          <div style={{ marginBottom: 14 }}>
            <AuthField label="초대코드 (선택)" value={f.code} onChange={set('code')} placeholder="예) H8K49P"/>
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: -8 }} className="kr-heading">선생님께 받은 코드가 있으면 입력하세요. 나중에 입력해도 괜찮아요.</div>
          </div>
        )}

        {/* Consent block */}
        <div style={{ marginTop: 8, border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg-surface)' }}>
          <button onClick={toggleAll} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--line-subtle)' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: allChecked ? brand : 'transparent', border: allChecked ? 'none' : '2px solid var(--line-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcCheck size={15}/></span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>약관에 모두 동의</span>
          </button>
          <div style={{ padding: '6px 16px 10px' }}>
            {CONSENT_ITEMS.map(c => {
              const on = !!consent[c.id];
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                    <button onClick={() => setConsent(s => ({ ...s, [c.id]: !s[c.id] }))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexShrink: 0 }} aria-label="동의 토글">
                      <IcCheck size={18} color={on ? brand : 'var(--line-strong)'} strokeWidth={2.5}/>
                    </button>
                    <span style={{ flex: 1, fontSize: 13.5, color: 'var(--fg-default)' }} className="kr-heading">
                      <span style={{ color: c.required ? brand : 'var(--fg-subtle)', fontWeight: 600 }}>[{c.required ? '필수' : '선택'}]</span> {c.label}
                    </span>
                    {c.doc && <button onClick={() => setLegalDoc(c.doc)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-subtle)', fontSize: 12, textDecoration: 'underline', flexShrink: 0 }}>보기</button>}
                  </div>
                  {c.desc && on && <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', lineHeight: 1.5, padding: '0 0 8px 28px' }} className="kr-heading">{c.desc}</div>}
                </div>
              );
            })}
          </div>
        </div>
        {!requiredOk && (consent.terms !== undefined || consent.privacy !== undefined) && (
          <div style={{ fontSize: 12, color: 'var(--fg-subtle)', margin: '8px 2px 0' }}>필수 항목(만 14세 이상·이용약관·개인정보)에 동의해야 가입할 수 있어요.</div>
        )}

        <Button variant="primary" size="xl" full disabled={!canSubmit} onClick={() => onEnter(role)} style={{ background: brand, marginTop: 18 }}>
          가입하고 시작하기
        </Button>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 16 }}>
          이미 계정이 있나요? <button onClick={() => go('login')} style={{ border: 'none', background: 'transparent', color: brand, fontWeight: 700, cursor: 'pointer' }}>로그인</button>
        </div>
      </div>
    </div>
  );
}

// ── FIND ID ──
function AuthFindId({ go }) {
  const [phone, setPhone] = React.useState('');
  const [done, setDone] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <ScreenHeader title="아이디 찾기" leading={<BackButton onClick={() => go('login')}/>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        {!done ? (
          <>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 20 }} className="kr-heading">
              가입 시 등록한 휴대폰 번호로 본인 인증을 하면 아이디(이메일)를 알려드려요.
            </div>
            <AuthField label="휴대폰 번호" value={phone} onChange={setPhone} placeholder="010-0000-0000" type="tel"/>
            <Button variant="outline" size="lg" full style={{ marginBottom: 16 }} onClick={() => showToast('인증번호를 전송했어요', 'success')}>인증번호 받기</Button>
            <AuthField label="인증번호" value="" onChange={() => {}} placeholder="6자리 숫자"/>
            <Button variant="primary" size="xl" full disabled={!phone} onClick={() => setDone(true)}>아이디 찾기</Button>
          </>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><IcCheckCircle size={32}/></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8 }}>아이디를 찾았어요</div>
            <Card padding={18} style={{ margin: '16px 0' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 4 }}>회원님의 아이디</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-600)' }}>jih****@example.com</div>
              <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 6 }}>2026. 05. 02 가입</div>
            </Card>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" full onClick={() => go('find-pw')}>비밀번호 찾기</Button>
              <Button variant="primary" full onClick={() => go('login')}>로그인하기</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FIND PASSWORD ──
function AuthFindPw({ go }) {
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState('request'); // request | reset | done
  const [pw, setPw] = React.useState(''); const [pw2, setPw2] = React.useState('');
  const mismatch = pw2 && pw !== pw2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <ScreenHeader title="비밀번호 찾기" leading={<BackButton onClick={() => go('login')}/>}/>
      <div className="toss-scroll" style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        {step === 'request' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 20 }} className="kr-heading">
              가입한 아이디(이메일)로 인증번호를 보내드려요. 인증 후 새 비밀번호를 설정할 수 있어요.
            </div>
            <AuthField label="아이디 (이메일)" value={email} onChange={setEmail} placeholder="email@example.com" type="email"/>
            <Button variant="outline" size="lg" full style={{ marginBottom: 16 }} onClick={() => showToast('인증번호를 이메일로 보냈어요', 'success')}>인증번호 받기</Button>
            <AuthField label="인증번호" value="" onChange={() => {}} placeholder="6자리 숫자"/>
            <Button variant="primary" size="xl" full disabled={!email} onClick={() => setStep('reset')}>다음</Button>
          </>
        )}
        {step === 'reset' && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 16 }}>새 비밀번호 설정</div>
            <AuthField label="새 비밀번호" value={pw} onChange={setPw} placeholder="8자 이상" type="password"/>
            <AuthField label="새 비밀번호 확인" value={pw2} onChange={setPw2} placeholder="비밀번호 재입력" type="password" error={mismatch ? '비밀번호가 일치하지 않아요' : null}/>
            <Button variant="primary" size="xl" full disabled={!pw || mismatch} onClick={() => setStep('done')}>비밀번호 변경</Button>
          </>
        )}
        {step === 'done' && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><IcCheckCircle size={32}/></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8 }}>비밀번호를 변경했어요</div>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 24 }} className="kr-heading">새 비밀번호로 다시 로그인해주세요.</div>
            <Button variant="primary" size="xl" full onClick={() => go('login')}>로그인하기</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main router ──
function MobileAuthApp({ initialScreen = 'intro', initialRole = 'student', onEnter = () => {} }) {
  const [screen, setScreen] = React.useState(initialScreen);
  const [role, setRole] = React.useState(initialRole);
  const go = (s) => setScreen(s);
  const common = { role, setRole, go, onEnter };
  return (
    <div style={{ height: '100%', background: 'var(--bg-canvas)' }}>
      {screen === 'intro' && <AppIntro onDone={() => go('welcome')}/>}
      {screen === 'welcome' && <AuthWelcome {...common}/>}
      {screen === 'login' && <AuthLogin {...common}/>}
      {screen === 'signup' && <AuthSignup {...common}/>}
      {screen === 'find-id' && <AuthFindId go={go}/>}
      {screen === 'find-pw' && <AuthFindPw go={go}/>}
    </div>
  );
}

// App intro — 3-slide swipeable onboarding carousel (animated CSS/SVG, no deps).
const INTRO_SLIDES = [
  { key: 'talk', accent: 'var(--brand-500)', title: '대화로 시작하는 진로 탐색', body: '성적표가 아니라 대화로. AI와 편하게 이야기하며 나를 알아가요.' },
  { key: 'grow', accent: 'var(--accent-mint)', title: '성적 변화를 한눈에', body: '점수가 아니라 흐름으로 봐요. 어디서 자라고 있는지 보여드려요.' },
  { key: 'plan', accent: 'var(--accent-purple)', title: '선생님과 함께 가요', body: '혼자가 아니에요. 선생님이 학습과 상담으로 곁에서 도와요.' },
];

function IntroArt({ slideKey, accent }) {
  // Distinct flat animated SVG per slide
  if (slideKey === 'talk') {
    return (
      <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
        <rect x="24" y="40" width="118" height="44" rx="14" fill="#fff" stroke="var(--line)" strokeWidth="2"/>
        <rect x="38" y="54" width="70" height="6" rx="3" fill="var(--line-strong)"/>
        <rect x="38" y="66" width="44" height="6" rx="3" fill="var(--line)"/>
        <rect x="60" y="96" width="116" height="44" rx="14" fill={accent}/>
        <rect x="74" y="110" width="76" height="6" rx="3" fill="rgba(255,255,255,0.85)"/>
        <rect x="74" y="122" width="50" height="6" rx="3" fill="rgba(255,255,255,0.55)"/>
        <circle cx="160" cy="44" r="16" fill="var(--brand-50)"/>
        <text x="160" y="49" textAnchor="middle" fontSize="14" fontWeight="700" fill={accent}>AI</text>
        <style>{`@keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
        <g style={{ animation: 'floatA 2.4s ease-in-out infinite' }}><circle cx="160" cy="44" r="16" fill="none" stroke={accent} strokeWidth="2" opacity="0.4"/></g>
      </svg>
    );
  }
  if (slideKey === 'grow') {
    return (
      <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
        <line x1="30" y1="140" x2="180" y2="140" stroke="var(--line)" strokeWidth="2"/>
        <polyline points="36,120 72,128 108,92 144,80 176,48" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="240" strokeDashoffset="240" style={{ animation: 'drawL 1.6s ease forwards' }}/>
        {[[36,120],[72,128],[108,92],[144,80],[176,48]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke={accent} strokeWidth="3" opacity="0" style={{ animation: `popD .3s ${0.6+i*0.18}s ease forwards` }}/>
        ))}
        <style>{`@keyframes drawL{to{stroke-dashoffset:0}}@keyframes popD{to{opacity:1}}`}</style>
      </svg>
    );
  }
  return (
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
      <circle cx="70" cy="74" r="22" fill="var(--accent-purple-bg)"/>
      <circle cx="70" cy="66" r="9" fill={accent}/><path d="M52 92c0-11 8-17 18-17s18 6 18 17" fill={accent}/>
      <circle cx="134" cy="74" r="22" fill="var(--brand-50)"/>
      <circle cx="134" cy="66" r="9" fill="var(--brand-500)"/><path d="M116 92c0-11 8-17 18-17s18 6 18 17" fill="var(--brand-500)"/>
      <path d="M88 80 Q102 64 116 80" stroke="var(--line-strong)" strokeWidth="3" fill="none" strokeDasharray="4 4"/>
      <rect x="60" y="118" width="84" height="30" rx="10" fill="#fff" stroke="var(--line)" strokeWidth="2"/>
      <rect x="72" y="129" width="60" height="6" rx="3" fill="var(--line-strong)"/>
      <style>{`@keyframes pulseP{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
      <g style={{ transformOrigin: '102px 80px', animation: 'pulseP 2.2s ease-in-out infinite' }}/>
    </svg>
  );
}

function AppIntro({ onDone }) {
  const [i, setI] = React.useState(0);
  const slide = INTRO_SLIDES[i];
  const last = i === INTRO_SLIDES.length - 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 18px' }}>
        <button onClick={onDone} style={{ border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>건너뛰기</button>
      </div>
      <div key={slide.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', textAlign: 'center', animation: 'fadeIn .4s ease' }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <IntroArt slideKey={slide.key} accent={slide.accent}/>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.6px', lineHeight: 1.3 }} className="kr-heading">{slide.title}</div>
        <div style={{ fontSize: 14.5, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.6 }} className="kr-heading">{slide.body}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 0 24px' }}>
        {INTRO_SLIDES.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`슬라이드 ${k+1}`} style={{
            width: k === i ? 22 : 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: k === i ? 'var(--brand-500)' : 'var(--line-strong)', transition: 'all .25s var(--ease-toss)',
          }}/>
        ))}
      </div>
      <div style={{ padding: '0 20px 22px' }}>
        <Button variant="primary" size="xl" full onClick={() => last ? onDone() : setI(i + 1)}>
          {last ? '시작하기' : '다음'}
        </Button>
      </div>
    </div>
  );
}

Object.assign(window, { MobileAuthApp, AppIntro, AuthWelcome, AuthLogin, AuthSignup, AuthFindId, AuthFindPw, RoleToggle });
