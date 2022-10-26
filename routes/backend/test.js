var express = require('express');
var router = express.Router();
const systemConfig = require('../../configs/system');
const ArticleModel = require('../../models/test'); // patch models
const CategoryModel = require('../../schemas/test');
const ValidateArticle = require('../../validator/article');
const helperPublish = require('../../helper-publish/utils');
const paramHelper = require('../../helper-publish/params');
const multer  = require('multer');
const { users } = require('../../configs/database');
const { saveItem } = require('../../models/test');
const folderView = 'pages/test/';
const uploadHelper = require('../../helper-publish/uploadThumb');
const uploadThum = uploadHelper.upload('thumb','./public/upload/thumb');
const linkIndex = '/' + systemConfig.admin + '/test/';

const fs = require('fs');

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    let params = {};
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateArticle.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let obj = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {userName: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    params.search = paramHelper.getParam(req.query,    'search','');
    params.currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(params.currentStatus,'test');
    params.paginaTion = {
            totalItem : 1,      
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    let categoryItems = [];
    await CategoryModel.find({},{_id:1,name:1}).then((items)=>{
        categoryItems = items
    })  
    params.paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
    await ArticleModel.countItem(params).then((data)=>{
        params.paginaTion.totalItem = data;

        ArticleModel.listItems(params)
        .then((items)=>{
                res.render(`${folderView}/list`, { 
                    title: 'Danh sách item', 
                    items:items,
                    statusFilter : statusFilter,
                    item,
                    save,
                    errorsSave,
                    categoryItems,
                    params,
                    
                });
        });     
    })
    
   
});
/*  change status item. */
router.get('/change-status/:id/:status', async (req, res, next)=> {
    let currentStatus = paramHelper.getParam(req.params,    'status',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');

    await ArticleModel.changeStatus(id,currentStatus).then((result)=>{
        
        res.redirect(linkIndex);
    })
    
   
});
/*  change top_post item. */
router.get('/change-special/:id/:trend',  (req, res, next)=> {
    let currentTrend = paramHelper.getParam(req.params,    'trend',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');

     ArticleModel.changeSpecial(id,currentTrend).then((result)=>{
        
        res.redirect(linkIndex);
    })
    
   
});


/*  change groups item. */
router.get('/change-groups-acp/:id/:group_acp', (req, res, next)=> {
    let currentUsers= paramHelper.getParam(req.params,'group_acp','yes');
    let id            = paramHelper.getParam(req.params,'id','');

    ArticleModel.changeACP(params).then((result)=>{
        res.redirect(linkIndex);
    })
    
   
});


/* form item . */
router.get('/form(/:id)?', async   (req, res, next)=> {
   
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {userName: '',ordering:0,    status: 'novalue',category:'',category_name:''};
    let errors = null; 
    let categoryItems = [];
    await CategoryModel.find({},{_id:1,name:1}).then((items)=>{
        categoryItems = items
        categoryItems.unshift({_id: 'novalue',name: 'Vui lòng chọn thể loại' });
    });
    if(id === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors,categoryItems }); 
    }else{ //edit
         ArticleModel.getItem(id).then((item)=>{   
            item.category = item.category.id;
            item.category_name = item.category.name;
            
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors,categoryItems }); 
            
        });
      
       
    }
   
    
 });

/*  save item. */
router.post('/save',  (req, res, next)=> {
    uploadThum(req,res,async (err)=>{
       
        req.body = JSON.parse(JSON.stringify(req.body));
        ValidateArticle.validator(req);
        let item = Object.assign(req.body);
        let errors = req.validationErrors();
        let categoryItems = [];
        await CategoryModel.find({},{_id:1,name:1}).then((items)=>{
            categoryItems = items
            categoryItems.unshift({_id: 'novalue',name: 'Vui lòng chọn thể loại' });
        });
        if(err){
            res.send('We not allow files, please choose another image')
        }
       
        if(typeof item !== "undefined" && item.id !== ""){
            if(errors){
               
                res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors,categoryItems},CategoryModel);
            }else{
                if(req.file == undefined){ // if not user not reupload avatar
                    item.thumb = item.dfImg;
                }
                else{ // reUpload avatar and delete old avatar 
                    item.thumb = req.file.filename;
                    fs.unlink('public/upload/article/'+ item.dfImg,(err)=>{
                        if(err){
                            res.redirect(linkIndex);
                        }
                    })
                }
                ArticleModel.saveItem(item,{task:'edit'}).then((err,result) =>   {
                   
                        res.redirect(linkIndex);
                    });
            }
        }else // add
        {
            if(errors){
                res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors},CategoryModel);
            }else{
                item.thumb = req.file.filename;
                ArticleModel.saveItem(item,{task:'add'}).then(()=>{
                   res.redirect(linkIndex);
                   res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors},CategoryModel);
               })
            }
        }
    })
}); 
/*  delete item. */
router.get('/delete/:id',async  (req, res, next)=> {
    let id            = paramHelper.getParam(req.params,    'id',   '');
  
    ArticleModel.deleteItem(id,).then((result)=>{
        res.redirect(linkIndex);
    })
});
/*  upload thumb blog. */

router.get('/upload',  (req, res, next)=> {
    
    res.render(`${folderView}/upload`, { pageTitle: 'Upload Avatar' }); 
});

router.post('/upload',  (req, res, next)=> {
    ArticleModel.saveItem(item,{task:'add'}).then(()=>{
        res.redirect(linkIndex);
      
    })
});


module.exports = router;
