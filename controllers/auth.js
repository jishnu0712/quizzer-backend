const User = require('../models/user');

const bcrypt = require('bcrypt');

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