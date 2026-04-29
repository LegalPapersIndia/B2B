const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },

  buyerClerkId: {
    type: String,
    default: '',
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
    trim: true,
    default: '',
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
  enquiryType: {
    type: String,
    enum: ['message', 'contact_click', 'other_requirement'],
    default: 'message',
    index: true,
  },
  productName: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    trim: true,
    default: '',
  },
  subcategory: {
    type: String,
    trim: true,
    default: '',
  },
  quantity: {
    type: String,
    trim: true,
    default: '',
  },
  gstNumber: {
    type: String,
    trim: true,
    default: '',
  },
  assignedSellerClerkId: {
    type: String,
    trim: true,
    default: '',
    index: true,
  },
  assignedSellerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
  }],
  assignedSellerClerkIds: {
    type: [String],
    trim: true,
    index: true,
  },
  assignedSellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    default: null,
  },
  forwardedAt: Date,
  forwardedBy: {
    type: String,
    trim: true,
    default: '',
  },
  contactMethod: {
    type: String,
    enum: ['', 'phone', 'email', 'website'],
    default: '',
  },
  contactValue: {
    type: String,
    trim: true,
    default: '',
  },

  status: {
    type: String,
    enum: ['pending', 'contacted', 'rejected', 'replied', 'closed'],
    default: 'pending',
  },

  repliedAt: Date,
  sellerStatusUpdatedAt: Date,
}, {
  timestamps: true,
});

enquirySchema.index({ productId: 1, buyerClerkId: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
