// page-help.jsx — per-page "?" help system.
// A consistent help button that opens a sheet explaining what each page does
// and how to use it (what to do, what each button opens).

const HELP_CONTENT = {
  // ── Student ──
  'student-dashboard': {
    title: '홈',
    what: '오늘 챙길 진로·학습을 한 화면에 모았어요.',
    how: [
      '“나의 목표” 카드의 리포트 보기 → AI 진로 리포트가 열려요.',
      '“이번 주 진로·학습 액션”에서 자습 버튼 → 자습 타임어택이 시작돼요.',
      '“다가오는 진로 일정”을 누르면 캘린더로 이동해요.',
      '오른쪽 위 종 아이콘 → 알림 목록을 볼 수 있어요.',
    ],
  },
  'ai-counseling': {
    title: 'AI 진로 상담',
    what: '정답을 고르는 설문이 아니라, 대화로 진로 단서를 모으는 곳이에요.',
    how: [
      '아래 입력창에 떠오르는 대로 편하게 답하면 돼요.',
      '대화가 쌓이면 AI가 흥미·강점·가치 단서를 정리해줘요.',
      '단서가 충분해지면 “리포트 보기”로 1차 진로 리포트를 받아요.',
      '잘 모르겠으면 “잘 모르겠어요”라고 답해도 괜찮아요.',
    ],
  },
  'career-report': {
    title: 'AI 진로 리포트',
    what: '지금까지 대화를 바탕으로 정리한 진로 가설과 근거예요.',
    how: [
      '추천 직업·학과와 그 “이유”를 함께 확인하세요.',
      '“대화에서 보인 단서”로 왜 이렇게 추천됐는지 알 수 있어요.',
      '아직 확정이 아니에요 — 상담을 이어가면 계속 업데이트돼요.',
      '오른쪽 위 저장 아이콘으로 리포트를 보관할 수 있어요.',
    ],
  },
  'grades': {
    title: '성적',
    what: '모의고사·내신·수행평가 추이와 과목별 분석을 봐요.',
    how: [
      '“성적 입력” 버튼 → 시험별 점수를 입력하는 화면이 열려요.',
      '“추이” 탭은 평균 흐름, “과목별” 탭은 단원별 정답률을 보여줘요.',
      '학년(전체/1·2·3학년) 선택으로 기간을 바꿀 수 있어요.',
      '입력한 성적은 담당 선생님께도 공유돼요.',
    ],
  },
  'study': {
    title: '학습',
    what: '이번 주 학습 계획과 자습 기록을 관리해요.',
    how: [
      '“자습 시작” 버튼 → 자습 타임어택 타이머가 켜져요.',
      '타이머를 끝내면 연결된 학습 항목이 자동으로 완료 처리돼요.',
      '요일별 자습 시간·과목별 비중 그래프로 패턴을 확인하세요.',
    ],
  },
  'focus-timer': {
    title: '자습 타임어택',
    what: '시간을 정해두고 집중해서 공부하는 타이머예요.',
    how: [
      '“이번 주 진도에서 선택”에서 공부할 항목을 고르세요.',
      '시간(25/50/90분·직접)을 정하고 시작을 눌러요.',
      '완료하면 그 항목이 학습 계획에서 완료로 바뀌어요.',
      '앱을 끄거나 다른 화면으로 가면 자동 종료돼요.',
    ],
  },
  'counseling': {
    title: '상담 · 기록',
    what: '담당 선생님께 상담을 요청하고 받은 메모를 확인해요.',
    how: [
      '“상담 요청하기” → 원하는 내용을 적어 보내면 선생님이 일정을 잡아요.',
      'AI 상담 내용을 바탕으로 요청 초안을 자동으로 제안해줘요.',
      '받은 상담 메모와 확정된 일정을 여기서 확인할 수 있어요.',
    ],
  },
  'calendar': {
    title: '캘린더',
    what: '상담·수행평가·모의고사·학습 마감 일정이 모두 모여요.',
    how: [
      '날짜를 누르면 그날 일정이 아래에 나와요.',
      '오른쪽 위 “+” → 개인 일정·학습 계획을 추가하는 창이 열려요.',
      '“이번 주 학습 계획”의 학습하러 가기 → 자습 타이머로 이동해요.',
      '선생님이 보낸 일정·메모도 여기에 자동으로 들어와요.',
    ],
  },
  'admissions': {
    title: '대학 · 입시',
    what: '관심 대학·학과의 입시 정보를 살펴봐요.',
    how: [
      '대학/학과를 누르면 상세 정보와 출처 카드가 열려요.',
      '관심 학과로 등록하면 AI 입시 분석을 받을 수 있어요.',
      '합격 확률(%) 대신 “전략 상태”로 준비 방향을 안내해요.',
    ],
  },
  'ai-chat': {
    title: 'AI 도움말',
    what: '입시·학습·서비스 사용법을 무엇이든 물어보는 챗이에요.',
    how: [
      '궁금한 점을 입력창에 적어 보내세요.',
      'RAG 기반으로 근거(출처)와 함께 답해줘요.',
      '진로 상담과 달리, 정보를 “찾아주는” 도구예요.',
    ],
  },
  'billing': {
    title: '구독 및 결제',
    what: '현재 플랜과 사용 현황을 확인해요.',
    how: [
      '지금은 전체 무료 운영 중이라 결제가 필요 없어요.',
      '“미리 알림 받기” → 유료 전환 시 30일 전에 알려드려요.',
      '이번 달 사용 현황으로 얼마나 활용 중인지 볼 수 있어요.',
    ],
  },
  'profile': {
    title: '더보기',
    what: '내 정보·학급·구독·공지사항·계정 설정이 모여 있어요.',
    how: [
      '“내 정보” → 이메일·학교 등을 수정할 수 있어요(휴대폰은 인증 필요).',
      '“공지사항” → 업데이트 소식과 건의·버그 제보가 있어요.',
      '“학급 정보” → 담당 선생님과 학급을 확인해요.',
    ],
  },
  'consents': {
    title: '동의 항목 관리',
    what: '개인정보·알림 등 동의 항목을 켜고 끌 수 있어요.',
    how: [
      '각 항목의 스위치로 동의를 변경할 수 있어요.',
      '필수 항목은 서비스 이용에 꼭 필요해 끌 수 없어요.',
      '알림·마케팅 같은 선택 항목은 언제든 바꿀 수 있어요.',
    ],
  },
  'announcements': {
    title: '공지사항',
    what: '서비스 업데이트 소식을 보고, 건의·버그를 제보해요.',
    how: [
      '공지 항목을 누르면 상세 내용이 열려요.',
      '“내 건의·제보” 탭 → 보낸 의견의 처리 상태를 확인해요.',
      '“건의·버그 제보하기” → 유형·내용을 적어 보낼 수 있어요.',
    ],
  },
  // ── Teacher ──
  'teacher-dashboard': {
    title: '대시보드',
    what: '학급 요약과 오늘 주목할 학생을 한눈에 봐요.',
    how: [
      '“오늘 주목할 학생” → 누르면 해당 학생 상세로 이동해요.',
      '상단 지표(상담 요청·활동)를 누르면 관련 화면으로 가요.',
      '초대코드 카드의 복사 버튼으로 학생을 초대할 수 있어요.',
    ],
  },
  'teacher-classroom': {
    title: '학급 · 초대코드',
    what: '학급 정보와 6자리 초대코드를 관리해요.',
    how: [
      '“코드 복사” → 학생에게 전달하면 학급에 자동 합류해요.',
      '“코드 재발급” → 기존 코드를 비활성화하고 새로 발급해요.',
      '정원(최대 30명)과 현재 참여 인원을 확인할 수 있어요.',
    ],
  },
  'teacher-students': {
    title: '학생 관리',
    what: '학급 학생의 성적·AI 리포트·학습·자습 상태를 봐요.',
    how: [
      '검색·필터로 상담 필요·자습 중 학생을 빠르게 찾아요.',
      '학생을 누르면 상세(성적·AI 상담·리포트·메모)가 열려요.',
      '목표를 바꾼 학생은 “상담 필요”로 표시돼요.',
    ],
  },
  'teacher-detail': {
    title: '학생 상세',
    what: '학생 한 명의 모든 정보를 탭으로 나눠 봐요.',
    how: [
      '“AI 상담 내용” 탭 → 상담 전에 학생 생각을 미리 파악해요.',
      '“성적” 탭의 성적 입력으로 점수를 등록할 수 있어요.',
      '“메모 남기기” → 상담 메모를 작성(학생 공개 여부 선택)해요.',
    ],
  },
  'teacher-completion': {
    title: '학습 완료 현황',
    what: '학급 전체의 주간 학습 완료율을 봐요.',
    how: [
      '진행률이 낮은 학생을 빠르게 찾아 상담할 수 있어요.',
      '학생을 누르면 상세 학습 내역으로 이동해요.',
    ],
  },
  'teacher-counseling': {
    title: '상담 · 기록',
    what: '상담 요청을 처리하고 학급 전체 상담 기록을 관리해요.',
    how: [
      '“상담 요청” 탭 → 수락하면 캘린더에 일정이 잡혀요.',
      '“상담 기록 관리” 탭 → 모든 상담 메모를 검색·필터해요.',
      '“기록 추가”로 새 상담 메모를 남길 수 있어요.',
    ],
  },
  'teacher-calendar': {
    title: '캘린더',
    what: '상담 일정과 학사 일정을 관리하고 학생에게 일정을 보내요.',
    how: [
      '오른쪽 위 “+” → 학생을 골라 일정·메모를 일괄 발송해요.',
      '상단에서 학생을 선택하면 그 학생 캘린더를 조회할 수 있어요.',
      '대기 중인 상담 요청을 바로 수락·처리할 수 있어요.',
    ],
  },
  'teacher-messages': {
    title: '메시지',
    what: '학생과 1:1 메시지·상담 메모를 주고받아요.',
    how: [
      '오른쪽 위 “+” → 학생(또는 학급 전체)을 골라 메시지를 보내요.',
      '“안 읽음” 탭으로 답장이 필요한 대화를 추려봐요.',
      '메모는 학생 공개 여부를 선택할 수 있어요.',
    ],
  },
  'teacher-ai-view': {
    title: '학생 AI 리포트',
    what: '학생의 AI 상담 내용과 상담 가이드를 봐요.',
    how: [
      '“AI가 드리는 메모”로 학생을 어떻게 대할지 참고하세요.',
      '“이렇게 상담해보세요”의 권장/회피 가이드를 확인해요.',
      '대화 발췌는 학생 동의 범위 내에서만 열람돼요.',
    ],
  },
};

