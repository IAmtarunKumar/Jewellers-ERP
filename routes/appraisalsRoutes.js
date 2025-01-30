const express = require("express");
const { Appraisal } = require("../models/appraisals");
const router = express.Router();

router.get('/fetch', async (req, res) => {
    try {
        const appraisals = await Appraisal.find();
        res.json(appraisals);
    } catch (error) {
        res.status(500).send(error);
    }

});

// Add new data
router.post('/update', async (req, res) => {

    const appraisal = new Appraisal(req.body);
    try {
        await appraisal.save();
        res.status(200).send("Appraisal have been added successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;