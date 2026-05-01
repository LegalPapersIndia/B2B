const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  authProvider: {
    type: String,
    enum: ['clerk', 'local'],
    default: 'clerk',
  },
  name: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  website: {
    type: String,
    trim: true,
    default: '',
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  avatar: String,
  businessType: String,
  city: String,
  state: String,
  country: String,
  gstNumber: String,
  passwordHash: {
    type: String,
    default: '',
    select: false,
  },
  invitedByAdminAt: {
    type: Date,
    default: null,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
profileCompletedAt: {
    type: Date,
    default: null,
  },
  category: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
