# Awesome Pizza Test Plan

## Application Overview

Awesome Pizza is a web-based pizza ordering application. It features a daily menu of 5 pizzas with quantity controls, a shopping cart, an order submission form (requiring a customer name), and an order management section where users can look up orders by ID and progress order statuses (RECEIVED → DELIVERING → DELIVERED, or cancel). The UI also supports a dark/light theme toggle. The backend is an Express REST API with endpoints for menu retrieval, order creation (POST /api/orders), order lookup (GET /api/orders/:id), and order updates (PUT /api/orders/:id).

## Test Scenarios

### 1. Menu Display

**Seed:** `tests/seed.spec.ts`

#### 1.1. Menu loads and displays all pizza items

**File:** `tests/menu/menu-display.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The page title is 'Awesome Pizza - Order Online'
    - expect: The 'Today's Menu' section is visible
    - expect: Exactly 5 pizza cards are rendered: Margherita Pizza, Pepperoni Pizza, Quattro Stagioni, Vegetarian Delight, BBQ Chicken Pizza
  2. Inspect each pizza card
    - expect: Each card shows an image, a name heading, and a description paragraph
    - expect: Each card shows quantity control buttons (− and +) and a quantity display starting at 0

#### 1.2. Pizza images fall back gracefully when not found

**File:** `tests/menu/menu-image-fallback.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 with the network request for pizza images blocked
    - expect: Pizza cards are still displayed
    - expect: A fallback SVG placeholder image is rendered instead of the broken image

### 2. Cart Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. Add a single pizza to the cart

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The cart shows 'Your cart is empty' and Total Items: 0
  2. Click the '+' button on the Margherita Pizza card once
    - expect: The quantity display on the Margherita Pizza card changes to 1
    - expect: The cart section now shows a cart item row with name 'Margherita Pizza' and Quantity: 1
    - expect: Total Items shows 1

#### 2.2. Add multiple different pizzas to the cart

**File:** `tests/cart/add-multiple-items.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: Cart is empty
  2. Click '+' on Margherita Pizza twice, then '+' on Pepperoni Pizza once
    - expect: Margherita Pizza quantity shows 2
    - expect: Pepperoni Pizza quantity shows 1
    - expect: Cart shows 2 distinct item rows
    - expect: Total Items shows 3

#### 2.3. Decrease pizza quantity with the minus button

**File:** `tests/cart/decrease-quantity.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 and click '+' on Pepperoni Pizza twice
    - expect: Pepperoni Pizza quantity shows 2
  2. Click '−' on Pepperoni Pizza once
    - expect: Pepperoni Pizza quantity shows 1
    - expect: Cart reflects Quantity: 1
    - expect: Total Items shows 1

#### 2.4. Remove a pizza from cart when quantity reaches zero

**File:** `tests/cart/remove-item-on-zero.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 and click '+' on Quattro Stagioni once
    - expect: Quattro Stagioni appears in the cart
  2. Click '−' on Quattro Stagioni once
    - expect: Quattro Stagioni quantity on its card shows 0
    - expect: Quattro Stagioni is removed from the cart
    - expect: Cart shows 'Your cart is empty'
    - expect: Total Items shows 0

#### 2.5. Remove a cart item via the Remove button

**File:** `tests/cart/remove-button.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, click '+' on BBQ Chicken Pizza twice
    - expect: BBQ Chicken Pizza appears in cart with Quantity: 2
  2. Click the 'Remove' button next to BBQ Chicken Pizza in the cart
    - expect: BBQ Chicken Pizza is removed from the cart
    - expect: The quantity display on the BBQ Chicken Pizza card resets to 0
    - expect: Cart shows 'Your cart is empty'
    - expect: Total Items shows 0

#### 2.6. Minus button does not decrease quantity below zero

**File:** `tests/cart/no-negative-quantity.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: All pizza quantities show 0
  2. Click '−' on Vegetarian Delight when quantity is 0
    - expect: Vegetarian Delight quantity remains 0
    - expect: Cart remains empty
    - expect: Total Items remains 0

### 3. Place Order

**Seed:** `tests/seed.spec.ts`

#### 3.1. Place Order button is disabled until name and cart are both filled

**File:** `tests/order/place-order-button-state.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: Place Order button is disabled
  2. Enter 'Alice' in the Your Name field without adding any items
    - expect: Place Order button remains disabled
  3. Clear the name field, then click '+' on Margherita Pizza once
    - expect: Place Order button remains disabled
  4. Enter 'Alice' in the Your Name field (cart still has Margherita x1)
    - expect: Place Order button becomes enabled

#### 3.2. Successfully place an order

**File:** `tests/order/place-order-success.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, add Margherita Pizza x1 and Pepperoni Pizza x2 to the cart, enter 'Alice' in Your Name
    - expect: Place Order button is enabled
  2. Click 'Place Order'
    - expect: A success notification appears containing 'Order placed successfully!' and a new Order ID
    - expect: The cart is cleared (shows 'Your cart is empty')
    - expect: The Your Name field is cleared
    - expect: The Order ID input field is auto-populated with the new order ID
    - expect: The order details panel is displayed showing the sender as 'Alice', status badge 'RECEIVED', and order items Margherita x1 and Pepperoni x2

#### 3.3. Placing an order without a name shows an error

**File:** `tests/order/place-order-no-name.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, add Margherita Pizza x1 to the cart but leave the name field empty
    - expect: Place Order button is disabled — the test verifies the button cannot be clicked
  2. Programmatically enable and click the Place Order button with an empty name
    - expect: An error notification appears with message 'Please enter your name'

