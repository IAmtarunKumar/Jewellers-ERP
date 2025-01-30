const mongoose = require("mongoose");

//employee schema

const employeeTypesSchema = mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

//employee model

const EmployeeModel = mongoose.model("EmployeeType", employeeTypesSchema);

module.exports = { EmployeeModel };
