import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

async function placeTestOrder(pizzaPage: PizzaPage): Promise<string> {
  await pizzaPage.goto();
  await pizzaPage.addToCart('Margherita Pizza');
  await pizzaPage.placeOrder('Alice');
  await expect(pizzaPage.orderDetails).toBeVisible();
  return pizzaPage.orderIdInput.inputValue();
}

// TC-09: Order Lookup — Valid ID
test.describe('TC-09: Order Lookup — Valid ID', () => {
  test('looking up a valid order shows order details', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    const orderId = await placeTestOrder(pizzaPage);

    await pizzaPage.orderIdInput.fill('');
    await pizzaPage.lookupOrder(orderId);

    await expect(pizzaPage.orderDetails).toBeVisible();
    await expect(pizzaPage.orderDetails).toContainText(orderId);
    await expect(pizzaPage.orderDetails).toContainText('Alice');
    await expect(pizzaPage.orderDetails).toContainText('RECEIVED');
    await expect(pizzaPage.orderDetails).toContainText('Margherita Pizza');
  });
});

// TC-10: Order Lookup — Invalid ID
test.describe('TC-10: Order Lookup — Invalid ID', () => {
  test('looking up a non-existent order shows error notification', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.lookupOrder('nonexistent-id');

    await expect(pizzaPage.notification).toBeVisible();
    await expect(pizzaPage.orderDetails).not.toBeVisible();
  });
});

// TC-11: Order Lookup via Enter Key
test.describe('TC-11: Order Lookup via Enter Key', () => {
  test('pressing Enter in the ID field triggers lookup', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    const orderId = await placeTestOrder(pizzaPage);

    await pizzaPage.orderIdInput.fill(orderId);
    await pizzaPage.orderIdInput.press('Enter');

    await expect(pizzaPage.orderDetails).toBeVisible();
    await expect(pizzaPage.orderDetails).toContainText(orderId);
  });
});
