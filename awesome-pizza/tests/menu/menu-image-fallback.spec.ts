// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Menu Display', () => {
  test('Pizza images fall back gracefully when not found', async ({ page }) => {
    const pizzaNames = [
      'Margherita Pizza',
      'Pepperoni Pizza',
      'Quattro Stagioni',
      'Vegetarian Delight',
      'BBQ Chicken Pizza',
    ];

    // 1. Navigate to http://localhost:3000 with the network request for pizza images blocked
    await page.route('**/assets/origs/**', route => route.abort());
    await page.goto('http://localhost:3000');

    // expect: Pizza cards are still displayed
    for (const name of pizzaNames) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }

    // expect: A fallback SVG placeholder image is rendered instead of the broken image
    for (const name of pizzaNames) {
      await expect(page.getByRole('img', { name })).toHaveAttribute('src', /^data:image\/svg\+xml;base64,/);
    }
  });
});
