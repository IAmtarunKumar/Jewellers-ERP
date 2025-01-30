const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    supplierId: { type: String, required: true },
    pincode: { type: String, required: true }

});
const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports.Supplier = Supplier;
