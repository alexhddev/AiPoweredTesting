// spec: tests/test-plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Page Load & Layout', () => {
  test('should load the page successfully with all required elements', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Navigate to http://localhost:3000 and wait for network idle
    // (handled by the seed fixture — page is already loaded)
    await page.waitForLoadState('networkidle');

    // 2. Page title is "Awesome Pizza - Order Online"
    await expect(page).toHaveTitle('Awesome Pizza - Order Online');

    // 3. <header> contains the heading "🍕 Awesome Pizza" and subtitle
    await expect(page.getByRole('heading', { name: '🍕 Awesome Pizza', level: 1 })).toBeVisible();
    await expect(page.getByText('Delicious pizzas delivered to your door!')).toBeVisible();

    // 4. Theme-toggle button is visible and shows "🌙"
    const themeToggle = page.getByRole('button', { name: 'Toggle dark theme' });
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveText('🌙');

    // 5. "Today's Menu" section heading is visible
    await expect(page.getByRole('heading', { name: "Today's Menu", level: 2 })).toBeVisible();

    // 6. Five pizza cards are rendered, each with image, name, description, −/+ buttons, and quantity 0
    const pizzaNames = [
      'Margherita Pizza',
      'Pepperoni Pizza',
      'Quattro Stagioni',
      'Vegetarian Delight',
      'BBQ Chicken Pizza',
    ];

    for (const name of pizzaNames) {
      const card = page.locator('.menu-item').filter({ has: page.getByRole('heading', { name, level: 3 }) });
      await expect(card.getByRole('img', { name })).toBeVisible();
      await expect(card.getByRole('heading', { name, level: 3 })).toBeVisible();
      await expect(card.getByRole('button', { name: '−' })).toBeVisible();
      await expect(card.getByRole('button', { name: '+' })).toBeVisible();
      await expect(card.locator('.quantity-display')).toHaveText('0');
    }

    // 7. "Your Order" section: "Your Name:" label, empty input, cart subsection, Place Order button (disabled)
    await expect(page.getByRole('heading', { name: 'Your Order', level: 2 })).toBeVisible();
    const nameInput = page.getByRole('textbox', { name: 'Your Name:' });
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEmpty();
    await expect(page.getByRole('heading', { name: 'Cart', level: 3 })).toBeVisible();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByText('Total Items: 0')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();

    // 8. "Order Management" section: "Order ID:" label, empty input, "Look Up Order" button
    await expect(page.getByRole('heading', { name: 'Order Management', level: 2 })).toBeVisible();
    const orderIdInput = page.getByRole('textbox', { name: 'Order ID:' });
    await expect(orderIdInput).toBeVisible();
    await expect(orderIdInput).toBeEmpty();
    await expect(page.getByRole('button', { name: 'Look Up Order' })).toBeVisible();

    // 9. Order-details panel (#order-details) is not visible
    await expect(page.locator('#order-details')).not.toBeVisible();

    // 10. No notification/toast is shown
    await expect(page.locator('#notification')).not.toHaveClass(/show/);

    // 11. No JavaScript errors in the browser console during load
    expect(consoleErrors).toHaveLength(0);
  });
});
