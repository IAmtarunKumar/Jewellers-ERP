const mongoose = require("mongoose");

function validateType(value) {
    return value === "Supplier" || value === "Vendor";
}
const rawMaterialEntrySchema = new mongoose.Schema({
    description: { type: String, required: false },
    price: { type: String, required: true },
    weight: { type: String, required: false },
    supplierId: { type: String, required: false },
    vendorId: { type: String, required: false },
    date: { type: String, required: true },
    type: {
        type: String, required: true, validate: {
            validator: validateType, message: "Type must be 'Supplier' or 'Vendor'",
        },
    },
    picture: { type: String, required: true },
})
const rawMaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    initialWeight: { type: String, required: true },
    currentWeight: { type: String, required: true },
    initialStockDate: { type: String, required: true },
    lastStockDate: { type: String, required: true },
    lastBoughtPrice: { type: String, required: true },
    rawMaterialEntryArray: [rawMaterialEntrySchema]
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
module.exports.RawMaterial = RawMaterial;
