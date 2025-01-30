const { User } = require("../../models/user");

async function signUpFlag(req, res) {
    try {
        const usersArray = await User.find({})
        if (!usersArray || usersArray.length === 0) return res.status(400).send("No User Found")

        for (const user of usersArray) {
            if (user.admin === true) {
                // Logic for admin users
                console.log(`${user.username} is an admin.`);

                return res.status(200).send(true);
                // Perform your logic here for admin users
            }
        }
        console.log("no admin is there!")
        return res.status(200).send(false);

    } catch (err) {
        res.status(500).send("server error");
    }
}

module.exports = signUpFlag