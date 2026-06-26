-- Refresh token family 추적 — 탈취 감지 시 family 전체 폐기용
ALTER TABLE "RefreshToken"
  ADD COLUMN "familyId" TEXT,
  ADD COLUMN "parentId" TEXT;

CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");
