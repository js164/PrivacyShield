// --- Imports ---
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUser');

// --- Secret Key ---
const JWT_SECRET = process.env.JWT_SECRET;

// --- Middleware Function ---
/**
 * Express middleware to authenticate admin users using a JWT.
 * It checks for a valid token in the Authorization header, verifies it,
 * and attaches the admin's information to the request object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
const adminAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        // If no token is found in the header, deny access with a 401 Unauthorized status
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

        next(); // allow access
    } catch (error) {
        console.error('Admin auth error:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// --- Export Middleware ---
module.exports = adminAuth;
