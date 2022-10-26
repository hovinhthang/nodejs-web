module.exports = {
    validator: (req)   =>  {
        req.checkBody('username',   "tiêu đề từ 5 đến 20 nha bạn").isLength({min: 4,max: 20});
     
    }
}


