const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Embedded document for contact info
  contact: {
    email: String,
    phone: String,
    address: String
  },
  // Array of supplied item references
  suppliedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);