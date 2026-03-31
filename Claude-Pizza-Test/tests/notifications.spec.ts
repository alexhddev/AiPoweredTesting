import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

// TC-15: Notification Auto-Dismiss
test.describe('TC-15: Notification Auto-Dismiss', () => {
  test('success notification appears then auto-dismisses', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza');
    await pizzaPage.placeOrder('Alice');

    await expect(pizzaPage.notification).toBeVisible();
    await expect(pizzaPage.notification).toHaveCount(1);

    await expect(pizzaPage.notification).not.toHaveClass(/\bshow\b/, { timeout: 5000 });
  });

  test('error notification appears then auto-dismisses', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.lookupOrder('nonexistent-id');

    await expect(pizzaPage.notification).toBeVisible();
    await expect(pizzaPage.notification).not.toHaveClass(/\bshow\b/, { timeout: 5000 });
  });
});
