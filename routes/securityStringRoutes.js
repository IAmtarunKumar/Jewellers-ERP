const express = require("express")
const router = express.Router()
const { Utility } = require("../models/utilityCollection")

router.get("/:string", async (req, res) => {
    console.log("req.params", req.params)
    const { string } = req.params

    try {
        const securityStringObj = await Utility.findOne({ type: "securityString" })
        // console.log("security string obj", securityStringObj)
        if (securityStringObj.number === string) {
            return res.status(200).send("Authentication successful!")
        } else {
            return res.status(400).send("Authentication Denied!")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router