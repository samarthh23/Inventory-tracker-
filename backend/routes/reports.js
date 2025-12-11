const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/reports/stock-by-category
router.get('/stock-by-category', async (req, res) => {
  try {
    const results = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' },
          itemCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalStock: -1 }
      }
    ]);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Stock by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
});

// GET /api/reports/low-stock?threshold=10
router.get('/low-stock', async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const results = await Item.aggregate([
      {
        $match: { stock: { $lt: threshold } }
      },
      {
        $project: {
          name: 1,
          category: 1,
          stock: 1
        }
      },
      {
        $sort: { stock: 1 }
      }
    ]);

    res.json({
      success: true,
      threshold,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
});

// GET /api/reports/recent-stock-changes
router.get('/recent-stock-changes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const results = await Item.aggregate([
      {
        $unwind: '$stock_logs'
      },
      {
        $sort: { 'stock_logs.date': -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          name: 1,
          category: 1,
          stock: 1,
          change: '$stock_logs.change',
          reason: '$stock_logs.reason',
          date: '$stock_logs.date'
        }
      }
    ]);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Recent changes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
});

module.exports = router;