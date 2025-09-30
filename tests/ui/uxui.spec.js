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

test('Club card details displayed when clicking on the information icon', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/clubs');

  const infoIcon = page.locator('svg.lucide-info').first();
  await infoIcon.click();

  const clubDetails = page.getByTestId('HoverCard');
  await expect(clubDetails).toBeVisible();
});

test('Carousel auto-slide', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/');

  let activeSlide = page.locator('.slick-slide.slick-active img').first();
  await expect(activeSlide).toHaveAttribute('alt', /Slide 1/);

  await page.waitForTimeout(6500);

  activeSlide = page.locator('.slick-slide.slick-active img').first();
  await expect(activeSlide).toHaveAttribute('alt', /Slide 2/);

  await page.waitForTimeout(6500);
  activeSlide = page.locator('.slick-slide.slick-active img').first();
  await expect(activeSlide).toHaveAttribute('alt', /Slide 3/);
});
