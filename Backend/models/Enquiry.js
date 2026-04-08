const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  buyerClerkId: {
    type: String,
    required: true,
    index: true,
  },

  buyerName: {
    type: String,
    required: true,
    trim: true,
  },
  buyerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  buyerPhone: {
    type: String,
    trim: true,
    default: '',
  },
  buyerCompany: {
    type: String,
    trim: true,
    default: '',
  },
  buyerWebsite: {
    type: String,
    trim: true,
    default: '',
  },

  sellerName: {
    type: String,
    required: true,
    trim: true,
  },
  sellerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  sellerPhone: {
    type: String,
    trim: true,
    default: '',
  },
  sellerCompany: {
    type: String,
    trim: true,
    default: '',
  },
  sellerWebsite: {
    type: String,
    trim: true,
    default: '',
  },

  message: {
    type: String,
    trim: true,
    default: 'I am interested in this product. Please share more details.',
  },

  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending',
  },

  repliedAt: Date,
}, {
  timestamps: true,
});

enquirySchema.index({ productId: 1, buyerClerkId: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
