const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { sendOTPEmail } = require('../utils/emailUtils');

const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
    
        const { email, password, name } = req.body;
        const user = await User.findOne({ email: email });
    
        if (user) {
            const err = new Error('User aleary exists!');
            err.statusCode = 422;
            throw err;
        }
    
        const hashedPw = await bcrypt.hash(password, 12);
        let newUser = new User({
            name: name,
            password: hashedPw,
            email: email
        });
        newUser = await newUser.save();
        res.status(200).json({ message: 'User created', data: newUser });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            const err = new Error('Email or password invalid.');
            err.statusCode = 422;
            throw err;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Email or password invalid.');
            err.statusCode = 422;
            throw err;
        }

        const token = jwt.sign({
            email: email,
            userId: user._id.toString()
        },
        process.env.LOGIN_TOKEN_SECRET_KEY,
        { expiresIn: '1h' });

        res.status(200).json({ token: token, userId: user._id.toString() })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// POST /auth/sendResetEmail
exports.sendResetEmail = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { email } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            const err = new Error('No account with this email found.');
            err.statusCode = 422;
            throw err;
        }

        const token = jwt.sign({ email: email }, process.env.RESET_KEY, { expiresIn: '15m' });
        user.resetToken = token;
        await user.save();

        // send email with token
        sendOTPEmail(
            [email],
            "Quiz O Pedia - Reset Link",
            `<h1>You requested a password reset</h1>
            Click this <a href="http://localhost:8080/auth/reset/${token}">link</a> to set a password.
           `,
            (cc = ["clumpiness@gmail.com"]),
            (bcc = [])
          );

        res.status(200).json({ message: 'Email sent.'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.resetPassword = async (req, res, next) => {
    const token = req.params.token;

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.RESET_KEY);
        if (!decodedToken) {
            const err = new Error('Not authenticated');
            err.statusCode = 401;
            throw err;
        }
        const { password } = req.body;
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            const err = new Error('No account with this email found.');
            err.statusCode = 422;
            throw err;
        }

        const hashedPw = await bcrypt.hash(password, 12);
        user.password = hashedPw;
        await user.save();
        res.status(200).json({ message: 'Password reset successful.'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}