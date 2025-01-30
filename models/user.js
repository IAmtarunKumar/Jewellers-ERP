const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  expenseId: { type: String, required: false },
  approvalStatus: { type: String, required: false },
  date: { type: String, required: false },
});
const personSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const salesSchema = new mongoose.Schema({
  companyName: String,
  email: String,
  phone: String,
  companyType: String,
  keywords: [String],
  description: String,
  status: String,
  acceptedBy: personSchema,
  rejectedBy: personSchema,
});
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: false },
});
const assignBySchema = new mongoose.Schema({
  assignedTo: { type: String, required: false },
  assignedToName: { type: String, required: false },
  title: { type: String, required: false },
  deadline: { type: String, required: false },
  status: { type: String, required: false },
  taskId: { type: Number, required: false },
  inProgressDate: { type: String, required: false },
  completedDate: { type: String, required: false },
});
const assignToSchema = new mongoose.Schema({
  assignedBy: { type: String, required: false },
  assignedByName: { type: String, required: false },
  title: { type: String, required: false },
  deadline: { type: String, required: false },
  completedDate: { type: String, required: false },
  status: { type: String, required: false },
  taskId: { type: Number, required: false },
  inProgressDate: { type: String, required: false },
  completedDate: { type: String, required: false },
});


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  sessionId: { type: String, required: true },
  continueBlockFlag: { type: Boolean, required: false, default: false },
  continueBlock_top_intent: { type: String, required: false, default: null },
  continueBlock_step: { type: Number, required: false, default: 1 },
  password: { type: String, required: true },
  // designation: { type: String, required: true },
  mobile: { type: String, required: true },
  // gituserName: { type: String, required: false },
  expenses: { type: [expenseSchema], required: false, default: [] },
  authorized: { type: String, required: false },
  // calendarId: { type: String, required: true },
  event: { type: [eventSchema], required: false, default: [] },
  assignedByYou: { type: [assignBySchema], required: false, default: [] },
  assignedToYou: { type: [assignToSchema], required: false, default: [] },
  assignedClients: { type: [salesSchema], required: false, default: [] },
  employeeScore: Number,
  totalLeads: Number,
  inProgessLeads: Number,
  acceptedLeads: Number,
  rejectedLeads: Number,
  address: { type: String, required: false },
  city: { type: String, required: false },
  pincode: { type: Number, required: true },
  country: { type: String, required: false },
  aboutMe: { type: String, required: false },
  // ability: { type: String, required: true },
  organisationName: { type: String, required: true },
  gstNumber: { type: String, required: false },
  designation: { type: String, required: true },
  privileges: { type: [], required: true, default: [] },
  profilePic: { type: String, default: "" },
  // securityString: { type: String, required: true },
});
const VerificationSchema = new mongoose.Schema({
  email: String,
  otp: Number
});
const User = mongoose.model("User", userSchema);
module.exports = { User, Verification: mongoose.model("verification", VerificationSchema), };
