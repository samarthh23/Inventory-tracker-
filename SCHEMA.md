# 🗄️ Database Schema Documentation

## Overview

The system uses **5 MongoDB collections** to demonstrate various NoSQL concepts and design patterns.

---

## 1. Users Collection

**Purpose:** Authentication and user management

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  username: "admin",
  password_hash: "$2a$10$...",  // bcrypt hashed
  role: "admin",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**NoSQL Concepts:**
- Basic document structure
- Unique index on username
- Secure password storage

**Sample Document:**
```json
{
  "_id": "674a1b2c3d4e5f6a7b8c9d0e",
  "username": "admin",
  "password_hash": "$2a$10$XYZ...",
  "role": "admin",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

---

## 2. Items Collection ⭐

**Purpose:** Inventory items with flexible attributes and complete audit trail

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  name: "Wireless Keyboard",
  category: "Electronics",
  stock: 42,
  
  // Embedded Document - Flexible product details
  details: {
    brand: "Logitech",
    color: "Black",
    description: "Ergonomic wireless keyboard"
  },
  
  // Embedded Array - Complete audit trail
  stock_logs: [
    {
      date: ISODate("2025-01-01"),
      change: 50,
      reason: "Initial stock"
    },
    {
      date: ISODate("2025-01-05"),
      change: -8,
      reason: "Sold 8 units"
    }
  ],
  
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**NoSQL Concepts:**
- **Embedded Document** (`details`) - Flexible schema for varying product attributes
- **Embedded Array** (`stock_logs`) - Audit trail stored within document
- **Flexible Schema** - Different items can have different detail fields
- **No JOINs needed** - All item data in one document

**Why Embedded vs Referenced?**
- Stock logs are small, frequently accessed with parent
- Logs have no independent existence outside item
- One-to-many relationship with parent
- Better read performance (single query)

**Sample Document:**
```json
{
  "_id": "674a1b2c3d4e5f6a7b8c9d0f",
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "stock": 42,
  "details": {
    "brand": "Logitech",
    "color": "Black",
    "description": "Ergonomic wireless keyboard with long battery life"
  },
  "stock_logs": [
    {
      "date": "2025-01-01T00:00:00.000Z",
      "change": 50,
      "reason": "Initial stock"
    },
    {
      "date": "2025-01-05T10:30:00.000Z",
      "change": -8,
      "reason": "Sold 8 units to Office Corp"
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-05T10:30:00.000Z"
}
```

---

## 3. Categories Collection

**Purpose:** Item categorization and grouping

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  name: "Electronics",
  description: "Electronic devices and accessories",
  itemCount: 2,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**NoSQL Concepts:**
- Simple collection structure
- Denormalization (itemCount stored here instead of counting)
- Faster reads at cost of update complexity

**Sample Document:**
```json
{
  "_id": "674a1b2c3d4e5f6a7b8c9d10",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "itemCount": 2,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-05T10:30:00.000Z"
}
```

---

## 4. Suppliers Collection

**Purpose:** Supplier management with item relationships

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  name: "TechSupply Co.",
  
  // Embedded Document - Contact information
  contact: {
    email: "sales@techsupply.com",
    phone: "9876543210",
    address: "123 Tech Park, Mumbai"
  },
  
  // References - Array of Item ObjectIds
  suppliedItems: [
    ObjectId("674a1b2c3d4e5f6a7b8c9d0f"),
    ObjectId("674a1b2c3d4e5f6a7b8c9d11")
  ],
  
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**NoSQL Concepts:**
- **Embedded Document** (`contact`) - Contact info always accessed with supplier
- **References** (`suppliedItems`) - Items have independent existence
- **Many-to-Many** relationship pattern

**Why References Here?**
- Items exist independently
- Items can have multiple suppliers
- Suppliers can supply many items
- Prevents data duplication

**Sample Document:**
```json
{
  "_id": "674a1b2c3d4e5f6a7b8c9d12",
  "name": "TechSupply Co.",
  "contact": {
    "email": "sales@techsupply.com",
    "phone": "9876543210",
    "address": "123 Tech Park, Mumbai, Maharashtra"
  },
  "suppliedItems": [
    "674a1b2c3d4e5f6a7b8c9d0f",
    "674a1b2c3d4e5f6a7b8c9d11"
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 5. Orders Collection

**Purpose:** Order management with complex relationships

**Schema:**
```javascript
{
  _id: ObjectId("..."),
  orderNumber: "ORD001",
  
  // Reference to User
  userId: ObjectId("674a1b2c3d4e5f6a7b8c9d0e"),
  
  // Embedded Array with References
  items: [
    {
      itemId: ObjectId("674a1b2c3d4e5f6a7b8c9d0f"),
      quantity: 5,
      price: 1500
    },
    {
      itemId: ObjectId("674a1b2c3d4e5f6a7b8c9d11"),
      quantity: 10,
      price: 250
    }
  ],
  
  totalAmount: 10000,
  status: "completed",
  
  // Embedded Document - Shipping details
  shipping: {
    address: "123 Main Street",
    city: "Bangalore",
    pincode: "560001"
  },
  
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**NoSQL Concepts:**
- **Multiple References** - Both user and items
- **Embedded Array with References** - Order items snapshot with references
- **Embedded Document** - Shipping info specific to this order
- **Hybrid Approach** - Mix of embedding and referencing

**Why This Design?**
- `userId` referenced - Users exist independently
- `itemId` referenced - Items exist independently
- `quantity` and `price` embedded - Order-specific snapshot
- `shipping` embedded - Specific to this order, no reuse

**Sample Document:**
```json
{
  "_id": "674a1b2c3d4e5f6a7b8c9d13",
  "orderNumber": "ORD001",
  "userId": "674a1b2c3d4e5f6a7b8c9d0e",
  "items": [
    {
      "itemId": "674a1b2c3d4e5f6a7b8c9d0f",
      "quantity": 5,
      "price": 1500
    },
    {
      "itemId": "674a1b2c3d4e5f6a7b8c9d11",
      "quantity": 10,
      "price": 250
    }
  ],
  "totalAmount": 10000,
  "status": "completed",
  "shipping": {
    "address": "123 Main Street, Building A",
    "city": "Bangalore",
    "pincode": "560001"
  },
  "createdAt": "2025-01-10T14:30:00.000Z",
  "updatedAt": "2025-01-10T14:30:00.000Z"
}
```

---

## Relationship Patterns

### Embedded vs Referenced

| When to Embed | When to Reference |
|--------------|------------------|
| Data is small | Data is large |
| Data rarely changes | Data changes frequently |
| One-to-few relationship | One-to-many relationship |
| Data always accessed together | Data accessed independently |
| No independent existence | Has independent existence |

### Examples in Our Schema

**Embedded:**
- `items.details` - Always accessed with item
- `items.stock_logs` - Complete history with item
- `suppliers.contact` - Contact info with supplier
- `orders.shipping` - Shipping specific to order

**Referenced:**
- `suppliers.suppliedItems` - Items exist independently
- `orders.userId` - Users exist independently
- `orders.items.itemId` - Items exist independently

---

## Design Decisions

### Why 5 Collections?

1. **Users** - Authentication requirement
2. **Items** - Core inventory functionality
3. **Categories** - Demonstrate simple collection
4. **Suppliers** - Demonstrate references
5. **Orders** - Demonstrate complex relationships

### Why Embedded stock_logs in Items?

✅ **Pros:**
- Single query to get item with complete history
- Logs have no meaning without parent item
- Atomic updates with parent
- Better read performance

❌ **Cons:**
- Document size grows (solution: cap array size)
- Can't query logs independently (solution: use aggregation)

### Why Reference items in Suppliers?

✅ **Pros:**
- Items exist independently
- Multiple suppliers can supply same item
- No data duplication
- Can update item once, reflects everywhere

❌ **Cons:**
- Requires population/JOIN operation
- Slightly slower reads

---

## Indexes

**Auto-created:**
- `_id` on all collections (unique, clustered)

**Recommended:**
```javascript
// Users
db.users.createIndex({ username: 1 }, { unique: true })

// Items
db.items.createIndex({ category: 1 })
db.items.createIndex({ stock: 1 })

// Orders
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
```

---

## Sample Queries

```javascript
// Get item with all logs
db.items.findOne({ name: "Wireless Keyboard" })

// Get supplier with populated items
db.suppliers.aggregate([
  { $match: { name: "TechSupply Co." } },
  { $lookup: {
      from: "items",
      localField: "suppliedItems",
      foreignField: "_id",
      as: "items"
  }}
])

// Get order with user and items populated
db.orders.aggregate([
  { $match: { orderNumber: "ORD001" } },
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
  { $lookup: { from: "items", localField: "items.itemId", foreignField: "_id", as: "itemDetails" } }
])
```

---

## Collection Statistics

After seeding:

```javascript
db.users.countDocuments()      // 1
db.categories.countDocuments() // 3
db.items.countDocuments()      // 6
db.suppliers.countDocuments()  // 3
db.orders.countDocuments()     // 3

// Total: 16 documents across 5 collections
```