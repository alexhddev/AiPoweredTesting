import { test, expect } from '@playwright/test';

test.describe('Order Placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

  test('Place Order button is disabled with empty cart', async ({ page }) => {
    await expect(page.locator('#place-order-btn')).toBeDisabled();
  });

  test('Place Order button is disabled when cart has items but no customer name', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();

    await expect(page.locator('#place-order-btn')).toBeDisabled();
  });

  test('Place Order button is disabled when name is filled but cart is empty', async ({ page }) => {
    await page.locator('#customer-name').fill('Alex');

    await expect(page.locator('#place-order-btn')).toBeDisabled();
  });

  test('Place Order button enables when cart has items and name is provided', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.locator('#customer-name').fill('Alex');

    await expect(page.locator('#place-order-btn')).toBeEnabled();
  });

  test('successful order submission shows confirmation with order ID', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.locator('#customer-name').fill('Alex');

    await page.locator('#place-order-btn').click();

    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Order placed successfully!');
    await expect(notification).toContainText('Order ID:');
  });

  test('cart clears after placing order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.locator('#customer-name').fill('Alex');

    await expect(page.locator('#total-items')).toHaveText('1');

    await page.locator('#place-order-btn').click();

    await expect(page.locator('#notification')).toBeVisible();
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('#total-items')).toHaveText('0');
    await expect(page.locator('#customer-name')).toHaveValue('');
  });

  test('order ID is returned and displayed after successful order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.locator('#customer-name').fill('Alex');

    await page.locator('#place-order-btn').click();

    await expect(page.locator('#notification')).toBeVisible();

    // Order ID input should be auto-populated with the new order ID
    const orderIdInput = page.locator('#order-id');
    await expect(orderIdInput).not.toHaveValue('');

    // Order details section should become visible with order info
    const orderDetails = page.locator('#order-details');
    await expect(orderDetails).toBeVisible();
    await expect(orderDetails.locator('.order-info-value').first()).not.toBeEmpty();
  });
});
