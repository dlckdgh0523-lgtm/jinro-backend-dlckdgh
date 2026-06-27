// public-screens.jsx — Landing, auth, payment result screens.
// These are full-bleed responsive web layouts (no device frame chrome).

// ────────────────────────────────────────────────────────
// Landing page
// ────────────────────────────────────────────────────────
function LandingPage({ variant = 'A', onNav }) {
  const nav = onNav || (() => {});
  return (
    <div style={{
      minHeight: '100%', background: '#fff',
      fontFamily: 'var(--font-sans)', color: 'var(--fg-strong)',
      overflow: 'auto',
    }} className="toss-scroll">
      <LandingNav onNav={nav}/>
      {variant === 'A' ? <LandingHeroA onNav={nav}/> : <LandingHeroB onNav={nav}/>}
      <LandingApproach/>           {/* 대화로 시작 → 데이터로 검증 → 카드로 추가 */}
      <LandingDataSources/>        {/* 실 공공데이터 강조 */}
      <LandingProductCards/>
      <LandingFeatureCards/>       {/* 봉사·장학금·캘린더·교환 활용 사례 */}
      <LandingStudentValue/>
      <LandingTeacherValue/>
      <LandingAiSafety/>           {/* AI 너무 신용하지 말기 */}
      <LandingSecurity/>
      <LandingPricing onNav={nav}/>{/* 결제는 맨 밑으로 */}
      <LandingFinalCTA onNav={nav}/>
      <LandingFooter/>
    </div>
  );
}

