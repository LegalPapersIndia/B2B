// models/CategoryRequest.js
const mongoose = require('mongoose');

const categoryRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['category', 'subcategory']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    trim: true,
    lowercase: true,
    // For subcategory requests, the parent category name
  },
  requestedBy: {
    type: String,
    required: true // Clerk ID
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: String, // Clerk ID of admin who reviewed
  },
  reviewNote: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CategoryRequest', categoryRequestSchema);