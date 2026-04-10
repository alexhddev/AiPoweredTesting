import { test, expect } from '@playwright/test';

test.describe('Order Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

  test('look up a valid order ID returns order details', async ({ page }) => {
    // Place an order first to get a valid order ID
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.locator('#customer-name').fill('Jane Doe');
    await page.locator('#place-order-btn').click();

    // Wait for the order to be placed and the ID to be populated
    await expect(page.locator('#notification')).toContainText('Order placed successfully!');
    const orderId = await page.locator('#order-id').inputValue();
    expect(orderId).toBeTruthy();

    // Look up the order
    await page.locator('#lookup-order-btn').click();

    // Order details should be visible
    const orderDetails = page.locator('#order-details');
    await expect(orderDetails).toBeVisible();

    // Should display the correct order ID and customer name
    await expect(orderDetails).toContainText(orderId);
    await expect(orderDetails).toContainText('Jane Doe');
  });

  test('look up an invalid order ID shows not-found error', async ({ page }) => {
    await page.locator('#order-id').fill('INVALID-ORDER-ID');
    await page.locator('#lookup-order-btn').click();

    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Order not found');
  });

  test('empty order ID field shows validation message', async ({ page }) => {
    await page.locator('#lookup-order-btn').click();

    const notification = page.locator('#notification');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('Please enter an order ID');
  });
});
