const mongoose = require("mongoose");

const businessHolderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    businessHolderId: { type: String, required: true },
});
const BusinessHolder = mongoose.model("BusinessHolder", businessHolderSchema);
module.exports.BusinessHolder = BusinessHolder;
