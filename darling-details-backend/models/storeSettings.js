const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoreSettings = sequelize.define('StoreSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Store name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Store name must be between 2 and 100 characters'
      }
    }
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        msg: 'Please provide a valid phone number'
      }
    }
  }
}, {
  timestamps: true,
  tableName: 'store_settings',
  modelName: 'StoreSettings'
});

// Initialize model
const initModel = () => {
  console.log('Store Settings model initialized');
  return StoreSettings;
};

// Execute initialization
initModel();

module.exports = StoreSettings;
