const express = require('express');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const multer = require('multer');

const Seller = require('../models/Seller');
const { requireSellerAuth } = require('../middleware/requireSellerAuth');
const { buildSellerLookupFromAuth } = require('../utils/sellerIdentity');

// ===================== MULTER SETUP =====================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ===================== HELPERS =====================
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
    user.company &&
    user.email &&
    user.phone &&
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
    gstNumber: user.gstNumber,
    industry: user.businessType,
    avatar: user.avatar,
    isPremium: user.isPremium === true,
    isProfileComplete: isProfileComplete(user),
  };
}

// ===================== ROUTER =====================
const router = express.Router();

// Login Route (keeping your existing one)
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

    const isValid = require('../utils/sellerAuth').verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = require('../utils/sellerAuth').createSellerToken(user);

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /me
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
      const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || 
                          clerkUser.emailAddresses?.[0]?.emailAddress || '';
      const fullName = clerkUser.fullName || 
                      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

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

// COMPLETE PROFILE - Main Route (with image upload)
router.post(
  '/complete-profile',
  requireSellerAuth,
  upload.single('profilePhoto'),
  async (req, res) => {
    try {
      const sellerId = req.auth.userId;
      let clerkEmail = '';
      let clerkFullName = '';

      if (req.sellerAuth?.provider !== 'local') {
        const clerkUser = await clerkClient.users.getUser(sellerId);
        clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || 
                     clerkUser.emailAddresses?.[0]?.emailAddress || '';
        clerkFullName = clerkUser.fullName || 
                        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
      }

      const sellerLookup = buildSellerLookupFromAuth(req);
      const existingUser = sellerLookup ? await Seller.findOne(sellerLookup) : null;

      const company = String(req.body.businessName || req.body.company || existingUser?.company || '').trim();
      const email = String(req.body.email || clerkEmail || existingUser?.email || '').trim().toLowerCase();
      const phone = String(req.body.mobile || req.body.phone || existingUser?.phone || '').trim();
      const address = String(req.body.address || existingUser?.address || '').trim();
      const website = normalizeWebsite(req.body.website || existingUser?.website);
      const gstNumber = String(req.body.gstNumber || existingUser?.gstNumber || '').trim().toUpperCase();
      const industry = String(req.body.industry || existingUser?.businessType || '').trim();

      const name = String(req.body.name || req.body.fullName || company || existingUser?.name || '').trim();

      if (!company) return res.status(400).json({ success: false, message: 'Business name is required' });
      if (!phone) return res.status(400).json({ success: false, message: 'Mobile number is required' });
      if (!address) return res.status(400).json({ success: false, message: 'Address is required' });
      if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

      // Upload profile photo to Cloudinary
      let avatarUrl = existingUser?.avatar;
      if (req.file) {
        try {
          const uploadToCloudinary = require('../utils/cloudinary'); // Change path if needed
          const uploadResult = await uploadToCloudinary(req.file.buffer, {
            folder: 'seller-profiles',
            public_id: `seller_${sellerId}`,
            overwrite: true,
          });
          avatarUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error('Cloudinary upload failed:', uploadErr);
        }
      }

      const payload = {
        name,
        company,
        email,
        phone,
        address,
        website,
        gstNumber,
        businessType: industry,
        avatar: avatarUrl,
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

      // Update Clerk metadata
      if (req.sellerAuth?.provider !== 'local') {
        try {
          await clerkClient.users.updateUser(sellerId, {
            unsafeMetadata: {
              profileCompleted: true,
              businessName: company,
              mobile: phone,
              address,
              website,
              gstNumber,
              industry,
              avatar: avatarUrl,
            },
          });
        } catch (clerkErr) {
          console.error('Clerk metadata update failed:', clerkErr);
        }
      }

      res.json({
        success: true,
        message: 'Business profile updated successfully',
        user: formatUserResponse(user),
      });
    } catch (error) {
      console.error('Complete Profile Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

module.exports = router;