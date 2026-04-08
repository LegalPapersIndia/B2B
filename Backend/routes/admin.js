// routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Seller = require('../models/Seller');
const Category = require('../models/Category');

// Auto-create upload directory
const uploadDir = 'uploads/categories';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Upload directory created:', uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Default Categories
const allowedCategories = [
  'medicine', 'cosmetics', 'personal-care', 'food', 'beverages', 
  'confectionery', 'daily-use', 'home-kitchen', 'construction', 
  'machinery', 'electrical', 'apparel', 'textiles', 'electronics', 
  'automotive', 'agriculture', 'packaging', 'pet-supplies'
];

// ==================== CATEGORIES MANAGEMENT ====================

router.get('/categories', async (req, res) => {
  try {
    const dbCategories = await Category.find().sort({ name: 1 });
    
    const allCategories = [...new Set([
      ...allowedCategories,
      ...dbCategories.map(cat => cat.name)
    ])].sort();

    const enriched = allCategories.map(name => {
      const dbCat = dbCategories.find(c => c.name === name);
      return {
        _id: dbCat?._id,
        name,
        isDefault: allowedCategories.includes(name),
        description: dbCat?.description || "",
        image: dbCat?.image || "https://picsum.photos/id/20/600/400"
      };
    });

    res.json({ success: true, categories: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
});

// ==================== ADD CATEGORY ====================
router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const normalizedName = name?.trim().toLowerCase();

    if (!normalizedName || normalizedName.length < 2) {
      return res.status(400).json({ success: false, message: "Category name must be at least 2 characters" });
    }

    if (allowedCategories.includes(normalizedName)) {
      return res.status(400).json({ success: false, message: "This is a default category" });
    }

    const existing = await Category.findOne({ name: normalizedName });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const newCat = new Category({
      name: normalizedName,
      description: description?.trim(),
      image: req.file ? `/uploads/categories/${req.file.filename}` : undefined
    });

    await newCat.save();

    res.json({
      success: true,
      message: "Category added successfully",
      category: newCat
    });
  } catch (err) {
    console.error("Add Category Error:", err);
    res.status(500).json({ success: false, message: "Failed to add category" });
  }
});

// Update Category
router.put('/categories/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name?.trim().toLowerCase()
    };
    if (req.file) {
      updateData.image = `/uploads/categories/${req.file.filename}`;
    }
    if (req.body.description) {
      updateData.description = req.body.description.trim();
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

// Delete Category
router.delete('/categories/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });

    if (allowedCategories.includes(cat.name)) {
      return res.status(400).json({ success: false, message: "Cannot delete default category" });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

// ==================== ALL COMPANIES (Sellers) ====================
router.get('/companies', async (req, res) => {
  try {
    const companies = await Seller.find()
      .select('name company email phone gstNumber address city state country createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      companies: companies
    });
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ success: false, message: "Failed to fetch companies" });
  }
});

// ==================== ALL PRODUCTS (with Seller Name) ====================
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'clerkId',           // We will use virtual or join Seller
        select: 'name company'
      })
      .sort({ createdAt: -1 });

    // Better approach: Manually enrich with Seller data
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const seller = await Seller.findOne({ clerkId: product.clerkId });
        return {
          ...product.toObject(),
          sellerName: seller?.name || "Unknown Seller",
          sellerCompany: seller?.company || product.supplierName || "Not Provided"
        };
      })
    );

    res.json({
      success: true,
      products: enrichedProducts
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
});

// Delete Product (Already requested by you)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
});

// ==================== ALL ENQUIRIES ====================
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate({
        path: 'productId',
        select: 'name price category images clerkId'
      })
      .sort({ createdAt: -1 });

    // 🔥 Seller data attach karo
    const enriched = await Promise.all(
      enquiries.map(async (enq) => {
        let seller = null;

        if (enq.productId?.clerkId) {
          seller = await Seller.findOne({ clerkId: enq.productId.clerkId });
        }

        return {
          ...enq.toObject(),
          sellerName: seller?.name || "Unknown Seller",
          sellerEmail: seller?.email || "N/A",
          sellerCompany: seller?.company || "N/A",
        };
      })
    );

    res.json({
      success: true,
      enquiries: enriched
    });

  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
  }
});

module.exports = router;