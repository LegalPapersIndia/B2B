const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { verifySellerToken } = require('../utils/sellerAuth');
const clerkRequireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    return res.status(401).json({ success: false, message: 'Unauthorized (Clerk)' });
  },
});
function requireSellerAuth(req, res, next) {
  const authHeader = String(req.headers.authorization || '');
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }
  try {
    const decoded = verifySellerToken(token);
   if (
      decoded &&
      decoded.role === 'seller' &&
      decoded.authType === 'local' &&
      decoded.userId
    ) {
      req.auth = { userId: decoded.userId };
      req.sellerAuth = {
        provider: 'local',
        sellerId: decoded.sellerId || null,
        email: decoded.email || null,
      };
      return next();
    }
  } catch (err) {
  }
  return clerkRequireAuth(req, res, (err) => {
    if (err) return next(err);

    req.sellerAuth = { provider: 'clerk' };
    next();
  });
}
module.exports = { requireSellerAuth };