function LandingNav({ onNav = () => {} }) {
  return (
    <nav style={{
      padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--line-subtle)', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcCompass size={18} color="#fff"/>
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.3px' }}>진로나침반</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="ghost" size="md" onClick={() => onNav('auth', 'student', 'login')}>로그인</Button>
        <Button variant="primary" size="md" onClick={() => onNav('auth', 'student', 'signup')}>시작하기</Button>
      </div>
    </nav>
  );
}

function LandingHeroA({ onNav = () => {} }) {
  return (
    <section style={{ padding: '96px 40px 80px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'center' }}>
      <div>
        <Chip tone="brand" size="lg" style={{ marginBottom: 20 }}>AI 진로 상담 · 학생/교사 통합</Chip>
        <h1 style={{
          fontSize: 56, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px',
          color: 'var(--fg-strong)', margin: 0, marginBottom: 20,
        }} className="kr-heading">
          성적과 대화를 바탕으로<br/>
          진로를 함께 찾는<br/>
          <span style={{ background: 'linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI 진로 나침반</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0, marginBottom: 32, maxWidth: 460 }} className="kr-heading">
          학생은 자신의 흥미·강점·성적을 바탕으로 진로를 탐색하고,<br/>
          교사는 학급 전체를 한 화면에서 살펴볼 수 있어요.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" size="xl" trailing={<IcArrowRight size={18}/>} onClick={() => onNav('auth', 'student', 'signup')}>학생으로 시작하기</Button>
          <Button variant="outline" size="xl" onClick={() => onNav('auth', 'teacher', 'signup')}>교사로 시작하기</Button>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 28, fontSize: 13, color: 'var(--fg-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IcCheck size={14} color="var(--success)"/> 첫 달 무료 체험</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IcCheck size={14} color="var(--success)"/> 신용카드 등록 없이 시작</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IcCheck size={14} color="var(--success)"/> 학교 단위 도입 가능</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <HeroVisual/>
      </div>
    </section>
  );
}

function LandingHeroB({ onNav = () => {} }) {
  // Variant B: centered hero, more text-forward
  return (
    <section style={{ padding: '120px 40px 80px', maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
      <Chip tone="brand" size="lg" style={{ marginBottom: 28 }}>AI 진로 상담 서비스</Chip>
      <h1 style={{
        fontSize: 64, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.8px',
        color: 'var(--fg-strong)', margin: 0, marginBottom: 24,
      }} className="kr-heading">
        진로 고민에 답이 필요할 때,<br/>
        <span style={{ background: 'linear-gradient(135deg, #3182F6 0%, #7B61FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>대화로 시작하세요</span>
      </h1>
      <p style={{ fontSize: 18, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0, marginBottom: 36, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }} className="kr-heading">
        흥미·강점·성적을 종합해 진로 가설을 만들어주고,<br/>
        선생님이 학급 전체를 살피며 함께 길을 안내해드려요.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 56 }}>
        <Button variant="primary" size="xl" trailing={<IcArrowRight size={18}/>} onClick={() => onNav('auth', 'student', 'signup')}>무료 체험 시작하기</Button>
        <Button variant="ghost" size="xl" onClick={() => onNav('auth', 'student', 'login')}>서비스 소개</Button>
      </div>
      <HeroVisual/>
    </section>
  );
}

function HeroVisual() {
  // SVG-based phone+browser composition with a chat bubble
  return (
    <div style={{ position: 'relative', height: 420 }}>
      {/* Background gradient blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24 }}>
        <div style={{ position: 'absolute', width: 320, height: 320, top: -80, right: -80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(49,130,246,0.18) 0%, transparent 70%)' }}/>
        <div style={{ position: 'absolute', width: 280, height: 280, bottom: -80, left: -40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.15) 0%, transparent 70%)' }}/>
      </div>

      {/* Phone mock */}
      <div style={{
        position: 'absolute', right: 60, top: 30, bottom: 30,
        width: 220, borderRadius: 32,
        background: '#fff', boxShadow: '0 28px 64px rgba(17,24,39,0.18)',
        border: '1px solid var(--line-subtle)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '14px 14px 8px', borderBottom: '1px solid var(--line-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AI</div>
            <span style={{ fontSize: 11, fontWeight: 700 }}>진로 상담</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--fg-subtle)' }}>62%</span>
          </div>
          <div style={{ height: 3, background: '#EEF', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '62%', background: 'var(--brand-500)' }}/>
          </div>
        </div>
        <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '8px 10px', background: '#F5F7FA', borderRadius: '4px 12px 12px 12px', fontSize: 10, lineHeight: 1.45, color: 'var(--fg-default)' }} className="kr-heading">
            영상 만들 때 어떤 부분이 제일 재밌었어요?
          </div>
          <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '8px 10px', background: 'var(--brand-500)', color: '#fff', borderRadius: '12px 12px 4px 12px', fontSize: 10, lineHeight: 1.45 }} className="kr-heading">
            편집할 때요! 컷 바뀌면 분위기도 바뀌는 게 신기해요
          </div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '8px 10px', background: '#F5F7FA', borderRadius: '4px 12px 12px 12px', fontSize: 10, lineHeight: 1.45, color: 'var(--fg-default)' }} className="kr-heading">
            오 시각적 흐름에 강점이 있네요. 잠시만요...
          </div>
          <div style={{
            padding: '8px 10px', background: 'linear-gradient(135deg, #F4ECFF 0%, #EBF4FF 100%)',
            borderRadius: 8, fontSize: 9, color: 'var(--accent-purple)', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <IcSparkles size={10}/> 새로운 단서 발견: 시각적 표현
          </div>
        </div>
      </div>

      {/* Teacher dashboard mock */}
      <div style={{
        position: 'absolute', left: 20, top: 70,
        width: 280, borderRadius: 16,
        background: '#fff', boxShadow: '0 20px 48px rgba(17,24,39,0.14)',
        border: '1px solid var(--line-subtle)', overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>2-3반 학생 관리</span>
          <Chip tone="info" size="sm">18/30명</Chip>
        </div>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { n: '김지훈', s: 84.8, d: '+2.4', t: 'success' },
            { n: '이서연', s: 92.1, d: '+0.6', t: 'success' },
            { n: '박민호', s: 76.4, d: '-1.8', t: 'danger' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FFE2D6', fontSize: 9, fontWeight: 700, color: '#A4441C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.n[0]}</div>
              <span style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>{r.n}</span>
              <span className="num" style={{ fontSize: 11, fontWeight: 700 }}>{r.s}</span>
              <Chip tone={r.t} size="sm">{r.d}</Chip>
            </div>
          ))}
        </div>
      </div>

      {/* Floating mini card */}
      <div style={{
        position: 'absolute', right: 0, bottom: 40,
        padding: '10px 14px', background: '#fff',
        borderRadius: 12, boxShadow: '0 10px 24px rgba(17,24,39,0.12)',
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
      }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcCheckCircle size={16}/>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--fg-strong)' }}>1차 리포트 준비됨</div>
          <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>대화 12회 기반</div>
        </div>
      </div>
    </div>
  );
}

function LandingProductCards() {
  const cards = [
    { tag: '학생', title: 'AI 진로 상담', body: '대화로 흥미와 강점을 발견하고 진로 가설을 만들어요.', icon: <IcSparkles/>, color: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)' },
    { tag: '학생', title: '성적 변화 분석', body: '모의고사 추이를 한눈에 보고 약점 단원을 짚어드려요.', icon: <IcChart/>, color: 'var(--brand-600)', bg: 'var(--brand-50)' },
    { tag: '교사', title: '학급 상담 관리', body: '학생별 진로·성적·학습을 한 화면에서 관리해요.', icon: <IcUsers/>, color: 'var(--accent-mint)', bg: 'var(--accent-mint-bg)' },
    { tag: '학생', title: '맞춤 학습 계획', body: '목표 대학·학과까지 이르는 주간 학습을 설계해드려요.', icon: <IcCheck/>, color: 'var(--success)', bg: 'var(--success-bg)' },
  ];
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg-canvas)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip tone="brand" style={{ marginBottom: 12 }}>이런 기능이 있어요</Chip>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1px' }} className="kr-heading">
            대화로 시작해, 데이터로 검증하고, 실제로 움직여요
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.map((c, i) => (
            <Card key={i} padding={24} style={{ background: '#fff' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {React.cloneElement(c.icon, { size: 22 })}
              </div>
              <Chip tone={c.tag === '교사' ? 'purple' : 'brand'} size="sm" style={{ marginBottom: 8 }}>{c.tag}</Chip>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">{c.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingStudentValue() {
  return (
    <section style={{ padding: '80px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <Chip tone="brand" style={{ marginBottom: 16 }}>학생</Chip>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, marginBottom: 16, letterSpacing: '-1.2px', lineHeight: 1.2 }} className="kr-heading">
            진로 고민을<br/>혼자 안고 가지 마세요
          </h2>
          <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0, marginBottom: 32 }} className="kr-heading">
            정답을 주는 도구가 아니라, 함께 생각해주는 도구예요. 1-5점 설문이 아닌 자연스러운 대화로 진로를 탐색해요.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { t: '대화형 AI 상담', d: '강요 없이 자연스럽게 답해도 돼요. AI가 단서를 모아 가설을 세워줘요.' },
              { t: '목표 대학·학과 설정', d: '추천만 받는 게 아니라, 직접 목표를 정하고 도달 경로를 받아요.' },
              { t: '성장 리포트', d: '성적이 변하는 흐름을, 점수가 아닌 이야기로 읽어드려요.' },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcCheck size={18}/>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{it.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.55 }} className="kr-heading">{it.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card padding={28} style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #F4ECFF 100%)' }}>
          <ChatPreview/>
        </Card>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>AI</div>
        <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', fontSize: 13, lineHeight: 1.5, maxWidth: '78%' }} className="kr-heading">
          축제 영상을 만들 때 친구들이 어떤 반응이었을 때 가장 기뻤어요?
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: 'var(--brand-500)', color: '#fff', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13, lineHeight: 1.5, maxWidth: '78%' }} className="kr-heading">
          예고편이 뜬다고 SNS에 올려준 친구가 있었어요. 그때 진짜 신났어요.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7B61FF 0%, #3182F6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>AI</div>
        <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', fontSize: 13, lineHeight: 1.5, maxWidth: '78%' }} className="kr-heading">
          작품이 누군가에게 닿는 순간을 즐기는 거네요. 흥미로워요.
        </div>
      </div>
      <div style={{
        marginTop: 8, padding: '12px 14px', background: 'rgba(255,255,255,0.7)',
        borderRadius: 12, border: '1px dashed rgba(123,97,255,0.3)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <IcSparkles size={14} color="var(--accent-purple)"/>
        <span style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 700 }}>새로운 단서: 표현 동기 · 시각적 흐름</span>
      </div>
    </div>
  );
}

function LandingTeacherValue() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg-canvas)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <Card padding={28}>
          {/* mini teacher dashboard */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>2학년 3반 종합</span>
            <Chip tone="info" size="sm">18/30명</Chip>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { l: '평균', v: '82.8', d: 'success' },
              { l: '상담요청', v: '3', d: 'warning' },
              { l: 'AI 완료', v: '11', d: 'brand' },
            ].map((m, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--bg-muted)', borderRadius: 10, textAlign: 'center' }}>
                <div className="num" style={{ fontSize: 22, fontWeight: 700, color: `var(--${m.d}${m.d==='brand' ? '-600' : ''})` }}>{m.v}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '박민호', s: '수학 -8점', t: 'danger' },
              { n: '이서연', s: '상담 요청', t: 'warning' },
              { n: '정현우', s: '꾸준한 상승', t: 'success' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={r.n[0]} size={28}/>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-strong)', flex: 1 }}>{r.n}</span>
                <Chip tone={r.t} size="sm">{r.s}</Chip>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <Chip tone="purple" style={{ marginBottom: 16 }}>교사</Chip>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, marginBottom: 16, letterSpacing: '-1.2px', lineHeight: 1.2 }} className="kr-heading">
            학생 한 명 한 명을<br/>놓치지 않게 도와드려요
          </h2>
          <p style={{ fontSize: 16, color: 'var(--fg-muted)', lineHeight: 1.65, margin: 0, marginBottom: 32 }} className="kr-heading">
            최대 30명까지 학급을 운영할 수 있어요. 상담 요청, 성적 변동, 학습 진도를 실시간으로 확인하세요.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { t: '초대코드로 시작', d: '학생이 코드 하나로 가입해 학급에 자동 합류해요.' },
              { t: '학생별 진로 리포트', d: 'AI 대화 단서까지 함께 보고 면담을 준비할 수 있어요.' },
              { t: '상담 요청 / 메모', d: '요청 알림을 SSE로 실시간 받고, 메모는 학생 공개 여부도 선택해요.' },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IcCheck size={18}/>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }}>{it.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.55 }} className="kr-heading">{it.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPricing({ onNav = () => {} }) {
  return (
    <section style={{ padding: '80px 40px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip tone="success" style={{ marginBottom: 12 }}>첫 달 무료 체험</Chip>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1.2px' }} className="kr-heading">
            정직한 가격, 부담 없는 시작
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Student plan */}
          <Card padding={32}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <Chip tone="brand" size="md">학생</Chip>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>학생 플랜</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcUser size={20}/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span className="num" style={{ fontSize: 44, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1.5px' }}>3,000</span>
              <span style={{ fontSize: 16, color: 'var(--fg-muted)' }}>원 / 월</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 24 }}>첫 달은 무료예요</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['AI 진로 상담 무제한', '성적 추이 분석 + 성장 리포트', '맞춤 학습 계획 + 진도 체크', '추천 직업·학과·대학'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={18} color="var(--brand-500)"/>{f}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" full onClick={() => onNav('auth', 'student', 'signup')}>학생으로 시작하기</Button>
          </Card>
          {/* Teacher plan */}
          <Card padding={32} style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)', border: '1px solid var(--brand-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <Chip tone="purple" size="md">교사</Chip>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>교사 플랜</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcGraduation size={20}/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span className="num" style={{ fontSize: 44, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1.5px' }}>30,000</span>
              <span style={{ fontSize: 16, color: 'var(--fg-muted)' }}>원 / 월</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 24 }}>첫 달은 무료예요 · 최대 30명</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['학급 초대코드 발급', '학생 최대 30명까지 관리', '학생별 진로·성적·학습 리포트', '상담 요청·메모 · 실시간 알림'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={18} color="var(--accent-purple)"/>{f}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" full style={{ background: 'var(--accent-purple)' }} onClick={() => onNav('auth', 'teacher', 'signup')}>교사로 시작하기</Button>
          </Card>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-muted)', borderRadius: 12, fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center', lineHeight: 1.55 }} className="kr-heading">
          학교 단위 도입 · 부서별 결제는 별도 문의해주세요. 결제 정보는 토스페이먼츠를 통해 안전하게 처리돼요.
        </div>
      </div>
    </section>
  );
}

