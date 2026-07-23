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

    // expect: Five pizza items are displayed
    await expect(page.locator('main')).toMatchAriaSnapshot(`
- main:
  - heading "Margherita Pizza" [level=3]
  - heading "Pepperoni Pizza" [level=3]
  - heading "Quattro Stagioni" [level=3]
  - heading "Vegetarian Delight" [level=3]
  - heading "BBQ Chicken Pizza" [level=3]
`);

    // 2. Inspect each menu item card
    const menuItems = page.locator('.menu-item');
    await expect(menuItems).toHaveCount(5);

    const pizzaNames = ['Margherita Pizza', 'Pepperoni Pizza', 'Quattro Stagioni', 'Vegetarian Delight', 'BBQ Chicken Pizza'];

    for (let i = 0; i < pizzaNames.length; i++) {
      const card = menuItems.nth(i);

      // expect: Each item shows a name heading
      await expect(card.locator('h3')).toBeVisible();

      // expect: Each item shows description text
      await expect(card.locator('p')).toBeVisible();

      // expect: Each item shows a pizza image
      await expect(card.locator('img')).toBeVisible();

      // expect: Each item shows quantity control buttons (− and +)
      await expect(card.getByRole('button', { name: '−' })).toBeVisible();
      await expect(card.getByRole('button', { name: '+' })).toBeVisible();
    }

    // expect: All quantity displays start at 0
    const quantityDisplays = page.locator('.quantity-display');
    await expect(quantityDisplays).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(quantityDisplays.nth(i)).toHaveText('0');
    }
  });
});
