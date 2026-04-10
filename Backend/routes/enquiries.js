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
      enquiryType: 'message',
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

router.post('/contact-click', requireAuth, async (req, res) => {
  try {
    const {
      productId,
      contactMethod,
      buyerName: buyerNameInput,
      buyerEmail: buyerEmailInput,
      buyerPhone: buyerPhoneInput,
      buyerCompany: buyerCompanyInput,
      buyerWebsite: buyerWebsiteInput,
    } = req.body;
    const buyerClerkId = req.auth.userId;
    const normalizedMethod = String(contactMethod || '').trim().toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (!['phone', 'email', 'website'].includes(normalizedMethod)) {
      return res.status(400).json({ error: 'Invalid contact method' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.clerkId === buyerClerkId) {
      return res.status(400).json({ error: 'You cannot enquire on your own product' });
    }

    const [seller, buyerProfile] = await Promise.all([
      Seller.findOne({ clerkId: product.clerkId }),
      Seller.findOne({ clerkId: buyerClerkId }),
    ]);

    if (!seller) {
      return res.status(404).json({ error: 'Seller profile not available' });
    }

    const buyerName = String(buyerProfile?.name || buyerNameInput || '').trim();
    const buyerEmail = String(buyerProfile?.email || buyerEmailInput || '').trim().toLowerCase();
    const buyerPhone = String(buyerProfile?.phone || buyerPhoneInput || '').trim();
    const buyerCompany = String(buyerProfile?.company || buyerCompanyInput || '').trim();
    const buyerWebsite = String(buyerProfile?.website || buyerWebsiteInput || '').trim();

    if (!buyerName || !buyerEmail) {
      return res.status(400).json({
        error: 'Buyer profile incomplete',
        message: 'Buyer name and email are required to track contact click enquiry',
      });
    }

    const contactValue =
      normalizedMethod === 'phone'
        ? String(seller.phone || '').trim()
        : normalizedMethod === 'email'
        ? String(seller.email || '').trim()
        : String(seller.website || '').trim();

    if (!contactValue) {
      return res.status(400).json({ error: `Seller ${normalizedMethod} not available` });
    }

    const enquiry = new Enquiry({
      productId,
      buyerClerkId,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerCompany,
      buyerWebsite,
      sellerName: seller.name,
      sellerEmail: seller.email,
      sellerPhone: seller.phone,
      sellerCompany: seller.company,
      sellerWebsite: seller.website || '',
      enquiryType: 'contact_click',
      contactMethod: normalizedMethod,
      contactValue,
      message: `Buyer clicked seller ${normalizedMethod} from explore page`,
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Contact click enquiry recorded',
      enquiry,
    });
  } catch (err) {
    console.error('CONTACT CLICK ENQUIRY ERROR:', err);
    res.status(500).json({
      error: 'Failed to record contact click enquiry',
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

router.patch('/my/:id/status', requireAuth, async (req, res) => {
  try {
    const sellerClerkId = req.auth.userId;
    const nextStatus = String(req.body.status || '').trim().toLowerCase();
    const allowedStatuses = ['pending', 'contacted', 'rejected', 'closed'];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ error: 'Invalid enquiry status' });
    }

    const enquiry = await Enquiry.findById(req.params.id).populate({
      path: 'productId',
      select: 'clerkId',
    });

    if (!enquiry || !enquiry.productId) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    if (String(enquiry.productId.clerkId || '') !== sellerClerkId) {
      return res.status(403).json({ error: 'You are not allowed to update this enquiry' });
    }

    enquiry.status = nextStatus;
    enquiry.sellerStatusUpdatedAt = new Date();
    if (['contacted', 'closed'].includes(nextStatus)) {
      enquiry.repliedAt = new Date();
    }

    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry,
    });
  } catch (err) {
    console.error('SELLER ENQUIRY STATUS UPDATE ERROR:', err);
    res.status(500).json({ error: 'Failed to update enquiry status' });
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
