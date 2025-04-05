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
    allowNull: false
  },
  storeDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  storeAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = StoreSettings;