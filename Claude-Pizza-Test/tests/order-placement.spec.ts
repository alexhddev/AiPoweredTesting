import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

// TC-05: Place Order Button State — Disabled
test.describe('TC-05: Place Order Button State — Disabled', () => {
  test('disabled on page load with empty cart', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await expect(pizzaPage.placeOrderBtn).toBeDisabled();
  });

  test('disabled when name is filled but cart is empty', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.customerNameInput.fill('Alice');

    await expect(pizzaPage.placeOrderBtn).toBeDisabled();
  });

  test('disabled when cart has item but name is empty', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza');

    await expect(pizzaPage.placeOrderBtn).toBeDisabled();
  });
});

// TC-06: Place Order Button State — Enabled
test.describe('TC-06: Place Order Button State — Enabled', () => {
  test('enabled when name and at least one item are present', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.customerNameInput.fill('Alice');
    await pizzaPage.addToCart('Margherita Pizza');

    await expect(pizzaPage.placeOrderBtn).toBeEnabled();
  });
});

// TC-07: Successful Order Placement
test.describe('TC-07: Successful Order Placement', () => {
  test('happy-path order clears cart and shows order details', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Pepperoni Pizza', 2);
    await pizzaPage.placeOrder('Alice');

    await expect(pizzaPage.notification).toBeVisible();
    await expect(pizzaPage.notification).toContainText('Order placed successfully');

    await expect(pizzaPage.customerNameInput).toBeEmpty();
    await expect(pizzaPage.placeOrderBtn).toBeDisabled();
    await expect(pizzaPage.totalItems).toHaveText('0');

    await expect(pizzaPage.orderDetails).toBeVisible();
    await expect(pizzaPage.orderDetails).toContainText('RECEIVED');
    await expect(pizzaPage.orderDetails).toContainText('Alice');
  });
});

// TC-08: Order Placement with Multiple Items
test.describe('TC-08: Order Placement with Multiple Items', () => {
  test('order with multiple pizza types shows all items', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza', 1);
    await pizzaPage.addToCart('BBQ Chicken Pizza', 2);
    await pizzaPage.placeOrder('Bob');

    await expect(pizzaPage.orderDetails).toBeVisible();
    await expect(pizzaPage.orderDetails).toContainText('Margherita Pizza');
    await expect(pizzaPage.orderDetails).toContainText('BBQ Chicken Pizza');
  });
});
