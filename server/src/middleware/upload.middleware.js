const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists inside the server directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Prefix filenames with current timestamp to ensure uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Define type filters for file uploading
const fileFilter = (req, file, cb) => {
  // Allow common images and basic document formats
  const allowedExtensions = /jpeg|jpg|png|webp|gif|pdf|docx|xlsx/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed types: Images (JPEG, JPG, PNG, WEBP, GIF) and Documents (PDF, DOCX, XLSX).'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
