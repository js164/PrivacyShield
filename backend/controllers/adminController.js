const AdminUser = require('../models/adminUser');
const jwt = require('jsonwebtoken');

// Retrieve the secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Handles the login process for an admin user
 * @param {object} req - The Express request object, containing the user's credentials in the body.
 * @param {object} res - The Express response object, used to send back the result.
 */
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

        // Send a success response with the token and basic admin info
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

/**
 * Verifies the identity of an admin user based on a validated JWT payload
 * @param {object} req - The Express request object, expected to have adminId attached by a preceding middleware.
 * @param {object} res - The Express response object.
 */
const verifyAdmin = async (req, res) => {
    try {

        // Find the admin by their database ID, which was extracted from the JWT
        const admin = await AdminUser.findById(req.adminId);

        // If no admin is found, return a 401 error
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        // If the admin is found, send back their information to confirm their identity
        res.json({
            admin: {
                id: admin._id,
                userId: admin.userId
            }
        });
    } catch (error) {

        // Send a 500 Server Error response if something goes wrong
        res.status(500).json({ message: 'Server error' });

    }
};

// Export the functions to be used in other parts of the application
module.exports = {
    adminLogin,
    verifyAdmin
};