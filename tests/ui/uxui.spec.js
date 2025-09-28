import { test, expect } from '@playwright/test';

// ---------------------
// UX/UI Testing (4 cases)
// ---------------------

test('Navbar remains visible after scrolling down', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const navbar = page.locator('nav');

  await expect(navbar).toBeVisible();

  await page.click('nav >> text=ชมรม');
  await expect(page).toHaveURL(/.*clubs/);
});

test('Loding Indicator is displayed while fetching data', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/');

  await page.click('nav >> text=สถิติ');

  const loadingOverlay = page.getByTestId('loading-indicator');
  await expect(loadingOverlay).toBeVisible();
  await expect(loadingOverlay).toBeHidden();

  await expect(page).toHaveURL(/.*stats/);

});