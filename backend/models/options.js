const mongoose = require('mongoose');

const OptionsSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questionSchema',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('optionsSchema', OptionsSchema);
