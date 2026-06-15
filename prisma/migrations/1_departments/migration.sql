-- CreateTable: 대학별 학과정보 (대학알리미 공시, 조사년도 버전)
CREATE TABLE "UniversityDepartment" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "schoolSeq" TEXT,
    "campus" TEXT,
    "college" TEXT,
    "name" TEXT NOT NULL,
    "dayNight" TEXT,
    "feature" TEXT,
    "status" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "seriesLarge" TEXT,
    "seriesMid" TEXT,
    "seriesSmall" TEXT,
    "degree" TEXT,
    "years" TEXT,
    "svyYr" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT '대학알리미 (대학정보공시)',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityDepartment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UniversityDepartment_schoolName_campus_name_svyYr_key" ON "UniversityDepartment"("schoolName", "campus", "name", "svyYr");
CREATE INDEX "UniversityDepartment_schoolSeq_active_idx" ON "UniversityDepartment"("schoolSeq", "active");
CREATE INDEX "UniversityDepartment_svyYr_idx" ON "UniversityDepartment"("svyYr");
CREATE INDEX "UniversityDepartment_name_idx" ON "UniversityDepartment"("name");

ALTER TABLE "UniversityDepartment" ADD CONSTRAINT "UniversityDepartment_schoolSeq_fkey" FOREIGN KEY ("schoolSeq") REFERENCES "School"("seq") ON DELETE SET NULL ON UPDATE CASCADE;