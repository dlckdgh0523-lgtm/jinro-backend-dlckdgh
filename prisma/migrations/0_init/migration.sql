-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'teacher', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'ended');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('queued', 'rendering', 'done', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "school" TEXT,
    "classroom" TEXT,
    "consents" JSONB NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "tourCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerJob" (
    "seq" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "aptitude" TEXT,
    "salary" TEXT,
    "prospect" TEXT,
    "relatedMajors" TEXT[],
    "theme" TEXT,
    "raw" JSONB NOT NULL,
    "embedding" vector(256),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerJob_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "JuniorJob" (
    "seq" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT,
    "summary" TEXT,
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JuniorJob_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "Major" (
    "majorSeq" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT,
    "summary" TEXT,
    "departments" TEXT[],
    "raw" JSONB NOT NULL,
    "embedding" vector(256),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("majorSeq")
);

-- CreateTable
CREATE TABLE "School" (
    "seq" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "gubun" TEXT,
    "estType" TEXT,
    "link" TEXT,
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "CounselCase" (
    "seq" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT,
    "answer" TEXT,
    "raw" JSONB NOT NULL,
    "embedding" vector(256),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselCase_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "IngestionRun" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "IngestionRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "CounselingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselingMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounselingMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselingSignal" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sourceMessageId" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'mid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounselingSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'queued',
    "pdfKey" TEXT,
    "jobId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "targetUrl" TEXT,
    "payload" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerTarget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "univ" TEXT,
    "dept" TEXT,
    "track" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "CounselingSession_userId_status_idx" ON "CounselingSession"("userId", "status");

-- CreateIndex
CREATE INDEX "CounselingMessage_sessionId_createdAt_idx" ON "CounselingMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "CounselingSignal_sessionId_idx" ON "CounselingSignal"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_idempotencyKey_key" ON "Report"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_dedupeKey_key" ON "Notification"("userId", "dedupeKey");

-- CreateIndex
CREATE INDEX "CareerTarget_userId_idx" ON "CareerTarget"("userId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSession" ADD CONSTRAINT "CounselingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingMessage" ADD CONSTRAINT "CounselingMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CounselingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselingSignal" ADD CONSTRAINT "CounselingSignal_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CounselingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CounselingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerTarget" ADD CONSTRAINT "CareerTarget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

