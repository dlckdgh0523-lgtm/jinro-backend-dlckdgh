-- 교사 AI 코칭 멀티세션 — 학생별 컨텍스트 + 대화창 제목
-- (학생 모드 세션은 subjectStudentId=null, title=null로 그대로 동작)

ALTER TABLE "CounselingSession"
  ADD COLUMN "subjectStudentId" TEXT,
  ADD COLUMN "title" TEXT;

CREATE INDEX "CounselingSession_userId_subjectStudentId_idx"
  ON "CounselingSession"("userId", "subjectStudentId");
