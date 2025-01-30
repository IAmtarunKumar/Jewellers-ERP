const mongoose = require("mongoose")

// Define a custom validation function
function validateType(value) {
    return value === "Sales" || value === "Repairs";
}


//schema
const incomeSchema = mongoose.Schema({  //this schema is for chart of account purposes and not anything else
    type: {
        type: String, required: true, validate: {
            validator: validateType, message: "Type must be 'Sales' or 'Repair' ",
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
    picture: { type: String, required: false }
});

const Income = mongoose.model("Income", incomeSchema)

module.exports = { Income }