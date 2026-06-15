import { describe, expect, it } from 'vitest';
import { parseCsvLine, parseDeptRow, seriesToTrack } from '../../src/admissions/dept-csv';

describe('대학별 학과 CSV 파서 (대학알리미 공시)', () => {
  it('정상 행 — 18컬럼 매핑', () => {
    const line = '2021,전문대학,기능대학,경기,사립,ICT폴리텍대학,본교,단과대구분없음,멀티미디어통신학과,주간,일반과정,기존,공학계열,전기·전자·컴퓨터,정보·통신공학,공학계열,2년,전문학사';
    const row = parseDeptRow(parseCsvLine(line));
    expect(row).toMatchObject({
      svyYr: 2021,
      schoolName: 'ICT폴리텍대학',
      campus: '본교',
      name: '멀티미디어통신학과',
      status: '기존',
      active: true,
      seriesLarge: '공학계열',
      degree: '전문학사',
    });
  });

  it('학과상태 폐지 → active=false', () => {
    const base = '2021,대학,대학,서울,사립,X대학교,본교,공과대학,폐지학과,주간,일반과정,폐지,공학계열,기계,기계공학,공학계열,4년,학사';
    expect(parseDeptRow(parseCsvLine(base))!.active).toBe(false);
    const merged = base.replace(',폐지,', ',변경[신설],');
    expect(parseDeptRow(parseCsvLine(merged))!.active).toBe(true);
  });

  it('RFC-4180 — 인용 필드 안의 콤마/이스케이프 따옴표', () => {
    expect(parseCsvLine('a,"b,c",d')).toEqual(['a', 'b,c', 'd']);
    expect(parseCsvLine('"전공(이론)","x ""인용"" y",z')).toEqual(['전공(이론)', 'x "인용" y', 'z']);
  });

  it('컬럼 부족/필수 누락 행은 null (전체 실패 아님)', () => {
    expect(parseDeptRow(['2021', 'a', 'b'])).toBeNull();
    expect(parseDeptRow('2021,대학,대학,서울,사립,,본교,단대,,주간,일반,기존,공학,기계,기계,공학,4년,학사'.split(','))).toBeNull();
  });

  it('밀린 행 방어 — 학위과정이 유효 enum 아니면 degree=null', () => {
    const bad = '2021,대학,대학,서울,사립,Y대,본교,예술대,조형학과,주간,일반,기존,예체능,미술,미술,예체능,4년,조형예술이론전공)';
    const row = parseDeptRow(parseCsvLine(bad));
    expect(row).not.toBeNull();
    expect(row!.degree).toBeNull();
  });

  it('대계열 → 프론트 track 매핑 (한글, admissions.jsx:42 계약)', () => {
    expect(seriesToTrack('공학계열')).toBe('자연');
    expect(seriesToTrack('자연과학계열')).toBe('자연');
    expect(seriesToTrack('인문계열')).toBe('인문');
    expect(seriesToTrack('사회계열')).toBe('인문');
    expect(seriesToTrack('예체능계열')).toBe('예체능');
    expect(seriesToTrack('미술')).toBe('예체능');
    expect(seriesToTrack(null)).toBeNull();
  });
});