#### 3.4. Placing an order with an empty cart shows an error

**File:** `tests/order/place-order-empty-cart.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 and enter 'Bob' in the Your Name field without adding items
    - expect: Place Order button is disabled — the test verifies the button cannot be clicked
  2. Programmatically enable and click the Place Order button with an empty cart
    - expect: An error notification appears with message 'Please add items to your cart'

### 4. Order Lookup

**Seed:** `tests/seed.spec.ts`

#### 4.1. Look up an existing order by ID

**File:** `tests/order-lookup/lookup-existing-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, enter 'order-001' in the Order ID field
    - expect: Order ID field contains 'order-001'
  2. Click 'Look Up Order'
    - expect: A success notification 'Order found' appears
    - expect: Order details panel becomes visible
    - expect: Customer shows 'John Doe'
    - expect: Status badge shows 'RECEIVED'
    - expect: Order items list shows Margherita Pizza ×2 and Pepperoni Pizza ×1

#### 4.2. Look up an order with DELIVERING status

**File:** `tests/order-lookup/lookup-delivering-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, enter 'order-002' in the Order ID field and click 'Look Up Order'
    - expect: Order details show sender 'Jane Smith'
    - expect: Status badge shows 'DELIVERING'
    - expect: No 'Mark as Delivering' or 'Cancel Order' action buttons are shown
    - expect: A 'Mark as Delivered' button is shown

#### 4.3. Look up an order with DELIVERED status

**File:** `tests/order-lookup/lookup-delivered-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, enter 'order-003' in the Order ID field and click 'Look Up Order'
    - expect: Order details show sender 'Mike Johnson'
    - expect: Status badge shows 'DELIVERED'
    - expect: No status-change action buttons are shown

#### 4.4. Look up a non-existent order ID

**File:** `tests/order-lookup/lookup-nonexistent-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, enter 'order-999' in the Order ID field and click 'Look Up Order'
    - expect: An error notification appears indicating the order was not found
    - expect: The order details panel remains hidden

#### 4.5. Lookup with empty Order ID field shows error

**File:** `tests/order-lookup/lookup-empty-id.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, leave the Order ID field empty and click 'Look Up Order'
    - expect: An error notification appears with message 'Please enter an order ID'
    - expect: No order details are shown

#### 4.6. Lookup triggered via Enter key

**File:** `tests/order-lookup/lookup-enter-key.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, type 'order-001' in the Order ID field and press Enter
    - expect: The order lookup is triggered without clicking the button
    - expect: Order details for order-001 are displayed

### 5. Order Status Management

**Seed:** `tests/seed.spec.ts`

#### 5.1. Advance order status from RECEIVED to DELIVERING

**File:** `tests/order-status/received-to-delivering.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, place a new order for 'Alice' with Margherita Pizza x1
    - expect: Order is created with status RECEIVED
    - expect: Order details panel shows 'Mark as Delivering' and 'Cancel Order' buttons
  2. Click 'Mark as Delivering'
    - expect: A success notification 'Order status updated to DELIVERING' appears
    - expect: Status badge updates to 'DELIVERING'
    - expect: 'Mark as Delivering' and 'Cancel Order' buttons disappear
    - expect: 'Mark as Delivered' button appears

#### 5.2. Advance order status from DELIVERING to DELIVERED

**File:** `tests/order-status/delivering-to-delivered.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, look up 'order-002' (status: DELIVERING)
    - expect: Order details show status DELIVERING with 'Mark as Delivered' button
  2. Click 'Mark as Delivered'
    - expect: Success notification 'Order status updated to DELIVERED' appears
    - expect: Status badge updates to 'DELIVERED'
    - expect: No further action buttons are shown

#### 5.3. Cancel a RECEIVED order

**File:** `tests/order-status/cancel-received-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000, place a new order for 'Bob' with Pepperoni Pizza x1
    - expect: Order is created with status RECEIVED and 'Cancel Order' button is visible
  2. Click 'Cancel Order'
    - expect: Success notification 'Order status updated to CANCELED' appears
    - expect: Status badge updates to 'CANCELED'
    - expect: No action buttons are shown

### 6. Theme Toggle

**Seed:** `tests/seed.spec.ts`

#### 6.1. Toggle to dark theme and persist across reload

**File:** `tests/theme/dark-theme-toggle.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The page loads in light theme
    - expect: The theme toggle button shows '🌙'
  2. Click the theme toggle button
    - expect: The page switches to dark theme (data-theme='dark' on <html>)
    - expect: The toggle button now shows '☀️'
  3. Reload the page
    - expect: Dark theme is restored from localStorage
    - expect: The toggle button shows '☀️'

#### 6.2. Toggle back from dark to light theme

**File:** `tests/theme/light-theme-toggle.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000 and click the theme toggle once to activate dark mode
    - expect: Page is in dark theme
  2. Click the theme toggle button again
    - expect: The page returns to light theme (data-theme attribute removed)
    - expect: The toggle button shows '🌙'
    - expect: localStorage theme value is 'light'
