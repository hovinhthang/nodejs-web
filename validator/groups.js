module.exports = {
    validator: (req)   =>  {
        req.checkBody('name',   "tiêu đề từ 5 đến 20 nha bạn").isLength({min: 5,max: 20});
        req.checkBody('ordering',   "Phải là số, lớn hơn 0 và bé hơn 100").isInt({gt: 0, lt:100});
        req.checkBody('status',   "Vui long chọn status").isNotEqual("novalue");
        req.checkBody('content',   "content tối đa 5 ký tự").isLength({min: 5,max: 20});
        req.checkBody('group_acp',   "Vui lòng chọn Group ACP").notEmpty();
    }
}


