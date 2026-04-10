import { test, expect } from '@playwright/test';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

  test('page loads with 5 pizza items', async ({ page }) => {
    const menuItems = page.locator('.menu-item');
    await expect(menuItems).toHaveCount(5);

    // Each item should have a visible h3 heading
    const headings = menuItems.locator('h3');
    await expect(headings).toHaveCount(5);
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible();
      await expect(heading).not.toBeEmpty();
    }

    // Each item should have an image
    await expect(page.locator('.menu-item img')).toHaveCount(5);
  });

  test('cart is initially empty', async ({ page }) => {
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator('#total-items')).toHaveText('0');
  });

  test('increment quantity increases item count', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const incrementBtn = firstItem.getByRole('button', { name: '+' });
    const quantityDisplay = firstItem.locator('.quantity-display');

    await expect(quantityDisplay).toHaveText('0');
    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
  });

  test('decrement at zero has no effect', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const decrementBtn = firstItem.getByRole('button', { name: '−' });
    const quantityDisplay = firstItem.locator('.quantity-display');

    await expect(quantityDisplay).toHaveText('0');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('increment then decrement returns count to zero', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const incrementBtn = firstItem.getByRole('button', { name: '+' });
    const decrementBtn = firstItem.getByRole('button', { name: '−' });
    const quantityDisplay = firstItem.locator('.quantity-display');

    await expect(quantityDisplay).toHaveText('0');
    await incrementBtn.click();
    await expect(quantityDisplay).toHaveText('1');
    await decrementBtn.click();
    await expect(quantityDisplay).toHaveText('0');
  });

  test('cart total reflects added quantities', async ({ page }) => {
    const firstItem = page.locator('.menu-item').first();
    const secondItem = page.locator('.menu-item').nth(1);

    await firstItem.getByRole('button', { name: '+' }).click();
    await firstItem.getByRole('button', { name: '+' }).click();
    await secondItem.getByRole('button', { name: '+' }).click();

    await expect(page.locator('#total-items')).toHaveText('3');
    await expect(page.locator('.empty-cart')).not.toBeVisible();
  });
});
