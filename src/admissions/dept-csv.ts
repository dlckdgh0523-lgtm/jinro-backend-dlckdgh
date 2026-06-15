import { cleanString } from '../career/sanitize';

// 대학알리미 "대학별 학과정보" CSV 파서 (EUC-KR, RFC-4180 인용 필드 처리).
// 컬럼(2021 공시 기준): 조사년도,대학구분,학교구분,지역,설립구분,학교명,본분교명,단과대학,
//   학부·과(전공)명,주야구분,학과특성,학과상태,표준분류대계열,표준분류중계열,표준분류소계열,
//   대학자체대계열,수업연한,학위과정

export interface DeptRow {
  svyYr: number;
  schoolName: string;
  campus: string | null;
  college: string | null;
  name: string;
  dayNight: string | null;
  feature: string | null;
  status: string;
  active: boolean;
  seriesLarge: string | null;
  seriesMid: string | null;
  seriesSmall: string | null;
  degree: string | null;
  years: string | null;
}

/** RFC-4180: 인용("…") 안의 콤마/이스케이프된 따옴표("")를 올바르게 분해 */
export function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

const COL = {
  svyYr: 0,
  region: 3,
  estType: 4,
  schoolName: 5,
  campus: 6,
  college: 7,
  name: 8,
  dayNight: 9,
  feature: 10,
  status: 11,
  seriesLarge: 12,
  seriesMid: 13,
  seriesSmall: 14,
  years: 16,
  degree: 17,
} as const;

const VALID_DEGREES = new Set(['전문학사', '학사', '석사', '박사', '학석사통합', '석박사통합']);

export function parseDeptRow(fields: string[]): DeptRow | null {
  if (fields.length < 18) return null;
  const svyYr = Number(cleanString(fields[COL.svyYr]));
  const schoolName = cleanString(fields[COL.schoolName]);
  const name = cleanString(fields[COL.name]);
  const status = cleanString(fields[COL.status]);
  if (!Number.isFinite(svyYr) || !schoolName || !name || !status) return null;
  // 깨진 행(따옴표 누락으로 컬럼 밀림) 방어 — 학위과정이 유효 enum이 아니면 의심 행
  const degreeRaw = cleanString(fields[COL.degree]);
  const degree = degreeRaw && VALID_DEGREES.has(degreeRaw) ? degreeRaw : null;
  return {
    svyYr,
    schoolName,
    campus: cleanString(fields[COL.campus]),
    college: cleanString(fields[COL.college]),
    name,
    dayNight: cleanString(fields[COL.dayNight]),
    feature: cleanString(fields[COL.feature]),
    status,
    active: !status.includes('폐'), // 폐지/폐과 모두 비활성 (CSV·API 표기 차이 흡수)
    seriesLarge: cleanString(fields[COL.seriesLarge]),
    seriesMid: cleanString(fields[COL.seriesMid]),
    seriesSmall: cleanString(fields[COL.seriesSmall]),
    degree,
    years: cleanString(fields[COL.years]),
  };
}

// 프론트(admissions.jsx:42)는 track을 한글 '인문'|'자연'|'예체능'으로 쓴다 — 그 계약에 맞춘다.
export type Track = '인문' | '자연' | '예체능';

/** 표준분류 대계열 → 프론트 track 매핑 */
export function seriesToTrack(seriesLarge: string | null): Track | null {
  if (!seriesLarge) return null;
  if (seriesLarge.includes('예') || seriesLarge.includes('체능') || seriesLarge.includes('미술') || seriesLarge.includes('음악')) return '예체능';
  if (seriesLarge.includes('공학') || seriesLarge.includes('자연') || seriesLarge.includes('의약')) return '자연';
  if (seriesLarge.includes('인문') || seriesLarge.includes('사회') || seriesLarge.includes('교육')) return '인문';
  return null;
}
