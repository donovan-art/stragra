import { test, expect } from '@playwright/test';

test.describe('Critical Deployment Tests', () => {
  test('landing page loads with login CTA', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);
    
    await expect(page.getByRole('heading', { name: 'subStragra' })).toBeVisible();
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible();
  });

  test('login link navigates correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: /log in/i }).click();
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('dashboard is accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/os');
    expect(response?.status()).toBe(200);
    
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Active Jobs')).toBeVisible();
    await expect(page.getByText('Pending Payments')).toBeVisible();
    await expect(page.getByText('GCs in Network')).toBeVisible();
    await expect(page.getByText('Lien Deadlines')).toBeVisible();
  });

  test('all main routes are accessible', async ({ page }) => {
    const routes = [
      { path: '/', shouldHave: 'subStragra' },
      { path: '/demo', shouldHave: 'See How It Works' },
      { path: '/email', shouldHave: 'Primary' },
      { path: '/gcs', shouldHave: 'GC Directory' },
      { path: '/jobs', shouldHave: 'Lead' },
      { path: '/links', shouldHave: 'Resource Links' },
      { path: '/os', shouldHave: 'Dashboard' },
    ];
    
    for (const route of routes) {
      const response = await page.goto(`http://localhost:3000${route.path}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByText(route.shouldHave).first()).toBeVisible();
    }
  });
});
