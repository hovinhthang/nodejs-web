const itemModel = require('./../schemas/items');

module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
      
    if(params.currentStatus !=='all')   obj.status = params.currentStatus;
    if(params.search !== '')  obj.name = new RegExp(params.search,'i');
      
      return itemModel
        .find(obj)
        .sort({_id:'descending'})
        .select('name status ordering slug crated modified link')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage);
    },
    getItem : (id)=>{
       return itemModel.findOne({_id:   id});
    }, 
    listItemSocial : (params = null, options = null)=>{
        if(options.task == 'list-social'){
            return itemModel.find({status: 'active'})
            .select('name link')
            .limit(4)
            
        }
    },

    countItem : (params,options = null)=>{
       return itemModel.countDocuments(params.obj);
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
        return  itemModel.updateOne({_id:   id},data);
     },
    deleteItem : (id,options = null)=>{
     return itemModel.deleteOne({_id:   id});
     },
     saveItem : (item,options = null)=>{
     
            if(options.task == "add"){
                item.crated = {
                    user_id: 0,
                    user_name : "Admin",
                    time: Date.now(),
                }
              return new itemModel(item).save();
              }
              if(options.task == "edit"){
                return itemModel.updateOne({_id: item.id},{
                     name:item.name, 
               
                     status: item.status,
                     link:item.link,
                     modified: {
                         user_id: 0,
                         user_name : 0,
                         time: Date.now()
                     }
                 });  
        }
      
   },
   
}
