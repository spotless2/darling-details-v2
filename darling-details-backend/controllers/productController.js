const Product = require('../models/product');
const Category = require('../models/category');
const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');
// Fix: Update the import to match the new export pattern
const uploadMiddleware = require('../middleware/upload');
const { getImageUrls } = uploadMiddleware;

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, categoryId } = req.body;
    
    // Build product object
    const productData = {
      name,
      price,
      description,
      quantity: quantity || 0,
      categoryId: categoryId || null
    };
    
    // If categoryId is provided, verify it exists
    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'The specified category does not exist'
        });
      }
    }
    
    // Add image if uploaded
    if (req.file) {
      productData.image = req.file.filename;
      const urls = getImageUrls(req.file.filename);
      productData.imageUrl = urls.main;
      productData.thumbnailUrl = urls.thumbnail;
    }
    
    // Create product
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      name, 
      minPrice, 
      maxPrice,
      inStock,
      categoryId
    } = req.query;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where clause for filtering
    const whereClause = {};
    
    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    
    if (minPrice !== undefined) {
      whereClause.price = { ...whereClause.price, [Op.gte]: minPrice };
    }
    
    if (maxPrice !== undefined) {
      whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };
    }
    
    if (inStock === 'true') {
      whereClause.quantity = { [Op.gt]: 0 };
    }
    
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    // Query with pagination and filters
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination data
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: count,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity, categoryId } = req.body;
    
    // Find product
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // If categoryId is provided, verify it exists
    if (categoryId !== undefined) {
      if (categoryId === null) {
        product.categoryId = null;
      } else {
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            message: 'The specified category does not exist'
          });
        }
        product.categoryId = categoryId;
      }
    }
    
    // Update fields
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (quantity !== undefined) product.quantity = quantity;
    
    // Handle image upload
    if (req.file) {
      // Delete previous image files if they exist
      if (product.image) {
        const baseDir = path.join(__dirname, '../uploads');
        const optimizedPath = path.join(baseDir, 'optimized', product.image);
        
        // Extract thumbnail name
        const filenameWithoutExt = path.basename(product.image, path.extname(product.image));
        const thumbnailPath = path.join(baseDir, 'thumbnails', `${filenameWithoutExt}-thumb.webp`);
        
        try {
          await fs.unlink(optimizedPath).catch(err => console.log('No optimized image to delete'));
          await fs.unlink(thumbnailPath).catch(err => console.log('No thumbnail to delete'));
        } catch (error) {
          console.error('Error deleting old images:', error);
        }
      }
      
      // Set new image
      product.image = req.file.filename;
      const urls = getImageUrls(req.file.filename);
      product.imageUrl = urls.main;
      product.thumbnailUrl = urls.thumbnail;
    }
    
    // Save changes
    await product.save();
    
    // Fetch the updated product with its category
    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
    });
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete product image if exists
    if (product.image) {
      const baseDir = path.join(__dirname, '../uploads');
      const optimizedPath = path.join(baseDir, 'optimized', product.image);
      
      // Extract thumbnail name
      const filenameWithoutExt = path.basename(product.image, path.extname(product.image));
      const thumbnailPath = path.join(baseDir, 'thumbnails', `${filenameWithoutExt}-thumb.webp`);
      
      try {
        await fs.unlink(optimizedPath).catch(err => console.log('No optimized image to delete'));
        await fs.unlink(thumbnailPath).catch(err => console.log('No thumbnail to delete'));
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    }
    
    // Delete product
    await product.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
