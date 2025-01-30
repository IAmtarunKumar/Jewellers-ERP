const mongoose = require("mongoose")

// Define a custom validation function
function validateType(value) {
    return value === "Duty and taxes" || value === "Creditors" || value === "Loans";
}


//schema
const liabilitySchema = mongoose.Schema({  //this schema is for chart of account purposes and not anything else
    type: {
        type: String, required: true, validate: {
            validator: validateType, message: "Type must be 'Duty and Taxes' or 'Creditor' or 'Loans'",
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

const Liability = mongoose.model("Liability", liabilitySchema)

module.exports = { Liability }