const express = require("express");
const signUpFlag = require("../controllers/crmControllers/signUpFlag");
const profilePicUpload = require("../controllers/crmControllers/profilePicUpload");
const partyNames = require("../controllers/crmControllers/chartAccountPartyNames");
const { getInvoiceNumber, postInvoiceNumber } = require("../controllers/crmControllers/getInvoiceNumber");
const gstChooser = require("../controllers/crmControllers/gstChooser");
const { getPurchaseNumber, postPurchaseNumber } = require("../controllers/crmControllers/getPurchaseOrderNumber");


const router = express.Router();

router.get("/signupFlag", signUpFlag);
router.post("/profilePicUpload", profilePicUpload)
router.get("/partyName", partyNames)  //partynames with types for chart of account table 
router.get("/invoiceNumber", getInvoiceNumber)
router.post("/invoiceNumber", postInvoiceNumber)
router.get("/purchaseNumber", getPurchaseNumber)
router.post("/purchaseNumber", postPurchaseNumber)
router.post("/gstChooser", gstChooser) //this is for gstin tax chooser. SGST,CGST / IGST


module.exports = router;
