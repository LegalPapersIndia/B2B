// routes/adminAuth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ====================== ADMIN CREDENTIALS ======================
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "superadmin",
  password: process.env.ADMIN_PASSWORD || "Admin@123456"
};

const JWT_SECRET = process.env.JWT_SECRET || "superadmin-secret-key-change-this-in-production-2026";

// ====================== ADMIN LOGIN ======================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;  
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Username and password are required" 
      });
    }

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { 
          role: "superadmin", 
          username: username 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: "Login successful",
        token: token,
        admin: {
          username: username,
          role: "superadmin"
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====================== ADMIN AUTH MIDDLEWARE ======================
const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first."
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Super Admin only"
      });
    }

    req.admin = decoded;   // Admin info attach kar diya
    next();                // Agla middleware/route chalane do

  } catch (error) {
    console.error("JWT Verify Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

module.exports = { 
  router, 
  authenticateAdmin 
};