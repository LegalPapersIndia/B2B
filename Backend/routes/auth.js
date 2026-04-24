const express = require('express');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const Seller = require('../models/Seller');
const { requireSellerAuth } = require('../middleware/requireSellerAuth');
const { createSellerToken, verifyPassword } = require('../utils/sellerAuth');
const { buildSellerLookupFromAuth } = require('../utils/sellerIdentity');

const router = express.Router();

function normalizeWebsite(website) {
  if (!website) return '';
  const value = String(website).trim();
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
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

function formatUserResponse(user) {
  return {
    id: user._id,
    clerkId: user.clerkId,
    authProvider: user.authProvider || 'clerk',
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company,
    website: user.website,
    address: user.address,
    isPremium: user.isPremium === true,
    isProfileComplete: isProfileComplete(user),
  };
}

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await Seller.findOne({ email, authProvider: 'local' })
      .select('+passwordHash');

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = createSellerToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

router.get('/me', requireSellerAuth, async (req, res) => {
  try {
    const sellerId = req.auth.userId;
    const sellerLookup = buildSellerLookupFromAuth(req);
    let user = sellerLookup ? await Seller.findOne(sellerLookup) : null;

    if (req.sellerAuth?.provider === 'local') {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Seller account not found',
        });
      }
    } else {
      const clerkUser = await clerkClient.users.getUser(sellerId);
      const primaryEmail =
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        clerkUser.primaryEmailAddress?.emailAddress ||
        '';
      const fullName =
        clerkUser.fullName ||
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        '';

      if (!user) {
        user = await Seller.create({
          clerkId: sellerId,
          authProvider: 'clerk',
          name: fullName,
          email: primaryEmail,
        });
      } else if (!user.email && primaryEmail) {
        user.email = primaryEmail;
        if (!user.name && fullName) user.name = fullName;
        await user.save();
      }
    }

    res.json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('GET /me ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/complete-profile', requireSellerAuth, async (req, res) => {
  try {
    const sellerId = req.auth.userId;
    let clerkEmail = '';
    let clerkFullName = '';

    if (req.sellerAuth?.provider !== 'local') {
      const clerkUser = await clerkClient.users.getUser(sellerId);

      clerkEmail =
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        clerkUser.primaryEmailAddress?.emailAddress ||
        '';

      clerkFullName =
        clerkUser.fullName ||
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        '';
    }

    const sellerLookup = buildSellerLookupFromAuth(req);
    const existingUser = sellerLookup ? await Seller.findOne(sellerLookup) : null;

    const name = String(req.body.name || req.body.fullName || req.body.businessName || clerkFullName || existingUser?.name || '').trim();
    const company = String(req.body.company || req.body.businessName || existingUser?.company || '').trim();
    const email = String(req.body.email || clerkEmail || existingUser?.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || req.body.mobile || existingUser?.phone || '').trim();
    const address = String(req.body.address || existingUser?.address || '').trim();
    const website = normalizeWebsite(req.body.website || existingUser?.website);

    const finalName = name || company;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Company/Business name is required',
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone/Mobile number is required',
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
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
      { clerkId: sellerId },
      {
        $set: payload,
        $setOnInsert: {
          clerkId: sellerId,
          authProvider: req.sellerAuth?.provider === 'local' ? 'local' : 'clerk',
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    if (req.sellerAuth?.provider !== 'local') {
      clerkClient.users.updateUser(sellerId, {
        unsafeMetadata: {
          profileCompleted: true,
          name: finalName,
          company,
          phone,
          email,
          address,
          website,
          businessName: company,
          mobile: phone,
        },
      }).catch((err) => console.error('Clerk metadata update failed:', err));
    }

    res.json({
      success: true,
      message: 'Profile completed successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Complete Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
