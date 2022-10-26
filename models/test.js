const ArticleModel = require('../schemas/test');
const fs = require('fs');
const FolderUpload = ('public/upload/thumb/');
const session = require('express-session')
module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
        if(params.currentStatus !=='all')   obj.status = params.currentStatus;
        if(params.search !== '')  obj.name = new RegExp(params.search,'d');
     
        return ArticleModel
        .find(params.obj)
        .sort({_id:'descending'})
        .select('name link')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage)
    },
    
    getItem : (id, options = null)=>{
       return ArticleModel.findById({_id:id});
    },
   
    listItemFrontend : (params = null, options = null)=>{
        if(options.task == 'top-post'){
            return ArticleModel.find({status: 'active',trend:'active'})
            .select('userName crated.user_name crated.time category.name thumb slug countView')
            .limit(8)
            .sort({_id:'asc'})
        }
        if(options.task == 'list-news'){
            return ArticleModel
            .find({status: 'active'})
            .select('userName crated.user_name crated.time category.name thumb slug')
            .limit(4)
            .sort({countView:'desc'})
        }
        if(options.task == 'list-items-in-category'){
            return ArticleModel
            .find({status: 'active','category.id' : params.id})
            .select('userName crated.user_name crated.time category.name thumb slug')
            .limit(4)
            .sort({_id:'desc'})
        }
        if(options.task == 'list-news-category-homepage'){
            return ArticleModel
            .find({status: 'active'})
            .select('userName crated.user_name crated.time category.name thumb slug')
            .limit(4)
            .sort({_id:'asc'})
        }
        
       
     },
    countItem : (params,options = null)=>{
       return ArticleModel.countDocuments(params.obj);
    },
    getItemPOST : (slug,options = null)=>{

        return ArticleModel.findOneAndUpdate({slug:slug},{$inc:{countView:1}})
        .select('userName crated.user_name crated.time category.name thumb slug content countView')
    },
    changeStatus : (id,currentStatus = null)=>{
       
        let status        = (currentStatus === "active")    ?   "inactive"  :   "active";
        let data          = {
            status:status,
            modified: {
                user_id :   0,
                user_name: 0,
                time: Date.now()
            }
        }
        return  ArticleModel.updateOne({_id:   id},data);
     },
     changeSpecial : (id,currentTrend = null)=>{
       
        let trend        = (currentTrend === "active")    ?   "inactive"  :   "active";
        let data          = {
            trend:trend,
            modified: {
                user_id :   0,
                user_name: 0,
                time: Date.now()
            }
        }
        return  ArticleModel.updateOne({_id:   id},data);
     },
     changeACP : (id,options = null)=>{
        let UsersACP     = (currentUsers === "yes") ? "no": "yes";
        let data          = {
            group_acp:UsersACP,
            modified: {
                user_id :   0,
                user_name: "Assmin",
                time: Date.now()
            }
        }
       return ArticleModel.updateOne({_id:   id});
     },
    
    
    deleteItem : async  (id,options = null)=>{
       
        await ArticleModel.findById({_id:id}).then((item)=>{
            let path = FolderUpload + item.thumb;
            if(fs.existsSync(path)) fs.unlink(FolderUpload+ item.thumb,(err)=>{
                if(err){
                    throw err;
                }
            })
           
        });
     return ArticleModel.deleteOne({_id:   id});
     },
     
    
     saveItem : (item,options = null)=>{
     
            if(options.task == "add"){
               
                item.crated = {
                    user_id: 0,
                    user_name : "AssMin",
                    time: Date.now(),
                }
            
              return new ArticleModel(item).save(); 
              }
              if(options.task == "edit"){
                return ArticleModel.updateOne({_id: item.id},{
                     name:item.userName,
                     ordering:parseInt(item.ordering),
                     slug:item.slug,
                     status: item.status,
                     trend: item.trend,
                     content:item.content,
                     thumb : item.thumb,
                     countView:item.countView,
                     category:{
                        id: item.category,
                        name: item.category_name,
                     },
                     modified: {
                         user_id: 0,
                         user_name : 0,
                         time: Date.now()
                     }
                     
                });
             
          }
         
        if(options.task == "changeCategoryName"){
                  
            return ArticleModel.updateOne({'category.id': item.id},{
                 category:{
                     id: item.id,
                     name: item.name,
                 },
              
             });   
        }
   }
}
