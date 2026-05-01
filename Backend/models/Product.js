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
    index: true,
  },

  sellerName: {
    type: String,
    required: true,
  },
  sellerCompany: {
    type: String,
    default: '',
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subcategory: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  requestedCategoryName: {
    type: String,
    trim: true,
    default: '',
  },
  requestedSubcategoryName: {
    type: String,
    trim: true,
    default: '',
  },
  requestedCategoryImage: {
    type: String,
    trim: true,
    default: '',
  },
  requestedSubcategoryImage: {
    type: String,
    trim: true,
    default: '',
  },
  taxonomyStatus: {
    type: String,
    enum: ['confirmed', 'pending'],
    default: 'confirmed',
  },

  price: {
    type: Number,
    required: true,
    min: 1,
  },

  moq: {
    type: Number,
    default: 100,
    min: 1,
  },

  description: {
    type: String,
    trim: true,
    maxlength: 2000,
  },

  images: [{
    type: String,
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre('save', async function () {
    const normalizedCategory = this.category?.trim().toLowerCase();
    const normalizedSubcategory = this.subcategory?.trim().toLowerCase();
    const requestedCategory = String(this.requestedCategoryName || '').trim().toLowerCase();
    const requestedSubcategory = String(this.requestedSubcategoryName || '').trim().toLowerCase();

    if (normalizedCategory) this.category = normalizedCategory;
    this.subcategory = normalizedSubcategory || '';
    this.requestedCategoryName = requestedCategory;
    this.requestedSubcategoryName = requestedSubcategory;

    if (!this.subcategory) {
      throw new Error('Subcategory is required.');
    }

    if (this.category === 'other') {
      if (!this.requestedCategoryName) {
        throw new Error('Custom category name is required when category is "other".');
      }
      if (!this.requestedSubcategoryName) {
        throw new Error('Custom subcategory name is required when category is "other".');
      }
      this.taxonomyStatus = 'pending';
      this.requestedCategoryImage = String(this.requestedCategoryImage || '').trim();
      this.requestedSubcategoryImage = String(this.requestedSubcategoryImage || '').trim();
      if (!this.requestedCategoryImage) {
        throw new Error('Category image is required when requesting a new category.');
      }
      if (!this.requestedSubcategoryImage) {
        throw new Error('Subcategory image is required when requesting a new category.');
      }
      return;
    }

const isDefaultCategory = allowedCategories.includes(this.category);
    const Category = mongoose.model('Category');
    const categoryDoc = await Category.findOne({ name: this.category }).lean();

    if (!isDefaultCategory && !categoryDoc) {
      throw new Error(`Invalid category: "${this.category}". Please use a valid category.`);
    }

    const configuredSubcategories = (categoryDoc?.subcategories || [])
      .map((s) => typeof s === 'string' ? s : s?.name)
      .map((s) => String(s || '').trim().toLowerCase())
      .filter(Boolean);

    if (this.subcategory === 'other') {
      if (!this.requestedSubcategoryName) {
        throw new Error('Custom subcategory name is required when subcategory is "other".');
      }
      this.taxonomyStatus = 'pending';
      this.requestedCategoryImage = '';
      this.requestedSubcategoryImage = String(this.requestedSubcategoryImage || '').trim();
      return;
    }

    this.taxonomyStatus = 'confirmed';
    this.requestedCategoryName = '';
    if (this.subcategory !== 'other') this.requestedSubcategoryName = '';
    this.requestedCategoryImage = '';
    this.requestedSubcategoryImage = '';

    // If category is in allowedCategories but doesn't have DB subcategories, allow any subcategory
    // This makes the filter work properly - categories from DEFAULT_CATEGORIES work even without DB config
    if (isDefaultCategory && configuredSubcategories.length === 0) {
      if (!this.subcategory) {
        throw new Error(`Subcategory is required for category "${this.category}".`);
      }
      // Allow any subcategory for default allowed categories without DB config
      return;
    }

    if (configuredSubcategories.length > 0) {
      if (!this.subcategory) {
        throw new Error(`Subcategory is required for category "${this.category}".`);
      }
      if (!configuredSubcategories.includes(this.subcategory)) {
        throw new Error(`Invalid subcategory "${this.subcategory}" for category "${this.category}".`);
      }
    } else {
      throw new Error(`Subcategory is not configured for category "${this.category}". Please request a custom subcategory.`);
    }
});

productSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate() || {};
    const $set = update.$set || {};

    const hasCategory = Object.prototype.hasOwnProperty.call($set, 'category') ||
      Object.prototype.hasOwnProperty.call(update, 'category');
    const hasSubcategory = Object.prototype.hasOwnProperty.call($set, 'subcategory') ||
      Object.prototype.hasOwnProperty.call(update, 'subcategory');

    if (!hasCategory && !hasSubcategory) return;

    const existing = await this.model.findOne(this.getQuery()).lean();
    if (!existing) return;

    const category = String(
      $set.category ?? update.category ?? existing.category ?? ''
    ).trim().toLowerCase();
    const subcategory = String(
      $set.subcategory ?? update.subcategory ?? existing.subcategory ?? ''
    ).trim().toLowerCase();
    const requestedCategoryName = String(
      $set.requestedCategoryName ?? update.requestedCategoryName ?? existing.requestedCategoryName ?? ''
    ).trim().toLowerCase();
    const requestedSubcategoryName = String(
      $set.requestedSubcategoryName ?? update.requestedSubcategoryName ?? existing.requestedSubcategoryName ?? ''
    ).trim().toLowerCase();
    const requestedCategoryImage = String(
      $set.requestedCategoryImage ?? update.requestedCategoryImage ?? existing.requestedCategoryImage ?? ''
    ).trim();
    const requestedSubcategoryImage = String(
      $set.requestedSubcategoryImage ?? update.requestedSubcategoryImage ?? existing.requestedSubcategoryImage ?? ''
    ).trim();

    if (!subcategory) {
      throw new Error('Subcategory is required.');
    }

    if (category === 'other') {
      if (!requestedCategoryName) {
        throw new Error('Custom category name is required when category is "other".');
      }
      if (!requestedSubcategoryName) {
        throw new Error('Custom subcategory name is required when category is "other".');
      }
      if (!requestedCategoryImage) {
        throw new Error('Category image is required when requesting a new category.');
      }
      if (!requestedSubcategoryImage) {
        throw new Error('Subcategory image is required when requesting a new category.');
      }
      if (update.$set) {
        update.$set.category = 'other';
        update.$set.subcategory = 'other';
        update.$set.requestedCategoryName = requestedCategoryName;
        update.$set.requestedSubcategoryName = requestedSubcategoryName;
        update.$set.requestedCategoryImage = requestedCategoryImage;
        update.$set.requestedSubcategoryImage = requestedSubcategoryImage;
        update.$set.taxonomyStatus = 'pending';
      } else {
        update.category = 'other';
        update.subcategory = 'other';
        update.requestedCategoryName = requestedCategoryName;
        update.requestedSubcategoryName = requestedSubcategoryName;
        update.requestedCategoryImage = requestedCategoryImage;
        update.requestedSubcategoryImage = requestedSubcategoryImage;
        update.taxonomyStatus = 'pending';
      }
      this.setUpdate(update);
      return;
    }

const isDefaultCategory = allowedCategories.includes(category);
    const Category = mongoose.model('Category');
    const categoryDoc = await Category.findOne({ name: category }).lean();

    if (!isDefaultCategory && !categoryDoc) {
      throw new Error(`Invalid category: "${category}". Please use a valid category.`);
    }

    const configuredSubcategories = (categoryDoc?.subcategories || [])
      .map((s) => typeof s === 'string' ? s : s?.name)
      .map((s) => String(s || '').trim().toLowerCase())
      .filter(Boolean);

    if (subcategory === 'other') {
      if (!requestedSubcategoryName) {
        throw new Error('Custom subcategory name is required when subcategory is "other".');
      }
    } 
    // If category is in allowedCategories but doesn't have DB subcategories, allow any subcategory
    else if (isDefaultCategory && configuredSubcategories.length === 0) {
      if (!subcategory) {
        throw new Error(`Subcategory is required for category "${category}".`);
      }
      // Allow any subcategory for default allowed categories without DB config
    }
    else if (configuredSubcategories.length > 0) {
      if (!subcategory) {
        throw new Error(`Subcategory is required for category "${category}".`);
      }
      if (!configuredSubcategories.includes(subcategory)) {
        throw new Error(`Invalid subcategory "${subcategory}" for category "${category}".`);
      }
    } else {
      throw new Error(`Subcategory is not configured for category "${category}". Please request a custom subcategory.`);
    }

    if (update.$set) {
      update.$set.category = category;
      update.$set.subcategory = subcategory;
      update.$set.requestedCategoryName = '';
      update.$set.requestedSubcategoryName = subcategory === 'other' ? requestedSubcategoryName : '';
      update.$set.requestedCategoryImage = '';
      update.$set.requestedSubcategoryImage = subcategory === 'other' ? requestedSubcategoryImage : '';
      update.$set.taxonomyStatus = subcategory === 'other' ? 'pending' : 'confirmed';
    } else {
      update.category = category;
      update.subcategory = subcategory;
      update.requestedCategoryName = '';
      update.requestedSubcategoryName = subcategory === 'other' ? requestedSubcategoryName : '';
      update.requestedCategoryImage = '';
      update.requestedSubcategoryImage = subcategory === 'other' ? requestedSubcategoryImage : '';
      update.taxonomyStatus = subcategory === 'other' ? 'pending' : 'confirmed';
    }

    this.setUpdate(update);
});

productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ clerkId: 1 });

module.exports = mongoose.model('Product', productSchema);

