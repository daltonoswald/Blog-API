const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken} = require('../jsonwebtoken');

exports.index = async function (req, res, next) {
    try {
        const allPublishedPosts = await Post.find({ published: true })
            .sort({ date: -1 })
            .populate('author')
            .exec();

            res.json(allPublishedPosts);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

exports.unpublished_posts = async function (req, res, next) {
    try {
        const allPosts = await Post.find({ published: false })
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
            const token = req.headers.authorization.split(' ')[1];
            const authorizedUser = verifyToken(token)
            const tokenUserId = authorizedUser.user._id

            const post = new Post({
                title: req.body.title,
                text: req.body.text,
                // author: req.user._id,
                author: tokenUserId,
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

exports.post_update = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape()
        .withMessage("Title is required"),
    body("text")
        .trim()
        .isLength({ min: 1, max: 2000 })
        .escape()
        .withMessage("Text content is required"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const token = req.headers.authorization.split(' ')[1];
        const authorizedUser = verifyToken(token)
        const tokenUserId = authorizedUser.user._id

        const post = await Post.findById(req.params.postid).exec();

        const updatedPost = new Post({
            title: req.body.title,
            text: req.body.text,
            author: tokenUserId,
            date: Date.now(),
            published: req.body.published,
            _id: post.id
        });

        if (!errors.isEmpty()) {
            res.json({
                message: "Something is wrong",
                post: updatedPost,
                errors: errors.array(),
            })
            return;
        } else {
                await Post.findByIdAndUpdate(post, updatedPost, {});
                return res.json({ message: updatedPost })
            }
    })
]

exports.post_detail = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.postid)
        .populate('author')
        .exec();
    
        const comments = await Comment.find({ post: req.params.postid }).exec();

        if (post === null) {
            const err = new Error("Post not found");
            err.status = 404;
            return next(err);
        } else {
            res.json(post);
            // res.json(comments);
            console.log(comments);
        }


})

exports.delete_post = asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.TOKEN_KEY || TOKEN_KEY, async (err, authData) => {
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
        jwt.verify(req.token, process.env.TOKEN_KEY || TOKEN_KEY, (err, authData) => {
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
