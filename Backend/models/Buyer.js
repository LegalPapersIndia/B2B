const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  phone: String,
  company: String,        // Optional for buyer
  avatar: String,
  address: String,
  city: String,
  state: String,
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('Buyer', buyerSchema);