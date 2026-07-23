// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Menu Display', () => {
  test('Menu loads and displays all pizza items', async ({ page }) => {
    const pizzaNames = [
      'Margherita Pizza',
      'Pepperoni Pizza',
      'Quattro Stagioni',
      'Vegetarian Delight',
      'BBQ Chicken Pizza',
    ];

    // 1. Navigate to http://localhost:3000
    await page.goto('http://localhost:3000');

    // expect: The page title is 'Awesome Pizza - Order Online'
    await expect(page).toHaveTitle('Awesome Pizza - Order Online');

    // expect: The 'Today's Menu' section is visible
    await expect(page.getByRole('heading', { name: "Today's Menu" })).toBeVisible();

    // expect: Exactly 5 pizza cards are rendered
    await expect(page.locator('.menu-item')).toHaveCount(5);
    for (const name of pizzaNames) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }

    // 2. Inspect each pizza card
    // expect: Each card shows an image, a name heading, and a description paragraph
    // expect: Each card shows quantity control buttons (− and +) and a quantity display starting at 0
    for (const name of pizzaNames) {
      const card = page.locator('.menu-item').filter({ has: page.getByRole('heading', { name }) });
      await expect(card.getByRole('img')).toBeVisible();
      await expect(card.getByRole('heading', { name })).toBeVisible();
      await expect(card.locator('p')).toBeVisible();
      await expect(card.getByRole('button', { name: '−' })).toBeVisible();
      await expect(card.getByRole('button', { name: '+' })).toBeVisible();
      await expect(card.locator('.quantity-display')).toHaveText('0');
    }
  });
});
