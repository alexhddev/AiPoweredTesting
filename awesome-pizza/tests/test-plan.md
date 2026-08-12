# Awesome Pizza – Order Online: Playwright Test Plan

**Application URL:** http://localhost:3000  
**Document version:** 1.0  
**Date:** 2026-07-23  
**Scope:** End-to-end / functional / UX tests for the single-page pizza ordering application.

---

## Application Under Test

"Awesome Pizza – Order Online" is a single-page web application that lets customers browse a daily pizza menu, build a cart, submit an order, and track its delivery status through four lifecycle states: **RECEIVED → DELIVERING → DELIVERED** (or **CANCELED**).

The front-end communicates with a REST API at `/api`. All state is kept in memory on the server; the browser persists only the dark/light theme preference in `localStorage`.

---

## General Preconditions (apply to every test unless stated otherwise)

- The application server is running and accessible at `http://localhost:3000`.
- The database/in-memory store is in a clean state (no pre-existing orders).
- `localStorage` is cleared so no saved theme exists.
- The browser viewport is 1280 × 800 (desktop) unless a test specifies otherwise.
- JavaScript is enabled.

---

## Test Suite 1 – Page Load & Layout

### TC-1.1 – Successful initial page load

**Preconditions:** Fresh browser tab, no prior session.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Wait for the page to finish loading (network idle).

**Expected outcomes:**
- Page title is `"Awesome Pizza - Order Online"`.
- `<header>` contains the heading `"🍕 Awesome Pizza"` and subtitle `"Delicious pizzas delivered to your door!"`.
- The theme-toggle button is visible and shows `"🌙"`.
- The `"Today's Menu"` section heading is visible.
- Five pizza cards are rendered in the menu grid, each containing an image, a name `<h3>`, a description paragraph, a `−` button, a quantity display showing `0`, and a `+` button.
- The `"Your Order"` section is visible with a `"Your Name:"` label, an empty text input, a `"Cart"` subsection showing `"Your cart is empty"`, `"Total Items: 0"`, and a disabled `"Place Order"` button.
- The `"Order Management"` section is visible with an `"Order ID:"` label, an empty text input, and a `"Look Up Order"` button.
- The order-details panel (`#order-details`) is **not** visible.
- No notification/toast is shown.
- No JavaScript errors appear in the browser console during load.

---

### TC-1.2 – All five menu items are present with correct names

**Preconditions:** TC-1.1 preconditions.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Wait for the menu grid to be populated.
3. Collect the text of all five pizza name headings.

**Expected outcomes:**
The following five names are present (in any order):
- `"Margherita Pizza"`
- `"Pepperoni Pizza"`
- `"Quattro Stagioni"`
- `"Vegetarian Delight"`
- `"BBQ Chicken Pizza"`

---

### TC-1.3 – Menu item images load or fall back gracefully

**Preconditions:** TC-1.1 preconditions.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Inspect each of the five pizza `<img>` elements.

**Expected outcomes:**
- Each `<img>` has a non-empty `alt` attribute matching the pizza name (accessibility).
- If the remote image is unavailable, the inline SVG fallback is shown and no broken-image icon appears.

---

### TC-1.4 – Page layout is not broken at 375 × 812 (mobile)

**Preconditions:** Browser viewport set to 375 × 812.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Scroll through the entire page.

**Expected outcomes:**
- No horizontal scroll bar appears.
- All section headings, menu cards, form inputs, and buttons are fully visible and not clipped.
- Text is legible (no overflow beyond card boundaries).

---

### TC-1.5 – Keyboard focus order follows visual layout

**Preconditions:** TC-1.1 preconditions.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Press `Tab` repeatedly from the start of the document.

**Expected outcomes:**
- Focus moves sequentially through interactive elements in a logical order: theme-toggle → quantity controls → customer-name input → place-order button → order-id input → look-up-order button.
- Every focused element has a visible focus indicator (outline or highlight).

