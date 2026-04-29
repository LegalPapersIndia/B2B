const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const CategoryRequest = require('../models/CategoryRequest');
const multer = require('multer');
const { requireSellerAuth } = require('../middleware/requireSellerAuth');
const { uploadBufferToCloudinary } = require('../utils/cloudinary');
const {getAuthIdentityCandidates,buildSellerLookupFromAuth} = require('../utils/sellerIdentity');
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const requireAuth = requireSellerAuth;
function hasCompletedProfile(user) {
  return !!(user && user.name && user.email && user.phone && user.company && user.address);
}
function getUploadedFiles(req, fieldName) {
  return (req.files || []).filter((file) => file.fieldname === fieldName);
}
async function requireCompletedProfile(req, res, next) {
  try {
    const sellerLookup = buildSellerLookupFromAuth(req);
    const user = sellerLookup ? await Seller.findOne(sellerLookup) : null;
    if (!user || !hasCompletedProfile(user)) {
      return res.status(403).json({
        error: 'Profile incomplete',
        message: 'Please complete profile first to add products',
      });
    }
    req.currentUserProfile = user;
    next();
  } catch (err) {
    next(err);
  }
}
router.post('/', requireAuth, requireCompletedProfile, upload.any(), async (req, res) => {
  try {
    const { name, category, subcategory, otherCategory, otherSubcategory, price, moq, description } = req.body;

    const normalizedCategory = String(category || '').trim().toLowerCase();
    const normalizedSubcategory = String(subcategory || '').trim().toLowerCase();

    if (!name || !category || !price || !normalizedSubcategory) {
      return res.status(400).json({ error: 'Name, Category, Subcategory and Price are required' });
    }

    const user = req.currentUserProfile;
    const clerkId = user.clerkId || req.auth.userId;

    const productImageFiles = getUploadedFiles(req, 'images').slice(0, 4);
    const requestCategoryImageFile = getUploadedFiles(req, 'requestedCategoryImage')[0];
    const requestSubcategoryImageFile = getUploadedFiles(req, 'requestedSubcategoryImage')[0];

    const imageUrls = [];
    for (const file of productImageFiles) {
      const imageUrl = await uploadBufferToCloudinary(file.buffer);
      if (imageUrl) imageUrls.push(imageUrl);
    }

    const normalizedOtherCategory = String(otherCategory || '').trim().toLowerCase();
    const normalizedOtherSubcategory = String(otherSubcategory || '').trim().toLowerCase();
    const requestedCategoryImage =
      requestCategoryImageFile ? await uploadBufferToCloudinary(requestCategoryImageFile.buffer) : '';
    const requestedSubcategoryImage =
      requestSubcategoryImageFile ? await uploadBufferToCloudinary(requestSubcategoryImageFile.buffer) : '';

    const product = new Product({
      clerkId,
      sellerName: user.name,
      sellerCompany: user.company,
      name: name.trim(),
      category: normalizedCategory,
      subcategory: normalizedCategory === 'other' ? 'other' : normalizedSubcategory,
      requestedCategoryName: normalizedCategory === 'other' ? normalizedOtherCategory : '',
      requestedSubcategoryName:
        normalizedCategory === 'other'
          ? normalizedOtherSubcategory
          : (normalizedSubcategory === 'other' ? normalizedOtherSubcategory : ''),
      requestedCategoryImage: normalizedCategory === 'other' ? requestedCategoryImage : '',
      requestedSubcategoryImage:
        normalizedCategory === 'other'
          ? requestedSubcategoryImage
          : (normalizedSubcategory === 'other' ? requestedSubcategoryImage : ''),
      price: Number(price),
      moq: moq ? Number(moq) : 100,
      description: description?.trim() || '',
      images: imageUrls,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (err) {
    console.error('ADD PRODUCT ERROR:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }

    if (err.message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: err.message,
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong while adding product',
    });
  }
});

// Replace your current router.get('/') with this improved version

router.get('/', async (req, res) => {
  try {
    const { category, subcategory, homePreview } = req.query;
    const filter = {};

    if (category) filter.category = String(category).trim().toLowerCase();
    if (subcategory) filter.subcategory = String(subcategory).trim().toLowerCase();
    filter.taxonomyStatus = 'confirmed';

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const isHomePreview = ['1', 'true', 'yes'].includes(String(homePreview || '').toLowerCase());

    let visibleProducts = products;
    if (isHomePreview) {
      const seenKeys = new Set();
      visibleProducts = [];
      for (const product of products) {
        const key = `${product.category}::${product.subcategory || '__none__'}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        visibleProducts.push(product);
      }
    }

    const clerkIds = [...new Set(visibleProducts.map((p) => p.clerkId).filter(Boolean))];

    // 🔥 Important: isPremium field add kiya
    const sellers = await Seller.find({ clerkId: { $in: clerkIds } })
      .select('clerkId name company email phone website avatar isPremium')   // ← isPremium add kiya
      .lean();

    const sellerMap = new Map(sellers.map((s) => [s.clerkId, s]));

    const enriched = visibleProducts.map((product) => {
      const seller = sellerMap.get(product.clerkId);
      return {
        ...product,
        seller: seller
          ? {
              name: seller.name || product.sellerName || '',
              company: seller.company || product.sellerCompany || '',
              email: seller.email || '',
              phone: seller.phone || '',
              website: seller.website || '',
              avatar: seller.avatar || '',
              isPremium: seller.isPremium === true,        // ← Yeh line ab sahi se aayegi
            }
          : null,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
router.get('/my', requireAuth, async (req, res) => {
  try {
    const ownerIds = getAuthIdentityCandidates(req);
    const products = await Product.find({ clerkId: { $in: ownerIds } }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/:id', requireAuth, requireCompletedProfile, upload.any(), async (req, res) => {
  try {
    const { name, category, subcategory, otherCategory, otherSubcategory, price, moq, description } = req.body;

    const ownerIds = getAuthIdentityCandidates(req);
    const product = await Product.findOne({ _id: req.params.id, clerkId: { $in: ownerIds } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatePayload = {};
    if (name !== undefined) updatePayload.name = String(name).trim();
    if (price !== undefined) updatePayload.price = Number(price);
    if (moq !== undefined) updatePayload.moq = Number(moq);
    if (description !== undefined) updatePayload.description = String(description || '').trim();
    const hasCategory = category !== undefined;
    const hasSubcategory = subcategory !== undefined;
    if (hasCategory || hasSubcategory) {
      const normalizedCategory = String(category || '').trim().toLowerCase();
      const normalizedSubcategory = String(subcategory || '').trim().toLowerCase();
      const normalizedOtherCategory = String(otherCategory || '').trim().toLowerCase();
      const normalizedOtherSubcategory = String(otherSubcategory || '').trim().toLowerCase();
      const finalCategory = hasCategory ? normalizedCategory : String(product.category || '').trim().toLowerCase();
      const finalSubcategory = hasSubcategory ? normalizedSubcategory : String(product.subcategory || '').trim().toLowerCase();
      if (!finalSubcategory) {
        return res.status(400).json({ error: 'Subcategory is required' });
      }
      updatePayload.category = finalCategory;
      updatePayload.subcategory = finalCategory === 'other' ? 'other' : finalSubcategory;
      updatePayload.requestedCategoryName = finalCategory === 'other' ? normalizedOtherCategory : '';
      updatePayload.requestedSubcategoryName =
        finalCategory === 'other'
          ? normalizedOtherSubcategory
          : (finalSubcategory === 'other' ? normalizedOtherSubcategory : '');
    }
    const requestCategoryImageFile = getUploadedFiles(req, 'requestedCategoryImage')[0];
    const requestSubcategoryImageFile = getUploadedFiles(req, 'requestedSubcategoryImage')[0];
    const productImageFiles = getUploadedFiles(req, 'images').slice(0, 4);
    if (requestCategoryImageFile) {
      updatePayload.requestedCategoryImage = await uploadBufferToCloudinary(requestCategoryImageFile.buffer);
    }
    if (requestSubcategoryImageFile) {
      updatePayload.requestedSubcategoryImage = await uploadBufferToCloudinary(requestSubcategoryImageFile.buffer);
    }
    const nextCategory = String(updatePayload.category ?? product.category ?? '').trim().toLowerCase();
    const nextCategoryImage = String(
      updatePayload.requestedCategoryImage ?? product.requestedCategoryImage ?? ''
    ).trim();
    const nextSubcategoryImage = String(
      updatePayload.requestedSubcategoryImage ?? product.requestedSubcategoryImage ?? ''
    ).trim();
    if (nextCategory === 'other') {
      if (!nextCategoryImage) {
        return res.status(400).json({ error: 'Category image is required for a new category request' });
      }
      if (!nextSubcategoryImage) {
        return res.status(400).json({ error: 'Subcategory image is required for a new category request' });
      }
    }
    if (productImageFiles.length > 0) {
      const uploadedImages = [];
      for (const file of productImageFiles) {
        const imageUrl = await uploadBufferToCloudinary(file.buffer);
        if (imageUrl) uploadedImages.push(imageUrl);
      }
      if (uploadedImages.length > 0) {
        updatePayload.images = uploadedImages;
      }
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, message: 'Product updated', product: updated });
  } catch (err) {
    if (err.name === 'ValidationError' || err.message) {
      return res.status(400).json({ error: err.message || 'Failed to update product' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const ownerIds = getAuthIdentityCandidates(req);
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, clerkId: { $in: ownerIds } });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
router.post('/category-requests', requireAuth, requireCompletedProfile, upload.any(), async (req, res) => {
  try {
    const { type, name, description, category } = req.body;
    if (!type || !['category', 'subcategory'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be category or subcategory' });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (type === 'subcategory' && !category) {
      return res.status(400).json({ error: 'Category is required for subcategory requests' });
    }
    const clerkId = req.currentUserProfile?.clerkId || req.auth.userId;
    const imageFile = getUploadedFiles(req, 'image')[0];

    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadBufferToCloudinary(imageFile.buffer);
    }
    const request = new CategoryRequest({
      type,
      name: name.trim().toLowerCase(),
      description: description?.trim() || '',
      image: imageUrl,
      category: type === 'subcategory' ? category.trim().toLowerCase() : '',
      requestedBy: clerkId,
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} request submitted successfully`,
      request,
    });
  } catch (err) {
    console.error('Category request error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

router.get('/category-requests/my', requireAuth, async (req, res) => {
  try {
    const requestedBy = getAuthIdentityCandidates(req);
    const requests = await CategoryRequest.find({ requestedBy: { $in: requestedBy } }).sort({ createdAt: -1 }).lean();
    res.json(requests);
  } catch (err) {
    console.error('Fetch my requests error:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;
