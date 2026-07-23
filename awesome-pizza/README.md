# Awesome Pizza API

A RESTful API for managing daily menu and pizza orders built with Express.js and TypeScript.

## Features

- **Daily Menu API**: Get the current pizza menu
- **Orders API**: Full CRUD operations for pizza orders
- **In-memory Database**: Fast development and testing
- **TypeScript**: Type-safe development
- **CORS Support**: Ready for frontend integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript

## API Endpoints

### Daily Menu

#### GET /api/daily-menu
Returns the current daily pizza menu.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Margherita Pizza",
      "description": "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
      "imageUrl": "https://example.com/margherita.jpg"
    }
  ],
  "message": "Daily menu retrieved successfully"
}
```

### Orders

#### GET /api/orders/:id
Get a specific order by ID.

**Parameters:**
- `id` (string) - Order ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "name": "John Doe",
    "status": "RECEIVED",
    "contents": [
      {
        "name": "Margherita Pizza",
        "quantity": 2
      }
    ]
  },
  "message": "Order retrieved successfully"
}
```

#### POST /api/orders
Create a new order.

**Body:**
```json
{
  "name": "Customer Name",
  "contents": [
    {
      "name": "Pizza Name",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-1698123456789-123",
    "name": "Customer Name",
    "status": "RECEIVED",
    "contents": [
      {
        "name": "Pizza Name",
        "quantity": 2
      }
    ]
  },
  "message": "Order created successfully"
}
```

#### PUT /api/orders/:id
Update an existing order.

**Parameters:**
- `id` (string) - Order ID

**Body (all fields optional):**
```json
{
  "name": "Updated Customer Name",
  "status": "DELIVERING",
  "contents": [
    {
      "name": "Updated Pizza Name",
      "quantity": 3
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "name": "Updated Customer Name",
    "status": "DELIVERING",
    "contents": [
      {
        "name": "Updated Pizza Name",
        "quantity": 3
      }
    ]
  },
  "message": "Order updated successfully"
}
```

## Data Models

### Menu Entry
```typescript
type menu_entry = {
    name: string,
    description: string,
    imageUrl: string
}
```

### Order
```typescript
type order = {
    id: string,
    name: string,
    status: 'RECEIVED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'
    contents: {
        name: string,
        quantity: number
    }[]
}
```

## Order Status

Orders have four possible statuses:
- `RECEIVED` - Order has been received and is being prepared
- `DELIVERING` - Order is out for delivery
- `DELIVERED` - Order has been successfully delivered
- `CANCELED` - Order has been canceled

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

The API uses an in-memory database for simplicity. Data will be reset when the server restarts. For production use, consider integrating with a persistent database like PostgreSQL or MongoDB.

## Testing the API

You can test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)
- Any HTTP client

Example curl commands:

```bash
# Get daily menu
curl http://localhost:3000/api/daily-menu

# Get order by ID
curl http://localhost:3000/api/orders/order-001

# Create new order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "contents": [
      {"name": "Margherita Pizza", "quantity": 1}
    ]
  }'

# Update order status
curl -X PUT http://localhost:3000/api/orders/order-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "DELIVERING"}'
```