---

## Test Suite 2 – Dark / Light Theme Toggle

### TC-2.1 – Activate dark theme

**Preconditions:** Page loaded in light mode (`data-theme` attribute absent on `<html>`).

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Confirm the theme-toggle button shows `"🌙"`.
3. Click the theme-toggle button.

**Expected outcomes:**
- The `<html>` element has `data-theme="dark"`.
- The theme-toggle button now shows `"☀️"`.
- The page background and card backgrounds visually reflect dark-mode colors (CSS custom properties take effect).
- `localStorage.getItem('theme')` equals `"dark"`.

---

### TC-2.2 – Return to light theme

**Preconditions:** Dark theme is active (TC-2.1 completed).

**Steps:**
1. Click the theme-toggle button (currently showing `"☀️"`).

**Expected outcomes:**
- The `data-theme` attribute is removed from `<html>`.
- The theme-toggle button shows `"🌙"`.
- `localStorage.getItem('theme')` equals `"light"`.

---

### TC-2.3 – Dark theme preference persists across page reload

**Preconditions:** Page loaded; dark theme not yet active.

**Steps:**
1. Click the theme-toggle button to activate dark mode.
2. Reload the page.

**Expected outcomes:**
- After reload, `data-theme="dark"` is set on `<html>`.
- The toggle button shows `"☀️"` immediately (no flash of light theme).

---

### TC-2.4 – Light theme preference persists across page reload

**Preconditions:** Dark theme is active and saved in `localStorage`.

**Steps:**
1. Click the theme-toggle button to switch back to light mode.
2. Reload the page.

**Expected outcomes:**
- After reload, `data-theme` is absent on `<html>`.
- The toggle button shows `"🌙"`.

---

### TC-2.5 – Theme toggle is accessible

**Preconditions:** TC-1.1 preconditions.

**Steps:**
1. Navigate to `http://localhost:3000`.
2. Inspect the theme-toggle button element.

**Expected outcomes:**
- The button has `aria-label="Toggle dark theme"` (or equivalent descriptive label) so screen readers can announce it.

---

## Test Suite 3 – Menu – Quantity Controls

### TC-3.1 – Increment quantity for a single item

**Preconditions:** Page loaded; all quantity displays show `0`.

**Steps:**
1. Locate the `+` button for **Margherita Pizza**.
2. Click `+` once.

**Expected outcomes:**
- The quantity display next to the `+`/`−` buttons for Margherita Pizza shows `1`.
- Cart section shows a `"Margherita Pizza"` entry with `"Quantity: 1"`.
- `"Total Items: 1"` is displayed.
- The `"Your cart is empty"` message is gone.

---

### TC-3.2 – Increment quantity beyond 1

**Preconditions:** TC-3.1 completed (Margherita at 1).

**Steps:**
1. Click `+` for Margherita Pizza two more times.

**Expected outcomes:**
- Menu quantity display shows `3`.
- Cart entry shows `"Quantity: 3"`.
- `"Total Items: 3"`.

---

### TC-3.3 – Decrement quantity

**Preconditions:** Margherita Pizza quantity is `3`.

**Steps:**
1. Click `−` for Margherita Pizza once.

**Expected outcomes:**
- Menu quantity display shows `2`.
- Cart entry shows `"Quantity: 2"`.
- `"Total Items: 2"`.

---

### TC-3.4 – Decrement quantity to zero removes item from cart

**Preconditions:** Margherita Pizza quantity is `1`.

**Steps:**
1. Click `−` for Margherita Pizza once.

**Expected outcomes:**
- Menu quantity display for Margherita Pizza shows `0`.
- Margherita Pizza entry is **removed** from the cart.
- `"Your cart is empty"` message reappears.
- `"Total Items: 0"`.

---

### TC-3.5 – Decrement button does not allow negative quantities

**Preconditions:** All quantities are `0`.

**Steps:**
1. Click `−` for **Pepperoni Pizza** (quantity already at `0`).

