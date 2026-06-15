import { describe, expect, it } from 'vitest';
import { __test } from '../../src/ai/counseling.service';

// parseReportJson — 실키(Sonnet) 검증에서 발견한 파싱 실패 케이스 방어:
// 코드펜스, 앞뒤 잡설, 토큰 절단(불완전 JSON)을 견고하게 처리.
const { parseReportJson, stripFence, stripLeakedState } = __test;

describe('리포트 JSON 파싱 (실 모델 출력 방어)', () => {
  it('순수 JSON', () => {
    expect(parseReportJson('{"headline":"h","careers":[]}')).toEqual({ headline: 'h', careers: [] });
  });

  it('```json 코드펜스로 감싼 출력 (Sonnet이 자주 함)', () => {
    const out = '```json\n{"headline":"영상 크리에이터","majors":["영상학과"]}\n```';
    expect(parseReportJson(out)).toEqual({ headline: '영상 크리에이터', majors: ['영상학과'] });
  });

  it('앞뒤 설명 텍스트가 붙은 출력', () => {
    const out = '다음은 리포트입니다:\n{"headline":"h","score":90}\n참고하세요.';
    expect(parseReportJson(out)).toEqual({ headline: 'h', score: 90 });
  });

  it('문자열 내부 중괄호를 괄호 균형으로 올바르게 처리', () => {
    const out = '{"why":"이것은 {중첩} 같은 텍스트","careers":[{"title":"t"}]}';
    expect(parseReportJson(out)).toEqual({ why: '이것은 {중첩} 같은 텍스트', careers: [{ title: 't' }] });
  });

  it('토큰 절단으로 불완전한 JSON → null (폴백 유도)', () => {
    const truncated = '{"headline":"h","careers":[{"title":"영상 편집자","why":"컷 편집이 뛰어';
    expect(parseReportJson(truncated)).toBeNull();
  });

  it('JSON 없음 → null', () => {
    expect(parseReportJson('죄송합니다 JSON을 만들 수 없습니다')).toBeNull();
  });

  it('stripFence — 코드펜스 제거', () => {
    expect(stripFence('```json\n{"a":1}\n```')).toBe('{"a":1}');
    expect(stripFence('```\nplain\n```')).toBe('plain');
  });

  it('stripLeakedState — 모델이 누수한 단계 안내/태그 제거', () => {
    expect(stripLeakedState('답변이에요.\n\n<state>\nstage: explore\n</state>')).toBe('답변이에요.');
    expect(stripLeakedState('답변이에요.\n<state>\nstage: explore (잘림')).toBe('답변이에요.');
    expect(stripLeakedState('답변이에요.\n\n[상담 단계 안내 — 내부] 현재 단계: 탐색')).toBe('답변이에요.');
    expect(stripLeakedState('누수 없는 정상 답변입니다.')).toBe('누수 없는 정상 답변입니다.');
  });
});
