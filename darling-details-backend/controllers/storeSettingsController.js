const StoreSettings = require('../models/storeSettings');

// Get store settings
exports.getStoreSettings = async (req, res) => {
  try {
    // Get the first record, as we'll only have one store settings record
    const settings = await StoreSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({ message: 'Store settings not found' });
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error retrieving store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create store settings
exports.createStoreSettings = async (req, res) => {
  try {
    const { storeName, contactEmail, contactPhone } = req.body;
    
    // Check if settings already exist
    const existingSettings = await StoreSettings.findOne();
    if (existingSettings) {
      return res.status(400).json({
        success: false,
        message: 'Store settings already exist. Use update instead.'
      });
    }
    
    // Create new settings
    const settings = await StoreSettings.create({
      storeName,
      contactEmail,
      contactPhone
    });
    
    res.status(201).json({
      success: true,
      message: 'Store settings created successfully',
      data: settings
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error creating store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update store settings
exports.updateStoreSettings = async (req, res) => {
  try {
    const { storeName, contactEmail, contactPhone } = req.body;
    
    // Find settings
    const settings = await StoreSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Store settings not found'
      });
    }
    
    // Update settings
    settings.storeName = storeName || settings.storeName;
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.contactPhone = contactPhone || settings.contactPhone;
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: settings
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    console.error('Error updating store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete store settings
exports.deleteStoreSettings = async (req, res) => {
  try {
    // Find settings
    const settings = await StoreSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Store settings not found'
      });
    }
    
    // Delete settings
    await settings.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Store settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting store settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Seed initial store settings if none exist
exports.seedStoreSettings = async () => {
  try {
    const existingSettings = await StoreSettings.findOne();
    
    if (!existingSettings) {
      await StoreSettings.create({
        storeName: 'Darling Details',
        contactEmail: 'contact@darlingdetails.com',
        contactPhone: '555-123-4567'
      });
      console.log('Default store settings created');
    } else {
      console.log('Store settings already exist');
    }
  } catch (error) {
    console.error('Error seeding store settings:', error);
  }
};
