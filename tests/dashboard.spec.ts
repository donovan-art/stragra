import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('dashboard should be accessible', async ({ page }) => {
    await page.goto('/os');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should display stats', async ({ page }) => {
    await page.goto('/os');
    await expect(page.getByText('Active Jobs')).toBeVisible();
    await expect(page.getByText('Pending Payments')).toBeVisible();
    await expect(page.getByText('GCs in Network')).toBeVisible();
    await expect(page.getByText('Lien Deadlines')).toBeVisible();
  });

  test('voice UI should be visible', async ({ page }) => {
    await page.goto('/os');
    await expect(page.getByText(/hold spacebar to speak/i)).toBeVisible();
  });

  test('quick actions should be present', async ({ page }) => {
    await page.goto('/os');
    await expect(page.getByRole('link', { name: 'New Job' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Send Invoice' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add GC' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'File Lien' })).toBeVisible();
  });
});
