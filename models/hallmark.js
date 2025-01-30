const mongoose = require("mongoose");

const hallmarkSchema = new mongoose.Schema({
    hallmarkId: { type: String, required: true },
    productId: { type: String, required: true },
    // purity: { type: String, required: true },
    // weight: { type: String, required: true, }, //no need of purity and weight as it is attached to the product
    hallmarkCenterId: { type: String, required: true, },
    hallmarkDate: { type: String, required: true, },
    hallmarkLogo: { type: String, required: false, },
});

const HallMark = mongoose.model("HallMark", hallmarkSchema);
module.exports.HallMark = HallMark;
