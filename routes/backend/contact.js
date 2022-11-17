var express = require("express");
var router = express.Router();
const systemConfig = require("./../../configs/system");
const itemModel = require("./../../models/contact"); // patch models item
const ValidateItems = require("./../../validator/contact");
const helperPublish = require("./../../helper-publish/utils");
const paramHelper = require("./../../helper-publish/params");
const { deleteItem } = require("./../../models/contact");
const folderView = "pages/contact/";
const linkIndex = "/" + systemConfig.admin + "/contact/";

/* GET items list. */
router.get("(/status/:status)?", async (req, res, next) => {
	let params = {};
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateItems.validator(req);
	let item = { name: "", status: "novalue", title: "", content: "", email: "" };
	let save = Object.assign(req.body);
	let errorsSave = req.validationErrors();
	params.search = paramHelper.getParam(req.query, "search", "");
	params.currentStatus = paramHelper.getParam(req.params, "status", "all");
	let statusFilter = await helperPublish.createFillterStatus(
		params.currentStatus,
		"contact"
	);
	params.paginaTion = {
		totalItem: 1,
		totalperPage: 5,
		currentPage: 1,
		pageRange: 3,
	};

	params.paginaTion.currentPage = parseInt(
		paramHelper.getParam(req.query, "page", 1)
	);
	await itemModel.countItem(params).then((data) => {
		params.paginaTion.totalItem = data;
		itemModel.listItems(params).then((items) => {
			res.render(`${folderView}/list`, {
				title: "Danh sách item",
				items: items,
				statusFilter: statusFilter,
				params,
				item,
				save,
				errorsSave,
			});
		});
	});
});
/*  change status item. */
router.get("/change-status/:id/:status", async (req, res, next) => {
	let currentStatus = paramHelper.getParam(req.params, "status", "active");
	let id = paramHelper.getParam(req.params, "id", "");
	itemModel.changeStatus(id, currentStatus).then((result) => {
		res.redirect(linkIndex);
	});
});

/*  delete item. */
router.get("/delete/:id", (req, res, next) => {
	let id = paramHelper.getParam(req.params, "id", "");
	itemModel.deleteItem(id).then((result) => {
		res.redirect(linkIndex);
	});
});

/* form item . */
router.get("/form(/:id)?", (req, res, next) => {
	let id = paramHelper.getParam(req.params, "id", "");
	let item = { name: "", ordering: 0, status: "novalue", id: "" };
	let errors = null;
	if (id === "") {
		//add
		res.render(`${folderView}/form`, { pageTitle: "add Items", item, errors });
	} else {
		//edit
		itemModel.getItem(id).then((item) => {
			res.render(`${folderView}/form`, {
				pageTitle: "edit Items",
				item,
				errors,
			});
		});
	}
});

/*  save item. */
router.post("/save", (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	ValidateItems.validator(req);
	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	if (typeof item !== "undefined" && item.id !== "") {
		if (errors) {
			//edit

			res.render(`${folderView}/form`, {
				pageTitle: "edit Items",
				item,
				errors,
			});
		} else {
			console.log("item", item);
			itemModel.saveItem(item, { task: "edit" }).then((result) => {
				res.redirect(linkIndex);
			});
		}
	} else {
		if (errors) {
			// add

			res.render(`${folderView}/form`, {
				pageTitle: "add Items",
				item,
				errors,
			});
		} else {
			itemModel.saveItem(item, { task: "add" }).then(() => {
				res.redirect(linkIndex);
			});
		}
	}
});

module.exports = router;
