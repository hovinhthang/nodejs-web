module.exports = {
    validator: (req)   =>  {
        req.checkBody('name',   "tiêu đề từ 5 đến 20 nha bạn").isLength({min: 5,max: 20});
        req.checkBody('status',   "Vui long chọn status").isNotEqual("novalue");
        req.checkBody('status',   "Vui long chọn status").isLength({min: 5,max: 20});
      
    }
}


