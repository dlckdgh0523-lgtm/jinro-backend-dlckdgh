-- 공지사항(관리자) + 건의사항(사용자)
CREATE TABLE "Announcement" (
  "id"        TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "pinned"    BOOLEAN NOT NULL DEFAULT false,
  "audience"  TEXT NOT NULL DEFAULT 'all',
  "authorId"  TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Suggestion" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "category"  TEXT NOT NULL DEFAULT '기타',
  "body"      TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'open',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Suggestion_createdAt_idx" ON "Suggestion"("createdAt");
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
