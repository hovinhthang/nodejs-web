var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const groupsModel = require('./../../models/groups'); // patch models groups
const GroupsModel = require('./../../schemas/groups');
const usersModel = require('./../../models/users'); // patch model user
const ValidateGroups = require('./../../validator/groups');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const { saveItem } = require('../../models/items');
const folderView = 'pages/groups/';
const linkIndex = '/' + systemConfig.admin + '/groups/';

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateGroups.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let params = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {name: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    params.search = paramHelper.getParam(req.query,    'search','');
    params.currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(params.currentStatus,'groups');
    params.paginaTion = {
            totalItem : 1,
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    params.paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
    await groupsModel.countItem(params).then((data)=>{
        params.paginaTion.totalItem = data;
        groupsModel.listItems(params)
        .then((items)=>{
                res.render(`${folderView}/list`, { 
                    title: 'Danh sách item', 
                    items:items,
                    save,
                    errorsSave,
                    statusFilter : statusFilter,
                    item,
                    params
                  
                });
        });
        
    })
    
   
});
/*  change status item. */
router.get('/change-status/:id/:status', async (req, res, next)=> {
    let currentStatus = paramHelper.getParam(req.params,    'status',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');
   
    await groupsModel.changeStatus(id,currentStatus).then((err,result)=>{
     
        res.redirect(linkIndex);
    })
    
   
});
/*  change groups item. */
router.get('/change-groups-acp/:id/:group_acp', (req, res, next)=> {
    let currentGroups = paramHelper.getParam(req.params,'group_acp','yes');
    let id            = paramHelper.getParam(req.params,'id','');
     groupsModel.changeGroup(currentGroups,id,null).then((result)=>{
        
        res.redirect(linkIndex);
    })
   
});

/*  delete item. */
router.get('/delete/:id', async (req, res, next)=> {
    let id            = paramHelper.getParam(req.params,    'id',   '');
    await  groupsModel.deleteItem(id).then((err,result)=>{
        res.redirect(linkIndex);
    })
});

/* form item . */
router.get('/form(/:id)?',   (req, res, next)=> {
   
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {name: '',ordering:0,    status: 'novalue'};
    let errors = null;
    if(id === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors }); 
    }else{ //edit
        groupsModel.getItem(id).then(( item)=>{   
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors }); 
            
        });
       
       
    }
   
    
 });

/*  save item. */
router.post('/save', async (req, res, next)=> {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateGroups.validator(req);
    let item = Object.assign(req.body);
    let errors = req.validationErrors();

    if(typeof item !== "undefined" && item.id !== ""){
        if(errors){
           
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors});
        }else{
              groupsModel.saveItem(item,{task:'edit'}).then((result)=>{
                usersModel.saveItem(item,{task:'changeGroupName'}).then((result) =>   {
                    res.redirect(linkIndex);
                });
             });  
        }
    }else
    {
        if(errors){ 
            res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors});
        }else{
          await groupsModel.saveItem(item,{task:'add'}).then((result)=>{
               res.redirect(linkIndex);
           })
        }
    }
});

module.exports = router;
