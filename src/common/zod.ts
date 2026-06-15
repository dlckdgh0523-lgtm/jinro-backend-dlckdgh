import { z } from 'zod';

// 컨트롤러 입력 검증 헬퍼 — 실패 시 ZodError를 던지고 전역 필터가 400 표준에러로 변환.
export function parseOrThrow<S extends z.ZodTypeAny>(schema: S, value: unknown): z.infer<S> {
  return schema.parse(value);
}

/** 공통 쿼리 프리미티브 */
export const qLimit = z.coerce.number().int().min(1).max(100).default(20);
export const qCursor = z.coerce.number().int().min(0).max(2_147_483_647).optional();
export const qText = z
  .string()
  .trim()
  .max(200, '검색어는 200자 이하여야 해요')
  .optional()
  .transform((v) => (v === '' ? undefined : v));
