const express = require("express");
const { CustomOrders } = require("../models/customOrder");
const editCustomOrder = require("../controllers/crmControllers/editApis/editCustomOrder");
const router = express.Router();
router.get("/fetch", async (req, res) => {
    try {
        const customOrders = await CustomOrders.find();
        res.json(customOrders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.post("/update", async (req, res) => {
    const orderDetails = new CustomOrders(req.body);
    try {
        await orderDetails.save();
        res.status(200).send("Custom Order added successfully!");
    } catch (error) {
        res.status(400).send(error.message);
    }
});
router.post("/edit", editCustomOrder);
module.exports = router;