**Expected outcomes:**
- Quantity display remains `0`.
- Cart remains empty.
- No error or notification is shown.

---

### TC-3.6 – Multiple distinct items can be added

**Preconditions:** Fresh state; all quantities at `0`.

**Steps:**
1. Click `+` for **Margherita Pizza** once.
2. Click `+` for **BBQ Chicken Pizza** twice.
3. Click `+` for **Vegetarian Delight** once.

**Expected outcomes:**
- Cart contains three distinct entries:
  - `"Margherita Pizza"` – Quantity: 1
  - `"BBQ Chicken Pizza"` – Quantity: 2
  - `"Vegetarian Delight"` – Quantity: 1
- `"Total Items: 4"`.

---

### TC-3.7 – Total items count aggregates all cart items

**Preconditions:** TC-3.6 completed.

**Steps:**
1. Observe the `"Total Items:"` counter.

**Expected outcomes:**
- Counter shows `4` (sum of all individual item quantities).

---

## Test Suite 4 – Cart Management

### TC-4.1 – Remove a single item from the cart

**Preconditions:** Cart contains Margherita Pizza (qty 1) and Pepperoni Pizza (qty 2).

**Steps:**
1. Click the `"Remove"` button next to Margherita Pizza.

**Expected outcomes:**
- Margherita Pizza entry disappears from the cart.
- Pepperoni Pizza entry remains with `"Quantity: 2"`.
- `"Total Items: 2"`.
- The menu quantity display for Margherita Pizza resets to `0`.

---

### TC-4.2 – Remove the last item from the cart

**Preconditions:** Cart contains only Pepperoni Pizza (qty 1).

**Steps:**
1. Click `"Remove"` next to Pepperoni Pizza.

**Expected outcomes:**
- Cart shows `"Your cart is empty"`.
- `"Total Items: 0"`.
- `"Place Order"` button becomes disabled.

---

### TC-4.3 – Place Order button disabled when cart is empty

**Preconditions:** Name field filled in; cart empty.

**Steps:**
1. Type `"Alice"` into the `"Your Name:"` input.
2. Confirm cart is empty.
3. Inspect the `"Place Order"` button.

**Expected outcomes:**
- `"Place Order"` button has the `disabled` attribute.

---

### TC-4.4 – Place Order button disabled when name is empty

**Preconditions:** Cart has at least one item; name field is empty.

**Steps:**
1. Click `+` for Margherita Pizza once.
2. Leave the `"Your Name:"` input blank.
3. Inspect the `"Place Order"` button.

**Expected outcomes:**
- `"Place Order"` button has the `disabled` attribute.

---

### TC-4.5 – Place Order button enabled when name AND cart are both filled

**Preconditions:** Fresh state.

**Steps:**
1. Click `+` for Pepperoni Pizza once.
2. Type `"Bob"` into the `"Your Name:"` input.

**Expected outcomes:**
- `"Place Order"` button is **enabled** (no `disabled` attribute).

---

### TC-4.6 – Clearing the name field re-disables the Place Order button

**Preconditions:** Name is filled and cart has items (button enabled).

**Steps:**
1. Clear the `"Your Name:"` input (select all + delete).

**Expected outcomes:**
- `"Place Order"` button becomes disabled immediately.

---

### TC-4.7 – Cart persists quantity changes made via menu stepper

**Preconditions:** Cart has Quattro Stagioni at qty 2.

**Steps:**
1. Click `+` for Quattro Stagioni once more.
2. Observe the cart.

**Expected outcomes:**
- Cart entry for Quattro Stagioni updates to `"Quantity: 3"`.
- `"Total Items: 3"`.

---

## Test Suite 5 – Order Placement

### TC-5.1 – Successful order placement (happy path)

**Preconditions:** Fresh state.

