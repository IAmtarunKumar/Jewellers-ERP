const { User } = require("../../models/user");
const profilePicUpload = async (req, res) => {
    console.log("checking whatscoming in body", req.body)
    const { profilePicName, sessionId } = req.body

    try {
        const user = await User.findOne({ sessionId });
        if (!user) return res.status(400).send("you cannot upload a profile picture to this user. try again with another user!")
        const updatedUser = await User.findOneAndUpdate(
            { sessionId },
            {
                $set: {
                    profilePic: profilePicName,
                },
            },
            { new: true }
        );
        console.log("updated user", updatedUser);
        return res.status(200).send("profile picture has been updated");
    } catch (error) {
        console.log("something went wrong", error.message);
        return res.status(500).send(`internal server error - ${error.message}`);
    }
};
module.exports = profilePicUpload;