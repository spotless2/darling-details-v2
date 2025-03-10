const Product = require('./product');
const Category = require('./category');

// Define associations
const createAssociations = () => {
  // Category has many Products
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });
  
  // Product belongs to Category
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });
  
  console.log('Model associations established');
};

module.exports = createAssociations;
