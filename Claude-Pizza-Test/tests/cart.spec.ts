import { test, expect } from '@playwright/test';
import { PizzaPage } from './pages/PizzaPage';

// TC-02: Adding Items to Cart
test.describe('TC-02: Adding Items to Cart', () => {
  test('increment updates quantity display and cart', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza');

    await expect(pizzaPage.menuItemByName('Margherita Pizza').locator('.quantity-display')).toHaveText('1');
    await expect(pizzaPage.cartItemRow('Margherita Pizza')).toBeVisible();
    await expect(pizzaPage.cartItemRow('Margherita Pizza')).toContainText('1');
    await expect(pizzaPage.totalItems).toHaveText('1');
  });
});

// TC-03: Reducing Item Quantity to Zero Removes from Cart
test.describe('TC-03: Reducing Item Quantity to Zero Removes from Cart', () => {
  test('decrement to zero removes item from cart', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza');
    await pizzaPage.decrementBtn('Margherita Pizza').click();

    await expect(pizzaPage.cartItemRow('Margherita Pizza')).not.toBeVisible();
    await expect(pizzaPage.totalItems).toHaveText('0');
  });
});

// TC-04: Remove Button in Cart
test.describe('TC-04: Remove Button in Cart', () => {
  test('Remove button deletes item and resets menu quantity', async ({ page }) => {
    const pizzaPage = new PizzaPage(page);
    await pizzaPage.goto();

    await pizzaPage.addToCart('Margherita Pizza');
    await pizzaPage.removeBtn('Margherita Pizza').click();

    await expect(pizzaPage.cartItemRow('Margherita Pizza')).not.toBeVisible();

    const names = await pizzaPage.getMenuItemNames();
    const margheritaIndex = names.indexOf('Margherita Pizza');
    await expect(pizzaPage.quantityDisplay(margheritaIndex)).toHaveText('0');
  });
});
