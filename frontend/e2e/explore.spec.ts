import { expect, test } from '@playwright/test';
import { signupAsStudent } from './helpers';

test.describe('탐색(봉사·자료·해외대학) + 학년별', () => {
  test('학년 선택 후 가입 → 진로자료/해외대학 탐색', async ({ page }) => {
    await signupAsStudent(page, undefined, 'H2'); // 고2
    await page.getByTestId('tab-explore').click();
    await expect(page.getByTestId('explore')).toBeVisible();
    // 진로자료 탭 (기본)
    await expect(page.getByTestId('explore-tab-material')).toHaveClass(/active/);

    // 해외대학 탭 — 미국 기본
    await page.getByTestId('explore-tab-foreign').click();
    await expect(page.getByTestId('country-US')).toHaveClass(/brand/);

    // 다른 국가로 전환
    await page.getByTestId('country-JP').click();
    await expect(page.getByTestId('country-JP')).toHaveClass(/brand/);
  });

  test('봉사·체험 메뉴 — 검색·지역 필터·입시 안내 카드', async ({ page }) => {
    await signupAsStudent(page, undefined, 'H1');
    await page.getByTestId('tab-volunteers').click();
    await expect(page.getByTestId('admission-tip')).toBeVisible();
    // 지역 필터
    await page.getByTestId('region-인천').click();
    await page.waitForTimeout(500);
    // 키워드 검색
    await page.getByTestId('volunteer-search').fill('복지');
    await page.getByTestId('volunteer-search-btn').click();
    // 봉사 결과 또는 empty state 중 하나는 보여야 함 (크래시 없음)
    await expect(page.getByTestId('volunteer-row').first().or(page.getByTestId('empty'))).toBeVisible({ timeout: 10_000 });
  });

  test('가입 시 학년 미선택도 진행 가능', async ({ page }) => {
    await signupAsStudent(page); // grade undefined
    await expect(page.getByTestId('stagebar')).toBeVisible();
  });
});
