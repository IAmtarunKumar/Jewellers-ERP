const mongoose = require("mongoose");
// Define SignIn-Out Pair Schema
const signInOutPairSchema = new mongoose.Schema({
    signIn: Date,
    signOut: Date
});

// Define Month Schema
const monthSchema = new mongoose.Schema({
    month: String,
    time: [signInOutPairSchema]
});

// Define Yearly Data Schema
const yearlyDataSchema = new mongoose.Schema({
    year: Number,
    months: [monthSchema]
});

// Define Attendance Schema
const attendanceSchema = new mongoose.Schema({
    yearlyData: [yearlyDataSchema]
});

// Define Primary Employee Schema
const employeeSchema = new mongoose.Schema({
    email: String,
    phoneNo: String,
    signedIn: Boolean,
    attendance: attendanceSchema
});

module.exports = {
    Employee: mongoose.model('Employee', employeeSchema),
}