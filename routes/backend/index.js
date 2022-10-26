var express = require('express');
var router = express.Router();
//isAuthenticated

/* GET home admin page. */
router.use('/auth',require('./auth'));
router.use('/',require('./home'));

//router.use('/',require('./home'))
router.use('/items', require('./items'));
/* GET groups groups admin page. */
router.use('/groups', require('./groups'));
/* GET user admin page. */
router.use('/users', require('./users'));
/* GET category admin page. */
router.use('/category', require('./category'));
/* GET article admin page. */
router.use('/article', require('./article'));
/* GET contact admin page. */
router.use('/contact', require('./contact'));
router.use('/test', require('./test'));
module.exports = router;
