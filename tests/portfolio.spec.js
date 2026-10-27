import { test, expect } from '@playwright/test';

test('presents the four sections and the current role without runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('I research, build, and teach how people and AI work together.');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(['Research', 'Projects', 'Teaching', 'Activities', 'Contact']);
  for (const id of ['research', 'projects', 'teaching', 'activities']) await expect(page.locator(`section#${id}`)).toBeVisible();
  await expect(page.locator('.contents li')).toHaveCount(4);

  await expect(page.getByRole('heading', { name: 'Code Weaver', exact: true })).toBeVisible();
  await expect(page.locator('.weave-map .status')).toHaveText(['Launching soon', 'Launching soon']);
  await expect(page.locator('.weave-map h4')).toHaveText(['NCS Interface', 'SWITCHBOARD', 'ASSEMBLY', 'ATELIER']);
  await expect(page.locator('[data-project]')).toHaveCount(4);

  await expect(page.locator('.course .row-meta')).toHaveText(['Company N', 'Company H', 'Company P']);
  await expect(page.locator('.org-role')).toHaveText('CTO & Lead Developer');
  await expect(page.locator('.org')).toHaveAttribute('href', 'https://hwaljalab.com');
  await expect(page.locator('.org')).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('heading', { name: 'Student Startup Teams 300+ (U300+)', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'DGIST', exact: true })).toBeVisible();
  await expect(page.locator('.publication')).toHaveCount(2);
  expect(await page.evaluate(() => document.fonts.check('650 32px Hahmlet', '활자랩'))).toBe(true);
  expect(errors).toEqual([]);
});

test('switches languages and remembers the chosen language after reloading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'KO', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('사람과 AI가 함께 일하는 방식을 연구하고, 만들고, 가르칩니다.');
  await expect(page.locator('.org-role')).toHaveText('CTO 겸 메인 개발자');
  await expect(page.locator('.course .row-meta')).toHaveText(['N사', 'H사', 'P사']);
  await expect(page.locator('.weave-map .status').first()).toHaveText('서비스 예정');
  await expect(page.locator('.translation').first()).toBeHidden();
  await expect(page.getByRole('button', { name: 'KO', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page).toHaveTitle(/김태훈/);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.translation').first()).toBeVisible();
});

test('all project details open, close with Escape, and return keyboard focus', async ({ page }) => {
  await page.goto('/');
  const controls = page.locator('[data-project]');
  for (let index = 0; index < 4; index++) {
    const control = controls.nth(index);
    await control.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#dialog-title')).not.toBeEmpty();
    await expect(page.locator('#dialog-facts')).toContainText(/202[234]/);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(control).toBeFocused();
  }
  await page.getByRole('button', { name: 'KO', exact: true }).click();
  await page.getByRole('button', { name: 'RAG 종합보고서 시스템 자세히 보기', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('2024년 2월 – 9월');
  await page.getByRole('button', { name: '프로젝트 상세 닫기', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mobile menu navigates, closes, and supports Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu', exact: true });
  await menu.click();
  const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole('link', { name: 'Teaching', exact: true }).click();
  await expect(page).toHaveURL(/#teaching$/);
  await expect(mobileNav).not.toBeVisible();
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});

test('downloads the original PDF, expands the archive, and copies the email', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download CV', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Taehun-Kim-CV.pdf');
  expect(await download.failure()).toBeNull();
  const pdf = await page.request.get('/files/taehun-kim-cv.pdf');
  expect(pdf.ok()).toBeTruthy();
  const bytes = await pdf.body();
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  expect(bytes.length).toBe(59723);
  await page.getByText('Six more projects', { exact: true }).click();
  await expect(page.getByText('Discord Python Debugger', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy email address', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Email address copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('raflereak@gmail.com');
});

for (const width of [320, 390, 620, 768, 1024, 1440, 1920]) {
  test(`English and Korean fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const language of ['EN', 'KO']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      const dimensions = await page.evaluate(() => {
        const heading = document.querySelector('h1').getBoundingClientRect();
        return { page: document.documentElement.scrollWidth, viewport: innerWidth, headingRight: heading.right };
      });
      expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.headingRight).toBeLessThanOrEqual(dimensions.viewport);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });
}
