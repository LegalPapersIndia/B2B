// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth'); // ADD THIS
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');
const { router: adminAuthRoutes, authenticateAdmin } = require('./routes/adminAuth');


const app = express();

// ====================== MIDDLEWARE (Order is VERY Important) ======================
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173', // user/seller panel
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL  // admin panel
];

app.use(cors({
  origin: function(origin, callback) {
    console.log("🌐 Incoming Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("CORS not allowed: " + origin));
    }
  },
  credentials: true
}));

// ✅ Body parsers MUST come BEFORE auth middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Clerk Auth - Place AFTER body parsers
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
app.use(ClerkExpressWithAuth());   // Global auth (optional)

// ====================== ROUTES ======================
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // ADD THIS
app.use('/api/enquiries', enquiryRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api/categories', require('./routes/category'));

// Health Check
app.get('/', (req, res) => {
  res.json({ message: '✅ B2B Backend is running successfully!' });
});

// Admin Auth Route
app.use('/api/admin/auth', adminAuthRoutes);

// Protected Admin Routes
app.use('/api/admin', authenticateAdmin, adminRoutes);

// ====================== MONGO CONNECTION ======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});