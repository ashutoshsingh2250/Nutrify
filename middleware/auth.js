const config = require('config');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

module.exports.authUser = function (req, res, next) {
  console.log('FLOW 2');
  //const token = req.header('x-auth-token');
  const token = req.cookies.jwt;
  //if(!token) return res.status(401).send('Access Denied. No token provided!');
  if(!token)  res.redirect('/api/auth/login');
  else {
    jwt.verify(token, config.get('jwtPrivateKey'), (err,decodedToken)=>{
      if(err) {
        console.log(err.message);
        res.redirect('/api/auth/login');
      } else {
        //if(req.route.path == '/view-meals' && (req.method == 'GET' || req.method == 'POST'))
          req.body.username=decodedToken.username;
        console.log(decodedToken);
        next();
      }
    });
  }
}

module.exports.checkUser= function(req, res, next) {
  console.log('FLOW 1');
  // if(req.route.path == '/add-meal' && req.method == 'POST')
  //   console.log(req);
  
  const token = req.cookies.jwt;
  if(!token)  {
    res.locals.user=null;
    next(); 
  }
  else {
    jwt.verify(token, config.get('jwtPrivateKey'), async (err,decodedToken)=>{
      if(err) {
        console.log(err.message);
        res.locals.user=null;
        next();
      } else {
        //console.log(req.calorie);
        console.log(decodedToken);
        const user = await User.findOne({ username: decodedToken.username }, {password: 0});
        //console.log("Ola" + user);
        res.locals.user=user;
        /*if((req.route.path == '/add-meal' && req.method == 'POST') || (req.route.path == '/update-meal' && req.method == 'PUT'))*/
          req.body.user=user;
        next();
      }
    });
  }
}

