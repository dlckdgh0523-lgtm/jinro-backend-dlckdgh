import iconv from 'iconv-lite';

// EUC-KR XML 계열은 반드시 바이트(Buffer)로 받아 디코딩한다.
// res.text()는 UTF-8 가정으로 한글이 깨진다 — 절대 금지 (CLAUDE.md 계약).
export function decodeEucKr(bytes: Buffer): string {
  return iconv.decode(bytes, 'euc-kr');
}

/**
 * Content-Type/XML 선언의 charset을 보고 디코딩.
 * 커리어넷 getOpenApi 계열은 euc-kr이 기본이지만, 방어적으로 선언을 우선한다.
 */
export function decodeCareernetBytes(bytes: Buffer, contentTypeHeader?: string | null): string {
  const header = (contentTypeHeader || '').toLowerCase();
  if (header.includes('utf-8')) return bytes.toString('utf8');
  if (header.includes('euc-kr') || header.includes('ks_c_5601')) return decodeEucKr(bytes);

  // 헤더에 charset이 없으면 XML 선언을 ASCII로 훔쳐본다
  const head = bytes.subarray(0, 200).toString('latin1').toLowerCase();
  if (head.includes('euc-kr') || head.includes('ks_c_5601')) return decodeEucKr(bytes);
  if (head.includes('utf-8')) return bytes.toString('utf8');

  // 기본값: euc-kr (getOpenApi 계열 기본 인코딩)
  return decodeEucKr(bytes);
}
