var express = require('express');
var router = express.Router();
const user_controller = require('../controllers/userController')

router.post('/postman', user_controller.postman);

router.post('/log-in', user_controller.log_in);

router.post('/sign-up', user_controller.sign_up);

module.exports = router;
