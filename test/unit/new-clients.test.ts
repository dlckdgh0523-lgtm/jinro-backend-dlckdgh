import { describe, expect, it } from 'vitest';
import { __vmsTest } from '../../src/volunteers/vms.client';
import { __coseTest } from '../../src/career/cose.client';
import { __test as counselTest } from '../../src/ai/counseling.service';

describe('VMS 날짜 파싱', () => {
  const { parseDate } = __vmsTest;
  it('YYYYMMDD', () => expect(parseDate('20260615')?.toISOString().slice(0, 10)).toBe('2026-06-15'));
  it('YYYY-MM-DD', () => expect(parseDate('2026-06-15')?.toISOString().slice(0, 10)).toBe('2026-06-15'));
  it('잘못된 입력 → null', () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate('not-a-date')).toBeNull();
    expect(parseDate('20')).toBeNull(); // 너무 짧음
  });
});

describe('COSE target 라벨', () => {
  const { targetLabel, ACTIVITY } = __coseTest;
  it('학년 코드 → 한국어', () => {
    expect(targetLabel('E')).toBe('초등학교');
    expect(targetLabel('M')).toBe('중학교');
    expect(targetLabel('I')).toBe('일반고');
    expect(targetLabel('C')).toBe('공통');
    expect(targetLabel(null)).toBe('미지정');
  });
  it('activityType 코드 매핑이 변하지 않는다', () => {
    expect(ACTIVITY['102334']).toBe('진로·직업체험');
    expect(ACTIVITY['102331']).toBe('진로심리검사');
  });
});

describe('학년 코드 변환 (counseling.service)', () => {
  const { gradeToTarget, gradeKoreanLabel, stripLeakedState } = counselTest as unknown as { gradeToTarget: (g: string) => string; gradeKoreanLabel: (g: string) => string; stripLeakedState: (s: string) => string };
  it('학년 → COSE target', () => {
    expect(gradeToTarget('E4')).toBe('E');
    expect(gradeToTarget('M2')).toBe('M');
    expect(gradeToTarget('H3')).toBe('I');
    expect(gradeToTarget('X')).toBe('C');
  });
  it('학년 라벨', () => {
    expect(gradeKoreanLabel('E4')).toBe('초4');
    expect(gradeKoreanLabel('H3')).toBe('고3');
  });
  it('학년 안내 누수도 제거', () => {
    expect(stripLeakedState('답변\n[학생 학년 안내 — 내부] 학년: 고2')).toBe('답변');
  });
});
