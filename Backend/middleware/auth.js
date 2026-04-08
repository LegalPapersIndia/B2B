const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const authMiddleware = ClerkExpressRequireAuth();

module.exports = authMiddleware;