-- 학과별 취업률 (대학알리미)
CREATE TABLE "UniversityEmploymentStat" (
  "id" TEXT NOT NULL,
  "svyYr" INTEGER NOT NULL,
  "schoolName" TEXT NOT NULL,
  "college" TEXT,
  "majorName" TEXT,
  "div" TEXT,
  "graduates" INTEGER,
  "employed" INTEGER,
  "employmentRate" DOUBLE PRECISION,
  "primaryMaintain" DOUBLE PRECISION,
  "rawData" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UniversityEmploymentStat_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UniversityEmploymentStat_schoolName_majorName_svyYr_key" ON "UniversityEmploymentStat"("schoolName", "majorName", "svyYr");
CREATE INDEX "UniversityEmploymentStat_schoolName_idx" ON "UniversityEmploymentStat"("schoolName");

-- 외국대학 교류 (파견/유치)
CREATE TABLE "UniversityExchangeStat" (
  "id" TEXT NOT NULL,
  "svyYr" INTEGER NOT NULL,
  "schoolName" TEXT NOT NULL,
  "schoolKind" TEXT,
  "foundDiv" TEXT,
  "dispatched" INTEGER,
  "invited" INTEGER,
  "rawData" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UniversityExchangeStat_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UniversityExchangeStat_schoolName_svyYr_key" ON "UniversityExchangeStat"("schoolName", "svyYr");
CREATE INDEX "UniversityExchangeStat_schoolName_idx" ON "UniversityExchangeStat"("schoolName");

-- 한국장학재단 학자금
CREATE TABLE "Scholarship" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT '한국장학재단',
  "organization" TEXT,
  "productName" TEXT NOT NULL,
  "productType" TEXT,
  "supportType" TEXT,
  "target" TEXT,
  "applyPeriod" TEXT,
  "amount" TEXT,
  "selectCount" TEXT,
  "rawData" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Scholarship_productName_idx" ON "Scholarship"("productName");
CREATE INDEX "Scholarship_organization_idx" ON "Scholarship"("organization");