import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('signup page should be accessible', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('login link should work from landing', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.getByRole('link', { name: /log in/i });
    await expect(loginLink).toBeVisible();
  });
});