**Steps:**
1. Click `+` for **Margherita Pizza** once.
2. Click `+` for **Pepperoni Pizza** twice.
3. Type `"Alice"` into `"Your Name:"`.
4. Click `"Place Order"`.

**Expected outcomes:**
- A success notification appears containing `"Order placed successfully! Order ID: order-"`.
- The cart is reset to empty: `"Your cart is empty"` is shown and `"Total Items: 0"`.
- The `"Your Name:"` input is cleared.
- All menu quantity displays reset to `0`.
- `"Place Order"` button becomes disabled.
- The `"Order ID:"` input in Order Management is auto-populated with the new order ID.
- The order-details panel appears and shows:
  - The correct Order ID
  - Customer: `"Alice"`
  - Status badge: `"RECEIVED"`
  - Order items: Margherita Pizza ×1, Pepperoni Pizza ×2
  - Action buttons: `"Mark as Delivering"` and `"Cancel Order"`

---

### TC-5.2 – Order ID is auto-populated after placement

**Preconditions:** TC-5.1 completed.

**Steps:**
1. Read the value of the `"Order ID:"` input field.
2. Compare with the Order ID shown in the order-details panel.

**Expected outcomes:**
- Both values match and follow the pattern `"order-..."` (non-empty string).

---

### TC-5.3 – Placing a second order generates a different Order ID

**Preconditions:** Fresh state.

**Steps:**
1. Place a first order for `"Alice"` with Margherita Pizza ×1.
2. Note the Order ID from the notification.
3. Click `+` for Pepperoni Pizza once.
4. Type `"Bob"` into `"Your Name:"`.
5. Click `"Place Order"`.
6. Note the new Order ID.

**Expected outcomes:**
- The second Order ID is different from the first.
- The order-details panel now shows Bob's order.

---

### TC-5.4 – Cart and name reset after successful order

**Preconditions:** TC-5.1 completed.

**Steps:**
1. Inspect the cart area.
2. Inspect the `"Your Name:"` input.

**Expected outcomes:**
- Cart shows `"Your cart is empty"`.
- `"Total Items: 0"`.
- `"Your Name:"` input value is `""` (empty).

---

### TC-5.5 – Placing an order with a large cart (all five items)

**Preconditions:** Fresh state.

**Steps:**
1. Click `+` for each of the five pizza items (one click each).
2. Type `"Charlie"` into `"Your Name:"`.
3. Click `"Place Order"`.

**Expected outcomes:**
- Success notification appears.
- Order details panel shows all five items with quantity ×1 each.
- `"Total Items: 0"` after reset.

---

### TC-5.6 – Placing an order with large quantities

**Preconditions:** Fresh state.

**Steps:**
1. Click `+` for **BBQ Chicken Pizza** 10 times.
2. Type `"Dana"` into `"Your Name:"`.
3. Click `"Place Order"`.

**Expected outcomes:**
- Order placed successfully.
- Order details show BBQ Chicken Pizza ×10.

---

### TC-5.7 – Name with special characters is accepted

**Preconditions:** Fresh state.

**Steps:**
1. Click `+` for Margherita Pizza once.
2. Type `"Jean-François O'Brien"` into `"Your Name:"`.
3. Click `"Place Order"`.

**Expected outcomes:**
- Order placed successfully.
- Customer name in order details is `"Jean-François O'Brien"`.

---

## Test Suite 6 – Order Lookup

### TC-6.1 – Look up a valid order by ID

**Preconditions:** At least one order has been placed (e.g., TC-5.1). Order ID is known.

**Steps:**
1. Clear the `"Order ID:"` input.
2. Type the known Order ID into `"Order ID:"`.
3. Click `"Look Up Order"`.

**Expected outcomes:**
- A `"Order found"` success notification appears.
- The order-details panel displays the correct Order ID, customer name, status, and items.

---

### TC-6.2 – Look up an order by pressing Enter in the Order ID field

**Preconditions:** A valid order exists.

