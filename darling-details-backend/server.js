const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Import database connection
const db = require('./config/database');

// Import controllers with seed functions
const userController = require('./controllers/userController');
const storeSettingsController = require('./controllers/storeSettingsController');
const categoryController = require('./controllers/categoryController');

// Import routes
const apiRoutes = require('./routes');

// Import models to ensure they're registered before sync
require('./models/user');
require('./models/storeSettings');
require('./models/category');
require('./models/product');

// Import and create associations between models
const createAssociations = require('./models/associations');
createAssociations();

const app = express();

// Use compression middleware
app.use(compression());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache control middleware for static files
const cacheControl = (req, res, next) => {
  // Set caching headers - 1 day for images
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
};

// Serve static files from the uploads directory with caching
app.use('/uploads', cacheControl, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Darling Details Admin Panel' });
});

// Set port and listen for requests
const PORT = process.env.PORT || 5000;

// Database initialization function
const initializeDatabase = async () => {
  try {
    // Test the connection
    await db.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models with database
    const syncOptions = process.env.NODE_ENV === 'development' ? { force: true } : {};
    console.log(`Syncing database with options:`, syncOptions);
    
    await db.sync(syncOptions);
    console.log('Database synced successfully - tables created!');
    
    // Create initial admin user, store settings, and categories
    await userController.seedAdminUser();
    await storeSettingsController.seedStoreSettings();
    await categoryController.seedCategories();
    
    // Start the server after successful DB initialization
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`Admin panel available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1); // Exit with error
  }
};

// Initialize database and start server
initializeDatabase();
