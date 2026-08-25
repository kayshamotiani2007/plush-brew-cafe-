# Order Receipt Implementation Guide

## Database Schema (`backend/config/db.js`)

The `plush_brew_db` database includes these tables for order management:

### orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(64) | Primary key - Order ID (e.g., ORD-12345) |
| user_id | INT | Foreign key to users table (nullable) |
| customer_name | VARCHAR(255) | Name of customer |
| customer_email | VARCHAR(255) | Customer email for receipt |
| order_type | ENUM | 'Online' or 'Walk-in' |
| subtotal | DECIMAL(10,2) | Order subtotal before GST |
| gst | DECIMAL(10,2) | 18% GST amount |
| total | DECIMAL(10,2) | Final total including GST |
| special_instructions | TEXT | Custom notes for kitchen |
| estimated_prep_time | VARCHAR(64) | Default '20-25 minutes' |
| status | ENUM | 'Received', 'In Progress', 'Served', 'Cancelled' |
| created_at | TIMESTAMP | Auto-set on creation |

### order_items Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| order_id | VARCHAR(64) | Foreign key to orders |
| item_id | VARCHAR(255) | Menu item identifier |
| item_name | VARCHAR(255) | Name of menu item |
| quantity | INT | Quantity ordered |
| unit_price | DECIMAL(10,2) | Price per unit |
| customization | JSON | Custom options (sweetness, ice, toppings) |

## API Endpoints

### POST /api/orders
Creates a new order receipt.

**Request Body:**
```json
{
  "customerName": "Rahul Sharma",
  "customerEmail": "rahul@example.com",
  "orderType": "Online",
  "items": [
    {
      "item": { "id": "matcha", "name": "Strawberry Cloud Matcha", "price": 360 },
      "quantity": 1,
      "customization": { "sweetness": "Normal", "ice": "Normal" }
    }
  ],
  "subtotal": 360,
  "gst": 64.80,
  "total": 424.80,
  "specialInstructions": "Extra hot"
}
```

**Response:**
```json
{
  "order": { "id": "ORD-12345", ... },
  "items": [{ "item_name": "Strawberry Cloud Matcha", "quantity": 1, "unit_price": 360 }]
}
```

### GET /api/admin/data
Fetches all admin data including orders with items populated.

**Authentication:** Requires admin token via `plush_brew_auth_token` header.

**Response includes:**
- `orders` - Array of orders with items array for each order

### PATCH /api/orders/:id/status
Updates order status in the queue.

**Request Body:**
```json
{ "status": "In Progress" }
```

## Frontend Integration

### Order Queue Display (AdminPanel.tsx)
- Tab: "Orders Queue" - shows all orders from the database
- Columns: ID, Type, Customer, Date/Time, Value, Status
- Status dropdown allows updating order to 'Received' → 'In Progress' → 'Served'

### Data Flow
1. User submits order → `createOrder()` API call
2. Backend saves to MySQL `orders` and `order_items` tables
3. Admin panel polls `/api/admin/data` to fetch queue
4. Orders displayed with real-time updates via Socket.IO

## SQL Queries

### Insert Order
```sql
INSERT INTO orders (id, user_id, customer_name, customer_email, order_type, subtotal, gst, total, special_instructions)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

INSERT INTO order_items (order_id, item_id, item_name, quantity, unit_price, customization)
VALUES (?, ?, ?, ?, ?, ?);
```

### Fetch Orders Queue
```sql
SELECT o.*, oi.* 
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;
```

### Update Order Status
```sql
UPDATE orders SET status = ? WHERE id = ?;
```