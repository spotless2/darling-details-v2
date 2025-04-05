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
    const { 
      storeName, 
      storeDescription, 
      storeAddress, 
      contactEmail, 
      contactPhone, 
      facebookUrl, 
      instagramUrl 
    } = req.body;
    
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
      storeDescription,
      storeAddress,
      contactEmail,
      contactPhone,
      facebookUrl,
      instagramUrl
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
    const { 
      storeName, 
      storeDescription, 
      storeAddress, 
      contactEmail, 
      contactPhone, 
      facebookUrl, 
      instagramUrl 
    } = req.body;
    
    // Find settings
    const settings = await StoreSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Store settings not found'
      });
    }
    
    // Update settings - only update fields that are provided
    if (storeName !== undefined) settings.storeName = storeName;
    if (storeDescription !== undefined) settings.storeDescription = storeDescription;
    if (storeAddress !== undefined) settings.storeAddress = storeAddress;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
    
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

// Delete store settings - Keeping this unchanged
exports.deleteStoreSettings = async (req, res) => {
  try {
    const settings = await StoreSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Store settings not found'
      });
    }
    
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

// Updated seed function with the new fields
exports.seedStoreSettings = async () => {
  try {
    const existingSettings = await StoreSettings.findOne();
    
    if (!existingSettings) {
      await StoreSettings.create({
        storeName: 'Darling Details',
        storeDescription: 'Your one-stop shop for all things beautiful',
        storeAddress: 'Strada Exemplu 123, București, România',
        contactEmail: 'contact@darlingdetails.com',
        contactPhone: '555-123-4567',
        facebookUrl: 'https://facebook.com/darlingdetails',
        instagramUrl: 'https://instagram.com/darlingdetails'
      });
      console.log('Default store settings created');
    } else {
      console.log('Store settings already exist');
    }
  } catch (error) {
    console.error('Error seeding store settings:', error);
  }
};