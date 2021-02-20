const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
//const { isEmail } = require('validator');
//let token;

const userSchema = new mongoose.Schema({
  //_id: ObjectId,
  firstName: { 
    type: String, 
    minlength: 2, 
    maxlength: 255, 
    required: true
  },
  lastName: { 
    type: String, 
    minlength: 2, 
    maxlength: 255, 
    required: true
  },
  password: { 
    type: String, 
    minlength: 8, 
    maxlength: 1024, 
    required: true
  },
  calories_per_day: { 
    type: Number, 
    required: true
  },
  phone: { 
    type: String, 
    required: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  username: { 
    type: String, 
    required: true, 
    unique: true
  },
  isAdmin: Boolean
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('save', function (doc, next) {
  console.log('new user was created and saved to DB');
  next();
});

// userSchema.statics.login = async function (username, password) {
//   let user = await User.findOne({ username });
//   if(user) {
//     const validPassword = await bcrypt.compare(password, user.password);
//     if(validPassword) return user;
//     //return res.status(400).send('Invalid username or password!');
//     throw Error('Incorrect Password!');
//   }
//   //return res.status(400).send('Invalid username or password!');
//   throw Error('Incorrect Username');
// }

userSchema.methods.generateAuthToken = function (params) {
  const token = jwt.sign({username: this.username, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'), {expiresIn: '1h'});
  // the second parameter is to be taken during runtime from env vars, via cfgs.
  // check config folder -> default.json and custom-environment-variables.json 
  return token;
}

const User=mongoose.model('User', userSchema);

function validateRegistration(user) {
  const schema = {
      firstName: Joi.string().min(2).max(255).required(),
      lastName: Joi.string().min(2).max(255).required(), 
      calories_per_day: Joi.number().required(), 
      username: Joi.string().min(5).max(255).required(),
      phone: Joi.string().regex(/^\d{10}$/).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateRegistration = validateRegistration;