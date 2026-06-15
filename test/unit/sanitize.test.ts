import { describe, expect, it } from 'vitest';
import { cleanNumber, cleanString, deepClean, ensureArray, splitList } from '../../src/career/sanitize';

describe('sanitize — 커리어넷 dirty data 정제', () => {
  it('"null"/"undefined" 문자열 → null', () => {
    expect(cleanString('null')).toBeNull();
    expect(cleanString('NULL')).toBeNull();
    expect(cleanString('undefined')).toBeNull();
    expect(cleanString('')).toBeNull();
    expect(cleanString('   ')).toBeNull();
    expect(cleanString(null)).toBeNull();
    expect(cleanString(undefined)).toBeNull();
  });

  it('<br> 변형 전부 제거', () => {
    expect(cleanString('안녕<br>하세요')).toBe('안녕 하세요');
    expect(cleanString('안녕<br/>하세요')).toBe('안녕 하세요');
    expect(cleanString('안녕</br>하세요')).toBe('안녕 하세요');
    expect(cleanString('안녕&lt;/br&gt;하세요')).toBe('안녕 하세요');
    expect(cleanString('안녕&lt;br&gt;하세요')).toBe('안녕 하세요');
  });

  it('리터럴 \\r\\n과 실제 개행·중복 공백 정리 + trim', () => {
    expect(cleanString('첫줄\\r\\n둘째줄')).toBe('첫줄 둘째줄');
    expect(cleanString('  앞뒤   공백   많음  ')).toBe('앞뒤 공백 많음');
    expect(cleanString('탭\t과\r\n개행')).toBe('탭 과 개행');
  });

  it('HTML 엔티티 디코드 + 태그 제거', () => {
    expect(cleanString('A &amp; B')).toBe('A & B');
    expect(cleanString('<p>본문</p>')).toBe('본문');
    expect(cleanString('&quot;인용&quot;')).toBe('"인용"');
  });

  it('숫자 엔티티(&#xd; &#13; &#39;) — 실 API 상담 답변 잔재', () => {
    expect(cleanString('첫째&#xd; &#xd; 둘째')).toBe('첫째 둘째');
    expect(cleanString('첫째&#13;둘째')).toBe('첫째 둘째');
    expect(cleanString('It&#39;s')).toBe("It's");
    expect(cleanString('한글&#54620;')).toBe('한글한');
  });

  it('cleanNumber — count가 string으로 오는 케이스', () => {
    expect(cleanNumber('120')).toBe(120);
    expect(cleanNumber(' 1,234 ')).toBe(1234);
    expect(cleanNumber('null')).toBeNull();
    expect(cleanNumber('abc')).toBeNull();
    expect(cleanNumber(42)).toBe(42);
  });

  it('ensureArray — 단일 객체/누락을 항상 배열로', () => {
    expect(ensureArray(undefined)).toEqual([]);
    expect(ensureArray(null)).toEqual([]);
    expect(ensureArray({ a: 1 })).toEqual([{ a: 1 }]);
    expect(ensureArray([1, 2])).toEqual([1, 2]);
  });

  it('splitList — 쉼표 나열 + dirty 항목 정제', () => {
    expect(splitList('미디어학과,  디자인학과 , 컴퓨터공학과')).toEqual(['미디어학과', '디자인학과', '컴퓨터공학과']);
    expect(splitList('null')).toEqual([]);
    expect(splitList('A,null,B')).toEqual(['A', 'B']);
    expect(splitList(null)).toEqual([]);
  });

  it('deepClean — 중첩 구조의 문자열 leaf 정제', () => {
    expect(deepClean({ a: 'null', b: ['x<br>y', { c: ' 공백 ' }] })).toEqual({ a: null, b: ['x y', { c: '공백' }] });
  });
});
