

let createFillterStatus = (currentStatus,collection) => {
    const currentModel = require('./../schemas/' + collection);
    let statusFilter = [
        {name : 'All',value:'all',count:0,  link: '#',  class:'btn btn-default'},
        {name : 'Active',value:'active',count:0,  link: '#',  class:'btn btn-default'},
        {name : 'Inactive',value:'inactive',count:0,  link: '#',  class:'btn btn-default'},

    ];

    statusFilter.forEach( (item,index)=>{
        let condition = {};
        if(item.value !== "all") condition = {status:item.value};
        if(item.value === currentStatus ) statusFilter[index].class='btn btn-success';
        currentModel.countDocuments({status : item.value }).then((data)=>{
            statusFilter[index].count   =   data;
         });
    });

    return statusFilter;
}
module.exports = {
    createFillterStatus : createFillterStatus
}