const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Seller = require('../models/Seller');
const Category = require('../models/Category');

const uploadDir = 'uploads/categories';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only images are allowed'), false);
  },
});

const allowedCategories = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages',
  'confectionery', 'daily-use', 'home-kitchen', 'construction',
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics',
  'automotive', 'agriculture', 'packaging', 'pet-supplies',
];

function normalizeSubcategories(input) {
  if (!input) return [];

  let values = [];

  if (Array.isArray(input)) {
    values = input;
  } else if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) values = parsed;
      } catch {
        values = trimmed.split(',');
      }
    } else {
      values = trimmed.split(',');
    }
  }

  const normalized = values
    .map((item) => {
      if (typeof item === 'string') {
        return { name: item.trim().toLowerCase(), referenceImage: '' };
      }
      return {
        name: String(item?.name || '').trim().toLowerCase(),
        referenceImage: String(item?.referenceImage || '').trim(),
      };
    })
    .filter((item) => item.name);

  const seen = new Set();
  return normalized.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

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

function buildCategoryPayload(req) {
  const payload = {};
  const files = req.files || [];

  if (typeof req.body.name === 'string') {
    payload.name = req.body.name.trim().toLowerCase();
  }

  if (typeof req.body.description === 'string') {
    payload.description = req.body.description.trim();
  }

  if (req.body.subcategories !== undefined) {
    const normalized = normalizeSubcategories(req.body.subcategories);

    payload.subcategories = normalized.map((item, index) => {
      const file = files.find((f) => f.fieldname === `subcategoryImage_${index}`);
      if (file) {
        return { ...item, referenceImage: `/uploads/categories/${file.filename}` };
      }
      return item;
    });
  }

  const categoryImage = files.find((f) => f.fieldname === 'image');
  if (categoryImage) {
    payload.image = `/uploads/categories/${categoryImage.filename}`;
  }

  return payload;
}

async function getEnrichedProduct(product) {
  const seller = await Seller.findOne({ clerkId: product.clerkId }).lean();
  return {
    ...product,
    seller: seller
      ? {
          _id: seller._id,
          clerkId: seller.clerkId,
          name: seller.name,
          email: seller.email,
          phone: seller.phone,
          company: seller.company,
          website: seller.website,
          address: seller.address,
        }
      : null,
  };
}

async function ensureCategoryAndSubcategory(categoryName, subcategoryName, options = {}) {
  const normalizedCategory = String(categoryName || '').trim().toLowerCase();
  const normalizedSubcategory = String(subcategoryName || '').trim().toLowerCase();
  const categoryImage = String(options.categoryImage || '').trim();
  const subcategoryReferenceImage = String(options.subcategoryReferenceImage || '').trim();

  if (!normalizedCategory) {
    throw new Error('Final category is required');
  }
  if (!normalizedSubcategory) {
    throw new Error('Final subcategory is required');
  }

  let categoryDoc = await Category.findOne({ name: normalizedCategory });

  if (!categoryDoc) {
    categoryDoc = await Category.create({
      name: normalizedCategory,
      description: '',
      image: categoryImage || 'https://picsum.photos/id/20/600/400',
      subcategories: [],
    });
  } else if (categoryImage) {
    categoryDoc.image = categoryImage;
  }

  const existingSubcategories = Array.isArray(categoryDoc.subcategories)
    ? categoryDoc.subcategories
    : [];

  const index = existingSubcategories.findIndex((s) => {
    const name = typeof s === 'string' ? s : s?.name;
    return String(name || '').trim().toLowerCase() === normalizedSubcategory;
  });

  if (index === -1) {
    existingSubcategories.push({
      name: normalizedSubcategory,
      referenceImage: String(subcategoryReferenceImage || '').trim(),
    });
  } else {
    const current = existingSubcategories[index];
    const currentRef = typeof current === 'string' ? '' : String(current.referenceImage || '').trim();
    existingSubcategories[index] = {
      name: normalizedSubcategory,
      referenceImage: String(subcategoryReferenceImage || '').trim() || currentRef,
    };
  }

  categoryDoc.subcategories = existingSubcategories;
  await categoryDoc.save();

  return {
    category: normalizedCategory,
    subcategory: normalizedSubcategory,
  };
}

