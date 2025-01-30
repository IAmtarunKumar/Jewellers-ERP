const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    vendorId: { type: String, required: true },
    pincode: { type: String, required: true }

});
const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports.Vendor = Vendor;