**Steps:**
1. Click the `"Order ID:"` input and type a valid Order ID.
2. Press `Enter`.

**Expected outcomes:**
- Same result as TC-6.1 (Enter key triggers lookup).

---

### TC-6.3 – Look up a non-existent order ID

**Preconditions:** Fresh state or any state where the ID `"order-000000"` does not exist.

**Steps:**
1. Type `"order-000000"` into `"Order ID:"`.
2. Click `"Look Up Order"`.

**Expected outcomes:**
- An error notification appears containing `"Order not found: Order with ID 'order-000000' not found"`.
- The order-details panel is hidden (or not shown).
- A console error is logged (acceptable/expected behavior).

---

### TC-6.4 – Look up with an empty Order ID field

**Preconditions:** `"Order ID:"` input is empty.

**Steps:**
1. Ensure the `"Order ID:"` input is empty.
2. Click `"Look Up Order"`.

**Expected outcomes:**
- An error notification appears: `"Please enter an order ID"`.
- No API request is made.
- Order-details panel remains unchanged.

---

### TC-6.5 – Look up with whitespace-only Order ID

**Preconditions:** `"Order ID:"` input contains only spaces.

**Steps:**
1. Type `"   "` (three spaces) into `"Order ID:"`.
2. Click `"Look Up Order"`.

**Expected outcomes:**
- An error notification appears: `"Please enter an order ID"` (input is trimmed before validation).
- No API request with a blank ID is made.

---

### TC-6.6 – Order ID field auto-fills after order placement then can be manually changed

**Preconditions:** An order has just been placed (TC-5.1 completed).

**Steps:**
1. Note the auto-filled Order ID value.
2. Clear the `"Order ID:"` input.
3. Type an arbitrary invalid string `"fake-id-xyz"`.
4. Click `"Look Up Order"`.

**Expected outcomes:**
- Error notification: `"Order not found: Order with ID 'fake-id-xyz' not found"`.
- The previous order details are hidden.

---

## Test Suite 7 – Order Status Lifecycle

### TC-7.1 – Initial status of a new order is RECEIVED

**Preconditions:** TC-5.1 completed.

**Steps:**
1. Observe the order-details panel immediately after order placement.

**Expected outcomes:**
- Status badge shows `"RECEIVED"`.
- Action buttons present: `"Mark as Delivering"` (secondary style) and `"Cancel Order"` (red/danger style).

---

### TC-7.2 – Transition from RECEIVED to DELIVERING

**Preconditions:** An order in RECEIVED status is displayed in the order-details panel.

**Steps:**
1. Click `"Mark as Delivering"`.

**Expected outcomes:**
- Notification appears: `"Order status updated to DELIVERING"`.
- Status badge updates to `"DELIVERING"`.
- Action buttons change: only `"Mark as Delivered"` (green style) is shown.
- `"Mark as Delivering"` and `"Cancel Order"` buttons are **gone**.

---

### TC-7.3 – Transition from DELIVERING to DELIVERED

**Preconditions:** TC-7.2 completed; order is in DELIVERING status.

**Steps:**
1. Click `"Mark as Delivered"`.

**Expected outcomes:**
- Notification: `"Order status updated to DELIVERED"`.
- Status badge updates to `"DELIVERED"`.
- No action buttons are displayed (terminal state).

---

### TC-7.4 – DELIVERED order has no action buttons

**Preconditions:** TC-7.3 completed; order is in DELIVERED status.

**Steps:**
1. Inspect the order-details panel.

**Expected outcomes:**
- No `"Mark as Delivering"`, `"Mark as Delivered"`, or `"Cancel Order"` buttons exist.

---

### TC-7.5 – Transition from RECEIVED to CANCELED

**Preconditions:** An order in RECEIVED status is displayed.

**Steps:**
1. Click `"Cancel Order"`.

**Expected outcomes:**
- Notification: `"Order status updated to CANCELED"`.
- Status badge updates to `"CANCELED"`.
- No action buttons are displayed (terminal state).

