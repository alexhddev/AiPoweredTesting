import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

// TC-16: Theme Toggle — Light to Dark
test.describe('TC-16: Theme Toggle — Light to Dark', () => {
  test('clicking moon button sets dark theme and changes icon', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.themeToggle.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(pizzaPage.themeToggle).toContainText('☀️');
  });
});

// TC-17: Theme Toggle — Dark to Light
test.describe('TC-17: Theme Toggle — Dark to Light', () => {
  test('clicking sun button removes dark theme and restores moon icon', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await pizzaPage.themeToggle.click();

    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
    await expect(pizzaPage.themeToggle).toContainText('🌙');
  });
});

// TC-18: Theme Persistence Across Page Reloads
test.describe('TC-18: Theme Persistence Across Page Reloads', () => {
  test('dark mode preference persists after page reload', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
