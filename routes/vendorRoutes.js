const express = require("express");
const getAllVendors = require("../controllers/crmControllers/getAllVendors.js");
const { Vendor } = require("../models/vendor.js");
const editVendor = require("../controllers/crmControllers/editApis/editVendor.js");

const router = express.Router();

router.get("/", getAllVendors);

router.post("/edit", editVendor);

router.get('/fetch', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new vendor
router.post('/update', async (req, res) => {
    const { name, contact, address, pincode } = req.body;
    const vendorFound = await Vendor.findOne({ contact })
    if (vendorFound) res.status(400).send("Vendor with Same Contact already exists!")
    const vendorFound1 = await Vendor.findOne({ name })
    if (vendorFound1) res.status(400).send("Vendor with Same Name already exists!")
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const vendor = new Vendor({ name, contact, pincode, address, vendorId: randomNum });
    try {
        await vendor.save();
        res.status(200).send("vendor has been saved successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
