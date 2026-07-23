// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Menu Display', () => {
  test('Menu item images fall back gracefully when image fails to load', async ({ page }) => {
    // 1. Navigate to http://localhost:3000
    await page.goto('http://localhost:3000');

    // 2. Intercept image requests to return a 404 error, then reload the page
    await page.route('**/assets/origs/**', route => route.fulfill({ status: 404 }));
    await page.reload();

    const pizzas = ['Margherita Pizza', 'Pepperoni Pizza', 'Quattro Stagioni', 'Vegetarian Delight', 'BBQ Chicken Pizza'];

    // expect: A placeholder SVG image is rendered in place of each broken image
    for (const pizza of pizzas) {
      await expect(page.getByRole('img', { name: pizza })).toHaveAttribute('src', /^data:image\/svg\+xml;base64,/);
    }

    // expect: No broken image icons are shown
    for (const pizza of pizzas) {
      await expect(page.getByRole('img', { name: pizza })).toBeVisible();
    }
  });
});
