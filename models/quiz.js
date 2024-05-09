const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    question: { 
        type: String,
        required: true,    
    },
    category: { 
        type: String,
    },
    examId: { 
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
    },
    topic: { 
        type: String,
    },
    correct_answer: { 
        type: String,
        required: true,    
    },
    incorrect_answers: {
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