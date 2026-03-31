import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

// TC-01: Menu Loading
test.describe('TC-01: Menu Loading', () => {
  test('renders pizza items from the API', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    const count = await pizzaPage.menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each item shows name, description, image, and quantity controls', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    const names = await pizzaPage.getMenuItemNames();
    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
      const item = pizzaPage.menuItemByName(name);
      await expect(item).toBeVisible();
      await expect(item.locator('h3')).toHaveText(name);
      await expect(item.locator('p')).not.toBeEmpty();
      await expect(item.locator('img')).toBeVisible();
      await expect(item.locator('.quantity-controls')).toBeVisible();
      await expect(item.getByRole('button', { name: '+' })).toBeVisible();
      await expect(item.getByRole('button', { name: '−' })).toBeVisible();
    }
  });

  test('all item quantities start at 0', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    const count = await pizzaPage.menuItems.count();
    for (let i = 0; i < count; i++) {
      await expect(pizzaPage.quantityDisplay(i)).toHaveText('0');
    }
  });
});