function LandingSecurity() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg-canvas)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip tone="success" leading={<IcShield size={11}/>} style={{ marginBottom: 12 }}>안심하고 사용하세요</Chip>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1px' }} className="kr-heading">
            학생의 데이터는 가장 보수적으로 다뤄요
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { t: '개인정보 보호', d: '주민번호 등 민감정보는 수집하지 않아요. 상담 내용은 본인·교사만 볼 수 있어요.', icon: <IcShield/> },
            { t: '권한 기반 접근', d: '학생/교사/관리자 역할에 따라 접근 가능한 데이터가 엄격히 분리돼요.', icon: <IcLock/> },
            { t: '상담 기록 관리', d: '교사 메모의 학생 공개 여부를 별도로 설정할 수 있어요.', icon: <IcDoc/> },
          ].map((it, i) => (
            <Card key={i} padding={24}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {React.cloneElement(it.icon, { size: 22 })}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>{it.t}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">{it.d}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFinalCTA({ onNav = () => {} }) {
  return (
    <section style={{ padding: '80px 40px' }}>
      <Card padding={64} style={{
        maxWidth: 960, margin: '0 auto', textAlign: 'center',
        background: 'linear-gradient(135deg, #3182F6 0%, #1957C2 100%)', color: '#fff',
      }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 14, letterSpacing: '-1.2px', lineHeight: 1.2 }} className="kr-heading">
          진로를 찾는 가장 자연스러운 방법,<br/>오늘 시작해보세요
        </h2>
        <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6, margin: 0, marginBottom: 32 }} className="kr-heading">
          첫 달은 무료예요. 결제 정보 등록 없이 바로 시작할 수 있어요.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="primary" size="xl" style={{ background: '#fff', color: 'var(--brand-600)' }} onClick={() => onNav('auth', 'student', 'signup')}>학생으로 시작</Button>
          <Button variant="primary" size="xl" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(20px)' }} onClick={() => onNav('auth', 'teacher', 'signup')}>교사로 시작</Button>
        </div>
      </Card>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer style={{ padding: '40px 40px', background: '#101727', color: '#94A3B8', fontSize: 13 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcCompass size={15} color="#fff"/>
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>진로나침반</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
            진로나침반 · 대표 이창호<br/>
            문의사항 dlckdgh135@naver.com<br/>
            개인 운영 (사업자 미등록)
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>서비스</span>
            <a>학생</a><a>교사</a><a>요금</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>법적 고지</span>
            <a>이용약관</a><a>개인정보처리방침</a><a>청소년보호정책</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────
// 새 섹션 4개 — 마케팅 콘텐츠

// 1. 접근 방식: 대화 → 데이터 검증 → 카드로 추가
function LandingApproach() {
  return (
    <section style={{ padding: '80px 40px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-500)', marginBottom: 8 }}>이렇게 작동해요</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.6px', margin: 0, lineHeight: 1.3 }}>
            대화로 시작해, <span style={{ color: 'var(--brand-500)' }}>데이터로 검증</span>하고,<br/>
            진로 카드로 정리해요
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { n: '1', t: '대화로 시작', d: 'AI가 학년에 맞춰 흥미·강점·가치를 묻고, 학생이 스스로 답하면서 진로를 탐색해요.' },
            { n: '2', t: '데이터로 검증', d: '커리어넷·대학알리미·College Scorecard 등 실 공공데이터로 직업·전공·대학·취업률을 근거 있게 보여드려요.' },
            { n: '3', t: '카드로 정리', d: '관심 직업·전공·대학·활동을 카드로 모아 캘린더·리포트로 관리해요.' },
          ].map((s) => (
            <div key={s.n} style={{ padding: 28, border: '1px solid var(--line)', borderRadius: 16, background: '#fff' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--brand-soft)', color: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{s.t}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. 실 공공데이터 강조
function LandingDataSources() {
  const SRC = [
    { name: '커리어넷', stat: '직업 552·학과 501·상담사례 188' },
    { name: '대학알리미', stat: '대학 472·학과 48,308·경쟁률·충원율' },
    { name: 'College Scorecard', stat: '미국 대학 학비·졸업률·중위소득' },
    { name: 'VMS·1365', stat: '청소년 가능 봉사 1,000+건' },
    { name: '한국장학재단', stat: '학자금·장학금 1,850+건' },
    { name: '경기데이터드림', stat: '취업률·교환학생·신입생 충원' },
  ];
  return (
    <section style={{ padding: '60px 40px', background: 'var(--bg-canvas)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>실 공공데이터</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
            추측이 아닌, <span style={{ color: 'var(--success)' }}>국가가 공시한 데이터</span>로 알려드려요
          </h2>
          <p style={{ fontSize: 15, color: 'var(--fg-muted)', marginTop: 12, lineHeight: 1.6 }}>
            연봉·취업률·경쟁률 같은 수치는 모두 공공기관 API로 받아옵니다. 출처와 조사연도를 함께 표시해요.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {SRC.map((s) => (
            <div key={s.name} style={{ background: '#fff', padding: '16px 18px', borderRadius: 12, border: '1px solid var(--line-subtle)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.5 }}>{s.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3. 활용 사례 카드들 — 봉사·장학금·캘린더·교환학생·교사 기능
function LandingFeatureCards() {
  const USE_CASES = [
    { emoji: '🤝', title: '봉사활동 검색·캘린더 등록', desc: '관심 분야의 봉사를 찾고 캘린더에 바로 추가해 학생부 인성 영역을 채워요. 기관 전화번호도 함께 안내.' },
    { emoji: '💰', title: '장학금 정보', desc: '한국장학재단·지자체·기업 장학금 1,850+건. AI가 학생 상황에 맞는 장학금을 상담 중에 추천해줘요.' },
    { emoji: '📅', title: '캘린더로 관리', desc: '봉사·체험·시험·상담 일정을 한 곳에서. 캘린더에서 직접 추가·수정·삭제할 수 있어요.' },
    { emoji: '🌏', title: '교환학생 정보', desc: '대학별 외국대학 교류 인원(파견·유치)으로 "국제화 정도"를 한눈에 확인하고 진학 결정에 참고.' },
    { emoji: '🎯', title: '진로·직업체험', desc: '커리어넷 체험 자료 455+건. 학년·관심분야로 필터해 전공적합성을 학생부에 채워가요.' },
    { emoji: '👨‍🏫', title: '교사 기능', desc: '학생별 진로·성적·학습 현황을 한 화면에서. 1:1 상담 메모, 학급 단위 통계, 그룹 메시지까지.' },
  ];
  return (
    <section style={{ padding: '80px 40px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-500)', marginBottom: 8 }}>활용 사례</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
            진로나침반은 이렇게 쓰여요
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {USE_CASES.map((u) => (
            <div key={u.title} style={{ padding: 24, border: '1px solid var(--line)', borderRadius: 16, background: '#fff', transition: 'box-shadow .15s' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{u.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{u.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. AI 안전성 — 너무 신용하지 말고 선생님과 상담
function LandingAiSafety() {
  return (
    <section style={{ padding: '60px 40px', background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 100%)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#C2410C', marginBottom: 12 }}>⚠️ 진로나침반은 보조 도구예요</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.4px', margin: '0 0 18px', lineHeight: 1.4 }}>
          AI 대화는 <span style={{ color: '#C2410C' }}>너무 신용하지 마세요</span><br/>
          진학·전공 같은 큰 결정은 선생님과 함께
        </h2>
        <p style={{ fontSize: 15, color: 'var(--fg-default)', lineHeight: 1.7, margin: 0 }}>
          진로나침반은 학생이 스스로 진로를 탐색하도록 돕는 도구예요. AI 상담에서 나온 결과를 정답으로 받지 말고,<br/>
          반드시 학교 진로·담임 선생님 또는 전문 상담사와 함께 큰 결정을 정해주세요.<br/>
          AI는 데이터로 가능성을 넓혀줄 뿐, 결정은 학생과 어른이 함께 합니다.
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────
// Auth pages (stateful, with consent gates)
// ────────────────────────────────────────────────────────
function AuthScreen({ role = 'student', mode = 'login', onNav, onBack, setRole, setMode }) {
  const isMobile = useViewportMobile();
  const isTeacher = role === 'teacher';
  const isSignup = mode === 'signup';
  const switchRole = setRole || (() => {});
  const switchMode = setMode || (() => {});

  // Form state — all empty by default
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [inviteCode, setInviteCode] = React.useState('');
  const [school, setSchool] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  // Required consents — student & teacher slightly differ
  const STUDENT_REQUIRED = [
    { id: 'tos', label: '서비스 이용약관 동의', linkLabel: '약관 보기' },
    { id: 'privacy', label: '개인정보 수집·이용 동의 (이메일, 이름, 학교)', linkLabel: '자세히' },
    { id: 'academic', label: '학업/성적 데이터 처리 동의 (모의고사·내신·수행평가)', linkLabel: '자세히' },
    { id: 'ai', label: 'AI 진로상담 대화 데이터 처리 동의', linkLabel: '자세히' },
    { id: 'age', label: '만 14세 이상이며 법정대리인 동의를 받았어요', linkLabel: null },
  ];
  const TEACHER_REQUIRED = [
    { id: 'tos', label: '서비스 이용약관 동의', linkLabel: '약관 보기' },
    { id: 'privacy', label: '개인정보 수집·이용 동의 (이메일, 이름, 소속학교)', linkLabel: '자세히' },
    { id: 'class', label: '학급/학생 정보 처리 동의 (성적, 상담 내용)', linkLabel: '자세히' },
    { id: 'billing', label: '결제·구독 안내 수신 동의', linkLabel: '자세히' },
  ];
  const OPTIONAL = [
    { id: 'mkt', label: '마케팅 정보 수신 동의 (선택)' },
  ];
  const required = isTeacher ? TEACHER_REQUIRED : STUDENT_REQUIRED;

  const [consents, setConsents] = React.useState({});
  const toggle = (id) => setConsents(c => ({ ...c, [id]: !c[id] }));
  const allRequiredChecked = required.every(c => consents[c.id]);
  const allChecked = required.every(c => consents[c.id]) && OPTIONAL.every(c => consents[c.id]);
  const toggleAll = () => {
    const next = !allChecked;
    const m = {};
    [...required, ...OPTIONAL].forEach(c => { m[c.id] = next; });
    setConsents(m);
  };

  // Validation
  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = !password || password.length >= 8;
  const canSubmit = isSignup
    ? (email && emailValid && password && pwValid && name && allRequiredChecked && (isTeacher ? school : true))
    : (email && emailValid && password);

  // 실 백엔드 로그인/가입 — 디자인 시안의 빈 버튼을 실제 인증으로 연결
  const [busy, setBusy] = React.useState(false);
  const [authError, setAuthError] = React.useState('');
  const submit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true); setAuthError('');
    try {
      const path = isSignup ? (isTeacher ? '/v1/auth/signup/teacher' : '/v1/auth/signup/student') : '/v1/auth/login';
      const payload = isSignup
        ? (isTeacher
            ? { email: email.trim(), password, name: name.trim(), school: school.trim(), classroom: school.trim(), consents: { tos: !!consents.tos, privacy: !!consents.privacy, class: !!consents.class, billing: !!consents.billing } }
            : { email: email.trim(), password, name: name.trim(), inviteCode: inviteCode.trim() || undefined, consents: { tos: !!consents.tos, privacy: !!consents.privacy, academic: !!consents.academic, ai: !!consents.ai, age: !!consents.age } })
        : { email: email.trim(), password };
      const res = await fetch((window.VITE_API_BASE_URL || '/v1') + path.replace('/v1', ''), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setAuthError(data.message || '로그인에 실패했어요'); setBusy(false); return; }
      // 토큰 저장 → 실 클라이언트(dataApi)가 인증된 요청을 보냄
      try {
        if (data.accessToken) localStorage.setItem('jinro:accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('jinro:refreshToken', data.refreshToken);
      } catch (e) {}
      // 역할에 맞는 화면으로 전환 (admin 포함)
      const _role = data.user && data.user.role;
      const targetRole = _role === 'teacher' ? 'teacher-web' : _role === 'admin' ? 'admin' : 'student-web';
      if (typeof window.__navTo === 'function') window.__navTo(targetRole);
      else { window.location.hash = targetRole; window.location.reload(); }
    } catch (e) {
      setAuthError('서버에 연결하지 못했어요'); setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: '100%', maxHeight: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
      background: 'var(--bg-canvas)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '20px 16px' : 40,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr', maxWidth: 1080, gap: isMobile ? 24 : 60, width: '100%', alignItems: 'center' }}>
        {/* Left: copy */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', cursor: onBack ? 'pointer' : 'default', padding: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcCompass size={20} color="#fff"/>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.3px' }}>진로나침반</span>
            </button>
            {onBack && <button onClick={onBack} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: 'var(--fg-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><IcArrowLeft size={14}/>홈으로</button>}
          </div>
          {/* role selector — prominent split cards */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { v: 'student', l: '학생', d: '진로 탐색·성적·AI 상담', icon: <IcUser/>, c: 'var(--brand-500)', bg: 'var(--brand-50)' },
              { v: 'teacher', l: '교사', d: '학급 관리·학생 리포트', icon: <IcGraduation/>, c: 'var(--accent-purple)', bg: 'var(--accent-purple-bg)' },
            ].map(o => {
              const on = role === o.v;
              return (
                <button key={o.v} onClick={() => switchRole(o.v)} style={{
                  flex: 1, textAlign: 'left', cursor: 'pointer',
                  padding: '14px 16px', borderRadius: 14,
                  border: `2px solid ${on ? o.c : 'var(--line-strong)'}`,
                  background: on ? o.bg : 'var(--bg-surface)',
                  transition: 'all 140ms var(--ease-std)', position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 9, background: on ? o.c : 'var(--neutral-bg)', color: on ? '#fff' : 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{React.cloneElement(o.icon, { size: 17 })}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: on ? o.c : 'var(--fg-strong)' }}>{o.l}</span>
                    {on && <IcCheckCircle size={17} color={o.c} style={{ marginLeft: 'auto' }}/>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }} className="kr-heading">{o.d}</div>
                </button>
              );
            })}
          </div>
          <h1 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1.2px', lineHeight: 1.2, marginBottom: 16 }} className="kr-heading">
            {isTeacher
              ? (isSignup ? '학급을 만들고\n학생을 초대해보세요' : '오늘 학급도 잘 부탁해요')
              : (isSignup ? '진로 고민,\n대화로 시작해요' : '다시 만나서 반가워요')
            }
          </h1>
          <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.65 }} className="kr-heading">
            {isTeacher && isSignup && '회원가입 후 학급을 만들면 6자리 초대코드가 발급돼요. 학생은 코드 하나로 학급에 합류해요. 첫 달은 무료이며, 결제 정보 등록 없이 시작할 수 있어요.'}
            {isTeacher && !isSignup && '상담 요청, 성적 변동, 학습 진도를 실시간으로 확인해요.'}
            {!isTeacher && isSignup && '선생님이 알려준 6자리 초대코드는 가입 시 또는 나중에 입력해도 괜찮아요. 첫 달은 무료예요.'}
            {!isTeacher && !isSignup && '오늘의 진로 질문이 기다리고 있어요.'}
          </p>
        </div>

        {/* Right: form card */}
        <Card padding={36}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 24 }}>
            {isSignup ? '회원가입' : '로그인'}
          </div>
          <Button variant="outline" size="lg" full leading={<IcGoogle size={18}/>} style={{ marginBottom: 10 }} onClick={() => { window.location.href = '/v1/auth/google/start' + (isTeacher ? '?role=teacher' : ''); }}>
            Google로 {isSignup ? '시작하기' : '로그인'}{isSignup && isTeacher ? ' (교사)' : ''}
          </Button>
          <Button variant="outline" size="lg" full leading={<IcKakao size={18}/>} style={{ marginBottom: 20, background: '#FEE500', borderColor: '#FEE500' }} onClick={() => { window.location.href = '/v1/auth/kakao/start' + (isTeacher ? '?role=teacher' : ''); }}>
            카카오로 {isSignup ? '시작하기' : '로그인'}
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
            <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>또는 이메일로</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          </div>
          <FormField label="이메일" required={isSignup} style={{ marginBottom: 14 }} error={email && !emailValid ? '올바른 이메일 형식이 아니에요' : null}>
            <TextInput value={email} onChange={setEmail} placeholder="이메일을 입력하세요" type="email" onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}/>
          </FormField>
          <FormField label="비밀번호" required={isSignup} style={{ marginBottom: 14 }} hint={isSignup ? '영문, 숫자 포함 8자 이상' : null} error={password && !pwValid ? '비밀번호는 8자 이상이어야 해요' : null}>
            <TextInput
              value={password} onChange={setPassword}
              type={showPw ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              trailing={
                <button onClick={() => setShowPw(s => !s)} style={{ background: 'transparent', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  {showPw ? <IcEye size={16}/> : <IcEyeOff size={16}/>}
                </button>
              }
            />
          </FormField>
          {isSignup && (
            <FormField label="이름" required style={{ marginBottom: 14 }}>
              <TextInput value={name} onChange={setName} placeholder="이름을 입력하세요"/>
            </FormField>
          )}
          {isSignup && !isTeacher && (
            <FormField label="초대코드" hint="선택 · 나중에 마이페이지에서 입력해도 괜찮아요" style={{ marginBottom: 14 }}>
              <TextInput value={inviteCode} onChange={setInviteCode} placeholder="6자리 코드를 입력하세요" leading={<IcSchool size={16} color="var(--fg-subtle)"/>}/>
            </FormField>
          )}
          {isSignup && isTeacher && (
            <FormField label="소속 학교 / 학급" required hint="가입 후 학급 설정에서 변경할 수 있어요" style={{ marginBottom: 14 }}>
              <TextInput value={school} onChange={setSchool} placeholder="학교명과 학급을 입력하세요" leading={<IcSchool size={16} color="var(--fg-subtle)"/>}/>
            </FormField>
          )}

          {/* Consent block */}
          {isSignup && (
            <div style={{ marginTop: 6, marginBottom: 18, padding: 16, border: '1px solid var(--line)', borderRadius: 12, background: 'var(--bg-muted)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingBottom: 12, borderBottom: '1px solid var(--line-subtle)', marginBottom: 10 }}>
                <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ width: 18, height: 18, accentColor: 'var(--brand-500)', cursor: 'pointer' }}/>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-strong)' }}>전체 동의</span>
                <span style={{ fontSize: 11, color: 'var(--fg-subtle)', marginLeft: 'auto' }}>선택 항목 포함</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {required.map(c => (
                  <ConsentRow key={c.id} required checked={!!consents[c.id]} onToggle={() => toggle(c.id)} label={c.label} linkLabel={c.linkLabel}/>
                ))}
                {OPTIONAL.map(c => (
                  <ConsentRow key={c.id} checked={!!consents[c.id]} onToggle={() => toggle(c.id)} label={c.label}/>
                ))}
              </div>
              {!allRequiredChecked && Object.keys(consents).length > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <IcAlert size={12}/> 필수 항목을 모두 동의해주세요
                </div>
              )}
            </div>
          )}

          {authError && (
            <div style={{ marginBottom: 12, padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: 'var(--danger)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IcAlert size={14}/> {authError}
            </div>
          )}
          <Button variant="primary" size="lg" full disabled={!canSubmit || busy} onClick={submit}>{busy ? '처리 중…' : (isSignup ? '회원가입 · 첫 달 무료 체험 시작' : '로그인')}</Button>
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>
            {isSignup ? '이미 계정이 있나요? ' : '아직 계정이 없나요? '}
            <a onClick={() => { setAuthError(''); switchMode(isSignup ? 'login' : 'signup'); }} style={{ color: 'var(--brand-600)', fontWeight: 700, cursor: 'pointer' }}>{isSignup ? '로그인' : '회원가입'}</a>
          </div>
          {!isSignup && (
            <div style={{ marginTop: 8, textAlign: 'center', fontSize: 13, color: 'var(--fg-subtle)' }}>
              <a style={{ cursor: 'pointer' }}>비밀번호를 잊으셨나요?</a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ConsentRow({ required, checked, onToggle, label, linkLabel }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, lineHeight: 1.4 }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 16, height: 16, marginTop: 1, accentColor: 'var(--brand-500)', cursor: 'pointer', flexShrink: 0 }}/>
      <span style={{ flex: 1, color: 'var(--fg-default)' }} className="kr-heading">
        <span style={{ color: required ? 'var(--danger)' : 'var(--fg-subtle)', fontWeight: 700, marginRight: 4 }}>
          [{required ? '필수' : '선택'}]
        </span>
        {label}
      </span>
      {linkLabel && (
        <a style={{ fontSize: 11, color: 'var(--fg-subtle)', textDecoration: 'underline', cursor: 'pointer', flexShrink: 0, paddingTop: 2 }}>{linkLabel}</a>
      )}
    </label>
  );
}

// Google callback (loading)
function GoogleCallback() {
  return (
    <div style={{ minHeight: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--bg-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--brand-500)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}/>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 8 }}>Google 로그인 중이에요</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }} className="kr-heading">
          계정을 확인하고 있어요. 잠시만 기다려주세요.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Payment result pages
// ────────────────────────────────────────────────────────
function PaymentResult({ status = 'success' }) {
  const config = {
    success: {
      icon: <IcCheckCircle/>, color: 'var(--success)', bg: 'var(--success-bg)',
      title: '결제가 완료됐어요',
      body: '학생 플랜이 활성화됐어요. 영수증을 등록된 이메일로 보내드렸어요.',
      detail: [
        ['결제 금액', '₩3,000'],
        ['결제 수단', '신한 BC카드 (****1234)'],
        ['결제일', '2026. 06. 01 09:12'],
        ['다음 결제 예정일', '2026. 07. 01'],
      ],
      cta: '대시보드로 가기',
    },
    fail: {
      icon: <IcXCircle/>, color: 'var(--danger)', bg: 'var(--danger-bg)',
      title: '결제에 실패했어요',
      body: '카드 한도 또는 잔액을 확인해주세요. 다른 카드로 다시 시도하거나, 잠시 후 재시도할 수 있어요.',
      detail: [
        ['결제 금액', '₩3,000'],
        ['실패 코드', 'OVER_LIMIT_AMOUNT'],
        ['시각', '2026. 06. 01 09:12'],
      ],
      cta: '다시 결제하기',
    },
    cancel: {
      icon: <IcAlert/>, color: 'var(--warning)', bg: 'var(--warning-bg)',
      title: '결제를 취소했어요',
      body: '결제가 진행되지 않았어요. 언제든 다시 시도할 수 있어요.',
      detail: [
        ['시각', '2026. 06. 01 09:12'],
      ],
      cta: '플랜 선택하러 가기',
    },
  }[status];
  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Card padding={40} style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: config.bg, color: config.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          {React.cloneElement(config.icon, { size: 36 })}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, marginBottom: 10, letterSpacing: '-0.6px' }} className="kr-heading">
          {config.title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0, marginBottom: 24 }} className="kr-heading">
          {config.body}
        </p>
        <div style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '14px 16px', textAlign: 'left', marginBottom: 24 }}>
          {config.detail.map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line-subtle)' : 'none', fontSize: 13 }}>
              <span style={{ color: 'var(--fg-muted)' }}>{k}</span>
              <span style={{ color: 'var(--fg-strong)', fontWeight: 600 }} className="num">{v}</span>
            </div>
          ))}
        </div>
        <Button variant="primary" size="lg" full>{config.cta}</Button>
        {status !== 'success' && (
          <button style={{ marginTop: 12, background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 13, cursor: 'pointer' }}>
            홈으로 돌아가기
          </button>
        )}
      </Card>
    </div>
  );
}

// Web auth flow — landing → login/signup (no dev toggle bar).
function WebAuthScreen() {
  const [view, setView] = React.useState('landing'); // landing | auth
  const [role, setRole] = React.useState('student');
  const [mode, setMode] = React.useState('login');
  const nav = (v, r, m) => { if (r) setRole(r); if (m) setMode(m); setView(v); };
  if (view === 'auth') {
    return <AuthScreen role={role} mode={mode} setRole={setRole} setMode={setMode} onBack={() => setView('landing')} onNav={nav}/>;
  }
  // three.js 스크롤 내러티브 랜딩 (로드 실패 시 기존 랜딩으로 폴백)
  if (typeof Landing3D === 'function') return <Landing3D onNav={nav}/>;
  return <LandingPage variant="A" onNav={nav}/>;
}

Object.assign(window, {
  LandingPage, AuthScreen, WebAuthScreen, GoogleCallback, PaymentResult,
  TermsPage, PrivacyPage, PricingPage, ForgotPasswordPage, FindIdPage,
});

// ────────────────────────────────────────────────────────
// Find ID / Reset Password
// ────────────────────────────────────────────────────────
function AuthShell({ children }) {
  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IcCompass size={18} color="#fff"/>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-0.3px' }}>진로나침반</span>
        </div>
        <Card padding={36}>{children}</Card>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const [step, setStep] = React.useState('request'); // request | sent | reset | done
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [pwConfirm, setPwConfirm] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  const pwMatch = pw && pw === pwConfirm;

  return (
    <AuthShell>
      <Tabs items={[{id:'pw',label:'비밀번호 찾기'},{id:'id',label:'아이디 찾기'}]} activeId="pw" onChange={() => {}}/>
      <div style={{ marginTop: 24 }}>
        {step === 'request' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>비밀번호를 잊으셨나요?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 24 }} className="kr-heading">
              가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
            </div>
            <FormField label="이메일" required style={{ marginBottom: 20 }} error={email && !emailValid ? '올바른 이메일 형식이 아니에요' : null}>
              <TextInput value={email} onChange={setEmail} placeholder="가입한 이메일을 입력하세요" type="email" leading={<IcMessage size={16}/>}/>
            </FormField>
            <Button variant="primary" size="lg" full disabled={!email || !emailValid} onClick={() => setStep('sent')}>인증 메일 받기</Button>
            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>
              계정이 기억나셨나요? <a style={{ color: 'var(--brand-600)', fontWeight: 700, cursor: 'pointer' }}>로그인</a>
            </div>
          </>
        )}
        {step === 'sent' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IcMessage size={26}/>
            </div>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">메일을 보냈어요</div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 20 }} className="kr-heading">
              <strong style={{ color: 'var(--fg-strong)' }}>{email}</strong>로 보낸 6자리 인증코드를 입력해주세요. 메일이 오지 않으면 스팸함도 확인해보세요.
            </div>
            <FormField label="인증코드" required style={{ marginBottom: 20 }}>
              <TextInput value={code} onChange={v => setCode(v.replace(/\D/g, '').slice(0, 6))} placeholder="6자리 숫자" leading={<IcLock size={16}/>}/>
            </FormField>
            <Button variant="primary" size="lg" full disabled={code.length !== 6} onClick={() => setStep('reset')}>인증하기</Button>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: 'var(--fg-subtle)' }}>
              <span>메일을 받지 못하셨나요? </span>
              <a style={{ color: 'var(--brand-600)', fontWeight: 700, cursor: 'pointer' }}>다시 보내기 (60s)</a>
            </div>
          </>
        )}
        {step === 'reset' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>새 비밀번호를 설정하세요</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 24 }} className="kr-heading">
              영문, 숫자를 포함한 8자 이상으로 설정해주세요.
            </div>
            <FormField label="새 비밀번호" required style={{ marginBottom: 14 }} hint={pw && !pwValid ? '영문·숫자 포함 8자 이상이 필요해요' : null}>
              <TextInput
                value={pw} onChange={setPw}
                type={showPw ? 'text' : 'password'}
                placeholder="새 비밀번호"
                trailing={
                  <button onClick={() => setShowPw(s => !s)} style={{ background: 'transparent', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                    {showPw ? <IcEye size={16}/> : <IcEyeOff size={16}/>}
                  </button>
                }
              />
            </FormField>
            <FormField label="비밀번호 확인" required style={{ marginBottom: 20 }} error={pwConfirm && !pwMatch ? '비밀번호가 일치하지 않아요' : null}>
              <TextInput value={pwConfirm} onChange={setPwConfirm} type="password" placeholder="새 비밀번호 다시 입력"/>
            </FormField>
            <Button variant="primary" size="lg" full disabled={!pwValid || !pwMatch} onClick={() => setStep('done')}>비밀번호 변경하기</Button>
          </>
        )}
        {step === 'done' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IcCheckCircle size={28}/>
            </div>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">비밀번호가 변경됐어요</div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 24 }} className="kr-heading">
              새 비밀번호로 다시 로그인해주세요.
            </div>
            <Button variant="primary" size="lg" full>로그인하러 가기</Button>
          </>
        )}
      </div>
    </AuthShell>
  );
}

function FindIdPage() {
  const [step, setStep] = React.useState('request');
  const [name, setName] = React.useState('');
  const [school, setSchool] = React.useState('');
  return (
    <AuthShell>
      <Tabs items={[{id:'pw',label:'비밀번호 찾기'},{id:'id',label:'아이디 찾기'}]} activeId="id" onChange={() => {}}/>
      <div style={{ marginTop: 24 }}>
        {step === 'request' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }}>가입한 이메일을 찾아드릴게요</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 24 }} className="kr-heading">
              이름과 학교를 입력하면 가입된 이메일의 일부를 알려드려요.
            </div>
            <FormField label="이름" required style={{ marginBottom: 14 }}>
              <TextInput value={name} onChange={setName} placeholder="이름을 입력하세요"/>
            </FormField>
            <FormField label="학교명" required style={{ marginBottom: 20 }}>
              <TextInput value={school} onChange={setSchool} placeholder="학교명을 입력하세요" leading={<IcSchool size={16}/>}/>
            </FormField>
            <Button variant="primary" size="lg" full disabled={!name || !school} onClick={() => setStep('result')}>이메일 찾기</Button>
            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>
              계정이 없으신가요? <a style={{ color: 'var(--brand-600)', fontWeight: 700, cursor: 'pointer' }}>회원가입</a>
            </div>
          </>
        )}
        {step === 'result' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <IcUser size={28}/>
            </div>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', marginBottom: 6 }} className="kr-heading">{name}님의 가입 이메일</div>
            <div style={{ padding: 16, background: 'var(--bg-muted)', borderRadius: 12, textAlign: 'center', margin: '14px 0 22px' }}>
              <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', fontFamily: 'monospace' }}>
                jih****@gmail.com
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 4 }}>가입일 2026.05.02</div>
            </div>
            <Button variant="primary" size="lg" full>로그인하러 가기</Button>
            <Button variant="ghost" size="md" full style={{ marginTop: 6 }}>비밀번호도 찾기</Button>
          </>
        )}
      </div>
    </AuthShell>
  );
}

