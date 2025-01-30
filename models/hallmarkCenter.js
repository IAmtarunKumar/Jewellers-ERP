const mongoose = require("mongoose");

const hallmarkCenterSchema = new mongoose.Schema({
    centerName: { type: String, required: true, },
    contact: { type: String, required: true, },
    address: { type: String, required: true, },
    email: { type: String, required: true, },
    authorizedBy: { type: String, required: true, },
    hallmarkCenterId: { type: String, required: true, },
});

const HallMarkCenter = mongoose.model("HallMarkCenter", hallmarkCenterSchema);
module.exports.HallMarkCenter = HallMarkCenter;
