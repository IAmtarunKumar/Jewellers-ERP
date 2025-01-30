const mongoose = require("mongoose");
const customerBoughtSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    dateBought: { type: String, required: true },
    productQty: { type: String, required: true }
})
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    customerId: { type: String, required: true, },
    customerBought: { type: [customerBoughtSchema], default: [] },
    pincode: { type: String, required: true, }
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports.Customer = Customer;