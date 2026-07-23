# Awesome Pizza Test Plan

## Application Overview

Awesome Pizza is a pizza ordering web application with a Node.js/Express backend and vanilla JS frontend. It allows customers to browse the daily menu, add items to a cart, place orders, and track order status. The backend exposes REST API endpoints for menus, orders (CRUD), and protected admin routes requiring bearer token authentication. Order statuses flow: RECEIVED → DELIVERING → DELIVERED or CANCELED.

## Test Scenarios

### 1. Menu Display

**Seed:** `tests/seed.spec.ts`

#### 1.1. Daily menu loads and displays all items on page load

**File:** `tests/menu/menu-display.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The page title is 'Awesome Pizza - Order Online'
    - expect: The 'Today's Menu' heading is visible
    - expect: Five pizza items are displayed: Margherita Pizza, Pepperoni Pizza, Quattro Stagioni, Vegetarian Delight, BBQ Chicken Pizza
  2. Inspect each menu item card
    - expect: Each item shows a name heading, description text, a pizza image, and quantity control buttons (− and +)
    - expect: All quantity displays start at 0

#### 1.2. Menu item images fall back gracefully when image fails to load

**File:** `tests/menu/menu-image-fallback.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Intercept image requests to return a 404 error, then reload the page
    - expect: A placeholder SVG image is rendered in place of each broken image
    - expect: No broken image icons are shown

### 2. Cart Interactions

**Seed:** `tests/seed.spec.ts`

#### 2.1. Adding items to the cart updates the cart display and total

**File:** `tests/cart/add-items.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The cart shows 'Your cart is empty' and Total Items is 0
  2. Click the '+' button next to Margherita Pizza twice
    - expect: The quantity display next to Margherita Pizza shows 2
    - expect: The cart section shows 'Margherita Pizza' with Quantity: 2
    - expect: Total Items shows 2
  3. Click the '+' button next to Pepperoni Pizza once
    - expect: The quantity display next to Pepperoni Pizza shows 1
    - expect: The cart section shows 'Pepperoni Pizza' with Quantity: 1
    - expect: Total Items shows 3

#### 2.2. Decrementing quantity below 1 removes item from cart

**File:** `tests/cart/remove-by-decrement.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click '+' once for Margherita Pizza, then click '−' once for Margherita Pizza
    - expect: Margherita Pizza is no longer shown in the cart
    - expect: Total Items shows 0
    - expect: The cart shows 'Your cart is empty'

#### 2.3. Clicking the Remove button on a cart item removes it from the cart

**File:** `tests/cart/remove-button.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click '+' once for Quattro Stagioni and once for Vegetarian Delight
    - expect: Both items appear in the cart
  3. Click the 'Remove' button next to Quattro Stagioni in the cart
    - expect: Quattro Stagioni is removed from the cart
    - expect: Vegetarian Delight remains in the cart
    - expect: Total Items shows 1
    - expect: The quantity display for Quattro Stagioni in the menu resets to 0

#### 2.4. The '−' button cannot reduce quantity below zero

**File:** `tests/cart/decrement-below-zero.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click the '−' button next to BBQ Chicken Pizza (quantity is currently 0)
    - expect: The quantity display for BBQ Chicken Pizza remains 0
    - expect: The cart remains empty
    - expect: Total Items remains 0

### 3. Place Order

**Seed:** `tests/seed.spec.ts`

#### 3.1. Place Order button is disabled until both name and cart items are provided

**File:** `tests/order/place-order-button-state.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: The 'Place Order' button is disabled
  2. Type 'Alice' into the 'Your Name' field
    - expect: The 'Place Order' button remains disabled (cart is empty)
  3. Click '+' once for Margherita Pizza
    - expect: The 'Place Order' button becomes enabled
  4. Clear the 'Your Name' field
    - expect: The 'Place Order' button becomes disabled again

#### 3.2. Successfully place an order clears cart and shows order ID

**File:** `tests/order/place-order-success.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'Bob' into the 'Your Name' field
  3. Click '+' twice for Pepperoni Pizza and once for Vegetarian Delight
  4. Click the 'Place Order' button
    - expect: A success notification appears containing the text 'Order placed successfully! Order ID:'
    - expect: The cart is cleared and shows 'Your cart is empty'
    - expect: The 'Your Name' field is empty
    - expect: Total Items shows 0
    - expect: The 'Place Order' button is disabled
    - expect: The Order Management section shows the order details for the newly created order
    - expect: The order details show sender 'Bob', status 'RECEIVED', and the correct items

