const cloudinary = require('cloudinary').v2;

function getCloudinaryConfig() {
  const cloudinaryUrl = String(process.env.CLOUDINARY_URL || '').trim();

  if (cloudinaryUrl) {
    try {
      const parsed = new URL(cloudinaryUrl);
      const apiKey = decodeURIComponent(parsed.username || '');
      const apiSecret = decodeURIComponent(parsed.password || '');
      const cloudName = parsed.hostname || parsed.pathname.replace(/^\/+/, '');

      if (cloudName && apiKey && apiSecret) {
        return {
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        };
      }
    } catch (error) {
      console.error('Invalid CLOUDINARY_URL configuration:', error.message);
    }
  }

  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  };
}

const cloudinaryConfig = getCloudinaryConfig();

cloudinary.config(cloudinaryConfig);

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  );
}

async function uploadBufferToCloudinary(buffer, options = {}) {
  if (!buffer) {
    throw new Error('No file buffer received for upload');
  }

  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in production.'
    );
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: options.folder || process.env.CLOUDINARY_FOLDER || 'b2b',
      },
      (err, uploaded) => {
        if (err) return reject(err);
        return resolve(uploaded?.secure_url || '');
      }
    ).end(buffer);
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
};
