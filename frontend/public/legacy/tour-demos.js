function StudentWebWithTour() {
  const tour = useTour(STUDENT_TOUR_STEPS, "student");
  React.useEffect(() => {
    tour.setPhase("tour");
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(StudentWebApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(FeedbackButton, null), /* @__PURE__ */ React.createElement(TourOverlay, { tour }));
}
function TeacherWebWithTour() {
  const tour = useTour(TEACHER_TOUR_STEPS, "teacher");
  React.useEffect(() => {
    tour.setPhase("tour");
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(FeedbackButton, null), /* @__PURE__ */ React.createElement(TourOverlay, { tour }));
}
function StudentWebWithFeedbackOnly() {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(StudentWebApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(FeedbackButton, null));
}
function TeacherWebWithFeedbackOnly() {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(TeacherApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(FeedbackButton, null));
}
function AdminWebWithFeedbackOnly() {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminApp, { initialScreen: "dashboard" }), /* @__PURE__ */ React.createElement(FeedbackButton, null));
}
function WelcomeModalDemo({ role = "student" }) {
  const [shown, setShown] = React.useState(true);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, padding: 24, opacity: 0.35, pointerEvents: "none" } }, role === "student" && /* @__PURE__ */ React.createElement(StudentWebApp, { initialScreen: "dashboard" }), role === "teacher" && /* @__PURE__ */ React.createElement(TeacherApp, { initialScreen: "dashboard" }), role === "admin" && /* @__PURE__ */ React.createElement(AdminApp, { initialScreen: "dashboard" })), shown && /* @__PURE__ */ React.createElement(
    WelcomeModal,
    {
      role,
      onStart: () => setShown(false),
      onSkip: () => setShown(false)
    }
  ), !shown && /* @__PURE__ */ React.createElement("button", { onClick: () => setShown(true), style: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 50,
    padding: "8px 14px",
    background: "var(--brand-500)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer"
  } }, "\uC6F0\uCEF4 \uBAA8\uB2EC \uB2E4\uC2DC \uBCF4\uAE30"));
}
function FeedbackDialogDemo() {
  const [open, setOpen] = React.useState(true);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", background: "var(--bg-canvas)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, padding: 24, opacity: 0.35, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(StudentWebApp, { initialScreen: "dashboard" })), open ? /* @__PURE__ */ React.createElement(FeedbackDialog, { onClose: () => setOpen(false) }) : /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen(true), style: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 50,
    padding: "8px 14px",
    background: "var(--brand-500)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer"
  } }, "\uB2E4\uC774\uC5BC\uB85C\uADF8 \uB2E4\uC2DC \uC5F4\uAE30"));
}
Object.assign(window, {
  StudentWebWithTour,
  TeacherWebWithTour,
  StudentWebWithFeedbackOnly,
  TeacherWebWithFeedbackOnly,
  AdminWebWithFeedbackOnly,
  WelcomeModalDemo,
  FeedbackDialogDemo
});
