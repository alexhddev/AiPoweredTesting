// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Menu Display', () => {
  test('Daily menu loads and displays all items on page load', async ({ page }) => {
    // 1. Navigate to http://localhost:3000
    await page.goto('http://localhost:3000');

    // expect: The page title is 'Awesome Pizza - Order Online'
    await expect(page).toHaveTitle('Awesome Pizza - Order Online');

    // expect: The 'Today's Menu' heading is visible
    await expect(page.getByRole('heading', { name: "Today's Menu" })).toBeVisible();

    // expect: Five pizza items are displayed: Margherita Pizza, Pepperoni Pizza, Quattro Stagioni, Vegetarian Delight, BBQ Chicken Pizza
    await expect(page.getByRole('heading', { name: 'Margherita Pizza' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pepperoni Pizza' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quattro Stagioni' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Vegetarian Delight' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'BBQ Chicken Pizza' })).toBeVisible();

    // 2. Inspect each menu item card
    // expect: Each item shows a name heading, description text, a pizza image, and quantity control buttons (− and +)
    const pizzas = ['Margherita Pizza', 'Pepperoni Pizza', 'Quattro Stagioni', 'Vegetarian Delight', 'BBQ Chicken Pizza'];
    for (const pizza of pizzas) {
      await expect(page.getByRole('img', { name: pizza })).toBeVisible();
    }

    await expect(page.getByRole('button', { name: '−' })).toHaveCount(5);
    await expect(page.getByRole('button', { name: '+' })).toHaveCount(5);

    // expect: All quantity displays start at 0
    await expect(page.locator('.quantity-display')).toHaveText(['0', '0', '0', '0', '0']);
  });
});
