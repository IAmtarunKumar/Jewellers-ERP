//import require dependencies
const twilio = require('twilio');
const dotenv = require("dotenv");
dotenv.config();
//create twilio client to avoid write code multiple times
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//export twilio client
module.exports = twilioClient;