const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    productId: { type: String, required: true },
    saleDate: { type: String, required: true },
    quantity: { type: String, default: "1" }
});

const Sales = mongoose.model("Sales", salesSchema);
module.exports.Sales = Sales;
