// ============================================================================
// OPTION SCORE SCHEMA
// ============================================================================
const mongoose = require('mongoose');

/**
 * OptionScoreSchema
 * Defines scoring system for options across different categories
 * Allows same option to have different scores for different categories
 * Used for calculating category scores in assessments
 */
const OptionScoreSchema = new mongoose.Schema({
    // Reference to the option being scored
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'optionSchema',  // References the Options model
        required: true
    },
    // Reference to the category this score applies to
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorySchema',  // References the Category model
        required: true
    },
    // Numerical score value for this option in this category
    score: {
        type: Number,
        required: true
        // Could be positive or negative depending on scoring system
    },
    // Timestamp for when this score mapping was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('optionScoreSchema', OptionScoreSchema);