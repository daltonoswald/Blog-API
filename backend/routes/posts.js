var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postController');
// const verifyToken = require('../middleware/middleware');

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

router.post('/', verifyToken, post_controller.index);

router.post('/new-post', verifyToken, post_controller.new_post);

router.delete('/delete-post/:postid', verifyToken, post_controller.delete_post);

module.exports = router;