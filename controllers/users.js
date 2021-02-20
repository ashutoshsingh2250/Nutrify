const _ = require('lodash');
const { User, validateRegistration } = require('../models/users');
const { Meal, validateMeal } = require('../models/meals');
const fetch = require("node-fetch");
const { describe, description } = require('joi');
let meal_arr=[];
let prev_meal_arr_length;
let selected_date;
let prev_date;

module.exports.signup_get= async (req, res) => {
    res.render('signup');  
};

module.exports.signup_post= async (req, res) => {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    
    let user = await User.findOne({ username: req.body.username });
    if(user)  return res.status(400).json('User is already registered with this username');
    
    // user = new User({
    //   firstName: req.body.firstName,
    //   lastName: req.body.lastName,
    //   password: req.body.password,
    //   calories_per_day: req.body.calories_per_day,
    //   phone: req.body.phone,
    //   email: req.body.email,
    //   username: req.body.username
    // });
  
    // Instead of manually repeating things, and also now a malacious user might try to send 50 properties in a document entry. To prevent malware and ensure safety, user lodash pick method for schema creation.
    user = new User(_.pick(req.body, ['firstName', 'lastName', 'password', 'calories_per_day', 'phone', 'email', 'username']));
    
    // Check Password Encryption is handled in userSchema model itself inside user.js
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);
  
    const result = await user.save();
    console.log(result);
  
    // After registration of user, we return a jwt for that user on client side, so that next time client logins, it uses the same jwt for auth.
    const token = user.generateAuthToken(); // check user.js under model folder
    
    const maxAge = 1 * 60 * 60;
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
  
    // res.send({
    //   firstName: req.body.firstName,
    //   lastName: req.body.lastName,
    //   calories_per_day: req.body.calories_per_day,
    //   phone: req.body.phone,
    //   email: req.body.email,
    //   username: req.body.username
    // }); 
  
    // Unlike above, instead of manually responding to the client only with the required fields after registration, use _ lodash's pick method as shown 
    res./*header('x-auth-token', token).*/status(201).json(_.pick(user, ['firstName', 'lastName', 'calories_per_day', 'phone', 'email', 'username']));
}

module.exports.my_details_get= async (req, res) => {
    const user = await User.find({ username: req.user.username }).select('-password');
    res.json(user);
}

module.exports.add_meal_post= async (req, res) => {
    const dateObj = new Date();
    req.body.datetime= req.body.datetime + "T" + dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds() +"Z";

    const _meal = {
      username: req.body.user.username,
      food_name: req.body.food_name,
      description: req.body.description,
      datetime: req.body.datetime, 
      calorie: req.body.calorie
    }
    const { error } = validateMeal(_.pick(_meal, ['username','food_name', 'description', 'datetime', 'calorie']));
    if (error) return res.status(400).json(error.details[0].message);

    console.log("REACHED IN ADD MEAL POST."+ req.body.food_name + req.body.description + req.body.datetime + req.body.calorie + req.body.user.username);
    
    meal = new Meal(_.pick(_meal, ['username', 'food_name', 'description', 'datetime', 'calorie']));
    const result = await meal.save();
    console.log(result);

    res.status(200).send(meal);
}

module.exports.view_meals_get= async (req, res) => {    
    let meals, tot_cal=-1, calories_per_day=-1;
    const date=req.query.date;
    const username=req.body.username;
    selected_date=date;

  if(selected_date) {  
    prev_date=selected_date;
    console.log("VIEW MEALS POST SEL DATE: "+req.query.date);
    console.log(username);
    meals = await Meal.find({username: username, datetime: new RegExp('^'+date , 'i')});//.sort({datetime: 1});  
  } else if(prev_date) {
    console.log("VIEW MEALS POST PREV DATE: "+prev_date);
    console.log(username);
    meals = await Meal.find({username: username, datetime: new RegExp('^'+prev_date , 'i')});//.sort({datetime: 1});
    prev_date=null;
    tot_cal=0;
    for(i in meals) {
      tot_cal+=meals[i].calorie;
    }
    calories_per_day=req.body.user.calories_per_day;
  } 
  else {
    //meals = await Meal.find({ username: req.body.username });
    meals = await Meal.find({username: username});
  }


  console.log("VIEW MEALS FROM DB: ", meals);
  //meal_arr=[];
  while(prev_meal_arr_length-->0)    meal_arr.pop();
  for(i in meals) {
    //console.log(meals[i]);
    let datetime=meals[i].datetime;
    console.log(datetime);
    //datetime=datetime.split("T")[0] + " " +datetime.split("T")[1].split("Z")[0];
    meals[i].datetime=datetime;
    meal_arr.push(meals[i]);
  }
  prev_meal_arr_length=meal_arr.length>0?meal_arr.length:0;
  console.log("TOTAL CALORIE:", tot_cal);
  console.log("CALORIE PER DAY:", calories_per_day);
    //console.log("VIEW MEALS: ", meal_arr);
    res.render("meals.ejs", {meals: meal_arr, tot_cal: tot_cal, calories_per_day: calories_per_day});
}

// module.exports.view_meals_post= async (req, res) => { 
//     console.log("VIEW MEALS POST DATE: "+req.body.date);
//     const date=req.body.date;
//     const username=req.body.username;
//     console.log(username);
//     const meals= await Meal.find({username: username, datetime: new RegExp('^'+date , 'i')});//.sort({datetime: 1});

//     console.log("VIEW MEALS: ", meals);
    
//     res.json(meals);
// }

module.exports.delete_meal_post= async (req, res) => {
    // console.log(req.body._id);
    // meal_arr=[];

    // let meals = await Meal.deleteOne({ _id: req.body._id });
    // for(i in meals) {
    //   meal_arr.push(meals[i]);
    // }

    // console.log("VIEW MEALS: ", meal_arr);
    // res.send("DELETED SUCCESS");


    //************************************************ */
    let delete_id=req.body._id;
    console.log("DELETE ID:====================>"+delete_id);
    //meal_arr=[];

    let meals = await Meal.deleteOne({ _id: delete_id });
    prev_meal_arr_length--;
    
    // for(i in meals) {
    //   //console.log(meals[i]);
    //   if(meals[i].username===selected_user)
    //     meal_arr.push(meals[i]);
    // }

    for(i in meal_arr) {
        if(meal_arr[i]._id == delete_id){
            console.log("FROM DB ID:=============>"+meal_arr[i]._id);
            meal_arr.splice(i, 1);
        }
    }

    console.log("VIEW MEALS: ", meal_arr);
    //res.render("meals.ejs", {meals: meal_arr});
    res.send("DELETED SUCCESS");
}

module.exports.update_meal_put= async (req, res) => {
    console.log("UPDATE BODY"+req.body.calorie);
    const datetime=req.body.datetime;
    const calorie=req.body.calorie;
    const description=req.body.description;
    const food_name=req.body.food_name;
    const _id=req.body._id;
    console.log(_id);
    let meal = await Meal.findById(_id);
    console.log("EXISTS: "+ meal);
    if(meal.username!==req.body.user.username)    res.json({ error: "This is not a valid Meal for this user!" });

    meal.set({
        datetime: datetime,
        calorie: calorie,
        description: description
    });

    // const meal = await Meal.findByIdAndUpdate(req.body.id, {   
    //     $set: {
    //         datetime: datetime,
    //         calorie: calorie,
    //         description: description
    //     }
    // }, { new: true });

    //meal = await Meal.find({ _id: req.body._id });
    
    const result = await meal.save();
    console.log("UPDATED MEAL IS: "+ result);

    res.json(req.body);
}