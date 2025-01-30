const express = require("express");
const { HallMark } = require("../models/hallmark");
const Product = require("../models/product");
const { HallMarkCenter } = require("../models/hallmarkCenter");

const router = express.Router();

// router.get("/", getAllProducts);  //veer code

router.get("/fetch", async (req, res) => {
    try {
        const hallmarks = await HallMark.find();
        res.json(hallmarks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new product
router.post("/update", async (req, res) => {
    console.log("whats coming in body", req.body);
    const { productId, hallmarkCenterId, purity, weight, hallmarkDate } =
        req.body;
    try {
        const product = await Product.findOne({ productId });
        if (!product) return res.status(400).send("Enter a valid product ID");
        console.log("we are heree");
        const hallmarkCenter = await HallMarkCenter.findOne({ hallmarkCenterId });
        console.log("hallmark center", hallmarkCenter);
        if (!hallmarkCenter)
            return res.status(400).send("Enter a valid Hallmark Center ID");
        const foundHallmark = await HallMark.findOne({ productId });
        if (foundHallmark)
            return res.status(400).send("HallMark on the same product already exist! try again with a different product");
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const hallmark = new HallMark({
            productId,
            hallmarkId: randomNum,
            hallmarkDate,
            hallmarkCenterId,
            purity,
            weight,
        });
        await hallmark.save();
        res.status(200).send("Hallmark has been saved successfully");
    } catch (error) {
        console.log("errormessage", error.message);
        res.status(400).send(error.message);
    }
});

module.exports = router;
