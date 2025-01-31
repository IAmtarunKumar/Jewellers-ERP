const express = require("express");
const { HallMarkCenter } = require("../models/hallmarkCenter");
const editHallmarkCenter = require("../controllers/crmControllers/editApis/editHallmarkCenter");


const router = express.Router();

router.get("/", getAllProducts); 
router.post("/edit", editHallmarkCenter)
router.get('/fetch', async (req, res) => {
    try {
        const hallmarkcenters = await HallMarkCenter.find();
        res.json(hallmarkcenters);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new product
router.post('/update', async (req, res) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const hallmarkCenter = new HallMarkCenter(req.body);
    hallmarkCenter.hallmarkCenterId = randomNum;
    try {
        await hallmarkCenter.save();
        res.status(200).send(hallmarkCenter);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
