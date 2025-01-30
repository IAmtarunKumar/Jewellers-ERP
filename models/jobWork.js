const mongoose = require("mongoose");

const jobWorkSchema = new mongoose.Schema({
    rawMaterialName: { type: String, required: true },
    rawMaterialType: { type: String, required: true },
    vendorName: { type: String, required: true },
    givenDate: { type: String, required: true },
    givenPurity: { type: String, required: true },
    givenWeight: { type: String, required: true },
    returnDate: { type: String, required: false },
    returnPurity: { type: String, required: false },
    returnWeight: { type: String, required: false },
    priceDecided: { type: String, required: true },
    description: { type: String, required: false },
    pictureName1: { type: String, required: false },
    pictureName2: { type: String, required: false },
    jobWorkId: { type: String, required: false }
});

const JobWork = mongoose.model("JobWork", jobWorkSchema);
module.exports.JobWork = JobWork;
