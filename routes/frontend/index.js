var express = require('express');
var router = express.Router();


/* GET home page. */
router.use('/',require('./home'))
/* GET category page. */
router.use('/category',require('./category'))
/* GET details page. */
router.use('/p',require('./post'))
/* GET contact page. */
router.use('/contact',require('./contact'))
/* GET about page. */
router.use('/about',require('./about'))
router.use('/search',require('./search'))
module.exports = router;
