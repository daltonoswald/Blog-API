var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')
const { generateToken, verifyToken} = require('../jsonwebtoken');
const alreadyLoggedIn = require('../middleware').alreadyLoggedIn;

router.post('/postman', user_controller.postman);

router.post('/log-in', alreadyLoggedIn, user_controller.log_in);

router.post('/sign-up', user_controller.sign_up);

module.exports = router;
