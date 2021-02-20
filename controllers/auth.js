const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/users');

module.exports.login_get = async function (req, res) {
    res.render('login');
}

module.exports.logout_get = async function (req, res) {
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
    //res.json({"SUCCESS": "logged out successfully!"});
}

module.exports.login_post = async function(req, res) {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
  
    const { username, password } = req.body;
    // try {
    //   const user = await User.login(username, password);
    //   const token = user.generateAuthToken(); // check user.js model
    //   res.status(200).send(user.username+ " : " +token);
    // }
    // catch (ex) {
    //   return res.status(400).send(error);
    // }
  
    let user = await User.findOne({ username });
    if(!user)  return res.status(400).json('Invalid username or password!');
    
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword)  return res.status(400).json('Invalid username or password!');
  
    const token = user.generateAuthToken(); // check user.js model
    const maxAge = 1 * 60 * 60;
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
    res.status(200).json( username );
}

function validate(req) {
  const schema = {
      username: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(req, schema);
}

function validateAdmin(req) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().invalid(false)
    }
    return Joi.validate(req, schema);
}