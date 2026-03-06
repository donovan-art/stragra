import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('complete auth journey - landing to dashboard', async ({ page }) => {
    // Step 1: Landing page has Login CTA
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'subStragra' })).toBeVisible();
    
    const loginLink = page.getByRole('link', { name: /log in/i });
    await expect(loginLink).toBeVisible();
    
    // Step 2: Click goes to /login
    await loginLink.click();
    await expect(page).toHaveURL(/.*login.*/);
    
    // Step 3: Login form exists
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Step 4: Fill in credentials and submit (mock auth)
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Step 5: Dashboard loads after successful auth
    await expect(page).toHaveURL('http://localhost:3000/os');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
    // Verify dashboard has expected elements
    await expect(page.getByText('Active Jobs')).toBeVisible();
    await expect(page.getByText('Hold spacebar to speak')).toBeVisible();
  });
  
  test('landing page login CTA is clickable and navigates', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    const loginLink = page.getByRole('link', { name: /log in/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
    
    await loginLink.click();
    await expect(page).toHaveURL(/.*login.*/);
  });
});
