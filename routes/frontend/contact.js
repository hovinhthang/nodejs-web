var express = require('express');
var router = express.Router();
const folderView = ('blog/pages/contact/');

const ContactModel = require('../../models/contact'); // patch models
const CategoryModel = require('../../models/category'); // patch models
const linkIndex = '/'
/* GET home admin page. */
router.get('/', async (req, res, next)=> {
    let item = ({name:'',title:'',status:'',content:'',email:'',})
    let itemsCategory = [];
    await CategoryModel.listItemFrontend(null,{task:'list-category'}).then((items)=>{
      itemsCategory = items ; 
    });
    res.render(`${folderView}index`,{
      item,
      itemsCategory
  });
});
router.post('/',  async (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    await ContactModel.saveItem(item,{task:'add'}).then((result)=>{

      res.redirect(linkIndex);
  })
   
});


module.exports = router;
