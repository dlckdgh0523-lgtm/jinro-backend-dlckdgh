// tour-demos.jsx — Demo apps wired with the onboarding tour + feedback button

function StudentWebWithTour() {
  // Skip welcome — go straight to tour so this artboard SHOWS the tooltip,
  // not the welcome modal (which is in its own artboards).
  const tour = useTour(STUDENT_TOUR_STEPS, 'student');
  React.useEffect(() => { tour.setPhase('tour'); }, []);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <StudentWebApp initialScreen="dashboard"/>
      <FeedbackButton/>
      <TourOverlay tour={tour}/>
    </div>
  );
}

function TeacherWebWithTour() {
  const tour = useTour(TEACHER_TOUR_STEPS, 'teacher');
  React.useEffect(() => { tour.setPhase('tour'); }, []);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <TeacherApp initialScreen="dashboard"/>
      <FeedbackButton/>
      <TourOverlay tour={tour}/>
    </div>
  );
}

function StudentWebWithFeedbackOnly() {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <StudentWebApp initialScreen="dashboard"/>
      <FeedbackButton/>
    </div>
  );
}

function TeacherWebWithFeedbackOnly() {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <TeacherApp initialScreen="dashboard"/>
      <FeedbackButton/>
    </div>
  );
}

function AdminWebWithFeedbackOnly() {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <AdminApp initialScreen="dashboard"/>
      <FeedbackButton/>
    </div>
  );
}

// Standalone welcome modal demo (no nav distractions)
function WelcomeModalDemo({ role = 'student' }) {
  const [shown, setShown] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--bg-canvas)' }}>
      {/* Faded background */}
      <div style={{ position: 'absolute', inset: 0, padding: 24, opacity: 0.35, pointerEvents: 'none' }}>
        {role === 'student' && <StudentWebApp initialScreen="dashboard"/>}
        {role === 'teacher' && <TeacherApp initialScreen="dashboard"/>}
        {role === 'admin' && <AdminApp initialScreen="dashboard"/>}
      </div>
      {shown && (
        <WelcomeModal
          role={role}
          onStart={() => setShown(false)}
          onSkip={() => setShown(false)}
        />
      )}
      {!shown && (
        <button onClick={() => setShown(true)} style={{
          position: 'absolute', top: 20, right: 20, zIndex: 50,
          padding: '8px 14px', background: 'var(--brand-500)', color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>웰컴 모달 다시 보기</button>
      )}
    </div>
  );
}

// Feedback dialog standalone demo
function FeedbackDialogDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ position: 'relative', height: '100%', background: 'var(--bg-canvas)' }}>
      <div style={{ position: 'absolute', inset: 0, padding: 24, opacity: 0.35, pointerEvents: 'none' }}>
        <StudentWebApp initialScreen="dashboard"/>
      </div>
      {open ? <FeedbackDialog onClose={() => setOpen(false)}/> : (
        <button onClick={() => setOpen(true)} style={{
          position: 'absolute', top: 20, right: 20, zIndex: 50,
          padding: '8px 14px', background: 'var(--brand-500)', color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>다이얼로그 다시 열기</button>
      )}
    </div>
  );
}

Object.assign(window, {
  StudentWebWithTour, TeacherWebWithTour,
  StudentWebWithFeedbackOnly, TeacherWebWithFeedbackOnly, AdminWebWithFeedbackOnly,
  WelcomeModalDemo, FeedbackDialogDemo,
});
