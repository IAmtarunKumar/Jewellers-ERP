const mongoose = require("mongoose")

// Define a custom validation function
function validateType(value) {
    return value === "Raw materials" || value === "Job works";
}

//schema
const expenseSchema = mongoose.Schema({  //this schema is for chart of account purposes and not anything else
    type: {
        type: String, required: true, validate: {
            validator: validateType, message: "Type must be 'Raw Material' or 'Job Work'",
        },
    },
    date: { type: String, required: true },
    debit: { type: String, required: false },
    credit: { type: String, required: false },
    balance: { type: String, required: true },
    receivedBy: { type: String, required: false },
    givenTo: { type: String, required: false },
    partyName: { type: String, required: true },
    reference: { type: String, required: true },
    description: { type: String, required: false },
    picture: { type: String, required: false },
    picture2: { type: String, required: false },
});

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = { Expense }