const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken} = require('../jsonwebtoken');

exports.comments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postid }).populate('author').exec();
    res.json(comments);
})

exports.new_comment = [
    body('text', 'The text must be between 1 and 200 characters')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token)
            const tokenUserId = authorizedUser.user._id

            const comment = new Comment({
                author: tokenUserId,
                text: req.body.text,
                date: Date.now(),
                post: req.params.postid,
            });

            if (!errors.isEmpty()) {
                res.json({
                    message: "Something is wrong",
                    comment: comment,
                    errors: errors.array(),
                })
                return
            } else {
                await comment.save();
                return res.json({
                    message: "Message created",
                    comment: comment
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
]

exports.delete_comment = asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.TOKEN_KEY, async(err, authData) => {
        if (authData.user.admin === true) {
            const post = await Post.findById(req.params.postid).exec();
            if (post) {
                const comment = await Comment.findById(req.params.commentid).exec();
                if (comment) {
                    // await Comment.findByIdAndDelete(req.params.commentid).exec();
                    return res.json({ message: "Comment deleted" });
                } else {
                    return res.json({ message: "Comment not found" });
                }               
            } else {
                return res.json({ message: "Post not found" });
            }
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
                    message: 'Postman test sucessful on comments',
                    authData,
                })
            }
        })
    })
]