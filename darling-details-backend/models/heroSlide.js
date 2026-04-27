const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HeroSlide = sequelize.define('HeroSlide', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ctaText: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Descoperă Colecția'
  },
  ctaLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '/products'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = HeroSlide;
