const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.status(200).json({ message: 'All ok kid!' });
});

// POST /auth/signup
router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
], authController.signup);

module.exports = router;