// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Seller = require("../models/Seller");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => res.status(401).json({ error: "Unauthorized" })
});

// ================= ADD PRODUCT (Improved with better debugging) =================
router.post("/", requireAuth, upload.array("images", 4), async (req, res) => {
  try {
    const { name, category, price, moq, description } = req.body;

    console.log("Received Product Data:", { name, category, price, moq }); // Debug

    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, Category and Price are required" });
    }

    const clerkId = req.auth.userId;

    // ================= Get Seller Info =================
    let sellerName = "Unknown Seller";
    let sellerCompany = "Not Provided";

    const metadata = req.auth.sessionClaims?.unsafeMetadata || {};

    if (metadata.businessName || metadata.company) {
      sellerCompany = metadata.businessName || metadata.company;
      sellerName = sellerCompany;
    } else {
      // Fetch from database
      const seller = await Seller.findOne({ clerkId });
      if (seller) {
        sellerName = seller.name || "Unknown Seller";
        sellerCompany = seller.company || "Not Provided";
      }
    }

    console.log("Seller Info:", { sellerName, sellerCompany }); // Debug

    // ================= Upload Images =================
    let imageUrls = [];
    if (req.files?.length > 0) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { resource_type: "auto" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            ).end(file.buffer);
          });
          imageUrls.push(result.secure_url);
        } catch (uploadErr) {
          console.error("Cloudinary Error:", uploadErr);
        }
      }
    }

    // ================= Create Product =================
    const product = new Product({
      clerkId,
      sellerName,           // ← Yeh required hai
      sellerCompany,
      name: name.trim(),
      category: category.toLowerCase().trim(),
      price: Number(price),
      moq: moq ? Number(moq) : 100,
      description: description?.trim() || "",
      images: imageUrls,
    });

    await product.save();

    console.log("Product saved successfully:", product._id);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (err) {
    console.error("=== FULL ADD PRODUCT ERROR ===", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "Something went wrong while adding product"
    });
  }
});

// Other routes (GET /my, PUT, DELETE) same rakh sakte ho
router.get("/my", requireAuth, async (req, res) => {
  try {
    const products = await Product.find({ clerkId: req.auth.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;