// ────────────────────────────────────────────────────────
// Pricing page (public route /pricing)
// ────────────────────────────────────────────────────────
function PricingPage() {
  const [cycle, setCycle] = React.useState('annual'); // 'monthly' | 'annual'
  const plans = cycle === 'monthly'
    ? {
        student: { price: '3,000', unit: '원 / 월', sub: '첫 달은 무료예요', save: null, billing: '매월 자동결제' },
        teacher: { price: '30,000', unit: '원 / 월', sub: '첫 달은 무료예요 · 최대 30명', save: null, billing: '매월 자동결제' },
      }
    : {
        student: { price: '30,000', unit: '원 / 년', sub: '월 ₩2,500 꼴 · 첫 달은 무료예요', save: '월간 대비 -₩6,000', billing: '연 1회 자동결제' },
        teacher: { price: '300,000', unit: '원 / 년', sub: '월 ₩25,000 꼴 · 최대 30명', save: '월간 대비 -₩60,000', billing: '연 1회 자동결제' },
      };
  return (
    <div style={{ minHeight: '100%', background: '#fff', overflow: 'auto' }} className="toss-scroll">
      <LandingNav/>
      <section style={{ padding: '80px 40px 32px', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <Chip tone="success" style={{ marginBottom: 14 }}>첫 달 무료 체험</Chip>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1.5px', lineHeight: 1.15 }} className="kr-heading">
          정직한 가격,<br/>부담 없는 시작
        </h1>
        <p style={{ fontSize: 17, color: 'var(--fg-muted)', marginTop: 16, lineHeight: 1.6 }} className="kr-heading">
          월간 / 연간 중 편한 방식으로 시작하세요. 첫 달 후 자동 결제되며, 언제든 해지할 수 있어요.
        </p>
      </section>

      {/* Cycle toggle */}
      <section style={{ display: 'flex', justifyContent: 'center', padding: '0 40px 28px' }}>
        <div style={{
          display: 'inline-flex', background: 'var(--bg-muted)', borderRadius: 12, padding: 4, gap: 2, alignItems: 'center',
        }}>
          {[
            { id: 'monthly', label: '월간 결제' },
            { id: 'annual', label: '연간 결제', badge: '약 17% 할인' },
          ].map(it => {
            const active = cycle === it.id;
            return (
              <button key={it.id} onClick={() => setCycle(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: 'none', cursor: 'pointer',
                background: active ? 'var(--bg-surface)' : 'transparent',
                color: active ? 'var(--fg-strong)' : 'var(--fg-muted)',
                padding: '10px 18px', borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
                {it.label}
                {it.badge && <Chip tone="success" size="sm" style={{ height: 20, padding: '0 6px', fontSize: 10 }}>{it.badge}</Chip>}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ padding: '0 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Student */}
          <Card padding={32}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <Chip tone="brand" size="md">학생</Chip>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>학생 개인 플랜</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcUser size={20}/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span className="num" style={{ fontSize: 44, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1.5px' }}>{plans.student.price}</span>
              <span style={{ fontSize: 16, color: 'var(--fg-muted)' }}>{plans.student.unit}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 8 }}>{plans.student.sub}</div>
            {plans.student.save && <Chip tone="success" size="sm" style={{ marginBottom: 16 }}>{plans.student.save}</Chip>}
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 20 }}>{plans.student.billing}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                'AI 진로 상담 무제한',
                '개인 진로 리포트',
                '목표 대학/학과 분석',
                '성적 기반 부족 영역 분석',
                '맞춤 학습 계획 + 진도 체크',
                '서울 주요 대학 입시 정보 열람',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={18} color="var(--brand-500)"/>{f}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" full>학생으로 시작하기</Button>
          </Card>
          {/* Teacher */}
          <Card padding={32} style={{ background: 'linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)', border: '1px solid var(--brand-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <Chip tone="purple" size="md">교사</Chip>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg-strong)', marginTop: 10 }}>교사 학급 플랜</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcGraduation size={20}/>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span className="num" style={{ fontSize: 44, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: '-1.5px' }}>{plans.teacher.price}</span>
              <span style={{ fontSize: 16, color: 'var(--fg-muted)' }}>{plans.teacher.unit}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, marginBottom: 8 }}>{plans.teacher.sub}</div>
            {plans.teacher.save && <Chip tone="success" size="sm" style={{ marginBottom: 16 }}>{plans.teacher.save}</Chip>}
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginBottom: 20 }}>{plans.teacher.billing}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                '학급 초대코드 발급',
                '학생 최대 30명까지 관리',
                '학생별 진로·성적·학습 리포트',
                '상담 요청·메모·메시지',
                '실시간 SSE 알림',
                '상담 일정 캘린더',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--fg-default)' }} className="kr-heading">
                  <IcCheckCircle size={18} color="var(--accent-purple)"/>{f}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" full style={{ background: 'var(--accent-purple)' }}>교사로 시작하기</Button>
          </Card>
        </div>

        {/* Annual savings highlight when on annual */}
        {cycle === 'annual' && (
          <div style={{
            marginTop: 16, padding: 18,
            background: 'var(--success-bg)', borderRadius: 12,
            fontSize: 13, color: 'var(--success)', lineHeight: 1.55,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <IcCheckCircle size={18} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span className="kr-heading">
              연간 결제 시 학생은 <strong>₩6,000</strong>, 교사는 <strong>₩60,000</strong>을 아낄 수 있어요. 중도 해지 시 잔여 개월 만큼 일할 환불됩니다.
            </span>
          </div>
        )}

        <div style={{ marginTop: 16, padding: 18, background: 'var(--warning-bg)', borderRadius: 12, fontSize: 13, color: 'var(--warning)', lineHeight: 1.55, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <IcAlert size={16} style={{ marginTop: 2, flexShrink: 0 }}/>
          <span className="kr-heading">
            결제 연동 준비 중입니다. 실제 결제는 백엔드 PG 연동(토스페이먼츠 / 포트원) 완료 후 활성화됩니다. 현재는 무료 체험만 시작할 수 있어요.
          </span>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '40px 40px 80px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--fg-strong)', textAlign: 'center', marginBottom: 32 }} className="kr-heading">자주 묻는 질문</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { q: '무료 체험 후 자동으로 결제되나요?', a: '결제 수단을 등록한 경우에만 자동결제됩니다. 등록하지 않으면 체험 종료 시 기능이 멈추고, 데이터는 그대로 보관돼요.' },
            { q: '학교 단위로 도입하려면 어떻게 해야 하나요?', a: '교무실 또는 학사 부서 단위 결제는 별도 문의해주세요. 학교 전용 인보이스 발행이 가능해요.' },
            { q: '학생 데이터는 어떻게 보호되나요?', a: '주민번호 등 민감정보는 수집하지 않아요. AI 상담 내용은 본인과 담임교사만 열람할 수 있어요.' },
            { q: '입시 정보는 어디서 받아오나요?', a: '대입정보포털·대학알리미·커리어넷 등 공식 데이터를 백엔드가 캐싱·정규화해 제공해요. 출처와 갱신일이 함께 표시돼요.' },
          ].map((f, i) => (
            <FAQRow key={i} q={f.q} a={f.a}/>
          ))}
        </div>
      </section>

      <LandingFooter/>
    </div>
  );
}

function FAQRow({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-strong)' }} className="kr-heading">{q}</span>
        <IcChevronDown size={18} color="var(--fg-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 220ms var(--ease-toss)' }}/>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6 }} className="kr-heading">{a}</div>
      )}
    </Card>
  );
}

