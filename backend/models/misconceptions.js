const mongoose = require('mongoose');

const MisconceptionSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  misconceptions: [{
    misconceptionText: {
      type: String,
      required: true,
      trim: true
    },
    realityCheck: {
      type: String,
      required: true,
      trim: true
    },
    whyItMatters: {
      type: String,
      required: true,
      trim: true
    },
  }]
});

module.exports = mongoose.model('Misconception', MisconceptionSchema);

