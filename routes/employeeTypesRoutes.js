const express = require("express");
const { EmployeeModel } = require("../models/employeeTypes");


const router = express.Router();

router.get("/fetch", async (req, res) => {
    try {
        const allEmployeeTypes = await EmployeeModel.find();
        if (!allEmployeeTypes || allEmployeeTypes.length === 0) return res.status(400).send("No employee types was found!")
        res.status(200).send(allEmployeeTypes);
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.post("/add", async (req, res) => {
    const payload = req.body;
    console.log("checking whats coming in body", payload)
    try {
        const employee = new EmployeeModel(payload);
        await employee.save();
        res.status(200).send("Employee type added Successfully");
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.patch("/edit", async (req, res) => {
    const payload = req.body;
    console.log("checking whats coming in body", payload)
    const id = payload.id

    try {
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, payload);
        if (!updatedEmployee) {
            return res.status(400).send(`Employee not found ${error.message}`);
        }
        return res.status(200).json({ msg: "Employee Update successfully" });
    } catch (error) {
        return res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.delete("/delete", async (req, res) => {
    const payload = req.body
    console.log("checking whats coming in body", payload)
    const id = payload.id;
    try {
        const deletedEmployee = await EmployeeModel.findByIdAndRemove(id);
        if (!deletedEmployee) {
            return res.status(400).send(`Employee not found ${error.message}`);
        }
        res.status(200).json({ msg: "Employee Delete successfully" });
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});


module.exports = router;
