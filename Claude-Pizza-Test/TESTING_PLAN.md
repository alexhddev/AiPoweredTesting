# Awesome Pizza - Testing Plan

## Application Overview

**Awesome Pizza** is a pizza ordering web app at `http://localhost:3000/`. It allows customers to browse a daily menu, build a cart, place orders, and track/manage order status.

---

## Application Features

### 1. Menu Section
- Fetches 5 pizza items from `GET /api/daily-menu` on page load
- Displays each item with: image, name, description, and quantity controls (+/− buttons)
- Quantity display per item updates in sync with cart

### 2. Cart & Order Placement
- Add items via `+` button; reduce/remove via `−` button
- Cart shows item name, quantity, and a Remove button per item
- Total item count displayed in cart summary
- Customer name input (required)
- **Place Order** button is disabled until: name is filled AND cart has at least one item
- On success: cart clears, name clears, success notification shown, order ID populated in lookup field

### 3. Order Management
- Order ID text input with a **Look Up Order** button (also triggered by Enter key)
- Displays order details: ID, customer name, status badge, list of items with quantities
- Status-driven action buttons:
  - `RECEIVED` → "Mark as Delivering" or "Cancel Order"
  - `DELIVERING` → "Mark as Delivered"
  - `DELIVERED` / `CANCELED` → no further actions

### 4. Theme Toggle
- Moon/Sun button in header toggles light/dark theme
- Preference persisted in `localStorage`

### 5. Notifications
- Toast messages appear for success and error events
- Auto-dismiss after ~3 seconds

