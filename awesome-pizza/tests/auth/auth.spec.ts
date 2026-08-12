import {test, expect} from '@playwright/test'

test('authenticate', async ({ page }) => {

    const dummyUser = 'user';
    const dummyPass = 'pass';

    await page.goto('http://localhost:3000/login')


})