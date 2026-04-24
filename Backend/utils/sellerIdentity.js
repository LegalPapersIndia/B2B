const mongoose = require('mongoose');

function getAuthIdentityCandidates(req) {
  const values = [
    req?.auth?.userId,
    req?.sellerAuth?.sellerId,
    req?.sellerAuth?.email,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return [...new Set(values)];
}

function buildSellerLookupFromAuth(req) {
  const or = [];
  const authUserId = String(req?.auth?.userId || '').trim();
  const sellerId = String(req?.sellerAuth?.sellerId || '').trim();
  const email = String(req?.sellerAuth?.email || '').trim().toLowerCase();

  if (authUserId) {
    or.push({ clerkId: authUserId });
  }

  if (sellerId && mongoose.Types.ObjectId.isValid(sellerId)) {
    or.push({ _id: sellerId });
  }

  if (email) {
    or.push({ email });
  }

  if (or.length === 0) return null;
  if (or.length === 1) return or[0];
  return { $or: or };
}

function buildSellerLookupFromStoredOwner(ownerValue) {
  const value = String(ownerValue || '').trim();
  if (!value) return null;

  const or = [{ clerkId: value }];
  if (mongoose.Types.ObjectId.isValid(value)) {
    or.push({ _id: value });
  }

  return or.length === 1 ? or[0] : { $or: or };
}

module.exports = {
  getAuthIdentityCandidates,
  buildSellerLookupFromAuth,
  buildSellerLookupFromStoredOwner,
};