#### 3.3. Placing an order without a name shows an error notification

**File:** `tests/order/place-order-no-name.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click '+' once for Margherita Pizza
  3. Programmatically enable the Place Order button and click it without a name entered
    - expect: An error notification appears with 'Please enter your name'
    - expect: No order is placed

#### 3.4. Placing an order with an empty cart shows an error notification

**File:** `tests/order/place-order-empty-cart.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'Charlie' in the 'Your Name' field
  3. Programmatically enable the Place Order button and click it with no items in the cart
    - expect: An error notification appears with 'Please add items to your cart'
    - expect: No order is placed

### 4. Order Management - Lookup

**Seed:** `tests/seed.spec.ts`

#### 4.1. Looking up an existing order by ID displays order details

**File:** `tests/order-management/lookup-existing-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'order-001' in the 'Order ID' field and click 'Look Up Order'
    - expect: A success notification 'Order found' appears
    - expect: The order details panel becomes visible
    - expect: Order ID shows 'order-001'
    - expect: Customer shows 'John Doe'
    - expect: Status badge shows 'RECEIVED'
    - expect: Order items list shows 'Margherita Pizza ×2' and 'Pepperoni Pizza ×1'
    - expect: Buttons 'Mark as Delivering' and 'Cancel Order' are visible

#### 4.2. Looking up a non-existent order ID shows an error notification

**File:** `tests/order-management/lookup-not-found.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'order-does-not-exist' in the 'Order ID' field and click 'Look Up Order'
    - expect: An error notification appears indicating the order was not found
    - expect: The order details panel is not visible

#### 4.3. Submitting an empty Order ID field shows an error notification

**File:** `tests/order-management/lookup-empty-id.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Leave the 'Order ID' field empty and click 'Look Up Order'
    - expect: An error notification appears with 'Please enter an order ID'
    - expect: No API request is made for order lookup

#### 4.4. Pressing Enter in the Order ID field triggers the order lookup

**File:** `tests/order-management/lookup-enter-key.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click the 'Order ID' text field, type 'order-002', then press the Enter key
    - expect: The order lookup is triggered
    - expect: Order details for 'order-002' are displayed with status 'DELIVERING'

#### 4.5. Order with DELIVERING status shows only 'Mark as Delivered' button

**File:** `tests/order-management/lookup-delivering-status.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'order-002' in the 'Order ID' field and click 'Look Up Order'
    - expect: Order details show status 'DELIVERING'
    - expect: Only the 'Mark as Delivered' button is visible
    - expect: No 'Cancel Order' or 'Mark as Delivering' buttons are shown

#### 4.6. Order with DELIVERED status shows no status update buttons

**File:** `tests/order-management/lookup-delivered-status.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Type 'order-003' in the 'Order ID' field and click 'Look Up Order'
    - expect: Order details show status 'DELIVERED'
    - expect: No status update buttons are shown

### 5. Order Status Updates

**Seed:** `tests/seed.spec.ts`

#### 5.1. Mark a RECEIVED order as Delivering

**File:** `tests/order-management/update-to-delivering.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Look up 'order-001' and wait for order details to appear
    - expect: Status shows 'RECEIVED' and 'Mark as Delivering' button is visible
  3. Click 'Mark as Delivering'
    - expect: A success notification appears: 'Order status updated to DELIVERING'
    - expect: The status badge updates to 'DELIVERING'
    - expect: The 'Mark as Delivered' button is now visible
    - expect: The 'Mark as Delivering' and 'Cancel Order' buttons are no longer shown

#### 5.2. Mark a DELIVERING order as Delivered

**File:** `tests/order-management/update-to-delivered.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Look up 'order-002' and wait for order details to appear
    - expect: Status shows 'DELIVERING' and 'Mark as Delivered' button is visible
  3. Click 'Mark as Delivered'
    - expect: A success notification appears: 'Order status updated to DELIVERED'
    - expect: The status badge updates to 'DELIVERED'
    - expect: No status update buttons are displayed

