import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main routes', async ({ page }) => {
    const routes = ['/demo', '/email', '/gcs', '/jobs', '/links'];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`.*${route.slice(1)}.*`));
    }
  });

  test('sidebar navigation should have all items', async ({ page }) => {
    await page.goto('/os');
    
    const navItems = ['Calendar', 'Email', 'Legal', 'GC Network', 'Jobs', 'Links', 'Demo'];
    for (const item of navItems) {
      await expect(page.getByRole('link', { name: item })).toBeVisible();
    }
  });

  test('demo page should have video placeholder', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByText('See How It Works')).toBeVisible();
  });

  test('email page should have sidebar tabs', async ({ page }) => {
    await page.goto('/email');
    await expect(page.getByText('Primary')).toBeVisible();
    await expect(page.getByText('Reminders')).toBeVisible();
  });

  test('gcs page should have table', async ({ page }) => {
    await page.goto('/gcs');
    await expect(page.getByText('GC Directory')).toBeVisible();
  });

  test('jobs page should have kanban columns', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.getByText('Lead')).toBeVisible();
    await expect(page.getByText('Contract')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
  });
});
