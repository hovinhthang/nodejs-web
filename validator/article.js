module.exports = {
    validator: (req)   =>  {

        req.checkBody('status',   "Vui long chọn status").isNotEqual("novalue");
        req.checkBody('group',   "phải là một giá trị khác rỗng").isNotEqual("novalue");
       
    }
}


