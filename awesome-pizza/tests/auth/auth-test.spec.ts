import { test, expect } from '@playwright/test'

test.use({ storageState: 'playwright/.auth/user.json' })

test('protected routes', async ({ page }) => {

    await page.goto('http://localhost:3000/protected.html')


})