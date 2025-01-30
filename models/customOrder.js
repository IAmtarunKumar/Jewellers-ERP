const mongoose = require("mongoose");

const customOrdersSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  // productId: { type: String, required: true },
  orderDate: { type: String, required: true },
  completionDate: { type: String, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
});

const CustomOrders = mongoose.model("CustomOrders", customOrdersSchema);
module.exports.CustomOrders = CustomOrders;
