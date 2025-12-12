require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const User = require('./models/User');
const Item = require('./models/Item');
const Category = require('./models/Category');
const Supplier = require('./models/Supplier');
const Order = require('./models/Order');

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
    console.log('🗑️  Clearing existing data...');
    
    // Clear all collections
    await User.deleteMany({});
    await Item.deleteMany({});
    await Category.deleteMany({});
    await Supplier.deleteMany({});
    await Order.deleteMany({});
    
    console.log('✅ All collections cleared');

    // ========================================
    // 1. CREATE ADMIN USER
    // ========================================
    console.log('\n👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password_hash: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // ========================================
    // 2. CREATE CATEGORIES
    // ========================================
    console.log('\n📁 Creating categories...');
    const categories = await Category.insertMany([
      { 
        name: 'Electronics', 
        description: 'Electronic devices and accessories',
        itemCount: 0
      },
      { 
        name: 'Furniture', 
        description: 'Office and home furniture',
        itemCount: 0
      },
      { 
        name: 'Stationery', 
        description: 'Office stationery and supplies',
        itemCount: 0
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // ========================================
    // 3. CREATE ITEMS
    // ========================================
    console.log('\n📦 Creating items...');
    const items = await Item.insertMany([
      {
        name: 'Wireless Keyboard',
        category: 'Electronics',
        stock: 42,
        details: {
          brand: 'Logitech',
          color: 'Black',
          description: 'Ergonomic wireless keyboard with long battery life'
        },
        stock_logs: [
          { date: new Date('2025-01-01'), change: 50, reason: 'Initial stock' },
          { date: new Date('2025-01-05'), change: -8, reason: 'Sold 8 units to Office Corp' }
        ]
      },
      {
        name: 'USB Mouse',
        category: 'Electronics',
        stock: 28,
        details: {
          brand: 'Dell',
          color: 'Silver',
          description: 'Optical USB mouse with ergonomic design'
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
          description: 'Ergonomic office chair with adjustable height'
        },
        stock_logs: [
          { date: new Date('2025-01-03'), change: 20, reason: 'Initial stock' },
          { date: new Date('2025-01-07'), change: -5, reason: 'Sold 5 units to Tech Startup' }
        ]
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        stock: 8,
        details: {
          brand: 'Philips',
          color: 'White',
          description: 'LED desk lamp with adjustable brightness'
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
          description: '500 sheets per ream, 80 GSM'
        },
        stock_logs: [
          { date: new Date('2025-01-02'), change: 200, reason: 'Initial stock' },
          { date: new Date('2025-01-09'), change: -50, reason: 'Distributed to departments' }
        ]
      },
      {
        name: 'Ballpoint Pen',
        category: 'Stationery',
        stock: 5,
        details: {
          brand: 'Pilot',
          color: 'Blue',
          description: 'Pack of 10 blue ballpoint pens'
        },
        stock_logs: [
          { date: new Date('2025-01-05'), change: 20, reason: 'Initial stock' },
          { date: new Date('2025-01-10'), change: -15, reason: 'Distributed to staff' }
        ]
      }
    ]);
    console.log(`✅ Created ${items.length} items`);

    // Update category item counts
    await Category.updateOne({ name: 'Electronics' }, { itemCount: 2 });
    await Category.updateOne({ name: 'Furniture' }, { itemCount: 2 });
    await Category.updateOne({ name: 'Stationery' }, { itemCount: 2 });
    console.log('✅ Updated category counts');

    // ========================================
    // 4. CREATE SUPPLIERS
    // ========================================
    console.log('\n🏢 Creating suppliers...');
    const suppliers = await Supplier.insertMany([
      {
        name: 'TechSupply Co.',
        contact: {
          email: 'sales@techsupply.com',
          phone: '9876543210',
          address: '123 Tech Park, Mumbai, Maharashtra'
        },
        suppliedItems: [items[0]._id, items[1]._id]  // Keyboard and Mouse
      },
      {
        name: 'Office Furniture Ltd.',
        contact: {
          email: 'info@officefurniture.com',
          phone: '9876543211',
          address: '456 Industrial Area, Delhi, India'
        },
        suppliedItems: [items[2]._id, items[3]._id]  // Chair and Lamp
      },
      {
        name: 'Stationery World',
        contact: {
          email: 'orders@stationeryworld.com',
          phone: '9876543212',
          address: '789 Market Street, Bangalore, Karnataka'
        },
        suppliedItems: [items[4]._id, items[5]._id]  // Paper and Pens
      }
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers`);

    // ========================================
    // 5. CREATE ORDERS
    // ========================================
    console.log('\n📋 Creating orders...');
    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD001',
        userId: admin._id,
        items: [
          { itemId: items[0]._id, quantity: 5, price: 1500 },  // 5 Keyboards
          { itemId: items[4]._id, quantity: 10, price: 250 }   // 10 Paper reams
        ],
        totalAmount: 10000,
        status: 'completed',
        shipping: {
          address: '123 Main Street, Building A',
          city: 'Bangalore',
          pincode: '560001'
        }
      },
      {
        orderNumber: 'ORD002',
        userId: admin._id,
        items: [
          { itemId: items[2]._id, quantity: 2, price: 5000 }   // 2 Office Chairs
        ],
        totalAmount: 10000,
        status: 'pending',
        shipping: {
          address: '456 Park Avenue, Floor 3',
          city: 'Mumbai',
          pincode: '400001'
        }
      },
      {
        orderNumber: 'ORD003',
        userId: admin._id,
        items: [
          { itemId: items[1]._id, quantity: 10, price: 500 },  // 10 Mice
          { itemId: items[3]._id, quantity: 5, price: 1200 },  // 5 Lamps
          { itemId: items[5]._id, quantity: 20, price: 150 }   // 20 Pen packs
        ],
        totalAmount: 14000,
        status: 'completed',
        shipping: {
          address: '789 Corporate Tower',
          city: 'Delhi',
          pincode: '110001'
        }
      }
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    // ========================================
    // VERIFICATION
    // ========================================
    console.log('\n📊 Database Summary:');
    console.log('==================');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Categories: ${await Category.countDocuments()}`);
    console.log(`Items: ${await Item.countDocuments()}`);
    console.log(`Suppliers: ${await Supplier.countDocuments()}`);
    console.log(`Orders: ${await Order.countDocuments()}`);
    console.log('==================');

    console.log('\n✅ All 5 collections seeded successfully!');
    console.log('\n💡 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seed error:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);