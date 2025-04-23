const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./userRoutes');
const storeSettingsRoutes = require('./storeSettingsRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const footballMatchesRoutes = require('./footballMatchesRoutes');

// Use routes
router.use('/users', userRoutes);
router.use('/store-settings', storeSettingsRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/testimonials', testimonialRoutes)
router.use('/football-matches', footballMatchesRoutes);
module.exports = router;