// ────────────────────────────────────────────────────────
// Terms / Privacy
// ────────────────────────────────────────────────────────
function LegalDoc({ title, badge, sections }) {
  return (
    <div style={{ minHeight: '100%', background: '#fff', overflow: 'auto' }} className="toss-scroll">
      <LandingNav/>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 40px 80px' }}>
        <Chip tone="neutral" style={{ marginBottom: 14 }}>{badge}</Chip>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--fg-strong)', margin: 0, letterSpacing: '-1px' }} className="kr-heading">{title}</h1>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-subtle)' }}>최종 개정일: 2026년 5월 17일 · <span style={{ background: 'var(--warning-bg)', color: 'var(--warning)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>법무 검토 전 초안</span></div>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {sections.map((s, i) => (
            <section key={i}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg-strong)', margin: 0, marginBottom: 8 }}>제{i + 1}조 ({s.title})</h2>
              <div style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.7, whiteSpace: 'pre-line' }} className="kr-heading">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
      <LandingFooter/>
    </div>
  );
}

function TermsPage() {
  return (
    <LegalDoc
      title="서비스 이용약관"
      badge="이용약관"
      sections={[
        { title: '목적', body: '본 약관은 (주)진로나침반이 제공하는 진로나침반 서비스(이하 "서비스")의 이용과 관련해 회사와 회원의 권리·의무 및 책임사항을 규정하는 것을 목적으로 합니다.' },
        { title: '정의', body: '"학생 회원"이라 함은 교내·외에서 진로 상담을 받기 위해 서비스에 가입한 만 14세 이상의 개인을 말합니다.\n"교사 회원"이라 함은 학급을 운영하고 학생을 관리하기 위해 서비스에 가입한 교육 종사자를 말합니다.' },
        { title: '회원가입', body: '회원가입은 신청자가 이용약관과 개인정보 처리방침에 동의하고 회사가 정한 가입 양식에 정보를 기입하여 신청한 후 회사가 이를 승낙함으로써 체결됩니다.' },
        { title: '무료 체험 및 유료 서비스', body: '회사는 신규 가입자에게 1개월의 무료 체험을 제공합니다. 무료 체험 종료 후 결제 수단을 등록한 회원은 학생 플랜 월 3,000원, 교사 플랜 월 30,000원으로 자동 결제됩니다. 회원은 언제든지 구독을 해지할 수 있습니다.' },
        { title: '회원의 의무', body: '회원은 타인의 개인정보를 도용해 가입하거나 서비스 내에 허위 정보를 입력하지 않아야 합니다. 교사 회원은 학생 정보를 본 서비스 외 목적으로 사용해서는 안 됩니다.' },
        { title: '회사의 의무', body: '회사는 안정적인 서비스 제공을 위해 노력하며, 회원의 개인정보를 보호하기 위해 보안 시스템을 운영합니다.' },
        { title: '책임 제한', body: 'AI 진로 상담 결과는 학생의 진로 탐색을 돕기 위한 참고 자료이며, 진학·진로 선택의 최종 결정은 학생, 보호자, 담임교사의 상담을 거쳐 이뤄져야 합니다.' },
        { title: '약관의 변경', body: '회사는 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전부터 공지합니다. 회원에게 불리한 변경의 경우 30일 전부터 공지합니다.' },
      ]}
    />
  );
}

