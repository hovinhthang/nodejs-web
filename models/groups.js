const itemModel = require('./../schemas/groups');

module.exports = {
    listItems : (params,options = null )=>{
        let obj = {};
      
    if(params.currentStatus !=='all')   obj.status = params.currentStatus;
    if(params.search !== '')  obj.name = new RegExp(params.search,'i');
      
      return itemModel
        .find(obj)
        .sort({_id:'descending'})
        .select('name status ordering slug crated modified group_acp')
        .skip((params.paginaTion.currentPage-1)    *   params.paginaTion.totalperPage)
        .limit(params.paginaTion.totalperPage);
    },
    getItem : (id)=>{
       return itemModel.findById(id);
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
                    user_name : "AssMin",
                    time: Date.now(),
                }
              return new itemModel(item).save();
              }
              if(options.task == "edit"){
                return itemModel.updateOne({_id: item.id},{
                    name:item.name,
                    ordering:parseInt(item.ordering),
                    slug:item.slug,
                    status: item.status,
                    content:item.content,
                    group_acp: item.group_acp,
                    modified: {
                        user_id: 0,
                        user_name : 0,
                        time: Date.now()
                    }
                 });       
        }
      

   },
   changeGroup : (currentGroups,id,options = null)=>{
    let groupsACP     = (currentGroups === "yes") ? "no": "yes";
    let data          = {
        group_acp:groupsACP,
        modified: {
            user_id :   0,
            user_name: "Assmin",
            time: Date.now()
        }
    }  
    return itemModel.updateOne({_id:   id},data);
    },
}
