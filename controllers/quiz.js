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
        
        const { question, category, difficulty, topic, correct_answer, incorrect_answers } = req.body;

        const newQuiz = new Quiz({
            question: question,
            category: category,
            difficulty: difficulty,
            topic: topic,
            correct_answer: correct_answer,
            incorrect_answers: incorrect_answers,
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

exports.getQuiz = async (req, res, next) => {
    const amount = req.query.amount || 5;
    const topic = req.query.topic || 'any';

    try {
        // randomize fetch
        let quizzes = await Quiz.find()
            .populate({
                path: 'creator',
                select: 'name -_id'
            })
            .select("question correct_answer incorrect_answers -_id")
            .limit(amount);
    
        // randomize answers
        quizzes = quizzes.map(quiz => ({
            ...quiz._doc,
            answers: [
                quiz.correct_answer,
               ...quiz.incorrect_answers
            ].sort(() => Math.random() - 0.5)
        }));
        
        res.status(200).json({
            response_code: 0,
            message: 'Quiz fetched successfully.',
            results: quizzes,
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}