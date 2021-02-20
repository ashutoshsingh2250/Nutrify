const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/users');
// const config = require('config');
// const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');

var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();

router.get('*', authMiddleware.checkUser);
router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);

router.get('/my-profile', authMiddleware.authUser, userController.my_details_get);
//router.get('/view-meals', authMiddleware.authUser, (req, res) => res.render('meals'));
router.get('/view-meals', [authMiddleware.authUser, authMiddleware.checkUser], userController.view_meals_get);
//router.post('/view-meals', authMiddleware.authUser, userController.view_meals_get);
router.get('/add-meal', authMiddleware.authUser, (req, res) => res.render('add_meal'));
router.post('/add-meal', authMiddleware.checkUser, userController.add_meal_post);
router.post('/delete-meal', authMiddleware.authUser, userController.delete_meal_post);
router.put('/update-meal', authMiddleware.checkUser, userController.update_meal_put);
router.get('/temp', authMiddleware.authUser, (req, res) => res.render('temp'));
router.get('/home', authMiddleware.authUser, (req, res) => res.render('home'));

module.exports = router;
