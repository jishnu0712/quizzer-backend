const express = require('express');
const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

const quizController = require('../controllers/quiz');

const router = express.Router();

// GET /quiz/
router.get('/', quizController.getQuiz);

router.post('/', isAuth, [
    body('question').trim().isLength({ min: 3}),
    body('correct_answer').not().isEmpty(),
    body('incorrect_answers').not().isEmpty(),
], quizController.postQuiz);

module.exports = router;