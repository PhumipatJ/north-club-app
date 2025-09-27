import { test, expect } from '@playwright/test';

// ---------------------
// Functional Testing (10 cases)
// ---------------------

test('Verify login with a valid username and password', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/login');
  await page.getByLabel('Enter Username').fill('s6604062600001@email.kmutnb.ac.th');
  await page.getByLabel('Enter Password').fill('password');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('https://north-club-app.vercel.app/');
});

test('Verify login with a invalid username but use valid password', async ({ page }) => {
  await page.goto('https://north-club-app.vercel.app/login');
  await page.getByLabel('Enter Username').fill('s6604062600001email.kmutnb.ac.th'); // wrong username (no @)
  await page.getByLabel('Enter Password').fill('password');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('https://north-club-app.vercel.app/login');
  await expect(page.locator('p.text-red-500')).toContainText(/Invalid login credentials/); 
});

test('Verify login with a valid username but invalid password', async ({page}) => {
  await page.goto('https://north-club-app.vercel.app/login');
  await page.getByLabel('Enter Username').fill('s6604062600001@email.kmutnb.ac.th'); 
  await page.getByLabel('Enter Password').fill('pASSword');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('https://north-club-app.vercel.app/login');
  await expect(page.locator('p.text-red-500')).toContainText(/Invalid login credentials/); 
});

test('Verify login with a invalid username and password', async ({page}) => {
  await page.goto('https://north-club-app.vercel.app/login');
  await page.getByLabel('Enter Username').fill('s6604062600001@email.kmutnb.ac.th'); 
  await page.getByLabel('Enter Password').fill('pASSword');
  await page.click('button[type=submit]');

  await expect(page).toHaveURL('https://north-club-app.vercel.app/login');
  await expect(page.locator('p.text-red-500')).toContainText(/Invalid login credentials/); 
});

test('User is able to log out successfully', async ({ page }) => {
    await page.goto('https://north-club-app.vercel.app/login');
    await page.getByLabel('Enter Username').fill('s6604062600001@email.kmutnb.ac.th');
    await page.getByLabel('Enter Password').fill('password');
    await page.click('button[type=submit]');
    
    await expect(page).toHaveURL('https://north-club-app.vercel.app/');

    await page.getByRole('button', { name: 'Profile' }).click();
    await page.getByRole('button', { name: /ออกจากระบบ/i }).click();

    await expect(page).toHaveURL('https://north-club-app.vercel.app/login');
});