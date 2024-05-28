var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postController');
const comment_controller = require("../controllers/commentController");
// const verifyToken = require('../middleware/middleware');
// const verifyToken = require('../middleware').verifyToken

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

router.post('/postman', verifyToken, post_controller.postman);
router.post('/comments/postman', verifyToken, comment_controller.postman);

router.post('/', verifyToken, post_controller.index);

router.post('/:postid', verifyToken, post_controller.post_detail);

router.post('/new-post', verifyToken, post_controller.new_post);

router.delete('/delete-post/:postid', verifyToken, post_controller.delete_post);

router.post('/:postid/comments', verifyToken, comment_controller.comments);

router.post('/:postid/comments/new-comment', verifyToken, comment_controller.new_comment);

router.delete('/:postid/comments/:commentid', verifyToken, comment_controller.delete_comment);


module.exports = router;