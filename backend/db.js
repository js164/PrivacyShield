// ============================================================================
// DATABASE CONNECTION CONFIGURATION
// File: db.js
// ============================================================================
const mongodb = require('mongoose');

/**
 * Establishes connection to MongoDB database
 * Uses environment variables for connection string and configuration
 * Implements proper error handling and process termination on failure
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB with recommended options
        const conn = await mongodb.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,    // Use new URL parser to avoid deprecation warnings
            useUnifiedTopology: true, // Use new Server Discovery and Monitoring engine
            // useFindAndModify: false // Deprecated option, no longer needed
        });
        
        console.log(`✅ DB connection successful with host: ${conn.connection.host}`);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit process with failure code
    }
};

module.exports = connectDB;
