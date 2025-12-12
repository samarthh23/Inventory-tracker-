const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  const orders = await Order.find().populate('userId').populate('items.itemId');
  res.json({ success: true, data: orders });
});

router.post('/', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json({ success: true, data: order });
});

module.exports = router;