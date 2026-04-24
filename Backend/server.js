// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const productRoutes = require('./routes/products');
const companyRoutes = require('./routes/companies');
const authRoutes = require('./routes/auth'); // ADD THIS
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');
const { router: adminAuthRoutes, authenticateAdmin } = require('./routes/adminAuth');


const app = express();

// ====================== MIDDLEWARE (Order is VERY Important) ======================
app.use(helmet());
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => String(value).split(','))
  .map((origin) => origin.trim())
  .filter(Boolean);

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

const allowedOrigins = new Set([
  ...(process.env.NODE_ENV === 'production' ? [] : devOrigins),
  ...configuredOrigins,
]);

const isAllowedOrigin = (origin) => !origin || allowedOrigins.has(origin);

app.use(cors({
  origin: function(origin, callback) {
    console.log("🌐 Incoming Origin:", origin);

    if (isAllowedOrigin(origin)) {
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

// ====================== ROUTES ======================
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes); // ADD THIS
app.use('/api/enquiries', enquiryRoutes);
app.use('/uploads', (req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('uploads'));

app.use('/api/categories', require('./routes/category'));

// Health Check
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    message: '✅ B2B Backend is running successfully!',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'unknown',
      host: mongoose.connection.host || 'unknown'
    },
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/health/db', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    database: {
      status: statusMap[readyState] || 'unknown',
      readyState: readyState,
      name: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
      port: mongoose.connection.port || null
    },
    atlas: {
      isConnected: isConnected,
      connectionAttempts: connectionAttempts,
      lastError: connectionAttempts > 1 ? 'Connection failed, retries attempted' : null
    },
    timestamp: new Date().toISOString()
  });
});

// Admin Auth Route
app.use('/api/admin/auth', adminAuthRoutes);

// Protected Admin Routes
app.use('/api/admin', authenticateAdmin, adminRoutes);

// ====================== MONGO CONNECTION ======================
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI environment variable');
  process.exit(1);
}

// Connection state
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

const connectToMongoDB = async (retryCount = 0) => {
  try {
    connectionAttempts++;
    console.log(`🔄 Attempting MongoDB Atlas connection (attempt ${connectionAttempts})...`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('📊 Connection established to Atlas cluster');

    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB Atlas disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Atlas reconnected');
      isConnected = true;
    });

    return true;
  } catch (err) {
    console.error(`❌ MongoDB Atlas Connection Error (attempt ${connectionAttempts}):`, err.message);

    if (err.name === 'MongooseServerSelectionError') {
      console.error('👉 Possible issues:');
      console.error('   - Atlas cluster might be paused (check Atlas dashboard)');
      console.error('   - IP not whitelisted (add 0.0.0.0/0 for development)');
      console.error('   - Network connectivity issues');
      console.error('   - Invalid connection string');
    }

    if (retryCount < MAX_CONNECTION_ATTEMPTS) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
      console.log(`⏳ Retrying connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectToMongoDB(retryCount + 1);
    }

    console.error(`❌ Failed to connect after ${MAX_CONNECTION_ATTEMPTS} attempts`);
    console.error('🚨 Server will start but database operations will fail');
    console.error('🔧 Please check your Atlas cluster status and network access');

    return false;
  }
};

const startServer = async () => {
  const connected = await connectToMongoDB();

  // ====================== START SERVER ======================
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (connected) {
      console.log('🎉 Backend ready with database connection');
    } else {
      console.log('⚠️  Backend started but database connection failed');
      console.log('📝 Admin categories and other features may not work until Atlas is fixed');
    }
  });
};

startServer();
