import { expect, test } from '@playwright/test';
import { signupAsStudent, uniqueEmail } from './helpers';

// 이상행동(적대적) — 사용자가 무슨 짓을 해도 프론트가 깨지지 않고, 백엔드가 표준 에러로 막는지.
test.describe('적대적 / 이상행동', () => {
  test('잘못된 로그인 — 틀린 비번/없는 계정 → 친절한 에러, 크래시 없음', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('nobody@test.kr');
    await page.getByTestId('password').fill('wrongpassword');
    await page.getByTestId('submit').click();
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL(/\/login/); // 진입 안 됨
  });

  test('가입 퍼징 — 잘못된 이메일은 브라우저가 차단, 짧은 비번은 백엔드가 차단', async ({ page }) => {
    await page.goto('/signup');
    // 1) 잘못된 이메일 — <input type=email> 네이티브 검증이 제출 자체를 막는다(클라 차단)
    await page.getByTestId('name').fill('<script>alert(1)</script>');
    await page.getByTestId('email').fill('not-an-email');
    await page.getByTestId('password').fill('password123!');
    for (const id of ['tos', 'privacy', 'academic', 'ai', 'age']) await page.getByTestId(`consent-${id}`).check();
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/signup/); // 진입 안 됨
    // 2) 형식상 유효한 이메일 + 짧은 비번 → 백엔드 400 표준 에러
    await page.getByTestId('email').fill(`fuzz-${Date.now()}@test.kr`);
    await page.getByTestId('password').fill('123');
    await page.getByTestId('submit').click();
    await expect(page.getByTestId('error')).toBeVisible({ timeout: 10_000 });
    expect(await page.title()).toContain('진로나침반'); // XSS 미실행, 살아있음
  });

  test('필수 동의 누락 시 제출 불가', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('name').fill('테스트');
    await page.getByTestId('email').fill(uniqueEmail());
    await page.getByTestId('password').fill('password123!');
    await page.getByTestId('consent-tos').check(); // 일부만
    await expect(page.getByTestId('submit')).toBeDisabled();
  });

  test('상담 인젝션/특수문자 입력 → 일반 텍스트로 처리, 누수·크래시 없음', async ({ page }) => {
    await signupAsStudent(page);
    const payloads = ["'; DROP TABLE users; --", '{{constructor.constructor("return 1")()}}', '<img src=x onerror=alert(1)>', '🤖'.repeat(40)];
    for (const p of payloads) {
      await page.getByTestId('chat-input').fill(p);
      await page.getByTestId('chat-send').click();
      await expect(page.getByTestId('composer')).toHaveAttribute('data-streaming', 'false', { timeout: 45_000 });
    }
    // AI 응답에 <state>나 단계 안내가 새어나오지 않음
    const chatText = await page.getByTestId('chat').innerText();
    expect(chatText).not.toContain('<state>');
    expect(chatText).not.toContain('상담 단계 안내');
    expect(await page.title()).toContain('진로나침반');
  });

  test('빈/공백 메시지는 전송 불가 (버튼 비활성)', async ({ page }) => {
    await signupAsStudent(page);
    await expect(page.getByTestId('chat-send')).toBeDisabled();
    await page.getByTestId('chat-input').fill('   ');
    await expect(page.getByTestId('chat-send')).toBeDisabled();
  });

  test('빠른 연타 — 전송 중 중복 전송 차단', async ({ page }) => {
    await signupAsStudent(page);
    await page.getByTestId('chat-input').fill('영상 편집이 재밌어요');
    await page.getByTestId('chat-send').click();
    // 스트리밍 동안 입력·전송 모두 비활성 → 중복 전송 불가
    await expect(page.getByTestId('composer')).toHaveAttribute('data-streaming', 'true');
    await expect(page.getByTestId('chat-send')).toBeDisabled();
    await expect(page.getByTestId('chat-input')).toBeDisabled();
    // 완료 후 다시 입력 가능
    await expect(page.getByTestId('composer')).toHaveAttribute('data-streaming', 'false', { timeout: 45_000 });
    await expect(page.getByTestId('chat-input')).toBeEnabled();
  });

  test('증거 부족 상태에서 리포트 직접 접근 → 안내 에러, 크래시 없음', async ({ page }) => {
    await signupAsStudent(page);
    await page.getByTestId('tab-report').click();
    // 단서 0개라 리포트 불가 → 에러 또는 재시도 버튼이 보이고 페이지는 살아있음
    await expect(page.getByTestId('retry-report').or(page.getByTestId('report'))).toBeVisible({ timeout: 30_000 });
    expect(await page.title()).toContain('진로나침반');
  });

  test('존재하지 않는 경로 → 홈으로 리다이렉트', async ({ page }) => {
    await signupAsStudent(page);
    await page.goto('/no/such/route');
    await expect(page.getByTestId('stagebar')).toBeVisible({ timeout: 10_000 });
  });

  test('대학 검색 인젝션/긴 문자열 → 빈 결과 또는 정상, 크래시 없음', async ({ page }) => {
    await signupAsStudent(page);
    await page.getByTestId('tab-admissions').click();
    await page.getByTestId('uni-search').fill("' OR 1=1 --" + 'x'.repeat(300));
    await page.getByTestId('uni-search').press('Enter');
    await page.waitForTimeout(1500);
    expect(await page.title()).toContain('진로나침반'); // 살아있음
  });
});
