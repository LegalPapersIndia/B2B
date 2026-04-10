const express = require('express');
const mongoose = require('mongoose');
const Seller = require('../models/Seller');
const Product = require('../models/Product');

const router = express.Router();

function hasCompletedProfile(seller) {
  return !!(
    seller &&
    seller.name &&
    seller.email &&
    seller.phone &&
    seller.company &&
    seller.address
  );
}

function buildLocation(seller) {
  return [seller.city, seller.state, seller.country]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(', ');
}

function formatCompanyPayload(seller, extras = {}) {
  return {
    _id: seller._id,
    clerkId: seller.clerkId,
    name: seller.name || '',
    company: seller.company || '',
    email: seller.email || '',
    phone: seller.phone || '',
    website: seller.website || '',
    address: seller.address || '',
    city: seller.city || '',
    state: seller.state || '',
    country: seller.country || '',
    gstNumber: seller.gstNumber || '',
    businessType: seller.businessType || '',
    location: buildLocation(seller),
    profileCompletedAt: seller.profileCompletedAt || null,
    createdAt: seller.createdAt || null,
    ...extras,
  };
}

router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 }).lean();
    const validSellers = sellers.filter(hasCompletedProfile);
    const clerkIds = validSellers.map((seller) => seller.clerkId).filter(Boolean);

    const productCounts = await Product.aggregate([
      {
        $match: {
          taxonomyStatus: 'confirmed',
          clerkId: { $in: clerkIds },
        },
      },
      {
        $group: {
          _id: '$clerkId',
          productCount: { $sum: 1 },
          categories: { $addToSet: '$category' },
        },
      },
    ]);

    const countsMap = new Map(productCounts.map((entry) => [entry._id, entry]));

    const companies = validSellers.map((seller) => {
      const productMeta = countsMap.get(seller.clerkId);
      return formatCompanyPayload(seller, {
        productCount: productMeta?.productCount || 0,
        categories: productMeta?.categories || [],
      });
    });

    res.json({ success: true, companies });
  } catch (err) {
    console.error('Public companies fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch companies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid company id' });
    }

    const seller = await Seller.findById(req.params.id).lean();
    if (!seller || !hasCompletedProfile(seller)) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const products = await Product.find({
      clerkId: seller.clerkId,
      taxonomyStatus: 'confirmed',
    })
      .sort({ createdAt: -1 })
      .lean();

    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

    res.json({
      success: true,
      company: formatCompanyPayload(seller, {
        productCount: products.length,
        categories,
      }),
      products,
    });
  } catch (err) {
    console.error('Public company details fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch company details' });
  }
});

module.exports = router;
