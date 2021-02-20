const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  //_id: ObjectId,
  username: {
    type: String, 
    minlength: 2, 
    maxlength: 255, 
    required: true
  },
  datetime: {
    type: String,  
    required: true
  },
  food_name: {
    type: String, 
    minlength: 2, 
    maxlength: 255, 
    required: true
  },
  calorie:{
    type: Number,
    required: true
  },
  description: {
    type: String, 
    minlength: 2, 
    maxlength: 255, 
    required: true
  }
});

const Meal=mongoose.model('Meal', mealSchema);

function validateMeal(meal) {
  const schema = {
      calorie: Joi.number().required(), 
      username: Joi.string().min(5).max(255).required(),
      description: Joi.string().min(5).max(255).required(),
      food_name: Joi.string().min(5).max(255).required(),
      datetime: Joi.string().required()
  }

  return Joi.validate(meal, schema);
}

module.exports.Meal = Meal;
module.exports.validateMeal = validateMeal;