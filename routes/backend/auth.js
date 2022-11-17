var express = require("express");
var router = express.Router();
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const systemConfig = require("../../configs/system");
const ValidateLogin = require("../../validator/login");
const folderView = "pages/auth/";
const linkIndex = "/" + systemConfig.admin + "/auth/";
const loginFail = "erp/auth/login";
const userLogin = require("./../../schemas/users");
const usersModel = require("./../../models/users"); // patch models

/* GET logout. */
router.get("/logout", function (req, res, next) {
	req.user = null;
	res.clearCookie("token");
	res.redirect("/erp/auth/login");
});
/* GET login erp. */
router.get("/login", function (req, res, next) {
	let itemLogin = { username: "", password: "" };
	let errors = null;
	res.render(`${folderView}login`, { itemLogin, errors });
});

router.post(
	"/login",
	// passport.authenticate("local", {
	// 	successRedirect: "/erp",
	// 	authInfo: true,
	// 	failureRedirect: "/erp/auth/login",
	// 	failureMessage: true,
	// }),
	function (req, res, next) {
		req.body = JSON.parse(JSON.stringify(req.body));
		ValidateLogin.validator(req);
		let itemLogin = Object.assign(req.body);
		let errors = req.validationErrors();
		console.log(errors);
		if (errors) {
			res.render(`${folderView}login`, { itemLogin, errors });
		} else {
			usersModel.getItemByuserName(req.body.username, null).then((users) => {
				let user = users[0];
				if (!user) {
					console.log("user ko tồn tại");
					res.redirect("/erp/auth/login");
				} else {
					if (req.body.password !== user.password) {
						console.log("sai mật khẫu");
						res.redirect("/erp/auth/login");
					} else {
						console.log("Login ok", req.user);
						console.log("body", req.body);
						res.cookie("token", 123);
						res.redirect("/erp");
					}
				}
			});
		}
		// } else {
		// 	passport.authenticate("local", {
		// 		successRedirect: "/erp",
		// 		failureRedirect: "/erp/auth/login",
		// 		keepSessionInfo: true,
		// 	})(req, res, next);
		// }
		// console.log(itemLogin.userName+"-"+itemLogin.passWord)
	}
);

passport.use(
	new LocalStrategy({ passReqToCallback: true }, function (
		req,
		res,
		username,
		password,
		done
	) {
		usersModel.getItemByuserName(username, null).then((users) => {
			let user = users[0];
			if (!user) {
				console.log("user ko tồn tại");
				return done(null, false);
			} else {
				if (password !== user.password) {
					console.log("sai mật khẫu");
					return done(null, false);
				} else {
					console.log("Login ok", req.user);

					done(null, user);
					return;
				}
			}
		});
	})
);
passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		console.log("cb user", user);
		cb(null, { id: user.id, username: user.username });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		console.log(user);
		return cb(null, user);
	});
});

module.exports = router;