#### 5.3. Cancel a RECEIVED order

**File:** `tests/order-management/cancel-order.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Place a new order with name 'Dave' and one Margherita Pizza, then look up the returned order ID
    - expect: Order details appear with status 'RECEIVED'
  3. Click 'Cancel Order'
    - expect: A success notification appears: 'Order status updated to CANCELED'
    - expect: The status badge updates to 'CANCELED'
    - expect: No status update buttons are displayed

### 6. Theme Toggle

**Seed:** `tests/seed.spec.ts`

#### 6.1. Toggling theme switches between light and dark mode

**File:** `tests/theme/theme-toggle.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
    - expect: Page is in light mode; the theme toggle button shows '🌙'
  2. Click the theme toggle button (🌙)
    - expect: The page switches to dark mode (data-theme='dark' is set on the html element)
    - expect: The toggle button now shows '☀️'
  3. Click the theme toggle button again (☀️)
    - expect: The page returns to light mode (data-theme attribute is removed)
    - expect: The toggle button shows '🌙' again

#### 6.2. Dark mode preference persists across page reloads

**File:** `tests/theme/theme-persistence.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000
  2. Click the theme toggle button to switch to dark mode
    - expect: Dark mode is active and localStorage key 'theme' is set to 'dark'
  3. Reload the page
    - expect: The page loads in dark mode
    - expect: The toggle button shows '☀️'

### 7. API - Daily Menu

**Seed:** `tests/seed.spec.ts`

#### 7.1. GET /api/daily-menu returns the menu successfully

**File:** `tests/api/daily-menu.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/daily-menu
    - expect: Response status is 200
    - expect: Response body has success: true
    - expect: Response body data array contains exactly 5 items
    - expect: Each item has name, description, and imageUrl fields

### 8. API - Get Order

**Seed:** `tests/seed.spec.ts`

#### 8.1. GET /api/orders/:id returns an existing order

**File:** `tests/api/get-order.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/orders/order-001
    - expect: Response status is 200
    - expect: Response body has success: true
    - expect: Response data.id is 'order-001'
    - expect: Response data.sender is 'John Doe'
    - expect: Response data.status is 'RECEIVED'

#### 8.2. GET /api/orders/:id returns 404 for a non-existent order

**File:** `tests/api/get-order-not-found.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/orders/order-nonexistent
    - expect: Response status is 404
    - expect: Response body has success: false
    - expect: Response body contains an error message indicating the order was not found

### 9. API - Create Order

**Seed:** `tests/seed.spec.ts`

#### 9.1. POST /api/orders creates a new order with valid data

**File:** `tests/api/create-order.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { sender: 'Test User', contents: [{ name: 'Margherita Pizza', quantity: 2 }] }
    - expect: Response status is 201
    - expect: Response body has success: true
    - expect: Response data contains an auto-generated id
    - expect: Response data.sender is 'Test User'
    - expect: Response data.status is 'RECEIVED'
    - expect: Response data.contents matches the submitted items

#### 9.2. POST /api/orders returns 400 when sender is missing

**File:** `tests/api/create-order-missing-sender.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { contents: [{ name: 'Pepperoni Pizza', quantity: 1 }] }
    - expect: Response status is 400
    - expect: Response body has success: false
    - expect: Response message indicates sender is required

#### 9.3. POST /api/orders returns 400 when sender is an empty string

**File:** `tests/api/create-order-empty-sender.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { sender: '   ', contents: [{ name: 'Pepperoni Pizza', quantity: 1 }] }
    - expect: Response status is 400
    - expect: Response body has success: false

#### 9.4. POST /api/orders returns 400 when contents array is empty

**File:** `tests/api/create-order-empty-contents.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { sender: 'Test User', contents: [] }
    - expect: Response status is 400
    - expect: Response body has success: false
    - expect: Response message indicates contents must be a non-empty array

#### 9.5. POST /api/orders returns 400 when a content item has an invalid quantity

