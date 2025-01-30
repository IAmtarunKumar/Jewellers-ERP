const express = require("express");
const { BusinessHolder } = require("../models/businessHolder");
const editBusinessHolder = require("../controllers/crmControllers/editApis/editBusinessHolder");
const router = express.Router();


router.post("/edit", editBusinessHolder);

router.get('/fetch', async (req, res) => {
    try {
        const businessHolders = await BusinessHolder.find();
        res.json(businessHolders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new customer
router.post('/update', async (req, res) => {
    const { name, contact, address } = req.body;
    const businessHolderFound = await BusinessHolder.findOne({ contact })
    if (businessHolderFound) res.status(400).send("Business Holder with Same Contact already exists!")
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const businessHolder = new BusinessHolder({ name: name.toLowerCase(), contact, address, businessHolderId: randomNum });
    try {
        await businessHolder.save();
        res.status(200).send("businessHolder saved successfully");
    } catch (error) {
        console.log("error", error.message)
        res.status(400).send(error.message);
    }
});

module.exports = router;