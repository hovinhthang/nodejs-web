var express = require("express");
const passport = require("passport");
var router = express.Router();
const ensureLogIn = require("connect-ensure-login");
// const ensureLoggedIn = ensu

/* GET home admin page. */
router.get("/", function (req, res, next) {
	console.log("user", req.cookies.token);
	if (!req.cookies.token) {
		res.redirect("erp/auth/login");
	}
	res.render("pages/erp/index", { title: "Hệ Thống Quản Trị" });
});

module.exports = router;