**File:** `tests/api/create-order-invalid-quantity.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { sender: 'Test User', contents: [{ name: 'Margherita Pizza', quantity: -1 }] }
    - expect: Response status is 400
    - expect: Response body has success: false
    - expect: Response message indicates each item must have a valid positive quantity

#### 9.6. POST /api/orders returns 400 when a content item name is missing

**File:** `tests/api/create-order-missing-item-name.spec.ts`

**Steps:**
  1. Send a POST request to http://localhost:3000/api/orders with body: { sender: 'Test User', contents: [{ name: '', quantity: 1 }] }
    - expect: Response status is 400
    - expect: Response body has success: false
    - expect: Response message indicates each item must have a valid name

### 10. API - Update Order

**Seed:** `tests/seed.spec.ts`

#### 10.1. PUT /api/orders/:id returns 401 without an authorization token

**File:** `tests/api/update-order-unauthorized.spec.ts`

**Steps:**
  1. Send a PUT request to http://localhost:3000/api/orders/order-001 with body: { status: 'DELIVERING' } and no Authorization header
    - expect: Response status is 401
    - expect: Response body has success: false
    - expect: Response message indicates a valid token is required

#### 10.2. PUT /api/orders/:id updates order status with a valid token

**File:** `tests/api/update-order-success.spec.ts`

**Steps:**
  1. First, POST to /api/orders to create a fresh order (to avoid affecting other tests)
    - expect: 201 response with new order ID
  2. Send a PUT request to http://localhost:3000/api/orders/{newId} with Authorization header 'Bearer eyJyb2xlIjoiYWRtaW4ifQ==' and body: { status: 'DELIVERING' }
    - expect: Response status is 200
    - expect: Response body has success: true
    - expect: Response data.status is 'DELIVERING'

#### 10.3. PUT /api/orders/:id returns 404 for a non-existent order

**File:** `tests/api/update-order-not-found.spec.ts`

**Steps:**
  1. Send a PUT request to http://localhost:3000/api/orders/order-not-exist with Authorization header 'Bearer eyJyb2xlIjoiYWRtaW4ifQ==' and body: { status: 'DELIVERING' }
    - expect: Response status is 404
    - expect: Response body has success: false

#### 10.4. PUT /api/orders/:id returns 400 for an invalid status value

**File:** `tests/api/update-order-invalid-status.spec.ts`

**Steps:**
  1. Send a PUT request to http://localhost:3000/api/orders/order-001 with Authorization header 'Bearer eyJyb2xlIjoiYWRtaW4ifQ==' and body: { status: 'INVALID_STATUS' }
    - expect: Response status is 400
    - expect: Response body has success: false
    - expect: Response message lists valid statuses: RECEIVED, DELIVERING, DELIVERED, CANCELED

### 11. API - Protected & Admin Routes

**Seed:** `tests/seed.spec.ts`

#### 11.1. GET /api/protected returns 200 with a valid bearer token

**File:** `tests/api/protected-route.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/protected with Authorization header 'Bearer eyJyb2xlIjoiYWRtaW4ifQ=='
    - expect: Response status is 200
    - expect: Response body has success: true and message 'Access granted to protected route'

#### 11.2. GET /api/protected returns 401 with no token

**File:** `tests/api/protected-route-no-token.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/protected with no Authorization header
    - expect: Response status is 401
    - expect: Response body has success: false

#### 11.3. GET /api/admin returns 200 with a valid admin token

**File:** `tests/api/admin-route.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/admin with Authorization header 'Bearer eyJyb2xlIjoiYWRtaW4ifQ=='
    - expect: Response status is 200
    - expect: Response body has success: true and message 'Welcome, admin!'

#### 11.4. GET /api/admin returns 403 with a non-admin token

**File:** `tests/api/admin-route-non-admin.spec.ts`

**Steps:**
  1. Encode a payload {"role":"user"} as base64 and send a GET request to http://localhost:3000/api/admin with that token as the Bearer
    - expect: Response status is 403
    - expect: Response body has success: false and message 'Not authorised'

#### 11.5. GET /api/admin returns 401 with no token

**File:** `tests/api/admin-route-no-token.spec.ts`

**Steps:**
  1. Send a GET request to http://localhost:3000/api/admin with no Authorization header
    - expect: Response status is 401
    - expect: Response body has success: false and message 'Token required'
