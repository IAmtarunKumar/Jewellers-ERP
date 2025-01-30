const mongoose = require("mongoose")

// Define a custom validation function
function validateType(value) {
    return value === "Cash in hand" || value === "Bank account" || value === "Properties" || value === "Plant and machineries";
}


//schema
const assetSchema = mongoose.Schema({  //this schema is for chart of account purposes and not anything else
    type: {
        type: String, required: true, validate: {
            validator: validateType, message: "Type must be 'Cash in hand' or 'Properties' or 'Bank account' or 'Plant and machineries'",
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

const Asset = mongoose.model("Asset", assetSchema)

module.exports = { Asset }