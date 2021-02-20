const _ = require('lodash');
const { User, validateRegistration } = require('../models/users');
const { Meal, validateMeal } = require('../models/meals');
const fetch = require("node-fetch");
const { describe, description } = require('joi');
let user_arr=[];
let meal_arr=[];
let prev_meal_arr_length;
let selected_user;

module.exports.view_user_meals_get= async (req, res) => {
    let users;
    //meal_arr=[];

    const username=req.query.sel_username;
    selected_user=username;
    users = await User.find();
  
    //console.log("VIEW USERS: ", users);
    console.log("SELECTED USERNAME: ", username);
    user_arr=[];
    user_arr.push({
        username: "select username"
    });
    for(i in users) {

      if(!users[i].isAdmin)
        user_arr.push(users[i]);
    }

    console.log("==============================================BEFORE=================================================")
    if(username) {
        while(prev_meal_arr_length-->0)    meal_arr.pop();
        console.log("REQ ID INSIDE MEALS: "+username);
        let meals=await Meal.find({username: username});
        for(i in meals) {
            meal_arr.push(meals[i]);
        }
        prev_meal_arr_length=meal_arr.length>0?meal_arr.length:0;
    }

    console.log("VIEW USER MEALS : ", meal_arr);
    
    //console.log("VIEW USERS : ", user_arr);
    res.render("user_meals.ejs", {users: user_arr, meals: meal_arr});
}

module.exports.view_users_get= async (req, res) => {
    let users;
    
    const username=req.body.username;
    //selected_user=username;
    users = await User.find();
  
    console.log("VIEW USERS: ", users);
    user_arr=[];

    for(i in users) {

      const {firstName, lastName, username, calories_per_day, phone, email} = users[i];
      console.log(users[i]);
      
      if(!users[i].isAdmin)
        user_arr.push(users[i]);
    }

    console.log("VIEW USERS: ", user_arr);
    res.render("users.ejs", {users: user_arr});
    //res.json(req.body);
}

module.exports.update_user_put= async (req, res) => {
    console.log("UPDATE BODY: "+req.body.email);
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const phone=req.body.phone;
    const email=req.body.email;
    const calories_per_day=req.body.calories_per_day;
    const _id=req.body._id;
    console.log(_id);
    let user = await User.findById(_id);
    console.log("EXISTS: "+ user);
    //if(user.username!==req.body.username) return res.json({ error: "There's some inconsistency for this user!" });

    user.set({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        calories_per_day: calories_per_day
    });
    const result = await user.save();
    console.log("UPDATED USER IS: "+ result);

    res.json(req.body);
}

module.exports.delete_user_post= async (req, res) => {
    console.log("ID TO BE DELETED=========>"+req.body._id);
    user_arr=[];

    let users = await User.deleteOne({ _id: req.body._id });
    for(i in users) {
      //console.log(meals[i]);
      user_arr.push(users[i]);
    }

    console.log("VIEW USERS+: ", user_arr);
    //res.render("meals.ejs", {meals: meal_arr});
    res.send("DELETED USER SUCCESS");
}

module.exports.delete_user_meal_post= async (req, res)=> {
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

module.exports.update_user_meal_put= async (req, res)=> {
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

    for(i in meal_arr) {
        if(meal_arr[i]._id == _id){
            console.log("FROM DB ID:=============>"+meal_arr[i]._id);
            meal_arr[i].datetime=datetime;
            meal_arr[i].calorie=calorie;
            meal_arr[i].description=description;

        }
    }

    // const meal = await Meal.findByIdAndUpdate(req.body.id, {   
    //     $set: {
    //         datetime: datetime,
    //         calorie: calorie,
    //         description: description
    //     }
    // }, { new: true });

    //meal = await Meal.find({ _id: req.body._id });
    
    const result = await meal.save();
    console.log("UPDATED MEAL IS: "+ req.body);

    res.json(req.body);
}