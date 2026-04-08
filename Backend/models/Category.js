// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    default: "https://picsum.photos/id/20/600/400"
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);