const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
const optimizedDir = path.join(uploadDir, 'optimized');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Configure storage for original uploads (temporarily)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename with original extension
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = uuidv4() + fileExt;
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer instance
const multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Middleware to process images after upload
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const originalPath = req.file.path;
    const fileExt = path.extname(req.file.filename).toLowerCase();
    const filename = path.basename(req.file.filename, fileExt);
    
    // Set output formats and paths
    const optimizedFileName = `${filename}.webp`;
    const thumbnailFileName = `${filename}-thumb.webp`;
    const optimizedPath = path.join(optimizedDir, optimizedFileName);
    const thumbnailPath = path.join(thumbnailDir, thumbnailFileName);

    // Process image to webp format (better compression)
    // Main image - resize to max width of 1200px while maintaining aspect ratio
    await sharp(originalPath)
      .resize({
        width: 1200,
        height: 1500,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // 80% quality webp
      .toFile(optimizedPath);

    // Create thumbnail
    await sharp(originalPath)
      .resize(300, 300, { fit: sharp.fit.inside })
      .webp({ quality: 60 }) // Lower quality for thumbnails
      .toFile(thumbnailPath);

    // Delete original file to save space
    fs.unlink(originalPath, (err) => {
      if (err) console.error('Error removing original file:', err);
    });

    // Update request with optimized file info
    req.file.filename = optimizedFileName;
    req.file.path = optimizedPath;
    req.file.thumbnail = thumbnailFileName;
    req.file.thumbnailPath = thumbnailPath;
    req.file.mimetype = 'image/webp';

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    next(error);
  }
};

// Helper to get URLs for an image
const getImageUrls = (filename) => {
  if (!filename) return { main: null, thumbnail: null };
  
  const filenameWithoutExt = path.basename(filename, path.extname(filename));
  return {
    main: `/uploads/optimized/${filename}`,
    thumbnail: `/uploads/thumbnails/${filenameWithoutExt}-thumb.webp`
  };
};

// Create a function that combines multer upload and image processing
const upload = {
  single: (fieldName) => {
    return [
      multerUpload.single(fieldName),
      processImage
    ];
  }
};

// Fix: Export all required functions properly
module.exports = {
  upload,
  processImageMiddleware: processImage,
  getImageUrls
};
