var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/about/');

const ContactModel = require('../../models/contact'); // patch models
const CategoryModel = require('../../models/category'); // patch models
const linkIndex = '/'
/* GET home admin page. */
router.get('/', async (req, res, next)=> {
  let itemsCategory = [];
  await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
    itemsCategory = items ; 
  });
    res.render(`${folderView}index`,{
      itemsCategory
  });
});


module.exports = router;
