const express = require("express");
const { Sales } = require("../models/sales");
const addSale = require("../controllers/crmControllers/addASale");


const router = express.Router();

// router.get("/", getAllProducts);  //veer code
router.post("/add", addSale)
router.get('/fetch', async (req, res) => {
    try {
        const sales = await Sales.find();
        res.json(sales);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;
