const express = require("express");
const { Customer } = require("../models/customer");
const editCustomer = require("../controllers/crmControllers/editApis/editCustomer");
const router = express.Router();


router.post("/edit", editCustomer);

router.get('/fetch', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/fetchOne', async (req, res) => {
    console.log("whats coming in body", req.body)
    const { customerId } = req.body
    try {
        const customer = await Customer.findOne({ customerId });
        if (!customer) return res.status(400).send("No customer of desired Id is found!")
        return res.status(200).send(customer);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new customer
router.post('/update', async (req, res) => {
    const { name, contact, address, pincode } = req.body;
    const customerFound = await Customer.findOne({ contact })
    if (customerFound) res.status(400).send("Customer with Same Contact already exists!")
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const customer = new Customer({ pincode, name, contact, address, customerId: randomNum });
    try {
        await customer.save();
        res.status(200).send("customer saved successfully");
    } catch (error) {
        console.log("error", error.message)
        res.status(400).send(error.message);
    }
});

module.exports = router;