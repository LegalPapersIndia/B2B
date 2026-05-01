// Shared configuration for default categories
// This is the SINGLE SOURCE of truth for allowed/default categories
// Used by both admin.js and category.js routes

const allowedCategories = [
  'medicine',
  'cosmetics',
  'personal-care',
  'food',
  'beverages',
  'confectionery',
  'daily-use',
  'home-kitchen',
  'construction',
  'machinery',
  'electrical',
  'apparel',
  'textiles',
  'electronics',
  'automotive',
  'agriculture',
  'packaging',
  'pet-supplies',
];

module.exports = {
  allowedCategories,
};
