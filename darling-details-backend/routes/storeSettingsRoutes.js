const express = require('express');
const router = express.Router();
const storeSettingsController = require('../controllers/storeSettingsController');
const authMiddleware = require('../middleware/auth');

// Public route to get store settings
router.get('/', storeSettingsController.getStoreSettings);

// Protected routes - need authentication
router.post('/', authMiddleware, storeSettingsController.createStoreSettings);
router.put('/', authMiddleware, storeSettingsController.updateStoreSettings);
router.delete('/', authMiddleware, storeSettingsController.deleteStoreSettings);

module.exports = router;
