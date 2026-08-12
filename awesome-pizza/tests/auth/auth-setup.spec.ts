import { test, expect } from '@playwright/test'

test('authenticate', async ({ page }) => {

    const dummyUser = 'user';
    const dummyPass = 'pass';

    await page.goto('http://localhost:3000/login.html')

    await page.fill('#login-username', dummyUser);
    await page.fill('#login-password', dummyPass);
    await page.click('#login-btn');

    await expect(page).toHaveURL('http://localhost:3000/protected.html');

    await page.context().storageState({
        path: 'playwright/.auth/user.json'
    })
})