const Quiz = require('../models/quiz');

const xlsx = require('xlsx');


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

exports.postQuizExcel = async (req, res, next) => {
    try {
        const workbook = xlsx.readFile("./quizzes.xlsx");
        // Assuming you have one sheet, or you can specify the sheet name
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON object
        const jsonData = xlsx.utils.sheet_to_json(sheet);
    
        console.log(jsonData);
        // for each row in the sheet
        // validate the row
        const validationErrors = validateData(jsonData);
        if (validationErrors.length > 0) {
            console.log('Validation errors:');
            validationErrors.forEach(error => console.log(error));
            return res.status(422).json({data: validationErrors});
        } else {
            console.log('Data validation successful!');
            // save the row
            jsonData.forEach(async (row, index) => {
                const newData = new Quiz({...row, creator: req.userId.toString()});
                await newData.save();
                console.log(`Row ${index + 2} saved successfully.`);
            })
            // save the row
            res.status(200).json({message: "Quizzes saved successfully."});
        }
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
}

function validateData(data) {
    const errors = [];

    // Example validation: check if 'Name' field is empty
    data.forEach((row, index) => {
        if (!row.question) {
            errors.push(`Row ${index + 2}: 'question' field is empty.`);
        }
        if (!row.correct_answer) {
            errors.push(`Row ${index + 2}: 'correct_answer' field is empty.`);
        }
        if (!row.topic) {
            errors.push(`Row ${index + 2}: 'topic' field is empty.`);
        }
        if (!row.incorrect_answers) {
            errors.push(`Row ${index + 2}: 'incorrect_answers' field is empty.`);
        }
        if (row.incorrect_answers)
            if (row.incorrect_answers.split(',').length < 1 || row.incorrect_answers.split(',').length > 4) {
            errors.push(`Row ${index + 2}: 'incorrect_answers' field should contain atleat 1 or atmost 4 choice.`);
        }
        // Add more validation checks as needed
    });

    return errors;
}