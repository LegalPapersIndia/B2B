// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  phone: String,
  company: {
    type: String,
    required: true
  },
  address: String,           // ← Added
  avatar: String,
  businessType: String,
  city: String,
  state: String,
  country: String,
  gstNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);