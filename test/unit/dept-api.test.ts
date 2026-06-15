import { describe, expect, it } from 'vitest';
import { __ggTest } from '../../src/admissions/dept-api.client';

// 경기데이터드림 학과 API row → DeptRow 정규화 (2026-06 실 응답 형태 기준)
const { ggRowToDept } = __ggTest;

describe('학과 API(gg.go.kr) 정규화', () => {
  const sample = {
    EXAMIN_YY: '2017',
    SCHOOL_NM: '가천대학교',
    THSCHOL_BRSCHOL_NM: '본교',
    COLGE_UNIV_NM: '인문대학',
    UNDSTUD_KWA_NM: '동양어문학과',
    DAN_DIV_NM: '주간',
    MJR_CHARTR_NM: '일반과정',
    MJR_STATE_NM: '기존',
    LRGE_AFIL_NM: '인문ㆍ사회',
    MED_AFIL_NM: '언어ㆍ문학',
    SM_AFIL_NM: '중국어ㆍ문학',
    CLAS_TERM_NM: '4년',
    DEG_CRSE_NM: '학사',
  };

  it('정상 row 매핑', () => {
    expect(ggRowToDept(sample)).toMatchObject({
      svyYr: 2017,
      schoolName: '가천대학교',
      campus: '본교',
      college: '인문대학',
      name: '동양어문학과',
      status: '기존',
      active: true,
      seriesLarge: '인문ㆍ사회',
      degree: '학사',
    });
  });

  it('폐과 → active=false (API는 "폐과", CSV는 "폐지" — 둘 다 흡수)', () => {
    expect(ggRowToDept({ ...sample, MJR_STATE_NM: '폐과' })!.active).toBe(false);
    expect(ggRowToDept({ ...sample, MJR_STATE_NM: '폐지' })!.active).toBe(false);
  });

  it('필수 필드 누락 → null (전체 실패 아님)', () => {
    expect(ggRowToDept({ ...sample, SCHOOL_NM: undefined })).toBeNull();
    expect(ggRowToDept({ ...sample, EXAMIN_YY: undefined })).toBeNull();
    expect(ggRowToDept({})).toBeNull();
  });
});
