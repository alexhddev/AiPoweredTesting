import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for menu items to be loaded from the API
    await page.waitForSelector('.menu-item');
  });

  test('page loads with 5 pizza items', async ({ page }) => {
    await expect(page.locator('.menu-item')).toHaveCount(5);

    const expectedNames = [
      'Margherita Pizza',
      'Pepperoni Pizza',
      'Quattro Stagioni',
      'Vegetarian Delight',
      'BBQ Chicken Pizza',
    ];

    for (const name of expectedNames) {
      await expect(page.getByRole('heading', { name, level: 3 })).toBeVisible();
    }

    // Each item should have an image
    await expect(page.locator('.menu-item img')).toHaveCount(5);
  });

  test('cart is initially empty', async ({ page }) => {
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('.empty-cart')).toHaveText('Your cart is empty');
    await expect(page.locator('#total-items')).toHaveText('0');
  });

  test('increment quantity increases item count', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const incrementBtn = firstItem.locator('.quantity-btn').last();
    const quantityDisplay = firstItem.locator('.quantity-display');

    await expect(quantityDisplay).toHaveText('0');
    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
  });

  test('decrement at zero has no effect', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const decrementBtn = firstItem.locator('.quantity-btn').first();
    const quantityDisplay = firstItem.locator('.quantity-display');

    await expect(quantityDisplay).toHaveText('0');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('increment then decrement returns count to zero', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const incrementBtn = firstItem.locator('.quantity-btn').last();
    const decrementBtn = firstItem.locator('.quantity-btn').first();
    const quantityDisplay = firstItem.locator('.quantity-display');

    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('cart total reflects added quantities', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const secondItem = page.locator('.menu-item').nth(1);

    await firstItem.locator('.quantity-btn').last().click();
    await firstItem.locator('.quantity-btn').last().click();
    await secondItem.locator('.quantity-btn').last().click();

    await expect(page.locator('#total-items')).toHaveText('3');
    await expect(page.locator('.empty-cart')).not.toBeVisible();
  });
});
