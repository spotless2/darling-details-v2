const Category = require('../models/category');
const Product = require('../models/product');
const { Op } = require('sequelize');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get category by ID or slug
exports.getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;
    
    // Check if the identifier is a number (ID) or string (slug)
    if (isNaN(identifier)) {
      // It's a slug
      category = await Category.findOne({ where: { slug: identifier } });
    } else {
      // It's an ID
      category = await Category.findByPk(identifier);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error retrieving category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate offset
    const offset = (page - 1) * limit;
    let categoryId;
    
    // Find the category by slug or ID
    if (isNaN(identifier)) {
      const category = await Category.findOne({ where: { slug: identifier } });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      categoryId = category.id;
    } else {
      categoryId = identifier;
    }
    
    // Get products for this category with pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: { categoryId },
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
      },
      categoryId
    });
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create a new category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    
    // Check if category with this slug already exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists'
      });
    }
    
    const category = await Category.create({
      name,
      slug,
      description,
      image
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update a category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // If slug is changing, check if the new slug already exists
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ where: { slug } });
      if (existingCategory && existingCategory.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'A category with this slug already exists'
        });
      }
    }
    
    // Update fields
    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    
    await category.save();
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if any products are using this category
    const productsCount = await Product.count({ where: { categoryId: id } });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this category because it has ${productsCount} products associated with it`
      });
    }
    
    await category.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Seed initial categories
exports.seedCategories = async () => {
  try {
    const categoriesCount = await Category.count();
    
    if (categoriesCount === 0) {
      const categories = [
        { 
          name: "Decorațiuni", 
          slug: "decoratiuni", 
          description: "Decorațiuni elegante pentru evenimente", 
          image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" 
        },
        { 
          name: "Mărturii", 
          slug: "marturii", 
          description: "Mărturii unice pentru invitați", 
          image: "https://images.unsplash.com/photo-1522682078546-47888fe04e81?w=800" 
        },
        { 
          name: "Cabină Foto", 
          slug: "cabina-foto", 
          description: "Cabine foto profesionale pentru evenimente", 
          image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800" 
        },
        { 
          name: "Aranjamente Florale", 
          slug: "aranjamente-florale", 
          description: "Aranjamente florale pentru nunți și evenimente", 
          image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" 
        },
        { 
          name: "Lumini și Efecte", 
          slug: "lumini-efecte", 
          description: "Iluminat decorativ și efecte speciale", 
          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800" 
        }
      ];
      
      await Category.bulkCreate(categories);
      console.log('Default categories created:', categories.length);
    } else {
      console.log('Categories already exist:', categoriesCount);
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};
