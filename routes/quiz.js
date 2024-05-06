const express = require('express');
const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

const quizController = require('../controllers/quiz');

const upload = require("../utils/multerConfig");

const router = express.Router();

// GET /quiz/
router.get('/', quizController.getQuiz);

// POST /quiz/excel/
router.post("/excel", isAuth, upload.single('xlsx'), quizController.postQuizExcel);

router.post('/', isAuth, [
    body('question').trim().isLength({ min: 3}),
    body('correct_answer').not().isEmpty(),
    body('incorrect_answers').not().isEmpty(),
], quizController.postQuiz);

module.exports = router;