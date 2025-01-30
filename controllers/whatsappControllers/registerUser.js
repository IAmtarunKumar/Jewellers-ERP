const { User } = require("../../models/user");

const registerUser = async (
    sessionId,
    name,
    email,
    mobile,
) => {

    const user = await User.findOne({ sessionId });

    if (!user) {
        const newUser = new User({
            sessionId,
            name,
            email,
            mobile,
        });
        await newUser.save();
    }
};

module.exports = registerUser;