---

### TC-7.6 – CANCELED order has no action buttons

**Preconditions:** TC-7.5 completed; order is in CANCELED status.

**Steps:**
1. Inspect the order-details panel.

**Expected outcomes:**
- No action buttons are rendered.

---

### TC-7.7 – Full lifecycle: RECEIVED → DELIVERING → DELIVERED (end-to-end)

**Preconditions:** Fresh state.

**Steps:**
1. Add Pepperoni Pizza ×1 to cart.
2. Enter name `"Eve"` and click `"Place Order"`.
3. Verify status is `"RECEIVED"`.
4. Click `"Mark as Delivering"`.
5. Verify status is `"DELIVERING"`.
6. Click `"Mark as Delivered"`.
7. Verify status is `"DELIVERED"`.

**Expected outcomes:**
- Each transition shows the correct notification and the correct subsequent status badge.
- Final state has no action buttons.

---

### TC-7.8 – Status reflects correctly when order is re-looked up after status changes

**Preconditions:** An order has been transitioned to DELIVERING.

**Steps:**
1. Note the Order ID.
2. Clear the `"Order ID:"` input and re-enter the same Order ID.
3. Click `"Look Up Order"`.

**Expected outcomes:**
- Order details are refreshed.
- Status badge shows `"DELIVERING"`.
- Only the `"Mark as Delivered"` button is shown.

---

## Test Suite 8 – Error Handling & Edge Cases

### TC-8.1 – Notification toast auto-dismisses

**Preconditions:** Fresh state.

**Steps:**
1. Click `"Look Up Order"` with an empty Order ID field to trigger an error toast.
2. Wait 4 seconds.

**Expected outcomes:**
- The notification is visible immediately after the action.
- After approximately 3 seconds, the notification disappears (CSS `show` class is removed).

---

### TC-8.2 – Notification is overwritten by a subsequent action

**Preconditions:** Fresh state.

**Steps:**
1. Look up an empty Order ID (error toast shows `"Please enter an order ID"`).
2. Immediately (within the 3-second window) look up a non-existent ID `"order-000000"`.

**Expected outcomes:**
- The second notification `"Order not found: ..."` replaces the first without stacking.
- Only one notification element is visible at a time.

---

### TC-8.3 – Order placement fails gracefully when API is unavailable

**Preconditions:** Fresh state; network route to `/api/orders` (POST) is intercepted to return HTTP 500.

**Steps:**
1. Add Margherita Pizza ×1.
2. Enter name `"Frank"`.
3. Click `"Place Order"`.

**Expected outcomes:**
- An error notification appears (e.g., `"Failed to place order: ..."` or `"Error placing order"`).
- The cart and name field are **not** cleared (user can retry).
- No order-details panel appears.

---

### TC-8.4 – Order lookup fails gracefully when API is unavailable

**Preconditions:** Network route to `/api/orders/:id` (GET) is intercepted to return HTTP 500.

**Steps:**
1. Enter any string in `"Order ID:"`.
2. Click `"Look Up Order"`.

**Expected outcomes:**
- Error notification appears: `"Error looking up order"` (or similar).
- Order-details panel remains hidden.

---

### TC-8.5 – Menu fails to load gracefully when API is unavailable

**Preconditions:** Network route to `/api/daily-menu` is intercepted to return HTTP 500 before page load.

**Steps:**
1. Intercept `/api/daily-menu` to return 500.
2. Navigate to `http://localhost:3000`.

**Expected outcomes:**
- An error notification `"Failed to load menu"` or `"Error loading menu"` appears.
- The menu grid is empty; no JS exception crashes the page.

---

### TC-8.6 – Very long customer name is handled

**Preconditions:** Fresh state.

**Steps:**
1. Add Margherita Pizza ×1.
2. Type a 255-character string into `"Your Name:"`.
3. Click `"Place Order"`.