function HelpButton({ pageId, dark }) {
  const [open, setOpen] = React.useState(false);
  const c = HELP_CONTENT[pageId];
  if (!c) return null;
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: 'absolute', top: '38%', right: 0, zIndex: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}
    >
      {/* always-visible right-edge tab */}
      <button onClick={() => setOpen(o => !o)} aria-label="이 페이지 도움말" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        border: 'none', cursor: 'pointer', padding: '12px 7px',
        background: 'var(--brand-500)', color: '#fff',
        borderRadius: '12px 0 0 12px', boxShadow: '-2px 2px 10px rgba(17,24,39,0.16)',
        writingMode: 'vertical-rl',
      }}>
        <span style={{ fontWeight: 800, fontSize: 16, writingMode: 'horizontal-tb' }}>?</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>도움말</span>
      </button>
      {/* slide-out panel */}
      {open && <HelpPanel content={c} onClose={() => setOpen(false)}/>}
    </div>
  );
}

// Right-side slide-out help panel (anchored to the tab).
function HelpPanel({ content, onClose }) {
  return (
    <div style={{
      position: 'absolute', top: 0, right: 38,
      width: 300, maxWidth: '78vw',
      background: 'var(--bg-elevated)', borderRadius: 14,
      boxShadow: 'var(--shadow-pop)', overflow: 'hidden',
      animation: 'helpSlide .24s var(--ease-toss)',
    }}>
      <style>{`@keyframes helpSlide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <div style={{ padding: '14px 16px', background: 'var(--brand-50)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--brand-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>?</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--fg-strong)' }} className="kr-heading">{content.title}</div>
          <div style={{ fontSize: 11, color: 'var(--brand-600)' }}>이 페이지 사용법</div>
        </div>
      </div>
      <div style={{ padding: '14px 16px', maxHeight: 360, overflow: 'auto' }} className="toss-scroll">
        <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.55, marginBottom: 14 }} className="kr-heading">{content.what}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {content.how.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--brand-500)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <span style={{ fontSize: 12.5, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HELP_CONTENT, HelpButton, HelpSheet, HelpPanel });

function HelpSheet({ content, onClose }) {
  const trapRef = (typeof useFocusTrap !== 'undefined') ? useFocusTrap(true, onClose) : null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 95, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.45)', animation: 'fadeIn .2s ease' }}/>
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label={`${content.title} 도움말`} style={{
        position: 'relative', background: 'var(--bg-elevated)', borderRadius: '24px 24px 0 0',
        boxShadow: 'var(--shadow-pop)', animation: 'sheetIn .32s var(--ease-toss)',
        maxHeight: '82%', overflow: 'auto', paddingBottom: 24,
        maxWidth: 520, width: '100%', margin: '0 auto',
      }} className="toss-scroll">
        <div style={{ width: 36, height: 4, background: 'var(--line-strong)', borderRadius: 999, margin: '10px auto 4px' }}/>
        <div style={{ padding: '12px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--brand-50)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>?</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg-strong)' }} className="kr-heading">{content.title}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>이 페이지 사용법</div>
          </div>
          <IconButton icon={<IcX size={20}/>} onClick={onClose} ariaLabel="닫기"/>
        </div>
        <div style={{ padding: '16px 22px 0' }}>
          <div style={{ padding: 14, background: 'var(--brand-50)', borderRadius: 12, fontSize: 14, color: 'var(--brand-700)', lineHeight: 1.55, marginBottom: 16 }} className="kr-heading">
            {content.what}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-subtle)', marginBottom: 10 }}>이렇게 사용해요</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {content.how.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-500)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.5 }} className="kr-heading">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HELP_CONTENT, HelpButton, HelpSheet });
