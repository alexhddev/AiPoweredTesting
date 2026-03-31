import { type Page, type Locator } from '@playwright/test';

export class PizzaPage {
  readonly page: Page;

  // Menu
  readonly menuContainer: Locator;
  readonly menuItems: Locator;

  // Cart
  readonly cartItems: Locator;
  readonly totalItems: Locator;
  readonly customerNameInput: Locator;
  readonly placeOrderBtn: Locator;

  // Order lookup
  readonly orderIdInput: Locator;
  readonly lookupOrderBtn: Locator;
  readonly orderDetails: Locator;

  // Notifications
  readonly notification: Locator;

  // Theme
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuContainer = page.locator('#menu-container');
    this.menuItems = page.locator('.menu-item');

    this.cartItems = page.locator('#cart-items');
    this.totalItems = page.locator('#total-items');
    this.customerNameInput = page.locator('#customer-name');
    this.placeOrderBtn = page.locator('#place-order-btn');

    this.orderIdInput = page.locator('#order-id');
    this.lookupOrderBtn = page.locator('#lookup-order-btn');
    this.orderDetails = page.locator('#order-details');

    this.notification = page.locator('#notification');
    this.themeToggle = page.locator('#theme-toggle');
  }

  async goto() {
    await this.page.goto('http://localhost:3000/');
  }

  menuItemByName(name: string): Locator {
    return this.menuItems.filter({ hasText: name });
  }

  async getMenuItemNames(): Promise<string[]> {
    return this.menuItems.locator('h3').allTextContents();
  }

  quantityDisplay(index: number): Locator {
    return this.page.locator(`#qty-${index}`);
  }

  incrementBtn(itemName: string): Locator {
    return this.menuItemByName(itemName).getByRole('button', { name: '+' });
  }

  decrementBtn(itemName: string): Locator {
    return this.menuItemByName(itemName).getByRole('button', { name: '−' });
  }

  cartItemRow(itemName: string): Locator {
    return this.cartItems.locator('.cart-item').filter({ hasText: itemName });
  }

  removeBtn(itemName: string): Locator {
    return this.cartItemRow(itemName).getByRole('button', { name: 'Remove' });
  }

  async addToCart(itemName: string, quantity = 1) {
    for (let i = 0; i < quantity; i++) {
      await this.incrementBtn(itemName).click();
    }
  }

  async placeOrder(customerName: string) {
    await this.customerNameInput.fill(customerName);
    await this.placeOrderBtn.click();
  }

  async lookupOrder(orderId: string) {
    await this.orderIdInput.fill(orderId);
    await this.lookupOrderBtn.click();
  }
}
