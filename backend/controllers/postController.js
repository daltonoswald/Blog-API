const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware');

exports.index = async function (req, res, next) {
    try {
        const allPosts = await Post.find({})
            .sort({ date: -1 })
            .populate('author')
            .exec();

            res.json(allPosts);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

exports.new_post = [
    body('title', 'The title must be between 1 and 25 characters')
        .trim()
        .isLength({ min: 1, max: 25 })
        .escape(),
    body('text', 'The message must be between 1 and 200 characters')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    body('published', 'Published field must be selected')
        .trim()
        .escape(),
    
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            const post = new Post({
                title: req.body.title,
                text: req.body.text,
                // author: req.user._id,
                author: '664f77959df2b9552224c1ff',
                date: Date.now(),
                published: req.body.published,
            });

            if (!errors.isEmpty()) {
                res.json({
                    message: "Something is wrong",
                    post: post,
                    errors: errors.array(),
                })
                return
            } else {
                await post.save();
                return res.json({
                    message: "Post created",
                    post: post
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.delete_post = asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.TOKEN_KEY, async (err, authData) => {
        if (authData.user.admin === true) {
            const post = await Post.findById(req.params.postid).exec();
            // res.json({ 
            //     authData
            // })
            if (post) {
                await Post.findByIdAndDelete(req.params.postid).exec();
                return res.json({ message: "Post deleted" })
            } else {
                return res.json({ message: "Post not found" })
            }
        } else {
            res.json({ message: "There has been an error", err: err })
        }
    })
})



// When testing with Postman, you must include "Bearer " and the req.token in the Authorization tab
exports.postman = [
    asyncHandler(async (req, res, next) => {
        jwt.verify(req.token, process.env.TOKEN_KEY, (err, authData) => {
            if (err) {
                console.log(err);
                res.json({
                    message: err
                })
                res.sendStatus(403);
            } else {
                res.json({
                    message: 'Postman test sucessful',
                    authData,
                })
            }
        })
    })
]
