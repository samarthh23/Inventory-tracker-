const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/items - Create new item
router.post('/', async (req, res) => {
  try {
    const { name, category, stock, details } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }

    const item = new Item({
      name,
      category,
      stock: stock || 0,
      details: details || {},
      stock_logs: [{
        change: stock || 0,
        reason: 'Initial stock'
      }]
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating item'
    });
  }
});

// GET /api/items - List all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().select('-stock_logs');

    res.json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items'
    });
  }
});

// GET /api/items/:id - Get item details + logs
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item'
    });
  }
});

// PUT /api/items/:id - Update item info
router.put('/:id', async (req, res) => {
  try {
    const { name, category, details } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, category, details },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item'
    });
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item'
    });
  }
});

// POST /api/items/:id/stock - Update stock
router.post('/:id/stock', async (req, res) => {
  try {
    const { change, reason } = req.body;

    if (typeof change !== 'number' || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Change (number) and reason are required'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if stock would go negative
    if (item.stock + change < 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Use atomic operations
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { stock: change },
        $push: {
          stock_logs: {
            change,
            reason,
            date: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedItem
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stock'
    });
  }
});

module.exports = router;