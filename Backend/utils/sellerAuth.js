const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SELLER_JWT_SECRET = process.env.SELLER_JWT_SECRET || process.env.JWT_SECRET || 'seller-secret-change-this';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = String(storedHash).split(':');
  const derivedKey = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(derivedKey, 'hex'));
}

function createSellerToken(user) {
  return jwt.sign(
    {
      role: 'seller',
      authType: 'local',
      userId: user.clerkId,
      sellerId: String(user._id),
      email: user.email,
    },
    SELLER_JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifySellerToken(token) {
  return jwt.verify(token, SELLER_JWT_SECRET);
}

function generateLocalSellerId() {
  return `local_${crypto.randomUUID()}`;
}

module.exports = {
  SELLER_JWT_SECRET,
  hashPassword,
  verifyPassword,
  createSellerToken,
  verifySellerToken,
  generateLocalSellerId,
};
