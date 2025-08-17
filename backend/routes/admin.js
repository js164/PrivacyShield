const express = require('express');
const router = express.Router();
const { adminLogin, verifyAdmin } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Admin login
router.post('/login', adminLogin);

// Verify admin token
router.get('/verify', adminAuth, verifyAdmin);

// Dashboard route (protected)
router.get('/dashboard', adminAuth, (req, res) => {
    res.json({ message: 'Welcome to admin dashboard' });
});

module.exports = router;