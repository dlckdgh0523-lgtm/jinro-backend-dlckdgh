const _stListeners = /* @__PURE__ */ new Set();
function _stEmit() {
  _stListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
    }
  });
}
window.__STUDY_TASKS = window.__STUDY_TASKS || [];
let _stLoaded = false;
function loadStudyTasks() {
  if (_stLoaded || typeof window.__apiFetch !== "function") return;
  _stLoaded = true;
  const weekKey = typeof isoWeekKey === "function" ? isoWeekKey(/* @__PURE__ */ new Date()) : "";
  window.__apiFetch("/study-tasks?weekKey=" + weekKey, { method: "GET" }).then((r) => {
    window.__STUDY_TASKS = r && r.data || r || [];
    _stEmit();
  }).catch(() => {
    _stLoaded = false;
  });
}
function studyTasks() {
  return window.__STUDY_TASKS;
}
function studyFocusTasks() {
  return window.__STUDY_TASKS.filter((t) => t.focus);
}
function setTaskDone(id, done = true) {
  const t = window.__STUDY_TASKS.find((x) => x.id === id);
  if (t) {
    t.done = done;
    _stEmit();
    if (typeof window.__apiFetch === "function") {
      window.__apiFetch("/study-tasks/" + id, { method: "PATCH", body: JSON.stringify({ done }) }).catch(() => {
      });
    }
  }
}
function useStudyTasks() {
  const [, setN] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setN((n) => n + 1);
    _stListeners.add(fn);
    loadStudyTasks();
    return () => _stListeners.delete(fn);
  }, []);
  return window.__STUDY_TASKS;
}
Object.assign(window, { studyTasks, studyFocusTasks, setTaskDone, useStudyTasks, loadStudyTasks });
