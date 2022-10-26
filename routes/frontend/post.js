var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/post/');
const ArticleModel = require('../../models/article'); // patch models
const CategoryModel = require('../../models/category'); // patch models
const SocialItem = require('../../models/items'); // patch models
const paramHelper = require('../../helper-publish/params');
const session = require('express-session')
/* GET home admin page. */
router.get('/:slug', async function(req, res, next) { 
  let itemsRecentPost = [];
  let itemsCategory = []; 
  let itemsDetail = paramHelper.getParam(req.params,'slug','');

  await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
    itemsCategory = items ; 
  });
  await ArticleModel.getItemPOST(itemsDetail,null).then((items)=>{
      itemsDetail = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news'}).then((items)=>{
      itemsRecentPost = items ; 
    });
    res.render(`${folderView}index`,{
      top_post:true,
      itemsCategory,
      itemsDetail,
      itemsRecentPost,
      
  });
  
});

module.exports = router;
