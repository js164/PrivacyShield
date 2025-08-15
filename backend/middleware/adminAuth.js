// --- Imports ---
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUser');

// --- Secret Key ---
const JWT_SECRET = process.env.JWT_SECRET;

// --- Middleware Function ---
const adminAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find admin user by ID from token
        const admin = await AdminUser.findById(decoded.adminId);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach admin info to request
        req.adminId = decoded.adminId;
        req.admin = admin;

        // Debug log (optional)
        console.log(`Admin authenticated: ${admin.email}`);

        next(); // allow access
    } catch (error) {
        console.error('Admin auth error:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// --- Export Middleware ---
module.exports = adminAuth;
