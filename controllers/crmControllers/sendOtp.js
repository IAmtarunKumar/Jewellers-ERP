const nodemailer = require("nodemailer");
const { Verification, User } = require("../../models/user");

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "verify@sarvvid-ai.com",
        pass: "OcplSarvvid555@",
    },
});
async function sendOtp(req, res) {
    console.log("log whats coming in the body", req.body)
    const randomNumber =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const otp = randomNumber.toString();
    let email = req.body.email;
    let findUser = await User.findOne({ email });
    if (findUser) {
        return res.status(400).json({ message: "Email Already Registered" });
    }
    let userOtp = await Verification.findOne({ email });
    if (userOtp) {
        userOtp.otp = otp;
        await userOtp.save();
    } else {
        userOtp = new Verification({ email, otp });
        await userOtp.save();
    }
    // Send the OTP to user's email (Placeholder for your logic)
    // TODO: Add your send email logic here
    //before sending the token we want to send the email to nodemailer and send the 6 digit otp as well

    const mailOptions = {
        from: "verify@sarvvid-ai.com",
        to: req.body.email,
        subject: "OTP Verification",
        text: `Hello,\n\. Please Enter the given OTP :\n\n${randomNumber}`,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log(
        "we are after sending the email to the user and the response is - ",
        response
    );
    if (response.messageId) {
        res.status(200).send("OTP Sent To Email. Please Verify it."); //dont modify this statement because frontend sweetalert works on its basis.
    } else {
        console.log("email cannot be sent for OTP and we cant proceed further");
        res.status(500).send("internal Server Error. Please try again later.");
    }
}

module.exports = sendOtp