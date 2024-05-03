const express = require('express');

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

// POST /auth/login
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 3 })
], authController.login);

// POST /auth/signup
router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 3 })
], authController.signup);

// POST /auth/reset
router.post('/reset', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
], authController.sendResetEmail);

// GET /auth/reset
router.post('/reset/:token', authController.resetPassword);

module.exports = router;