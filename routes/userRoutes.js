const express = require("express");
const getAllUsers = require("../controllers/crmControllers/getAllUsers");
const getOneUser = require("../controllers/crmControllers/getOneUser");
const editOneUser = require("../controllers/crmControllers/editApis/editUser");
const addOneUser = require("../controllers/crmControllers/addUser");
const resetPassword = require("../controllers/crmControllers/resetPassword");

const router = express.Router();

router.get("/fetch", getAllUsers);
router.post("/fetchOne", getOneUser)
router.post("/edit", editOneUser)
router.post("/addOne", addOneUser)
router.post("/resetPassword", resetPassword)
module.exports = router;
