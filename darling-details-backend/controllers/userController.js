const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login user
exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Simple password check
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    
    // Sign token
    jwt.sign(
      payload, 
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRATION) },
      (err, token) => {
        if (err) throw err;
        console.log('Login successful for user:', user.id);
        res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Get user ID from the JWT token payload
    const userId = req.user.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Profile data retrieved',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Verify token validity for frontend
exports.verifyToken = (req, res) => {
  // If the middleware passed, the token is valid
  return res.status(200).json({ 
    valid: true,
    user: req.user.user
  });
};

// Add a helper function to create an initial admin user
exports.seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@darlingdetails.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'adminpassword' // In production, use a strong password and hash it
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};
