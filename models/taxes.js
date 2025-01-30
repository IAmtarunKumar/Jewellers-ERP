const mongoose = require("mongoose");

const taxesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    percentage: { type: String, required: true },

});

const Taxes = mongoose.model("Taxes", taxesSchema);
module.exports = { Taxes }
