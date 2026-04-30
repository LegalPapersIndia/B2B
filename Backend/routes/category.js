const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const allowedCategories = [
    'medicine', 'cosmetics', 'personal-care', 'food', 'beverages',
    'confectionery', 'daily-use', 'home-kitchen', 'construction',
    'machinery', 'electrical', 'apparel', 'textiles', 'electronics',
    'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

function normalizeCategorySubcategories(input) {
  if (!Array.isArray(input)) return [];
  return input.map((item) => {
    if (typeof item === 'string') {
      return { name: String(item).trim().toLowerCase(), referenceImage: '' };
    }
    return {
      name: String(item?.name || '').trim().toLowerCase(),
      referenceImage: String(item?.referenceImage || '').trim(),
    };
  }).filter((item) => item.name);
}

router.get('/', async (req, res) => {
  try {
    const dbCategories = await Category.find().lean();

    const dbMap = new Map(dbCategories.map((cat) => [cat.name, cat]));
    const allNames = [...new Set([
      ...allowedCategories,
      ...dbCategories.map((cat) => cat.name),
    ])].sort();

const categories = allNames.map((name) => {
      const dbCat = dbMap.get(name);
      const normalizedSubcategories = normalizeCategorySubcategories(dbCat?.subcategories);
      return {
        _id: dbCat?._id,
        name,
        description: dbCat?.description || '',
        image: dbCat?.image || '',
        subcategories: normalizedSubcategories.map((sub) => ({
          name: sub.name,
          referenceImage: sub.referenceImage || '',
        })),
      };
    });

    res.json({ success: true, categories });
  } catch (err) {
    console.error('Category fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
