const { User } = require("../../models/user");


const getOneUser = async (req, res) => {
    console.log("checking whatscoming in body", req.body)
    const payload = req.body
    try {
        const user = await User.findOne({ sessionId: payload.sessionId });
        if (!user) return res.status(400).send("No Such user found. Try again later!")
        return res.status(200).send(user);
    } catch (error) {
        console.log("something went wrong", error.message);
        return res.status(500).send(`internal server error - ${error.message}`);
    }
};
module.exports = getOneUser;