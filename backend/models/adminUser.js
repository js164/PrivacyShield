// ============================================================================
// ADMIN USER SCHEMA
// ============================================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * AdminUser Schema
 * Defines the structure for admin users with authentication capabilities
 * Includes password hashing and comparison methods for secure authentication
 */
const AdminUser = new mongoose.Schema({
    // Unique identifier for the admin user (not MongoDB's _id)
    userId: {
        type: String,
        required: true,
        unique: true  // Ensures no duplicate userIds in the database
    },
    // Hashed password for secure authentication
    password: {
        type: String,
        required: true,
    },
    // Timestamp for when the admin user account was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-save middleware to hash passwords before storing in database
 * Only hashes password if it has been modified (new or changed)
 * Uses bcrypt with salt rounds of 10 for security
 */
AdminUser.pre('save', async function (next) {
    // Skip hashing if password hasn't been modified
    if (!this.isModified('password')) return next();

    // Hash the password with 10 salt rounds
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Instance method to compare provided password with stored hash
 * @param {string} password - Plain text password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
AdminUser.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the model and ensure indexes are created
const User = mongoose.model('adminUser', AdminUser);
User.createIndexes(); // Creates database indexes for unique fields
module.exports = User;
