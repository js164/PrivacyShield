const mongoose = require('mongoose');

const OptionScoreSchema = new mongoose.Schema({
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'optionSchema',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorySchema',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('optionScoreSchema', OptionScoreSchema);
