// ============================================================================
// OPTIONS SCHEMA
// ============================================================================
const mongoose = require('mongoose');

/**
 * OptionsSchema
 * Defines answer options for survey/assessment questions
 * Each option links to a question and has associated suggestions and categories
 */
const OptionsSchema = new mongoose.Schema({
    // Reference to the question this option belongs to
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questionSchema',  // References the Question model
        required: true
    },
    // The text content of this answer option
    text: {
        type: String,
        required: true
    },
    // Suggestion text to show when this option is selected
    suggestion: {
        type: String,
        required: true
    },
    // Category this option/suggestion belongs to (for scoring/analysis)
    suggestion_category: {
        type: String,
        required: true
    },
    // Timestamp for when this option was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('optionsSchema', OptionsSchema);