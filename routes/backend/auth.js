var express = require('express');
var router = express.Router();
var passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const systemConfig = require('../../configs/system');
const ValidateLogin = require('../../validator/login');
const folderView = 'pages/auth/';
const linkIndex = '/' + systemConfig.admin + '/auth/';
const loginFail = 'erp/auth/login';
const userLogin = require('./../../schemas/users');
const usersModel = require('./../../models/users'); // patch models


 /* GET logout. */ 
 router.get('/logout', function (req, res, next) {
  req.user=null;
  res.redirect('/erp/auth/login');
});
/* GET login erp. */ 
router.get('/login' ,function (req, res, next) {
   
    let itemLogin = {username:'',password:''};
    let errors = null;
    res.render(`${folderView}login`,{itemLogin,errors}); 
});

router.post('/login', function (req, res, next) {
 
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateLogin.validator(req);
    let itemLogin = Object.assign(req.body);
    let errors = req.validationErrors();
    console.log(errors)
    if(errors){
        res.render(`${folderView}login`,{itemLogin,errors});
    }else{ 
     
      passport.authenticate('local', {
      successRedirect: '/erp',
      failureRedirect: '/erp/auth/login' ,
      })(req, res, next);
     
    }
    // console.log(itemLogin.userName+"-"+itemLogin.passWord)
    
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    usersModel.getItemByuserName(username,null).then((users)=>{
      let user = users[0];
     if(!user){
       console.log('user ko tồn tại');
      return done(null,false);
     }
     else{
       if(password !== user.password){
        console.log('sai mật khẫu');
         return done(null,false)
       }
       else{
        console.log('Login ok');
        return done(null,user)
       }
     }
    });
  }
));
passport.serializeUser(function(user, done) {
 
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  usersModel.getItemByuserName(id,null).then(()=>{
    done(null, user.id);
  });
 
});

module.exports = router;