---

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/daily-menu`     | Returns list of pizza items |
| POST   | `/api/orders`         | Creates a new order      |
| GET    | `/api/orders/:id`     | Retrieves order by ID    |
| PUT    | `/api/orders/:id`     | Updates order status     |

### Order Status Flow
```
RECEIVED → DELIVERING → DELIVERED
RECEIVED → CANCELED
```

---

## Test Plan

### TC-01: Menu Loading
- **Scenario**: Page loads and menu is populated from the API
- **Steps**: Open the homepage
- **Expected**: 5 pizza items rendered with name, description, image, and quantity controls
- **Also verify**: Quantity controls start at 0 for all items

---

### TC-02: Adding Items to Cart
- **Scenario**: User increments a pizza item quantity
- **Steps**: Click `+` on "Margherita Pizza"
- **Expected**: Quantity display on menu item shows 1; cart shows "Margherita Pizza × 1"; total items = 1

---

### TC-03: Reducing Item Quantity to Zero Removes from Cart
- **Scenario**: Decrement an item already at quantity 1
- **Steps**: Add 1 Margherita, then click `−`
- **Expected**: Item removed from cart; cart shows empty state; total items = 0

---

### TC-04: Remove Button in Cart
- **Scenario**: User removes an item directly from the cart
- **Steps**: Add items, then click "Remove" next to an item in the cart
- **Expected**: Item removed from cart; menu quantity display resets to 0 for that item

---

### TC-05: Place Order Button State — Disabled
- **Scenario**: Button disabled when cart or name is missing
- **Steps**:
  1. Page load with empty cart → button disabled
  2. Fill name only → button still disabled
  3. Add item only (no name) → button still disabled
- **Expected**: Button disabled in all three cases

---

### TC-06: Place Order Button State — Enabled
- **Scenario**: Button enabled when both name and cart item present
- **Steps**: Enter a name AND add at least one item
- **Expected**: "Place Order" button becomes enabled

---

### TC-07: Successful Order Placement
- **Scenario**: Complete happy-path order
- **Steps**: Enter name "Alice", add 2× Pepperoni Pizza, click Place Order
- **Expected**:
  - Success notification: "Order placed successfully! Order ID: order-..."
  - Cart clears; name field clears; button disables
  - Order lookup section auto-fills with the new order ID and shows order details
  - Order status shows `RECEIVED`

---

### TC-08: Order Placement with Multiple Items
- **Scenario**: Cart contains multiple different pizza types
- **Steps**: Add 1× Margherita, 2× BBQ Chicken, place order
- **Expected**: API receives both items; order details display both items with correct quantities

---

### TC-09: Order Lookup — Valid ID
- **Scenario**: Look up an existing order by ID
- **Steps**: Enter a valid order ID in the lookup field, click "Look Up Order"
- **Expected**: Order details section appears with correct ID, customer name, status, and items

---

### TC-10: Order Lookup — Invalid ID
- **Scenario**: Look up a non-existent order
- **Steps**: Enter "nonexistent-id", click "Look Up Order"
- **Expected**: Error notification shown; order details panel hidden

---

### TC-11: Order Lookup via Enter Key
- **Scenario**: Pressing Enter in the ID field triggers lookup
- **Steps**: Type a valid order ID and press Enter
- **Expected**: Same result as clicking "Look Up Order"

---

### TC-12: Order Status Transition — RECEIVED to DELIVERING
- **Scenario**: Staff marks an order as delivering
- **Steps**: Look up a RECEIVED order; click "Mark as Delivering"
- **Expected**: Status badge updates to `DELIVERING`; "Mark as Delivered" button appears; Cancel and "Mark as Delivering" buttons disappear

---

### TC-13: Order Status Transition — DELIVERING to DELIVERED
- **Scenario**: Staff marks a delivering order as delivered
- **Steps**: Look up a DELIVERING order; click "Mark as Delivered"
- **Expected**: Status badge updates to `DELIVERED`; no further action buttons shown

---

### TC-14: Order Status Transition — RECEIVED to CANCELED
- **Scenario**: Staff cancels a received order
- **Steps**: Look up a RECEIVED order; click "Cancel Order"
- **Expected**: Status badge updates to `CANCELED`; no further action buttons shown

---

### TC-15: Notification Auto-Dismiss
- **Scenario**: Notifications disappear automatically
- **Steps**: Trigger any success or error notification
- **Expected**: Notification is visible immediately, then disappears after ~3 seconds

---

### TC-16: Theme Toggle — Light to Dark
- **Scenario**: User switches to dark mode
- **Steps**: Click the moon button in the header
- **Expected**: `data-theme="dark"` set on `<html>`; button icon changes to ☀️

---

### TC-17: Theme Toggle — Dark to Light
- **Scenario**: User switches back to light mode
- **Steps**: With dark mode active, click the sun button
- **Expected**: `data-theme` attribute removed; button icon changes to 🌙

---

### TC-18: Theme Persistence Across Page Reloads
- **Scenario**: Theme preference is saved in localStorage
- **Steps**: Switch to dark mode, reload the page
- **Expected**: Dark mode is still active after reload

---

### TC-19: API — Create Order Input Validation
- **Scenario**: API rejects malformed order requests
- **Steps**: POST `/api/orders` with missing `sender` or empty `contents`
- **Expected**: `400`-equivalent response with `success: false` and descriptive error message

---

### TC-20: API — Invalid Status Update
- **Scenario**: API rejects unknown status values
- **Steps**: PUT `/api/orders/:id` with `{"status": "UNKNOWN"}`
- **Expected**: `success: false` with message listing valid statuses

---

## Test Priorities

| Priority | Test Cases |
|----------|------------|
| Critical | TC-07, TC-09, TC-12, TC-13, TC-14 |
| High     | TC-01, TC-02, TC-05, TC-06, TC-10 |
| Medium   | TC-03, TC-04, TC-08, TC-11, TC-15 |
| Low      | TC-16, TC-17, TC-18, TC-19, TC-20 |

---

## File Plan

```
tests/
├── pages/
│   └── PizzaPage.ts          # Page Object Model — selectors & actions for the whole app
│
├── menu.spec.ts              # TC-01: menu loading, item display, quantity controls
├── cart.spec.ts              # TC-02, TC-03, TC-04: adding, reducing, removing items
├── order-placement.spec.ts   # TC-05, TC-06, TC-07, TC-08: button state, happy path, multi-item
├── order-lookup.spec.ts      # TC-09, TC-10, TC-11: valid/invalid lookup, Enter key
├── order-status.spec.ts      # TC-12, TC-13, TC-14: RECEIVED→DELIVERING→DELIVERED, CANCELED
├── notifications.spec.ts     # TC-15: auto-dismiss, success/error appearance
├── theme.spec.ts             # TC-16, TC-17, TC-18: toggle, persistence across reload
└── api.spec.ts               # TC-19, TC-20: direct API validation (no UI)
```

**Notes:**
- `pages/PizzaPage.ts` — a single POM covers the whole app (single-page); avoids duplicating locators across spec files
- `api.spec.ts` — uses Playwright's `request` fixture directly, no browser needed
- Spec files map 1:1 to feature areas, allowing targeted runs (e.g. `npx playwright test cart`)
- `example.spec.ts` can be deleted — it points at playwright.dev and is not relevant to this project
