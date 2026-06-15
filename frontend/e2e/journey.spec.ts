import { expect, test } from '@playwright/test';
import { sendMessage, signupAsStudent, uniqueEmail } from './helpers';

// 정상 사용자 여정 — 가입 → 단계별 AI 상담 → 입시 조회 → 리포트
test.describe('핵심 사용자 여정', () => {
  test('가입 → AI 상담(단계 진행) → 리포트', async ({ page }) => {
    await signupAsStudent(page);

    // 1번째 메시지: explore 단계여야 한다
    await expect(page.getByTestId('stage-explore')).toHaveClass(/active/);
    await sendMessage(page, '안녕하세요, 진로가 고민이에요');

    // 단서가 쌓이도록 흥미·강점·가치·맥락을 담은 대화 5회
    for (const t of [
      '영상 편집이 정말 재밌고 유튜브에 올려요',
      '친구들이 제 편집을 칭찬해줘요. 컷 편집을 잘해요',
      '사람들에게 도움이 되는 콘텐츠가 중요해요',
      '동아리에서 영상 작업에 몰입했어요',
      '영화 같은 분위기를 만드는 게 좋아요',
    ]) {
      await sendMessage(page, t);
    }

    // 단계가 explore에서 진행됐는지 (profile/recommend/prepare 중 하나가 active)
    const advanced = await page.evaluate(() => {
      const active = document.querySelector('.stagebar .step.active');
      return active?.textContent ?? '';
    });
    expect(advanced).not.toContain('탐색');

    // 리포트 버튼 노출 → 클릭 → 리포트 렌더
    await expect(page.getByTestId('goto-report')).toBeVisible({ timeout: 10_000 });
    await page.getByTestId('goto-report').click();
    await expect(page.getByTestId('report')).toBeVisible({ timeout: 60_000 });
    const reportText = await page.getByTestId('report').innerText();
    expect(reportText).not.toContain('<state>'); // 누수 없음
    expect(reportText).not.toContain('상담 단계 안내');
  });

  test('입시 조회 — 대학 검색 → 학과 + 경쟁률', async ({ page }) => {
    await signupAsStudent(page);
    await page.getByTestId('tab-admissions').click();
    await page.getByTestId('uni-search').fill('서울대');
    await page.getByTestId('uni-search').press('Enter');
    await expect(page.getByTestId('uni-row').first()).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('uni-row').first().click();

    // 학과 목록이 뜨고, 경쟁률(confirmed) 또는 준비중(unavailable) 둘 중 하나는 표시
    await expect(page.getByTestId('dept-row').first()).toBeVisible({ timeout: 15_000 });
    const hasStats = await page.getByTestId('admission-stats').count();
    const hasUnavail = await page.getByTestId('admission-unavailable').count();
    expect(hasStats + hasUnavail).toBeGreaterThan(0);

    // track 필터 동작
    await page.getByTestId('track-자연').click();
    await expect(page.getByTestId('dept-row').first()).toBeVisible();
  });

  test('로그아웃 → 보호 경로 접근 시 로그인으로', async ({ page }) => {
    await signupAsStudent(page);
    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/admissions');
    await expect(page).toHaveURL(/\/login/); // 미인증 → 로그인 리다이렉트
  });

  test('로그인 — 가입한 계정으로 재로그인', async ({ page }) => {
    const email = uniqueEmail();
    await signupAsStudent(page, email);
    await page.getByTestId('logout').click();
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill('password123!');
    await page.getByTestId('submit').click();
    await expect(page.getByTestId('stagebar')).toBeVisible({ timeout: 15_000 });
  });
});
