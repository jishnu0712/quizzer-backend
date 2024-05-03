const Quiz = require('../models/quiz');

const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.postQuiz = async (req, res, next) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('User not found.');
            err.statusCode = 404;
            throw err;
        }
        
        const { question, answer, options } = req.body;
        const optionsArr = options;
        const newQuiz = new Quiz({
            question: question,
            answer: answer,
            options: optionsArr,
            creator: user,
        });

        await newQuiz.save();

        res.status(201).json({ message: 'Quiz created successfully.' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }




}