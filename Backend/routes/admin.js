const express = require('express');
const router = express.Router();
const multer = require('multer');

const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Seller = require('../models/Seller');
const Category = require('../models/Category');
const CategoryRequest = require('../models/CategoryRequest');
const { generateLocalSellerId, hashPassword } = require('../utils/sellerAuth');
const { uploadBufferToCloudinary } = require('../utils/cloudinary');
const { buildSellerLookupFromStoredOwner } = require('../utils/sellerIdentity');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
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

async function buildCategoryPayload(req) {
  const payload = {};
  const files = req.files || [];
  const clearCategoryImage = ['1', 'true', 'yes'].includes(String(req.body.clearImage || '').toLowerCase());
  const clearSubcategoryImages = req.body.clearSubcategoryImages
    ? (() => {
        try {
          const parsed = JSON.parse(req.body.clearSubcategoryImages);
          return Array.isArray(parsed)
            ? parsed.map((name) => String(name || '').trim().toLowerCase()).filter(Boolean)
            : [];
        } catch {
          return [];
        }
      })()
    : [];

  if (typeof req.body.name === 'string') {
    payload.name = req.body.name.trim().toLowerCase();
  }

  if (typeof req.body.description === 'string') {
    payload.description = req.body.description.trim();
  }

  if (req.body.subcategories !== undefined) {
    const normalized = normalizeSubcategories(req.body.subcategories);

    payload.subcategories = await Promise.all(normalized.map(async (item, index) => {
      const file = files.find((f) => f.fieldname === `subcategoryImage_${index}`);
      if (clearSubcategoryImages.includes(item.name) && !file) {
        return { ...item, referenceImage: '' };
      }
      if (file) {
        const imageUrl = await uploadBufferToCloudinary(file.buffer);
        return { ...item, referenceImage: imageUrl };
      }
      return item;
    }));
  }

  const categoryImage = files.find((f) => f.fieldname === 'image');
  if (categoryImage) {
    payload.image = await uploadBufferToCloudinary(categoryImage.buffer);
  } else if (clearCategoryImage) {
    payload.image = '';
  }

  return payload;
}

async function getEnrichedProduct(product) {
  const sellerLookup = buildSellerLookupFromStoredOwner(product.clerkId);
  const seller = sellerLookup ? await Seller.findOne(sellerLookup).lean() : null;
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
          avatar: seller.avatar,
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
  const clearCategoryImage = options.clearCategoryImage === true;
  const clearSubcategoryReferenceImage = options.clearSubcategoryReferenceImage === true;

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
      image: categoryImage || '',
      subcategories: [],
    });
  } else if (categoryImage) {
    categoryDoc.image = categoryImage;
  } else if (clearCategoryImage) {
    categoryDoc.image = '';
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
      referenceImage: clearSubcategoryReferenceImage ? '' : String(subcategoryReferenceImage || '').trim(),
    });
  } else {
    const current = existingSubcategories[index];
    const currentRef = typeof current === 'string' ? '' : String(current.referenceImage || '').trim();
    existingSubcategories[index] = {
      name: normalizedSubcategory,
      referenceImage: clearSubcategoryReferenceImage
        ? ''
        : (String(subcategoryReferenceImage || '').trim() || currentRef),
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
        image: dbCat?.image || '',
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
    const payload = await buildCategoryPayload(req);

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
    const payload = await buildCategoryPayload(req);

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
      .select('clerkId name email phone company website address city state country gstNumber avatar profileCompletedAt createdAt updatedAt')
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
      'city', 'state', 'country', 'gstNumber', 'profileCompletedAt', 'isPremium',
    ];

    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (updateData.email) updateData.email = String(updateData.email).trim().toLowerCase();
    if (updateData.website) updateData.website = String(updateData.website).trim();
    if (updateData.isPremium !== undefined) updateData.isPremium = Boolean(updateData.isPremium);

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
      .select('name company email phone gstNumber address city state country avatar createdAt isPremium')
      .sort({ createdAt: -1 });

    res.json({ success: true, companies });
  } catch (err) {
    console.error('Companies fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch companies' });
  }
});

