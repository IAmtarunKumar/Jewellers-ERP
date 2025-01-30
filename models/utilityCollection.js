const mongoose = require("mongoose");

const utilityCollectionSchema = new mongoose.Schema({ //it can store any data required for running application at some point for example it is storing the value of last invoice number and last purchase order number as fornow.
    type: { type: String, required: true },
    number: { type: String, required: true }
});
const Utility = mongoose.model("Utility", utilityCollectionSchema);
module.exports.Utility = Utility;
