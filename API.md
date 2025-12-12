# 🔌 API Documentation

Base URL: `http://localhost:5000/api`

All endpoints except `/login` require `Authorization: authenticated` header.

---

## Authentication

### POST /login
Login with credentials

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Items

### GET /items
Get all items (without logs for performance)

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [...]
}
```

### GET /items/:id
Get single item with complete stock logs

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Wireless Keyboard",
    "category": "Electronics",
    "stock": 42,
    "details": { "brand": "Logitech", "color": "Black" },
    "stock_logs": [...]
  }
}
```

### POST /items
Create new item

**Request:**
```json
{
  "name": "Monitor",
  "category": "Electronics",
  "stock": 15,
  "details": {
    "brand": "Dell",
    "color": "Black"
  }
}
```

### PUT /items/:id
Update item details

**Request:**
```json
{
  "name": "Updated Name",
  "category": "Electronics",
  "details": { "brand": "NewBrand" }
}
```

### DELETE /items/:id
Delete item

**Response:**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### POST /items/:id/stock ⭐
**Atomic stock update** - Most important endpoint

**Request:**
```json
{
  "change": -5,
  "reason": "Sold 5 units"
}
```

**Implementation:**
```javascript
// Uses $inc and $push atomically
{
  $inc: { stock: change },
  $push: { stock_logs: { change, reason, date } }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": { /* updated item */ }
}
```

---

## Categories

### GET /categories
Get all categories

### POST /categories
Create category

**Request:**
```json
{
  "name": "Office Supplies",
  "description": "General office supplies"
}
```

---

## Suppliers

### GET /suppliers
Get all suppliers with populated items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "TechSupply Co.",
      "contact": {
        "email": "sales@techsupply.com",
        "phone": "9876543210"
      },
      "suppliedItems": [/* populated item objects */]
    }
  ]
}
```

### POST /suppliers
Create supplier

**Request:**
```json
{
  "name": "New Supplier",
  "contact": {
    "email": "contact@supplier.com",
    "phone": "1234567890",
    "address": "123 Street, City"
  },
  "suppliedItems": ["<itemId1>", "<itemId2>"]
}
```

---

## Orders

### GET /orders
Get all orders with populated user and items

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "orderNumber": "ORD001",
      "userId": { /* populated user */ },
      "items": [
        {
          "itemId": { /* populated item */ },
          "quantity": 5,
          "price": 1500
        }
      ],
      "totalAmount": 7500,
      "status": "completed",
      "shipping": {
        "address": "123 Main St",
        "city": "Bangalore",
        "pincode": "560001"
      }
    }
  ]
}
```

### POST /orders
Create order

**Request:**
```json
{
  "orderNumber": "ORD004",
  "userId": "<userId>",
  "items": [
    {
      "itemId": "<itemId>",
      "quantity": 3,
      "price": 2000
    }
  ],
  "totalAmount": 6000,
  "status": "pending",
  "shipping": {
    "address": "456 Street",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

---

## Reports (Aggregation Pipelines)

### GET /reports/stock-by-category
Group items by category with totals

**Aggregation:**
```javascript
[
  { $group: { _id: '$category', totalStock: { $sum: '$stock' }, itemCount: { $sum: 1 } } },
  { $sort: { totalStock: -1 } }
]
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "Stationery", "totalStock": 155, "itemCount": 2 },
    { "_id": "Electronics", "totalStock": 70, "itemCount": 2 }
  ]
}
```

### GET /reports/low-stock?threshold=10
Items below specified stock threshold

**Query Parameter:** `threshold` (default: 10)

**Aggregation:**
```javascript
[
  { $match: { stock: { $lt: threshold } } },
  { $project: { name: 1, category: 1, stock: 1 } },
  { $sort: { stock: 1 } }
]
```

**Response:**
```json
{
  "success": true,
  "threshold": 10,
  "count": 2,
  "data": [
    { "name": "Ballpoint Pen", "category": "Stationery", "stock": 5 },
    { "name": "Desk Lamp", "category": "Furniture", "stock": 8 }
  ]
}
```

### GET /reports/recent-stock-changes?limit=10
Recent stock movements across all items

**Query Parameter:** `limit` (default: 10)

**Aggregation:**
```javascript
[
  { $unwind: '$stock_logs' },
  { $sort: { 'stock_logs.date': -1 } },
  { $limit: limit },
  { $project: { name: 1, change: '$stock_logs.change', reason: '$stock_logs.reason' } }
]
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "name": "Keyboard", "change": -8, "reason": "Sold 8 units", "date": "..." },
    { "name": "Paper", "change": -50, "reason": "Distributed", "date": "..." }
  ]
}
```

---

## cURL Examples

```bash
# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get all items
curl http://localhost:5000/api/items \
  -H "Authorization: authenticated"

# Update stock (atomic)
curl -X POST http://localhost:5000/api/items/<ID>/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: authenticated" \
  -d '{"change":-5,"reason":"Sold 5 units"}'

# Get categories
curl http://localhost:5000/api/categories \
  -H "Authorization: authenticated"

# Get suppliers
curl http://localhost:5000/api/suppliers \
  -H "Authorization: authenticated"

# Get orders
curl http://localhost:5000/api/orders \
  -H "Authorization: authenticated"

# Stock by category report
curl http://localhost:5000/api/reports/stock-by-category \
  -H "Authorization: authenticated"

# Low stock report
curl "http://localhost:5000/api/reports/low-stock?threshold=20" \
  -H "Authorization: authenticated"

# Recent changes
curl "http://localhost:5000/api/reports/recent-stock-changes?limit=5" \
  -H "Authorization: authenticated"
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error