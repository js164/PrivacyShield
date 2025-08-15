const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUser = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
AdminUser.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
AdminUser.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('adminUser', AdminUser);
User.createIndexes();
module.exports = User;