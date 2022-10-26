module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.username == "Admin") {
            next();
        }else {
            res.redirect(linkNoPermission);
        }
    }else {
        res.redirect(linkLogin);
    }
    
}