import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

async function placeAndLookupOrder(pizzaPage: PizzaPage): Promise<void> {
  await pizzaPage.goto();
  await pizzaPage.addToCart('Margherita Pizza');
  await pizzaPage.placeOrder('Alice');
  await expect(pizzaPage.orderDetails).toBeVisible();
}

// TC-12: Order Status Transition — RECEIVED to DELIVERING
test.describe('TC-12: RECEIVED to DELIVERING', () => {
  test('Mark as Delivering updates status badge and buttons', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await placeAndLookupOrder(pizzaPage);

    await page.getByRole('button', { name: 'Mark as Delivering' }).click();

    await expect(pizzaPage.orderDetails).toContainText('DELIVERING');
    await expect(page.getByRole('button', { name: 'Mark as Delivered' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark as Delivering' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel Order' })).not.toBeVisible();
  });
});

// TC-13: Order Status Transition — DELIVERING to DELIVERED
test.describe('TC-13: DELIVERING to DELIVERED', () => {
  test('Mark as Delivered updates status badge and hides action buttons', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await placeAndLookupOrder(pizzaPage);

    await page.getByRole('button', { name: 'Mark as Delivering' }).click();
    await expect(pizzaPage.orderDetails).toContainText('DELIVERING');

    await page.getByRole('button', { name: 'Mark as Delivered' }).click();

    await expect(pizzaPage.orderDetails).toContainText('DELIVERED');
    await expect(page.getByRole('button', { name: 'Mark as Delivered' })).not.toBeVisible();
  });
});

// TC-14: Order Status Transition — RECEIVED to CANCELED
test.describe('TC-14: RECEIVED to CANCELED', () => {
  test('Cancel Order updates status badge and hides action buttons', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await placeAndLookupOrder(pizzaPage);

    await page.getByRole('button', { name: 'Cancel Order' }).click();

    await expect(pizzaPage.orderDetails).toContainText('CANCELED');
    await expect(page.getByRole('button', { name: 'Cancel Order' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark as Delivering' })).not.toBeVisible();
  });
});