function PrivacyPage() {
  return (
    <LegalDoc
      title="개인정보 처리방침"
      badge="개인정보 보호"
      sections={[
        { title: '수집하는 개인정보', body: '회사는 회원가입, 서비스 이용 과정에서 다음 정보를 수집합니다:\n- 필수: 이메일, 비밀번호, 이름\n- 학생 회원: 학교명, 학년/반, 모의고사·내신·수행평가 점수, AI 상담 대화\n- 교사 회원: 소속학교, 담당 학급, 학생 관리 내역\n- 자동수집: 접속 IP, 쿠키, 기기 정보, 서비스 이용 로그' },
        { title: '수집 및 이용 목적', body: '회원 식별 및 인증\n진로 상담 및 학습 분석 서비스 제공\n결제 및 구독 관리\n알림 발송 (상담 요청, 성적 변동, 결제 상태)\n서비스 개선을 위한 통계 분석 (개인 식별이 불가능한 형태)' },
        { title: '보유 및 이용 기간', body: '회원 탈퇴 시 모든 개인정보를 지체 없이 파기합니다. 단, 관련 법령에 따라 보존해야 하는 경우 해당 기간 동안 별도 보관합니다.\n- 전자상거래법: 결제 기록 5년, 소비자 불만 처리 기록 3년\n- 통신비밀보호법: 서비스 이용 로그 3개월' },
        { title: '제3자 제공', body: '회사는 회원의 개인정보를 외부에 제공하지 않습니다. 단, 회원이 명시적으로 동의한 경우, 결제 처리를 위해 토스페이먼츠/포트원 등 결제 대행사에 필요한 정보를 제공합니다.' },
        { title: 'AI 상담 데이터 처리', body: 'AI 진로 상담 대화는 OpenAI/Anthropic 등의 LLM API를 통해 처리됩니다. 학생 식별 정보는 마스킹된 상태로 전달되며, 모델 학습 목적으로 재사용되지 않도록 계약상 보장됩니다.' },
        { title: '회원의 권리', body: '회원은 언제든지 본인의 개인정보를 열람, 수정, 삭제할 수 있으며, 동의를 철회할 수 있습니다. 만 14세 미만의 자녀에 대해서는 법정대리인이 권리를 행사할 수 있습니다.' },
        { title: '안전성 확보 조치', body: '전송 구간 TLS 1.3 암호화\n비밀번호 bcrypt 해싱\n역할 기반 접근 제어(RBAC) 및 감사 로그\n분기별 보안 점검' },
        { title: '개인정보 보호책임자', body: '책임자: 홍길동 (privacy@jinronavi.kr)\n고객센터: 1599-0000' },
      ]}
    />
  );
}
