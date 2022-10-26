var express = require('express');
var router = express.Router();
const systemConfig = require('./../../configs/system');
const usersModel = require('./../../models/users'); // patch models
const GroupsModel = require('./../../schemas/groups');
const ValidateUsers = require('./../../validator/users');
const helperPublish = require('./../../helper-publish/utils');
const paramHelper = require('./../../helper-publish/params');
const multer  = require('multer');
const { users } = require('../../configs/database');
const { saveItem } = require('../../models/groups');
const folderView = 'pages/users/';
const uploadHelper = require('./../../helper-publish/uploadHelper');
const uploadAvatar = uploadHelper.upload('avatar','./public/upload/users');
const linkIndex = '/' + systemConfig.admin + '/users/';
const fs = require('fs');

/* GET items list. */ 
router.get('(/status/:status)?', async (req, res, next) =>{
    let params = {};
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateUsers.validator(req);
    let save = Object.assign(req.body);
    let errorsSave = req.validationErrors();
    let obj = {};
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {username: '',ordering:0,    status: 'novalue'}; // truyền giá trị để add item
    params.search = paramHelper.getParam(req.query,    'search','');
    params.currentStatus = paramHelper.getParam(req.params,'status','all');
    let statusFilter =  await helperPublish.createFillterStatus(params.currentStatus,'users');
    params.paginaTion = {
            totalItem : 1,      
            totalperPage : 5,
            currentPage : 1,
            pageRange:3,
    };
    let groupsItems = [];
    await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
        groupsItems = items
    })
    

    params.paginaTion.currentPage = parseInt(paramHelper.getParam(req.query,'page',1));
    await usersModel.countItem(params).then((data)=>{
        params.paginaTion.totalItem = data;

        usersModel.listItems(params)
        .then((items)=>{
                res.render(`${folderView}/list`, { 
                    title: 'Danh sách item', 
                    items:items,
                    statusFilter : statusFilter,
                    item,
                    save,
                    errorsSave,
                    groupsItems,
                    params,
                });
        });     
    })
    
   
});
/*  change status item. */
router.get('/change-status/:id/:status', async (req, res, next)=> {
    let currentStatus = paramHelper.getParam(req.params,    'status',   'active');
    let id            = paramHelper.getParam(req.params,    'id',   '');

    await usersModel.changeStatus(id,currentStatus).then((result)=>{
        
        res.redirect(linkIndex);
    })
    
   
});
/*  change groups item. */
router.get('/change-groups-acp/:id/:group_acp', (req, res, next)=> {
    let currentUsers= paramHelper.getParam(req.params,'group_acp','yes');
    let id            = paramHelper.getParam(req.params,'id','');

    usersModel.changeACP(params).then((result)=>{
        res.redirect(linkIndex);
    })
    
   
});


/* form item . */
router.get('/form(/:id)?', async   (req, res, next)=> {
   
    let id   = paramHelper.getParam(req.params,    'id',    '');
    let item = {username: '',ordering:0,    status: 'novalue',group:'',group_name:''};
    let errors = null; 
    let groupsItems = [];
    await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
        groupsItems = items
        groupsItems.unshift({_id: 'novalue',name: 'Vui lòng chọn Groups' });
    });
    if(id === ''){ //add
        res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,  errors,groupsItems }); 
    }else{ //edit
         usersModel.getItem(id).then((item)=>{   
            item.group = item.group.id;
            item.group_name = item.group.name;
            res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,  errors,groupsItems }); 
            
        });
      
       
    }
   
    
 });

/*  save item. */
router.post('/save',  (req, res, next)=> {
    uploadAvatar(req,res,async (err)=>{
        req.body = JSON.parse(JSON.stringify(req.body));
        ValidateUsers.validator(req);
        let item = Object.assign(req.body);
        let errors = req.validationErrors();
        let groupsItems = [];
        await GroupsModel.find({},{_id:1,name:1}).then((items)=>{
            groupsItems = items
            groupsItems.unshift({_id: 'novalue',name: 'Vui lòng chọn Groups' });
        });
        if(err){
            res.send('We not allow files, please choose another image')
        }
       
        if(typeof item !== "undefined" && item.id !== ""){
            if(errors){
               
                res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors,groupsItems},GroupsModel);
            }else{
                if(req.file == undefined){ // if not user not reupload avatar
                    item.avatar = item.dfImg;
                }
                else{ // reUpload avatar and delete old avatar 
                    item.avatar = req.file.filename;
                    fs.unlink('public/upload/users/'+ item.dfImg,(err)=>{
                        if(err){
                            res.redirect(linkIndex);
                        }
                    })
                }
                usersModel.saveItem(item,{task:'edit'}).then((err,result) =>   {
                   
                        res.redirect(linkIndex);
                    });
            }
        }else // add
        {
            if(errors){
                
                res.render(`${folderView}/form`, { pageTitle: 'edit Items',   item,   errors},GroupsModel);
            }else{
                item.avatar = req.file.filename;
                usersModel.saveItem(item,{task:'add'}).then(()=>{
                   res.redirect(linkIndex);
                   res.render(`${folderView}/form`, { pageTitle: 'add Items',   item,   errors},GroupsModel);
               })
               
          
            }
        }
    })
}); 
/*  delete item. */
router.get('/delete/:id',async  (req, res, next)=> {
    let id            = paramHelper.getParam(req.params,    'id',   '');
    // await usersModel.getItem(id).then((item)=>{
    //     fs.unlink('./public/upload/users'+ item.avatar,(err)=>{
    //         if(err){
    //             throw err;
    //         }
    //     })
    // });

    usersModel.deleteItem(id,).then((result)=>{
        res.redirect(linkIndex);
    })
});
/*  upload avatar user. */

router.get('/upload',  (req, res, next)=> {
    let errors = null;
    res.render(`${folderView}/upload`, { pageTitle: 'Upload Avatar' },errors); 
});

router.post('/upload',  (req, res, next)=> {

    uploadAvatar(req, res,(err)=> {
       
             if (err ) {
            res.send('Error');
            } 
            else { 
                res.render(`${folderView}/upload`, { pageTitle: 'Upload Avatar' }); 
                // Everything went fine.
            }
           
        })
});
module.exports = router;
