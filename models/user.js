const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    totalPoints: {
        type: Number,
        default: 0
    },
    earnedPoints: {
        type: Number,
        default: 0
    },
    numberOfQuizzes: {
        type: Number,
        default: 0
    }
}, { _id: false });

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    points: {
        type: pointsSchema,
        default: {
            totalPoints: 0,
            earnedPoints: 0,
            numberOfQuizzes: 0
        }
    },
});

module.exports = mongoose.model('User', userSchema);

