// Backend/models/Enquiry.js

const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  buyerClerkId: {
    type: String,
    required: true,
    index: true
  },

  // ================= BUYER =================
  buyerName: {
    type: String,
    required: true,
    trim: true
  },

  buyerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  buyerCompany: {
    type: String,
    trim: true,
    default: ''
  },

  // ================= SELLER =================
  sellerName: {
    type: String,
    required: true,
    trim: true
  },

  sellerCompany: {
    type: String,
    trim: true,
    default: ''
  },

  // ================= MESSAGE =================
  message: {
    type: String,
    trim: true,
    default: "I am interested in this product. Please share more details."
  },

  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending'
  },

  repliedAt: Date,

}, {
  timestamps: true
});

// Indexes
enquirySchema.index({ productId: 1, buyerClerkId: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);