// models/Product.js
const mongoose = require('mongoose');

const allowedCategories = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages', 
  'confectionery', 'daily-use', 'home-kitchen', 'construction', 
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics', 
  'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

const productSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true,
    index: true
  },

  sellerName: {
    type: String,
    required: true
  },
  sellerCompany: {
    type: String,
    default: ''
  },

  name: { 
    type: String, 
    required: true,
    trim: true 
  },

  category: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },

  price: { 
    type: Number, 
    required: true,
    min: 1 
  },

  moq: { 
    type: Number, 
    default: 100,
    min: 1 
  },

  description: { 
    type: String,
    trim: true,
    maxlength: 2000
  },

  images: [{ 
    type: String 
  }],

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ================= FIXED PRE-SAVE HOOK =================
productSchema.pre('save', async function(next) {
  try {
    const normalizedCategory = this.category?.trim().toLowerCase();
    
    if (normalizedCategory) {
      this.category = normalizedCategory;
    }

    const isInAllowed = allowedCategories.includes(this.category);
    
    // Agar default category nahi hai to Category collection mein check karo
    if (!isInAllowed) {
      const Category = mongoose.model('Category');
      const existsInDB = await Category.exists({ name: this.category });

      if (!existsInDB) {
        return next(new Error(`Invalid category: "${this.category}". Please use a valid category.`));
      }
    }

    next();   // ← Yeh line bahut zaroori hai

  } catch (err) {
    console.error("Pre-save hook error:", err);
    next(err);   // Error ko properly pass karo
  }
});

productSchema.index({ category: 1 });
productSchema.index({ clerkId: 1 });

module.exports = mongoose.model('Product', productSchema);