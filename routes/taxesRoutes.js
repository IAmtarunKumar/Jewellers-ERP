const express = require("express");
const { Taxes } = require("../models/taxes");


const router = express.Router()




// Get all taxes
router.get("/", async (req, res) => {
    try {
        const alltaxandcharges = await Taxes.find();
        if (!alltaxandcharges || alltaxandcharges.length === 0) return res.status(400).send("No Taxes were found!")
        return res.status(200).send(alltaxandcharges);
    } catch (error) {
        return res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Create an taxes
router.post("/", async (req, res) => {
    console.log("whats coming in body", req.body)
    const { taxBracket } = req.body.tax;
    console.log("taxBracket", taxBracket)
    try {
        const newtaxandcharges = new Taxes({ name: `${taxBracket}%`, percentage: taxBracket });
        await newtaxandcharges.save();
        return res.status(200).send("Tax and charges Posted Successfully");
    } catch (error) {
        return res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Update taxes data
router.patch("/", async (req, res) => {
    const payload = req.body;
    const id = req.body.id;

    try {
        const updatetaxandcharges = await Taxes.findByIdAndUpdate(id, payload);
        if (!updatetaxandcharges) {
            return res.status(400).send(`Tax and charges not found `);
        }
        res.status(200).send("Tax and charges Update successfully");
    } catch (error) {
        return res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Delete an taxes
router.delete("/", async (req, res) => {
    const id = req.body.id;

    try {
        const deletedtaxandcharges = await Taxes.findByIdAndRemove(id);
        if (!deletedtaxandcharges) {
            return res.status(400).send(`Tax and charges not found `);
        }
        res.status(200).send("Tax and charges Delete successfully");
    } catch (error) {

        return res.status(500).send(`Internal Server Error${error.message}`);
    }
});




module.exports = router

