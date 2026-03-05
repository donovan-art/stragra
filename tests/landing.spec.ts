import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'subStragra' })).toBeVisible();
    await expect(page.getByText('Never lose retainage again')).toBeVisible();
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    // Hero section has Get Started and Watch Demo buttons
    await expect(page.locator('.container').getByRole('link', { name: /get started/i })).toBeVisible();
    await expect(page.locator('.container').getByRole('link', { name: /watch demo/i })).toBeVisible();
  });

  test('dual column scroller should be visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('The Problem → Our Solution')).toBeVisible();
  });
});
