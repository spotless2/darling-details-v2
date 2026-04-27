const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./userRoutes');
const storeSettingsRoutes = require('./storeSettingsRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const footballMatchesRoutes = require('./footballMatchesRoutes');
const contactRoutes = require('./contactRoutes');
const heroSlideRoutes = require('./heroSlideRoutes');

// Use routes
router.use('/users', userRoutes);
router.use('/store-settings', storeSettingsRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/testimonials', testimonialRoutes)
router.use('/football-matches', footballMatchesRoutes);
router.use('/contact', contactRoutes);
router.use('/hero-slides', heroSlideRoutes);
module.exports = router;
