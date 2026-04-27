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
  },
  tiktokUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  workingHours: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aboutStory: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aboutMission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aboutVision: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = StoreSettings;