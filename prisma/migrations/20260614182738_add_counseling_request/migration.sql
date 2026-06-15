-- CreateTable
CREATE TABLE "CounselingRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "note" TEXT,
    "preferredAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3),
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CounselingRequest_teacherId_status_idx" ON "CounselingRequest"("teacherId", "status");

-- CreateIndex
CREATE INDEX "CounselingRequest_studentId_idx" ON "CounselingRequest"("studentId");

-- AddForeignKey
ALTER TABLE "CounselingRequest" ADD CONSTRAINT "CounselingRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingRequest" ADD CONSTRAINT "CounselingRequest_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
