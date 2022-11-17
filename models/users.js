const usersModel = require('../schemas/users');
const fs = require('fs');
module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
        if(params.currentStatus !=='all')   obj.status = params.currentStatus;
        if(params.search !== '')  obj.name = new RegExp(params.search,'i');
        return usersModel
        .find(params.obj)
        .sort({_id:'descending'})
        .select('username status odering crated content modified group.name avatar')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage)
    },
    
    getItem : (id, options = null)=>{
       return usersModel.findById({_id:id});
    },
    countItem : (params,options = null)=>{
       return usersModel.countDocuments(params.obj);
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
        return  usersModel.updateOne({_id:   id},data);
     },
     changeACP : (id,options = null)=>{
        let UsersACP     = (currentUsers === "yes") ? "no": "yes";
        let data          = {
            group_acp:UsersACP,
            modified: {
                user_id :   0,
                user_name: "Admin",
                time: Date.now()
            }
        }
       return usersModel.updateOne({_id:   id});
     },
    deleteItem : async  (id,options = null)=>{
       
        await usersModel.findById({_id:id}).then((item)=>{
            let path = 'public/upload/users/'+ item.avatar;
            if(fs.existsSync(path)) fs.unlink('public/upload/users/'+ item.avatar,(err)=>{
                if(err){
                    throw err;
                }
            })
           
        });
     return usersModel.deleteOne({_id:   id});
     },
     getItemByuserName : (username,options = null)=>{
         if(options == null){
            return usersModel.find({status:'active',username:username})
            .select('username password avatar status group.name')
         }
        
     },
     saveItem : (item,options = null)=>{
     
            if(options.task == "add"){
                item.crated = {
                    user_id: 0,
                    user_name : "AdMin",
                    time: Date.now(),
                }
                item.group = {
                    id: item.group,
                    name: item.group_name,
                }
              return new usersModel(item).save(); 
              }
              if(options.task == "edit"){
                return usersModel.updateOne({_id: item.id},{
                     name:item.username,
                     ordering:parseInt(item.ordering),
                     slug:item.slug,
                     status: item.status,
                     password:item.password,
                     content:item.content,
                     avatar : item.avatar,
                     group:{
                         id: item.group,
                         name: item.group_name,
                     },
                     modified: {
                         user_id: 0,
                         user_name : 0,
                         time: Date.now()
                     }
                     
                });
             
          }
         
        if(options.task == "changeGroupName"){
                  
            return usersModel.updateOne({'group.id': item.id},{
                 group:{
                     id: item.id,
                     name: item.name,
                 },
              
             });   
        }
   }
}
