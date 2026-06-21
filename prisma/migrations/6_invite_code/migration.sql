-- 교사 학급 초대코드: User에 유니크 inviteCode 추가
ALTER TABLE "User" ADD COLUMN "inviteCode" TEXT;
CREATE UNIQUE INDEX "User_inviteCode_key" ON "User"("inviteCode");
