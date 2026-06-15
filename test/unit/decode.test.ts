import iconv from 'iconv-lite';
import { describe, expect, it } from 'vitest';
import { decodeCareernetBytes, decodeEucKr } from '../../src/career/decode';

describe('decode — EUC-KR 바이트 디코딩', () => {
  const korean = '<?xml version="1.0" encoding="euc-kr"?><dataSearch><content><major>디지털콘텐츠디자인학과</major></content></dataSearch>';

  it('euc-kr 바이트 → utf-8 한글 복원 (res.text() 금지 사유 증명)', () => {
    const bytes = iconv.encode(korean, 'euc-kr');
    // 잘못된 방법: utf-8로 바로 읽으면 깨진다
    expect(bytes.toString('utf8')).not.toContain('디지털콘텐츠디자인학과');
    // 올바른 방법
    expect(decodeEucKr(bytes)).toContain('디지털콘텐츠디자인학과');
  });

  it('Content-Type 헤더 charset 우선', () => {
    const eucBytes = iconv.encode(korean, 'euc-kr');
    expect(decodeCareernetBytes(eucBytes, 'text/xml;charset=euc-kr')).toContain('디지털콘텐츠디자인학과');
    const utfBytes = Buffer.from(korean.replace('euc-kr', 'utf-8'), 'utf8');
    expect(decodeCareernetBytes(utfBytes, 'application/xml; charset=UTF-8')).toContain('디지털콘텐츠디자인학과');
  });

  it('헤더 charset 없으면 XML 선언으로 판별', () => {
    const eucBytes = iconv.encode(korean, 'euc-kr');
    expect(decodeCareernetBytes(eucBytes, 'text/xml')).toContain('디지털콘텐츠디자인학과');
    const utfDecl = korean.replace('euc-kr', 'utf-8');
    expect(decodeCareernetBytes(Buffer.from(utfDecl, 'utf8'), null)).toContain('디지털콘텐츠디자인학과');
  });

  it('선언이 전혀 없으면 euc-kr 기본 (getOpenApi 계열 기본값)', () => {
    const noDecl = '<dataSearch><content><schoolName>서울대학교</schoolName></content></dataSearch>';
    expect(decodeCareernetBytes(iconv.encode(noDecl, 'euc-kr'), null)).toContain('서울대학교');
  });
});
