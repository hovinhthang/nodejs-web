var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var moment = require('moment');  
var passport = require('passport')
const mongoose = require('mongoose');
const validator = require('express-validator');
const systemConfig = require('./configs/system');
const databaseConfig = require('./configs/database');
const session = require('express-session');

// Connect database MongoDatabase
//mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@erp.lgvnl.mongodb.net/${databaseConfig.database}`,{useNewUrlParser: true ,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify: false});
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@test.0hujwog.mongodb.net/${databaseConfig.database}`,{useNewUrlParser: true ,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify: false});
mongoose.connection
  .once('open', function(){
    console.log('DB Connected!');
  })
  .on('error', function(err){
    console.log(err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Custom validator items
app.use(validator({
  customValidators:{
    isNotEqual : (value1, value2)=>{
      return value1 !== value2;
    }
  }
}));


//set local variable

app.locals.systemConfig = systemConfig;
app.locals.moment = moment;

//set up router backend
app.use(`/${systemConfig.admin}`, require('./routes/backend/index'));
app.use(`/${systemConfig.blog}`, require('./routes/frontend/index'));
//set up router frontend
app.use('/', require('./routes/frontend/index'));

app.use(cookieParser());
app.use(session({
    secret:'Hovinhthang',
    resave:true,
    saveUninitialized:true,
    cookie:{
      maxAge: 5*60*1000
    }
}));
//SET UP LOGIN
app.use(passport.initialize());
app.use(passport.session());





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(PORT, () => {
//   console.log(`Server is started at: localhost:${PORT}`);
// });


module.exports = app;