router.post('/companies', async (req, res) => {
  try {
    const company = String(req.body.company || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const name = String(req.body.name || company || '').trim();

    // ✅ VALIDATION
    if (!company || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Company, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // ✅ CHECK EXISTING USER
    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // ✅ CREATE SELLER (LOCAL AUTH)
    const seller = await Seller.create({
      clerkId: generateLocalSellerId(),   // 🔥 IMPORTANT
      authProvider: 'local',
      name,
      company,
      email,
      isPremium: req.body.isPremium === true,
      passwordHash: hashPassword(password),
      profileCompletedAt: null,
      invitedByAdminAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      seller: {
        _id: seller._id,
        company: seller.company,
        email: seller.email,
        isPremium: seller.isPremium,
      },
    });

  } catch (err) {
    console.error('Add company error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add company',
    });
  }
});

router.put('/companies/:id', async (req, res) => {
  try {
    const updateData = {};

    if (req.body.company !== undefined) updateData.company = String(req.body.company || '').trim();
    if (req.body.name !== undefined) updateData.name = String(req.body.name || '').trim();
    if (req.body.email !== undefined) updateData.email = String(req.body.email || '').trim().toLowerCase();
    if (req.body.phone !== undefined) updateData.phone = String(req.body.phone || '').trim();
    if (req.body.isPremium !== undefined) updateData.isPremium = Boolean(req.body.isPremium);

    const updated = await Seller.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('name company email phone gstNumber address city state country avatar createdAt isPremium');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      company: updated,
    });
  } catch (err) {
    console.error('Update company error:', err);
    res.status(500).json({ success: false, message: 'Failed to update company' });
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
    const clearCategoryImage = ['1', 'true', 'yes'].includes(String(req.body.clearCategoryImage || '').toLowerCase());
    const clearSubcategoryReferenceImage = ['1', 'true', 'yes'].includes(String(req.body.clearSubcategoryReferenceImage || '').toLowerCase());

    const normalized = await ensureCategoryAndSubcategory(
      finalCategory,
      finalSubcategory,
      { categoryImage, subcategoryReferenceImage, clearCategoryImage, clearSubcategoryReferenceImage }
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
              avatar: seller.avatar,
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

router.get('/other-enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ enquiryType: 'other_requirement' })
      .populate('assignedSellerIds', 'name company email phone avatar clerkId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, enquiries });
  } catch (err) {
    console.error('Other enquiries fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch other enquiries' });
  }
});

router.put('/other-enquiries/:id/forward', async (req, res) => {
  try {
    let sellerIds = req.body.sellerIds;
    if (!sellerIds || !Array.isArray(sellerIds)) {
      sellerIds = [String(req.body.sellerId || '').trim()]; // backward compat
    }
    sellerIds = sellerIds.map(id => String(id).trim()).filter(Boolean);
    if (sellerIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one seller is required' });
    }

    const sellers = await Seller.find({ _id: { $in: sellerIds } }).lean();
    if (sellers.length !== sellerIds.length) {
      return res.status(400).json({ success: false, message: 'One or more sellers not found' });
    }

    const sellerClerkIds = sellers.map(s => s.clerkId);
    const firstSeller = sellers[0];

    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: req.params.id, enquiryType: 'other_requirement' },
      {
        $addToSet: {
          assignedSellerIds: { $each: sellers.map(s => s._id) },
          assignedSellerClerkIds: { $each: sellerClerkIds },
        },
        $set: {
          assignedSellerId: firstSeller._id,
          assignedSellerClerkId: firstSeller.clerkId,
          sellerName: firstSeller.name || '',
          sellerEmail: firstSeller.email || '',
          sellerPhone: firstSeller.phone || '',
          sellerCompany: firstSeller.company || '',
          sellerWebsite: firstSeller.website || '',
          forwardedAt: new Date(),
          forwardedBy: req.adminId || 'admin',
          status: 'pending',
        },
      },
      { new: true, runValidators: true }
    ).populate('assignedSellerIds', 'name company email phone avatar clerkId');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Other enquiry not found' });
    }

    res.json({
      success: true,
      message: 'Enquiry forwarded successfully',
      enquiry,
    });
  } catch (err) {
    console.error('Forward other enquiry error:', err);
    res.status(500).json({ success: false, message: 'Failed to forward enquiry' });
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

// Category Request Routes
router.get('/category-requests', async (req, res) => {
  try {
    const requests = await CategoryRequest.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, requests });
  } catch (err) {
    console.error('Fetch requests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
});

router.put('/category-requests/:id/approve', async (req, res) => {
  try {
    const request = await CategoryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }

    if (request.type === 'category') {
      // Create new category
      const category = new Category({
        name: request.name,
        description: request.description,
        image: request.image,
        subcategories: [],
      });
      await category.save();
    } else if (request.type === 'subcategory') {
      // Add to existing category
      const category = await Category.findOne({ name: request.category });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Parent category not found' });
      }

      category.subcategories.push({
        name: request.name,
        referenceImage: request.image,
      });
      await category.save();
    }

    request.status = 'approved';
    request.reviewedBy = req.adminId || 'admin'; // Assuming admin auth sets this
    await request.save();

    res.json({ success: true, message: 'Request approved successfully' });
  } catch (err) {
    console.error('Approve request error:', err);
    res.status(500).json({ success: false, message: 'Failed to approve request' });
  }
});

router.put('/category-requests/:id/reject', async (req, res) => {
  try {
    const { note } = req.body;
    const request = await CategoryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }

    request.status = 'rejected';
    request.reviewedBy = req.adminId || 'admin';
    request.reviewNote = note || '';
    await request.save();

    res.json({ success: true, message: 'Request rejected successfully' });
  } catch (err) {
    console.error('Reject request error:', err);
    res.status(500).json({ success: false, message: 'Failed to reject request' });
  }
});

// DELETE COMPANY
router.delete('/companies/:id', async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (err) {
    console.error('Delete company error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company'
    });
  }
});

module.exports = router;
