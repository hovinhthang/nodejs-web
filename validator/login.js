module.exports = {
    validator: (req)   =>  {
        req.checkBody('username',   "block 24h").isLength({min: 4,max: 20});
    }
}


