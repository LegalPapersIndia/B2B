const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const mongoose = require('mongoose');

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// ================= AUTH =================
const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) =>
    res.status(401).json({ error: 'Unauthorized' })
});

// ================= CREATE ENQUIRY =================
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, message } = req.body;
    const buyerClerkId = req.auth.userId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    // ================= PRODUCT =================
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ================= SELLER =================
    const seller = await Seller.findOne({ clerkId: product.clerkId });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // ================= BUYER (CLERK) =================
    const clerkUser = await clerkClient.users.getUser(buyerClerkId);

    const buyerEmail =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.primaryEmailAddress?.emailAddress;

    const buyerName =
      clerkUser.fullName ||
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
      "Buyer";

    const buyerCompany = clerkUser.unsafeMetadata?.company || '';

    if (!buyerEmail) {
      return res.status(400).json({ error: "Email not found" });
    }

    // ================= SAVE =================
    const enquiry = new Enquiry({
      productId,
      buyerClerkId,

      buyerName,
      buyerEmail,
      buyerCompany,

      sellerName: seller.name || "Seller",
      sellerCompany: seller.company || "",

      message: message || "Interested in this product"
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry sent successfully"
    });

  } catch (err) {
    console.error("ENQUIRY ERROR:", err);
    res.status(500).json({
      error: "Failed to send enquiry",
      details: err.message
    });
  }
});

// ================= SELLER SIDE =================
router.get('/my', requireAuth, async (req, res) => {
  try {
    const sellerClerkId = req.auth.userId;

    const enquiries = await Enquiry.find()
      .populate({
        path: 'productId',
        select: 'name price images category clerkId',
        match: { clerkId: sellerClerkId }
      })
      .sort({ createdAt: -1 });

    const filtered = enquiries.filter(e => e.productId !== null);

    res.json(filtered);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

// ================= ADMIN (ALL ENQUIRIES) =================
router.get('/all', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('productId', 'name price')
      .sort({ createdAt: -1 });

    res.json({ enquiries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all enquiries" });
  }
});

module.exports = router;