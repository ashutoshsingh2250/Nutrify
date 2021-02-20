const authMiddleware = require('../middleware/auth');
const authController = require('../controllers/auth');
// const config = require('config');
// const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

router.get('*', authMiddleware.checkUser);
router.post('/login', /*authMiddleware,*/ authController.login_post);
router.get('/login', authController.login_get);
router.get('/logout', authController.logout_get);

module.exports = router;
