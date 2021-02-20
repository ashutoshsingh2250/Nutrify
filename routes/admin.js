const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/users');
const adminMiddleWare = require('../middleware/admin');
const adminController = require('../controllers/admin');
// const config = require('config');
// const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');

var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();

router.get('*', authMiddleware.checkUser);
//router.get('/signup', userController.signup_get);
//router.post('/signup', userController.signup_post);

router.get('/my-profile', authMiddleware.authUser, userController.my_details_get);
router.get('/view-users', [authMiddleware.authUser, adminMiddleWare.isAdminUser], adminController.view_users_get);
router.get('/view-user-meals', [authMiddleware.authUser, adminMiddleWare.isAdminUser], adminController.view_user_meals_get);
router.post('/delete-user-meal', [authMiddleware.checkUser, adminMiddleWare.isAdminUser], adminController.delete_user_meal_post);
router.put('/update-user-meal', [authMiddleware.checkUser, adminMiddleWare.isAdminUser], adminController.update_user_meal_put)
router.post('/delete-user',  [authMiddleware.checkUser, adminMiddleWare.isAdminUser], adminController.delete_user_post);
router.put('/update-user', [authMiddleware.checkUser, adminMiddleWare.isAdminUser], adminController.update_user_put);

module.exports = router;
