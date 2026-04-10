import { type Locator, type Page } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuItems: Locator;
  readonly cartEmptyText: Locator;
  readonly totalItems: Locator;
  readonly emptyCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator('.menu-item');
    this.cartEmptyText = page.getByText('Your cart is empty');
    this.totalItems = page.locator('#total-items');
    this.emptyCart = page.locator('.empty-cart');
  }

  async goto() {
    await this.page.addInitScript(() => localStorage.clear());
    await this.page.goto('/');
    await this.menuItems.first().waitFor();
  }

  getMenuItem(index: number): Locator {
    return this.menuItems.nth(index);
  }

  getIncrementButton(item: Locator): Locator {
    return item.getByRole('button', { name: '+' });
  }

  getDecrementButton(item: Locator): Locator {
    return item.getByRole('button', { name: '−' });
  }

  getQuantityDisplay(item: Locator): Locator {
    return item.locator('.quantity-display');
  }
}
