const mongoose = require("mongoose");


const tableData = new mongoose.Schema({
  imageURL: { type: String, required: false },
  productName: { type: String, required: false },
  purity: { type: String, required: false },
  rate: { type: String, required: false },
  weight: { type: String, required: false }
});


const repairSchema = new mongoose.Schema({
  address: { type: String, required: false },
  customerName: { type: String, required: false },
  date: { type: String, required: false },
  grandTotal: { type: String, required: false },
  invoceNumber: { type: String, required: false },
  orgName: { type: String, required: false },
  paymentCash: { type: String, required: false },
  pincode: { type: String, required: false },
  returnDate: { type: String, required: false },

  taxCategory: { type: String, required: false },
  totalAdvance: { type: String, required: false },
  totalAmount: { type: String, required: false },
  totalQuantity: { type: String, required: false },
  totalTax: { type: String, required: false },
  
  tableData: [tableData],
});

const Repair = mongoose.model("Repair", repairSchema);
module.exports.Repair = Repair;
