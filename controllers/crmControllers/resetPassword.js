const { User } = require("../../models/user");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
    console.log("whats coming in body", req.body)
    try {
        const { currentPassword, newPassword, confirmPassword, email } = req.body;

        // Check  newPassword and confirmPassword 
        if (newPassword !== confirmPassword) {
            return res.status(400).send(`New password and Confirm password do not match. Try again later!`);
        }

        // get user from the database 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send(`User with desired email is not found`);
        }

        // Check current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).send(`Current password is incorrect.`);
        }

        // Hash the new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { password: newPasswordHash } }, { new: true })
        console.log("updatedUser", updatedUser)
        res.status(200).send(`Password reset successfully.`);
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
}
module.exports = resetPassword