// study-store.jsx — single source of truth for this week's study/action tasks.
// Shared by: WeeklyActionsCard (dashboard), WeekStudyPanel (calendar),
// FocusTimer (자습 타임어택). Completing a focus session marks the linked task
// done → reflected everywhere. Mock/in-memory; backend later.

const _stListeners = new Set();
function _stEmit() { _stListeners.forEach(fn => { try { fn(); } catch (e) {} }); }

// `focus: true` → appears in the 자습 타임어택 picker & calendar 학습 계획.
// `target` → where the dashboard action item navigates.
// 실 데이터 — GET /study-tasks (이번 주). 로드 전까지는 빈 배열. 비어 있으면 빈 상태로 표시.
window.__STUDY_TASKS = window.__STUDY_TASKS || [];

// API 작업을 이번 주 weekKey로 한 번 적재. 응답 형태는 StudyPlanFull과 동일({ data:[...] }).
let _stLoaded = false;
function loadStudyTasks() {
  if (_stLoaded || typeof window.__apiFetch !== 'function') return;
  _stLoaded = true;
  const weekKey = (typeof isoWeekKey === 'function') ? isoWeekKey(new Date()) : '';
  window.__apiFetch('/study-tasks?weekKey=' + weekKey, { method: 'GET' })
    .then(r => { window.__STUDY_TASKS = (r && r.data) || r || []; _stEmit(); })
    .catch(() => { _stLoaded = false; });
}

function studyTasks() { return window.__STUDY_TASKS; }
function studyFocusTasks() { return window.__STUDY_TASKS.filter(t => t.focus); }
function setTaskDone(id, done = true) {
  const t = window.__STUDY_TASKS.find(x => x.id === id);
  if (t) {
    t.done = done; _stEmit();
    if (typeof window.__apiFetch === 'function') {
      window.__apiFetch('/study-tasks/' + id, { method: 'PATCH', body: JSON.stringify({ done }) }).catch(() => {});
    }
  }
}
function useStudyTasks() {
  const [, setN] = React.useState(0);
  React.useEffect(() => { const fn = () => setN(n => n + 1); _stListeners.add(fn); loadStudyTasks(); return () => _stListeners.delete(fn); }, []);
  return window.__STUDY_TASKS;
}

Object.assign(window, { studyTasks, studyFocusTasks, setTaskDone, useStudyTasks, loadStudyTasks });
