# E2E Testing Strategy for Awesome Pizza

## Overview

**Awesome Pizza** is a single-page pizza ordering app with three main feature areas:

1. **Menu** – 5 pizza items with +/- quantity controls
2. **Your Order** – customer name input, cart summary, and "Place Order" button
3. **Order Management** – look up an order by ID

---

## Test Suites

### 1. `menu.spec.ts` — Menu & Cart Interactions

| Test | What to verify |
|------|---------------|
| Page loads with 5 pizza items | All pizza names/images are visible |
| Increment quantity | Clicking `+` increases item count |
| Decrement at zero has no effect | Count stays at `0`, no negative values |
| Increment then decrement | Count returns to `0` |
| Cart reflects quantities | Total items count in cart updates correctly |
| Cart is initially empty | "Your cart is empty" message shown |

### 2. `order-placement.spec.ts` — Order Placement Flow

| Test | What to verify |
|------|---------------|
| Place Order button is disabled/inactive with empty cart | Guard against empty orders |
| Requires customer name | Validation when name is blank |
| Successful order submission | Adds items + name → "Place Order" → confirmation/receipt shown |
| Cart clears after placing order | Cart resets to empty state |
| Order ID is returned | A valid order ID appears after order is placed |

### 3. `order-lookup.spec.ts` — Order Management

| Test | What to verify |
|------|---------------|
| Look up a valid order ID | Returns the order details |
| Look up an invalid/unknown ID | Shows an appropriate error/not-found message |
| Empty ID field | Validation message shown |

### 4. `ui.spec.ts` — UI & Accessibility

| Test | What to verify |
|------|---------------|
| Dark mode toggle works | Clicking 🌙 switches theme class on `<body>` |
| Theme persists on reload | `localStorage` or CSS class survives page refresh |
| Page title/heading is correct | `🍕 Awesome Pizza` heading visible |
| Responsive layout (mobile) | Test with `devices['iPhone 14']` viewport |

---

## Recommended File Structure

```
tests/
  menu.spec.ts
  order-placement.spec.ts
  order-lookup.spec.ts
  ui.spec.ts
```

---

## Config Suggestions

Update `playwright.config.ts` to:
- Uncomment `baseURL: 'http://localhost:3000'` so tests use relative URLs
- Keep cross-browser coverage (Chromium, Firefox, WebKit) for the happy-path order flow
- Run `ui.spec.ts` on mobile viewports using `devices['iPhone 14']`

---

## Testing Priorities

**Critical (run on every commit):**
- Add item to cart → enter name → place order → verify confirmation

**High (run on every PR):**
- Full menu interaction suite
- Order lookup (valid + invalid)

**Lower priority:**
- Dark mode toggle
- Mobile/responsive layout
