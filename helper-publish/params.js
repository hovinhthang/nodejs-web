let getParam = (params,property,defualtValue) =>{
    if (params.hasOwnProperty(property) && params[property] !== undefined){
        return params[property];
    }
    return defualtValue;
}
module.exports = {
    getParam
}