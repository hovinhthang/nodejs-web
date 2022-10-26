var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const itemModel = require('./../../models/items'); // patch models item
const ValidateItems = require('./../../validator/items');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const { deleteItem } = require('./../../models/items');
const folderView = 'pages/items/';
const linkIndex = '/' + systemConfig.admin + '/items/';


 

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    let params = {};
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateItems.validator(req);
    let item = {name: '',ordering:0,    status: 'novalue',slug:'',link:''};
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    params.search = paramHelper.getParam(req.query,    'search','');
    params.currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(params.currentStatus,'items');
    params.paginaTion = {
            totalItem : 1,
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    
    params.paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
    await itemModel.countItem(params).then((data)=>{
        params.paginaTion.totalItem = data;
        itemModel.listItems(params)
        .then((items)=>{
                res.render(`${folderView}/list`, { 
                    title: 'Danh sách item', 
                    items:items,
                    statusFilter : statusFilter,
                    params,
                    item,
                    save,
                    errorsSave
                });
               
        }); 
    })
    
   
});
/*  change status item. */
router.get('/change-status/:id/:status', async (req, res, next)=> {
    let currentStatus = paramHelper.getParam(req.params,    'status',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');
    itemModel.changeStatus(id,currentStatus).then((result)=>{
       
        res.redirect(linkIndex);
    }) 
});


/*  delete item. */
router.get('/delete/:id',  (req, res, next)=> {
    let id            = paramHelper.getParam(req.params,    'id',   '');
 
      itemModel.deleteItem(id).then((result)=>{
        res.redirect(linkIndex);
    })
    
});

/* form item . */
router.get('/form(/:slug)?',(req, res, next)=> {
    let slug   = paramHelper.getParam(req.params,    'slug',    '');
    let item = {name:'',ordering:0,    status: 'novalue',slug:''};
    let errors = null;
    if(slug === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors }); 
    }else{ //edit
         itemModel.getItem(slug).then((item)=>{   
         
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors }); 
            console.log(item)
        });

    } 
 });

/*  save item. */
router.post('/save',  (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateItems.validator(req);
    let item = Object.assign(req.body);
    let errors = req.validationErrors();
        if(typeof item !== "undefined" && item.id !== ""){
            if(errors){ //edit
            
                res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors});
            }else{
                itemModel.saveItem(item,{task:'edit'}).then((result) =>   {
                    res.redirect(linkIndex);
            
                });
               
            }
        }else
        {
            if(errors){ // add
                
                res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors});
            }else{
                itemModel.saveItem(item,{task:'add'}).then(()=>{
                res.redirect(linkIndex);
               
            })
            }
     
    }
});

module.exports = router;
