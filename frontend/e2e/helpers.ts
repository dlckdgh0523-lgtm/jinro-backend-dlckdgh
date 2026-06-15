import { type Page, expect } from '@playwright/test';

export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.kr`;
}

/** 신규 학생 가입 → 상담 화면까지. 학년 선택 옵션. */
export async function signupAsStudent(page: Page, email = uniqueEmail(), grade?: 'E4' | 'E5' | 'E6' | 'M1' | 'M2' | 'M3' | 'H1' | 'H2' | 'H3'): Promise<string> {
  await page.goto('/signup');
  await page.getByTestId('name').fill('E2E학생');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill('password123!');
  if (grade) await page.getByTestId(`grade-${grade}`).click();
  for (const id of ['tos', 'privacy', 'academic', 'ai', 'age']) {
    await page.getByTestId(`consent-${id}`).check();
  }
  await page.getByTestId('submit').click();
  await expect(page.getByTestId('stagebar')).toBeVisible({ timeout: 20_000 });
  return email;
}

/** 상담 메시지 1개 보내고 AI 응답 스트리밍이 끝날 때까지 대기 */
export async function sendMessage(page: Page, text: string): Promise<void> {
  await page.getByTestId('chat-input').fill(text);
  await page.getByTestId('chat-send').click();
  // 스트리밍 완료 = composer data-streaming="false" + 마지막 AI 메시지에 텍스트
  await expect(page.getByTestId('composer')).toHaveAttribute('data-streaming', 'false', { timeout: 45_000 });
  await expect
    .poll(async () => (await page.getByTestId('msg-ai').last().innerText()).trim().length, { timeout: 5_000 })
    .toBeGreaterThan(3);
}
