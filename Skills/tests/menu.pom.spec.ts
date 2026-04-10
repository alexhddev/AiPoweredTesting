import { test, expect } from '@playwright/test';
import { MenuPage } from './pages/menu.page';

test.describe('Menu', () => {
  let menuPage: MenuPage;

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page);
    await menuPage.goto();
  });

  test('page loads with 5 pizza items', async () => {
    await expect(menuPage.menuItems).toHaveCount(5);

    // Each item should have a visible h3 heading
    const headings = menuPage.menuItems.locator('h3');
    await expect(headings).toHaveCount(5);
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible();
      await expect(heading).not.toBeEmpty();
    }

    // Each item should have an image
    await expect(menuPage.menuItems.locator('img')).toHaveCount(5);
  });

  test('cart is initially empty', async () => {
    await expect(menuPage.cartEmptyText).toBeVisible();
    await expect(menuPage.totalItems).toHaveText('0');
  });

  test('increment quantity increases item count', async () => {
    const firstItem = menuPage.getMenuItem(0);
    const incrementBtn = menuPage.getIncrementButton(firstItem);
    const quantityDisplay = menuPage.getQuantityDisplay(firstItem);

    await expect(quantityDisplay).toHaveText('0');
    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
  });

  test('decrement at zero has no effect', async () => {
    const firstItem = menuPage.getMenuItem(0);
    const decrementBtn = menuPage.getDecrementButton(firstItem);
    const quantityDisplay = menuPage.getQuantityDisplay(firstItem);

    await expect(quantityDisplay).toHaveText('0');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('increment then decrement returns count to zero', async () => {
    const firstItem = menuPage.getMenuItem(0);
    const incrementBtn = menuPage.getIncrementButton(firstItem);
    const decrementBtn = menuPage.getDecrementButton(firstItem);
    const quantityDisplay = menuPage.getQuantityDisplay(firstItem);

    await expect(quantityDisplay).toHaveText('0');
    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('cart total reflects added quantities', async () => {
    const firstItem = menuPage.getMenuItem(0);
    const secondItem = menuPage.getMenuItem(1);

    await menuPage.getIncrementButton(firstItem).click();
    await menuPage.getIncrementButton(firstItem).click();
    await menuPage.getIncrementButton(secondItem).click();

    await expect(menuPage.totalItems).toHaveText('3');
    await expect(menuPage.emptyCart).not.toBeVisible();
  });
});
