var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/home/');
const ArticleModel = require('../../models/article'); // patch models
const CategoryModel = require('../../models/category'); // patch models
const SocialItem = require('../../models/items'); // patch models
const paramHelper = require('../../helper-publish/params');

/* GET home admin page. */
router.get('/', async (req, res, next)=> { 
  let itemsDetail = paramHelper.getParam(req.params,'id','');
  let itemsTrend = [];
  let itemsNew = []; 
  let itemsCategory = [];
  let itemsNewsHomePage = [];
  let itemSocial = [];
 
    await ArticleModel.getItemPOST(itemsDetail,null).then((items)=>{
      itemsDetail = items ; 
    });
   await ArticleModel.listItemFrontend(null,{task:'top-post'}).then((items)=>{
    itemsTrend = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news'}).then((items)=>{
      itemsNew = items ; 
      });
    await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
      itemsCategory = items ; 
    });
    await ArticleModel.listItemFrontend(null,{task:'list-news-category-homepage'}).then((items)=>{
      itemsNewsHomePage = items ; 
    });
    await SocialItem.listItemSocial(null,{task:'list-social'}).then((items)=>{
      itemSocial = items ; 
    });
   
    res.render(`${folderView}index`,{
      top_post:true,
      itemsTrend,
      itemsNew,
      itemsCategory,
      itemsNewsHomePage,
      itemSocial,
      itemsDetail
  });

});

module.exports = router;
