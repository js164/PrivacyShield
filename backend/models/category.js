const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  positive_suggestion: {
    type: String,
    required: true
  },
  // negative_suggestion: {
  //   type: String,
  //   required: true
  // },
  tools: {
    type: [String], // array of strings
    default: [],
  },
  methodology: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('categorySchema', CategorySchema);
