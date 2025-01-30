const { Verification } = require("../../models/user");
async function verifyOtp(req, res) {
    console.log("log whats coming in the body", req.body)
    try {
        const { email, otp } = req.body;
        // Find the email in the database
        const userOtp = await Verification.findOne({ email });
        // If user's email isn't found or the OTP doesn't match
        if (!userOtp || userOtp.otp != otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        // If everything's fine
        res.status(200).send("OTP Verified");
    } catch (err) {
        res.status(500).send("server error");
    }
}

module.exports = verifyOtp