// ============================================================================
// MAIN APPLICATION SERVER
// File: app.js or server.js
// ============================================================================
const express = require('express');
const app = express();
const dotenv = require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // MongoDB session store
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const port = process.env.PORT || 8000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * CORS Configuration
 * Currently allows all origins (*) - should be restricted in production
 * to specific domains for security
 */
app.use(cors({ origin: '*' }));

/**
 * Body Parsing Middleware
 * Handles URL-encoded and JSON request bodies
 */
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

/**
 * API Routes Setup
 * Organizes routes by functionality with appropriate prefixes
 */
app.use('/api/admin', adminRoutes);           // Admin-specific routes
app.use('/', require('./routes/assesment'));  // Main assessment routes
app.use('/question', require('./routes/questions')); // Question CRUD routes
app.use('/assesment', require('./routes/assesment')); // Assessment routes (duplicate?)

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================

/**
 * Express Session Setup
 * Uses MongoDB to store session data for persistence across server restarts
 * NOTE: This should be configured before routes that need sessions
 * CURRENT ISSUE: Session middleware is defined after routes - should be moved up
 */
app.use(session({
  secret: 'keyboard cat', // Should use environment variable for security
  resave: false,          // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI // Store sessions in MongoDB
  })
}));

// ============================================================================
// DATABASE CONNECTION AND SERVER STARTUP
// ============================================================================

/**
 * Initialize Database Connection and Start Server
 * Ensures database is connected before accepting requests
 * Implements proper error handling for connection failures
 */
const connectDB = require('./db');

connectDB()
  .then(() => {
    // Start server only after successful DB connection
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("❌ DB connection failed", err);
    process.exit(1); // Exit if database connection fails
  });

// Uncomment for serverless deployment (e.g., Vercel)
// module.exports = app;
