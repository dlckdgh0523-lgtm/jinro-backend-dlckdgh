-- User.grade — 학년별 프롬프트 분기 키
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "grade" TEXT;

-- 봉사활동 모집 (VMS)
CREATE TABLE "VolunteerOpportunity" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'VMS',
    "title" TEXT NOT NULL,
    "centerName" TEXT,
    "centerType" TEXT,
    "region" TEXT,
    "areaCode" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "recruitFrom" TIMESTAMP(3),
    "recruitTo" TIMESTAMP(3),
    "recruitCount" INTEGER,
    "youthEligible" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "contact" TEXT,
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VolunteerOpportunity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "VolunteerOpportunity_externalId_key" ON "VolunteerOpportunity"("externalId");
CREATE INDEX "VolunteerOpportunity_region_youthEligible_idx" ON "VolunteerOpportunity"("region", "youthEligible");
CREATE INDEX "VolunteerOpportunity_recruitTo_idx" ON "VolunteerOpportunity"("recruitTo");

-- 진로교육자료 (COSE)
CREATE TABLE "CareerEducationMaterial" (
    "seq" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "year" INTEGER,
    "activityType" TEXT,
    "achieveType" TEXT,
    "target" TEXT,
    "attFile" TEXT,
    "content" TEXT,
    "selCount" INTEGER,
    "regDate" TIMESTAMP(3),
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CareerEducationMaterial_pkey" PRIMARY KEY ("seq")
);
CREATE INDEX "CareerEducationMaterial_target_activityType_idx" ON "CareerEducationMaterial"("target", "activityType");
CREATE INDEX "CareerEducationMaterial_activityType_idx" ON "CareerEducationMaterial"("activityType");

-- 해외대학 (KF)
CREATE TABLE "ForeignUniversity" (
    "id" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "nameEn" TEXT,
    "nameLocal" TEXT,
    "countryKo" TEXT,
    "countryEn" TEXT,
    "countryIso2" TEXT,
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ForeignUniversity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ForeignUniversity_countryIso2_idx" ON "ForeignUniversity"("countryIso2");
CREATE INDEX "ForeignUniversity_nameKo_idx" ON "ForeignUniversity"("nameKo");