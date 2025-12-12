# 📦 InventoryTracker - NoSQL Inventory Management

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)](https://expressjs.com/)

A full-stack inventory management system demonstrating **NoSQL database concepts** with MongoDB. Features 5 collections, authentication, CRUD operations, atomic updates, and advanced aggregation pipelines.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/inventorytracker.git
cd inventorytracker
npm install

# Setup environment
echo "PORT=5000" > .env
echo "MONGODB_URI=mongodb://localhost:27017/inventorytracker" >> .env

# Seed database and start
npm run seed
npm start

# Access: http://localhost:5000/index.html
# Login: admin / admin123
```

## ✨ Features

- **5 MongoDB Collections** - Users, Items, Categories, Suppliers, Orders
- **NoSQL Concepts** - Embedded documents, arrays, references, flexible schema
- **Atomic Operations** - Race-free stock updates using `$inc` and `$push`
- **Aggregation Pipelines** - 3 complex reports with `$group`, `$match`, `$unwind`
- **Authentication** - Secure login with bcrypt password hashing
- **RESTful API** - Complete CRUD operations for all entities

## 🗄️ Database Schema

```javascript
// 5 Collections demonstrating different NoSQL patterns

users       → Basic authentication
items       → Embedded documents + arrays (stock_logs)
categories  → Simple collection
suppliers   → References to items + embedded contact
orders      → Multiple references + embedded items array
```

## 📊 Key NoSQL Demonstrations

| Concept | Implementation | Collection |
|---------|---------------|-----------|
| Embedded Documents | `details: { brand, color }` | Items |
| Embedded Arrays | `stock_logs: [{ date, change }]` | Items |
| References | `ObjectId` relationships | Suppliers, Orders |
| Atomic Operations | `$inc` + `$push` | Items |
| Aggregation | `$group`, `$unwind` | Reports |

## 🔌 API Overview

```bash
# Authentication
POST   /api/login

# Items (with atomic stock updates)
GET    /api/items
POST   /api/items
POST   /api/items/:id/stock    # Atomic: $inc + $push

# Categories, Suppliers, Orders
GET    /api/categories
GET    /api/suppliers
GET    /api/orders

# Aggregation Reports
GET    /api/reports/stock-by-category      # $group, $sum
GET    /api/reports/low-stock               # $match, $project
GET    /api/reports/recent-stock-changes   # $unwind, $sort
```

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, bcryptjs  
**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Database:** MongoDB with 5 collections

## 📁 Project Structure

```
backend/
├── models/       # 5 Mongoose schemas
├── routes/       # API endpoints
├── config/       # DB connection
├── seed.js       # Database seeding
└── server.js     # Express app

frontend/
├── *.html        # UI pages
├── styles.css    # Styling
└── app.js        # Common JS
```

## 🧪 Testing

```bash
# Verify all 5 collections
mongosh
use inventorytracker
show collections    # Should show: users, items, categories, suppliers, orders

# Test API
curl http://localhost:5000/api/items -H "Authorization: authenticated"
```

## 📚 Documentation

- **Setup Guide:** [QUICKSTART.md](QUICKSTART.md)
- **API Reference:** [API.md](API.md)
- **Database Schema:** [SCHEMA.md](SCHEMA.md)
- **Viva Guide:** [VIVA_PREPARATION.md](VIVA_PREPARATION.md)

## 🎓 Learning Outcomes

This project demonstrates:
- NoSQL schema design (embedded vs referenced)
- MongoDB aggregation pipelines
- Atomic operations for data consistency
- RESTful API architecture
- Full-stack JavaScript development

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

**Your Name**  
[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourprofile)

---

⭐ **Star this repo if it helped you learn NoSQL concepts!**