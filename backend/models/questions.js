const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    multiChoice: {
        type: Boolean,
        default: false
    },
    category: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('questionSchema', QuestionSchema);
