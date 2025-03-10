#!/usr/bin/env node

/**
 * Deployment script for Darling Details backend
 * This performs pre-deployment checks to ensure production readiness
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Starting pre-deployment checks...');

// Check for required environment variables
const requiredEnvVars = [
  'PORT', 'NODE_ENV', 
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
  'JWT_SECRET', 'JWT_EXPIRATION'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error('❌ Error: Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

// Check if NODE_ENV is set to production
if (process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ Warning: NODE_ENV is not set to production!');
  console.warn('   Current environment:', process.env.NODE_ENV);
}

// Check if JWT_SECRET has been changed from default
if (process.env.JWT_SECRET === 'darling-details-super-secret-key-change-in-production') {
  console.error('❌ Error: Default JWT_SECRET detected in production!');
  console.error('   Please change the JWT_SECRET before deploying.');
  process.exit(1);
}

// Check for uploads directory existence
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(path.join(uploadDir, 'optimized'), { recursive: true });
  fs.mkdirSync(path.join(uploadDir, 'thumbnails'), { recursive: true });
}

// Check for password hashing implementation (security warning)
console.warn('⚠️ Warning: Password hashing is not implemented!');
console.warn('   Passwords are stored in plaintext. Consider implementing bcrypt for production.');

console.log('✅ Pre-deployment checks completed!');
console.log('Run the following command to start in production mode:');
console.log('   NODE_ENV=production npm start');
