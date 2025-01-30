const express = require("express");
const getAllSuppliers = require("../controllers/crmControllers/getAllSuppliers");
const editSupplier = require("../controllers/crmControllers/editApis/editSupplier");
const { Supplier } = require("../models/supplier");

const router = express.Router();

// router.get("/", getAllSuppliers); //veer code
router.post("/edit", editSupplier);

router.get('/fetch', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new supplier
router.post('/update', async (req, res) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const supplier = new Supplier(req.body);
    supplier.supplierId = randomNum;
    try {
        await supplier.save();
        res.status(200).send("Supplier Added Successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
