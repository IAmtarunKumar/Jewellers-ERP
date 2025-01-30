const express = require("express");
const multer = require("multer");
const streamFile = require("../controllers/crmControllers/uploadCsv");


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/upload", upload.array("file", 5), async (req, res) => {
    const fileinfo = req.files;
    console.log("fileinfo", fileinfo);
    const { filetype } = req.body;
    console.log("filetype in body", filetype);
    await streamFile(fileinfo, filetype, res);
});

module.exports = router;
