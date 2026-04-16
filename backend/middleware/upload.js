// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    // unique filename: timestamp + random number + extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const extOk = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeOk = allowedTypes.test(file.mimetype);

  if (extOk && mimeOk) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

// Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;