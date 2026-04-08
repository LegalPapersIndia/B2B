// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const allowedCategories = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages', 
  'confectionery', 'daily-use', 'home-kitchen', 'construction', 
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics', 
  'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

router.get('/', async (req, res) => {
  try {
    const dbCategories = await Category.find().sort({ name: 1 });
    const all = [...new Set([...allowedCategories, ...dbCategories.map(c => c.name)])].sort();

    res.json({
      success: true,
      categories: all.map(name => ({ name }))   // ← String format mein return
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;