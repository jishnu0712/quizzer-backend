const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    question: { 
        type: String,
        required: true,    
    },
    answer: { 
        type: String,
        required: true,    
    },
    options: {
        type: [String],
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);