const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
// Fix: Update import and usage of upload middleware
const { upload } = require('../middleware/upload');

// Public routes for reading products
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes for creating, updating, and deleting products
router.post('/', 
  authMiddleware, 
  ...upload.single('image'), 
  productController.createProduct
);

router.put('/:id', 
  authMiddleware, 
  ...upload.single('image'), 
  productController.updateProduct
);

router.delete('/:id', 
  authMiddleware, 
  productController.deleteProduct
);

module.exports = router;
