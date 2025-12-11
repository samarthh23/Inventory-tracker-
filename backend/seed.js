require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password_hash: hashedPassword,
      role: 'admin'
    });
    console.log('👤 Admin user created (username: admin, password: admin123)');

    // Create sample items
    const items = [
      {
        name: 'Wireless Keyboard',
        category: 'Electronics',
        stock: 42,
        details: {
          brand: 'Logitech',
          color: 'Black',
          description: 'Ergonomic wireless keyboard'
        },
        stock_logs: [
          { date: new Date('2025-01-01'), change: 50, reason: 'Initial stock' },
          { date: new Date('2025-01-05'), change: -8, reason: 'Sold 8 units' }
        ]
      },
      {
        name: 'USB Mouse',
        category: 'Electronics',
        stock: 28,
        details: {
          brand: 'Dell',
          color: 'Silver',
          description: 'Optical USB mouse'
        },
        stock_logs: [
          { date: new Date('2025-01-02'), change: 30, reason: 'Initial stock' },
          { date: new Date('2025-01-06'), change: -2, reason: 'Sold 2 units' }
        ]
      },
      {
        name: 'Office Chair',
        category: 'Furniture',
        stock: 15,
        details: {
          brand: 'IKEA',
          color: 'Black',
          description: 'Ergonomic office chair'
        },
        stock_logs: [
          { date: new Date('2025-01-03'), change: 20, reason: 'Initial stock' },
          { date: new Date('2025-01-07'), change: -5, reason: 'Sold 5 units' }
        ]
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        stock: 8,
        details: {
          brand: 'Philips',
          color: 'White',
          description: 'LED desk lamp'
        },
        stock_logs: [
          { date: new Date('2025-01-04'), change: 10, reason: 'Initial stock' },
          { date: new Date('2025-01-08'), change: -2, reason: 'Sold 2 units' }
        ]
      },
      {
        name: 'A4 Paper Ream',
        category: 'Stationery',
        stock: 150,
        details: {
          brand: 'Copier',
          color: 'White',
          description: '500 sheets per ream'
        },
        stock_logs: [
          { date: new Date('2025-01-02'), change: 200, reason: 'Initial stock' },
          { date: new Date('2025-01-09'), change: -50, reason: 'Used 50 reams' }
        ]
      },
      {
        name: 'Ballpoint Pen',
        category: 'Stationery',
        stock: 5,
        details: {
          brand: 'Pilot',
          color: 'Blue',
          description: 'Pack of 10 pens'
        },
        stock_logs: [
          { date: new Date('2025-01-05'), change: 20, reason: 'Initial stock' },
          { date: new Date('2025-01-10'), change: -15, reason: 'Distributed to staff' }
        ]
      }
    ];

    await Item.insertMany(items);
    console.log('📦 Sample items created');

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);