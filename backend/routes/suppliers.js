const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', async (req, res) => {
  const suppliers = await Supplier.find().populate('suppliedItems');
  res.json({ success: true, data: suppliers });
});

router.post('/', async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json({ success: true, data: supplier });
});

module.exports = router;