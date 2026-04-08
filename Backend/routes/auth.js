// routes/auth.js
const express = require("express");
const router = express.Router();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { clerkClient } = require("@clerk/clerk-sdk-node");

const Seller = require("../models/Seller"); // Sirf Seller model use kar rahe hain

const authMiddleware = ClerkExpressRequireAuth({
  onError: (err, req, res) => res.status(401).json({ error: "Unauthorized" }),
});

// ================= GET CURRENT USER =================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    let user = await Seller.findOne({ clerkId });

    // Agar user nahi mila to default bana do
    if (!user) {
      user = new Seller({
        clerkId,
        name: req.auth.sessionClaims?.firstName || "New User",
        email: req.auth.sessionClaims?.email || "",
      });
      await user.save();
    }

    const isProfileComplete = !!(user.company && user.phone && user.address);

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        address: user.address,
        isProfileComplete, // ← Yeh important hai frontend ke liye
      },
    });
  } catch (error) {
    console.error("GET /me ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= COMPLETE PROFILE (Signup + First Login dono ke liye) =================
router.post("/complete-profile", authMiddleware, async (req, res) => {
  try {
    const { businessName, mobile, address } = req.body;
    const clerkId = req.auth.userId;

    if (!businessName || !mobile || !address) {
      return res.status(400).json({
        success: false,
        message: "Business Name, Mobile Number aur Address mandatory hain",
      });
    }

    let seller = await Seller.findOne({ clerkId });

    if (!seller) {
      seller = new Seller({
        clerkId,
        name: businessName,
        company: businessName,
        phone: mobile,
        address: address,
        email: req.auth.sessionClaims?.email || "",
      });
    } else {
      seller.name = businessName;
      seller.company = businessName;
      seller.phone = mobile;
      seller.address = address;
    }

    await seller.save();

    // Clerk metadata update
    await clerkClient.users.updateUser(clerkId, {
      unsafeMetadata: {
        businessName,
        mobile,
        address,
        profileCompleted: true,
      },
    });

    res.json({
      success: true,
      message: "Profile successfully saved",
    });
  } catch (error) {
    console.error("Complete Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
