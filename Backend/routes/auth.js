const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const Seller = require('../models/Seller');

const authMiddleware = ClerkExpressRequireAuth({
  onError: (err, req, res) => res.status(401).json({ error: 'Unauthorized' }),
});

function normalizeWebsite(website) {
  if (!website) return '';
  const value = String(website).trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
}

function isProfileComplete(user) {
  return !!(
    user &&
    user.name &&
    user.email &&
    user.phone &&
    user.company &&
    user.address
  );
}

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const primaryEmail =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.primaryEmailAddress?.emailAddress ||
      '';
    const fullName =
      clerkUser.fullName ||
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
      '';

    let user = await Seller.findOne({ clerkId });

    if (!user) {
      user = await Seller.create({
        clerkId,
        name: fullName,
        email: primaryEmail,
      });
    } else if (!user.email && primaryEmail) {
      user.email = primaryEmail;
      if (!user.name && fullName) user.name = fullName;
      await user.save();
    }

    const complete = isProfileComplete(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        website: user.website,
        address: user.address,
        isProfileComplete: complete,
      },
    });
  } catch (error) {
    console.error('GET /me ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/complete-profile', authMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const clerkEmail =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.primaryEmailAddress?.emailAddress ||
      '';
    const clerkFullName =
      clerkUser.fullName ||
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
      '';

    const name = String(req.body.name || req.body.fullName || req.body.businessName || clerkFullName || '').trim();
    const company = String(req.body.company || req.body.businessName || '').trim();
    const email = String(req.body.email || clerkEmail || '').trim().toLowerCase();
    const phone = String(req.body.phone || req.body.mobile || '').trim();
    const address = String(req.body.address || '').trim();
    const website = normalizeWebsite(req.body.website);

    const finalName = name || company;

    if (!company || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Company/Business name, phone/mobile and address are mandatory',
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required. Please add email in account or send email in request.',
      });
    }

    const payload = {
      name: finalName,
      company,
      email,
      phone,
      address,
      website,
      profileCompletedAt: new Date(),
    };

    const user = await Seller.findOneAndUpdate(
      { clerkId },
      { $set: payload, $setOnInsert: { clerkId } },
      { upsert: true, new: true }
    );

    await clerkClient.users.updateUser(clerkId, {
      unsafeMetadata: {
        profileCompleted: true,
        name: finalName,
        company,
        phone,
        email,
        address,
        website,
        // backward compatible keys for old frontend checks
        businessName: company,
        mobile: phone,
      },
    });

    res.json({
      success: true,
      message: 'Profile successfully saved',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        website: user.website,
        address: user.address,
        isProfileComplete: true,
      },
    });
  } catch (error) {
    console.error('Complete Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
