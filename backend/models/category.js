// ============================================================================
// CATEGORY SCHEMA
// ============================================================================
const mongoose = require('mongoose');

/**
 * CategorySchema
 * Defines categories for assessment/survey system with associated metadata
 * Each category has tools, methodologies, and positive suggestions
 */
const CategorySchema = new mongoose.Schema({
  // Unique code identifier for the category (e.g., "ANXI", "DEPR")
  code: {
    type: String,
    required: true,
    unique: true  // Ensures no duplicate category codes
  },
  // Human-readable name for the category
  name: {
    type: String,
    required: true
  },
  // Positive suggestion text to display for this category
  positive_suggestion: {
    type: String,
    required: true
  },
  // Array of tools/resources associated with this category
  tools: {
    type: [String],
    default: [],  // Defaults to empty array if not provided
  },
  // Array of methodologies/approaches for this category
  methodology: {
    type: [String],
    default: [],  // Defaults to empty array if not provided
  },
  // Timestamp for when the category was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('categorySchema', CategorySchema);