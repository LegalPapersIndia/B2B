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
  subcategories: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      referenceImage: {
        type: String,
        default: ""
      }
    }],
    default: [],
    validate: {
      validator: (arr) => Array.isArray(arr),
      message: 'Subcategories must be an array'
    }
  },
  image: {
    type: String,
    default: "https://picsum.photos/id/20/600/400"
  }
}, { timestamps: true });

categorySchema.pre('save', function () {
  const normalized = (this.subcategories || [])
    .map((item) => {
      if (typeof item === "string") {
        return { name: item.trim().toLowerCase(), referenceImage: "" };
      }

      return {
        name: String(item?.name || "").trim().toLowerCase(),
        referenceImage: String(item?.referenceImage || "").trim()
      };
    })
    .filter((item) => item.name);

  const seen = new Set();
  this.subcategories = normalized.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });

});

module.exports = mongoose.model('Category', categorySchema);
