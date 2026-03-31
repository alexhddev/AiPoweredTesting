# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
npx playwright test

# Run a specific spec file
npx playwright test tests/menu.spec.ts

# Run tests matching a feature area (substring match)
npx playwright test cart
npx playwright test order-placement

# Run with UI mode
npx playwright test --ui

# Run in headed mode
npx playwright test --headed

# Show HTML report
npx playwright show-report
```

## Architecture

This is a **Playwright/TypeScript E2E test suite** for the Awesome Pizza app at `http://localhost:3000/`. The app must be running externally before tests are executed (no webServer configured in playwright.config.ts).

### Pattern: Page Object Model

`tests/pages/PizzaPage.ts` is a single POM covering the entire SPA. All locators and interaction helpers live there. Test specs import and use this class — never duplicate selectors in spec files.

### Planned spec layout (1:1 with feature areas)

| Spec file | Test cases |
|---|---|
| `menu.spec.ts` | TC-01 (implemented) |
| `cart.spec.ts` | TC-02, TC-03, TC-04 |
| `order-placement.spec.ts` | TC-05–TC-08 |
| `order-lookup.spec.ts` | TC-09–TC-11 |
| `order-status.spec.ts` | TC-12–TC-14 |
| `notifications.spec.ts` | TC-15 |
| `theme.spec.ts` | TC-16–TC-18 |
| `api.spec.ts` | TC-19–TC-20 (uses `request` fixture, no browser) |

See `TESTING_PLAN.md` for full test case specifications.

### TypeScript conventions (observed in this codebase)

**Imports**: Use named `type` imports for Playwright types — `import { type Page, type Locator }` — to keep runtime imports clean.

**PizzaPage locators**: Declared as `readonly` properties, initialized in the constructor. Stable locators (fixed selectors) are properties; dynamic locators (parametrised by name/index) are methods returning `Locator`.

**Async methods**: Helper action methods (`goto`, `addToCart`, `placeOrder`, `lookupOrder`) are `async`. Pure locator-returning methods are synchronous.

**Spec files**: Each spec instantiates `PizzaPage` inside each `test()` callback — no shared instance across tests. Tests are grouped with `test.describe('TC-NN: <name>')` matching the test case ID in `TESTING_PLAN.md`.

**No `test.beforeEach` for navigation**: Each test calls `pizzaPage.goto()` explicitly — keeps tests self-contained and readable.

**Assertions**: Always use `expect(locator).toBeVisible()` / `toHaveText()` / `toBeEmpty()` etc. over raw `.count()` comparisons where possible.

### API Endpoints Under Test

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/daily-menu` | Returns 5 pizza items |
| POST | `/api/orders` | Creates a new order |
| GET | `/api/orders/:id` | Retrieves order by ID |
| PUT | `/api/orders/:id` | Updates order status |

Order status flow: `RECEIVED → DELIVERING → DELIVERED` or `RECEIVED → CANCELED`

### Key locators (defined in PizzaPage.ts)

- Menu: `#menu-container`, `.menu-item`
- Cart: `#cart-items`, `#total-items`, `#customer-name`, `#place-order-btn`
- Order lookup: `#order-id`, `#lookup-order-btn`, `#order-details`
- Notification: `#notification`
- Theme toggle: `#theme-toggle`
