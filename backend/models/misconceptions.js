// ============================================================================
// MISCONCEPTION SCHEMA
// ============================================================================
const mongoose = require('mongoose');

/**
 * MisconceptionSchema
 * Stores common misconceptions for each category with reality checks
 * Helps provide educational content to users about their assessment results
 */
const MisconceptionSchema = new mongoose.Schema({
  // Name of the category this misconception relates to
  categoryName: {
    type: String,
    required: true,
    trim: true  // Removes whitespace from beginning and end
  },
  // Array of misconception objects for this category
  misconceptions: [{
    // The actual misconception text/statement
    misconceptionText: {
      type: String,
      required: true,
      trim: true
    },
    // The factual correction/reality of the misconception
    realityCheck: {
      type: String,
      required: true,
      trim: true
    },
    // Explanation of why understanding this matters
    whyItMatters: {
      type: String,
      required: true,
      trim: true
    },
  }]
});

module.exports = mongoose.model('Misconception', MisconceptionSchema);
