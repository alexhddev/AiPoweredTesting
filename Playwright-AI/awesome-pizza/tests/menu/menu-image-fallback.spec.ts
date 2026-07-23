// spec: specs/test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Menu Display', () => {
  test('Menu item images fall back gracefully when image fails to load', async ({ page }) => {
    // 1. Navigate to http://localhost:3000
    await page.goto('http://localhost:3000');

    // 2. Intercept image requests to return a 404 error, then reload the page
    await page.route('**/*.png', route => route.fulfill({ status: 404, body: '' }));
    await page.reload();

    const menuImages = page.locator('.menu-item img');
    await expect(menuImages).toHaveCount(5);

    // expect: A placeholder SVG image is rendered in place of each broken image
    for (let i = 0; i < 5; i++) {
      await expect(menuImages.nth(i)).toHaveAttribute('src', /^data:image\/svg\+xml/);
    }

    // expect: No broken image icons are shown - all images are still visible in the DOM
    for (let i = 0; i < 5; i++) {
      await expect(menuImages.nth(i)).toBeVisible();
    }
  });
});
