const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { allowedCategories } = require('../utils/categoriesConfig');

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
    // Fetch ALL categories from database (including custom categories from Super Admin)
    const dbCategories = await Category.find().lean();

    const dbMap = new Map(dbCategories.map((cat) => [cat.name, cat]));

// Combine allowedCategories with custom categories from DB
    // This ensures sellers see both default AND custom categories
    const allCategoryNames = [...new Set([
      ...allowedCategories,
      ...dbCategories.map((cat) => cat.name),
    ])];

    const categories = allCategoryNames.map((name) => {
      const dbCat = dbMap.get(name);
      const normalizedSubcategories = normalizeCategorySubcategories(dbCat?.subcategories);
      // Generate slug from name if not available in DB
      const slug = dbCat?.slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') : '');
      // Capitalize the name for proper display
      const displayName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return {
        _id: dbCat?._id,
        name: displayName,
        slug,
        isDefault: allowedCategories.includes(name),
        description: dbCat?.description || '',
        image: dbCat?.image || '',
        subcategories: normalizedSubcategories.map((sub) => ({
          name: sub.name,
          referenceImage: sub.referenceImage || '',
        })),
      };
    });

    // Sort alphabetically
    categories.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, categories });
  } catch (err) {
    console.error('Category fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
