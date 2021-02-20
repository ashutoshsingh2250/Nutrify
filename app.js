const authMiddleware = require('./middleware/auth');
const config = require('config');
//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth'); 
const adminRouter = require('./routes/admin');

if(!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: nutrify_jwtPrivateKey is not defined.');
  process.exit(1);
}

// if(!config.get('db_connect_password')) {
//   console.log('FATAL ERROR: db_connect_password is not defined');
//   process.exit(1);
// }

const port = process.env.PORT || 3000;
//console.log("CONS:   "+config.get('db_connect_password'));
if(!config.get('db_connect_password')===null) {
  console.log('FATAL ERROR: db_connect_password is not defined');
  process.exit(1);
}
else {

  const db_connect_password=encodeURIComponent(config.get('db_connect_password'));
  const db_name='nutrify';
  const uri = `mongodb+srv://ashutosh:${db_connect_password}@cluster0.vt3ok.mongodb.net/${db_name}?retryWrites=true&w=majority`;

  //mongodb://localhost/nutrify

  mongoose.connect(uri)
    .then((res)=> {
      console.log('Connected to MongoDB...');
      app.listen(port, ()=> console.log(`Listening to port ${port}...`));
    })
    .catch(err => {
      console.log(db_connect_password);
      console.log('Couldn\'t connect to MongoDB...', err);
    });

}
// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
//app.get('*', authMiddleware.checkUser);
app.get('/', authMiddleware.checkUser, (req, res) => res.render('index'));
//app.get('/api/meals', authMiddleware, (req, res) => res.render('meals'));

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//const port = process.env.PORT || 3000;
//app.listen(port, ()=> console.log(`Listening to port ${port}...`));

module.exports = app;