router.get('/categories', async (req, res) => {
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
        isDefault: allowedCategories.includes(name),
        description: dbCat?.description || '',
        image: dbCat?.image || 'https://picsum.photos/id/20/600/400',
        subcategories: normalizedSubcategories,
      };
    });

    res.json({ success: true, categories });
  } catch (err) {
    console.error('Admin categories fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

router.post('/categories', upload.any(), async (req, res) => {
  try {
    const payload = buildCategoryPayload(req);

    if (!payload.name || payload.name.length < 2) {
      return res.status(400).json({ success: false, message: 'Category name must be at least 2 characters' });
    }

    const { name, ...rest } = payload;
    const category = await Category.findOneAndUpdate(
      { name },
      { $set: rest, $setOnInsert: { name } },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category saved successfully',
      category,
    });
  } catch (err) {
    console.error('Add category error:', err);
    res.status(500).json({ success: false, message: 'Failed to save category' });
  }
});

router.put('/categories/:id', upload.any(), async (req, res) => {
  try {
    const payload = buildCategoryPayload(req);

    if (payload.name && payload.name.length < 2) {
      return res.status(400).json({ success: false, message: 'Category name must be at least 2 characters' });
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, message: 'Category updated', category: updated });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    if (allowedCategories.includes(cat.name)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default category from system list. Edit its metadata instead.',
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await Seller.find()
      .select('clerkId name email phone company website address city state country gstNumber profileCompletedAt createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await Seller.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const allowed = [
      'name', 'email', 'phone', 'company', 'website', 'address',
      'city', 'state', 'country', 'gstNumber', 'profileCompletedAt',
    ];

    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (updateData.email) updateData.email = String(updateData.email).trim().toLowerCase();
    if (updateData.website) updateData.website = String(updateData.website).trim();

    const updated = await Seller.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User updated successfully', user: updated });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

router.get('/companies', async (req, res) => {
  try {
    const companies = await Seller.find()
      .select('name company email phone gstNumber address city state country createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, companies });
  } catch (err) {
    console.error('Companies fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch companies' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const enrichedProducts = await Promise.all(products.map(getEnrichedProduct));

    res.json({ success: true, products: enrichedProducts });
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

router.get('/products/pending-taxonomy', async (req, res) => {
  try {
    const products = await Product.find({
      $or: [
        { taxonomyStatus: 'pending' },
        { category: 'other' },
        { subcategory: 'other' },
      ],
    }).sort({ createdAt: -1 }).lean();

    const enrichedProducts = await Promise.all(products.map(getEnrichedProduct));
    res.json({ success: true, products: enrichedProducts });
  } catch (err) {
    console.error('Pending taxonomy products fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pending approvals' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const [enrichedProduct, enquiries] = await Promise.all([
      getEnrichedProduct(product),
      Enquiry.find({ productId: req.params.id }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({ success: true, product: enrichedProduct, enquiries });
  } catch (err) {
    console.error('Product detail fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const allowed = [
      'name', 'category', 'subcategory', 'price', 'moq', 'description',
      'images', 'sellerName', 'sellerCompany',
      'requestedCategoryName', 'requestedSubcategoryName',
      'requestedCategoryImage', 'requestedSubcategoryImage',
      'taxonomyStatus',
    ];

    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    if (payload.category) payload.category = String(payload.category).trim().toLowerCase();
    if (payload.subcategory !== undefined) {
      payload.subcategory = String(payload.subcategory || '').trim().toLowerCase();
    }

    // Super admin decision is final: if category/subcategory is changed, ensure it is registered in master taxonomy.
    if (payload.category || payload.subcategory) {
      const existing = await Product.findById(req.params.id).lean();
      if (!existing) return res.status(404).json({ success: false, message: 'Product not found' });

      const finalCategory = payload.category || existing.category;
      const finalSubcategory = payload.subcategory !== undefined ? payload.subcategory : existing.subcategory;
      const normalized = await ensureCategoryAndSubcategory(finalCategory, finalSubcategory);

      payload.category = normalized.category;
      payload.subcategory = normalized.subcategory;
      payload.taxonomyStatus = 'confirmed';
      payload.requestedCategoryName = '';
      payload.requestedSubcategoryName = '';
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update product' });
  }
});

router.post('/products/:id/resolve-taxonomy', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const requestedCategory = String(product.requestedCategoryName || '').trim().toLowerCase();
    const requestedSubcategory = String(product.requestedSubcategoryName || '').trim().toLowerCase();

    const finalCategory = String(
      req.body.finalCategory ||
      (product.category !== 'other' ? product.category : requestedCategory) ||
      ''
    ).trim().toLowerCase();

    const finalSubcategory = String(
      req.body.finalSubcategory ||
      (product.subcategory !== 'other' ? product.subcategory : requestedSubcategory) ||
      ''
    ).trim().toLowerCase();

    const categoryImage = String(req.body.categoryImage || product.requestedCategoryImage || '').trim();
    const subcategoryReferenceImage = String(
      req.body.subcategoryReferenceImage || product.requestedSubcategoryImage || ''
    ).trim();

    const normalized = await ensureCategoryAndSubcategory(
      finalCategory,
      finalSubcategory,
      { categoryImage, subcategoryReferenceImage }
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          category: normalized.category,
          subcategory: normalized.subcategory,
          requestedCategoryName: '',
          requestedSubcategoryName: '',
          requestedCategoryImage: '',
          requestedSubcategoryImage: '',
          taxonomyStatus: 'confirmed',
        },
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Taxonomy approved and synced successfully',
      product: updatedProduct,
    });
  } catch (err) {
    console.error('Resolve taxonomy error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to resolve taxonomy' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate({
        path: 'productId',
        select: 'name price category subcategory images clerkId',
      })
      .sort({ createdAt: -1 });

    const clerkIds = [...new Set(enquiries
      .map((enq) => enq?.productId?.clerkId)
      .filter(Boolean))];

    const sellers = await Seller.find({ clerkId: { $in: clerkIds } }).lean();
    const sellerMap = new Map(sellers.map((seller) => [seller.clerkId, seller]));

    const enriched = enquiries.map((enq) => {
      const seller = enq.productId?.clerkId ? sellerMap.get(enq.productId.clerkId) : null;
      return {
        ...enq.toObject(),
        sellerProfile: seller
          ? {
              _id: seller._id,
              clerkId: seller.clerkId,
              name: seller.name,
              email: seller.email,
              phone: seller.phone,
              company: seller.company,
              website: seller.website,
              address: seller.address,
            }
          : null,
      };
    });

    res.json({ success: true, enquiries: enriched });
  } catch (err) {
    console.error('Enquiries fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

router.put('/enquiries/:id', async (req, res) => {
  try {
    const allowed = [
      'message', 'status', 'repliedAt',
      'buyerName', 'buyerEmail', 'buyerPhone', 'buyerCompany', 'buyerWebsite',
      'sellerName', 'sellerEmail', 'sellerPhone', 'sellerCompany', 'sellerWebsite',
    ];

    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    if (payload.buyerEmail) payload.buyerEmail = String(payload.buyerEmail).trim().toLowerCase();
    if (payload.sellerEmail) payload.sellerEmail = String(payload.sellerEmail).trim().toLowerCase();

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    res.json({ success: true, message: 'Enquiry updated successfully', enquiry });
  } catch (err) {
    console.error('Enquiry update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update enquiry' });
  }
});

module.exports = router;

