const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();
async function sendMessageToUser(message, userPhoneNumber) {
    const twilioPhoneNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
    const client = new twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    console.log("FROM", twilioPhoneNumber, "TO", userPhoneNumber);
    client.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: `whatsapp:+91${userPhoneNumber}`,
        })
        .then((message) => console.log(`Message sent: ${message.sid}`))
        .catch((error) =>
            console.error(`Failed to send message: ${error.message}`)
        );
}
module.exports = sendMessageToUser;
