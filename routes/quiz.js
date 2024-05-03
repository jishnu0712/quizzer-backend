const express = require('express');
const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

const quizController = require('../controllers/quiz');

const router = express.Router();

// GET /quiz/
router.get('/', isAuth, (req, res, next) => {
    res.status(200).json({ data: 'user authenticated' });
});

router.post('/', isAuth, [
    body('question').trim().isLength({ min: 3}),
    body('answer').not().isEmpty(),
    body('options').not().isEmpty(),
], quizController.postQuiz);

module.exports = router;