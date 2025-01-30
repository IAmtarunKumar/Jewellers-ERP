const mongoose = require("mongoose");

const appraisalSchema = new mongoose.Schema({
    appraisedValue: { type: String, required: true },
    appraisalDate: { type: String, required: true },
    appraiserEmailId: { type: String, required: true, }, //email id of the employee who is doing appraisal
    productId: { type: String, required: true },
    customerId: { type: String, required: true },
});

const Appraisal = mongoose.model("Appraisal", appraisalSchema);
module.exports.Appraisal = Appraisal;
