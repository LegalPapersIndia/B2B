const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const mongoose = require('mongoose');

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => res.status(401).json({ error: 'Unauthorized' }),
});

function hasCompletedProfile(user) {
  return !!(
    user &&
    user.name &&
    user.email &&
    user.phone &&
    user.company &&
    user.address
  );
}

async function requireCompletedProfile(req, res, next) {
  try {
    const profile = await Seller.findOne({ clerkId: req.auth.userId });

    if (!profile || !hasCompletedProfile(profile)) {
      return res.status(403).json({
        error: 'Profile incomplete',
        message: 'Please complete profile first to send enquiry',
      });
    }

    req.currentUserProfile = profile;
    next();
  } catch (err) {
    next(err);
  }
}

router.post('/', requireAuth, requireCompletedProfile, async (req, res) => {
  try {
    const { productId, message } = req.body;
    const buyerClerkId = req.auth.userId;
    const buyerProfile = req.currentUserProfile;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.clerkId === buyerClerkId) {
      return res.status(400).json({ error: 'You cannot enquire on your own product' });
    }

    const seller = await Seller.findOne({ clerkId: product.clerkId });
    if (!seller || !hasCompletedProfile(seller)) {
      return res.status(404).json({ error: 'Seller profile not available' });
    }

    const enquiry = new Enquiry({
      productId,
      buyerClerkId,
      buyerName: buyerProfile.name,
      buyerEmail: buyerProfile.email,
      buyerPhone: buyerProfile.phone,
      buyerCompany: buyerProfile.company,
      buyerWebsite: buyerProfile.website || '',
      sellerName: seller.name,
      sellerEmail: seller.email,
      sellerPhone: seller.phone,
      sellerCompany: seller.company,
      sellerWebsite: seller.website || '',
      message: message || 'Interested in this product',
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry sent successfully',
      enquiry,
    });
  } catch (err) {
    console.error('ENQUIRY ERROR:', err);
    res.status(500).json({
      error: 'Failed to send enquiry',
      details: err.message,
    });
  }
});

router.get('/my', requireAuth, async (req, res) => {
  try {
    const sellerClerkId = req.auth.userId;

    const enquiries = await Enquiry.find()
      .populate({
        path: 'productId',
        select: 'name price images category clerkId',
        match: { clerkId: sellerClerkId },
      })
      .sort({ createdAt: -1 });

    const filtered = enquiries.filter((e) => e.productId !== null);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('productId', 'name price')
      .sort({ createdAt: -1 });

    res.json({ enquiries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all enquiries' });
  }
});

module.exports = router;
