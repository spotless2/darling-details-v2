const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Product name must be between 2 and 100 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Making price optional
    validate: {
      isDecimal: {
        msg: 'Price must be a valid number'
      },
      min: {
        args: [0.01],
        msg: 'Price must be greater than 0'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true, // Making quantity optional
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Quantity must be a valid integer'
      },
      min: {
        args: [0],
        msg: 'Quantity cannot be negative'
      }
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Store the public URL for the optimized image
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Store the public URL for the thumbnail
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Add category ID foreign key
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'products',
  modelName: 'Product'
});

// Initialize model
const initModel = () => {
  console.log('Product model initialized');
  return Product;
};

// Execute initialization
initModel();

module.exports = Product;
