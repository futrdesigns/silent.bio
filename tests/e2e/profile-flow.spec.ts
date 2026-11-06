import { test, expect } from '@playwright/test';

test.describe('SILENT.BIO User Journeys', () => {
  test('Landing page loads and displays core hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Your identity.')).toBeVisible();
    await expect(page.locator('text=SILENT.BIO')).toBeVisible();
  });

  test('Public profile loads and renders identity card', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('text=@demo')).toBeVisible();
    await expect(page.locator('text=POWERED BY SILENT.BIO')).toBeVisible();
  });

  test('Editor live stage loads with navigation tabs', async ({ page }) => {
    await page.goto('/editor');
    await expect(page.locator('text=Appearance')).toBeVisible();
    await expect(page.locator('text=Themes')).toBeVisible();
  });
});
