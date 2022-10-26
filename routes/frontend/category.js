var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/category/');
const CategoryModel = require('../../models/category'); // patch models
const ArticleModel = require('../../models/article'); // patch models
const paramHelper = require('../../helper-publish/params');
/* GET home admin page. */
router.get('(/:id)?', async (req, res, next)=> {
  let idCategory = paramHelper.getParam(req.params, 'id','')
  let itemCategory = [];
  let itemInCategory = [];
    await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
    itemCategory = items ; 
    });

    await ArticleModel.listItemFrontend({id:idCategory},{task:'list-items-in-category'}).then((items)=>{
      itemInCategory = items ; 
      });
    res.render(`${folderView}index`,{
      itemCategory,
      itemInCategory
  });
});

module.exports = router;