**Expected outcomes:**
- Order is placed successfully (server accepts the name), OR a meaningful validation error is shown — the page does not crash.
- If successful, the customer name in order details matches the entered string.

---

### TC-8.7 – HTML/script content in customer name does not execute (XSS)

**Preconditions:** Fresh state.

**Steps:**
1. Add Margherita Pizza ×1.
2. Type `<img src=x onerror=alert(1)>` into `"Your Name:"`.
3. Click `"Place Order"`.
4. Observe the order-details panel.

**Expected outcomes:**
- No alert dialog fires.
- The customer name value is displayed as escaped text (e.g., `&lt;img...&gt;`), confirming output encoding is applied.

---

### TC-8.8 – Rapid consecutive clicks on Place Order do not duplicate the order

**Preconditions:** Fresh state; cart has Margherita ×1, name is `"Grace"`.

**Steps:**
1. Click `"Place Order"` three times in rapid succession.

**Expected outcomes:**
- Only one order is created (confirmed by a single unique Order ID in the notification).
- The button becomes disabled after the first successful click (cart clears, re-enabling conditions not met).

---

### TC-8.9 – Decrement below zero is a no-op (boundary)

**Preconditions:** All menu quantities are `0`.

**Steps:**
1. Click `−` on every pizza five times each.

**Expected outcomes:**
- All quantity displays remain at `0`.
- Cart stays empty.
- `"Total Items: 0"`.
- No errors or exceptions in the console.

---

### TC-8.10 – Order ID input accepts the full generated ID format

**Preconditions:** An order has been placed and its ID is known (e.g., `"order-abc123"`).

**Steps:**
1. Clear the `"Order ID:"` field.
2. Paste the full Order ID.
3. Click `"Look Up Order"`.

**Expected outcomes:**
- Order is found and details are displayed correctly.

---

### TC-8.11 – Case sensitivity of Order ID lookup

**Preconditions:** An order with a known ID exists.

**Steps:**
1. Enter the Order ID in uppercase into the Order ID field.
2. Click `"Look Up Order"`.

**Expected outcomes:**
- Document the behavior: either the order is found (case-insensitive server) or an `"Order not found"` error appears (case-sensitive server).
- Neither outcome should crash the application.

---

### TC-8.12 – Page remains functional after multiple order placements

**Preconditions:** Fresh state.

**Steps:**
1. Place five consecutive orders (different names, different items).
2. After each order, verify the cart resets and a new order can be started.

**Expected outcomes:**
- Each order placement succeeds and returns a unique Order ID.
- The page does not degrade in performance or display anomalies after repeated use.

---

## Appendix A – Test Environment Requirements

| Requirement | Value |
|---|---|
| Application URL | `http://localhost:3000` |
| Playwright version | As defined in `package.json` |
| Browsers | Chromium, Firefox, WebKit (see `playwright.config.ts`) |
| Node.js | ≥ 18 |
| Test directory | `tests/` |
| Base timeout | 30 000 ms (default) |

## Appendix B – API Endpoints Referenced

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/daily-menu` | Load pizza menu |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/:id` | Look up an order |
| `PUT` | `/api/orders/:id` | Update order status |

## Appendix C – Test Coverage Summary

| Suite | # Test Cases | Types |
|---|---|---|
| 1 – Page Load & Layout | 5 | Positive, Accessibility, UX |
| 2 – Dark/Light Theme Toggle | 5 | Positive, Persistence, Accessibility |
| 3 – Menu – Quantity Controls | 7 | Positive, Boundary, Negative |
| 4 – Cart Management | 7 | Positive, Negative, Edge |
| 5 – Order Placement | 7 | Positive, Edge |
| 6 – Order Lookup | 6 | Positive, Negative, Edge |
| 7 – Order Status Lifecycle | 8 | Positive, State machine |
| 8 – Error Handling & Edge Cases | 12 | Negative, Security, Boundary |
| **Total** | **57** | |
