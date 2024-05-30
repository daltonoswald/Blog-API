const User = require('../models/user');
const express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

// passport.use(
//     new LocalStrategy(async (username, password, done) => {
//         try {
//             const user = await User.findOne({ username: username });
//             if (!user) {
//                 return done(null, false, { message: "Username does not exist" });
//             };
//             const match = await bcrypt.compare(password,user.password);
//             if (!match) {
//                 return done(null, false, { message: "Incorrect password" })
//             }
//             return done(null, user);
//         } catch(err) {
//             return done(err);
//         }
//     })
// )

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// })

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch(err) {
//         done(err);
//     }
// })

// exports.log_in = passport.authenticate("local", {
//     successRedirect: '/',
//     failureRedirect: '/log-in',
//     failureMessage: true,
// })

exports.log_in = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({ message: "Username not found" });
    }
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) return next(err);

        const options = {};
        options.expiresIn = 1 * 24 * 60 * 60;
        const token = jwt.sign({ user }, process.env.TOKEN_KEY, options);

        if (!isMatch) {
            res.status(401).json({ message: "Incorrect password" });
        } else {
            res.json({ message: 'user logged in successfully', token, user });
        }
    });
})

exports.log_out = async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
        res.json({
            text: "Logged out",
        })
    })
}

exports.sign_up = [
    body("first_name", "First Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('last_name', 'Last Name must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('username', 'Username must not be empty')
        .trim()
        .isLength({ min: 5 })
        .escape(),
    body('password', 'Password must contain 8 characters')
        .trim()
        .isLength({ min: 8 })
        .escape(),
    body("confirm_password", 'The passwords do not match')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            return true
        }),

    async(req, res, next) => {
        try {
            const errors = validationResult(req);
            console.log(req.body.first_name);
            console.log(req.body.password)
            console.log(req.body.confirm_password);

            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 10),
                admin: false,
            });

            if (!errors.isEmpty()) {
                // res.render("sign-up", {
                //     title: "Sign up",
                //     userSignedUp: user,
                //     errors: errors.array(),
                // });
                const errorsMessages = errors.array().map((error) => error.msg);
                res.json({ error: errorsMessages })
                // return;
            } else {
                const usernameTaken = await User.findOne({
                    username: req.body.username,
                }).exec();
                if (usernameTaken) {
                    res.render('sign-up', {
                        title: "Sign up",
                        userSignedUp: user,
                        errors: [{ msg: "The Username is already in use."}],
                    })
                }
                await user.save();
                res.json({ message: 'user created successfully' })
                res.redirect('/');
            }
        } catch (err) {
            console.log(err);
        }
    }
]



exports.postman = async(req, res, next) => {
    res.json({
        text: "hello Postman",
    })
}