import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can toggle to dark theme', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle dark theme' });

    // Initially in light mode
    await expect(toggleButton).toHaveText('🌙');
    await expect(toggleButton).not.toHaveAttribute('class', /active/);

    // Switch to dark mode
    await toggleButton.click();

    await expect(toggleButton).toHaveText('☀️');
    await expect(toggleButton).toHaveClass(/active/);
  });
});
