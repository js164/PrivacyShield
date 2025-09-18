// ============================================================================
// QUESTION SCHEMA
// ============================================================================
const mongoose = require('mongoose');

/**
 * QuestionSchema
 * Defines survey/assessment questions with their properties
 * Supports both single and multiple choice questions
 */
const QuestionSchema = new mongoose.Schema({
    // The question text to display to users
    text: {
        type: String,
        required: true
    },
    // Flag indicating if this is a multiple choice question
    multiChoice: {
        type: Boolean,
        default: false  // Defaults to single choice
    },
    // Category this question belongs to (optional)
    category: {
        type: String
        // Note: Not required, some questions might be general
    },
    // Timestamp for when this question was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('questionSchema', QuestionSchema);
