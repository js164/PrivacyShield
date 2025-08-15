const AdminUser = require('../models/adminUser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const adminLogin = async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Find admin user
        const admin = await AdminUser.findOne({ userId });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, userId: admin.userId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                userId: admin.userId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyAdmin = async (req, res) => {
    try {
        const admin = await AdminUser.findById(req.adminId);
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        res.json({
            admin: {
                id: admin._id,
                userId: admin.userId
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    adminLogin,
    verifyAdmin
};