const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  change: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, { _id: false });

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  details: {
    brand: String,
    color: String,
    description: String
  },
  stock_logs: [stockLogSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);